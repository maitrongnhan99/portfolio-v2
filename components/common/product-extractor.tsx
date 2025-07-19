'use client';

import { useState } from 'react';
import { ExtractedProduct, ProductExtractionResponse } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ProductExtractor() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedProduct, setExtractedProduct] = useState<ExtractedProduct | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleExtract = async () => {
    if (!description.trim()) {
      setError('Please enter a product description');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/products/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      const data: ProductExtractionResponse = await response.json();
      
      if (data.success && data.product) {
        setExtractedProduct(data.product);
        setSuggestions(data.suggestions || []);
      } else {
        setError(data.error || 'Failed to extract product information');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Extraction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const exampleDescriptions = [
    'iPhone 15 Pro Max 256GB, màu: titan tự nhiên, titan xanh, titan trắng, titan đen, chính hãng Apple Việt Nam',
    'Đồng hồ Rolex Submariner, vàng 18K, kim cương thật, kính sapphire, dây da cá sấu',
    'Giày Nike Air Max 90, size: 40, 41, 42, 43, màu: đen, trắng, xám, chất liệu: da tổng hợp, đế cao su'
  ];

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Information Extractor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description with details like name, price, colors, materials, etc."
              rows={6}
              className="w-full"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Try examples:</span>
            {exampleDescriptions.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setDescription(example)}
              >
                Example {index + 1}
              </Button>
            ))}
          </div>

          <Button 
            onClick={handleExtract} 
            disabled={loading || !description.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Extracting...
              </>
            ) : (
              'Extract Product Information'
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {extractedProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {extractedProduct.name && (
              <div>
                <span className="font-semibold">Product Name:</span>
                <p className="mt-1">{extractedProduct.name}</p>
              </div>
            )}

            {extractedProduct.price && (
              <div>
                <span className="font-semibold">Price:</span>
                <p className="mt-1">
                  {extractedProduct.price} {extractedProduct.currency}
                </p>
              </div>
            )}

            {extractedProduct.attributes.length > 0 && (
              <div>
                <span className="font-semibold">Attributes:</span>
                <div className="mt-2 space-y-2">
                  {extractedProduct.attributes.map((attr, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="font-medium capitalize min-w-[120px]">
                        {attr.name}:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {attr.values.map((value, vIndex) => (
                          <Badge
                            key={vIndex}
                            variant={attr.isMultiValue ? "secondary" : "outline"}
                          >
                            {value}
                          </Badge>
                        ))}
                        {attr.isMultiValue && (
                          <Badge variant="default" className="ml-2">
                            Multi-value
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {suggestions.length > 0 && (
              <div>
                <span className="font-semibold">Suggested Attributes:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <Badge key={index} variant="outline">
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}