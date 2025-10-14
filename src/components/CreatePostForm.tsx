"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { trpc } from "@/lib/trpc/client";
import { createPostSchema } from "@/schemas/post";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CreatePostForm() {
    // Yeh tRPC hook post list ko automatically refresh karne mein madad karega
    const utils = trpc.useUtils();

    // Yeh hamara tRPC mutation hai jo backend ke 'createPost' function ko call karta hai
    const createPostMutation = trpc.post.createPost.useMutation({
        onSuccess: (data) => {
            // Jab post safaltaapoorvak ban jaaye:
            // 1. Post list ko refresh karo
            utils.post.getAllPosts.invalidate();
            // 2. Success ka notification dikhao
            toast.success(`Post "${data.title}" has been created!`);
            // 3. Form ko reset kar do
            form.reset();
        },
        onError: (error) => {
            // Agar koi error aaye, toh error notification dikhao
            toast.error(error.message);
        },
    });

    const form = useForm<z.infer<typeof createPostSchema>>({
        resolver: zodResolver(createPostSchema),
        defaultValues: {
            title: "",
            content: "",
            published: false,
            categoryIds: [],
        },
    });

    // Jab user submit button par click karega toh yeh function chalega
    function onSubmit(values: z.infer<typeof createPostSchema>) {
        createPostMutation.mutate(values);
    }

    const contentValue = form.watch("content");
    return (
        <div className="container max-w-xl mx-auto p-4 bg-white border rounded-md shadow-sm mb-8">
            <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your amazing blog title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell your story..."
                                        className="resize-none"
                                        rows={6}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {contentValue && contentValue.length > 0 && (
                        <div>
                            <div className="text-sm font-medium mb-2">Preview</div>
                            <div className="prose border rounded-md p-3">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{contentValue}</ReactMarkdown>
                            </div>
                        </div>
                    )}
                    <CategoriesSelector control={form.control} />
                    <FormField
                        control={form.control}
                        name="published"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>Published</FormLabel>
                                </div>
                                <FormControl>
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4"
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={createPostMutation.isPending}>
                        {createPostMutation.isPending ? "Creating..." : "Create Post"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}

import type { Control } from "react-hook-form";

function CategoriesSelector({ control }: { control: Control<import("zod").infer<typeof createPostSchema>> }) {
    const { data: categories, isLoading } = trpc.category.list.useQuery();
    return (
        <FormField
            control={control}
            name="categoryIds"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <FormControl>
                        <div className="flex flex-wrap gap-2">
                            {isLoading && <span className="text-sm text-muted-foreground">Loading categories...</span>}
                            {!isLoading && categories && categories.length === 0 && (
                                <span className="text-sm text-muted-foreground">No categories yet</span>
                            )}
                            {!isLoading && categories && categories.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((cat) => {
                                        const checked = Array.isArray(field.value) && field.value.includes(cat.id);
                                        return (
                                            <label
                                                key={cat.id}
                                                className={cn(
                                                    "cursor-pointer select-none rounded border px-2 py-1 text-sm",
                                                    checked ? "bg-secondary" : "bg-background"
                                                )}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="mr-2"
                                                    checked={checked}
                                                    onChange={(e) => {
                                                        const current: number[] = Array.isArray(field.value) ? field.value : [];
                                                        if (e.target.checked) {
                                                            field.onChange([...current, cat.id]);
                                                        } else {
                                                            field.onChange(current.filter((id) => id !== cat.id));
                                                        }
                                                    }}
                                                />
                                                {cat.name}
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

