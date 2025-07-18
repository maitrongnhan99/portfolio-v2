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
    <div className="fixed top-4 right-4 z-50 print:hidden">
      <div className="flex gap-2">
        <Button
          onClick={handlePreview}
          variant="outline"
          disabled={isPreviewing}
          className="bg-white border-gray-300 hover:bg-gray-50 text-gray-700 shadow-lg"
        >
          <Eye className="w-4 h-4 mr-2" />
          {isPreviewing ? "Loading..." : "Preview"}
        </Button>
        <Button
          onClick={handlePrint}
          variant="outline"
          className="bg-white border-gray-300 hover:bg-gray-50 text-gray-700 shadow-lg"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          <Download className="w-4 h-4 mr-2" />
          {isDownloading ? "Generating..." : "Download PDF"}
        </Button>
      </div>
    </div>
  );
};