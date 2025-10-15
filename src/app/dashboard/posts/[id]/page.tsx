"use client";
import { use } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc/client";
import { updatePostSchema } from "@/schemas/post";
import { Nav } from "@/components/Nav";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const postId = Number(id);
  return <EditPostForm id={postId} />;
}

function EditPostForm({ id }: { id: number }) {
  const utils = trpc.useUtils();
  const { data: post, isLoading } = trpc.post.getById.useQuery({ id });
  const { data: categories } = trpc.category.list.useQuery();
  const { data: selectedCategoryIds } = trpc.post.getCategoryIdsByPostId.useQuery({ id });

  const form = useForm<z.infer<typeof updatePostSchema>>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: { id, title: "", content: "", published: false, categoryIds: [] },
  });

  const updateMutation = trpc.post.updatePost.useMutation({
    onSuccess: () => {
      utils.post.getAllPosts.invalidate();
      utils.post.getAllPostsPage.invalidate();
    },
  });

  if (isLoading || !post) {
    return (
      <main className="min-h-screen bg-background py-8">
        <Nav />
        <div className="container mx-auto px-4">Loading...</div>
      </main>
    );
  }

  // Initialize defaults when data arrives
  form.reset({ id, title: post.title, content: post.content ?? "", published: post.published ?? false, categoryIds: selectedCategoryIds ?? [] });

  return (
    <main className="min-h-screen bg-background py-8">
      <Nav />
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Edit Post</h1>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => {
            updateMutation.mutate(values);
          })}
        >
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input className="w-full border rounded px-2 py-1" {...form.register("title", { required: true })} />
          </div>
          <div>
            <label className="block text-sm font-medium">Content (Markdown)</label>
            <textarea rows={8} className="w-full border rounded px-2 py-1" {...form.register("content")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories?.map((cat) => {
                const value = form.watch("categoryIds") ?? [];
                const checked = value.includes(cat.id);
                return (
                  <label key={cat.id} className={`cursor-pointer select-none rounded border px-2 py-1 text-sm ${checked ? "bg-secondary" : "bg-background"}`}>
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={checked}
                      onChange={(e) => {
                        const current = value.slice();
                        if (e.target.checked) form.setValue("categoryIds", [...current, cat.id]);
                        else form.setValue("categoryIds", current.filter((id) => id !== cat.id));
                      }}
                    />
                    {cat.name}
                  </label>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" {...form.register("published")} />
            <span>Published</span>
          </div>
          <button type="submit" className="border rounded px-3 py-1" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </main>
  );
}
