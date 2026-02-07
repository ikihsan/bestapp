import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ToolCard } from '@/components/tools/ToolCard';
import { SEED_TOOLS } from '@/lib/seed-data';
import { SITE } from '@/lib/constants';

interface AlternativesPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return SEED_TOOLS.filter((t) => t.status === 'approved').map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: AlternativesPageProps): Promise<Metadata> {
  const tool = SEED_TOOLS.find((t) => t.slug === params.slug);
  if (!tool) return {};
  return {
    title: `Best ${tool.name} Alternatives — ${SITE.name}`,
    description: `Looking for ${tool.name} alternatives? Compare the best similar AI tools and find the perfect replacement.`,
    alternates: { canonical: `${SITE.url}/alternatives/${tool.slug}` },
  };
}

export default function AlternativesPage({ params }: AlternativesPageProps) {
  const tool = SEED_TOOLS.find((t) => t.slug === params.slug);
  if (!tool) notFound();

  // Find alternatives: same categories, not the same tool
  const alternatives = SEED_TOOLS.filter(
    (t) =>
      t.id !== tool.id &&
      t.status === 'approved' &&
      t.categories.some((c) => tool.categories.includes(c)),
  ).sort((a, b) => (b.editorialScore || 0) - (a.editorialScore || 0));

  return (
    <section className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-heading text-heading-1 font-bold text-on-surface">
        Best {tool.name} Alternatives
      </h1>
      <p className="mt-2 max-w-2xl text-body text-on-surface-muted">
        Looking for a {tool.name} alternative? Here are the best similar AI tools based on category
        overlap, ratings, and expert reviews.
      </p>

      {alternatives.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {alternatives.map((alt) => (
            <ToolCard key={alt.id} tool={alt} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-border bg-surface-raised p-12 text-center">
          <p className="text-body text-on-surface-muted">No alternatives found yet.</p>
        </div>
      )}
    </section>
  );
}
