import { Router } from 'express';
import { commentController } from './comments.controller';
import { Role } from '@prisma/client';
import auth from '../../../middlewires/auth';

const CommentsRoutes = Router();

CommentsRoutes.post(
  '/',
  auth(Role.MEMBER, Role.ADMIN),
  commentController.createComments
);

CommentsRoutes.get(
  '/:id',
  auth(Role.MEMBER, Role.ADMIN),
  commentController.getCommentsByIdeaId
);

CommentsRoutes.delete(
  '/:id',
  auth(Role.ADMIN, Role.MEMBER),
  commentController.deleteComments
);

export default CommentsRoutes;