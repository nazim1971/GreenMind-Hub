/* eslint-disable no-console */
import SSLCommerzPayment from 'sslcommerz-lts';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';
import { PaymentStatus } from '@prisma/client';
import { StatusFullError } from '../../error/StatusFullError';
import { httpStatus } from '../../interfaces/httpStatus';
import prisma from '../../shared/prisma';

const generateTransactionId = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const randomString = Math.random().toString(36).substring(2, 12);
  return `${timestamp}-${randomString}`;
};

const store_id = config.sslStoreId;
const store_password = config.sslStorePassword;
const is_live = false; // true for live, false for sandbox

// SSLCommerz init
const initializaPayment = async (total_amount: number, tran_id: string) => {
  const data = {
    total_amount,
    currency: 'BDT',
    tran_id, // Use unique tran_id for each API call
    success_url: `${config.sslValidationApi}?tran_id=${tran_id}`,
    fail_url: config.sslFailUrl,
    cancel_url: config.sslCancelUrl,
    ipn_url: 'http://localhost:5000/api/ssl/ipn',
    shipping_method: 'Courier',
    product_name: 'N/A.',
    product_category: 'N/A',
    product_profile: 'general',
    cus_name: 'N/A',
    cus_email: 'N/A',
    cus_add1: 'Dhaka',
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '01711111111',
    cus_fax: '01711111111',
    ship_name: 'N/A',
    ship_add1: 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  };

  const sslcz = new SSLCommerzPayment(store_id, store_password, is_live);

  try {
    const apiResponse = await sslcz.init(data);

    // Redirect the user to the payment gateway
    const GatewayPageURL = apiResponse.GatewayPageURL;

    if (GatewayPageURL) {
      return GatewayPageURL;
    } else {
      throw new StatusFullError({
        name: 'InternalServerError',
      message: 'Bad gateway',
      status: httpStatus.INTERNAL_SERVER_ERROR
      });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    throw new StatusFullError({
        name: 'InternalServerError',
      message: 'An error occurred while processing payment!',
      status: httpStatus.INTERNAL_SERVER_ERROR
      });
  }
};

// validate Payment
const validatePayment = async (
  tran_id: string,
  authUser: JwtPayload
  //   rental: TRental,
) => {
  const sslcz = new SSLCommerzPayment(store_id, store_password, is_live);

  const validationResponse = await sslcz.transactionQueryByTransactionId({
    tran_id,
  });

  let data;

  if (
    validationResponse.element[0].status === 'VALID' ||
    validationResponse.element[0].status === 'VALIDATED'
  ) {
    data = {
      status: PaymentStatus.Paid,
      gatewayResponse: validationResponse.element[0],
    };
  } else if (validationResponse.element[0].status === 'INVALID_TRANSACTION') {
    data = {
      status: PaymentStatus.Failed,
      gatewayResponse: validationResponse.element[0],
    };
  } else {
    data = {
      status: PaymentStatus.Failed,
      gatewayResponse: validationResponse.element[0],
    };
  }

  const updatedPayment = await prisma.payment.update({
    where: {
      transactionId: tran_id,
      userEmail: authUser.email,
    },
    data: data,
  });

  if (!updatedPayment) {
    throw new StatusFullError({
      name: "NotModifiedError",
      message: "Payment not updated!",
      status: 400, 
    });
  }
  
  if (data.status === PaymentStatus.Failed) {
    throw new StatusFullError({
      name: "PaymentFailedError",
      message: "Payment failed!",
      status: 400, 
    });
  }


  return updatedPayment;
};

export const sslService = {
  generateTransactionId,
  initializaPayment,
  validatePayment,
};