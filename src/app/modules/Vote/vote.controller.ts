import { CustomPayload } from "../../interfaces";
import { httpStatus } from "../../interfaces/httpStatus";
import { catchAsync } from "../../shared/catchAsync";
import pick from "../../shared/pick";
import { sendResponse } from "../../shared/sendResponse";
import { ideaFilterOptions, ideaPaginationOption } from "../Idea/idea.constants";
import { IVotePayload } from "./vote.interface";
import { voteService } from "./vote.service";



const createOrUpdateVote = catchAsync(async (req, res) => {
  const user = req.user as CustomPayload;
  const payload: IVotePayload = req.body;

  const userEmail = user?.email;
  const result = await voteService.createOrUpdateVote(userEmail, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Vote registered successfully!',
    data: result,
  });
});

const removeVote = catchAsync(async (req, res) => {
  const user = req.user as CustomPayload;
  const ideaId = req.params?.ideaId;
  const userEmail = user?.email;
  await voteService.removeVote(userEmail, ideaId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Vote removed successfully',
    data: null,
  });
});

const getVoteStats = catchAsync(async (req, res) => {
  const ideaId = req.params.ideaId;
  const result = await voteService.getVoteStats(ideaId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Vote statistics retrieved successfully',
    data: result,
  });
});

const getUserVote = catchAsync(async (req, res ) => {
  const user = req.user as CustomPayload;
  const userEmail = user?.email;
  const ideaId = req.params.ideaId;
  const result = await voteService.getUserVote(userEmail, ideaId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User vote retrieved successfully',
    data: result,
  });
});

const getAllIdeasByVotes = catchAsync(async (req, res ) => {
  const filters = pick(req.query, ideaFilterOptions);
  const options = pick(req.query, ideaPaginationOption);
  const result = await voteService.getAllIdeasByVotes(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Ideas fetched and sorted(desc) by votes successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const voteController = {
  createOrUpdateVote,
  removeVote,
  getVoteStats,
  getUserVote,
  getAllIdeasByVotes,
};