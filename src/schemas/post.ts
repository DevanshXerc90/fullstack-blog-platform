import { z } from "zod";

// Naye post ke liye validation schema
export const createPostSchema = z.object({
  title: z.string().min(3, "title should be minimum 3 characters long"),
  content: z.string().min(10, "content should be minimum 10 characters long"),
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
  // Pagination params
  page: z.number().int().min(1).optional(),
  pageSize: z.number().int().min(1).max(50).optional(),
});
