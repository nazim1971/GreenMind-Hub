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
exports.voteService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const paginationBuilder_1 = require("../../builder/paginationBuilder");
const idea_utils_1 = require("../Idea/idea.utils");
const createOrUpdateVote = (userEmail, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { ideaId, type } = payload;
    // Check if idea exists and is approved
    const idea = yield prisma_1.default.idea.findUnique({
        where: { id: ideaId },
    });
    if (!idea) {
        throw new Error("Idea not found");
    }
    if (idea.status !== 'APPROVED') {
        throw new Error('Cannot vote on ideas that are not approved');
    }
    const existingVote = yield prisma_1.default.vote.findUnique({
        where: {
            userEmail_ideaId: {
                userEmail,
                ideaId,
            },
        },
    });
    if (existingVote) {
        // Update existing vote if type is different
        if (existingVote.type !== type) {
            const updatedVote = yield prisma_1.default.vote.update({
                where: {
                    userEmail_ideaId: {
                        userEmail,
                        ideaId,
                    },
                },
                data: { type },
            });
            return updatedVote;
        }
        return existingVote;
    }
    // Create new vote
    const newVote = yield prisma_1.default.vote.create({
        data: {
            userEmail,
            ideaId,
            type,
        },
    });
    return newVote;
});
const removeVote = (userEmail, ideaId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if idea exists
    const idea = yield prisma_1.default.idea.findUnique({
        where: { id: ideaId },
    });
    if (!idea) {
        throw new Error('Idea not found');
    }
    // Check if vote exists
    const vote = yield prisma_1.default.vote.findUnique({
        where: {
            userEmail_ideaId: {
                userEmail,
                ideaId,
            },
        },
    });
    if (!vote) {
        throw new Error('Vote not found');
    }
    // Delete the vote
    yield prisma_1.default.vote.delete({
        where: {
            userEmail_ideaId: {
                userEmail,
                ideaId,
            },
        },
    });
});
const getVoteStats = (ideaId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if idea exists
    const idea = yield prisma_1.default.idea.findUnique({
        where: { id: ideaId },
    });
    if (!idea) {
        throw new Error('Idea not found');
    }
    // Count upvotes and downvotes
    const [upvotesCount, downvotesCount] = yield Promise.all([
        prisma_1.default.vote.count({
            where: {
                ideaId,
                type: client_1.VoteType.UP,
            },
        }),
        prisma_1.default.vote.count({
            where: {
                ideaId,
                type: client_1.VoteType.DOWN,
            },
        }),
    ]);
    return {
        upvotes: upvotesCount,
        downvotes: downvotesCount,
        total: upvotesCount - downvotesCount,
    };
});
const getUserVote = (userEmail, ideaId) => __awaiter(void 0, void 0, void 0, function* () {
    const vote = yield prisma_1.default.vote.findUnique({
        where: {
            userEmail_ideaId: {
                userEmail,
                ideaId,
            },
        },
    });
    if (!vote) {
        throw new Error('Vote not found');
    }
    return vote;
});
const getAllIdeasByVotes = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationBuilder_1.PaginationHelper.calculatePagination(options);
    const filterOptions = (0, idea_utils_1.ideaFilters)(params);
    // Get all ideas that match the filter criteria
    const ideas = yield prisma_1.default.idea.findMany({
        where: filterOptions,
        include: {
            author: true,
            category: true,
            comments: {
                select: {
                    id: true,
                },
            },
            payments: true,
            _count: {
                select: {
                    votes: {
                        where: {
                            type: client_1.VoteType.UP,
                        },
                    },
                },
            },
        },
    });
    // For each idea, get the vote counts
    const ideasWithVotes = yield Promise.all(ideas.map((idea) => __awaiter(void 0, void 0, void 0, function* () {
        const upvotes = yield prisma_1.default.vote.count({
            where: {
                ideaId: idea.id,
                type: client_1.VoteType.UP,
            },
        });
        const downvotes = yield prisma_1.default.vote.count({
            where: {
                ideaId: idea.id,
                type: client_1.VoteType.DOWN,
            },
        });
        return Object.assign(Object.assign({}, idea), { voteStats: {
                upvotes,
                downvotes,
                total: upvotes - downvotes,
            }, 
            // Adjust the structure to match your frontend expectations
            comments: idea.comments.length });
    })));
    // Sort by total votes in descending order
    const sortedIdeas = ideasWithVotes.sort((a, b) => b.voteStats.total - a.voteStats.total);
    // Apply pagination after sorting
    const paginatedResults = sortedIdeas.slice(skip, skip + limit);
    const totalCount = sortedIdeas.length;
    return {
        meta: {
            page: page,
            limit: limit,
            total: totalCount,
            totalPage: Math.ceil(totalCount / (limit || 10)),
        },
        data: paginatedResults,
    };
});
exports.voteService = {
    createOrUpdateVote,
    removeVote,
    getUserVote,
    getVoteStats,
    getAllIdeasByVotes,
};
