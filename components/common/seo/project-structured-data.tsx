import { generateProjectPageSchema } from '@/lib/seo-schemas';

interface ProjectStructuredDataProps {
  project: any;
}

function ProjectStructuredData({ project }: ProjectStructuredDataProps) {
  const schema = generateProjectPageSchema(project);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2),
      }}
    />
  );
}

export { ProjectStructuredData };