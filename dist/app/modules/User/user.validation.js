"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = exports.createUserZodSchema = void 0;
const zod_1 = require("zod");
exports.createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required"),
        email: zod_1.z.string().email("Invalid email address"),
        password: zod_1.z.string().min(6, "Password must be at least 6 characters")
    })
});
const updateUserStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        isActive: zod_1.z.boolean({
            required_error: 'isActive is required!',
        }),
    }),
});
exports.userValidation = {
    createUserZodSchema: exports.createUserZodSchema,
    updateUserStatusSchema
};
