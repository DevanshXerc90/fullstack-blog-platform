import type { Metadata } from "next";
import { Geist_Sans } from "next/font/google"; // Corrected font import
import "./globals.css";
import Provider from "@/lib/trpc/Provider"; // Our tRPC Provider

const geistSans = Geist_Sans({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

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
            <body className={`${geistSans.variable} font-sans antialiased`}>
                <Provider>{children}</Provider>
            </body>
        </html>
    );
}

