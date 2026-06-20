"use client";

import { generateAskMePageSchema } from '@/lib/seo-schemas';
import { useEffect } from 'react';

const STRUCTURED_DATA_ID = 'ask-me-structured-data';

function AskMeStructuredData() {
  useEffect(() => {
    const existingScript = document.getElementById(STRUCTURED_DATA_ID);
    const schema = generateAskMePageSchema();
    const script =
      existingScript instanceof HTMLScriptElement
        ? existingScript
        : document.createElement('script');

    script.id = STRUCTURED_DATA_ID;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema, null, 2);

    if (!existingScript) {
      document.head.appendChild(script);
    }

    return () => {
      script.remove();
    };
  }, []);

  return null;
}

export { AskMeStructuredData };
