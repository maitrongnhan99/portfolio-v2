import { ResumeData } from "@/lib/resume-data";
import { ResumeSection } from "./resume-section";
import Link from "next/link";

interface ResumeCertificationsProps {
  data: ResumeData["certifications"];
}

export const ResumeCertifications = ({ data }: ResumeCertificationsProps) => {
  if (!data || data.length === 0) return null;

  return (
    <ResumeSection emoji="🧾" title="Certifications">
      <ul className="space-y-2">
        {data.map((cert, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="font-semibold text-text-primary">{cert.name}</span>
            <span className="text-text-muted">— {cert.issuer}, {cert.date}</span>
            {cert.link && (
              <Link
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text-primary text-sm transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-1"
                aria-label={`Verify ${cert.name} certification`}
              >
                [Verify]
              </Link>
            )}
          </li>
        ))}
      </ul>
    </ResumeSection>
  );
};