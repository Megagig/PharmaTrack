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
exports.HealthController = void 0;
class HealthController {
    /**
     * Check API health
     * @param req Request object
     * @param res Response object
     */
    checkHealth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.status(200).json({
                    status: 'success',
                    message: 'API is healthy',
                    timestamp: new Date().toISOString(),
                    environment: process.env.NODE_ENV || 'development',
                });
            }
            catch (error) {
                console.error('Error in health check:', error);
                res.status(500).json({
                    status: 'error',
                    message: error.message || 'Internal server error',
                });
            }
        });
    }
}
exports.HealthController = HealthController;
