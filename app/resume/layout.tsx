import { ReactNode } from "react";

interface ResumeLayoutProps {
  children: ReactNode;
}

export default function ResumeLayout({ children }: ResumeLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}