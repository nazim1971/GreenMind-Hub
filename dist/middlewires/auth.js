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
const catchAsync_1 = require("../app/shared/catchAsync");
const config_1 = __importDefault(require("../app/config"));
const jwtHelper_1 = require("../helper/jwtHelper");
const StatusFullError_1 = require("../app/error/StatusFullError");
const prisma_1 = __importDefault(require("../app/shared/prisma"));
const authHelper_1 = require("../helper/authHelper");
const auth = (...roles) => {
    return (0, catchAsync_1.catchAsync)((req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        // checking if the token is missing
        if (!token) {
            throw new StatusFullError_1.StatusFullError({
                name: "UnauthorizedError",
                message: "You are not authorized!",
                status: 401,
                path: req.originalUrl,
                success: false,
            });
        }
        // checking if the given token is valid
        const decoded = jwtHelper_1.jwtHelpers.verifyToken(token, config_1.default.jwtS);
        req.user = decoded;
        const { email, role, iat } = decoded;
        // Check if user exists in the database
        const user = yield prisma_1.default.user.findUnique({
            where: { email, isActive: true },
        });
        if (!user) {
            throw new StatusFullError_1.StatusFullError({
                name: "UnauthorizedError",
                message: "User does not exist or is inactive.",
                status: 401,
                path: req.originalUrl,
                success: false,
            });
        }
        // Check if token was issued before the password was changed
        if (user.passwordChangedAt &&
            (yield (0, authHelper_1.isTIssuedBeforePassC)(user.passwordChangedAt, iat))) {
            throw new StatusFullError_1.StatusFullError({
                name: "UnauthorizedError",
                message: "Token issued before password change. Please log in again.",
                status: 401,
                path: req.originalUrl,
                success: false,
            });
        }
        if (roles.length && !roles.includes(role)) {
            throw new StatusFullError_1.StatusFullError({
                success: false,
                name: "ForbiddenError",
                message: "You are not allowed to access this resource!",
                status: 403,
                path: req.originalUrl,
            });
        }
        // Attach the user object to the request
        req.user = Object.assign(Object.assign({}, decoded), { id: user.id });
        next();
    }));
};
exports.default = auth;
