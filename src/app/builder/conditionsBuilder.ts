import { globalQueryOptions } from "../constant/pagination.constant";
import { TModelFieldsType } from "../interfaces/globalTypes";
import pick from "../shared/pick";


const buildConditionsForPrisma = (
  query: Record<string, unknown>,
  andConditions: Array<Record<string, unknown>>,
  fields: TModelFieldsType
) => {
  const filterFields = pick(query, [
    ...globalQueryOptions,
    ...(fields.filterableStringFields as []),
    ...(fields.filterableNumberFields as []),
    ...(fields.filterableBooleanFields as []),
  ]);
  const { searchTerm, ...filterData } = filterFields;

  /* Convert String to Number type */
  if (filterData && (fields.filterableNumberFields as [])) {
    for (const key of fields.filterableNumberFields as []) {
      if (Object.hasOwnProperty.call(filterData, key)) {
        filterData[key] = Number(filterData[key]);
      }
    }
  }

  /* Convert String to Boolean type */
  if (filterData && (fields.filterableBooleanFields as [])) {
    for (const key of fields.filterableBooleanFields as []) {
      if (Object.hasOwnProperty.call(filterData, key)) {
        filterData[key] = Boolean(filterData[key]);
      }
    }
  }

  /* Search */
  if (searchTerm) {
    andConditions.push({
      OR: (fields.searchable as []).map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  /* Filter */
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key] as string | number | boolean,
        },
      })),
    });
  }

  return andConditions;
};

export const ConditionsBuilder = {
  prisma: buildConditionsForPrisma,
};