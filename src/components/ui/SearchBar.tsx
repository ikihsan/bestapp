'use client';

import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  placeholder?: string;
  size?: 'default' | 'hero';
  initialQuery?: string;
}

export function SearchBar({
  placeholder = 'Search AI tools...',
  size = 'default',
  initialQuery = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, router],
  );

  const isHero = size === 'hero';

  return (
    <form onSubmit={handleSubmit} className="w-full" role="search">
      <div className="relative">
        <Search
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-muted ${
            isHero ? 'h-6 w-6' : 'h-5 w-5'
          }`}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-border bg-surface pl-12 pr-4 text-on-surface
                     shadow-card placeholder:text-on-surface-muted transition-all
                     focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10
                     ${isHero ? 'h-16 text-body-lg' : 'h-12 text-body'}`}
          aria-label="Search AI tools"
        />
        <button
          type="submit"
          className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-brand-500 font-medium
                     text-on-brand transition-colors hover:bg-brand-600
                     ${isHero ? 'px-6 py-2.5 text-body' : 'px-4 py-2 text-body-sm'}`}
        >
          Search
        </button>
      </div>
    </form>
  );
}
