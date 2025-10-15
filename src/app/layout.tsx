import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Inter } from "next/font/google";
import "./globals.css";
// Path ko theek kiya gaya hai
import Provider from "@/lib/trpc/Provider";

// GeistSans is preconfigured and exposes a `.variable` className
const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

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
        <html lang="en" suppressHydrationWarning>
            <body className={`${GeistSans.variable} ${inter.variable} font-sans antialiased`}>
                <Provider>{children}</Provider>
            </body>
        </html>
    );
}

