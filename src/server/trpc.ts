/**
  * Yeh tRPC ke liye main server setup file hai.
  */
import { initTRPC } from '@trpc/server';

// 1. tRPC instance banayein
const t = initTRPC.create();

// 2. Apne procedures aur router ko dobara use karne ke liye export karein
export const router = t.router;
export const publicProcedure = t.procedure;
