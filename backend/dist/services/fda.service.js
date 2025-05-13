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
exports.FDAService = void 0;
const axios_1 = __importDefault(require("axios"));
const server_1 = require("../server");
// Cache for medications and ailments to avoid excessive API calls
let medicationsCache = [];
let ailmentsCache = [];
let lastMedicationsFetch = 0;
let lastAilmentsFetch = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
class FDAService {
    /**
     * Fetch medications from the FDA API
     * @param limit Number of medications to fetch
     * @returns Array of medication names
     */
    getMedications() {
        return __awaiter(this, arguments, void 0, function* (limit = 100) {
            try {
                // Check if cache is valid
                const currentTime = Date.now();
                if (medicationsCache.length > 0 &&
                    currentTime - lastMedicationsFetch < CACHE_TTL) {
                    console.log('Using cached medications data');
                    return medicationsCache;
                }
                console.log('Fetching medications from FDA API...');
                // Fetch from FDA API
                const response = yield axios_1.default.get(`https://api.fda.gov/drug/drugsfda.json?limit=${limit}`);
                // Extract unique medication names from the response
                const medications = new Set();
                response.data.results.forEach((drug) => {
                    var _a;
                    (_a = drug.products) === null || _a === void 0 ? void 0 : _a.forEach((product) => {
                        var _a;
                        if (product.brand_name) {
                            medications.add(product.brand_name);
                        }
                        (_a = product.active_ingredients) === null || _a === void 0 ? void 0 : _a.forEach((ingredient) => {
                            if (ingredient.name) {
                                medications.add(ingredient.name);
                            }
                        });
                    });
                });
                // Convert Set to Array and sort alphabetically
                medicationsCache = Array.from(medications).sort();
                lastMedicationsFetch = currentTime;
                console.log(`Fetched ${medicationsCache.length} medications from FDA API`);
                return medicationsCache;
            }
            catch (error) {
                console.error('Error fetching medications from FDA API:', error);
                // If API call fails, try to get medications from previous reports
                try {
                    console.log('Attempting to get medications from previous reports...');
                    const reports = yield server_1.prisma.report.findMany({
                        select: {
                            topMedications: true,
                        },
                    });
                    const medications = new Set();
                    reports.forEach((report) => {
                        report.topMedications.forEach((med) => medications.add(med));
                    });
                    // If we have medications from reports, use those
                    if (medications.size > 0) {
                        medicationsCache = Array.from(medications).sort();
                        lastMedicationsFetch = Date.now();
                        console.log(`Using ${medicationsCache.length} medications from previous reports`);
                        return medicationsCache;
                    }
                }
                catch (dbError) {
                    console.error('Error fetching medications from database:', dbError);
                }
                // If all else fails, return default medications
                return [
                    'Paracetamol',
                    'Amoxicillin',
                    'Ibuprofen',
                    'Artemether/Lumefantrine',
                    'Metformin',
                    'Amlodipine',
                    'Lisinopril',
                    'Omeprazole',
                    'Ciprofloxacin',
                    'Metronidazole',
                ];
            }
        });
    }
    /**
     * Fetch common ailments
     * Since FDA API doesn't directly provide ailments, we'll use a combination of
     * approaches including fetching from previous reports and a predefined list
     * @returns Array of common ailment names
     */
    getAilments() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if cache is valid
                const currentTime = Date.now();
                if (ailmentsCache.length > 0 &&
                    currentTime - lastAilmentsFetch < CACHE_TTL) {
                    console.log('Using cached ailments data');
                    return ailmentsCache;
                }
                // Try to get ailments from previous reports
                console.log('Attempting to get ailments from previous reports...');
                const reports = yield server_1.prisma.report.findMany({
                    select: {
                        commonAilments: true,
                    },
                });
                const ailments = new Set();
                reports.forEach((report) => {
                    report.commonAilments.forEach((ailment) => ailments.add(ailment));
                });
                // If we have ailments from reports, use those
                if (ailments.size > 0) {
                    ailmentsCache = Array.from(ailments).sort();
                    lastAilmentsFetch = currentTime;
                    console.log(`Using ${ailmentsCache.length} ailments from previous reports`);
                    return ailmentsCache;
                }
                // If no ailments found in reports, return default list
                ailmentsCache = [
                    'Malaria',
                    'Typhoid',
                    'Common Cold',
                    'Hypertension',
                    'Diabetes',
                    'Peptic Ulcer',
                    'Urinary Tract Infection',
                    'Respiratory Infection',
                    'Diarrhea',
                    'Skin Infection',
                    'Asthma',
                    'Arthritis',
                    'Pneumonia',
                    'Tuberculosis',
                    'HIV/AIDS',
                    'Hepatitis',
                    'Anemia',
                    'Depression',
                    'Anxiety',
                    'Insomnia',
                ];
                lastAilmentsFetch = currentTime;
                return ailmentsCache;
            }
            catch (error) {
                console.error('Error fetching ailments:', error);
                // Return default ailments if all else fails
                return [
                    'Malaria',
                    'Typhoid',
                    'Common Cold',
                    'Hypertension',
                    'Diabetes',
                    'Peptic Ulcer',
                    'Urinary Tract Infection',
                    'Respiratory Infection',
                    'Diarrhea',
                    'Skin Infection',
                ];
            }
        });
    }
}
exports.FDAService = FDAService;
