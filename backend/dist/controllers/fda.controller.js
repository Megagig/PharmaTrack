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
exports.FDAController = void 0;
const fda_service_1 = require("../services/fda.service");
const fdaService = new fda_service_1.FDAService();
class FDAController {
    /**
     * Get medications from FDA API
     * @param req Request object
     * @param res Response object
     */
    getMedications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get limit from query params or use default
                const limit = req.query.limit ? parseInt(req.query.limit) : 100;
                const medications = yield fdaService.getMedications(limit);
                res.status(200).json(medications);
            }
            catch (error) {
                console.error('Error in getMedications controller:', error);
                res.status(500).json({ message: error.message || 'Failed to fetch medications' });
            }
        });
    }
    /**
     * Get common ailments
     * @param req Request object
     * @param res Response object
     */
    getAilments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ailments = yield fdaService.getAilments();
                res.status(200).json(ailments);
            }
            catch (error) {
                console.error('Error in getAilments controller:', error);
                res.status(500).json({ message: error.message || 'Failed to fetch ailments' });
            }
        });
    }
}
exports.FDAController = FDAController;
