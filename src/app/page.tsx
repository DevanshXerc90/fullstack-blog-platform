import CreatePostForm from "@/components/CreatePostForm";
import PostList from "@/components/PostList";
import { Nav } from "@/components/Nav";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-50 py-8">
            <Nav />
            {/* Naya post banane ka form yahan dikhega */}
            <CreatePostForm />

            {/* Puraani post list iske neeche dikhegi */}
            <PostList />

            {/* Yeh component poori app mein notifications dikhane ke kaam aayega */}
            <Toaster richColors />
        </main>
    );
}