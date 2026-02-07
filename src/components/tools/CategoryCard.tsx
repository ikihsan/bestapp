import Link from 'next/link';

interface CategoryCardProps {
  category: {
    name: string;
    slug: string;
    description: string;
    icon?: string;
  };
  toolCount?: number;
}

export function CategoryCard({ category, toolCount }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`} className="group block">
      <div
        className="flex flex-col items-center rounded-xl border border-border bg-surface p-6
                   shadow-card transition-all duration-200 hover:border-brand-300
                   hover:shadow-card-hover dark:hover:border-brand-600 text-center"
      >
        <span className="text-4xl" role="img" aria-label={category.name}>
          {category.icon || '📦'}
        </span>
        <h3 className="mt-3 font-heading text-heading-4 font-semibold text-on-surface group-hover:text-brand-500 transition-colors">
          {category.name}
        </h3>
        <p className="mt-1.5 text-body-sm text-on-surface-muted line-clamp-2">
          {category.description}
        </p>
        {toolCount !== undefined && (
          <span className="mt-3 rounded-full bg-brand-50 px-3 py-1 text-caption font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
            {toolCount} tools
          </span>
        )}
      </div>
    </Link>
  );
}
