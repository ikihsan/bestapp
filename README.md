# bestapp.live

> **Find the best AI apps for any task.** A curated AI tools discovery engine with SEO-first architecture, chatbot assistance, and community-driven submissions.

[![CI](https://github.com/YOUR_ORG/bestapp/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_ORG/bestapp/actions/workflows/ci.yml)
[![Deploy](https://github.com/YOUR_ORG/bestapp/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_ORG/bestapp/actions/workflows/deploy.yml)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Architecture](#architecture)
- [Firebase Setup](#firebase-setup)
- [Meilisearch Setup](#meilisearch-setup)
- [Cloudinary Setup](#cloudinary-setup)
- [Chatbot Configuration](#chatbot-configuration)
- [SEO Checklist](#seo-checklist)
- [Testing](#testing)
- [Deployment](#deployment)
- [Production Launch Checklist](#production-launch-checklist)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **SEO-first** — Server-rendered pages with JSON-LD structured data, auto-generated sitemap, canonical URLs
- **Browse without auth** — All tool listings and details are public; auth only for submitting/reviewing
- **10 curated AI tools** seeded (ChatGPT, Midjourney, GitHub Copilot, Jasper, Runway, Notion AI, Descript, Grammarly, Cursor, Otter.ai)
- **5 categories** — Writing, Image Generation, Video & Audio, Code & Dev Tools, Productivity
- **Full-text search** powered by Meilisearch with faceting & filters
- **AI chatbot** widget (Hugging Face → OpenAI fallback → FAQ fallback)
- **Dark/light theme** toggle with system preference detection and no FOUC
- **Submit a tool** flow with admin moderation dashboard
- **Responsive design** — mobile-first, WCAG 2.1 AA accessible
- **Compare tools** side-by-side
- **Alternatives pages** — find alternatives to any tool
- **PWA-ready** — web manifest included
- **CI/CD** — GitHub Actions for lint, test, build, and Vercel deployment

---

## Tech Stack

| Layer      | Technology                         |
| ---------- | ---------------------------------- |
| Framework  | Next.js 14 (App Router)            |
| Language   | TypeScript (strict)                |
| Styling    | Tailwind CSS 3.4 + CSS variables   |
| Database   | Firebase Firestore                 |
| Auth       | Firebase Auth (Google, GitHub)     |
| Search     | Meilisearch 1.11                   |
| Images     | Cloudinary (custom Next.js loader) |
| Animations | Framer Motion                      |
| Icons      | Lucide React                       |
| Chatbot    | HF Inference API / OpenAI          |
| CI/CD      | GitHub Actions → Vercel            |
| Testing    | Jest + Playwright                  |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.17
- **pnpm**, **npm**, or **yarn**
- **Docker** (for Meilisearch local dev)
- **Firebase** project with Firestore + Auth enabled
- **Cloudinary** account
- **Meilisearch** instance (local via Docker or Meilisearch Cloud)

### Installation

```bash
git clone https://github.com/YOUR_ORG/bestapp.git
cd bestapp
npm install
```

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable                                | Description                                   |
| --------------------------------------- | --------------------------------------------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`          | Firebase project API key                      |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`      | Firebase Auth domain                          |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`       | Firebase project ID                           |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`   | Firebase storage bucket                       |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER` | Firebase messaging sender ID                  |
| `NEXT_PUBLIC_FIREBASE_APP_ID`           | Firebase app ID                               |
| `FIREBASE_ADMIN_PROJECT_ID`             | Firebase Admin project ID                     |
| `FIREBASE_ADMIN_CLIENT_EMAIL`           | Firebase Admin service account email          |
| `FIREBASE_ADMIN_PRIVATE_KEY`            | Firebase Admin private key (include newlines) |
| `NEXT_PUBLIC_MEILISEARCH_HOST`          | Meilisearch host URL                          |
| `NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY`    | Meilisearch public search key                 |
| `MEILISEARCH_ADMIN_KEY`                 | Meilisearch admin/master key                  |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`     | Cloudinary cloud name                         |
| `CLOUDINARY_API_KEY`                    | Cloudinary API key                            |
| `CLOUDINARY_API_SECRET`                 | Cloudinary API secret                         |
| `HF_API_TOKEN`                          | Hugging Face API token (chatbot)              |
| `OPENAI_API_KEY`                        | OpenAI API key (chatbot fallback, optional)   |
| `NEXT_PUBLIC_SITE_URL`                  | Production URL (https://bestapp.live)         |
| `VERCEL_TOKEN`                          | Vercel deployment token                       |

### Running Locally

```bash
# 1. Start Meilisearch via Docker
docker compose up -d

# 2. Seed Meilisearch with tool data
npx tsx scripts/seed-meilisearch.ts

# 3. (Optional) Seed Firestore
npx tsx scripts/seed-firestore.ts

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Architecture

```
Browser ─→ Next.js (Vercel Edge)
              ├── SSR/ISR Pages (SEO)
              ├── API Routes
              │   ├── /api/tools ─→ seed-data (MVP) → Firestore (prod)
              │   ├── /api/chat  ─→ HF API → OpenAI → FAQ fallback
              │   ├── /api/submit-tool ─→ Firestore (submissions)
              │   └── /api/sitemap ─→ auto-generated XML
              ├── Client Components
              │   ├── ThemeProvider (light/dark)
              │   ├── AuthProvider (Firebase Auth)
              │   └── ChatWidget (floating assistant)
              └── Static Assets (Cloudinary CDN)

Search: Meilisearch (Docker / Cloud)
DB:     Firebase Firestore
Auth:   Firebase Auth (Google, GitHub)
Images: Cloudinary (responsive, auto-format)
```

---

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Firestore Database** (production mode)
3. Enable **Authentication** → Sign-in providers: **Google**, **GitHub**
4. Go to Project Settings → Service Accounts → Generate new private key
5. Add the private key values to `.env.local`
6. Deploy Firestore rules:
   ```bash
   firebase deploy --only firestore:rules
   ```
7. Deploy Firestore indexes:
   ```bash
   firebase deploy --only firestore:indexes
   ```

### Firestore Collections

| Collection    | Purpose                  |
| ------------- | ------------------------ |
| `tools`       | Approved tool listings   |
| `categories`  | Category metadata        |
| `reviews`     | User reviews/ratings     |
| `submissions` | Pending tool submissions |
| `users`       | User profiles and roles  |

---

## Meilisearch Setup

### Local (Docker)

```bash
docker compose up -d
# Meilisearch runs at http://localhost:7700
# Master key: bestapp_dev_master_key_change_me
```

### Cloud (Production)

1. Sign up at [cloud.meilisearch.com](https://cloud.meilisearch.com)
2. Create an instance
3. Copy the host URL and API keys to `.env.local`

### Seeding

```bash
# Seed tools index
npx tsx scripts/seed-meilisearch.ts

# Export data (backup)
npx tsx scripts/export-meilisearch.ts
```

---

## Cloudinary Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Copy your cloud name, API key, and API secret to `.env.local`
3. Upload tool logos and screenshots to your Cloudinary media library
4. Images are served via a custom Next.js image loader with automatic format & quality optimization

### Image Naming Convention

```
bestapp/{tool-slug}/logo        → Tool logo
bestapp/{tool-slug}/screenshot  → Tool screenshot
bestapp/og-default              → Default OG image
```

---

## Chatbot Configuration

The chatbot uses a 3-tier fallback:

1. **Hugging Face Inference API** (Mistral-7B-Instruct-v0.3) — primary
2. **OpenAI API** (GPT-3.5-turbo) — fallback if HF fails
3. **FAQ responses** — hardcoded fallback if both APIs fail

Set `HF_API_TOKEN` (required) and `OPENAI_API_KEY` (optional) in `.env.local`.

Rate limit: 30 requests/hour per IP address.

---

## SEO Checklist

- [x] Server-rendered pages with `generateMetadata()`
- [x] JSON-LD structured data (SoftwareApplication, ItemList, FAQ)
- [x] Auto-generated XML sitemap at `/sitemap.xml`
- [x] `robots.txt` at `/robots.txt`
- [x] Canonical URLs on every page
- [x] Open Graph & Twitter Card meta tags
- [x] Semantic HTML (nav, main, article, section, aside)
- [x] Alt text on all images
- [x] Descriptive page titles and meta descriptions
- [ ] Google Search Console verification (post-deploy)
- [ ] Submit sitemap to Google & Bing
- [ ] Set up Google Analytics / Plausible
- [ ] Create social preview images per tool

---

## Testing

### Unit Tests (Jest)

```bash
npm test              # run all tests
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

Tests cover:

- Security utilities (rate limiting, IP hashing, sanitization)
- Cloudinary URL generation
- Seed data integrity
- JSON-LD schema generation

### E2E Tests (Playwright)

```bash
npm run test:e2e
```

Tests cover:

- Homepage loading and hero section
- Search navigation
- Tool detail pages with JSON-LD
- Category pages
- Submit form validation
- Theme toggle
- Accessibility (skip-to-content)

### Linting & Type Checking

```bash
npm run lint          # ESLint
npm run type-check    # TypeScript compiler check
```

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy

CI/CD is pre-configured:

- **PRs** → preview deployment + lint/test/build checks
- **main branch** → production deployment

### Manual Deploy

```bash
npm run build
npm start
```

---

## Production Launch Checklist

### Before Launch

- [ ] Replace all `.env.local` placeholder values with production credentials
- [ ] Set up Meilisearch Cloud instance
- [ ] Upload real tool logos/screenshots to Cloudinary
- [ ] Deploy Firestore security rules and indexes
- [ ] Seed production Meilisearch instance
- [ ] Verify all API routes return correct responses
- [ ] Test chatbot with real HF/OpenAI keys
- [ ] Configure custom domain (`bestapp.live`) in Vercel
- [ ] Set up SSL (automatic with Vercel)

### After Launch

- [ ] Verify Google Search Console
- [ ] Submit sitemap.xml to search engines
- [ ] Monitor error tracking (Sentry or Vercel Analytics)
- [ ] Set up uptime monitoring
- [ ] Review Firestore usage and set billing alerts
- [ ] Test all auth flows in production
- [ ] Load test API endpoints
- [ ] Set up real `icon-192.png`, `icon-512.png`, `favicon.ico`, `og-default.png`

---

## Project Structure

```
bestapp/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint, test, build, E2E
│       └── deploy.yml                # Vercel preview + production
├── .husky/
│   └── pre-commit                    # lint-staged hook
├── e2e/
│   └── app.spec.ts                   # Playwright E2E tests
├── public/
│   ├── manifest.json                 # PWA manifest
│   └── placeholders/
│       ├── logo.svg                  # Placeholder tool logo
│       └── screenshot.svg            # Placeholder screenshot
├── scripts/
│   ├── seed-meilisearch.ts           # Seed Meilisearch index
│   ├── seed-firestore.ts             # Seed Firestore collections
│   └── export-meilisearch.ts         # Export Meilisearch data
├── src/
│   ├── __tests__/
│   │   ├── cloudinary.test.ts
│   │   ├── security.test.ts
│   │   ├── seed-data.test.ts
│   │   └── seo.test.ts
│   ├── app/
│   │   ├── globals.css               # CSS variables, theme tokens
│   │   ├── layout.tsx                # Root layout (providers, header, footer, chatbot)
│   │   ├── page.tsx                  # Homepage
│   │   ├── admin/page.tsx            # Admin dashboard
│   │   ├── alternatives/[slug]/page.tsx
│   │   ├── categories/page.tsx
│   │   ├── category/[slug]/page.tsx
│   │   ├── compare/page.tsx
│   │   ├── search/page.tsx
│   │   ├── submit/page.tsx
│   │   ├── tool/[slug]/page.tsx
│   │   └── api/
│   │       ├── chat/route.ts
│   │       ├── review/route.ts
│   │       ├── robots/route.ts
│   │       ├── sitemap/route.ts
│   │       ├── submit-tool/route.ts
│   │       └── tools/
│   │           ├── route.ts
│   │           └── [slug]/route.ts
│   ├── components/
│   │   ├── chat/ChatWidget.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── providers/
│   │   │   ├── AuthProvider.tsx
│   │   │   └── ThemeProvider.tsx
│   │   ├── tools/
│   │   │   ├── ToolCard.tsx
│   │   │   └── CategoryCard.tsx
│   │   └── ui/
│   │       ├── SearchBar.tsx
│   │       ├── StarRating.tsx
│   │       └── ThemeToggle.tsx
│   ├── lib/
│   │   ├── cloudinary-loader.ts
│   │   ├── constants.ts
│   │   ├── firebase-admin.ts
│   │   ├── firebase.ts
│   │   ├── meilisearch.ts
│   │   ├── security.ts
│   │   ├── seed-data.ts
│   │   └── seo.ts
│   └── types/
│       └── index.ts
├── .env.example
├── .env.local
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── docker-compose.yml
├── firestore.indexes.json
├── firestore.rules
├── jest.config.js
├── jest.setup.ts
├── next.config.js
├── package.json
├── playwright.config.ts
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## Design System

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for the complete design token reference.

### Quick Reference

| Token          | Light                 | Dark          |
| -------------- | --------------------- | ------------- |
| `--brand`      | `99 102 241` (indigo) | `129 140 248` |
| `--surface`    | `255 255 255`         | `15 23 42`    |
| `--on-surface` | `15 23 42`            | `241 245 249` |
| `--border`     | `226 232 240`         | `51 65 85`    |
| Font           | Inter (system stack)  | Same          |
| Border radius  | 0.75rem (cards)       | Same          |

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit: `git commit -m "feat: add my feature"`
4. Push: `git push origin feat/my-feature`
5. Open a Pull Request

Please follow the existing code style. The Husky pre-commit hook will run lint-staged automatically.

---

## License

MIT © bestapp.live
