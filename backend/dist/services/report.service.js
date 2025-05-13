"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.ReportService = void 0;
const server_1 = require("../server");
const XLSX = __importStar(require("xlsx"));
class ReportService {
    createReport(pharmacyId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield server_1.prisma.report.create({
                data: Object.assign(Object.assign({}, data), { pharmacyId, reportDate: new Date(data.reportDate) }),
                include: {
                    pharmacy: true,
                },
            });
        });
    }
    getReportById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = yield server_1.prisma.report.findUnique({
                where: { id },
                include: {
                    pharmacy: true,
                },
            });
            if (!report) {
                throw new Error('Report not found');
            }
            return report;
        });
    }
    getReportsByPharmacy(pharmacyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield server_1.prisma.report.findMany({
                where: { pharmacyId },
                include: {
                    pharmacy: true,
                },
                orderBy: {
                    reportDate: 'desc',
                },
            });
        });
    }
    getAllReports() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield server_1.prisma.report.findMany({
                include: {
                    pharmacy: true,
                },
                orderBy: {
                    reportDate: 'desc',
                },
            });
        });
    }
    updateReport(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield server_1.prisma.report.update({
                where: { id },
                data: Object.assign(Object.assign({}, data), { reportDate: data.reportDate ? new Date(data.reportDate) : undefined }),
                include: {
                    pharmacy: true,
                },
            });
        });
    }
    deleteReport(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield server_1.prisma.report.delete({
                where: { id },
            });
        });
    }
    getReportsByDateRange(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            // Ensure dates are properly converted to Date objects
            const start = new Date(startDate);
            const end = new Date(endDate);
            // Set the time to start and end of day to ensure we catch all reports
            start.setUTCHours(0, 0, 0, 0);
            end.setUTCHours(23, 59, 59, 999);
            return yield server_1.prisma.report.findMany({
                where: {
                    reportDate: {
                        gte: start,
                        lte: end,
                    },
                },
                include: {
                    pharmacy: {
                        select: {
                            id: true,
                            name: true,
                            ward: true,
                            lga: true,
                            address: true,
                            phoneNumber: true,
                            email: true,
                            pharmacistInCharge: true,
                        },
                    },
                },
                orderBy: {
                    reportDate: 'desc',
                },
            });
        });
    }
    getReportsByLGA(lga) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield server_1.prisma.report.findMany({
                where: {
                    pharmacy: {
                        lga,
                    },
                },
                include: {
                    pharmacy: true,
                },
                orderBy: {
                    reportDate: 'desc',
                },
            });
        });
    }
    getReportsByWard(ward) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield server_1.prisma.report.findMany({
                where: {
                    pharmacy: {
                        ward,
                    },
                },
                include: {
                    pharmacy: true,
                },
                orderBy: {
                    reportDate: 'desc',
                },
            });
        });
    }
    getReportsSummary() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalReports = yield server_1.prisma.report.count();
            const totalPharmacies = yield server_1.prisma.pharmacy.count();
            const totalPatientsServed = yield server_1.prisma.report.aggregate({
                _sum: {
                    patientsServed: true,
                },
            });
            const totalReferrals = yield server_1.prisma.report.aggregate({
                _sum: {
                    referralsMade: true,
                },
            });
            const totalAdverseReactions = yield server_1.prisma.report.aggregate({
                _sum: {
                    adverseDrugReactions: true,
                },
            });
            return {
                totalReports,
                totalPharmacies,
                totalPatientsServed: totalPatientsServed._sum.patientsServed || 0,
                totalReferrals: totalReferrals._sum.referralsMade || 0,
                totalAdverseReactions: totalAdverseReactions._sum.adverseDrugReactions || 0,
            };
        });
    }
    exportToExcel(startDate_1, endDate_1) {
        return __awaiter(this, arguments, void 0, function* (startDate, endDate, format = 'detailed') {
            try {
                // Get all reports within date range with pharmacy information
                const reports = yield server_1.prisma.report.findMany({
                    where: {
                        reportDate: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                    include: {
                        pharmacy: true,
                    },
                    orderBy: {
                        reportDate: 'desc',
                    },
                });
                let worksheetData;
                if (format === 'detailed') {
                    // Detailed export with all information
                    worksheetData = reports.map((report) => {
                        var _a, _b, _c;
                        return ({
                            'Report Date': new Date(report.reportDate).toLocaleDateString(),
                            'Pharmacy Name': ((_a = report.pharmacy) === null || _a === void 0 ? void 0 : _a.name) || 'N/A',
                            LGA: ((_b = report.pharmacy) === null || _b === void 0 ? void 0 : _b.lga) || 'N/A',
                            Ward: ((_c = report.pharmacy) === null || _c === void 0 ? void 0 : _c.ward) || 'N/A',
                            'Total Patients': report.patientsServed,
                            'Male Patients': report.maleCount || 0,
                            'Female Patients': report.femaleCount || 0,
                            'Children (0-12)': report.childrenCount || 0,
                            'Adults (13-59)': report.adultCount || 0,
                            'Elderly (60+)': report.elderlyCount || 0,
                            'Top Medications': Array.isArray(report.topMedications)
                                ? report.topMedications.join(', ')
                                : '',
                            'Common Ailments': Array.isArray(report.commonAilments)
                                ? report.commonAilments.join(', ')
                                : '',
                            'Adverse Reactions': report.adverseDrugReactions || 0,
                            'Adverse Reaction Details': report.adverseReactionDetails || '',
                            'Referrals Made': report.referralsMade || 0,
                            Immunizations: report.immunizationsGiven || 0,
                            'Health Education Sessions': report.healthEducationSessions || 0,
                            'BP Checks': report.bpChecks || 0,
                            'Supply Issues': [
                                report.expiredDrugs ? 'Expired Drugs' : '',
                                report.stockouts ? 'Stockouts' : '',
                                report.supplyDelays ? 'Supply Delays' : '',
                            ]
                                .filter(Boolean)
                                .join(', ') || 'None',
                            Notes: report.notes || '',
                        });
                    });
                }
                else {
                    // Summary export with aggregated data by LGA
                    const lgaData = new Map();
                    reports.forEach((report) => {
                        var _a, _b;
                        const lga = ((_a = report.pharmacy) === null || _a === void 0 ? void 0 : _a.lga) || 'Unknown';
                        if (!lgaData.has(lga)) {
                            lgaData.set(lga, {
                                LGA: lga,
                                'Total Reports': 0,
                                'Total Patients': 0,
                                'Total Referrals': 0,
                                'Total Adverse Reactions': 0,
                                'Total Immunizations': 0,
                                'Total Health Sessions': 0,
                                'Total BP Checks': 0,
                                Pharmacies: new Set(),
                            });
                        }
                        const data = lgaData.get(lga);
                        data['Total Reports']++;
                        data['Total Patients'] += report.patientsServed;
                        data['Total Referrals'] += report.referralsMade;
                        data['Total Adverse Reactions'] += report.adverseDrugReactions;
                        data['Total Immunizations'] += report.immunizationsGiven || 0;
                        data['Total Health Sessions'] += report.healthEducationSessions || 0;
                        data['Total BP Checks'] += report.bpChecks || 0;
                        data['Pharmacies'].add((_b = report.pharmacy) === null || _b === void 0 ? void 0 : _b.name);
                    });
                    worksheetData = Array.from(lgaData.values()).map((data) => (Object.assign(Object.assign({}, data), { 'Number of Pharmacies': data['Pharmacies'].size, Pharmacies: Array.from(data['Pharmacies']).join(', ') })));
                }
                // Create worksheet
                const worksheet = XLSX.utils.json_to_sheet(worksheetData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');
                // Generate buffer
                const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
                return buffer;
            }
            catch (error) {
                console.error('Error generating Excel export:', error);
                throw new Error('Failed to generate Excel export');
            }
        });
    }
}
exports.ReportService = ReportService;
