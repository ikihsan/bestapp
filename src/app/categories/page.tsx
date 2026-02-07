import { Metadata } from 'next';
import { CategoryCard } from '@/components/tools/CategoryCard';
import { SEED_CATEGORIES, SEED_TOOLS } from '@/lib/seed-data';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'All Categories',
  description:
    'Browse AI tools by category: writing, image generation, video, coding, productivity.',
  alternates: { canonical: `${SITE.url}/categories` },
};

export default function CategoriesPage() {
  const categoriesWithCount = SEED_CATEGORIES.map((cat) => ({
    ...cat,
    toolCount: SEED_TOOLS.filter((t) => t.categories.includes(cat.id) && t.status === 'approved')
      .length,
  }));

  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-heading-1 font-bold text-on-surface">All Categories</h1>
      <p className="mt-2 text-body text-on-surface-muted">
        Browse our curated collection of AI tools organized by what you need to accomplish.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categoriesWithCount.map((cat) => (
          <CategoryCard key={cat.slug} category={cat} toolCount={cat.toolCount} />
        ))}
      </div>
    </section>
  );
}
