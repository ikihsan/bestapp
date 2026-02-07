import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ToolCard } from '@/components/tools/ToolCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { SEED_TOOLS, SEED_CATEGORIES } from '@/lib/seed-data';
import { SITE } from '@/lib/constants';
import { categoryJsonLd } from '@/lib/seo';

interface CategoryPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return SEED_CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const cat = SEED_CATEGORIES.find((c) => c.slug === params.slug);
  if (!cat) return {};
  return {
    title: `Best AI ${cat.name} Tools — curated list`,
    description: `Discover the best AI tools for ${cat.name.toLowerCase()}. ${cat.description}`,
    alternates: { canonical: `${SITE.url}/category/${cat.slug}` },
    openGraph: {
      title: `Best AI ${cat.name} Tools — curated list | ${SITE.name}`,
      description: cat.description,
      url: `${SITE.url}/category/${cat.slug}`,
    },
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = SEED_CATEGORIES.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const tools = SEED_TOOLS.filter(
    (t) => t.categories.includes(category.id) && t.status === 'approved',
  ).sort((a, b) => (b.editorialScore || 0) - (a.editorialScore || 0));

  const jsonLd = categoryJsonLd(
    category.name,
    category.description,
    tools.map((t) => ({ name: t.name, url: `${SITE.url}/tool/${t.slug}` })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <section className="border-b border-border bg-surface-raised">
        <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{category.icon}</span>
            <div>
              <h1 className="font-heading text-heading-1 font-bold text-on-surface">
                Best AI {category.name} Tools
              </h1>
              <p className="mt-1 max-w-2xl text-body text-on-surface-muted">
                {category.description}
              </p>
            </div>
          </div>
          <div className="mt-6 max-w-lg">
            <SearchBar placeholder={`Search ${category.name.toLowerCase()} tools...`} />
          </div>
        </div>
      </section>

      {/* Tool grid */}
      <section className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-4 text-body-sm text-on-surface-muted">
          {tools.length} tool{tools.length !== 1 ? 's' : ''} found
        </div>
        {tools.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} priority={i < 3} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-surface-raised p-12 text-center">
            <p className="text-body text-on-surface-muted">No tools found in this category yet.</p>
          </div>
        )}
      </section>
    </>
  );
}
