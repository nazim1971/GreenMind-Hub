import { userService } from "./user.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { httpStatus } from "../../interfaces/httpStatus";
import { sendImageToCloudinary } from "../../../helper/fileUploader";

//create user
const createUser = catchAsync(async (req, res) => {
  const result = await userService.createUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User created successfully',
    data: result,
  });
});

//Get my profile
const getMyProfile = catchAsync(async (req, res) => {
  const result = await userService.getMyProfile(req.user);
    console.log(result);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Profile fetched Successfully',
    data: result,
  });
});

//Update profile
const updateProfile = catchAsync(async (req, res) => {
  const payload = req.body;

  // Fetch current user profile
  const existingUser = await userService.getMyProfile(req?.user);

  if (req?.file) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e3);
    const imageName = `${uniqueSuffix}-${req.user?.email.split('@')[0]}`;
    const path = req.file?.buffer;

    const { secure_url } = await sendImageToCloudinary(imageName, path);
    payload.image = secure_url;
  } else {
    // Reuse existing image if no new image uploaded
    payload.image = existingUser?.image;
  }

  const { accessToken, refreshToken } = await userService.updateProfile(
    req?.user?.id,
    payload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Profile updated successfully',
    data: {
      accessToken,
      refreshToken,
    },
  });
});

// getAllUsers
const getAllUsers = catchAsync(async (req, res) => {
  const result = await userService.getAllUsersFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All users fetched successfully!",
    data: result.data,
    meta: result.meta,
  });
});

;

// Get single user
const getSingleUser = catchAsync(async (req, res) => {
  const result = await userService.getSingleUserFromDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User fetched Successfully',
    data: result,
  });
});


// updateUserActiveStatus
const updateUserActiveStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await userService.updateUserActiveStatus(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "message: 'Users updated Successfully'!",
    data: result,
  });
});


export const userController = {
  createUser,
  getMyProfile,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserActiveStatus
};
    