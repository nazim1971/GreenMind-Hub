"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidation = void 0;
const zod_1 = require("zod");
// createPayment
const createPayment = zod_1.z.object({
    body: zod_1.z.object({
        ideaId: zod_1.z
            .string({
            required_error: "Amount is required!",
            invalid_type_error: "Amount must be string!",
        })
            .trim(),
    }),
});
const validatePayment = zod_1.z.object({
    query: zod_1.z.object({
        tran_id: zod_1.z.string({
            required_error: "Transaction ID is required!",
            invalid_type_error: "Transaction ID must be string!",
        }),
    }),
});
exports.PaymentValidation = {
    createPayment,
    validatePayment,
};
