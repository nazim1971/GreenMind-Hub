
import { Prisma } from "@prisma/client";
import { Response } from "express";
import httpStatus from "http-status";

export const handlePrismaNotFoundError = (
  error: unknown,
  res: Response
): boolean => {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    const causeMessage = error.meta?.cause as string;

    // Extract model name like "Customer", "Bike", etc.
    const modelMatch = causeMessage?.match(/No (\w+) found/i);
    const model = modelMatch?.[1] || "Resource";

    res.status(httpStatus.NOT_FOUND).json({
      success: false,
      status: httpStatus.NOT_FOUND,
      message: `${model} not found`,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });

    return true; // Handled
  }

  return false; // Not handled
};
