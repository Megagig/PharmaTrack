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
exports.PharmacyController = void 0;
const pharmacy_service_1 = require("../services/pharmacy.service");
const pharmacyService = new pharmacy_service_1.PharmacyService();
class PharmacyController {
    createPharmacy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const result = yield pharmacyService.createPharmacy(data);
                res.status(201).json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    getPharmacyById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield pharmacyService.getPharmacyById(id);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
    getAllPharmacies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield pharmacyService.getAllPharmacies();
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    updatePharmacy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const data = req.body;
                const result = yield pharmacyService.updatePharmacy(id, data);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    deletePharmacy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield pharmacyService.deletePharmacy(id);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
    getPharmaciesByLGA(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { lga } = req.params;
                const result = yield pharmacyService.getPharmaciesByLGA(lga);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    getPharmaciesByWard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { ward } = req.params;
                const result = yield pharmacyService.getPharmaciesByWard(ward);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.PharmacyController = PharmacyController;
