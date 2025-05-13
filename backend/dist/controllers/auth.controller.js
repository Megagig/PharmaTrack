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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const authService = new auth_service_1.AuthService();
class AuthController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const result = yield authService.register(data);
                res.status(201).json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    registerPharmacy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const result = yield authService.registerPharmacy(data);
                res.status(201).json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate request body
                const { email, password } = req.body;
                if (!email || !password) {
                    res.status(400).json({ message: 'Email and password are required' });
                    return;
                }
                // Attempt login
                const data = { email, password };
                const result = yield authService.login(data);
                // Return user data and token
                res.status(200).json(result);
            }
            catch (error) {
                // Return appropriate error response
                res.status(401).json({
                    message: error.message || 'Authentication failed',
                    success: false,
                });
            }
        });
    }
    getCurrentUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const user = yield authService.getCurrentUser(userId);
                res.status(200).json(user);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const data = req.body;
                yield authService.changePassword(userId, data);
                res.status(200).json({ message: 'Password updated successfully' });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    promoteToExecutive(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!adminId) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const data = req.body;
                if (!data.userId) {
                    res.status(400).json({ message: 'User ID is required' });
                    return;
                }
                const result = yield authService.promoteUserToExecutive(adminId, data);
                res.status(200).json({
                    message: 'User promoted to executive successfully',
                    user: result
                });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
}
exports.AuthController = AuthController;
