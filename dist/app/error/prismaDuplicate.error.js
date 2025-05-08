"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePrismaError = handlePrismaError;
// src/utils/handlePrismaError.ts
const client_1 = require("@prisma/client");
const StatusFullError_1 = require("./StatusFullError");
function handlePrismaError(error) {
    var _a, _b;
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002") {
        const fields = (_b = (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.join(", ");
        throw new StatusFullError_1.StatusFullError({
            name: "DuplicateError",
            message: `Duplicate entry: ${fields} must be unique`,
            status: 400,
            path: "prismaError", // optional
        });
    }
    // Rethrow unknown errors
    throw error;
}
