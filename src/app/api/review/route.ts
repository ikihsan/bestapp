import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit, getClientIp, hashIp, sanitizeInput } from '@/lib/security';

const reviewSchema = z.object({
  toolId: z.string().min(1),
  rating: z.number().min(1).max(5),
  text: z.string().min(5).max(2000),
  displayName: z.string().max(100).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`review:${hashIp(ip)}`, 10);
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const review = {
      id: `rev_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      toolId: data.toolId,
      userId: null, // populated if user is authenticated
      displayName: data.displayName ? sanitizeInput(data.displayName) : 'Anonymous',
      rating: data.rating,
      text: sanitizeInput(data.text),
      createdAt: new Date().toISOString(),
      moderated: false,
    };

    // In production: save to Firestore
    // await adminDb.collection('reviews').doc(review.id).set(review);

    console.log('[Review] New review:', review.id);

    return NextResponse.json(
      { success: true, id: review.id, message: 'Review submitted for moderation!' },
      { status: 201 },
    );
  } catch (error) {
    console.error('[Review] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
