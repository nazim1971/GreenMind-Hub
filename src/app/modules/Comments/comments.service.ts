import { Comment, Role } from '@prisma/client';
import { CustomPayload } from '../../interfaces';
import { StatusFullError } from '../../error/StatusFullError';
import { httpStatus } from '../../interfaces/httpStatus';
import prisma from '../../shared/prisma';


const createCommentsIntoDB = async (
    payload: Partial<Comment>,
    user: CustomPayload
  ) => {
    if (!payload.ideaId || !payload.content) {
      throw new StatusFullError({
        name: 'ValidationError',
        message: 'Required fields missing',
        status: httpStatus.BAD_REQUEST,
        path: '', // You can provide a dynamic path if necessary, or leave it empty
      });
    }
  
    const filterData = {
      content: payload.content,
      ideaId: payload.ideaId,
      userId: user.id,
      parentId: payload.parentId || null,
    };
  
    const result = await prisma.comment.create({
      data: filterData,
      include: {
        user: { select: { name: true } },
      },
    });
  
    return result;
  };
  

const getCommentByIdeaIdFromDB = async (ideaId: string) => {
  const comments = await prisma.comment.findMany({
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
};

const deleteCommentFromDB = async (id: string, authUser: CustomPayload) => {
    const userId = authUser.id;
  
    const comment = await prisma.comment.findUnique({
      where: { id },
    });
  
    if (!comment) {
      throw new StatusFullError({
        name: 'NotFoundError',
        message: 'Comment not found',
        status: httpStatus.NOT_FOUND,
        path: '', // You can dynamically set this if necessary
      });
    }
  
    if (authUser.role !== Role.ADMIN) {
      if (comment.userId !== userId) {
        throw new StatusFullError({
          name: 'ForbiddenError',
          message: "Not permitted to delete other's comment!",
          status: httpStatus.FORBIDDEN,
          path: '', // You can dynamically set this if necessary
        });
      }
    }
  
    const deletedComment = await prisma.comment.delete({
      where: { id },
    });
  
    return deletedComment;
  };
  

export const commentService = {
  createCommentsIntoDB,
  getCommentByIdeaIdFromDB,
  deleteCommentFromDB,
};
