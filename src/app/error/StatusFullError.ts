// src/errors/StatusFullError.ts
import { TErrorName, TStatusCode } from "../interfaces/error";

export class StatusFullError extends Error {
  public readonly success: boolean;
  public readonly status: TStatusCode;
  public readonly path: string;

  constructor({
    name,
    message,
    status,
    path = "",
    success = false,
  }: {
    name: TErrorName;
    message: string;
    status: TStatusCode;
    path?: string;
    success?: boolean;
  }) {
    super(message);

    this.name = name;
    this.message = message;
    this.status = status;
    this.path = path;
    this.success = success;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
