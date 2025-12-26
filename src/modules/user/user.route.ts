import { Router } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";

const route = Router();

route.get(
  "/dashboard",
  auth(UserRole.USER, UserRole.PREMIUM),
  userControllers.getUserCredential
);
route.get("/", auth(UserRole.ADMIN), userControllers.getAllUser);
route.patch("/:userId", auth(UserRole.ADMIN), userControllers.updateUser);
route.get("/:userId", auth(UserRole.ADMIN), userControllers.getSingleUser);
route.delete("/:userId", auth(UserRole.ADMIN), userControllers.deleteUser);

export const userRoute = route;
