
import { z } from "zod";

// draftAnIdea
const draftAnIdea = z.object({
    body: z.object({
      title: z
        .string({
          required_error: 'Title is required!',
          invalid_type_error: 'Title must be string!',
        })
        .trim()
        .min(10, { message: 'Title must have minimum 10 characters!' })
        .max(60, { message: "Title can't exceed 60 characters!" }),
  
      problemStatement: z
        .string({
          invalid_type_error: 'Problem Statement must be string!',
        })
        .trim()
        .optional(),
  
      solution: z
        .string({
          invalid_type_error: 'Solution must be string!',
        })
        .trim()
        .optional(),
  
      description: z
        .string({
          invalid_type_error: 'Description must be string!',
        })
        .trim()
        .optional(),
  
      price: z
        .number({
          invalid_type_error: 'Price must be number!',
        })
        .optional(),
  
      categoryId: z
        .string({
          invalid_type_error: 'Category Id must be number!',
        })
        .optional(),
    }),
  });
  
  // createAnIdea
  const createAnIdea = z.object({
    body: z.object({
      title: z
        .string({
          required_error: 'Title is required!',
          invalid_type_error: 'Title must be string!',
        })
        .trim()
        .min(10, { message: 'Title must have minimum 10 characters!' })
        .max(60, { message: "Title can't exceed 60 characters!" }),
  
      problemStatement: z
        .string({
          required_error: 'Problem Statement is required!',
          invalid_type_error: 'Problem Statement must be string!',
        })
        .trim(),
  
      solution: z
        .string({
          required_error: 'Solution is required!',
          invalid_type_error: 'Solution must be string!',
        })
        .trim(),
  
      description: z
        .string({
          required_error: 'Description is required!',
          invalid_type_error: 'Description must be string!',
        })
        .trim(),
  
      price: z.number({
        required_error: 'Price is required!',
        invalid_type_error: 'Price must be string!',
      }),
  
      categoryId: z.string({
        required_error: 'Category Id is required!',
        invalid_type_error: 'Category Id must be number!',
      }),
    }),
  });

  const updateIdea = z.object({
    body: z.object({
      title: z.string().trim().min(10).max(60).optional(),
      problemStatement: z.string().trim().optional(),
      solution: z.string().trim().optional(),
      description: z.string().trim().optional(),
      price: z.number().optional(),
      categoryId: z.string().optional(),
      images: z.array(z.string()).optional(), // assuming image URLs
    }),
  });

  const updateIdeaStatus = z.object({
    body: z.object({
      status: z.enum(['DRAFT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'])
    }),
  });
  
  export const IdeaValidation = {
    draftAnIdea,
    createAnIdea,
    updateIdea,
    updateIdeaStatus
  };