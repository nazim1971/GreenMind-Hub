"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdeaValidation = void 0;
const zod_1 = require("zod");
// draftAnIdea
const draftAnIdea = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({
            required_error: 'Title is required!',
            invalid_type_error: 'Title must be string!',
        })
            .trim()
            .min(10, { message: 'Title must have minimum 10 characters!' })
            .max(60, { message: "Title can't exceed 60 characters!" }),
        problemStatement: zod_1.z
            .string({
            invalid_type_error: 'Problem Statement must be string!',
        })
            .trim()
            .optional(),
        solution: zod_1.z
            .string({
            invalid_type_error: 'Solution must be string!',
        })
            .trim()
            .optional(),
        description: zod_1.z
            .string({
            invalid_type_error: 'Description must be string!',
        })
            .trim()
            .optional(),
        price: zod_1.z
            .number({
            invalid_type_error: 'Price must be number!',
        })
            .optional(),
        categoryId: zod_1.z
            .string({
            invalid_type_error: 'Category Id must be number!',
        })
            .optional(),
    }),
});
// createAnIdea
const createAnIdea = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({
            required_error: 'Title is required!',
            invalid_type_error: 'Title must be string!',
        })
            .trim()
            .min(10, { message: 'Title must have minimum 10 characters!' })
            .max(60, { message: "Title can't exceed 60 characters!" }),
        problemStatement: zod_1.z
            .string({
            required_error: 'Problem Statement is required!',
            invalid_type_error: 'Problem Statement must be string!',
        })
            .trim(),
        solution: zod_1.z
            .string({
            required_error: 'Solution is required!',
            invalid_type_error: 'Solution must be string!',
        })
            .trim(),
        description: zod_1.z
            .string({
            required_error: 'Description is required!',
            invalid_type_error: 'Description must be string!',
        })
            .trim(),
        price: zod_1.z.number({
            required_error: 'Price is required!',
            invalid_type_error: 'Price must be string!',
        }),
        categoryId: zod_1.z.string({
            required_error: 'Category Id is required!',
            invalid_type_error: 'Category Id must be number!',
        }),
    }),
});
const updateIdea = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().trim().min(10).max(60).optional(),
        problemStatement: zod_1.z.string().trim().optional(),
        solution: zod_1.z.string().trim().optional(),
        description: zod_1.z.string().trim().optional(),
        price: zod_1.z.number().optional(),
        categoryId: zod_1.z.string().optional(),
        images: zod_1.z.array(zod_1.z.string()).optional(), // assuming image URLs
    }),
});
const updateIdeaStatus = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['DRAFT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'])
    }),
});
exports.IdeaValidation = {
    draftAnIdea,
    createAnIdea,
    updateIdea,
    updateIdeaStatus
};
