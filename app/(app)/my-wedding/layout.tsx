import { Cormorant_Garamond } from "next/font/google";
import type React from "react";
import { cn } from "@/lib/utils";
import "./wedding.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

export default function WeddingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={cn(cormorant.variable, "wed-root")}>{children}</div>
  );
}
