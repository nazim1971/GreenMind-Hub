"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../../middlewires/auth"));
const validateRequest_1 = __importDefault(require("../../../middlewires/validateRequest"));
const payment_validation_1 = require("./payment.validation");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(client_1.Role.MEMBER), (0, validateRequest_1.default)(payment_validation_1.PaymentValidation.createPayment), payment_controller_1.paymentController.createPayment);
router.get('/', (0, auth_1.default)(client_1.Role.ADMIN), payment_controller_1.paymentController.getAllPayments);
router.get('/member', (0, auth_1.default)(client_1.Role.MEMBER), payment_controller_1.paymentController.getMemberPayments);
router.get('/details/:paymentId', (0, auth_1.default)(client_1.Role.MEMBER, client_1.Role.ADMIN), payment_controller_1.paymentController.getPaymentDetails);
// router.patch(
//   '/:paymentId/status',
//   auth(Role.ADMIN),
//   validateRequest(PaymentValidation.changePaymentStatus),
//   PaymentController.changePaymentStatus
// );
router.patch('/validate', (0, auth_1.default)(client_1.Role.MEMBER, client_1.Role.ADMIN), (0, validateRequest_1.default)(payment_validation_1.PaymentValidation.validatePayment), payment_controller_1.paymentController.validatePayment);
exports.paymentRoutes = router;
