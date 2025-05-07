import { z } from 'zod';
import { VoteType } from '@prisma/client';

const voteValidationSchema = z.object({
  body: z.object({
    ideaId: z
      .string({
        required_error: 'Idea ID is required',
      })
      .uuid({
        message: 'Invalid idea ID format',
      }),
    type: z.enum([VoteType.UP, VoteType.DOWN], {
      required_error: 'Vote type is required',
      invalid_type_error: 'Vote type must be either UP or DOWN',
    }),
  }),
});

const deleteVoteValidationSchema = z.object({
  body: z.object({
    ideaId: z
      .string({
        required_error: 'Idea ID is required',
      })
      .uuid({
        message: 'Invalid idea ID format',
      })
      .optional(),
  }),
});

const getVoteStatsValidationSchema = z.object({
  body: z.object({
    ideaId: z
      .string({
        required_error: 'Idea ID is required',
      })
      .uuid({
        message: 'Invalid idea ID format',
      })
      .optional(),
  }),
});

export const VoteValidation = {
deleteVoteValidationSchema,
getVoteStatsValidationSchema,
voteValidationSchema
}