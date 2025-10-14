"use client";
import { trpc } from "@/lib/trpc/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";

export function PostDetailClient({ slug }: { slug: string }) {
  const { data: post, isLoading, error } = trpc.post.getBySlug.useQuery({ slug });
  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error.message}</div>;
  if (!post) return notFound();

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <article className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content ?? ""}</ReactMarkdown>
        </article>
      </div>
    </main>
  );
}
