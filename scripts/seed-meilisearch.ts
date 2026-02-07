/**
 * Seed Meilisearch with tool data.
 * Usage: npx tsx scripts/seed-meilisearch.ts
 */

import { MeiliSearch } from 'meilisearch';

// Import seed data directly
const SEED_TOOLS = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    slug: 'chatgpt',
    tagline: 'Conversational AI assistant for writing, coding, analysis and more.',
    description: 'ChatGPT by OpenAI is a general-purpose conversational AI...',
    categories: ['writing', 'code', 'productivity'],
    tags: ['chatbot', 'gpt-4', 'openai', 'writing', 'code'],
    pricing: { free: true },
    rating: { avg: 4.7, count: 1280 },
    metrics: { views: 45200 },
    featured: true,
    status: 'approved',
    editorialScore: 95,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    slug: 'midjourney',
    tagline: 'Create stunning AI-generated art and images from text prompts.',
    description: 'Midjourney is a leading AI image generation tool...',
    categories: ['image'],
    tags: ['image-generation', 'art', 'design'],
    pricing: { free: false },
    rating: { avg: 4.8, count: 980 },
    metrics: { views: 38500 },
    featured: true,
    status: 'approved',
    editorialScore: 93,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    slug: 'github-copilot',
    tagline: 'AI pair programmer that helps you write code faster.',
    description: 'GitHub Copilot is an AI-powered code completion tool...',
    categories: ['code'],
    tags: ['code-completion', 'developer', 'github'],
    pricing: { free: false },
    rating: { avg: 4.6, count: 890 },
    metrics: { views: 32100 },
    featured: true,
    status: 'approved',
    editorialScore: 92,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'jasper',
    name: 'Jasper',
    slug: 'jasper',
    tagline: 'AI copywriting and content marketing platform for teams.',
    description: 'Jasper is an AI content platform designed for marketing teams.',
    categories: ['writing'],
    tags: ['copywriting', 'marketing', 'content'],
    pricing: { free: false },
    rating: { avg: 4.4, count: 620 },
    metrics: { views: 22400 },
    featured: false,
    status: 'approved',
    editorialScore: 85,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'runway',
    name: 'Runway',
    slug: 'runway',
    tagline: 'AI-powered creative suite for video generation and editing.',
    description: 'Runway is a next-generation creative suite...',
    categories: ['video'],
    tags: ['video-generation', 'editing', 'creative'],
    pricing: { free: true },
    rating: { avg: 4.5, count: 540 },
    metrics: { views: 28700 },
    featured: true,
    status: 'approved',
    editorialScore: 90,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notion-ai',
    name: 'Notion AI',
    slug: 'notion-ai',
    tagline: 'AI writing and knowledge management built into Notion.',
    description: 'Notion AI brings AI directly into the Notion workspace.',
    categories: ['productivity', 'writing'],
    tags: ['notes', 'workspace'],
    pricing: { free: false },
    rating: { avg: 4.3, count: 470 },
    metrics: { views: 19800 },
    featured: false,
    status: 'approved',
    editorialScore: 82,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'descript',
    name: 'Descript',
    slug: 'descript',
    tagline: 'AI-powered video and podcast editing as easy as editing a doc.',
    description: 'Descript is an all-in-one audio and video editor.',
    categories: ['video'],
    tags: ['podcast', 'video-editing', 'transcription'],
    pricing: { free: true },
    rating: { avg: 4.5, count: 380 },
    metrics: { views: 16500 },
    featured: false,
    status: 'approved',
    editorialScore: 84,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'grammarly',
    name: 'Grammarly',
    slug: 'grammarly',
    tagline: 'AI writing assistant for grammar, clarity, and tone.',
    description: 'Grammarly is the most popular AI writing assistant.',
    categories: ['writing'],
    tags: ['grammar', 'writing-assistant', 'proofreading'],
    pricing: { free: true },
    rating: { avg: 4.6, count: 1540 },
    metrics: { views: 52300 },
    featured: true,
    status: 'approved',
    editorialScore: 91,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cursor',
    name: 'Cursor',
    slug: 'cursor',
    tagline: 'AI-first code editor built for pair programming with AI.',
    description: 'Cursor is a fork of VS Code rebuilt around AI.',
    categories: ['code'],
    tags: ['ide', 'code-editor', 'ai-coding'],
    pricing: { free: true },
    rating: { avg: 4.7, count: 620 },
    metrics: { views: 29400 },
    featured: true,
    status: 'approved',
    editorialScore: 94,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'otter-ai',
    name: 'Otter.ai',
    slug: 'otter-ai',
    tagline: 'AI meeting assistant for transcription, notes, and action items.',
    description: 'Otter.ai is an AI-powered meeting assistant.',
    categories: ['productivity'],
    tags: ['transcription', 'meeting', 'notes'],
    pricing: { free: true },
    rating: { avg: 4.4, count: 410 },
    metrics: { views: 18200 },
    featured: false,
    status: 'approved',
    editorialScore: 83,
    createdAt: new Date().toISOString(),
  },
];

async function seed() {
  const host = process.env.MEILI_HOST || 'http://localhost:7700';
  const apiKey = process.env.MEILI_MASTER_KEY || 'masterKey';

  console.log(`Connecting to Meilisearch at ${host}...`);
  const client = new MeiliSearch({ host, apiKey });

  // Health check
  try {
    const health = await client.health();
    console.log('Meilisearch health:', health.status);
  } catch (e) {
    console.error('Cannot connect to Meilisearch. Is it running?');
    process.exit(1);
  }

  // Create or update index
  const indexName = 'tools';
  try {
    await client.deleteIndex(indexName);
    console.log('Deleted existing index.');
  } catch {
    // Index may not exist
  }

  console.log('Creating index...');
  await client.createIndex(indexName, { primaryKey: 'id' });

  const index = client.index(indexName);

  // Configure index
  await index.updateSearchableAttributes(['name', 'tagline', 'description', 'tags', 'categories']);
  await index.updateFilterableAttributes(['categories', 'pricing.free', 'featured', 'status']);
  await index.updateSortableAttributes([
    'rating.avg',
    'metrics.views',
    'createdAt',
    'editorialScore',
  ]);

  // Add documents
  console.log(`Adding ${SEED_TOOLS.length} tools...`);
  const { taskUid } = await index.addDocuments(SEED_TOOLS);
  console.log(`Task ${taskUid} enqueued. Waiting for indexing...`);

  // Wait for task
  await client.waitForTask(taskUid);
  console.log('Indexing complete!');

  // Verify
  const stats = await index.getStats();
  console.log(`Index stats: ${stats.numberOfDocuments} documents indexed.`);
}

seed().catch(console.error);
