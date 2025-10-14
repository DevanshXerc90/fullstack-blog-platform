"use client";
import Link from "next/link";

export function Nav() {
  return (
    <nav className="container mx-auto flex items-center justify-between mb-8 px-4 py-4">
      <Link href="/" className="text-xl font-semibold">Blog</Link>
      <div className="space-x-4">
        <Link href="/posts" className="hover:underline">All Posts</Link>
        <Link href="/categories" className="hover:underline">Categories</Link>
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
      </div>
    </nav>
  );
}
