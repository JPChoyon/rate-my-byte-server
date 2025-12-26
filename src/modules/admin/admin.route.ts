import { Router } from "express";
import { adminControllers } from "./admin.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";

const route = Router();

route.get(
  "/dashboard",
  auth(UserRole.ADMIN),
  adminControllers.getAdminCredentials
);

route.post("/make-admin", adminControllers.makeAdmin);

export const adminRoute = route;
