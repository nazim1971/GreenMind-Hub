
import { paymentService } from './payment.service';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { httpStatus } from '../../interfaces/httpStatus';

// create Payment
const createPayment = catchAsync(async (req, res) => {
  const result = await paymentService.createPaymentIntoDB(req.body, req.user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Payment initiated, pay quickly!',
    data: result,
  });
});



const getAllPayments = catchAsync(async (req, res) => {
    const result = await paymentService.getAllPaymentsFromDB(req.query);
  
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Payments retrieved successfully!',
      data: result.data,
      meta: result.meta,
    });
  });
  

// getMemberPayments
const getMemberPayments = catchAsync(async (req, res) => {
  const result = await paymentService.getMemberPaymentsFromDB(
    req.query,
    req.user
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payments retrived succesfully!',
    data: result.data,
    meta: result.meta,
  });
});

// get Payment Details
const getPaymentDetails = catchAsync(async (req, res) => {
  const result = await paymentService.getPaymentDetailsFromDB(
    req.params.paymentId,
    req.user
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment retrived succesfully!',
    data: result,
  });
});


// validate Payment
const validatePayment = catchAsync(async (req, res) => {
  const transactionId = req.query.tran_id as string;
  const result = await paymentService.validatePayment(transactionId, req.user);

  sendResponse(res, {
    success: true,
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