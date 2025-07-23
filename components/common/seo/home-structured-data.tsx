import { generateHomePageSchema } from '@/lib/seo-schemas';

function HomeStructuredData() {
  const schema = generateHomePageSchema();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2),
      }}
    />
  );
}

export { HomeStructuredData };