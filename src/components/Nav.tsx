"use client";
import Link from "next/link";
import { useTheme } from "next-themes";

export function Nav() {
  const { theme, setTheme } = useTheme();
  return (
    <nav className="container mx-auto flex items-center justify-between mb-8 px-4 py-4">
      <Link href="/" className="text-xl font-semibold">Blog</Link>
      <div className="flex items-center gap-4">
        <Link href="/posts" className="hover:underline">All Posts</Link>
        <Link href="/categories" className="hover:underline">Categories</Link>
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        <button
          aria-label="Toggle theme"
          className="border rounded px-2 py-1 text-sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>
    </nav>
  );
}
