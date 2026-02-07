import { SITE } from './constants';

interface JsonLdTool {
  name: string;
  description: string;
  url: string;
  image?: string;
  rating?: { avg: number; count: number };
  pricing?: { free: boolean };
}

export function toolJsonLd(tool: JsonLdTool) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: tool.url,
    applicationCategory: 'AI Tool',
    image: tool.image,
    offers: {
      '@type': 'Offer',
      price: tool.pricing?.free ? '0' : undefined,
      priceCurrency: 'USD',
    },
    aggregateRating: tool.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: tool.rating.avg,
          reviewCount: tool.rating.count,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
  };
}

export function categoryJsonLd(
  name: string,
  description: string,
  items: { name: string; url: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    url: `${SITE.url}/category/${name.toLowerCase().replace(/\s+/g, '-')}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
