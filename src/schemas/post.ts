import { z } from "zod";

// Naye post ke liye validation schema
export const createPostSchema = z.object({
  title: z.string().min(3, "Title kam se kam 3 characters ka hona chahiye"),
  content: z.string().min(10, "Content kam se kam 10 characters ka hona chahiye"),
});

// Post update karne ke liye schema (sab kuch optional hai)
export const updatePostSchema = z.object({
  id: z.number(),
  title: z.string().min(3).optional(),
  content: z.string().min(10).optional(),
});
