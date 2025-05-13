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
exports.PharmacyService = void 0;
const server_1 = require("../server");
class PharmacyService {
    createPharmacy(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if pharmacy with the same license number already exists
            const existingPharmacy = yield server_1.prisma.pharmacy.findUnique({
                where: { pcnLicenseNumber: data.pcnLicenseNumber }
            });
            if (existingPharmacy) {
                throw new Error('Pharmacy with this PCN License Number already exists');
            }
            // Create new pharmacy
            const pharmacy = yield server_1.prisma.pharmacy.create({
                data
            });
            return pharmacy;
        });
    }
    getPharmacyById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const pharmacy = yield server_1.prisma.pharmacy.findUnique({
                where: { id }
            });
            if (!pharmacy) {
                throw new Error('Pharmacy not found');
            }
            return pharmacy;
        });
    }
    getAllPharmacies() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield server_1.prisma.pharmacy.findMany({
                orderBy: { name: 'asc' }
            });
        });
    }
    updatePharmacy(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if pharmacy exists
            const existingPharmacy = yield server_1.prisma.pharmacy.findUnique({
                where: { id }
            });
            if (!existingPharmacy) {
                throw new Error('Pharmacy not found');
            }
            // If license number is being updated, check if it's already in use
            if (data.pcnLicenseNumber && data.pcnLicenseNumber !== existingPharmacy.pcnLicenseNumber) {
                const pharmacyWithLicense = yield server_1.prisma.pharmacy.findUnique({
                    where: { pcnLicenseNumber: data.pcnLicenseNumber }
                });
                if (pharmacyWithLicense) {
                    throw new Error('Pharmacy with this PCN License Number already exists');
                }
            }
            // Update pharmacy
            const updatedPharmacy = yield server_1.prisma.pharmacy.update({
                where: { id },
                data
            });
            return updatedPharmacy;
        });
    }
    deletePharmacy(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if pharmacy exists
            const existingPharmacy = yield server_1.prisma.pharmacy.findUnique({
                where: { id }
            });
            if (!existingPharmacy) {
                throw new Error('Pharmacy not found');
            }
            // Delete pharmacy
            yield server_1.prisma.pharmacy.delete({
                where: { id }
            });
            return { message: 'Pharmacy deleted successfully' };
        });
    }
    getPharmaciesByLGA(lga) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield server_1.prisma.pharmacy.findMany({
                where: { lga },
                orderBy: { name: 'asc' }
            });
        });
    }
    getPharmaciesByWard(ward) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield server_1.prisma.pharmacy.findMany({
                where: { ward },
                orderBy: { name: 'asc' }
            });
        });
    }
}
exports.PharmacyService = PharmacyService;
