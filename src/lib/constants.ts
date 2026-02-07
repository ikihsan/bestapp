export const SITE = {
  name: 'bestapp.live',
  title: 'bestapp.live — Find the best AI apps for any task',
  description:
    'Discover, compare, and choose the best AI tools for writing, coding, image generation, video editing, productivity and more. Curated reviews, ratings, and side-by-side comparisons.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://bestapp.live',
  ogImage: '/og-default.png',
  twitterHandle: '@bestapplive',
};

export const CATEGORIES = [
  {
    id: 'writing',
    name: 'Writing',
    slug: 'writing',
    description:
      'AI writing assistants, grammar checkers, content generators, and copywriting tools that help you write faster and better.',
    icon: '✍️',
  },
  {
    id: 'image',
    name: 'Image Generation',
    slug: 'image-generation',
    description:
      'AI image generators, art creators, photo editors, and visual design tools powered by diffusion models and GANs.',
    icon: '🎨',
  },
  {
    id: 'video',
    name: 'Video & Audio',
    slug: 'video-audio',
    description:
      'AI video editors, text-to-video generators, audio transcription, voice cloning, and podcast tools.',
    icon: '🎬',
  },
  {
    id: 'code',
    name: 'Code & Dev Tools',
    slug: 'code-dev-tools',
    description:
      'AI coding assistants, code completion, debugging tools, documentation generators, and developer productivity boosters.',
    icon: '💻',
  },
  {
    id: 'productivity',
    name: 'Productivity',
    slug: 'productivity',
    description:
      'AI productivity tools, meeting assistants, note-taking, task management, and workflow automation.',
    icon: '⚡',
  },
] as const;

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]));

export const NAV_LINKS = [
  { label: 'Categories', href: '/categories' },
  { label: 'Compare', href: '/compare' },
  { label: 'Submit a Tool', href: '/submit' },
];

export const ITEMS_PER_PAGE = 12;
export const CHATBOT_RATE_LIMIT = 30; // per hour per session
export const SUBMIT_RATE_LIMIT = 5; // per hour per IP
