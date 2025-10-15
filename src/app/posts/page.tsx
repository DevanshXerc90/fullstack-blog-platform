"use client";
import { trpc } from "@/lib/trpc/client";
import Link from "next/link";
import { useFilterStore } from "@/lib/store";
import { Nav } from "@/components/Nav";
import { useState } from "react";

export default function PostsPage() {
  const selectedCategoryId = useFilterStore((s) => s.selectedCategoryId);
  const setSelectedCategoryId = useFilterStore((s) => s.setSelectedCategoryId);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { data: categories } = trpc.category.list.useQuery();
  const utils = trpc.useUtils();
  const deleteMutation = trpc.post.deletePost.useMutation({
    onSuccess: () => {
      utils.post.getAllPosts.invalidate();
      utils.post.getAllPostsPage.invalidate();
    },
  });
  const { data, isLoading, error } = trpc.post.getAllPostsPage.useQuery({
    categoryId: selectedCategoryId,
    publishedOnly: true,
    query: query || undefined,
    page,
    pageSize: 10,
  });

  return (
    <main className="min-h-screen bg-background py-8">
      <Nav />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Posts</h1>

        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            className={`px-3 py-1 rounded border ${selectedCategoryId === undefined ? "bg-secondary" : "bg-background"}`}
            onClick={() => {
              setSelectedCategoryId(undefined);
              setPage(1);
            }}
          >
            All
          </button>
          {categories?.map((c) => (
            <button
              key={c.id}
              className={`px-3 py-1 rounded border ${selectedCategoryId === c.id ? "bg-secondary" : "bg-background"}`}
              onClick={() => {
                setSelectedCategoryId(c.id);
                setPage(1);
              }}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="w-full max-w-md border rounded px-3 py-2"
            placeholder="Search posts by title..."
          />
        </div>

        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error.message}</div>}
        {data && data.items.length === 0 && <div>No posts found.</div>}
        <ul className="space-y-2">
          {data?.items.map((p) => (
            <li key={p.id} className="p-4 border rounded-md bg-card">
              <div className="flex items-center justify-between gap-3">
                <Link href={`/posts/${p.slug}`} className="font-semibold hover:underline">
                  {p.title}
                </Link>
                <div className="shrink-0 flex items-center gap-3">
                  <Link href={`/dashboard/posts/${p.id}`} className="text-sm underline">Edit</Link>
                  <button className="text-sm text-red-600 underline" onClick={() => deleteMutation.mutate({ id: p.id })}>Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {data && data.totalPages > 1 && (
          <div className="mt-6 flex items-center gap-2">
            <button
              className="border rounded px-3 py-1 disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="text-sm">
              Page {page} of {data.totalPages}
            </span>
            <button
              className="border rounded px-3 py-1 disabled:opacity-50"
              onClick={() => setPage((p) => (data?.hasMore ? p + 1 : p))}
              disabled={!data.hasMore}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
