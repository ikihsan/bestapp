import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit, getClientIp, hashIp, sanitizeInput } from '@/lib/security';
import { CHATBOT_RATE_LIMIT } from '@/lib/constants';
import type { ChatMessage } from '@/types';

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string().max(2000),
      }),
    )
    .min(1)
    .max(20),
  includeContext: z.boolean().optional(),
});

// Strip PII patterns
function stripPII(text: string): string {
  return text
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]')
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]');
}

async function callHuggingFace(messages: ChatMessage[]): Promise<string> {
  const HF_API_KEY = process.env.HF_API_KEY;
  if (!HF_API_KEY) throw new Error('HF_API_KEY not configured');

  const systemMessage = `You are a helpful AI tools advisor for bestapp.live. You help users discover the best AI tools for their needs. You can suggest tools, compare options, and answer questions about AI applications. Be concise, helpful, and always recommend checking the tool's page on bestapp.live for full details.`;

  const payload = {
    model: 'mistralai/Mistral-7B-Instruct-v0.3',
    messages: [
      { role: 'system', content: systemMessage },
      ...messages.map((m) => ({
        role: m.role,
        content: stripPII(sanitizeInput(m.content)),
      })),
    ],
    max_tokens: 500,
    temperature: 0.7,
  };

  const response = await fetch(
    'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(`HF API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'I apologize, I could not generate a response.';
}

async function callOpenAIFallback(messages: ChatMessage[]): Promise<string> {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not configured');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful AI tools advisor for bestapp.live. Help users discover the best AI tools for their needs.',
        },
        ...messages.map((m) => ({
          role: m.role,
          content: stripPII(sanitizeInput(m.content)),
        })),
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'I apologize, I could not generate a response.';
}

// FAQ fallback when both APIs are unavailable
function faqFallback(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes('write') || msg.includes('writing') || msg.includes('copy')) {
    return 'For writing tasks, check out ChatGPT, Jasper, and Grammarly on bestapp.live. Each has different strengths — ChatGPT is versatile, Jasper is great for marketing, and Grammarly excels at grammar and tone.';
  }
  if (msg.includes('image') || msg.includes('art') || msg.includes('design')) {
    return 'For image generation, Midjourney is our top pick for quality. Visit bestapp.live/category/image-generation to compare all options.';
  }
  if (msg.includes('code') || msg.includes('programming') || msg.includes('developer')) {
    return 'For coding, GitHub Copilot and Cursor are our top picks. Check bestapp.live/category/code-dev-tools for the full list.';
  }
  if (msg.includes('video') || msg.includes('audio') || msg.includes('podcast')) {
    return 'For video and audio, Runway (video generation) and Descript (editing) are excellent choices. See bestapp.live/category/video-audio.';
  }

  return 'I can help you find the best AI tools! Try asking about specific tasks like writing, image generation, coding, or video editing. You can also browse all tools at bestapp.live.';
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = getClientIp(request);
    const ipHash = hashIp(ip);
    const rl = checkRateLimit(`chat:${ipHash}`, CHATBOT_RATE_LIMIT);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
        },
      );
    }

    const body = await request.json();
    const parsed = chatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { messages } = parsed.data;
    let reply: string;

    try {
      reply = await callHuggingFace(messages);
    } catch (hfError) {
      console.warn('[Chat] HF unavailable, trying OpenAI fallback:', hfError);
      try {
        reply = await callOpenAIFallback(messages);
      } catch (oaiError) {
        console.warn('[Chat] OpenAI unavailable, using FAQ fallback:', oaiError);
        const lastUserMessage = messages.filter((m) => m.role === 'user').pop();
        reply = faqFallback(lastUserMessage?.content || '');
      }
    }

    return NextResponse.json({
      message: { role: 'assistant', content: reply },
      remaining: rl.remaining,
    });
  } catch (error) {
    console.error('[Chat] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
