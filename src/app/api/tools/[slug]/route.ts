import { NextRequest, NextResponse } from 'next/server';
import { SEED_TOOLS } from '@/lib/seed-data';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const tool = SEED_TOOLS.find((t) => t.slug === params.slug && t.status === 'approved');

  if (!tool) {
    return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
  }

  // In production: increment views in Firestore
  // await adminDb.collection('tools').doc(tool.id).update({
  //   'metrics.views': FieldValue.increment(1),
  // });

  return NextResponse.json(tool, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
