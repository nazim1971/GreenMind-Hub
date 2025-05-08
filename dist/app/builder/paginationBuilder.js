"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationHelper = void 0;
const pagination_constant_1 = require("../constant/pagination.constant");
const pick_1 = __importDefault(require("../shared/pick"));
const calculatePagination = (query) => {
    const options = (0, pick_1.default)(query, pagination_constant_1.globalPaginationOptions);
    const page = Number(options === null || options === void 0 ? void 0 : options.page) || 1;
    const limit = Number(options === null || options === void 0 ? void 0 : options.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = (options === null || options === void 0 ? void 0 : options.sortBy) || 'createdAt';
    const sortOrder = (options === null || options === void 0 ? void 0 : options.sortOrder) || 'desc';
    return { page, limit, skip, sortBy, sortOrder };
};
exports.PaginationHelper = {
    calculatePagination,
};
