/* ──────────────────────────────────────────────────────────
   Core types for bestapp.live
   ────────────────────────────────────────────────────────── */

export interface Tool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string; // markdown
  categories: string[];
  tags: string[];
  features: string[];
  pricing: {
    free: boolean;
    tiers: PricingTier[];
  };
  website: string;
  repo?: string;
  affiliateUrl?: string;
  privacyUrl?: string;
  logos: CloudinaryAsset;
  screenshots: CloudinaryAsset[];
  rating: { avg: number; count: number };
  reviewCount: number;
  submittedBy?: string;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  createdAt: string;
  updatedAt: string;
  metrics: { views: number; clicks: number; installs: number };
  featured: boolean;
  editorialScore?: number;
  pros: string[];
  cons: string[];
  bestFor: string;
}

export interface PricingTier {
  name: string;
  price: string;
  features: string[];
}

export interface CloudinaryAsset {
  publicId: string;
  url: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  parentId?: string;
  toolCount?: number;
}

export interface Review {
  id: string;
  toolId: string;
  userId?: string;
  displayName?: string;
  rating: number;
  text: string;
  createdAt: string;
  moderated: boolean;
}

export interface Submission {
  id: string;
  payload: Partial<Tool>;
  submitterEmail?: string;
  ipHash?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  roles: ('user' | 'admin' | 'moderator')[];
  createdAt: string;
  lastSeen: string;
}

export interface AuditLog {
  event: string;
  actorId: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface SeoRedirect {
  from: string;
  to: string;
  type: 301 | 302;
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface SearchParams {
  q?: string;
  category?: string;
  tag?: string;
  page?: number;
  sort?: 'relevance' | 'rating' | 'newest' | 'popular';
  free?: boolean;
}
