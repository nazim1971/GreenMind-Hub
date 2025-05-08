import { sslService } from "./payment.utils";
import { JwtPayload } from "jsonwebtoken";
import { TPayment } from "./payment.interface";
import { PaymentStatus, Prisma } from "@prisma/client";
import { ConditionsBuilder } from "../../builder/conditionsBuilder";
import prisma from "../../shared/prisma";
import { PaginationHelper } from "../../builder/paginationBuilder";
import { paymentFields } from "./payment.constant";
import { StatusFullError } from "../../error/StatusFullError";

// create Payment
const createPaymentIntoDB = async (
  paymentData: TPayment,
  authUser: JwtPayload
) => {
  const idea = await prisma.idea.findUnique({
    where: {
      id: paymentData.ideaId,
      isDeleted: false,
    },
  });
  if (!idea) {
    throw new StatusFullError({
      name: "NotFoundError",
      message: "Idea not Found!",
      status: 404,
    });
  }

  const transactionId = sslService.generateTransactionId();

  paymentData.userEmail = authUser.email;
  paymentData.amount = idea.price!;
  paymentData.status = PaymentStatus.Pending;
  paymentData.transactionId = transactionId;

  // create the Payment
  const createdPayment = await prisma.payment.create({
    data: paymentData,
  });

  // initializaPayment
  const paymentUrl = await sslService.initializaPayment(
    createdPayment.amount,
    transactionId
  );

  return paymentUrl;
};

// get All Payments
const getAllPaymentsFromDB = async (query: Record<string, unknown>) => {
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelper.calculatePagination(query);

  let andConditions: Prisma.PaymentWhereInput[] = [];

  // Dynamically build query filters
  andConditions = ConditionsBuilder.prisma(query, andConditions, paymentFields);

  const whereConditions: Prisma.PaymentWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const result = await prisma.payment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
  });

  const count = await prisma.payment.count({
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

// getMemberPaymentsFromDB
const getMemberPaymentsFromDB = async (
  query: Record<string, unknown>,
  authUser: JwtPayload
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelper.calculatePagination(query);

  let andConditions: Prisma.PaymentWhereInput[] = [];

  // Dynamically build query filters
  andConditions = ConditionsBuilder.prisma(query, andConditions, paymentFields);

  andConditions.push({
    userEmail: authUser.email,
  });

  const whereConditions: Prisma.PaymentWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const result = await prisma.payment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
  });

  const count = await prisma.payment.count({
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

// getPaymentDetailsFromDB
const getPaymentDetailsFromDB = async (
  paymentId: string,
  authUser: JwtPayload
) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
      userEmail: authUser.email,
    },
  });

  if (!payment) {
    throw new StatusFullError({
      name: "NotFoundError",
      message: "payment not Found!",
      status: 404,
    });
  }

  return payment;
};

// validate Payment
const validatePayment = async (transactionId: string, authUser: JwtPayload) => {
  // this user will be exists as he/she passed the auth() middleware
  const payment = await prisma.payment.findUnique({
    where: {
      transactionId,
      userEmail: authUser.email,
    },
  });

  if (!payment) {
    throw new StatusFullError({
      name: "NotFoundError",
      message: "payment not Found!",
      status: 404,
    });
  }

  const result = await sslService.validatePayment(transactionId, authUser);

  return result;
};

export const paymentService = {
  createPaymentIntoDB,
  getAllPaymentsFromDB,
  getMemberPaymentsFromDB,
  getPaymentDetailsFromDB,
  // changePaymentStatusInDB,
  validatePayment,
};
