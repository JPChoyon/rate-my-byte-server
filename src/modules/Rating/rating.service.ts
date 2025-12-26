import status from "http-status";
import { Rating } from "../../../generated/prisma";
import AppError from "../../errors/AppError";

import prisma from "../../utils/prismaProvider";

const createRatingIntoDB = async (payload: Rating) => {
  const isRatingExist = await prisma.rating.findFirst({
    where: {
      userId: payload.userId,
      postId: payload.postId,
    },
  });
  if (isRatingExist) {
    throw new AppError(status.BAD_REQUEST, "You already rated this post");
  }
  const result = await prisma.rating.create({
    data: payload,
  });
  return result;
};

const getAllRating = async () => {
  const result = await prisma.rating.findMany({});
  return result;
};

const getSingleRating = async (id: string) => {
  const getSingleRatingresult = await prisma.rating.findUniqueOrThrow({
    where: { id },
  });
  return getSingleRatingresult;
};

export const RatingService = {
  createRatingIntoDB,
  getAllRating,
  getSingleRating,
};
