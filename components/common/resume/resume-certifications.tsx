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
            <span className="font-semibold text-gray-900">{cert.name}</span>
            <span className="text-gray-600">— {cert.issuer}, {cert.date}</span>
            {cert.link && (
              <Link
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
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