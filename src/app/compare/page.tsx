import { Metadata } from 'next';
import Link from 'next/link';
import { SEED_TOOLS } from '@/lib/seed-data';
import { SITE } from '@/lib/constants';
import { StarRating } from '@/components/ui/StarRating';
import { Check, X } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compare AI Tools — Side by Side',
  description: 'Compare AI tools side by side. See features, pricing, ratings, and pros & cons.',
  alternates: { canonical: `${SITE.url}/compare` },
};

export default function ComparePage({ searchParams }: { searchParams: { tools?: string } }) {
  const slugs = searchParams.tools?.split(',').slice(0, 4) || [];
  const tools = slugs
    .map((slug) => SEED_TOOLS.find((t) => t.slug === slug.trim()))
    .filter(Boolean) as typeof SEED_TOOLS;

  // Example comparisons for the landing
  const exampleComparisons = [
    { a: 'chatgpt', b: 'cursor', label: 'ChatGPT vs Cursor' },
    { a: 'midjourney', b: 'runway', label: 'Midjourney vs Runway' },
    { a: 'grammarly', b: 'jasper', label: 'Grammarly vs Jasper' },
    { a: 'github-copilot', b: 'cursor', label: 'GitHub Copilot vs Cursor' },
  ];

  if (tools.length < 2) {
    return (
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-heading text-heading-1 font-bold text-on-surface">Compare AI Tools</h1>
        <p className="mt-2 text-body text-on-surface-muted">
          Select two or more tools to compare side by side.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {exampleComparisons.map((comp) => (
            <Link
              key={comp.label}
              href={`/compare?tools=${comp.a},${comp.b}`}
              className="rounded-xl border border-border bg-surface p-5 shadow-card
                         transition-all hover:border-brand-300 hover:shadow-card-hover"
            >
              <h3 className="font-heading text-heading-4 font-semibold text-on-surface">
                {comp.label}
              </h3>
              <p className="mt-1 text-body-sm text-brand-500">Compare now →</p>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-heading text-heading-1 font-bold text-on-surface">
        {tools.map((t) => t.name).join(' vs ')}
      </h1>
      <p className="mt-2 text-body text-on-surface-muted">
        A side-by-side comparison of {tools.length} AI tools.
      </p>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-left text-body-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="p-4 text-on-surface-muted font-medium">Feature</th>
              {tools.map((tool) => (
                <th key={tool.id} className="p-4 font-heading font-semibold text-on-surface">
                  <Link href={`/tool/${tool.slug}`} className="hover:text-brand-500">
                    {tool.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="p-4 text-on-surface-muted">Rating</td>
              {tools.map((t) => (
                <td key={t.id} className="p-4">
                  <div className="flex items-center gap-2">
                    <StarRating rating={t.rating.avg} size="sm" />
                    <span>{t.rating.avg}</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-on-surface-muted">Free tier</td>
              {tools.map((t) => (
                <td key={t.id} className="p-4">
                  {t.pricing.free ? (
                    <Check className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-400" />
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-on-surface-muted">Starting price</td>
              {tools.map((t) => (
                <td key={t.id} className="p-4 font-medium">
                  {t.pricing.free ? 'Free' : t.pricing.tiers[0]?.price || 'N/A'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-on-surface-muted">Best for</td>
              {tools.map((t) => (
                <td key={t.id} className="p-4 text-on-surface-muted">
                  {t.bestFor}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-on-surface-muted">Pros</td>
              {tools.map((t) => (
                <td key={t.id} className="p-4">
                  <ul className="space-y-1">
                    {t.pros.map((p, i) => (
                      <li key={i} className="flex items-start gap-1 text-on-surface-muted">
                        <Check className="mt-0.5 h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-on-surface-muted">Cons</td>
              {tools.map((t) => (
                <td key={t.id} className="p-4">
                  <ul className="space-y-1">
                    {t.cons.map((c, i) => (
                      <li key={i} className="flex items-start gap-1 text-on-surface-muted">
                        <X className="mt-0.5 h-3.5 w-3.5 text-red-400 flex-shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
