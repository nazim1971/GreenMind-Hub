"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const http_status_1 = __importDefault(require("http-status"));
const StatusFullError_1 = require("../app/error/StatusFullError");
const prismaDuplicate_error_1 = require("../app/error/prismaDuplicate.error");
const zod_1 = require("zod");
const zod_error_1 = __importDefault(require("../app/error/zod.error"));
const prismaNotFound_error_1 = require("../app/error/prismaNotFound.error");
// ✅ Explicit typing
const globalErrorHandler = (error, req, res, next) => {
    try {
        // Let handlePrismaError convert known Prisma errors to StatusFullError
        (0, prismaDuplicate_error_1.handlePrismaError)(error);
    }
    catch (handledError) {
        error = handledError;
    }
    if ((0, prismaNotFound_error_1.handlePrismaNotFoundError)(error, res))
        return;
    // Handle Zod validation error
    if (error instanceof zod_1.ZodError) {
        const zodFormatted = (0, zod_error_1.default)(error);
        res.status(zodFormatted.statusCode).json({
            success: false,
            status: zodFormatted.statusCode,
            message: zodFormatted.message,
            error: zodFormatted.error,
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        });
        return;
    }
    if (error instanceof StatusFullError_1.StatusFullError) {
        res.status(error.status).json({
            success: error.success,
            status: error.status,
            message: error.message,
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        });
        return;
    }
    res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
        success: false,
        status: http_status_1.default.INTERNAL_SERVER_ERROR,
        message: (error === null || error === void 0 ? void 0 : error.message) || "Something went wrong",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
};
exports.globalErrorHandler = globalErrorHandler;
