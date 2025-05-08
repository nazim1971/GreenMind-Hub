import { Router } from 'express';
import { paymentController } from './payment.controller';
import { paymentValidation } from './payment.validation';
import validateRequest from '../../middlewares/validateRequest';
import { auth } from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

router.post(
  '/',
  auth(Role.MEMBER),
  validateRequest(paymentValidation.createPayment),
  paymentController.createPayment
);

router.get('/', auth(Role.ADMIN), paymentController.getAllPayments);

router.get('/member', auth(Role.MEMBER), paymentController.getMemberPayments);

router.get(
  '/details/:paymentId',
  auth(Role.MEMBER, Role.ADMIN),
  paymentController.getPaymentDetails
);

// router.patch(
//   '/:paymentId/status',
//   auth(Role.ADMIN),
//   validateRequest(PaymentValidation.changePaymentStatus),
//   PaymentController.changePaymentStatus
// );

router.patch(
  '/validate',
  auth(Role.MEMBER, Role.ADMIN),
  validateRequest(paymentValidation.validatePayment),
  paymentController.validatePayment
);

export const paymentRoutes = router;