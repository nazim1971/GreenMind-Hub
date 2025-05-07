import { Role } from "@prisma/client";
import { sendImageToCloudinary } from "../../../helper/fileUploader";
import { httpStatus } from "../../interfaces/httpStatus";
import { catchAsync } from "../../shared/catchAsync";
import pick from "../../shared/pick";
import { sendResponse } from "../../shared/sendResponse";
import {
  ideaFilterOptions,
  ideaPaginationOption,
} from "../Idea/idea.constants";
import { IdeaService } from "../Idea/idea.service";
import { IdeaValidation } from "./idea.validation";
import { StatusFullError } from "../../error/StatusFullError";

// draftAnIdea
const draftAnIdea = catchAsync(async (req, res) => {
  const payload = req.body;
  payload.images = [];

  if (req.files && Array.isArray(req.files)) {
    const imageUrls = await Promise.all(
      req.files.map(async (file) => {
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e3);
        const imageName = `${uniqueSuffix}-${req.user?.email.split("@")[0]}`;
        const path = file?.buffer;

        const { secure_url } = await sendImageToCloudinary(imageName, path);
        return secure_url;
      })
    );
    payload.images = imageUrls;
  }

  const result = await IdeaService.draftAnIdeaIntoDB(req.user, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Idea drafted successfully",
    data: result,
  });
});

// createAnIdea
const createAnIdea = catchAsync(async (req, res) => {
  const payload = req.body;
  payload.images = [];

  if (req.files && Array.isArray(req.files)) {
    const imageUrls = await Promise.all(
      req.files.map(async (file) => {
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e3);
        const imageName = `${uniqueSuffix}-${req.user?.email.split("@")[0]}`;
        const path = file?.buffer;

        const { secure_url } = await sendImageToCloudinary(imageName, path);
        return secure_url;
      })
    );
    payload.images = imageUrls;
  }

  const result = await IdeaService.createAnIdeaIntoDB(req.user, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Idea posted successfully",
    data: result,
  });
});

// getAllIdeas
const getAllIdeas = catchAsync(async (req, res) => {
  const filters = pick(req.query, ideaFilterOptions);
  const options = pick(req.query, ideaPaginationOption);
  const result = await IdeaService.getAllIdeasFromDB(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Ideas fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

// getOwnAllIdeas
const getOwnAllIdeas = catchAsync(async (req, res) => {
  const filters = pick(req.query, ideaFilterOptions);
  const options = pick(req.query, ideaPaginationOption);
  const result = await IdeaService.getOwnAllIdeasFromDB(
    filters,
    options,
    req.user
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Own ideas fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

// getSingleIdea
const getSingleIdea = catchAsync(async (req, res) => {
  const result = await IdeaService.getSingleIdeaFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Idea fetched successfully",
    data: result,
  });
});


const updateAIdea = catchAsync(async (req, res) => {
  const role = req.user?.role;
  const userId = req.user?.id;
  const ideaId = req.params.id;
  const payload = req.body;

  const existingIdea = await IdeaService.getSingleIdeaFromDB(ideaId);

  if (!existingIdea) {
    throw new StatusFullError({
      name: 'NotFoundError',
      message: 'Idea not found',
      status: httpStatus.NOT_FOUND,
      path: req.originalUrl,
    });
  }

  // Restrict MEMBER to only their own idea
  if (role === Role.MEMBER && existingIdea.authorId !== userId) {
    throw new StatusFullError({
      name: 'ForbiddenError',
      message: 'You can only update your own ideas',
      status: httpStatus.FORBIDDEN,
      path: req.originalUrl,
    });
  }

  // Role-based validation
  if (role === Role.ADMIN) {
    await IdeaValidation.updateIdeaStatus.parseAsync({ body: payload });
  } else {
    await IdeaValidation.updateIdea.parseAsync({ body: payload });

    // Remove unauthorized fields from MEMBER
    if ('status' in payload) delete payload.status;
  }

  // Handle image uploads for MEMBER
  if (role === Role.MEMBER) {
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const imageUrls = await Promise.all(
        req.files.map(async (file) => {
          const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e3);
          const imageName = `${uniqueSuffix}-${req.user?.email.split('@')[0]}`;
          const path = file?.buffer;

          const { secure_url } = await sendImageToCloudinary(imageName, path);
          return secure_url;
        })
      );
      payload.images = imageUrls;
    } else {
      payload.images = existingIdea.images;
    }
  }

  if (payload.price !== undefined) {
    const parsedPrice = Number(payload.price);
    if (!isNaN(parsedPrice)) {
      payload.price = parsedPrice;
    } else {
      delete payload.price; // or optionally throw an error
    }
  }
  const result = await IdeaService.updateIdeaFromDB(ideaId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Idea updated successfully',
    data: result,
  });
});



// deleteAIdea


const deleteAIdea = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const ideaId = req.params.id;

  const existingIdea = await IdeaService.getSingleIdeaFromDB(ideaId);

  // Check if idea doesn't exist or already deleted
  if (!existingIdea || existingIdea.isDeleted) {
    throw new StatusFullError({
      name: 'NotFoundError',
      message: 'Idea not found or already deleted',
      status: httpStatus.NOT_FOUND,
      path: req.originalUrl,
    });
  }

 
  if (existingIdea.authorId !== userId) {
    throw new StatusFullError({
      name: 'ForbiddenError',
      message: 'You can only delete your own ideas',
      status: httpStatus.FORBIDDEN,
      path: req.originalUrl,
    });
  }

  await IdeaService.deleteAnIdeaFromDB(ideaId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Idea deleted successfully',
    data: null,
  });
});

export const IdeaController = {
  draftAnIdea,
  createAnIdea,
  getAllIdeas,
  getOwnAllIdeas,
  getSingleIdea,
  updateAIdea,
  deleteAIdea,
};
