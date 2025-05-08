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
exports.paymentService = void 0;
const payment_utils_1 = require("./payment.utils");
const client_1 = require("@prisma/client");
const conditionsBuilder_1 = require("../../builder/conditionsBuilder");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const paginationBuilder_1 = require("../../builder/paginationBuilder");
const payment_constant_1 = require("./payment.constant");
const StatusFullError_1 = require("../../error/StatusFullError");
// create Payment
const createPaymentIntoDB = (paymentData, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const idea = yield prisma_1.default.idea.findUnique({
        where: {
            id: paymentData.ideaId,
            isDeleted: false,
        },
    });
    if (!idea) {
        throw new StatusFullError_1.StatusFullError({
            name: "NotFoundError",
            message: "Idea not Found!",
            status: 404,
        });
    }
    const transactionId = payment_utils_1.sslService.generateTransactionId();
    paymentData.userEmail = authUser.email;
    paymentData.amount = idea.price;
    paymentData.status = client_1.PaymentStatus.Pending;
    paymentData.transactionId = transactionId;
    // create the Payment
    const createdPayment = yield prisma_1.default.payment.create({
        data: paymentData,
    });
    // initializaPayment
    const paymentUrl = yield payment_utils_1.sslService.initializaPayment(createdPayment.amount, transactionId);
    return paymentUrl;
});
// get All Payments
const getAllPaymentsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationBuilder_1.PaginationHelper.calculatePagination(query);
    let andConditions = [];
    // Dynamically build query filters
    andConditions = conditionsBuilder_1.ConditionsBuilder.prisma(query, andConditions, payment_constant_1.paymentFields);
    const whereConditions = andConditions.length > 0
        ? {
            AND: andConditions,
        }
        : {};
    const result = yield prisma_1.default.payment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
    });
    const count = yield prisma_1.default.payment.count({
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
// getMemberPaymentsFromDB
const getMemberPaymentsFromDB = (query, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationBuilder_1.PaginationHelper.calculatePagination(query);
    let andConditions = [];
    // Dynamically build query filters
    andConditions = conditionsBuilder_1.ConditionsBuilder.prisma(query, andConditions, payment_constant_1.paymentFields);
    andConditions.push({
        userEmail: authUser.email,
    });
    const whereConditions = andConditions.length > 0
        ? {
            AND: andConditions,
        }
        : {};
    const result = yield prisma_1.default.payment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
    });
    const count = yield prisma_1.default.payment.count({
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
// getPaymentDetailsFromDB
const getPaymentDetailsFromDB = (paymentId, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield prisma_1.default.payment.findUnique({
        where: {
            id: paymentId,
            userEmail: authUser.email,
        },
    });
    if (!payment) {
        throw new StatusFullError_1.StatusFullError({
            name: "NotFoundError",
            message: "payment not Found!",
            status: 404,
        });
    }
    return payment;
});
// validate Payment
const validatePayment = (transactionId, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    // this user will be exists as he/she passed the auth() middleware
    const payment = yield prisma_1.default.payment.findUnique({
        where: {
            transactionId,
            userEmail: authUser.email,
        },
    });
    if (!payment) {
        throw new StatusFullError_1.StatusFullError({
            name: "NotFoundError",
            message: "payment not Found!",
            status: 404,
        });
    }
    const result = yield payment_utils_1.sslService.validatePayment(transactionId, authUser);
    return result;
});
exports.paymentService = {
    createPaymentIntoDB,
    getAllPaymentsFromDB,
    getMemberPaymentsFromDB,
    getPaymentDetailsFromDB,
    // changePaymentStatusInDB,
    validatePayment,
};
