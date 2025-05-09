import { jwtHelpers } from './../../../helper/jwtHelper';
import prisma from "../../shared/prisma";
import * as bcrypt from "bcrypt";
import { CreateUserInput } from "./user.interface";
import { Prisma, Role, User } from "@prisma/client";
import config from "../../config";
import { defaultUserImage, userFields } from './user.constant';
import { CustomPayload } from '../../interfaces';
import { PaginationHelper } from '../../builder/paginationBuilder';
import { ConditionsBuilder } from '../../builder/conditionsBuilder';


//create user
const createUser = async (data: CreateUserInput) => {
  const hashPassword = await bcrypt.hash(data.password, config.salt);
   const image = defaultUserImage
  const userData = {
    ...data,
    image,
    role: Role.MEMBER,
    password: hashPassword,
  };

  const newUser = await prisma.user.create({
    data: userData,
  });

  return newUser;
};


//get my profile
const getMyProfile = async (user: CustomPayload) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: user?.email,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      image: true
    },
  });
  return userData;
};


//Update profile
const updateProfile = async (
  id: string,
  payload: Partial<CreateUserInput>
): Promise<{ accessToken: string; refreshToken: string }> => {
  const user = await prisma.user.update({
    where: { id, isActive: true },
    data: payload,
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: user.email,
      role: user.role,
      image: user?.image || defaultUserImage,
      name: user.name,
    },
    config.jwtS,
    config.jwtExp
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: user.email,
      role: user.role,
      image: user?.image || defaultUserImage,
      name: user.name,
    },
    config.refreshS,
    config.refreshExp
  );

  return {
    accessToken,
    refreshToken,
  };
};

// getAllUsersFromDB
const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelper.calculatePagination(query);

  let andConditions: Prisma.UserWhereInput[] = [];

  // Dynamically build query filters
  andConditions = ConditionsBuilder.prisma(query, andConditions, userFields);

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: { votes: true, payments: true, comments: true, ideas: true },
  });

  const count = await prisma.user.count({
    where: whereConditions,
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


//get single user
const getSingleUserFromDB = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findUniqueOrThrow({
    where: { id, isActive: true },
  });
  return result;
};

// updateUserActiveStatus
const updateUserActiveStatus = async (
  userId: string,
  payload: { isActive: boolean; role: Role }
) => {

  console.log("UserId", {userId});
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const result = await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: payload,
  });
  return result;
};


export const userService = {
  createUser,
  getMyProfile,
  updateProfile,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserActiveStatus,
};
