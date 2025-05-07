import { z } from 'zod';

const createCategorySchema = z.object({
    body: z.object({
      name: z.string().min(1, "Title is required"),
    }),
  });

  
export const CategoryValidation = {
    createCategorySchema
}