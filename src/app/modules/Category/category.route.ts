import { Router } from 'express';
import { CategoryController } from './category.controller';
import { Role } from '@prisma/client';
import auth from '../../../middlewires/auth';

const CategoryRoute = Router();

CategoryRoute.post('/', auth(Role.ADMIN), CategoryController.createCategory);

CategoryRoute.get('/', CategoryController.getAllCategories);

export default CategoryRoute;