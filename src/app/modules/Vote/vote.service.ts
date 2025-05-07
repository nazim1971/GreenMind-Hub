/* eslint-disable @typescript-eslint/no-explicit-any */
import { VoteType } from '@prisma/client';
import { IVotePayload, IVoteResponse, IVoteStats } from './vote.interface';
import prisma from '../../shared/prisma';
import { TIdeaFilterParams } from '../Idea/idea.interface';
import { PaginationHelper } from '../../builder/paginationBuilder';
import { ideaFilters } from '../Idea/idea.utils';


const createOrUpdateVote = async (
  userEmail: string,
  payload: IVotePayload
): Promise<IVoteResponse> => {
  const { ideaId, type } = payload;

  // Check if idea exists and is approved
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
  });

  if (!idea) {
    throw new Error("Idea not found")
  }

  if (idea.status !== 'APPROVED') {
    throw new Error('Cannot vote on ideas that are not approved');
  }
  const existingVote = await prisma.vote.findUnique({
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
      const updatedVote = await prisma.vote.update({
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
  const newVote = await prisma.vote.create({
    data: {
      userEmail,
      ideaId,
      type,
    },
  });
  return newVote;
};

const removeVote = async (userEmail: string, ideaId: string): Promise<void> => {
  // Check if idea exists
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
  });
  if (!idea) {
    throw new Error('Idea not found');
  }
  // Check if vote exists
  const vote = await prisma.vote.findUnique({
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
  await prisma.vote.delete({
    where: {
      userEmail_ideaId: {
        userEmail,
        ideaId,
      },
    },
  });
};

const getVoteStats = async (ideaId: string): Promise<IVoteStats> => {
  // Check if idea exists
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
  });
  if (!idea) {
    throw new Error('Idea not found');
  }
  // Count upvotes and downvotes
  const [upvotesCount, downvotesCount] = await Promise.all([
    prisma.vote.count({
      where: {
        ideaId,
        type: VoteType.UP,
      },
    }),
    prisma.vote.count({
      where: {
        ideaId,
        type: VoteType.DOWN,
      },
    }),
  ]);
  return {
    upvotes: upvotesCount,
    downvotes: downvotesCount,
    total: upvotesCount - downvotesCount,
  };
};

const getUserVote = async (
  userEmail: string,
  ideaId: string
): Promise<IVoteResponse | null> => {
  const vote = await prisma.vote.findUnique({
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
};

const getAllIdeasByVotes = async (
  params?: TIdeaFilterParams,
  options?: any
) => {
  const { limit, page, skip } = PaginationHelper.calculatePagination(options);
  const filterOptions = ideaFilters(params);

  // Get all ideas that match the filter criteria
  const ideas = await prisma.idea.findMany({
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
              type: VoteType.UP,
            },
          },
        },
      },
    },
  });

  // For each idea, get the vote counts
  const ideasWithVotes = await Promise.all(
    ideas.map(async (idea) => {
      const upvotes = await prisma.vote.count({
        where: {
          ideaId: idea.id,
          type: VoteType.UP,
        },
      });

      const downvotes = await prisma.vote.count({
        where: {
          ideaId: idea.id,
          type: VoteType.DOWN,
        },
      });

      return {
        ...idea,
        voteStats: {
          upvotes,
          downvotes,
          total: upvotes - downvotes,
        },
        // Adjust the structure to match your frontend expectations
        comments: idea.comments.length,
      };
    })
  );

  // Sort by total votes in descending order
  const sortedIdeas = ideasWithVotes.sort(
    (a, b) => b.voteStats.total - a.voteStats.total
  );

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
};

export const voteService = {
  createOrUpdateVote,
  removeVote,
  getUserVote,
  getVoteStats,
  getAllIdeasByVotes,
};