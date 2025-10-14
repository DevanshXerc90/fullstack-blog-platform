import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createCategorySchema, updateCategorySchema, getBySlugSchema } from '@/schemas/category';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
}

export const categoryRouter = router({
  list: publicProcedure.query(async () => {
    return db.select().from(categories).orderBy(categories.name);
  }),

  getBySlug: publicProcedure.input(getBySlugSchema).query(async ({ input }) => {
    const rows = await db.select().from(categories).where(eq(categories.slug, input.slug)).limit(1);
    return rows[0] ?? null;
  }),

  create: publicProcedure.input(createCategorySchema).mutation(async ({ input }) => {
    const baseSlug = slugify(input.name);
    // Ensure unique slug by appending suffix if needed (naive, protected by unique index)
    let finalSlug = baseSlug;
    let suffix = 1;
    while (true) {
      const existing = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, finalSlug))
        .limit(1);
      if (existing.length === 0) break;
      finalSlug = `${baseSlug}-${suffix++}`;
    }

    const [row] = await db
      .insert(categories)
      .values({ name: input.name, description: input.description, slug: finalSlug })
      .returning();
    return row;
  }),

  update: publicProcedure.input(updateCategorySchema).mutation(async ({ input }) => {
    const { id, name, description } = input;
    const values: Partial<{ name: string; slug: string; description: string | null }> = {};
    if (typeof name === 'string') {
      values.name = name;
      values.slug = slugify(name);
    }
    if (typeof description !== 'undefined') {
      values.description = description ?? null;
    }
    const [row] = await db.update(categories).set(values).where(eq(categories.id, id)).returning();
    return row;
  }),

  delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const [row] = await db.delete(categories).where(eq(categories.id, input.id)).returning();
    return row;
  }),
});
