"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusFullError = void 0;
class StatusFullError extends Error {
    constructor({ name, message, status, path = "", success = false, }) {
        super(message);
        this.name = name;
        this.message = message;
        this.status = status;
        this.path = path;
        this.success = success;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.StatusFullError = StatusFullError;
