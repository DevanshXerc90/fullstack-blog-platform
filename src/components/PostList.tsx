"use client"; // Yeh component client-side par chalega

import { trpc } from "@/lib/trpc/client";
import Link from "next/link";
import { useState } from "react";
import React from "react";

export default function PostList() {
    // Humara tRPC hook! Yeh automatically data fetch karta hai.
    const [query, setQuery] = useState("");
    const utils = trpc.useUtils();
    const deleteMutation = trpc.post.deletePost.useMutation({
        onSuccess: () => {
            utils.post.getAllPosts.invalidate();
            utils.post.getAllPostsPage.invalidate();
        },
    });
    const { data: posts, isLoading, error } = trpc.post.getAllPosts.useQuery({ publishedOnly: true, query: query || undefined });

    // Loading state handle karein
    if (isLoading) {
        return <div className="text-center p-4">Loading posts...</div>;
    }

    // Error state handle karein
    if (error) {
        return (
            <div className="text-center p-4 text-red-500">
                Error loading posts: {error.message}
            </div>
        );
    }

    // Jab data aa jaaye, toh usse display karein
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">All Blog Posts</h1>
            <div className="mb-4">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search posts by title..."
                    className="w-full max-w-md border rounded px-3 py-2"
                />
            </div>
            {posts && posts.length > 0 ? (
                <ul className="space-y-2">
                    {posts.map((post) => (
                        <li key={post.id} className="p-4 border rounded-md shadow-sm bg-card">
                            <h2 className="text-xl font-semibold">
                                <Link href={`/posts/${post.slug}`} className="hover:underline">
                                    {post.title}
                                </Link>
                            </h2>
                            <p className="text-muted-foreground mt-2">{post.content}</p>
                            <div className="mt-3 flex items-center gap-3">
                                <Link href={`/dashboard/posts/${post.id}`} className="text-sm underline">
                                    Edit
                                </Link>
                                <button
                                    className="text-sm text-red-600 underline"
                                    onClick={() => deleteMutation.mutate({ id: post.id })}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No posts found. Create one!</p>
            )}
        </div>
    );
}
