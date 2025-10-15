"use client";
import { trpc } from "@/lib/trpc/client";
import Link from "next/link";
import { Nav } from "@/components/Nav";

export default function DashboardPage() {
  const utils = trpc.useUtils();
  const { data: pageData } = trpc.post.getAllPostsPage.useQuery({ publishedOnly: false, page: 1, pageSize: 50 });
  const deleteMutation = trpc.post.deletePost.useMutation({
    onSuccess: () => utils.post.getAllPosts.invalidate(),
  });

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <Nav />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <Link className="inline-block mb-4 underline" href="/">Create new post</Link>
        <table className="w-full text-sm border bg-white">
          <thead className="bg-secondary">
            <tr>
              <th className="text-left p-2 border">Title</th>
              <th className="text-left p-2 border">Slug</th>
              <th className="text-left p-2 border">Status</th>
              <th className="text-left p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageData?.items.map((p) => (
              <tr key={p.id}>
                <td className="p-2 border"><Link className="hover:underline" href={`/posts/${p.slug}`}>{p.title}</Link></td>
                <td className="p-2 border">{p.slug}</td>
                <td className="p-2 border">{p.published ? "Published" : "Draft"}</td>
                <td className="p-2 border">
                  <Link className="mr-3 underline" href={`/dashboard/posts/${p.id}`}>Edit</Link>
                  <button className="mr-2 underline" onClick={() => deleteMutation.mutate({ id: p.id })}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
