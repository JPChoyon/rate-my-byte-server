import { Router } from "express";
import { postControllers } from "./post.controller";
import validateRequest from "../../utils/validateRequest";
import { postValidation } from "./post.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";
const route = Router();
route.post(
  "/",
  validateRequest(postValidation.postSchema),
  postControllers.createPost
);
route.post(
  "/many",
  validateRequest(postValidation.manyPostSchema),
  postControllers.createMany
);
route.get("/", postControllers.getAllPost);
route.get("/all", postControllers.getHomePageAllPost);
route.get(
  "/user",
  auth(UserRole.USER, UserRole.PREMIUM),
  postControllers.getAllPostByUser
);
route.patch(
  "/user/:postId",
  auth(UserRole.USER, UserRole.PREMIUM),
  postControllers.updatePostByUser
);
route.get(
  "/user",
  auth(UserRole.USER, UserRole.PREMIUM),
  postControllers.getAllPostByUser
);
route.get("/admin", auth(UserRole.ADMIN), postControllers.getAllPostByAdmin);
route.get("/:postId", postControllers.getSinglePost);

route.patch(
  "/:postId/update-status",
  auth(UserRole.ADMIN),
  postControllers.updatePost
);

export const postRoute = route;
