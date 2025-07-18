import { ReactNode } from "react";

interface ResumeSectionProps {
  emoji?: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export const ResumeSection = ({ emoji, title, children, className = "" }: ResumeSectionProps) => {
  return (
    <section className={`mb-8 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        {emoji && <span className="text-2xl">{emoji}</span>}
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="border-b border-gray-200 mb-4"></div>
      {children}
    </section>
  );
};