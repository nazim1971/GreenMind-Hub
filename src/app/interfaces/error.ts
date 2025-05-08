export type TErrorName =
  | "ValidationError"
  | "NotFoundError"
  | "UnauthorizedError"
  | "ForbiddenError"
  | "InternalServerError"
  | "DuplicateError"
  | "NotModifiedError"
  | "PaymentFailedError"; // ✅ added new error names


export type TStatusCode = 200 | 400 | 401 | 403 | 404 | 500;
