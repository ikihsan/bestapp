import { Metadata } from 'next';
import { ToolCard } from '@/components/tools/ToolCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { SEED_TOOLS } from '@/lib/seed-data';
import { SITE } from '@/lib/constants';

interface SearchPageProps {
  searchParams: { q?: string; category?: string; tag?: string; page?: string };
}

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  const q = searchParams.q || '';
  return {
    title: q ? `Search results for "${q}"` : 'Search AI Tools',
    description: `Search and discover the best AI tools${q ? ` for "${q}"` : ''}. Curated reviews and comparisons.`,
    alternates: { canonical: `${SITE.url}/search${q ? `?q=${encodeURIComponent(q)}` : ''}` },
    robots: { index: false, follow: true }, // search pages not indexed individually
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const q = searchParams.q?.toLowerCase() || '';
  const category = searchParams.category?.toLowerCase();
  const tag = searchParams.tag?.toLowerCase();

  let results = SEED_TOOLS.filter((t) => t.status === 'approved');

  if (q) {
    results = results.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        t.categories.some((cat) => cat.toLowerCase().includes(q)),
    );
  }

  if (category) {
    results = results.filter((t) => t.categories.some((c) => c.toLowerCase() === category));
  }

  if (tag) {
    results = results.filter((t) => t.tags.some((tg) => tg.toLowerCase() === tag));
  }

  return (
    <section className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-heading text-heading-1 font-bold text-on-surface">
        {q ? `Results for "${searchParams.q}"` : 'Search AI Tools'}
      </h1>

      <div className="mt-6 max-w-xl">
        <SearchBar initialQuery={searchParams.q} placeholder="Search AI tools..." />
      </div>

      <div className="mt-4 text-body-sm text-on-surface-muted">
        {results.length} result{results.length !== 1 ? 's' : ''} found
      </div>

      {results.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-border bg-surface-raised p-12 text-center">
          <p className="text-body text-on-surface-muted">
            No tools found matching your search. Try different keywords or{' '}
            <a href="/submit" className="text-brand-500 hover:underline">
              submit a tool
            </a>
            .
          </p>
        </div>
      )}
    </section>
  );
}
