import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Check, X, Globe, Tag, ChevronRight } from 'lucide-react';
import { SEED_TOOLS } from '@/lib/seed-data';
import { SITE } from '@/lib/constants';
import { toolJsonLd } from '@/lib/seo';
import { StarRating } from '@/components/ui/StarRating';

interface ToolPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return SEED_TOOLS.filter((t) => t.status === 'approved').map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const tool = SEED_TOOLS.find((t) => t.slug === params.slug);
  if (!tool) return {};
  return {
    title: `${tool.name} — ${tool.tagline}`,
    description: `${tool.tagline} Read our curated review, pricing, pros & cons, and alternatives for ${tool.name}.`,
    alternates: { canonical: `${SITE.url}/tool/${tool.slug}` },
    openGraph: {
      title: `${tool.name} Review — ${SITE.name}`,
      description: tool.tagline,
      url: `${SITE.url}/tool/${tool.slug}`,
      type: 'article',
    },
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = SEED_TOOLS.find((t) => t.slug === params.slug);
  if (!tool) notFound();

  const jsonLd = toolJsonLd({
    name: tool.name,
    description: tool.description,
    url: `${SITE.url}/tool/${tool.slug}`,
    rating: tool.rating,
    pricing: tool.pricing,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mx-auto max-w-content px-4 pt-6 sm:px-6 lg:px-8" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 text-body-sm text-on-surface-muted">
          <li>
            <Link href="/" className="hover:text-brand-500">
              Home
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5" />
          {tool.categories[0] && (
            <>
              <li>
                <Link
                  href={`/category/${tool.categories[0]}`}
                  className="hover:text-brand-500 capitalize"
                >
                  {tool.categories[0]}
                </Link>
              </li>
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
          <li className="text-on-surface font-medium">{tool.name}</li>
        </ol>
      </nav>

      <article className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* ── Main content ─────────────────────────────── */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="flex items-start gap-5">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-border bg-surface-raised">
                <Image
                  src={tool.logos.publicId}
                  alt={`${tool.name} logo`}
                  fill
                  className="object-contain p-3"
                  priority
                />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-heading text-heading-1 font-bold text-on-surface">
                    {tool.name}
                  </h1>
                  {tool.featured && (
                    <span className="rounded-full bg-brand-500 px-3 py-0.5 text-caption font-medium text-on-brand">
                      Featured
                    </span>
                  )}
                </div>
                <p className="mt-1 text-body-lg text-on-surface-muted">{tool.tagline}</p>
                <div className="mt-2 flex items-center gap-3">
                  <StarRating rating={tool.rating.avg} />
                  <span className="text-body-sm text-on-surface-muted">
                    {tool.rating.avg} ({tool.rating.count} ratings)
                  </span>
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={tool.affiliateUrl || tool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3
                           font-medium text-on-brand transition-colors hover:bg-brand-600"
              >
                Visit Website <ExternalLink className="h-4 w-4" />
              </a>
              <Link
                href={`/alternatives/${tool.slug}`}
                className="inline-flex items-center rounded-lg border border-border bg-surface px-6
                           py-3 font-medium text-on-surface transition-colors hover:bg-surface-overlay"
              >
                View Alternatives
              </Link>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="font-heading text-heading-3 font-semibold text-on-surface">
                About {tool.name}
              </h2>
              <p className="mt-3 text-body leading-relaxed text-on-surface-muted">
                {tool.description}
              </p>
            </div>

            {/* Best For */}
            <div className="mt-8 rounded-xl border border-brand-200 bg-brand-50 p-5 dark:border-brand-800 dark:bg-brand-950">
              <p className="text-body-sm font-medium text-brand-700 dark:text-brand-300">
                Best for: {tool.bestFor}
              </p>
            </div>

            {/* Pros / Cons */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="font-heading text-heading-4 font-semibold text-on-surface">Pros</h3>
                <ul className="mt-3 space-y-2">
                  {tool.pros.map((pro, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-body-sm text-on-surface-muted"
                    >
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-heading text-heading-4 font-semibold text-on-surface">Cons</h3>
                <ul className="mt-3 space-y-2">
                  {tool.cons.map((con, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-body-sm text-on-surface-muted"
                    >
                      <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Features */}
            <div className="mt-8">
              <h2 className="font-heading text-heading-3 font-semibold text-on-surface">
                Key Features
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {tool.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-lg border border-border bg-surface-raised px-3 py-1.5
                               text-body-sm text-on-surface"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Screenshots */}
            {tool.screenshots.length > 0 && (
              <div className="mt-8">
                <h2 className="font-heading text-heading-3 font-semibold text-on-surface">
                  Screenshots
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {tool.screenshots.map((ss, i) => (
                    <div
                      key={i}
                      className="relative aspect-video overflow-hidden rounded-xl border border-border bg-surface-raised"
                    >
                      <Image
                        src={ss.publicId}
                        alt={`${tool.name} screenshot ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ──────────────────────────────────── */}
          <aside className="space-y-6">
            {/* Pricing */}
            <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
              <h3 className="font-heading text-heading-4 font-semibold text-on-surface">Pricing</h3>
              {tool.pricing.free && (
                <div className="mt-3 flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-body-sm text-on-surface">Free plan available</span>
                </div>
              )}
              {tool.pricing.tiers.map((tier, i) => (
                <div key={i} className="mt-3 rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-on-surface">{tier.name}</span>
                    <span className="text-body-sm font-semibold text-brand-500">{tier.price}</span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {tier.features.map((f, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-1.5 text-caption text-on-surface-muted"
                      >
                        <Check className="h-3 w-3 text-emerald-500" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Info */}
            <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
              <h3 className="font-heading text-heading-4 font-semibold text-on-surface">Info</h3>
              <dl className="mt-3 space-y-3 text-body-sm">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-on-surface-muted" />
                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-500 hover:underline"
                  >
                    {new URL(tool.website).hostname}
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <Tag className="mt-0.5 h-4 w-4 text-on-surface-muted" />
                  <div className="flex flex-wrap gap-1">
                    {tool.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/search?tag=${tag}`}
                        className="rounded-full bg-surface-overlay px-2 py-0.5 text-caption
                                   text-on-surface-muted hover:text-brand-500"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </dl>
            </div>

            {/* Metrics */}
            <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
              <h3 className="font-heading text-heading-4 font-semibold text-on-surface">Stats</h3>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-heading-4 font-bold text-on-surface">
                    {(tool.metrics.views / 1000).toFixed(1)}k
                  </div>
                  <div className="text-caption text-on-surface-muted">Views</div>
                </div>
                <div>
                  <div className="text-heading-4 font-bold text-on-surface">
                    {(tool.metrics.clicks / 1000).toFixed(1)}k
                  </div>
                  <div className="text-caption text-on-surface-muted">Clicks</div>
                </div>
                <div>
                  <div className="text-heading-4 font-bold text-on-surface">{tool.reviewCount}</div>
                  <div className="text-caption text-on-surface-muted">Reviews</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
