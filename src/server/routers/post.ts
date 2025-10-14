import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '@/db';
import { posts, postsToCategories } from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { createPostSchema, getPostBySlugSchema, listPostsSchema, updatePostSchema } from '@/schemas/post';


export const postRouter = router({
    // READ: Saare posts fetch karne ke liye, optional filter ke saath
    getAllPosts: publicProcedure.input(listPostsSchema.optional()).query(async ({ input }) => {
        if (input?.categoryId) {
            const whereExpr = input.publishedOnly
                ? and(eq(postsToCategories.categoryId, input.categoryId), eq(posts.published, true))
                : eq(postsToCategories.categoryId, input.categoryId);

            const rows = await db
                .select({
                    id: posts.id,
                    title: posts.title,
                    slug: posts.slug,
                    content: posts.content,
                    published: posts.published,
                    createdAt: posts.createdAt,
                    updatedAt: posts.updatedAt,
                })
                .from(posts)
                .innerJoin(postsToCategories, eq(postsToCategories.postId, posts.id))
                .where(whereExpr)
                .orderBy(desc(posts.createdAt));
            return rows;
        }

        const base = db.select().from(posts);
        if (input?.publishedOnly) {
            return base.where(eq(posts.published, true)).orderBy(desc(posts.createdAt));
        }
        return base.orderBy(desc(posts.createdAt));
    }),

    // CREATE: Naya post banane ke liye
    createPost: publicProcedure
        .input(createPostSchema)
        .mutation(async ({ input }) => {
            const slug = input.title.toLowerCase().replace(/\s+/g, '-').slice(0, 50);

            const [newPost] = await db
                .insert(posts)
                .values({
                    title: input.title,
                    content: input.content,
                    slug: slug,
                    published: input.published ?? false,
                })
                .returning();

            if (input.categoryIds && input.categoryIds.length > 0) {
                await db.insert(postsToCategories).values(
                    input.categoryIds.map((categoryId) => ({ postId: newPost.id, categoryId }))
                );
            }

            return newPost;
        }),

    // UPDATE: Post ko edit karne ke liye (Naya Feature)
    updatePost: publicProcedure
        .input(updatePostSchema)
        .mutation(async ({ input }) => {
            const { id, categoryIds, ...updateData } = input;

            // Agar title badla hai, toh slug bhi update hoga
            const newSlug = updateData.title
                ? updateData.title.toLowerCase().replace(/\s+/g, '-').slice(0, 50)
                : undefined;

            const [updatedPost] = await db
                .update(posts)
                .set({
                    ...updateData,
                    slug: newSlug,
                    updatedAt: new Date(),
                })
                .where(eq(posts.id, id))
                .returning();

            if (Array.isArray(categoryIds)) {
                // Replace categories: delete existing then insert
                await db.delete(postsToCategories).where(eq(postsToCategories.postId, id));
                if (categoryIds.length > 0) {
                    await db.insert(postsToCategories).values(
                        categoryIds.map((categoryId) => ({ postId: id, categoryId }))
                    );
                }
            }

            return updatedPost;
        }),

    // DELETE: Post ko delete karne ke liye (Naya Feature)
    deletePost: publicProcedure
        .input(z.object({ id: z.number() })) // Sirf ID se delete hoga
        .mutation(async ({ input }) => {
            const [deletedPost] = await db
                .delete(posts)
                .where(eq(posts.id, input.id))
                .returning();

            return deletedPost;
        }),

    // GET: Post by slug
    getBySlug: publicProcedure.input(getPostBySlugSchema).query(async ({ input }) => {
        const rows = await db.select().from(posts).where(eq(posts.slug, input.slug)).limit(1);
        return rows[0] ?? null;
    }),
});

