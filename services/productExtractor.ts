import { 
  ExtractedProduct, 
  ProductAttribute, 
  ProductExtractionRequest,
  ProductExtractionResponse,
  COMMON_ATTRIBUTES,
  VIETNAMESE_ATTRIBUTES 
} from '@/types/product';

// Helper function to clean and split multi-value strings
function parseMultiValues(value: string): string[] {
  // Split by comma and clean each value
  const values = value
    .split(',')
    .map(v => v.trim())
    .filter(v => v.length > 0);
  
  // Remove duplicates
  return [...new Set(values)];
}

// Helper function to detect if a value contains multiple items
function isMultiValue(value: string): boolean {
  // Check if value contains commas (indicating multiple values)
  return value.includes(',') && value.split(',').length > 1;
}

// Extract price from text
function extractPrice(text: string): { price?: string; currency?: string } {
  // Common price patterns
  const pricePatterns = [
    // Vietnamese currency
    /(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?)\s*(đ|đồng|VND|vnđ)/gi,
    /(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)\s*(đ|đồng|VND|vnđ)/gi,
    // USD
    /\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)/g,
    /(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)\s*(USD|usd|\$)/gi,
    // General number that might be price
    /(?:giá|price|cost)[\s:]*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)/gi
  ];

  for (const pattern of pricePatterns) {
    const match = text.match(pattern);
    if (match) {
      const fullMatch = match[0];
      const priceMatch = fullMatch.match(/\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?/);
      if (priceMatch) {
        const price = priceMatch[0];
        let currency = 'VND'; // Default currency
        
        if (fullMatch.includes('$') || fullMatch.toLowerCase().includes('usd')) {
          currency = 'USD';
        }
        
        return { price, currency };
      }
    }
  }
  
  return {};
}

// Extract product name from text
function extractProductName(text: string): string | undefined {
  // Common patterns for product names
  const namePatterns = [
    /(?:tên|name|sản phẩm|product)[\s:]*([^\n,;]+)/i,
    /^([A-Z][^.!?:;]+)(?:\.|!|:|;|\n|$)/m, // First capitalized phrase
  ];

  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // If no pattern matches, try to get the first meaningful phrase
  const firstLine = text.split('\n')[0];
  if (firstLine && firstLine.length > 5 && firstLine.length < 100) {
    return firstLine.trim();
  }

  return undefined;
}

// Extract attributes from text
function extractAttributes(
  text: string, 
  targetAttributes?: string[]
): ProductAttribute[] {
  const attributes: ProductAttribute[] = [];
  const processedAttributes = new Set<string>();

  // Combine common attributes with target attributes
  const searchAttributes = targetAttributes 
    ? [...COMMON_ATTRIBUTES, ...targetAttributes]
    : COMMON_ATTRIBUTES;

  // Also search for Vietnamese attributes
  const vietnameseKeys = Object.keys(VIETNAMESE_ATTRIBUTES);
  
  // Build a combined list of all attribute names for lookahead
  const allAttributeNames = [...searchAttributes, ...vietnameseKeys];
  
  // First, let's identify all attribute positions in the text
  const attributePositions: Array<{term: string, position: number, attr: string}> = [];
  
  // Search for all attributes including Vietnamese ones
  const allSearchTerms = [...searchAttributes];
  vietnameseKeys.forEach(vnKey => {
    if (!allSearchTerms.includes(vnKey)) {
      allSearchTerms.push(vnKey);
    }
  });
  
  allSearchTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\s*:`, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      // Map Vietnamese term to English attribute name
      let attrName = term;
      if (VIETNAMESE_ATTRIBUTES[term]) {
        attrName = VIETNAMESE_ATTRIBUTES[term];
      }
      
      attributePositions.push({
        term: term,
        position: match.index,
        attr: attrName
      });
    }
  });
  
  // Sort by position
  attributePositions.sort((a, b) => a.position - b.position);
  
  // Extract values between attributes
  attributePositions.forEach((attrPos, index) => {
    if (processedAttributes.has(attrPos.attr.toLowerCase())) return;
    
    // Find the start position (after the colon)
    const colonPos = text.indexOf(':', attrPos.position) + 1;
    
    // Find the end position (start of next attribute or end of text)
    let endPos = text.length;
    if (index < attributePositions.length - 1) {
      endPos = attributePositions[index + 1].position;
    }
    
    // Extract the value
    let rawValue = text.substring(colonPos, endPos).trim();
    
    // Remove trailing comma and any following text that might be part of next attribute
    rawValue = rawValue.replace(/,\s*$/, '');
    
    // Special handling for attributes that might capture too much
    if ((attrPos.term === 'màu' || attrPos.term === 'màu sắc') && attrPos.attr === 'color') {
      // Special handling for color to avoid capturing next attributes
      // Look for patterns that end color values (common ending patterns)
      const colorMatch = rawValue.match(/^([^,]+(?:,\s*[^,]+)*?)(?=,\s*(?:chất liệu|size|kích|chính hãng|xuất xứ|giá|bảo hành|[a-zA-Z]+\s*:))/);
      if (colorMatch) {
        rawValue = colorMatch[1];
      }
    }
    
    // For material attribute, stop before color attributes
    if ((attrPos.term === 'chất liệu' || attrPos.term === 'material') && attrPos.attr === 'material') {
      const materialMatch = rawValue.match(/^([^,]+(?:,\s*[^,]+)*?)(?=,\s*(?:màu|color|size|kích|[a-zA-Z]+\s*:))/);
      if (materialMatch) {
        rawValue = materialMatch[1];
      }
    }
    
    const values = parseMultiValues(rawValue);
    
    if (values.length > 0) {
      // Filter out values that look like they might be attribute names
      const filteredValues = values.filter(v => !allAttributeNames.some(attr => v.toLowerCase().includes(attr.toLowerCase() + ':')));
      
      if (filteredValues.length > 0) {
        attributes.push({
          name: attrPos.attr,
          values: filteredValues,
          isMultiValue: filteredValues.length > 1
        });
        processedAttributes.add(attrPos.attr.toLowerCase());
      }
    }
  });

  return attributes;
}

// Suggest potential attributes based on description
function suggestAttributes(text: string): string[] {
  const suggestions: string[] = [];
  const lowerText = text.toLowerCase();

  // Check for common product categories and suggest relevant attributes
  if (lowerText.includes('điện thoại') || lowerText.includes('phone')) {
    suggestions.push('screen_size', 'storage', 'ram', 'battery', 'camera');
  }
  
  if (lowerText.includes('quần áo') || lowerText.includes('clothing') || lowerText.includes('shirt')) {
    suggestions.push('size', 'color', 'material', 'style', 'gender');
  }
  
  if (lowerText.includes('giày') || lowerText.includes('shoe')) {
    suggestions.push('size', 'color', 'material', 'type', 'gender');
  }
  
  if (lowerText.includes('laptop') || lowerText.includes('computer')) {
    suggestions.push('processor', 'ram', 'storage', 'screen_size', 'graphics_card');
  }
  
  if (lowerText.includes('jewelry') || lowerText.includes('trang sức')) {
    suggestions.push('material', 'stone_type', 'carat', 'style', 'occasion');
  }

  // Look for attribute keywords in the text
  const attributeKeywords = {
    'kích thước': 'size',
    'màu': 'color',
    'chất liệu': 'material',
    'size': 'size',
    'color': 'color',
    'material': 'material',
    '18k': 'material_purity',
    'kim cương': 'stone_type',
    'sapphire': 'crystal_type',
    'da cá sấu': 'strap_material'
  };

  Object.entries(attributeKeywords).forEach(([keyword, attribute]) => {
    if (lowerText.includes(keyword) && !suggestions.includes(attribute)) {
      suggestions.push(attribute);
    }
  });

  return [...new Set(suggestions)];
}

// Main extraction function
export async function extractProduct(
  request: ProductExtractionRequest
): Promise<ProductExtractionResponse> {
  try {
    const { description, options } = request;
    
    if (!description || description.trim().length === 0) {
      return {
        success: false,
        error: 'Description is required'
      };
    }

    // Extract basic information
    const name = extractProductName(description);
    const { price, currency } = extractPrice(description);
    
    // Extract attributes
    const attributes = extractAttributes(description, options?.extractAttributes);
    
    // Get suggestions for additional attributes
    const suggestions = suggestAttributes(description);

    const product: ExtractedProduct = {
      name,
      description: description.length > 200 ? description.substring(0, 200) + '...' : description,
      price,
      currency,
      attributes,
      rawText: description,
      extractedAt: new Date()
    };

    return {
      success: true,
      product,
      suggestions
    };
  } catch (error) {
    console.error('Product extraction error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Batch extraction for multiple products
export async function extractProducts(
  descriptions: string[]
): Promise<ProductExtractionResponse[]> {
  const results = await Promise.all(
    descriptions.map(description => 
      extractProduct({ description })
    )
  );
  
  return results;
}

// Format product for display
export function formatProduct(product: ExtractedProduct): string {
  const lines: string[] = [];
  
  if (product.name) {
    lines.push(`Product: ${product.name}`);
  }
  
  if (product.price) {
    lines.push(`Price: ${product.price} ${product.currency || ''}`);
  }
  
  if (product.attributes.length > 0) {
    lines.push('\nAttributes:');
    product.attributes.forEach(attr => {
      const valueDisplay = attr.isMultiValue 
        ? attr.values.join(', ')
        : attr.values[0];
      lines.push(`  ${attr.name}: ${valueDisplay}`);
    });
  }
  
  return lines.join('\n');
}