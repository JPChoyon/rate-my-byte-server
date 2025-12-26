import { z } from "zod";

const createCommentSchema = z.object({
  body: z.object({
    text: z.string().min(1, "Comment is required"),
    postId: z.string().uuid("postId must be a valid UUID"),
    userId: z.string().uuid("userId must be a valid UUID"),
  }),
});

export const commentValidation = {
  createCommentSchema,
};
