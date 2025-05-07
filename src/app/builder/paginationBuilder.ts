
import { globalPaginationOptions } from '../constant/pagination.constant';
import pick from '../shared/pick';


export type TPaginationOptions = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type TPaginationReturn = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
};

const calculatePagination = (
  query: Record<string, unknown>
): TPaginationReturn => {
  const options: TPaginationOptions = pick(query, globalPaginationOptions);

  const page: number = Number(options?.page) || 1;
  const limit: number = Number(options?.limit) || 10;

  const skip: number = (page - 1) * limit;

  const sortBy: string = options?.sortBy || 'createdAt';
  const sortOrder: 'asc' | 'desc' = options?.sortOrder || 'desc';

  return { page, limit, skip, sortBy, sortOrder };
};

export const PaginationHelper = {
  calculatePagination,
};