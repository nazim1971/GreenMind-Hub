import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../../middlewires/validateRequest";
import { userValidation } from "./user.validation";
import { Role } from "@prisma/client";
import auth from "../../../middlewires/auth";
import { parseSingleImageWithData } from "../../../utils/photoUploader";

const router = express.Router();

router.post(
  "/",
  validateRequest(userValidation.createUserZodSchema),
  userController.createUser
);

router.patch(
  "/profile",
  auth(Role.ADMIN, Role.MEMBER),
  ...parseSingleImageWithData(),
  userController.updateProfile
);

router.get("/me", auth(Role.ADMIN, Role.MEMBER), userController.getMyProfile);

router.get("/users", auth(Role.ADMIN), userController.getAllUsers);

router.get("/user/:id", auth(Role.ADMIN), userController.getSingleUser);

router.patch(
  "/user/:id/status",
  auth(Role.ADMIN),
  validateRequest(userValidation.updateUserStatusSchema),
  userController.updateUserActiveStatus
);

export const userRoutes = router;
