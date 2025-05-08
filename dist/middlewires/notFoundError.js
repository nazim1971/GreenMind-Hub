"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundError = void 0;
const http_status_1 = __importDefault(require("http-status"));
const notFoundError = (req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: "Api not found",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found",
        },
    });
};
exports.notFoundError = notFoundError;
