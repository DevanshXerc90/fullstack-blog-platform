import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Provider from "@/lib/trpc/Provider"; // Our tRPC Provider

// GeistSans is preconfigured and exposes a `.variable` className

// Geist Mono ko abhi ke liye hata dete hain agar use nahi ho raha
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
    title: "Full-Stack Blog Platform",
    description: "A blog built with Next.js, tRPC, and Drizzle.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${GeistSans.variable} font-sans antialiased`}>
                <Provider>{children}</Provider>
            </body>
        </html>
    );
}

