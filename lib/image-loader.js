/**
 * Custom image loader for Next.js to handle PayloadCMS media URLs
 * This prevents Next.js from adding optimization parameters to PayloadCMS media endpoints
 */
export default function imageLoader({ src, width, quality }) {
  // Check if this is a PayloadCMS media URL (localhost or production)
  const isPayloadMedia = 
    src.includes('/api/media/') && 
    (src.includes('localhost') || src.includes('maitrongnhan99.vercel.app'));
  
  // For PayloadCMS media URLs, return the original URL without optimization params
  // PayloadCMS doesn't support Next.js optimization parameters
  if (isPayloadMedia) {
    return src;
  }
  
  // For external images (like Vercel Blob), use Next.js optimization
  const params = new URLSearchParams();
  params.set('url', src);
  params.set('w', width.toString());
  params.set('q', (quality || 75).toString());
  
  return `/_next/image?${params.toString()}`;
}