import { z } from "zod";

const postSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    location: z.string().min(1, "Location is required"),
    image: z.string().url("Image must be a valid URL"),
    priceRange: z.enum(["Low", "Medium", "High"]),
    categoryId: z.string({ required_error: "Category ID is required" }), // Category ID is required
    userId: z.string({ required_error: "User ID is required" }), // User ID is required
  }),
});

const manyPostSchema = z.object({
  body: z.array(
    z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
      location: z.string().min(1, "Location is required"),
      image: z.string().url("Image must be a valid URL"),
      priceRange: z.enum(["Low", "Medium", "High"]),
      categoryId: z.string({ required_error: "Category ID is required" }), // Category ID is required
      userId: z.string({ required_error: "User ID is required" }), // User ID is required
    })
  ),
});

export const postValidation = {
  postSchema,
  manyPostSchema,
};
