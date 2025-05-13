"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = exports.AppError = void 0;
const appError_1 = __importDefault(require("./appError"));
exports.AppError = appError_1.default;
const catchAsync_1 = require("./catchAsync");
Object.defineProperty(exports, "catchAsync", { enumerable: true, get: function () { return catchAsync_1.catchAsync; } });
