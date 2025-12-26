import { z } from "zod";

const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    image: z.string().url("Image must be a valid URL"),
  }),
});

export const categoryValidation = {
  createCategorySchema,
};
