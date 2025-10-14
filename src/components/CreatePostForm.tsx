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
import { trpc } from "@/lib/trpc/client";
import { createPostSchema } from "@/server/routers/post";
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
        },
    });

    // Jab user submit button par click karega toh yeh function chalega
    function onSubmit(values: z.infer<typeof createPostSchema>) {
        createPostMutation.mutate(values);
    }

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
                    <Button type="submit" disabled={createPostMutation.isPending}>
                        {createPostMutation.isPending ? "Creating..." : "Create Post"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}

