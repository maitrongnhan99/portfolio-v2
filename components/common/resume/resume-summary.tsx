import { ResumeData } from "@/lib/resume-data";
import { ResumeSection } from "./resume-section";

interface ResumeSummaryProps {
  data: ResumeData["summary"];
}

export const ResumeSummary = ({ data }: ResumeSummaryProps) => {
  return (
    <ResumeSection emoji="🧑‍💻" title="Summary">
      <p className="text-text-secondary leading-relaxed">
        {data.content}
      </p>
    </ResumeSection>
  );
};