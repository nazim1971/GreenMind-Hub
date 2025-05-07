import httpStatus  from 'http-status';
import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { authServices } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";



const loginUser = catchAsync(async (req, res) =>{
    const {refreshToken,accessToken} = await authServices.loginUser(req.body)
    
    res.cookie('refreshToken', refreshToken,{
        secure: false,
        httpOnly: true
    })
    res.cookie('accessToken', accessToken,{
        secure: false,
        httpOnly: true
    })

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Successfully login",
        data: {
            accessToken,
            refreshToken
        }

    })
})

const refreshToken = catchAsync(async (req, res) =>{
    const {refreshToken} = req.cookies;
    const result = await authServices.refreshToken(refreshToken)
  
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Access Token generated Successfully",
        data: result
    })
})

const changePassword = catchAsync(async (req, res) =>{
    const user = req.user
    console.log("req",req?.user);
    const result = await authServices.changePassword(user, req.body)
  
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password changed Successfully ",
        data: result

    })
})


const forgotPassword = catchAsync(async (req, res) =>{
    const user = req.user
    console.log("req",req?.user);
    const result = await authServices.forgotPassword(req.body)
  
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Please Check your email!"
    })
})

const resetPassword = catchAsync(async (req: Request, res: Response) =>{
    const token = req.headers.authorization || "";
    console.log("req.body",req.body);
    const result = await authServices.resetPassword(token, req.body)
  
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password reset successfully",
        data: result

    })
})

export const authController = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
}