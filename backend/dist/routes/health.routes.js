"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_controller_1 = require("../controllers/health.controller");
const router = (0, express_1.Router)();
const healthController = new health_controller_1.HealthController();
// Bind controller methods to ensure correct 'this' context
const checkHealth = healthController.checkHealth.bind(healthController);
// Health check endpoint (public)
router.get('/', checkHealth);
exports.default = router;
