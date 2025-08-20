import { ResumeData } from "@/lib/resume-data";
import { ResumeSection } from "./resume-section";

interface ResumeTechStackProps {
  data: ResumeData["techStack"];
}

export const ResumeTechStack = ({ data }: ResumeTechStackProps) => {
  const techCategories = [
    { label: "Languages", items: data.languages },
    { label: "Frontend", items: data.frontend },
    { label: "Backend", items: data.backend },
    { label: "Database", items: data.database },
    { label: "DevOps", items: data.devOps },
    { label: "Testing", items: data.testing },
  ];

  return (
    <ResumeSection emoji="🛠️" title="Tech Stack">
      <div className="space-y-2">
        {techCategories.map((category) => (
          <div key={category.label} className="flex flex-wrap items-start gap-2">
            <span className="font-semibold text-gray-900 min-w-[80px]">
              {category.label}:
            </span>
            <span className="text-gray-700">
              {category.items.join(", ")}
            </span>
          </div>
        ))}
      </div>
    </ResumeSection>
  );
};