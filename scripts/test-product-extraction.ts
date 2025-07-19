import { extractProduct } from '../services/productExtractor';
import { ProductExtractionRequest } from '../types/product';

// Test cases with multi-value attributes
const testCases: ProductExtractionRequest[] = [
  {
    description: 'iPhone 15 Pro Max 256GB, màu: titan tự nhiên, titan xanh, titan trắng, titan đen, chính hãng Apple Việt Nam',
  },
  {
    description: 'Đồng hồ Rolex Submariner, vàng 18K, kim cương thật, kính sapphire, dây da cá sấu, giá: 500.000.000 VND',
  },
  {
    description: 'Giày Nike Air Max 90, size: 40, 41, 42, 43, màu sắc: đen, trắng, xám, chất liệu: da tổng hợp, đế cao su, xuất xứ: Việt Nam',
  },
  {
    description: 'Laptop Dell XPS 15, CPU: Intel Core i7, i9, RAM: 16GB, 32GB, SSD: 512GB, 1TB, 2TB, màn hình: 15.6 inch OLED',
  },
  {
    description: 'Áo sơ mi nam, chất liệu: cotton, linen, polyester, màu: trắng, xanh, đen, đỏ, vàng, size: S, M, L, XL, XXL, kiểu dáng: slim fit, regular fit',
  }
];

async function runTests() {
  console.log('🧪 Testing Product Extraction with Multi-Value Support\n');
  console.log('=' * 80);

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\nTest Case ${i + 1}:`);
    console.log(`Description: "${testCase.description}"`);
    console.log('-'.repeat(60));

    const result = await extractProduct(testCase);

    if (result.success && result.product) {
      const product = result.product;
      
      if (product.name) {
        console.log(`✓ Product Name: ${product.name}`);
      }
      
      if (product.price) {
        console.log(`✓ Price: ${product.price} ${product.currency || ''}`);
      }

      if (product.attributes.length > 0) {
        console.log('\n✓ Extracted Attributes:');
        product.attributes.forEach(attr => {
          if (attr.isMultiValue) {
            console.log(`  📦 ${attr.name} (${attr.values.length} values):`);
            attr.values.forEach(value => {
              console.log(`     • ${value}`);
            });
          } else {
            console.log(`  📦 ${attr.name}: ${attr.values[0]}`);
          }
        });
      }

      if (result.suggestions && result.suggestions.length > 0) {
        console.log('\n💡 Suggested Attributes:', result.suggestions.join(', '));
      }
    } else {
      console.log(`❌ Extraction failed: ${result.error}`);
    }

    console.log('\n' + '='.repeat(80));
  }

  // Test batch extraction
  console.log('\n\n🧪 Testing Batch Extraction\n');
  console.log('=' * 80);
  
  const { extractProducts } = await import('../services/productExtractor');
  const batchDescriptions = testCases.map(tc => tc.description);
  const batchResults = await extractProducts(batchDescriptions);
  
  console.log(`✓ Processed ${batchResults.length} products in batch`);
  console.log(`✓ Success rate: ${batchResults.filter(r => r.success).length}/${batchResults.length}`);
  
  // Summary of multi-value attributes found
  console.log('\n📊 Multi-Value Attributes Summary:');
  batchResults.forEach((result, index) => {
    if (result.success && result.product) {
      const multiValueAttrs = result.product.attributes.filter(attr => attr.isMultiValue);
      if (multiValueAttrs.length > 0) {
        console.log(`\nProduct ${index + 1}:`);
        multiValueAttrs.forEach(attr => {
          console.log(`  • ${attr.name}: ${attr.values.length} values`);
        });
      }
    }
  });
}

// Run the tests
runTests().catch(console.error);