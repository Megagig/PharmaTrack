import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../server';
import {
  JwtPayload,
  LoginRequest,
  RegisterRequest,
  PharmacyRegisterRequest,
  ChangePasswordRequest,
  UserRole,
  PromoteUserRequest,
} from '../types';

export class AuthService {
  async register(data: RegisterRequest) {
    const { email, password, role, pharmacyId } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
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
      role: user.role as UserRole,
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
  }

  async login(data: LoginRequest) {
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
      const user = await prisma.user.findUnique({
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
      const isPasswordValid = await bcrypt.compare(password, user.password);

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
        role: user.role as UserRole,
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
    } catch (error) {
      // Only log detailed errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Login error:', error);
      }
      throw error;
    }
  }

  async registerPharmacy(data: PharmacyRegisterRequest) {
    const { email, password, role, pharmacy } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Check if pharmacy with the same license number exists
    const existingPharmacy = await prisma.pharmacy.findUnique({
      where: { pcnLicenseNumber: pharmacy.pcnLicenseNumber },
    });

    if (existingPharmacy) {
      throw new Error('Pharmacy with this license number already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create pharmacy and user in a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Create pharmacy
      const newPharmacy = await tx.pharmacy.create({
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
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          pharmacyId: newPharmacy.id,
        },
      });

      return { user, pharmacy: newPharmacy };
    });

    // Generate JWT token
    const token = this.generateToken({
      id: result.user.id,
      email: result.user.email,
      role: result.user.role as UserRole,
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
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
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
  }

  async changePassword(userId: string, data: ChangePasswordRequest) {
    const { currentPassword, newPassword } = data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return true;
  }

  async promoteUserToExecutive(adminId: string, data: PromoteUserRequest) {
    // Verify that the requester is an admin
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new Error('Only administrators can promote users');
    }

    // Find the user to promote
    const userToPromote = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!userToPromote) {
      throw new Error('User not found');
    }

    if (userToPromote.role === UserRole.EXECUTIVE) {
      throw new Error('User is already an executive');
    }

    if (userToPromote.role === UserRole.ADMIN) {
      throw new Error('Cannot change role of an administrator');
    }

    // Update the user's role to EXECUTIVE
    const updatedUser = await prisma.user.update({
      where: { id: data.userId },
      data: { role: UserRole.EXECUTIVE },
      select: {
        id: true,
        email: true,
        role: true,
        pharmacyId: true,
      },
    });

    return updatedUser;
  }

  private generateToken(payload: JwtPayload): string {
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    const secret = process.env.JWT_SECRET || 'default-secret-key';

    // Using a more explicit approach to avoid TypeScript errors
    return jwt.sign(payload as object, secret, {
      expiresIn,
    } as jwt.SignOptions);
  }
}
