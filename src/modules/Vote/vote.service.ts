import { Vote } from "../../../generated/prisma";
import prisma from "../../utils/prismaProvider";

const createVote = async (payload: Vote) => {
  const isVoteExist = await prisma.vote.findFirst({
    where: {
      userId: payload.userId,
      postId: payload.postId,
    },
  });
  if (isVoteExist) {
    const result = await prisma.vote.update({
      where: {
        id: isVoteExist.id,
      },
      data: {
        status: payload?.status,
      },
    });
    return result;
  } else {
    const result = await prisma.vote.create({
      data: payload,
    });
    return result;
  }
};

const getAllVote = async () => {
  const result = await prisma.vote.findMany({});
  return result;
};
const getSingleVote = async (id: string) => {
  const result = await prisma.vote.findUniqueOrThrow({
    where: { id },
  });
  return result;
};
export const voteServices = {
  createVote,
  getAllVote,
  getSingleVote,
};
