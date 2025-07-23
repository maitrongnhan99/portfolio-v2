import { pdf } from '@react-pdf/renderer';
import { ResumeData } from './resume-data';
import { PDFResume } from './pdf-resume';

/**
 * Generate PDF blob from resume data
 */
export const generatePDFBlob = async (data: ResumeData): Promise<Blob> => {
  try {
    const doc = <PDFResume data={data} />;
    const blob = await pdf(doc).toBlob();
    return blob;
  } catch (error) {
    console.error('Error generating PDF blob:', error);
    throw new Error('Failed to generate PDF. Please try again or use the print option.');
  }
};

/**
 * Download PDF with proper filename
 */
export const downloadPDF = async (
  data: ResumeData, 
  filename: string = 'Mai_Trong_Nhan_Resume.pdf'
): Promise<void> => {
  try {
    const blob = await generatePDFBlob(data);
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Generate PDF with timestamp in filename
 */
export const downloadPDFWithTimestamp = async (data: ResumeData): Promise<void> => {
  const now = new Date();
  const timestamp = now.toISOString().split('T')[0]; // YYYY-MM-DD format
  const filename = `Mai_Trong_Nhan_Resume_${timestamp}.pdf`;
  
  await downloadPDF(data, filename);
};

/**
 * Open PDF in new tab (for preview)
 */
export const previewPDF = async (data: ResumeData): Promise<void> => {
  try {
    const blob = await generatePDFBlob(data);
    const url = URL.createObjectURL(blob);
    
    // Open in new tab
    window.open(url, '_blank');
    
    // Clean up after a delay to allow the browser to load the PDF
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  } catch (error) {
    console.error('Error generating PDF preview:', error);
    throw error;
  }
};