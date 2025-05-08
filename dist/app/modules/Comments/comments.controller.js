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
exports.commentController = void 0;
const StatusFullError_1 = require("../../error/StatusFullError");
const httpStatus_1 = require("../../interfaces/httpStatus");
const catchAsync_1 = require("../../shared/catchAsync");
const sendResponse_1 = require("../../shared/sendResponse");
const comments_service_1 = require("./comments.service");
const createComments = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   if (!req.user) {
    //     throw new StatusFullError({
    //       name: 'UnauthorizedError',
    //       message: 'You must be logged in to comment!',
    //       status: httpStatus.UNAUTHORIZED,
    //       path: req.originalUrl,
    //     });
    //   }
    const result = yield comments_service_1.commentService.createCommentsIntoDB(req.body, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.CREATED,
        message: 'Comment added successfully!',
        data: result,
    });
}));
const getCommentsByIdeaId = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!req.user) {
        throw new StatusFullError_1.StatusFullError({
            name: 'UnauthorizedError',
            message: 'You must be logged in to view comments!',
            status: httpStatus_1.httpStatus.UNAUTHORIZED,
            path: req.originalUrl,
        });
    }
    const result = yield comments_service_1.commentService.getCommentByIdeaIdFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Comment list retrieved successfully!',
        data: result,
    });
}));
const deleteComments = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield comments_service_1.commentService.deleteCommentFromDB(id, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Comment deleted successfully!',
        data: result,
    });
}));
exports.commentController = {
    createComments,
    getCommentsByIdeaId,
    deleteComments,
};
