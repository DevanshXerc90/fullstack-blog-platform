"use client"; // Yeh component client-side par chalega

import { trpc } from "@/lib/trpc/client";
import Link from "next/link";
import React from "react";

export default function PostList() {
    // Humara tRPC hook! Yeh automatically data fetch karta hai.
    const { data: posts, isLoading, error } = trpc.post.getAllPosts.useQuery({ publishedOnly: true });

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
            {posts && posts.length > 0 ? (
                <ul className="space-y-2">
                    {posts.map((post) => (
                        <li key={post.id} className="p-4 border rounded-md shadow-sm">
                            <h2 className="text-xl font-semibold">
                                <Link href={`/posts/${post.slug}`} className="hover:underline">
                                    {post.title}
                                </Link>
                            </h2>
                            <p className="text-gray-600 mt-2">{post.content}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No posts found. Create one!</p>
            )}
        </div>
    );
}
