import Link from 'next/link';
import Image from 'next/image';
import { Star, ExternalLink } from 'lucide-react';
import type { Tool } from '@/types';

interface ToolCardProps {
  tool: Tool;
  priority?: boolean;
}

export function ToolCard({ tool, priority = false }: ToolCardProps) {
  return (
    <Link href={`/tool/${tool.slug}`} className="group block">
      <article
        className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border
                   bg-surface shadow-card transition-all duration-200 hover:border-brand-300
                   hover:shadow-card-hover dark:hover:border-brand-600"
      >
        {/* Featured badge */}
        {tool.featured && (
          <div
            className="absolute right-3 top-3 z-10 rounded-full bg-brand-500 px-2.5 py-0.5
                          text-caption font-medium text-on-brand"
          >
            Featured
          </div>
        )}

        {/* Logo / Image area */}
        <div className="flex items-center gap-4 p-5 pb-3">
          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-surface-raised">
            <Image
              src={tool.logos.publicId}
              alt={`${tool.name} logo`}
              fill
              sizes="56px"
              className="object-contain p-2"
              priority={priority}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-heading text-heading-4 font-semibold text-on-surface group-hover:text-brand-500 transition-colors">
              {tool.name}
            </h3>
            <div className="mt-0.5 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-caption font-medium text-on-surface">{tool.rating.avg}</span>
                <span className="text-caption text-on-surface-muted">({tool.rating.count})</span>
              </div>
              {tool.pricing.free && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-caption font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Free
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tagline */}
        <p className="flex-1 px-5 text-body-sm text-on-surface-muted line-clamp-2">
          {tool.tagline}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 px-5 pt-3">
          {tool.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="rounded-full bg-brand-50 px-2.5 py-0.5 text-caption font-medium text-brand-700
                         dark:bg-brand-900/30 dark:text-brand-300"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between border-t border-border px-5 py-3">
          <span className="flex items-center gap-1 text-caption text-on-surface-muted">
            <ExternalLink className="h-3 w-3" />
            {(() => {
              try {
                return new URL(tool.website).hostname.replace('www.', '');
              } catch {
                return tool.website;
              }
            })()}
          </span>
          <span className="text-caption font-medium text-brand-500 group-hover:underline">
            View Details →
          </span>
        </div>
      </article>
    </Link>
  );
}
