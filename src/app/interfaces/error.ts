export type TErrorName =
  | "ValidationError"
  | "NotFoundError"
  | "UnauthorizedError"
  | "ForbiddenError"
  | "InternalServerError"
  | "DuplicateError";

export type TStatusCode = 200 | 400 | 401 | 403 | 404 | 500;
