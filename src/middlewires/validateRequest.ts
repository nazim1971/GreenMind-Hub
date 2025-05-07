import { AnyZodObject } from "zod";
import { catchAsync } from "../app/shared/catchAsync";

const validateRequest = (schema: AnyZodObject) =>
  catchAsync(async (req,_res, next) => {
    await schema.parseAsync(req);
    next();
  });

export default validateRequest;
