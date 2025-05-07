import { voteController } from './vote.controller';
import { Role } from '@prisma/client';
import { Router } from 'express';
import auth from '../../../middlewires/auth';
import validateRequest from '../../../middlewires/validateRequest';
import { VoteValidation } from './vote.validation';

const router = Router();

router.post(
  '/',
  auth(Role.ADMIN, Role.MEMBER),
  validateRequest(VoteValidation.voteValidationSchema),
  voteController.createOrUpdateVote
);

router.delete(
  '/:ideaId',
  auth(Role.ADMIN, Role.MEMBER),
  voteController.removeVote
);

router.get(
  '/stats/:ideaId',
  voteController.getVoteStats
);

router.get(
  '/:ideaId',
  auth(Role.ADMIN, Role.MEMBER),
  voteController.getUserVote
);

router.get('/ideas/by-votes', voteController.getAllIdeasByVotes);

export const voteRoutes = router;