"use client";
import { use } from "react";
import { PostDetailClient } from "@/components/PostDetailClient";

export default function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <PostDetailClient slug={slug} />;
}
