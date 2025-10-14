import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '@/db';
import { posts } from '@/db/schema';

export const postRouter = router({
    // Procedure 1: Saare posts fetch karne ke liye
    getAllPosts: publicProcedure.query(async () => {
        const allPosts = await db.query.posts.findMany();
        return allPosts;
    }),

    // Procedure 2: Naya post banane ke liye
    createPost: publicProcedure
        // Input validation Zod se
        .input(
            z.object({
                title: z.string().min(3, "Title kam se kam 3 characters ka hona chahiye"),
                content: z.string().optional(),
            })
        )
        .mutation(async ({ input }) => {
            // Simple slug generation
            const slug = input.title.toLowerCase().replace(/\s+/g, '-');

            const newPost = await db
                .insert(posts)
                .values({
                    title: input.title,
                    content: input.content,
                    slug: slug,
                })
                .returning();

            return newPost[0];
        }),
});

