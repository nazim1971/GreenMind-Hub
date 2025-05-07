import { Role } from "@prisma/client";
import { z } from "zod";

export const createUserZodSchema = z.object({
 body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
 })
});

const updateUserStatusSchema = z.object({
    body: z.object({
        isActive: z.boolean({
          required_error: 'isActive is required!',
        }),
      }),
  });

export  const userValidation = {
    createUserZodSchema,
    updateUserStatusSchema
}