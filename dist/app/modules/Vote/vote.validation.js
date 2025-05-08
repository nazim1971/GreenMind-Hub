"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteValidation = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const voteValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        ideaId: zod_1.z
            .string({
            required_error: 'Idea ID is required',
        })
            .uuid({
            message: 'Invalid idea ID format',
        }),
        type: zod_1.z.enum([client_1.VoteType.UP, client_1.VoteType.DOWN], {
            required_error: 'Vote type is required',
            invalid_type_error: 'Vote type must be either UP or DOWN',
        }),
    }),
});
exports.VoteValidation = {
    voteValidationSchema
};
