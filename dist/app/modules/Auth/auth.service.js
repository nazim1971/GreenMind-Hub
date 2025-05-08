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
exports.authServices = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtHelper_1 = require("../../../helper/jwtHelper");
const config_1 = __importDefault(require("../../config"));
const emailSender_1 = __importDefault(require("../../../helper/emailSender"));
const StatusFullError_1 = require("../../error/StatusFullError");
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("User login");
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            isActive: true
        },
    });
    console.log({ payload });
    const isPasswordCorrect = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!isPasswordCorrect) {
        throw new Error("Password Incorrect");
    }
    const accessToken = jwtHelper_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
        name: userData.name,
        image: userData.image
    }, config_1.default.jwtS, config_1.default.jwtExp);
    const refreshToken = jwtHelper_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
        name: userData.name,
        image: userData.image
    }, config_1.default.refreshS, config_1.default.refreshExp);
    return {
        accessToken,
        refreshToken
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwtHelper_1.jwtHelpers.verifyToken(token, config_1.default.refreshS);
    }
    catch (error) {
        throw new Error("You are not authorized");
    }
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData === null || decodedData === void 0 ? void 0 : decodedData.email,
            isActive: true
        },
    });
    const accessToken = jwtHelper_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
        name: userData.name,
        image: userData.image
    }, config_1.default.jwtS, config_1.default.jwtExp);
    return {
        accessToken,
        refreshToken
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("user", user, "payload", payload);
    const userData = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: user.email,
            isActive: true
        },
    });
    const isPasswordCorrect = yield bcrypt_1.default.compare(payload.oldPassword, userData.password);
    if (!isPasswordCorrect) {
        throw new Error("Password Incorrect");
    }
    const hasedPass = yield bcrypt_1.default.hash(payload.newPassword, 12);
    yield prisma_1.default.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hasedPass
        },
    });
    return {
        message: "Password changed successfully",
    };
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: payload.email,
            isActive: true
        },
    });
    const resetPassToken = jwtHelper_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
        name: userData.name,
        image: userData.image
    }, config_1.default.resetPassS, config_1.default.resetPassExp);
    console.log({ resetPassToken });
    const resetPassLink = config_1.default.resetPassLink + `?userId=${userData.id}&token=${resetPassToken}`;
    yield (0, emailSender_1.default)(userData.email, `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f9fa;">
    <h2 style="color: #333;">Password Reset Request</h2>
    <p>Hello <strong>${userData.email}</strong>,</p>
    <p>We received a request to reset your password. Click the button below to reset it:</p>
    <a href="${resetPassLink}" style="
      display: inline-block;
      padding: 10px 20px;
      margin-top: 10px;
      background-color: #007bff;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
    ">Reset Password</a>
    <p style="margin-top: 20px;">If you didn't request this, you can ignore this email.</p>
    <p>Thanks,<br/>Your Support Team</p>
  </div>
    `);
    console.log(resetPassLink);
    // http://localhost:5000/reset-pass?
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            id: payload === null || payload === void 0 ? void 0 : payload.id,
            isActive: true
        }
    });
    const isValidToken = jwtHelper_1.jwtHelpers.verifyToken(token, config_1.default.resetPassS);
    console.log({ isValidToken });
    if (!isValidToken) {
        throw new StatusFullError_1.StatusFullError({
            name: 'ForbiddenError',
            message: 'Forbidden',
            status: 403,
            success: false,
        });
    }
    const hasedPass = yield bcrypt_1.default.hash(payload.password, 12);
    yield prisma_1.default.user.update({
        where: {
            id: userData.id
        },
        data: {
            password: hasedPass
        }
    });
});
exports.authServices = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
