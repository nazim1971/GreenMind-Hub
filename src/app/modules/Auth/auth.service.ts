import prisma from "../../shared/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtHelpers } from "../../../helper/jwtHelper";
import config from "../../config";
import emailSender from "../../../helper/emailSender";
import { StatusFullError } from '../../error/StatusFullError';

const loginUser = async (payload: { email: string; password: string }) => {
  console.log("User login");
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      isActive: true
    },
  });
  console.log({ payload });

  const isPasswordCorrect: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );
  if (!isPasswordCorrect) {
    throw new Error("Password Incorrect");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
      name: userData.name
    },
    config.jwtS,
    config.jwtExp
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
      name: userData.name
    },
    config.refreshS,
    config.refreshExp
  );

  return {
    accessToken,
    refreshToken
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(token, config.refreshS) as JwtPayload;
  } catch (error) {
    throw new Error("You are not authorized");
  }
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      isActive: true
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
      name: userData.name
    },
    config.jwtS,
    config.jwtExp
  );

  return {
    accessToken,
    refreshToken
  };
};

const changePassword = async (user: any, payload: any) => {
  console.log("user", user, "payload", payload);
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: user.email,
      isActive: true
    },
  });
  const isPasswordCorrect: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );
  if (!isPasswordCorrect) {
    throw new Error("Password Incorrect");
  }
  const hasedPass: string = await bcrypt.hash(payload.newPassword, 12);
  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hasedPass
    },
  });
  return {
    message: "Password changed successfully",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: payload.email,
      isActive: true
    },
  });

  const resetPassToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
      name: userData.name
    },
    config.resetPassS,
    config.resetPassExp
  );

  console.log({ resetPassToken });
  const resetPassLink =
    config.resetPassLink + `?userId=${userData.id}&token=${resetPassToken}`;

  await emailSender(
    userData.email,

    `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f9fa;">
    <h2 style="color: #333;">Password Reset Request</h2>
    <p>Hello <strong>${userData.email}</strong>,</p>
    <p>We received a request to reset your password. Click the button below to reset it:</p>
    <a href="${resetPassLink}" style="
      display: inline-block;
      padding: 10px 20px;
      margin-top: 10px;
      background-color: #007bff;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
    ">Reset Password</a>
    <p style="margin-top: 20px;">If you didn't request this, you can ignore this email.</p>
    <p>Thanks,<br/>Your Support Team</p>
  </div>
    `
  );
  console.log(resetPassLink);
  // http://localhost:5000/reset-pass?
};

const resetPassword = async (
  token: string,
  payload: {
    id: string;
    password: string;
  }
) => {
  const userData = await prisma.user.findFirstOrThrow({
    where:{
      id: payload?.id,
      isActive: true
    }
  })

  const isValidToken = jwtHelpers.verifyToken(token, config.resetPassS);
  console.log({isValidToken});
  if (!isValidToken) {
    throw new StatusFullError({
      name: 'ForbiddenError',
      message: 'Forbidden',
      status: 403,
      success: false,
    });
  }
  

  const hasedPass: string = await bcrypt.hash(payload.password, 12);
  await prisma.user.update({
    where:{
      id: userData.id
    },
    data: {
      password: hasedPass
    }
  })
};

export const authServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
