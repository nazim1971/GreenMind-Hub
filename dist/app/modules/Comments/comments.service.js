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
exports.commentService = void 0;
const client_1 = require("@prisma/client");
const StatusFullError_1 = require("../../error/StatusFullError");
const httpStatus_1 = require("../../interfaces/httpStatus");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createCommentsIntoDB = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.ideaId || !payload.content) {
        throw new StatusFullError_1.StatusFullError({
            name: 'ValidationError',
            message: 'Required fields missing',
            status: httpStatus_1.httpStatus.BAD_REQUEST,
            path: '', // You can provide a dynamic path if necessary, or leave it empty
        });
    }
    const filterData = {
        content: payload.content,
        ideaId: payload.ideaId,
        userId: user.id,
        parentId: payload.parentId || null,
    };
    const result = yield prisma_1.default.comment.create({
        data: filterData,
        include: {
            user: { select: { name: true } },
        },
    });
    return result;
});
const getCommentByIdeaIdFromDB = (ideaId) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield prisma_1.default.comment.findMany({
        where: {
            ideaId: ideaId,
            parentId: null, // Only top-level comments
        },
        include: {
            user: true,
            replies: {
                include: {
                    user: true,
                    replies: {
                        include: {
                            user: true,
                            replies: {
                                include: {
                                    user: true,
                                },
                            },
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: 'asc',
        },
    });
    return comments;
});
const deleteCommentFromDB = (id, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = authUser.id;
    const comment = yield prisma_1.default.comment.findUnique({
        where: { id },
    });
    if (!comment) {
        throw new StatusFullError_1.StatusFullError({
            name: 'NotFoundError',
            message: 'Comment not found',
            status: httpStatus_1.httpStatus.NOT_FOUND,
            path: '', // You can dynamically set this if necessary
        });
    }
    if (authUser.role !== client_1.Role.ADMIN) {
        if (comment.userId !== userId) {
            throw new StatusFullError_1.StatusFullError({
                name: 'ForbiddenError',
                message: "Not permitted to delete other's comment!",
                status: httpStatus_1.httpStatus.FORBIDDEN,
                path: '', // You can dynamically set this if necessary
            });
        }
    }
    const deletedComment = yield prisma_1.default.comment.delete({
        where: { id },
    });
    return deletedComment;
});
exports.commentService = {
    createCommentsIntoDB,
    getCommentByIdeaIdFromDB,
    deleteCommentFromDB,
};
