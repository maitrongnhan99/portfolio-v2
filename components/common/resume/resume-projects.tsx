import { ResumeData } from "@/lib/resume-data";
import { ResumeSection } from "./resume-section";
import Link from "next/link";

interface ResumeProjectsProps {
  data: ResumeData["projects"];
}

export const ResumeProjects = ({ data }: ResumeProjectsProps) => {
  return (
    <ResumeSection emoji="📂" title="Projects">
      <div className="space-y-4">
        {data.map((project, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-2">
              {project.emoji && <span className="text-lg" aria-hidden="true">{project.emoji}</span>}
              <h3 className="font-semibold text-gray-900">{project.name}</h3>
              <div className="flex gap-2">
                {project.links.github && (
                  <Link
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
                    aria-label={`View ${project.name} on GitHub`}
                  >
                    [GitHub]
                  </Link>
                )}
                {project.links.live && (
                  <Link
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
                    aria-label={`View ${project.name} live demo`}
                  >
                    [Live Demo]
                  </Link>
                )}
                {project.links.npm && (
                  <Link
                    href={project.links.npm}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
                    aria-label={`View ${project.name} on NPM`}
                  >
                    [NPM]
                  </Link>
                )}
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ResumeSection>
  );
};