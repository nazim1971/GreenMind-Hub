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
exports.IdeaController = void 0;
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../../helper/fileUploader");
const httpStatus_1 = require("../../interfaces/httpStatus");
const catchAsync_1 = require("../../shared/catchAsync");
const pick_1 = __importDefault(require("../../shared/pick"));
const sendResponse_1 = require("../../shared/sendResponse");
const idea_constants_1 = require("../Idea/idea.constants");
const idea_service_1 = require("../Idea/idea.service");
const idea_validation_1 = require("./idea.validation");
const StatusFullError_1 = require("../../error/StatusFullError");
// draftAnIdea
const draftAnIdea = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    payload.images = [];
    if (req.files && Array.isArray(req.files)) {
        const imageUrls = yield Promise.all(req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e3);
            const imageName = `${uniqueSuffix}-${(_a = req.user) === null || _a === void 0 ? void 0 : _a.email.split("@")[0]}`;
            const path = file === null || file === void 0 ? void 0 : file.buffer;
            const { secure_url } = yield (0, fileUploader_1.sendImageToCloudinary)(imageName, path);
            return secure_url;
        })));
        payload.images = imageUrls;
    }
    const result = yield idea_service_1.IdeaService.draftAnIdeaIntoDB(req.user, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.OK,
        message: "Idea drafted successfully",
        data: result,
    });
}));
// createAnIdea
const createAnIdea = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    payload.images = [];
    if (req.files && Array.isArray(req.files)) {
        const imageUrls = yield Promise.all(req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e3);
            const imageName = `${uniqueSuffix}-${(_a = req.user) === null || _a === void 0 ? void 0 : _a.email.split("@")[0]}`;
            const path = file === null || file === void 0 ? void 0 : file.buffer;
            const { secure_url } = yield (0, fileUploader_1.sendImageToCloudinary)(imageName, path);
            return secure_url;
        })));
        payload.images = imageUrls;
    }
    const result = yield idea_service_1.IdeaService.createAnIdeaIntoDB(req.user, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.OK,
        message: "Idea posted successfully",
        data: result,
    });
}));
// getAllIdeas
const getAllIdeas = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, idea_constants_1.ideaFilterOptions);
    const options = (0, pick_1.default)(req.query, idea_constants_1.ideaPaginationOption);
    const result = yield idea_service_1.IdeaService.getAllIdeasFromDB(filters, options);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.OK,
        message: "Ideas fetched successfully",
        meta: result.meta,
        data: result.data,
    });
}));
// getOwnAllIdeas
const getOwnAllIdeas = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, idea_constants_1.ideaFilterOptions);
    const options = (0, pick_1.default)(req.query, idea_constants_1.ideaPaginationOption);
    const result = yield idea_service_1.IdeaService.getOwnAllIdeasFromDB(filters, options, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.OK,
        message: "Own ideas fetched successfully",
        meta: result.meta,
        data: result.data,
    });
}));
// getSingleIdea
const getSingleIdea = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield idea_service_1.IdeaService.getSingleIdeaFromDB(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.OK,
        message: "Idea fetched successfully",
        data: result,
    });
}));
const updateAIdea = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    const ideaId = req.params.id;
    const payload = req.body;
    const existingIdea = yield idea_service_1.IdeaService.getSingleIdeaFromDB(ideaId);
    if (!existingIdea) {
        throw new StatusFullError_1.StatusFullError({
            name: 'NotFoundError',
            message: 'Idea not found',
            status: httpStatus_1.httpStatus.NOT_FOUND,
            path: req.originalUrl,
        });
    }
    // Restrict MEMBER to only their own idea
    if (role === client_1.Role.MEMBER && existingIdea.authorId !== userId) {
        throw new StatusFullError_1.StatusFullError({
            name: 'ForbiddenError',
            message: 'You can only update your own ideas',
            status: httpStatus_1.httpStatus.FORBIDDEN,
            path: req.originalUrl,
        });
    }
    // Role-based validation
    if (role === client_1.Role.ADMIN) {
        yield idea_validation_1.IdeaValidation.updateIdeaStatus.parseAsync({ body: payload });
    }
    else {
        yield idea_validation_1.IdeaValidation.updateIdea.parseAsync({ body: payload });
        // Remove unauthorized fields from MEMBER
        if ('status' in payload)
            delete payload.status;
    }
    // Handle image uploads for MEMBER
    if (role === client_1.Role.MEMBER) {
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const imageUrls = yield Promise.all(req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e3);
                const imageName = `${uniqueSuffix}-${(_a = req.user) === null || _a === void 0 ? void 0 : _a.email.split('@')[0]}`;
                const path = file === null || file === void 0 ? void 0 : file.buffer;
                const { secure_url } = yield (0, fileUploader_1.sendImageToCloudinary)(imageName, path);
                return secure_url;
            })));
            payload.images = imageUrls;
        }
        else {
            payload.images = existingIdea.images;
        }
    }
    if (payload.price !== undefined) {
        const parsedPrice = Number(payload.price);
        if (!isNaN(parsedPrice)) {
            payload.price = parsedPrice;
        }
        else {
            delete payload.price; // or optionally throw an error
        }
    }
    const result = yield idea_service_1.IdeaService.updateIdeaFromDB(ideaId, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Idea updated successfully',
        data: result,
    });
}));
// deleteAIdea
const deleteAIdea = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const ideaId = req.params.id;
    const existingIdea = yield idea_service_1.IdeaService.getSingleIdeaFromDB(ideaId);
    // Check if idea doesn't exist or already deleted
    if (!existingIdea || existingIdea.isDeleted) {
        throw new StatusFullError_1.StatusFullError({
            name: 'NotFoundError',
            message: 'Idea not found or already deleted',
            status: httpStatus_1.httpStatus.NOT_FOUND,
            path: req.originalUrl,
        });
    }
    if (existingIdea.authorId !== userId) {
        throw new StatusFullError_1.StatusFullError({
            name: 'ForbiddenError',
            message: 'You can only delete your own ideas',
            status: httpStatus_1.httpStatus.FORBIDDEN,
            path: req.originalUrl,
        });
    }
    yield idea_service_1.IdeaService.deleteAnIdeaFromDB(ideaId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Idea deleted successfully',
        data: null,
    });
}));
// getAllIdeas
const getAllIdeasForAdmin = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield idea_service_1.IdeaService.getAllIdeasForAdmin(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'All ideas fetched successfully!',
        data: result.data,
        meta: result.meta,
    });
}));
exports.IdeaController = {
    draftAnIdea,
    createAnIdea,
    getAllIdeas,
    getOwnAllIdeas,
    getSingleIdea,
    updateAIdea,
    deleteAIdea,
    getAllIdeasForAdmin
};
