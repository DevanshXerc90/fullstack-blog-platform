import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq, desc } from 'drizzle-orm'; // Zaroori functions import kiye
import { createPostSchema, updatePostSchema } from '@/schemas/post';


export const postRouter = router({
    // READ: Saare posts fetch karne ke liye
    getAllPosts: publicProcedure.query(async () => {
        // Improvement: Naye posts ab sabse upar dikhenge
        return db.select().from(posts).orderBy(desc(posts.createdAt));
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
                })
                .returning();

            return newPost;
        }),

    // UPDATE: Post ko edit karne ke liye (Naya Feature)
    updatePost: publicProcedure
        .input(updatePostSchema)
        .mutation(async ({ input }) => {
            const { id, ...updateData } = input;

            // Agar title badla hai, toh slug bhi update hoga
            const newSlug = updateData.title
                ? updateData.title.toLowerCase().replace(/\s+/g, '-').slice(0, 50)
                : undefined;

            const [updatedPost] = await db
                .update(posts)
                .set({
                    ...updateData,
                    slug: newSlug,
                    updatedAt: new Date(), // "Updated At" time ko manually set kiya
                })
                .where(eq(posts.id, id))
                .returning();

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
});

