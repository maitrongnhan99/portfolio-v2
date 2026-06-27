import { Metadata } from "next";
import { ResumeView } from "@/components/common/resume";

export const metadata: Metadata = {
  title: "Resume - Mai Trọng Nhân",
  description: "Professional resume of Mai Trọng Nhân - AI Applied Engineer with expertise in React, Next.js, Node.js, and applied AI",
  keywords: ["resume", "engineer", "ai applied engineer", "ai engineer", "fullstack", "react", "nextjs", "nodejs", "typescript"],
};

export default function ResumePage() {
  return <ResumeView />;
}