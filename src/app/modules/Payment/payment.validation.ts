import { z } from 'zod';

// createPayment
const createPayment = z.object({
  body: z.object({
    ideaId: z
      .string({
        required_error: 'Amount is required!',
        invalid_type_error: 'Amount must be string!',
      })
      .trim(),
  }),
});

const validatePayment = z.object({
  query: z.object({
    tran_id: z.string({
      required_error: 'Transaction ID is required!',
      invalid_type_error: 'Transaction ID must be string!',
    }),
  }),
});

export const PaymentValidation = {
  createPayment,
  validatePayment
};