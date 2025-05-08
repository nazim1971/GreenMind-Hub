"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../../middlewires/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post('/login', auth_controller_1.authController.loginUser);
router.post('/refreshToken', auth_controller_1.authController.refreshToken);
router.put('/change-password', (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.MEMBER), auth_controller_1.authController.changePassword);
router.post('/forgot-password', auth_controller_1.authController.forgotPassword);
router.post('/reset-password', auth_controller_1.authController.resetPassword);
exports.AuthRouter = router;
