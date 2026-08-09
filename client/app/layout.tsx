import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SkillBridge — Proof of Skill, Not Degree",
  description:
    "AI-powered micro-credentialing platform for skills-based hiring. Take practical challenges, get AI-evaluated, earn verified digital badges.",
  keywords: ["skills-based hiring", "micro-credentials", "AI evaluation", "digital badges", "portfolio"],
  openGraph: {
    title: "SkillBridge",
    description: "Prove your skills. Earn verified badges. Get hired.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-gray-950 text-white min-h-screen`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
