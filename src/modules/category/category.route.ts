import { Router } from "express";
import { categoryControllers } from "./category.controller";
import validateRequest from "../../utils/validateRequest";
import { categoryValidation } from "./category.validation";

const route = Router();

route.get("/", categoryControllers.getAllCategory);
route.post(
  "/",
  validateRequest(categoryValidation.createCategorySchema),
  categoryControllers.createCategory
);
export const categoryRoute = route;
