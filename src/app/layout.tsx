import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "AI Hackathon Boilerplate | Next.js + OpenAI",
  description: "Production-ready minimal starter kit for AI Hackathons built with Next.js App Router, TypeScript, Tailwind CSS, Shadcn UI, and OpenAI API.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-[#090d16] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200`}>
        {children}
      </body>
    </html>
  );
}
