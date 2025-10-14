import { z } from "zod";

// Naye post ke liye validation schema
export const createPostSchema = z.object({
  title: z.string().min(3, "Title kam se kam 3 characters ka hona chahiye"),
  content: z.string().min(10, "Content kam se kam 10 characters ka hona chahiye"),
  published: z.boolean().optional(),
  categoryIds: z.array(z.number()).optional(),
});

// Post update karne ke liye schema (sab kuch optional hai)
export const updatePostSchema = z.object({
  id: z.number(),
  title: z.string().min(3).optional(),
  content: z.string().min(10).optional(),
  published: z.boolean().optional(),
  categoryIds: z.array(z.number()).optional(),
});

export const getPostBySlugSchema = z.object({ slug: z.string().min(1) });
export const getPostByIdSchema = z.object({ id: z.number() });
export const listPostsSchema = z.object({
  categoryId: z.number().optional(),
  publishedOnly: z.boolean().optional(),
  query: z.string().min(1).optional(),
});
