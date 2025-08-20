import { Metadata } from "next";
import { ResumeView } from "@/components/common/resume";

export const metadata: Metadata = {
  title: "Resume - Mai Trọng Nhân",
  description: "Professional resume of Mai Trọng Nhân - Fullstack Developer with expertise in React, Next.js, and Node.js",
  keywords: ["resume", "developer", "fullstack", "react", "nextjs", "nodejs", "typescript"],
};

export default function ResumePage() {
  return <ResumeView />;
}