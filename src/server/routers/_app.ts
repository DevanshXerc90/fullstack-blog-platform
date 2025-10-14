import { router } from '../trpc';
import { postRouter } from './post';
import { categoryRouter } from './category';

export const appRouter = router({
    post: postRouter,
    category: categoryRouter,
});

// Is type ko hum client-side par use karenge
export type AppRouter = typeof appRouter;
