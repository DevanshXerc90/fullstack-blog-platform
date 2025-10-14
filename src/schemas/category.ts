import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().max(2000).optional(),
});

export const updateCategorySchema = z.object({
  id: z.number(),
  name: z.string().min(2).optional(),
  description: z.string().max(2000).optional(),
});

export const getBySlugSchema = z.object({ slug: z.string().min(1) });
