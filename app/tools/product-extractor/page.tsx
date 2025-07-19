import { ProductExtractor } from '@/components/common/product-extractor';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Extractor | Tools',
  description: 'Extract structured information from product descriptions with multi-value support',
};

export default function ProductExtractorPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Product Information Extractor</h1>
        <p className="text-muted-foreground mb-8">
          Extract structured data from product descriptions. Supports multiple values per attribute
          (e.g., multiple colors, sizes, materials) separated by commas.
        </p>
        <ProductExtractor />
      </div>
    </div>
  );
}