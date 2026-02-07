import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit, getClientIp, hashIp, sanitizeInput } from '@/lib/security';
import { SUBMIT_RATE_LIMIT } from '@/lib/constants';

const submitSchema = z.object({
  name: z.string().min(2).max(100),
  website: z.string().url(),
  category: z.string().min(1),
  tags: z.array(z.string()).max(10).optional(),
  tagline: z.string().min(10).max(200),
  description: z.string().min(30).max(5000),
  pricing: z.enum(['free', 'freemium', 'paid']),
  screenshotPublicId: z.string().optional(),
  contactEmail: z.string().email().optional(),
  recaptchaToken: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = getClientIp(request);
    const ipHashed = hashIp(ip);
    const rl = checkRateLimit(`submit:${ipHashed}`, SUBMIT_RATE_LIMIT);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
        },
      );
    }

    const body = await request.json();
    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // Sanitize
    const submission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      payload: {
        name: sanitizeInput(data.name),
        website: data.website,
        categories: [data.category],
        tags: data.tags?.map(sanitizeInput) || [],
        tagline: sanitizeInput(data.tagline),
        description: sanitizeInput(data.description),
        pricing: {
          free: data.pricing === 'free' || data.pricing === 'freemium',
          tiers: [],
        },
        screenshots: data.screenshotPublicId
          ? [{ publicId: data.screenshotPublicId, url: '' }]
          : [],
      },
      submitterEmail: data.contactEmail || null,
      ipHash: ipHashed,
      createdAt: new Date().toISOString(),
      status: 'pending' as const,
    };

    // In production: save to Firestore
    // await adminDb.collection('submissions').doc(submission.id).set(submission);
    // await sendNotificationEmail('New tool submission', submission);

    console.log('[Submit] New submission:', submission.id);

    return NextResponse.json(
      { success: true, id: submission.id, message: 'Tool submitted for review!' },
      { status: 201 },
    );
  } catch (error) {
    console.error('[Submit] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
