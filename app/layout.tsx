import EnhancedGlowEffect from "@/components/common/enhanced-glow-effect";
import { Navbar } from "@/components/common/navbar/navbar";
import { ThemeProvider } from "@/components/common/theme-provider";
import { cn } from "@/lib/utils";
import Favicon from "@/public/favicon_io/favicon-32x32.png";
import OgImage from "@/public/images/og_image.webp";
import type { Metadata } from "next";
import { Fira_Code, Inter } from "next/font/google";
import React from "react";
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
    "PostgreSQL",
    "MongoDB",
    "Tailwind CSS",
    "Shadcn UI",
    "Framer Motion",
    "React Native",
    "Expo",
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
    images: [
      {
        url: OgImage.src,
        width: 1200,
        height: 630,
        alt: "Mai Trọng Nhân Portfolio",
      },
    ],
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

// Dynamic import to avoid IDE issues
const ErrorBoundary = React.lazy(() =>
  import("@/components/common/error-boundary").then((module) => ({
    default: module.ErrorBoundary,
  }))
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize monitoring on client side
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      import("@/lib/monitoring").then(
        ({ initMonitoring, initPerformanceObserver }) => {
          initMonitoring();
          initPerformanceObserver();
        }
      );
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, firaCode.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <React.Suspense fallback={<div>Loading...</div>}>
            <ErrorBoundary>
              <EnhancedGlowEffect />
              <Navbar />
              {children}
            </ErrorBoundary>
          </React.Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
