"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pharmacy_controller_1 = require("../controllers/pharmacy.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const types_1 = require("../types");
const router = (0, express_1.Router)();
const pharmacyController = new pharmacy_controller_1.PharmacyController();
// Bind controller methods to ensure correct 'this' context
const createPharmacy = pharmacyController.createPharmacy.bind(pharmacyController);
const getAllPharmacies = pharmacyController.getAllPharmacies.bind(pharmacyController);
const getPharmacyById = pharmacyController.getPharmacyById.bind(pharmacyController);
const updatePharmacy = pharmacyController.updatePharmacy.bind(pharmacyController);
const deletePharmacy = pharmacyController.deletePharmacy.bind(pharmacyController);
const getPharmaciesByLGA = pharmacyController.getPharmaciesByLGA.bind(pharmacyController);
const getPharmaciesByWard = pharmacyController.getPharmaciesByWard.bind(pharmacyController);
// Create a new pharmacy (only executives and admins)
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)([types_1.UserRole.EXECUTIVE, types_1.UserRole.ADMIN]), createPharmacy);
// Get all pharmacies (only executives and admins)
router.get('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)([types_1.UserRole.EXECUTIVE, types_1.UserRole.ADMIN]), getAllPharmacies);
// Get pharmacies by LGA (only executives and admins)
router.get('/lga/:lga', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)([types_1.UserRole.EXECUTIVE, types_1.UserRole.ADMIN]), getPharmaciesByLGA);
// Get pharmacies by ward (only executives and admins)
router.get('/ward/:ward', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)([types_1.UserRole.EXECUTIVE, types_1.UserRole.ADMIN]), getPharmaciesByWard);
// Get pharmacy by ID (all authenticated users)
router.get('/:id', auth_middleware_1.authenticate, getPharmacyById);
// Update pharmacy (only executives and admins)
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)([types_1.UserRole.EXECUTIVE, types_1.UserRole.ADMIN]), updatePharmacy);
// Delete pharmacy (only admins)
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)([types_1.UserRole.ADMIN]), deletePharmacy);
exports.default = router;
