// src/utils/handlePrismaError.ts
import { Prisma } from "@prisma/client";
import { StatusFullError } from "./StatusFullError";

export function handlePrismaError(error: unknown) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    const fields = (error.meta?.target as string[])?.join(", ");
    throw new StatusFullError({
        name: "DuplicateError",
        message: `Duplicate entry: ${fields} must be unique`,
        status: 400,
        path: "prismaError", // optional
      });
  }

  // Rethrow unknown errors
  throw error;
}
