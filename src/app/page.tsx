import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Zap } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { ToolCard } from '@/components/tools/ToolCard';
import { CategoryCard } from '@/components/tools/CategoryCard';
import { NewsletterForm } from '@/components/ui/NewsletterForm';
import { SEED_TOOLS, SEED_CATEGORIES } from '@/lib/seed-data';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Find the best AI apps for any task — bestapp.live',
  description:
    'Discover, compare, and choose the best AI tools for writing, coding, image generation, video editing, productivity and more. Curated reviews and ratings.',
  alternates: { canonical: SITE.url },
};

export default function HomePage() {
  const featured = SEED_TOOLS.filter((t) => t.featured && t.status === 'approved');
  const trending = SEED_TOOLS.filter((t) => t.status === 'approved')
    .sort((a, b) => b.metrics.views - a.metrics.views)
    .slice(0, 6);

  const categoryToolCounts = SEED_CATEGORIES.map((cat) => ({
    ...cat,
    toolCount: SEED_TOOLS.filter((t) => t.categories.includes(cat.id) && t.status === 'approved')
      .length,
  }));

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-gradient">
        <div className="mx-auto max-w-content px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8 lg:pb-24 lg:pt-28">
          <h1 className="mx-auto max-w-3xl font-heading text-display font-bold text-on-surface">
            Find the <span className="text-gradient">best AI apps</span> for any task
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-body-lg text-on-surface-muted">
            Discover, compare, and choose from hundreds of curated AI tools. Verified reviews,
            side-by-side comparisons, and expert recommendations.
          </p>
          <div className="mx-auto mt-8 max-w-xl">
            <SearchBar size="hero" placeholder="What do you want AI to help with?" />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-body-sm text-on-surface-muted">
            <span>Popular:</span>
            {['Writing', 'Image Generation', 'Coding', 'Productivity'].map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-full border border-border bg-surface px-3 py-1 transition-colors
                           hover:border-brand-300 hover:text-brand-500"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────── */}
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-heading-2 font-bold text-on-surface">
            Browse by Category
          </h2>
          <Link
            href="/categories"
            className="flex items-center gap-1 text-body-sm font-medium text-brand-500 hover:underline"
          >
            All categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categoryToolCounts.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} toolCount={cat.toolCount} />
          ))}
        </div>
      </section>

      {/* ── Featured ─────────────────────────────────────── */}
      <section className="bg-surface-raised">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-brand-500" />
            <h2 className="font-heading text-heading-2 font-bold text-on-surface">
              Featured Tools
            </h2>
          </div>
          <p className="mt-2 text-body text-on-surface-muted">
            Hand-picked by our editors — the best AI tools right now.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} priority={i < 3} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Trending ─────────────────────────────────────── */}
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-brand-500" />
          <h2 className="font-heading text-heading-2 font-bold text-on-surface">Trending</h2>
        </div>
        <p className="mt-2 text-body text-on-surface-muted">The most viewed AI tools this week.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trending.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* ── Newsletter CTA ───────────────────────────────── */}
      <section className="bg-brand-500 dark:bg-brand-600">
        <div className="mx-auto max-w-content px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-heading-2 font-bold text-white">
            Stay ahead of the AI curve
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-body text-white/80">
            Get weekly curated picks of the best new AI tools delivered straight to your inbox. No
            spam, unsubscribe anytime.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
