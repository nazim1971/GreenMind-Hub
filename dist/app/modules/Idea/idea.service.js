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
exports.IdeaService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const paginationBuilder_1 = require("../../builder/paginationBuilder");
const idea_utils_1 = require("./idea.utils");
// draftAnIdeaIntoDB
const draftAnIdeaIntoDB = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.price = payload.price ? Number(payload.price) : 0;
    payload.authorId = userData.id;
    payload.isPaid = payload.price > 0;
    if (payload.id) {
        return yield prisma_1.default.idea.upsert({
            where: { id: payload.id },
            update: payload,
            create: payload,
        });
    }
    else {
        return yield prisma_1.default.idea.create({
            data: payload,
        });
    }
});
// createAnIdeaIntoDB
const createAnIdeaIntoDB = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.price = Number(payload.price);
    payload.authorId = userData.id;
    payload.status = client_1.IdeaStatus.UNDER_REVIEW;
    payload.isPaid = payload.price > 0;
    if (payload.id) {
        return yield prisma_1.default.idea.upsert({
            where: { id: payload.id },
            update: payload,
            create: payload,
        });
    }
    else {
        return yield prisma_1.default.idea.create({
            data: payload,
        });
    }
});
// getAllIdeasFromDB
const getAllIdeasFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationBuilder_1.PaginationHelper.calculatePagination(options);
    const filterOptions = (0, idea_utils_1.ideaFilters)(params);
    const result = yield prisma_1.default.idea.findMany({
        where: Object.assign(Object.assign({}, filterOptions), { status: client_1.IdeaStatus.APPROVED }),
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
        include: {
            votes: true,
            author: true,
            category: true,
            comments: true,
            payments: true,
        },
    });
    const count = yield prisma_1.default.idea.count({
        where: Object.assign(Object.assign({}, filterOptions), { status: client_1.IdeaStatus.APPROVED }),
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
// getOwnAllIdeasFromDB
const getOwnAllIdeasFromDB = (params, options, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationBuilder_1.PaginationHelper.calculatePagination(options);
    const filterOptions = (0, idea_utils_1.ideaFilters)(params);
    const whereOptions = Object.assign({ authorId: user === null || user === void 0 ? void 0 : user.id }, filterOptions);
    const result = yield prisma_1.default.idea.findMany({
        where: whereOptions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
        include: {
            votes: true,
            author: true,
            category: true,
            comments: true,
            payments: true,
        },
    });
    const count = yield prisma_1.default.idea.count({ where: whereOptions });
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
// getSingleIdeaFromDB
const getSingleIdeaFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.idea.findUnique({
        where: { id },
        include: {
            author: true,
            category: true,
            votes: {
                include: {
                    user: true,
                },
            },
            payments: true,
            comments: {
                where: { parentId: null },
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
                orderBy: { createdAt: 'asc' },
            },
        },
    });
});
// updateIdeaFromDB
const updateIdeaFromDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.idea.update({
        where: {
            id,
            isDeleted: false,
            OR: [
                { status: client_1.IdeaStatus.DRAFT },
                { status: client_1.IdeaStatus.UNDER_REVIEW },
            ],
        },
        data: payload,
    });
});
// deleteAnIdeaFromDB
const deleteAnIdeaFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.idea.update({
        where: { id, isDeleted: false },
        data: { isDeleted: true },
    });
});
// Exporting all functions as a flat service
exports.IdeaService = {
    draftAnIdeaIntoDB,
    createAnIdeaIntoDB,
    getAllIdeasFromDB,
    getOwnAllIdeasFromDB,
    getSingleIdeaFromDB,
    updateIdeaFromDB,
    deleteAnIdeaFromDB,
};
