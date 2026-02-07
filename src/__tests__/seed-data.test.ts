import { SEED_TOOLS, SEED_CATEGORIES } from '@/lib/seed-data';

describe('seed data integrity', () => {
  it('has exactly 10 tools', () => {
    expect(SEED_TOOLS).toHaveLength(10);
  });

  it('has 5 categories', () => {
    expect(SEED_CATEGORIES).toHaveLength(5);
  });

  it('all tools have required fields', () => {
    for (const tool of SEED_TOOLS) {
      expect(tool.id).toBeTruthy();
      expect(tool.name).toBeTruthy();
      expect(tool.slug).toBeTruthy();
      expect(tool.tagline).toBeTruthy();
      expect(tool.description).toBeTruthy();
      expect(tool.categories.length).toBeGreaterThan(0);
      expect(tool.status).toBe('approved');
      expect(tool.rating.avg).toBeGreaterThanOrEqual(1);
      expect(tool.rating.avg).toBeLessThanOrEqual(5);
    }
  });

  it('all tools have unique slugs', () => {
    const slugs = SEED_TOOLS.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('all tool categories reference valid categories', () => {
    const catIds = new Set(SEED_CATEGORIES.map((c) => c.id));
    for (const tool of SEED_TOOLS) {
      for (const cat of tool.categories) {
        expect(catIds.has(cat)).toBe(true);
      }
    }
  });

  it('every category has at least one tool', () => {
    for (const cat of SEED_CATEGORIES) {
      const tools = SEED_TOOLS.filter((t) => t.categories.includes(cat.id));
      expect(tools.length).toBeGreaterThan(0);
    }
  });

  it('featured tools exist', () => {
    const featured = SEED_TOOLS.filter((t) => t.featured);
    expect(featured.length).toBeGreaterThan(0);
  });

  it('all tools have pros and cons', () => {
    for (const tool of SEED_TOOLS) {
      expect(tool.pros.length).toBeGreaterThanOrEqual(3);
      expect(tool.cons.length).toBeGreaterThanOrEqual(3);
    }
  });
});
