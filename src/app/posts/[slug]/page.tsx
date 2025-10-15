import { PostDetailClient } from "@/components/PostDetailClient";
import type { Metadata } from "next";
import { appRouter } from "@/server/routers/_app";

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PostDetailClient slug={slug} />;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  // Server-side fetching via tRPC caller
  const caller = appRouter.createCaller({});
  const post = await caller.post.getBySlug({ slug });
  if (!post || !post.published) return { title: 'Post not found' };
  const description = post.content ? post.content.replace(/[#*_`>\-]/g, '').slice(0, 160) : undefined;
  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      url: `/posts/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
    },
  };
}
