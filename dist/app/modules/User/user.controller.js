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
exports.userController = void 0;
const user_service_1 = require("./user.service");
const catchAsync_1 = require("../../shared/catchAsync");
const sendResponse_1 = require("../../shared/sendResponse");
const httpStatus_1 = require("../../interfaces/httpStatus");
const fileUploader_1 = require("../../../helper/fileUploader");
//create user
const createUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.createUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.CREATED,
        message: 'User created successfully',
        data: result,
    });
}));
//Get my profile
const getMyProfile = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.getMyProfile(req.user);
    console.log(result);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Profile fetched Successfully',
        data: result,
    });
}));
//Update profile
const updateProfile = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const payload = req.body;
    // Fetch current user profile
    const existingUser = yield user_service_1.userService.getMyProfile(req === null || req === void 0 ? void 0 : req.user);
    if (req === null || req === void 0 ? void 0 : req.file) {
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e3);
        const imageName = `${uniqueSuffix}-${(_a = req.user) === null || _a === void 0 ? void 0 : _a.email.split('@')[0]}`;
        const path = (_b = req.file) === null || _b === void 0 ? void 0 : _b.buffer;
        const { secure_url } = yield (0, fileUploader_1.sendImageToCloudinary)(imageName, path);
        payload.image = secure_url;
    }
    else {
        // Reuse existing image if no new image uploaded
        payload.image = existingUser === null || existingUser === void 0 ? void 0 : existingUser.image;
    }
    const { accessToken, refreshToken } = yield user_service_1.userService.updateProfile((_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.id, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Profile updated successfully',
        data: {
            accessToken,
            refreshToken,
        },
    });
}));
// getAllUsers
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.getAllUsersFromDB(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.OK,
        message: "All users fetched successfully!",
        data: result.data,
        meta: result.meta,
    });
}));
;
// Get single user
const getSingleUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.getSingleUserFromDB(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'User fetched Successfully',
        data: result,
    });
}));
// updateUserActiveStatus
const updateUserActiveStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log({ id });
    const result = yield user_service_1.userService.updateUserActiveStatus(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.OK,
        message: "message: 'Users updated Successfully'!",
        data: result,
    });
}));
exports.userController = {
    createUser,
    getMyProfile,
    updateProfile,
    getAllUsers,
    getSingleUser,
    updateUserActiveStatus
};
