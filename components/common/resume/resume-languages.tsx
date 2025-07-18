import { ResumeData } from "@/lib/resume-data";
import { ResumeSection } from "./resume-section";

interface ResumeLanguagesProps {
  data: ResumeData["languages"];
}

export const ResumeLanguages = ({ data }: ResumeLanguagesProps) => {
  return (
    <ResumeSection emoji="🧰" title="Languages">
      <ul className="space-y-1">
        {data.map((lang, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{lang.language}:</span>
            <span className="text-gray-700">{lang.proficiency}</span>
            {lang.certification && (
              <span className="text-gray-600">({lang.certification})</span>
            )}
          </li>
        ))}
      </ul>
    </ResumeSection>
  );
};