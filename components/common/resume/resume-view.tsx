"use client";

import { resumeData } from "@/lib/resume-data";
import { ResumeHeader } from "./resume-header";
import { ResumeSummary } from "./resume-summary";
import { ResumeTechStack } from "./resume-tech-stack";
import { ResumeExperience } from "./resume-experience";
import { ResumeProjects } from "./resume-projects";
import { ResumeEducation } from "./resume-education";
import { ResumeCertifications } from "./resume-certifications";
import { ResumeLanguages } from "./resume-languages";
import { ResumeDownload } from "./resume-download";
import Link from "next/link";
import { ArrowLeft, House } from "@phosphor-icons/react";

export const ResumeView = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 print:hidden">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <House className="w-4 h-4" />
            <span>Back to Portfolio</span>
          </Link>
        </div>
      </nav>

      {/* Download Button */}
      <ResumeDownload />

      {/* Resume Content */}
      <main className="max-w-4xl mx-auto px-6 py-8 print:px-0 print:py-0">
        <div className="bg-white print:shadow-none">
          <ResumeHeader data={resumeData.personalInfo} />
          
          <div className="space-y-8">
            <ResumeSummary data={resumeData.summary} />
            <ResumeTechStack data={resumeData.techStack} />
            <ResumeExperience data={resumeData.experience} />
            <ResumeProjects data={resumeData.projects} />
            <ResumeEducation data={resumeData.education} />
            <ResumeCertifications data={resumeData.certifications} />
            <ResumeLanguages data={resumeData.languages} />
          </div>
        </div>
      </main>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          body {
            font-size: 11pt;
            line-height: 1.4;
            color: #000 !important;
            background: white !important;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:px-0 {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          
          .print\\:py-0 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          h1 {
            font-size: 20pt !important;
            margin-bottom: 8pt !important;
            color: #000 !important;
          }
          
          h2 {
            font-size: 14pt !important;
            margin-bottom: 6pt !important;
            color: #000 !important;
          }
          
          h3 {
            font-size: 12pt !important;
            margin-bottom: 4pt !important;
            color: #000 !important;
          }
          
          p, li, span {
            font-size: 10pt !important;
            line-height: 1.3 !important;
            color: #000 !important;
          }
          
          a {
            color: #0066cc !important;
            text-decoration: underline !important;
          }
          
          .bg-gray-100 {
            background: #f5f5f5 !important;
            border: 1px solid #ddd !important;
          }
          
          .border-gray-200 {
            border-color: #ddd !important;
          }
          
          .text-gray-900,
          .text-gray-700,
          .text-gray-600 {
            color: #000 !important;
          }
          
          .text-blue-600 {
            color: #0066cc !important;
          }
          
          @page {
            margin: 0.5in;
            size: A4;
          }
          
          /* Avoid page breaks inside sections */
          .mb-8 {
            page-break-inside: avoid;
          }
          
          /* Ensure headers don't get orphaned */
          h1, h2, h3 {
            page-break-after: avoid;
          }
        }
      `}</style>
    </div>
  );
};