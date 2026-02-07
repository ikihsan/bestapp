'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-raised">
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 font-heading text-lg font-bold text-on-surface"
            >
              <Sparkles className="h-5 w-5 text-brand-500" />
              bestapp.live
            </Link>
            <p className="mt-3 text-body-sm text-on-surface-muted">
              Find the best AI apps for any task. Curated reviews, comparisons, and ratings to help
              you choose the right tools.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading text-body-sm font-semibold uppercase tracking-wider text-on-surface-muted">
              Categories
            </h3>
            <ul className="mt-3 space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-body-sm text-on-surface-muted transition-colors hover:text-brand-500"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-heading text-body-sm font-semibold uppercase tracking-wider text-on-surface-muted">
              Resources
            </h3>
            <ul className="mt-3 space-y-2">
              {[
                { label: 'Submit a Tool', href: '/submit' },
                { label: 'Compare Tools', href: '/compare' },
                { label: 'All Categories', href: '/categories' },
                { label: 'Search', href: '/search' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-on-surface-muted transition-colors hover:text-brand-500"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-heading text-body-sm font-semibold uppercase tracking-wider text-on-surface-muted">
              Stay Updated
            </h3>
            <p className="mt-3 text-body-sm text-on-surface-muted">
              Get weekly picks of the best new AI tools delivered to your inbox.
            </p>
            <form className="mt-3 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-body-sm
                           placeholder:text-on-surface-muted focus:border-brand-500 focus:outline-none
                           focus:ring-2 focus:ring-brand-500/20"
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                className="rounded-md bg-brand-500 px-4 py-2 text-body-sm font-medium text-on-brand
                           transition-colors hover:bg-brand-600"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-caption text-on-surface-muted">
          &copy; {new Date().getFullYear()} bestapp.live. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
