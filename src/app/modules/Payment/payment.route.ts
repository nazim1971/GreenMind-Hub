import { Router } from 'express';
import { paymentController } from './payment.controller';
import { Role } from '@prisma/client';
import auth from '../../../middlewires/auth';
import validateRequest from '../../../middlewires/validateRequest';
import { PaymentValidation } from './payment.validation';

const router = Router();

router.post(
  '/',
  auth(Role.MEMBER),
  validateRequest(PaymentValidation.createPayment),
  paymentController.createPayment
);

router.get('/', auth(Role.ADMIN), paymentController.getAllPayments);

router.get('/member', auth(Role.MEMBER), paymentController.getMemberPayments);

router.get(
  '/details/:paymentId',
  auth(Role.MEMBER, Role.ADMIN),
  paymentController.getPaymentDetails
);


router.patch(
  '/validate',
  auth(Role.MEMBER, Role.ADMIN),
  validateRequest(PaymentValidation.validatePayment),
  paymentController.validatePayment
);

export const paymentRoutes = router;