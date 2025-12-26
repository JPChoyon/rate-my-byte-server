import { Category } from "../../../generated/prisma";
import prisma from "../../utils/prismaProvider";

const createCategoty = async (payload: Category) => {
  const isCategoryExist = await prisma.category.findUnique({
    where: { name: payload?.name },
  });
  if (isCategoryExist) {
    throw new Error("Category already exist");
  }
  const result = await prisma.category.create({
    data: payload,
  });
  return result;
};

const getAllCategory = async (paginateQuery: Record<string, unknown>) => {
  const { page = 1, limit = 10 } = paginateQuery;
  const skip = (Number(page) - 1) * Number(limit);
  const result = await prisma.category.findMany({
    take: Number(limit),
    skip,
  });
  return {
    data: result,
    meta: {
      total: await prisma.category.count({}),
      page: Number(page),
      limit: Number(limit),
      totalPage: Math.ceil((await prisma.category.count({})) / Number(limit)),
    },
  };
};

export const categoryServices = {
  createCategoty,
  getAllCategory,
};
