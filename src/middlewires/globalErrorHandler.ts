import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import { StatusFullError } from "../app/error/StatusFullError";
import { handlePrismaError } from "../app/error/prismaDuplicate.error";
import { ZodError } from "zod";
import handleZodError from "../app/error/zod.error";
import { handlePrismaNotFoundError } from "../app/error/prismaNotFound.error";

// ✅ Explicit typing
export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Let handlePrismaError convert known Prisma errors to StatusFullError
    handlePrismaError(error);
  } catch (handledError) {
    error = handledError;
  }
  if (handlePrismaNotFoundError(error, res)) return

   // Handle Zod validation error
   if (error instanceof ZodError) {
    const zodFormatted = handleZodError(error);
    res.status(zodFormatted.statusCode).json({
      success: false,
      status: zodFormatted.statusCode,
      message: zodFormatted.message,
      error: zodFormatted.error,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
    return;
  }

  if (error instanceof StatusFullError) {
    res.status(error.status).json({
      success: error.success,
      status: error.status,
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
    return;
  }

  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    status: httpStatus.INTERNAL_SERVER_ERROR,
    message: error?.message || "Something went wrong",
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};
