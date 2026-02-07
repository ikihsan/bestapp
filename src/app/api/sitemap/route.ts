import { NextResponse } from 'next/server';
import { SEED_TOOLS, SEED_CATEGORIES } from '@/lib/seed-data';
import { SITE } from '@/lib/constants';

export async function GET() {
  const baseUrl = SITE.url;

  const staticPages = ['', '/categories', '/compare', '/submit', '/search'];

  const categoryPages = SEED_CATEGORIES.map((c) => `/category/${c.slug}`);

  const toolPages = SEED_TOOLS.filter((t) => t.status === 'approved').map((t) => `/tool/${t.slug}`);

  const alternativePages = SEED_TOOLS.filter((t) => t.status === 'approved').map(
    (t) => `/alternatives/${t.slug}`,
  );

  const allPages = [...staticPages, ...categoryPages, ...toolPages, ...alternativePages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (path) => `  <url>
    <loc>${baseUrl}${path}</loc>
    <changefreq>${path === '' ? 'daily' : path.startsWith('/tool/') ? 'weekly' : 'monthly'}</changefreq>
    <priority>${path === '' ? '1.0' : path.startsWith('/tool/') ? '0.8' : '0.6'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}
