import { ResumeData } from "@/lib/resume-data";
import { ResumeSection } from "./resume-section";

interface ResumeEducationProps {
  data: ResumeData["education"];
}

export const ResumeEducation = ({ data }: ResumeEducationProps) => {
  return (
    <ResumeSection emoji="📜" title="Education">
      <div className="space-y-4">
        {data.map((education, index) => (
          <div key={index} className="space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {education.degree}
                </h3>
                <p className="text-gray-700">
                  {education.institution} — {education.location}
                </p>
              </div>
              <div className="text-sm font-medium text-gray-700">
                {education.duration}
              </div>
            </div>
            
            {education.gpa && (
              <p className="text-sm text-gray-600">
                GPA: {education.gpa}
              </p>
            )}
            
            {education.honors && education.honors.length > 0 && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Honors:</span> {education.honors.join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </ResumeSection>
  );
};