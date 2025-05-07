
import { StatusFullError } from '../../error/StatusFullError';
import { httpStatus } from '../../interfaces/httpStatus';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { commentService } from './comments.service';

const createComments = catchAsync(async (req, res) => {
//   if (!req.user) {
//     throw new StatusFullError({
//       name: 'UnauthorizedError',
//       message: 'You must be logged in to comment!',
//       status: httpStatus.UNAUTHORIZED,
//       path: req.originalUrl,
//     });
//   }

  const result = await commentService.createCommentsIntoDB(req.body, req.user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Comment added successfully!',
    data: result,
  });
});

const getCommentsByIdeaId = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  if (!req.user) {
    throw new StatusFullError({
      name: 'UnauthorizedError',
      message: 'You must be logged in to view comments!',
      status: httpStatus.UNAUTHORIZED,
      path: req.originalUrl,
    });
  }

  const result = await commentService.getCommentByIdeaIdFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment list retrieved successfully!',
    data: result,
  });
});

const deleteComments = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const result = await commentService.deleteCommentFromDB(id, req.user);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment deleted successfully!',
    data: result,
  });
});

export const commentController = {
  createComments,
  getCommentsByIdeaId,
  deleteComments,
};
