"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fda_controller_1 = require("../controllers/fda.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const fdaController = new fda_controller_1.FDAController();
// Bind controller methods to ensure correct 'this' context
const getMedications = fdaController.getMedications.bind(fdaController);
const getAilments = fdaController.getAilments.bind(fdaController);
// Get medications (authenticated users only)
router.get('/medications', auth_middleware_1.authenticate, getMedications);
// Get ailments (authenticated users only)
router.get('/ailments', auth_middleware_1.authenticate, getAilments);
exports.default = router;
