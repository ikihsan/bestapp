import { NextResponse } from 'next/server';
import { SITE } from '@/lib/constants';

export async function GET() {
  const robots = `User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /admin
Disallow: /api/
Allow: /api/sitemap
Allow: /api/robots

# Sitemaps
Sitemap: ${SITE.url}/sitemap.xml
`;

  return new NextResponse(robots, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
