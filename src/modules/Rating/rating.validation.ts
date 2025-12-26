
import { z } from 'zod';

const Createrating = z.object({
  value: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot be more than 5"),
  postId: z.string().uuid("postId must be a valid UUID"),
  userId: z.string().uuid("userId must be a valid UUID"),
 
});


export const ratingValidation={
  Createrating
}