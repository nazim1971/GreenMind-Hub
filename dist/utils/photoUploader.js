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
exports.parseMultipleImagesWithData = exports.parseSingleImageWithData = void 0;
const catchAsync_1 = require("../app/shared/catchAsync");
const fileUploader_1 = require("../helper/fileUploader");
// Middleware for handling one image upload
const parseSingleImageWithData = () => {
    return [
        fileUploader_1.uploadFile.single('image'),
        (0, catchAsync_1.catchAsync)((req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.data) {
                req.body = JSON.parse(req.body.data);
            }
            next();
        })),
    ];
};
exports.parseSingleImageWithData = parseSingleImageWithData;
// Middleware for handling multiple images upload
const parseMultipleImagesWithData = () => {
    return [
        fileUploader_1.uploadFile.array('images', 10), // Adjust 10 to your desired limit
        (0, catchAsync_1.catchAsync)((req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.data) {
                req.body = JSON.parse(req.body.data);
            }
            next();
        })),
    ];
};
exports.parseMultipleImagesWithData = parseMultipleImagesWithData;
