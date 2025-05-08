import { Request, Response } from 'express';
import { paymentService } from './payment.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { httpStatus } from '../../utils/httpStatus';

// create Payment
const createPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.createPaymentIntoDB(req.body, req.user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Payment initiated, pay quickly!',
    data: result,
  });
});

// get All Payments (admin)
const getAllPayments = async (req: Request, res: Response) => {
  const result = await paymentService.getAllPaymentsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Payments retrived succesfully!',
    data: result.data,
    meta: result.meta,
  });
};

// getMemberPayments
const getMemberPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.getMemberPaymentsFromDB(
    req.query,
    req.user
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Payments retrived succesfully!',
    data: result.data,
    meta: result.meta,
  });
});

// get Payment Details
const getPaymentDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.getPaymentDetailsFromDB(
    req.params.paymentId,
    req.user
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Payment retrived succesfully!',
    data: result,
  });
});


// validate Payment
const validatePayment = catchAsync(async (req: Request, res: Response) => {
  const transactionId = req.query.tran_id as string;
  const result = await paymentService.validatePayment(transactionId, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Payment validated succesfully!',
    data: result,
  });
});

export const paymentController = {
  createPayment,
  getAllPayments,
  getMemberPayments,
  getPaymentDetails,
  // changePaymentStatus,
  validatePayment,
};