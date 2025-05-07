import { Prisma } from '@prisma/client';
import { ideaSearchableFields } from './idea.constants';
import { TIdeaFilterParams } from './idea.interface';

export const ideaFilters = (
  params?: TIdeaFilterParams
): Prisma.IdeaWhereInput | undefined => {
  if (!params) return undefined;

  const { searchTerm, minPrice, maxPrice, ...restFilters } = params;

  const andConditions: Prisma.IdeaWhereInput[] = [];

  // handle all searchTerm here by OR condition
  if (searchTerm) {
    andConditions.push({
      OR: ideaSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // handle minPricee here by AND condition
  if (minPrice) {
    andConditions.push({
      AND: [
        {
          price: {
            gte: minPrice,
          },
        },
      ],
    });
  }
  // handle maxPrice here by AND condition
  if (maxPrice) {
    andConditions.push({
      AND: [
        {
          price: {
            lte: maxPrice,
          },
        },
      ],
    });
  }

  // handle all restFilters here by AND condition
  if (Object.keys(restFilters).length > 0) {
    if (
      typeof restFilters.isPaid === 'string' &&
      restFilters.isPaid === 'true'
    ) {
      restFilters.isPaid = true;
    } else if (
      typeof restFilters.isPaid === 'string' &&
      restFilters.isPaid === 'false'
    ) {
      restFilters.isPaid = false;
    }

    andConditions.push({
      AND: Object.keys(restFilters).map((key) => {
        return {
          [key]: { equals: restFilters[key as keyof typeof restFilters] },
        };
      }),
    });
  }

  andConditions.push({ isDeleted: false });

  const whereConditions: Prisma.IdeaWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  return whereConditions;
};