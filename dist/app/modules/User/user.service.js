"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.userService = void 0;
const jwtHelper_1 = require("./../../../helper/jwtHelper");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("../../config"));
const user_constant_1 = require("./user.constant");
const paginationBuilder_1 = require("../../builder/paginationBuilder");
const conditionsBuilder_1 = require("../../builder/conditionsBuilder");
//create user
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const hashPassword = yield bcrypt.hash(data.password, config_1.default.salt);
    const image = user_constant_1.defaultUserImage;
    const userData = Object.assign(Object.assign({}, data), { image, role: client_1.Role.MEMBER, password: hashPassword });
    const newUser = yield prisma_1.default.user.create({
        data: userData,
    });
    return newUser;
});
//get my profile
const getMyProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            isActive: true,
        },
        select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            image: true
        },
    });
    return userData;
});
//Update profile
const updateProfile = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.update({
        where: { id, isActive: true },
        data: payload,
    });
    const accessToken = jwtHelper_1.jwtHelpers.generateToken({
        email: user.email,
        role: user.role,
        image: (user === null || user === void 0 ? void 0 : user.image) || user_constant_1.defaultUserImage,
        name: user.name,
    }, config_1.default.jwtS, config_1.default.jwtExp);
    const refreshToken = jwtHelper_1.jwtHelpers.generateToken({
        email: user.email,
        role: user.role,
        image: (user === null || user === void 0 ? void 0 : user.image) || user_constant_1.defaultUserImage,
        name: user.name,
    }, config_1.default.refreshS, config_1.default.refreshExp);
    return {
        accessToken,
        refreshToken,
    };
});
// getAllUsersFromDB
const getAllUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationBuilder_1.PaginationHelper.calculatePagination(query);
    let andConditions = [];
    // Dynamically build query filters
    andConditions = conditionsBuilder_1.ConditionsBuilder.prisma(query, andConditions, user_constant_1.userFields);
    const whereConditions = andConditions.length > 0
        ? {
            AND: andConditions,
        }
        : {};
    const result = yield prisma_1.default.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: { votes: true, payments: true, comments: true, ideas: true },
    });
    const count = yield prisma_1.default.user.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total: count,
            totalPage: Math.ceil(count / limit),
        },
        data: result,
    };
});
//get single user
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUniqueOrThrow({
        where: { id, isActive: true },
    });
    return result;
});
// updateUserActiveStatus
const updateUserActiveStatus = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("UserId", { userId });
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: userId,
        },
    });
    const result = yield prisma_1.default.user.update({
        where: {
            id: userData.id,
        },
        data: payload,
    });
    return result;
});
exports.userService = {
    createUser,
    getMyProfile,
    updateProfile,
    getAllUsersFromDB,
    getSingleUserFromDB,
    updateUserActiveStatus,
};
