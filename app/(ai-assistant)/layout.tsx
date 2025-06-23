import EnhancedGlowEffect from "@/components/common/enhanced-glow-effect";
import { ThemeProvider } from "@/components/common/theme-provider";
import { cn } from "@/lib/utils";
import Favicon from "@/public/favicon_io/favicon-32x32.png";
import type { Metadata } from "next";
import { Fira_Code, Inter } from "next/font/google";
import type React from "react";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Ask Me Anything - Mai Trọng Nhân",
  description: "AI Assistant to learn about Mai Trọng Nhân's background, skills, and experience",
  keywords: [
    "Mai Trọng Nhân",
    "AI Assistant",
    "Portfolio",
    "Full Stack Developer",
    "Chat",
    "Ask Me Anything",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
  ],
  authors: [{ name: "Mai Trọng Nhân" }],
  creator: "Mai Trọng Nhân",
  publisher: "Mai Trọng Nhân",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://maitrongnhan.com/ask-me",
    title: "Ask Me Anything - Mai Trọng Nhân",
    description: "AI Assistant to learn about Mai Trọng Nhân's background, skills, and experience",
    siteName: "Mai Trọng Nhân Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ask Me Anything - Mai Trọng Nhân",
    description: "AI Assistant to learn about Mai Trọng Nhân's background, skills, and experience",
    creator: "@maitrongnhan",
  },
  icons: {
    icon: Favicon.src,
    shortcut: Favicon.src,
    apple: Favicon.src,
  },
};

export default function AIAssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={true}
        disableTransitionOnChange
      >
        <EnhancedGlowEffect />
        {children}
      </ThemeProvider>
    </>
  );
}
