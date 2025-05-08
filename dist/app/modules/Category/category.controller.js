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
exports.CategoryController = void 0;
const httpStatus_1 = require("../../interfaces/httpStatus");
const catchAsync_1 = require("../../shared/catchAsync");
const sendResponse_1 = require("../../shared/sendResponse");
const category_service_1 = require("./category.service");
// createCategory
const createCategory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_service_1.CategoryService.createCategoryIntoDB(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Category is created successfully',
        data: result,
    });
}));
// getAllCategories
const getAllCategories = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_service_1.CategoryService.getAllCategoriesFromDB(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Category list retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
}));
exports.CategoryController = {
    createCategory,
    getAllCategories,
};
