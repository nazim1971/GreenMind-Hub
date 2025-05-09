import { catchAsync } from "../app/shared/catchAsync";
import { CustomPayload } from "../app/interfaces";
import config from "../app/config";
import { jwtHelpers } from "../helper/jwtHelper";
import { Role } from "@prisma/client";
import { StatusFullError } from "../app/error/StatusFullError";
import prisma from "../app/shared/prisma";
import { isTIssuedBeforePassC } from "../helper/authHelper";

const auth = (...roles: Role[]) => {
  return catchAsync(async (req, _res, next) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new StatusFullError({
        name: "UnauthorizedError",
        message: "You are not authorized!",
        status: 401,
        path: req.originalUrl,
        success: false,
      });
    }

    // checking if the given token is valid
    const decoded = jwtHelpers.verifyToken(token, config.jwtS) as CustomPayload;
    req.user = decoded;
    const { email, role, iat } = decoded;

    // Check if user exists in the database
    const user = await prisma.user.findUnique({
      where: { email, isActive: true },
    });
    if (!user) {
      throw new StatusFullError({
        name: "UnauthorizedError",
        message: "User does not exist or is inactive.",
        status: 401,
        path: req.originalUrl,
        success: false,
      });
    }

    // Check if token was issued before the password was changed
    if (
      user.passwordChangedAt &&
      (await isTIssuedBeforePassC(
        user.passwordChangedAt,
        iat as number
      ))
    ) {
      throw new StatusFullError({
        name: "UnauthorizedError",
        message: "Token issued before password change. Please log in again.",
        status: 401,
        path: req.originalUrl,
        success: false,
      });
    }

    if (roles.length && !roles.includes(role as Role)) {
      throw new StatusFullError({
        success: false,
        name: "ForbiddenError",
        message: "You are not allowed to access this resource!",
        status: 403,
        path: req.originalUrl,
      });
    }

    // Attach the user object to the request
    req.user = { ...decoded, id: user.id };
    next();
  });
};

export default auth;
