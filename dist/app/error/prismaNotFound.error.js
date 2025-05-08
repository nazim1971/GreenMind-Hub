"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePrismaNotFoundError = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const handlePrismaNotFoundError = (error, res) => {
    var _a;
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025") {
        const causeMessage = (_a = error.meta) === null || _a === void 0 ? void 0 : _a.cause;
        // Extract model name like "Customer", "Bike", etc.
        const modelMatch = causeMessage === null || causeMessage === void 0 ? void 0 : causeMessage.match(/No (\w+) found/i);
        const model = (modelMatch === null || modelMatch === void 0 ? void 0 : modelMatch[1]) || "Resource";
        res.status(http_status_1.default.NOT_FOUND).json({
            success: false,
            status: http_status_1.default.NOT_FOUND,
            message: `${model} not found`,
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        });
        return true; // Handled
    }
    return false; // Not handled
};
exports.handlePrismaNotFoundError = handlePrismaNotFoundError;
