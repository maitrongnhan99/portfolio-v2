"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, Eye } from "@phosphor-icons/react";
import { resumeData } from "@/lib/resume-data";

export const ResumeDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Dynamic import to avoid SSR issues
      const { downloadPDFWithTimestamp } = await import("@/lib/pdf-generator");
      await downloadPDFWithTimestamp(resumeData);
    } catch (error) {
      console.error("Error downloading resume:", error);
      // Show user-friendly error message
      alert("PDF generation failed. Using print dialog as fallback.");
      // Fallback to print dialog
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePreview = async () => {
    setIsPreviewing(true);
    
    try {
      // Dynamic import to avoid SSR issues
      const { previewPDF } = await import("@/lib/pdf-generator");
      await previewPDF(resumeData);
    } catch (error) {
      console.error("Error previewing resume:", error);
      // Show user-friendly error message
      alert("PDF preview failed. Using print dialog as fallback.");
      // Fallback to print dialog
      window.print();
    } finally {
      setIsPreviewing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed top-4 right-4 z-50 print:hidden sm:right-4 right-2">
      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        <Button
          onClick={handlePreview}
          variant="outline"
          disabled={isPreviewing}
          className="bg-white border-gray-300 hover:bg-gray-50 text-gray-700 shadow-lg text-sm sm:text-base px-3 sm:px-4 py-2"
          aria-label="Preview PDF"
        >
          <Eye className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">{isPreviewing ? "Loading..." : "Preview"}</span>
        </Button>
        <Button
          onClick={handlePrint}
          variant="outline"
          className="bg-white border-gray-300 hover:bg-gray-50 text-gray-700 shadow-lg text-sm sm:text-base px-3 sm:px-4 py-2"
          aria-label="Print resume"
        >
          <Printer className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Print</span>
        </Button>
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg text-sm sm:text-base px-3 sm:px-4 py-2"
          aria-label="Download resume as PDF"
        >
          <Download className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">{isDownloading ? "Generating..." : "Download PDF"}</span>
        </Button>
      </div>
    </div>
  );
};