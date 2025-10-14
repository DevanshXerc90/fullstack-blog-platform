"use client";
import { trpc } from "@/lib/trpc/client";
import Link from "next/link";
import { useFilterStore } from "@/lib/store";
import { Nav } from "@/components/Nav";

export default function PostsPage() {
  const selectedCategoryId = useFilterStore((s) => s.selectedCategoryId);
  const setSelectedCategoryId = useFilterStore((s) => s.setSelectedCategoryId);
  const { data: categories } = trpc.category.list.useQuery();
  const { data: posts, isLoading, error } = trpc.post.getAllPosts.useQuery({
    categoryId: selectedCategoryId,
    publishedOnly: true,
  });

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <Nav />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Posts</h1>

        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            className={`px-3 py-1 rounded border ${selectedCategoryId === undefined ? "bg-secondary" : "bg-background"}`}
            onClick={() => setSelectedCategoryId(undefined)}
          >
            All
          </button>
          {categories?.map((c) => (
            <button
              key={c.id}
              className={`px-3 py-1 rounded border ${selectedCategoryId === c.id ? "bg-secondary" : "bg-background"}`}
              onClick={() => setSelectedCategoryId(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>

        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error.message}</div>}
        {posts && posts.length === 0 && <div>No posts found.</div>}
        <ul className="space-y-2">
          {posts?.map((p) => (
            <li key={p.id} className="p-4 border rounded-md bg-white">
              <Link href={`/posts/${p.slug}`} className="font-semibold hover:underline">
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
