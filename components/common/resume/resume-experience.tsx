import { ResumeData } from "@/lib/resume-data";
import { ResumeSection } from "./resume-section";

interface ResumeExperienceProps {
  data: ResumeData["experience"];
}

export const ResumeExperience = ({ data }: ResumeExperienceProps) => {
  const formatBullet = (bullet: any) => {
    let description = bullet.description;
    
    // Bold technologies
    if (bullet.technologies) {
      bullet.technologies.forEach((tech: string) => {
        description = description.replace(tech, `**${tech}**`);
      });
    }
    
    // Bold impact
    if (bullet.impact) {
      description = description.replace(bullet.impact, `**${bullet.impact}**`);
    }
    
    return description;
  };

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <ResumeSection emoji="🏢" title="Experience">
      <div className="space-y-6">
        {data.map((job, index) => (
          <div key={index} className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {job.position} — {job.company}
                </h3>
                <p className="text-sm text-gray-600 italic">
                  {job.location}
                </p>
              </div>
              <div className="text-sm font-medium text-gray-700">
                {job.duration}
              </div>
            </div>
            
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              {job.bullets.map((bullet, bulletIndex) => (
                <li key={bulletIndex} className="leading-relaxed">
                  {renderFormattedText(formatBullet(bullet))}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </ResumeSection>
  );
};