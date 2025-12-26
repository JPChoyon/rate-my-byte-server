import { Router } from "express";
import { authControllers } from "./auth.controller";
import validateRequest from "../../utils/validateRequest";
import { authValidation } from "./auth.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";

const route = Router();

route.post(
  "/login",
  validateRequest(authValidation.loginValidationSchema),
  authControllers.loginUser
);
route.post(
  "/register",
  validateRequest(authValidation.registrationValidationSchema),
  authControllers.registerNewUser
);
route.post(
  "/change-password",
  validateRequest(authValidation.changePasswordSchema),
  authControllers.changePasswordWithOldPassword
);
route.post(
  "/forget-password",
  validateRequest(authValidation.forgetPasswordSchema),
  authControllers.forgetPassword
);
route.post(
  "/reset-password",
  validateRequest(authValidation.resetPasswordSchema),
  authControllers.resetPassword
);
route.get(
  "/get-me",
  auth(UserRole.ADMIN, UserRole.PREMIUM, UserRole.USER),
  authControllers.getMe
);
route.post("/generate-access-token", authControllers.generateAccessToken);

export const authRoute = route;
