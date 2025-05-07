import { NextFunction, Request, Response, Router } from "express";
import auth from "../../../middlewires/auth";
import { Role } from "@prisma/client";
import validateRequest from "../../../middlewires/validateRequest";
import { IdeaValidation } from "./idea.validation";
import { IdeaController } from "./idea.controller";
import { parseMultipleImagesWithData } from "../../../utils/photoUploader";

const IdeaRoute: Router = Router();

IdeaRoute.post(
  "/draft",
  auth(Role.MEMBER, Role.ADMIN),
  parseMultipleImagesWithData(),
  validateRequest(IdeaValidation.draftAnIdea),
  IdeaController.draftAnIdea
);

IdeaRoute.post(
  "/",
  auth(Role.MEMBER, Role.ADMIN),
  parseMultipleImagesWithData(),
  validateRequest(IdeaValidation.createAnIdea),
  IdeaController.createAnIdea
);

IdeaRoute.get("/me", auth(Role.MEMBER, Role.ADMIN), IdeaController.getOwnAllIdeas);

IdeaRoute.get("/", IdeaController.getAllIdeas);

IdeaRoute.get("/:id", IdeaController.getSingleIdea);

IdeaRoute.put(
  "/:id",
  auth(Role.MEMBER, Role.ADMIN),
  parseMultipleImagesWithData(),
  IdeaController.updateAIdea
);

IdeaRoute.delete("/:id", auth(Role.ADMIN,Role.MEMBER),IdeaController.deleteAIdea);

export default IdeaRoute;
