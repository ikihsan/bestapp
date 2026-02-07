import { NextRequest, NextResponse } from 'next/server';
import { SEED_TOOLS } from '@/lib/seed-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
  const category = searchParams.get('category')?.toLowerCase();
  const tag = searchParams.get('tag')?.toLowerCase();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || 'relevance';
  const free = searchParams.get('free');
  const perPage = 12;

  let results = SEED_TOOLS.filter((t) => t.status === 'approved');

  // Filters
  if (q) {
    results = results.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tg) => tg.toLowerCase().includes(q)) ||
        t.categories.some((c) => c.toLowerCase().includes(q)),
    );
  }
  if (category) {
    results = results.filter((t) => t.categories.some((c) => c.toLowerCase() === category));
  }
  if (tag) {
    results = results.filter((t) => t.tags.some((tg) => tg.toLowerCase() === tag));
  }
  if (free === 'true') {
    results = results.filter((t) => t.pricing.free);
  }

  // Sort
  switch (sort) {
    case 'rating':
      results.sort((a, b) => b.rating.avg - a.rating.avg);
      break;
    case 'newest':
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'popular':
      results.sort((a, b) => b.metrics.views - a.metrics.views);
      break;
    default: // relevance — keep editorial score
      results.sort((a, b) => (b.editorialScore || 0) - (a.editorialScore || 0));
  }

  // Paginate
  const total = results.length;
  const start = (page - 1) * perPage;
  const items = results.slice(start, start + perPage);

  return NextResponse.json(
    {
      items,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    },
  );
}
