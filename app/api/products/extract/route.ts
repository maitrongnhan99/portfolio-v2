import { NextRequest, NextResponse } from 'next/server';
import { extractProduct, extractProducts } from '@/services/productExtractor';
import { ProductExtractionRequest } from '@/types/product';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle batch extraction
    if (Array.isArray(body)) {
      const results = await extractProducts(body);
      return NextResponse.json({ 
        success: true, 
        results,
        count: results.length 
      });
    }
    
    // Handle single extraction
    const extractionRequest: ProductExtractionRequest = body;
    const result = await extractProduct(extractionRequest);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Product extraction API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to extract product information' 
      },
      { status: 500 }
    );
  }
}

// Example endpoint documentation
export async function GET() {
  const example = {
    endpoint: '/api/products/extract',
    method: 'POST',
    description: 'Extract product information from text descriptions',
    singleRequest: {
      description: 'iPhone 15 Pro Max 256GB, màu: titan tự nhiên, titan xanh, titan trắng, titan đen, chính hãng Apple Việt Nam',
      options: {
        extractAttributes: ['storage', 'warranty'],
        language: 'vi'
      }
    },
    batchRequest: [
      'Samsung Galaxy S24 Ultra 512GB, RAM 12GB, màu: đen, xám, tím',
      'Đồng hồ Rolex Submariner, vàng 18K, kim cương thật, kính sapphire, dây da cá sấu'
    ],
    exampleResponse: {
      success: true,
      product: {
        name: 'iPhone 15 Pro Max 256GB',
        price: undefined,
        currency: undefined,
        attributes: [
          {
            name: 'color',
            values: ['titan tự nhiên', 'titan xanh', 'titan trắng', 'titan đen'],
            isMultiValue: true
          },
          {
            name: 'storage',
            values: ['256GB'],
            isMultiValue: false
          },
          {
            name: 'warranty',
            values: ['chính hãng Apple Việt Nam'],
            isMultiValue: false
          }
        ],
        rawText: '...',
        extractedAt: '2024-01-01T00:00:00.000Z'
      },
      suggestions: ['brand', 'model', 'origin']
    }
  };
  
  return NextResponse.json(example);
}