import status from "http-status";
import { User, UserStatus } from "../../../generated/prisma";
import AppError from "../../errors/AppError";
import prisma from "../../utils/prismaProvider";
import { bcryptHelper } from "../../utils/bcryptHelper";
import { jwtHelper } from "../../utils/jwtHelper";
import config from "../../config";
import sendEmail from "../../utils/sendEmail";
import { JwtPayload } from "jsonwebtoken";

const loginUser = async (payload: Partial<User>) => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: payload?.email },
  });

  if (!isUserExist) {
    throw new AppError(status.BAD_REQUEST, "User does not exist");
  }

  const isPasswordMatch = await bcryptHelper.comparePassword(
    payload?.password as string,
    isUserExist?.password
  );

  if (!isPasswordMatch) {
    throw new AppError(status.BAD_REQUEST, "Password does not match");
  }

  const jwtData = {
    id: isUserExist.id,
    email: isUserExist.email,
    status: isUserExist.status,
    role: isUserExist.role,
  };

  const accessToken = jwtHelper.generateToken(
    jwtData,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in
  );

  const refreshToken = jwtHelper.generateToken(
    jwtData,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in
  );

  return {
    accessToken,
    refreshToken,
  };
};

const registerNewUser = async (payload: User) => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: payload?.email },
  });

  if (isUserExist) {
    throw new AppError(status.BAD_REQUEST, "User already exist");
  }

  const hashedPassword = await bcryptHelper.hashPassword(payload.password);
  payload.password = hashedPassword;

  const result = await prisma.user.create({ data: payload });

  const jwtData = {
    id: result.id,
    email: result.email,
    status: result.status,
    role: result.role,
  };

  const accessToken = jwtHelper.generateToken(
    jwtData,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in
  );

  const refreshToken = jwtHelper.generateToken(
    jwtData,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in
  );

  return {
    accessToken,
    refreshToken,
  };
};

const changePasswordWithOldPassword = async (payload: {
  oldPassword: string;
  newPassword: string;
  email: string;
}) => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!isUserExist) {
    throw new AppError(status.BAD_REQUEST, "User does not exist");
  }

  const isPasswordMatch = await bcryptHelper.comparePassword(
    payload.oldPassword,
    isUserExist.password
  );

  if (!isPasswordMatch) {
    throw new AppError(status.BAD_REQUEST, "Old password does not match");
  }

  const hashedPassword = await bcryptHelper.hashPassword(payload.newPassword);

  const result = await prisma.user.update({
    where: { email: isUserExist.email },
    data: { password: hashedPassword },
  });

  return result;
};

const generateForgetPasswordLink = async (payload: { email: string }) => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, "User does not exist");
  }

  const jwtData = {
    id: isUserExist.id,
    email: isUserExist.email,
    status: isUserExist.status,
    role: isUserExist.role,
  };

  const resetToken = jwtHelper.generateToken(
    jwtData,
    config.reset_secret_key as string,
    config.reset_expires_in
  );

  const resetLink = `${config.website_url}/reset-password?email=${isUserExist.email}&token=${resetToken}`;

  await sendEmail(isUserExist.email, resetLink);

  return null;
};

const resetPassword = async (payload: {
  email: string;
  token: string;
  newPassword: string;
}) => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, "User does not exist");
  }

  const decodedToken = jwtHelper.decodedToken(
    payload.token,
    config.reset_secret_key as string
  ) as JwtPayload;

  if (decodedToken?.email !== payload.email) {
    throw new AppError(status.BAD_REQUEST, "Invalid token");
  }

  const hashedPassword = await bcryptHelper.hashPassword(payload.newPassword);

  const result = await prisma.user.update({
    where: { email: payload.email },
    data: { password: hashedPassword },
  });

  return result;
};

const getMe = async (jwtData: JwtPayload) => {
  return prisma.user.findUnique({
    where: { email: jwtData.email },
  });
};

const generateAccessToken = async (token: string) => {
  let decoded: JwtPayload;

  try {
    decoded = jwtHelper.decodedToken(
      token,
      config.jwt_refresh_secret as string
    ) as JwtPayload;
  } catch (error) {
    throw new AppError(status.BAD_REQUEST, "Invalid token");
  }

  const isUserExist = await prisma.user.findUnique({
    where: { email: decoded.email },
  });

  if (!isUserExist) {
    throw new AppError(status.BAD_REQUEST, "User does not exist");
  }

  if (isUserExist.status !== UserStatus.ACTIVE) {
    throw new AppError(status.BAD_REQUEST, "User is not active");
  }

  const jwtData = {
    id: isUserExist.id,
    email: isUserExist.email,
    status: isUserExist.status,
    role: isUserExist.role,
  };

  const accessToken = jwtHelper.generateToken(
    jwtData,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in
  );

  return { accessToken };
};

export const authServices = {
  loginUser,
  registerNewUser,
  changePasswordWithOldPassword,
  generateForgetPasswordLink,
  resetPassword,
  getMe,
  generateAccessToken,
};
