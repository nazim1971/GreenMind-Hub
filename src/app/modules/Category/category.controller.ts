
import { httpStatus } from '../../interfaces/httpStatus';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { CategoryService } from './category.service';

// createCategory
const createCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.createCategoryIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Category is created successfully',
    data: result,
  });
});

// getAllCategories
const getAllCategories = catchAsync(async (req, res) => {
  const result = await CategoryService.getAllCategoriesFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Category list retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
};