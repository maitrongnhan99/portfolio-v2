// Product extraction types
export interface ProductAttribute {
  name: string;
  values: string[]; // Array to support multiple values
  isMultiValue: boolean;
}

export interface ExtractedProduct {
  name?: string;
  description?: string;
  price?: string;
  currency?: string;
  attributes: ProductAttribute[];
  rawText: string;
  extractedAt: Date;
}

export interface ProductExtractionRequest {
  description: string;
  options?: {
    extractAttributes?: string[]; // Specific attributes to look for
    language?: 'en' | 'vi'; // Support for Vietnamese descriptions
  };
}

export interface ProductExtractionResponse {
  success: boolean;
  product?: ExtractedProduct;
  error?: string;
  suggestions?: string[]; // Suggested attribute names based on description
}

// Common product attributes
export const COMMON_ATTRIBUTES = [
  'material',
  'materials',
  'color',
  'colors',
  'size',
  'sizes',
  'weight',
  'dimensions',
  'brand',
  'warranty',
  'origin',
  'condition',
  'features',
  'compatibility',
  'model',
  'year',
  'capacity',
  'power',
  'voltage',
  'certification',
  'type',
  'style',
  'pattern',
  'finish',
  'texture',
  'shape',
  'gender',
  'age',
  'season',
  'occasion',
  'fabric',
  'care',
  'packaging'
];

// Vietnamese attribute mappings
export const VIETNAMESE_ATTRIBUTES: Record<string, string> = {
  'chất liệu': 'material',
  'màu sắc': 'color',
  'màu': 'color',
  'kích thước': 'size',
  'kích cỡ': 'size',
  'trọng lượng': 'weight',
  'thương hiệu': 'brand',
  'bảo hành': 'warranty',
  'xuất xứ': 'origin',
  'tình trạng': 'condition',
  'tính năng': 'features',
  'kiểu dáng': 'style',
  'họa tiết': 'pattern',
  'chất lượng': 'quality',
  'công suất': 'power',
  'điện áp': 'voltage',
  'dung tích': 'capacity',
  'loại': 'type',
  'mẫu': 'model',
  'năm': 'year',
  'giới tính': 'gender',
  'độ tuổi': 'age',
  'mùa': 'season',
  'dịp': 'occasion',
  'vải': 'fabric',
  'bảo quản': 'care',
  'đóng gói': 'packaging'
};