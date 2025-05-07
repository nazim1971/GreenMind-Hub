import { Category, Prisma } from "@prisma/client";
import prisma from "../../shared/prisma";
import { PaginationHelper } from "../../builder/paginationBuilder";
import { ConditionsBuilder } from "../../builder/conditionsBuilder";
import { CategoryFields } from "./category.constants";


// createCategoryIntoDB
const createCategoryIntoDB = async (payload: {name: string}) => {
    const result = await prisma.category.create({
      data: payload,
    });
  
    return result;
  };

// getAllCategoriesFromDB
const getAllCategoriesFromDB = async (query: Record<string, unknown>) => {
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelper.calculatePagination(query);

  let andConditions: Prisma.CategoryWhereInput[] = [];

  andConditions = ConditionsBuilder.prisma(
    query,
    andConditions,
    CategoryFields
  );

  const whereConditions: Prisma.CategoryWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.category.findMany({
    where: {
      ...whereConditions,
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });

  const count = await prisma.category.count({
    where: {
      ...whereConditions,
    },
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

export const CategoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
};