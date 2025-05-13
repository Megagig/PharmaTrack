"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_1 = require("../server");
const types_1 = require("../types");
class AuthService {
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, role, pharmacyId } = data;
            // Check if user already exists
            const existingUser = yield server_1.prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                throw new Error('User with this email already exists');
            }
            // Hash password
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            // Create new user
            const user = yield server_1.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role,
                    pharmacyId,
                },
            });
            // Generate JWT token
            const token = this.generateToken({
                id: user.id,
                email: user.email,
                role: user.role,
                pharmacyId: user.pharmacyId || undefined,
            });
            return {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    pharmacyId: user.pharmacyId,
                },
                token,
            };
        });
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = data;
            try {
                // Only log in development environment
                if (process.env.NODE_ENV === 'development') {
                    console.log('Login attempt for email:', email);
                }
                // Validate input
                if (!email || !password) {
                    throw new Error('Email and password are required');
                }
                // Find user by email
                const user = yield server_1.prisma.user.findUnique({
                    where: { email },
                    include: {
                        pharmacy: true,
                    },
                });
                // Check if user exists
                if (!user) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('User not found with email:', email);
                    }
                    throw new Error('Invalid email or password');
                }
                // Verify password (minimal logging)
                const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('Invalid password for user:', email);
                    }
                    throw new Error('Invalid email or password');
                }
                // Generate JWT token
                const token = this.generateToken({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    pharmacyId: user.pharmacyId || undefined,
                });
                // Return user data and token with pharmacy information if available
                return {
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        pharmacyId: user.pharmacyId,
                        pharmacy: user.pharmacy || null,
                    },
                    token,
                };
            }
            catch (error) {
                // Only log detailed errors in development
                if (process.env.NODE_ENV === 'development') {
                    console.error('Login error:', error);
                }
                throw error;
            }
        });
    }
    registerPharmacy(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, role, pharmacy } = data;
            // Check if user already exists
            const existingUser = yield server_1.prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                throw new Error('User with this email already exists');
            }
            // Check if pharmacy with the same license number exists
            const existingPharmacy = yield server_1.prisma.pharmacy.findUnique({
                where: { pcnLicenseNumber: pharmacy.pcnLicenseNumber },
            });
            if (existingPharmacy) {
                throw new Error('Pharmacy with this license number already exists');
            }
            // Hash password
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            // Create pharmacy and user in a transaction
            const result = yield server_1.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Create pharmacy
                const newPharmacy = yield tx.pharmacy.create({
                    data: {
                        name: pharmacy.name,
                        pharmacistInCharge: pharmacy.pharmacistInCharge,
                        pcnLicenseNumber: pharmacy.pcnLicenseNumber,
                        phoneNumber: pharmacy.phoneNumber,
                        email: pharmacy.email,
                        address: pharmacy.address,
                        ward: pharmacy.ward,
                        lga: pharmacy.lga,
                    },
                });
                // Create user
                const user = yield tx.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        role,
                        pharmacyId: newPharmacy.id,
                    },
                });
                return { user, pharmacy: newPharmacy };
            }));
            // Generate JWT token
            const token = this.generateToken({
                id: result.user.id,
                email: result.user.email,
                role: result.user.role,
                pharmacyId: result.user.pharmacyId || undefined,
            });
            return {
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    role: result.user.role,
                    pharmacyId: result.user.pharmacyId,
                },
                token,
            };
        });
    }
    getCurrentUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield server_1.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    pharmacyId: true,
                    pharmacy: {
                        select: {
                            id: true,
                            name: true,
                            pharmacistInCharge: true,
                            pcnLicenseNumber: true,
                            phoneNumber: true,
                            email: true,
                            address: true,
                            ward: true,
                            lga: true,
                        },
                    },
                },
            });
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        });
    }
    changePassword(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentPassword, newPassword } = data;
            // Find user
            const user = yield server_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new Error('User not found');
            }
            // Verify current password
            const isPasswordValid = yield bcrypt_1.default.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                throw new Error('Current password is incorrect');
            }
            // Hash new password
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
            // Update password
            yield server_1.prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword },
            });
            return true;
        });
    }
    promoteUserToExecutive(adminId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify that the requester is an admin
            const admin = yield server_1.prisma.user.findUnique({
                where: { id: adminId },
            });
            if (!admin || admin.role !== types_1.UserRole.ADMIN) {
                throw new Error('Only administrators can promote users');
            }
            // Find the user to promote
            const userToPromote = yield server_1.prisma.user.findUnique({
                where: { id: data.userId },
            });
            if (!userToPromote) {
                throw new Error('User not found');
            }
            if (userToPromote.role === types_1.UserRole.EXECUTIVE) {
                throw new Error('User is already an executive');
            }
            if (userToPromote.role === types_1.UserRole.ADMIN) {
                throw new Error('Cannot change role of an administrator');
            }
            // Update the user's role to EXECUTIVE
            const updatedUser = yield server_1.prisma.user.update({
                where: { id: data.userId },
                data: { role: types_1.UserRole.EXECUTIVE },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    pharmacyId: true,
                },
            });
            return updatedUser;
        });
    }
    generateToken(payload) {
        const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
        const secret = process.env.JWT_SECRET || 'default-secret-key';
        // Using a more explicit approach to avoid TypeScript errors
        return jsonwebtoken_1.default.sign(payload, secret, {
            expiresIn,
        });
    }
}
exports.AuthService = AuthService;
