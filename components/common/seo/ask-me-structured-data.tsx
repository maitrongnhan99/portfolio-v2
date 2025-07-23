import { generateAskMePageSchema } from '@/lib/seo-schemas';

function AskMeStructuredData() {
  const schema = generateAskMePageSchema();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2),
      }}
    />
  );
}

export { AskMeStructuredData };