import { ResumeData } from "@/lib/resume-data";
import Link from "next/link";

interface ResumeHeaderProps {
  data: ResumeData["personalInfo"];
}

export const ResumeHeader = ({ data }: ResumeHeaderProps) => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">{data.name}</h1>
      <div className="flex flex-wrap justify-center items-center gap-2 text-sm text-gray-600 mb-4">
        <Link 
          href={data.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
          aria-label="LinkedIn profile"
        >
          LinkedIn
        </Link>
        <span aria-hidden="true">•</span>
        <Link 
          href={data.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
          aria-label="GitHub profile"
        >
          GitHub
        </Link>
        <span aria-hidden="true">•</span>
        <Link 
          href={data.links.portfolio}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
          aria-label="Portfolio website"
        >
          Portfolio
        </Link>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <span>📧</span>
          <a 
            href={`mailto:${data.contacts.email}`}
            className="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
            aria-label={`Send email to ${data.contacts.email}`}
          >
            {data.contacts.email}
          </a>
        </div>
        <div className="flex items-center gap-1">
          <span>📍</span>
          <span>{data.contacts.location}</span>
        </div>
      </div>
    </header>
  );
};