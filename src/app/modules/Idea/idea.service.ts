import { Idea, IdeaStatus } from '@prisma/client';
import { CustomPayload } from '../../interfaces';
import { TIdeaFilterParams, TIdeaPayload } from './idea.interface';
import prisma from '../../shared/prisma';
import { PaginationHelper } from '../../builder/paginationBuilder';
import { ideaFilters } from './idea.utils';


// draftAnIdeaIntoDB
const draftAnIdeaIntoDB = async (userData: CustomPayload, payload: TIdeaPayload) => {
  payload.price = payload.price ? Number(payload.price) : 0;
  payload.authorId = userData.id;
  payload.isPaid = payload.price > 0;

  if (payload.id) {
    return await prisma.idea.upsert({
      where: { id: payload.id },
      update: payload,
      create: payload,
    });
  } else {
    return await prisma.idea.create({
      data: payload,
    });
  }
};

// createAnIdeaIntoDB
const createAnIdeaIntoDB = async (userData: CustomPayload, payload: TIdeaPayload) => {
  payload.price = Number(payload.price);
  payload.authorId = userData.id;
  payload.status = IdeaStatus.UNDER_REVIEW;
  payload.isPaid = payload.price > 0;

  if (payload.id) {
    return await prisma.idea.upsert({
      where: { id: payload.id },
      update: payload,
      create: payload,
    });
  } else {
    return await prisma.idea.create({
      data: payload,
    });
  }
};

// getAllIdeasFromDB
const getAllIdeasFromDB = async (
  params?: TIdeaFilterParams,
  options?: any
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    PaginationHelper.calculatePagination(options);

  const filterOptions = ideaFilters(params);

  const result = await prisma.idea.findMany({
    where: { ...filterOptions, status: IdeaStatus.APPROVED },
    skip,
    take: limit,
    orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
    include: {
      votes: true,
      author: true,
      category: true,
      comments: true,
      payments: true,
    },
  });

  const count = await prisma.idea.count({
    where: { ...filterOptions, status: IdeaStatus.APPROVED },
  });

  return {
    meta: {
      page,
      limit,
      total: count,
      totalPage: Math.ceil(count / limit),
    },
    data: result,
  };
};

// getOwnAllIdeasFromDB
const getOwnAllIdeasFromDB = async (
  params?: TIdeaFilterParams,
  options?: any,
  user?: CustomPayload
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    PaginationHelper.calculatePagination(options);
  const filterOptions = ideaFilters(params);

  const whereOptions = { authorId: user?.id, ...filterOptions };

  const result = await prisma.idea.findMany({
    where: whereOptions,
    skip,
    take: limit,
    orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
    include: {
      votes: true,
      author: true,
      category: true,
      comments: true,
      payments: true,
    },
  });

  const count = await prisma.idea.count({ where: whereOptions });

  return {
    meta: {
      page,
      limit,
      total: count,
      totalPage: Math.ceil(count / limit),
    },
    data: result,
  };
};

// getSingleIdeaFromDB
const getSingleIdeaFromDB = async (id: string): Promise<Idea | null> => {
  return await prisma.idea.findUnique({
    where: { id },
    include: {
      author: true,
      category: true,
      votes: {
        include: {
          user: true,
        },
      },
      payments: true,
      comments: {
        where: { parentId: null },
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
        orderBy: { createdAt: 'asc' },
      },
    },
  });
};

// updateIdeaFromDB
const updateIdeaFromDB = async (
  id: string,
  payload: Partial<Idea>
): Promise<Idea | null> => {
  return await prisma.idea.update({
    where: {
      id,
      isDeleted: false,
      OR: [
        { status: IdeaStatus.DRAFT },
        { status: IdeaStatus.UNDER_REVIEW },
      ],
    },
    data: payload,
  });
};

// deleteAnIdeaFromDB
const deleteAnIdeaFromDB = async (id: string) => {
  return await prisma.idea.update({
    where: { id, isDeleted: false },
    data: { isDeleted: true },
  });
};

// Exporting all functions as a flat service
export const IdeaService = {
  draftAnIdeaIntoDB,
  createAnIdeaIntoDB,
  getAllIdeasFromDB,
  getOwnAllIdeasFromDB,
  getSingleIdeaFromDB,
  updateIdeaFromDB,
  deleteAnIdeaFromDB,
};
