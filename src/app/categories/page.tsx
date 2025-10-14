"use client";
import { trpc } from "@/lib/trpc/client";
import { useState } from "react";
import { Nav } from "@/components/Nav";

export default function CategoriesPage() {
  const utils = trpc.useUtils();
  const { data: categories, isLoading, error } = trpc.category.list.useQuery();

  const createMutation = trpc.category.create.useMutation({
    onMutate: async (input) => {
      await utils.category.list.cancel();
      const previous = utils.category.list.getData();
      const temp = {
        id: Math.floor(-Math.random() * 1_000_000),
        name: input.name,
        description: input.description ?? null,
        slug: input.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .slice(0, 60),
      };
      utils.category.list.setData(undefined, (old) => (old ? [...old, temp] : [temp]));
      return { previous };
    },
    onError: (_err, _input, ctx) => {
      if (ctx?.previous) utils.category.list.setData(undefined, ctx.previous);
    },
    onSettled: () => utils.category.list.invalidate(),
  });
  const updateMutation = trpc.category.update.useMutation({
    onMutate: async (input) => {
      await utils.category.list.cancel();
      const previous = utils.category.list.getData();
      utils.category.list.setData(undefined, (old) =>
        old?.map((c) => (c.id === input.id ? { ...c, name: input.name ?? c.name, description: input.description ?? c.description } : c)) ?? []
      );
      return { previous };
    },
    onError: (_err, _input, ctx) => {
      if (ctx?.previous) utils.category.list.setData(undefined, ctx.previous);
    },
    onSettled: () => utils.category.list.invalidate(),
  });
  const deleteMutation = trpc.category.delete.useMutation({
    onMutate: async (input) => {
      await utils.category.list.cancel();
      const previous = utils.category.list.getData();
      utils.category.list.setData(undefined, (old) => old?.filter((c) => c.id !== input.id) ?? []);
      return { previous };
    },
    onError: (_err, _input, ctx) => {
      if (ctx?.previous) utils.category.list.setData(undefined, ctx.previous);
    },
    onSettled: () => utils.category.list.invalidate(),
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <Nav />
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Categories</h1>

        <form
          className="mb-6 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate({ name, description });
            setName("");
            setDescription("");
          }}
        >
          <input
            className="flex-1 border rounded px-2 py-1"
            placeholder="New category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="flex-1 border rounded px-2 py-1"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="border rounded px-3 py-1" type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create"}
          </button>
        </form>

        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error.message}</div>}
        <ul className="space-y-2">
          {categories?.map((c) => (
            <li key={c.id} className="p-3 border rounded bg-white flex items-center justify-between gap-2">
              <div>
                <div className="font-medium">{c.name}</div>
                {c.description && <div className="text-sm text-muted-foreground">{c.description}</div>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="border rounded px-2 py-1 text-sm"
                  onClick={() => updateMutation.mutate({ id: c.id, name: c.name + "!" })}
                >
                  Rename
                </button>
                <button
                  className="border rounded px-2 py-1 text-sm text-red-600"
                  onClick={() => deleteMutation.mutate({ id: c.id })}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
