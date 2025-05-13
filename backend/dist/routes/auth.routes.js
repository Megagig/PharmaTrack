"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const types_1 = require("../types");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
// Register a new user
router.post('/register', authController.register);
// Register a new pharmacy with user
router.post('/register-pharmacy', authController.registerPharmacy);
// Login
router.post('/login', authController.login);
// Get current user
router.get('/me', auth_middleware_1.authenticate, authController.getCurrentUser);
// Change password
router.post('/change-password', auth_middleware_1.authenticate, authController.changePassword);
// Promote user to executive (admin only)
router.post('/promote-to-executive', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)([types_1.UserRole.ADMIN]), authController.promoteToExecutive);
exports.default = router;
