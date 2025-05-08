"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../../middlewires/auth"));
const CategoryRoute = (0, express_1.Router)();
CategoryRoute.post('/', (0, auth_1.default)(client_1.Role.ADMIN), category_controller_1.CategoryController.createCategory);
CategoryRoute.get('/', category_controller_1.CategoryController.getAllCategories);
exports.default = CategoryRoute;
