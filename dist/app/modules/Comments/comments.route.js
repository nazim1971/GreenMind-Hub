"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comments_controller_1 = require("./comments.controller");
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../../middlewires/auth"));
const CommentsRoutes = (0, express_1.Router)();
CommentsRoutes.post('/', (0, auth_1.default)(client_1.Role.MEMBER, client_1.Role.ADMIN), comments_controller_1.commentController.createComments);
CommentsRoutes.get('/:id', (0, auth_1.default)(client_1.Role.MEMBER, client_1.Role.ADMIN), comments_controller_1.commentController.getCommentsByIdeaId);
CommentsRoutes.delete('/:id', (0, auth_1.default)(client_1.Role.ADMIN, client_1.Role.MEMBER), comments_controller_1.commentController.deleteComments);
exports.default = CommentsRoutes;
