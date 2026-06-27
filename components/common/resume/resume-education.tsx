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
                <h3 className="font-semibold text-text-primary">
                  {education.degree}
                </h3>
                <p className="text-text-secondary">
                  {education.institution} - {education.location}
                </p>
              </div>
              <div className="text-sm font-medium text-text-secondary">
                {education.duration}
              </div>
            </div>
            
            {education.gpa && (
              <p className="text-sm text-text-muted">
                GPA: {education.gpa}
              </p>
            )}
            
            {education.honors && education.honors.length > 0 && (
              <div className="text-sm text-text-muted">
                <span className="font-medium">Honors:</span> {education.honors.join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </ResumeSection>
  );
};