import EnhancedGlowEffect from "@/components/common/enhanced-glow-effect";
import { Navbar } from "@/components/common/navbar/navbar";
import { ThemeProvider } from "@/components/common/theme-provider";
import { cn } from "@/lib/utils";
import Favicon from "@/public/favicon_io/favicon-32x32.png";
import type { Metadata } from "next";
import { Fira_Code, Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Mai Trọng Nhân Portfolio",
  description:
    "Portfolio website showcasing my skills and projects as a FullStack developer",
  keywords: [
    "Mai Trọng Nhân",
    "Portfolio",
    "Full Stack Developer",
    "Web Developer",
    "Software Engineer",
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
    url: "https://maitrongnhan.com",
    title: "Mai Trọng Nhân Portfolio",
    description:
      "Portfolio website showcasing my skills and projects as a FullStack developer",
    siteName: "Mai Trọng Nhân Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mai Trọng Nhân Portfolio",
    description:
      "Portfolio website showcasing my skills and projects as a FullStack developer",
    creator: "@maitrongnhan",
  },
  icons: {
    icon: Favicon.src,
    shortcut: Favicon.src,
    apple: Favicon.src,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, firaCode.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <EnhancedGlowEffect />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
