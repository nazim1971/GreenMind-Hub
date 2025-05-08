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
exports.voteController = void 0;
const httpStatus_1 = require("../../interfaces/httpStatus");
const catchAsync_1 = require("../../shared/catchAsync");
const pick_1 = __importDefault(require("../../shared/pick"));
const sendResponse_1 = require("../../shared/sendResponse");
const idea_constants_1 = require("../Idea/idea.constants");
const vote_service_1 = require("./vote.service");
const createOrUpdateVote = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const payload = req.body;
    const userEmail = user === null || user === void 0 ? void 0 : user.email;
    const result = yield vote_service_1.voteService.createOrUpdateVote(userEmail, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Vote registered successfully!',
        data: result,
    });
}));
const removeVote = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = req.user;
    const ideaId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.ideaId;
    const userEmail = user === null || user === void 0 ? void 0 : user.email;
    yield vote_service_1.voteService.removeVote(userEmail, ideaId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Vote removed successfully',
        data: null,
    });
}));
const getVoteStats = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ideaId = req.params.ideaId;
    const result = yield vote_service_1.voteService.getVoteStats(ideaId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Vote statistics retrieved successfully',
        data: result,
    });
}));
const getUserVote = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const userEmail = user === null || user === void 0 ? void 0 : user.email;
    const ideaId = req.params.ideaId;
    const result = yield vote_service_1.voteService.getUserVote(userEmail, ideaId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'User vote retrieved successfully',
        data: result,
    });
}));
const getAllIdeasByVotes = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, idea_constants_1.ideaFilterOptions);
    const options = (0, pick_1.default)(req.query, idea_constants_1.ideaPaginationOption);
    const result = yield vote_service_1.voteService.getAllIdeasByVotes(filters, options);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Ideas fetched and sorted(desc) by votes successfully',
        meta: result.meta,
        data: result.data,
    });
}));
exports.voteController = {
    createOrUpdateVote,
    removeVote,
    getVoteStats,
    getUserVote,
    getAllIdeasByVotes,
};
