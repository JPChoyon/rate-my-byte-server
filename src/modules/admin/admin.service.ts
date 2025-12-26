import { UserRole } from "../../../generated/prisma";
import prisma from "../../utils/prismaProvider";

const getAdminCredentials = async () => {
  const totasPosts = await prisma.post.count({});
  const totalUsers = await prisma.user.count({});
  const totalSubscribers = await prisma.user.count({
    where: {
      isPremium: true,
    },
  });
  const totalComments = await prisma.comment.count({});
  const totalCategories = await prisma.category.count({});
  const totalRatings = await prisma.rating.count({});
  const totalVotes = await prisma.vote.count({});
  const posts = await prisma.post.findMany({
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
      ratings: true,
      votes: true,
      comments: true,
      user: true,
    },
  });
  const users = await prisma.user.findMany({
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: true,
      votes: true,
      ratings: true,
      posts: true,
    },
  });
  const categories = await prisma.category.findMany({
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      posts: true,
    },
  });
  return {
    totalPosts: totasPosts,
    totalUsers: totalUsers,
    totalSubscribers,
    totalComments,
    totalCategories,
    totalRatings,
    totalVotes,
    posts,
    users,
    categories,
  };
};

const makeAdmin = async (data: { email: string }) => {
  const result = await prisma.user.update({
    where: {
      email: data.email,
    },
    data: {
      role: UserRole.ADMIN,
    },
  });
  return result;
};

export const adminServices = {
  getAdminCredentials,
  makeAdmin,
};
