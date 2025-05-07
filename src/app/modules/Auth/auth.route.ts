import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../../middlewires/auth";
import { Role } from "@prisma/client";


const router  = Router();

router.post('/login',authController.loginUser)
router.post('/refreshToken',authController.refreshToken)
router.put('/change-password',auth(Role.ADMIN,Role.MEMBER),authController.changePassword)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)

export const AuthRouter = router