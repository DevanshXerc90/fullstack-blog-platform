import { router } from '../trpc';
import { postRouter } from './post';
// Yahan hum future mein categoryRouter bhi add karenge

export const appRouter = router({
    post: postRouter,
    // category: categoryRouter,
});

// Is type ko hum client-side par use karenge
export type AppRouter = typeof appRouter;
