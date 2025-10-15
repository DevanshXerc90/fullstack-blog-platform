import CreatePostForm from "@/components/CreatePostForm";
import PostList from "@/components/PostList";
import { Nav } from "@/components/Nav";
import Link from "next/link";

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-50 py-8">
            <Nav />
            {/* Hero */}
            <section className="container mx-auto px-4 mb-10">
                <div className="rounded-lg bg-white p-8 border text-center">
                    <h1 className="text-4xl font-bold mb-3">Build. Write. Share.</h1>
                    <p className="text-muted-foreground mb-6">A clean, fast, multi-user blog platform built with Next.js, tRPC, and Drizzle.</p>
                    <div className="flex justify-center gap-3">
                        <Link href="#create" className="px-4 py-2 rounded bg-primary text-primary-foreground">Create a post</Link>
                        <Link href="/posts" className="px-4 py-2 rounded border">Browse posts</Link>
                    </div>
                </div>
            </section>

            {/* Naya post banane ka form yahan dikhega */}
            <div id="create">
                <CreatePostForm />
            </div>

            {/* Features */}
            <section className="container mx-auto px-4 mb-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-lg bg-white p-6 border">
                        <h3 className="font-semibold mb-2">Type-safe APIs</h3>
                        <p className="text-sm text-muted-foreground">tRPC and Zod keep your client and server in sync with full type safety.</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 border">
                        <h3 className="font-semibold mb-2">Fast & Modern</h3>
                        <p className="text-sm text-muted-foreground">Built on Next.js App Router, React 19, and Drizzle ORM.</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 border">
                        <h3 className="font-semibold mb-2">Markdown Editing</h3>
                        <p className="text-sm text-muted-foreground">Write in Markdown with live preview and category tagging.</p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="container mx-auto px-4 mb-16">
                <div className="rounded-lg bg-primary text-primary-foreground p-8 border text-center">
                    <h2 className="text-2xl font-semibold mb-2">Start sharing your ideas</h2>
                    <p className="mb-4 opacity-90">Create your first post in seconds with our Markdown editor.</p>
                    <Link href="#create" className="inline-block bg-white text-primary rounded px-4 py-2">Write a post</Link>
                </div>
            </section>

            {/* Puraani post list iske neeche dikhegi */}
            <PostList />

            {/* Footer */}
            <footer className="mt-12 border-t py-6 text-center text-sm text-muted-foreground">
                <div className="container mx-auto px-4">© {new Date().getFullYear()} Full-Stack Blog Platform</div>
            </footer>
        </main>
    );
}