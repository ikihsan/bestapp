import { toolJsonLd, categoryJsonLd, faqJsonLd } from '@/lib/seo';

describe('SEO JSON-LD generators', () => {
  describe('toolJsonLd', () => {
    it('generates valid SoftwareApplication schema', () => {
      const jsonLd = toolJsonLd({
        name: 'TestTool',
        description: 'A test tool',
        url: 'https://bestapp.live/tool/test',
        rating: { avg: 4.5, count: 100 },
        pricing: { free: true },
      });

      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('SoftwareApplication');
      expect(jsonLd.name).toBe('TestTool');
      expect(jsonLd.aggregateRating?.ratingValue).toBe(4.5);
      expect(jsonLd.offers?.price).toBe('0');
    });
  });

  describe('categoryJsonLd', () => {
    it('generates valid ItemList schema', () => {
      const jsonLd = categoryJsonLd('Writing', 'AI writing tools', [
        { name: 'Tool1', url: 'https://bestapp.live/tool/tool1' },
      ]);

      expect(jsonLd['@type']).toBe('ItemList');
      expect(jsonLd.numberOfItems).toBe(1);
      expect(jsonLd.itemListElement[0].position).toBe(1);
    });
  });

  describe('faqJsonLd', () => {
    it('generates valid FAQ schema', () => {
      const jsonLd = faqJsonLd([{ question: 'What is AI?', answer: 'Artificial Intelligence.' }]);

      expect(jsonLd['@type']).toBe('FAQPage');
      expect(jsonLd.mainEntity).toHaveLength(1);
      expect(jsonLd.mainEntity[0]['@type']).toBe('Question');
    });
  });
});
