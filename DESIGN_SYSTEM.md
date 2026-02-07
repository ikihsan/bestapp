# Design System — bestapp.live

A comprehensive reference for all design tokens, spacing, typography, colors, and component patterns used across the application.

---

## Color System

All colors use CSS custom properties with RGB values for alpha compositing support via `rgb(var(--token) / alpha)`.

### Brand Palette

| Token            | Light Mode    | Dark Mode     | Usage                  |
| ---------------- | ------------- | ------------- | ---------------------- |
| `--brand`        | `99 102 241`  | `129 140 248` | Primary actions, links |
| `--brand-hover`  | `79 70 229`   | `165 180 252` | Hover states           |
| `--brand-subtle` | `238 242 255` | `30 27 75`    | Backgrounds, badges    |
| `--accent`       | `139 92 246`  | `167 139 250` | Secondary highlights   |

### Surface Colors

| Token                | Light Mode    | Dark Mode     | Usage             |
| -------------------- | ------------- | ------------- | ----------------- |
| `--surface`          | `255 255 255` | `15 23 42`    | Page background   |
| `--surface-elevated` | `248 250 252` | `30 41 59`    | Cards, panels     |
| `--on-surface`       | `15 23 42`    | `241 245 249` | Primary text      |
| `--on-surface-muted` | `100 116 139` | `148 163 184` | Secondary text    |
| `--border`           | `226 232 240` | `51 65 85`    | Borders, dividers |

### Semantic Colors

| Token       | Value                     | Usage                |
| ----------- | ------------------------- | -------------------- |
| `--success` | `34 197 94`               | Status, badges       |
| `--warning` | `251 191 36`              | Cautions, warnings   |
| `--error`   | `239 68 68`               | Errors, destructive  |
| `--info`    | `59 130 246`              | Info, neutral status |
| `--star`    | `250 204 21` (yellow-400) | Star ratings         |

---

## Typography

### Font Stack

```css
font-family:
  'Inter',
  ui-sans-serif,
  system-ui,
  -apple-system,
  sans-serif;
```

### Type Scale

| Class   | Size     | Line Height | Weight | Usage              |
| ------- | -------- | ----------- | ------ | ------------------ |
| `hero`  | 3.5rem   | 1           | 800    | Homepage hero H1   |
| `h1`    | 2.25rem  | 2.5rem      | 700    | Page titles        |
| `h2`    | 1.875rem | 2.25rem     | 700    | Section headings   |
| `h3`    | 1.5rem   | 2rem        | 600    | Sub-section heads  |
| `body`  | 1rem     | 1.5rem      | 400    | Body text          |
| `small` | 0.875rem | 1.25rem     | 400    | Captions, metadata |
| `xs`    | 0.75rem  | 1rem        | 400    | Badges, fine print |

### Text Utilities

- `.text-gradient` — Gradient text using brand → accent via `background-clip: text`
- `.text-balance` — `text-wrap: balance` for headings

---

## Spacing

Based on a 4px grid. Tailwind's default scale applies plus custom additions:

| Token | Value  | Usage                  |
| ----- | ------ | ---------------------- |
| `18`  | 4.5rem | Large section spacing  |
| `88`  | 22rem  | Max sidebar width      |
| `128` | 32rem  | Medium container width |

Standard spacing: `p-4` (1rem), `p-6` (1.5rem), `p-8` (2rem), `gap-6`, `gap-8`.

---

## Shadows

| Class          | Description                          | Usage           |
| -------------- | ------------------------------------ | --------------- |
| `shadow-soft`  | `0 2px 15px -3px rgba(0,0,0,0.08)`   | Cards at rest   |
| `shadow-float` | `0 20px 60px -15px rgba(0,0,0,0.15)` | Elevated modals |

---

## Border Radius

| Element | Radius    |
| ------- | --------- |
| Cards   | `0.75rem` |
| Buttons | `0.5rem`  |
| Badges  | `9999px`  |
| Inputs  | `0.5rem`  |
| Avatars | `9999px`  |

---

## Animations

All animations respect `prefers-reduced-motion: reduce`.

| Name          | Duration | Description                    |
| ------------- | -------- | ------------------------------ |
| `fadeIn`      | 0.5s     | Opacity 0 → 1                  |
| `slideUp`     | 0.5s     | Translate-y 10px → 0 + fade in |
| `pulseSubtle` | 2s       | Scale 1 → 1.05 → 1 (loop)      |

Framer Motion is used for:

- Theme toggle rotation
- Mobile menu `AnimatePresence` slide
- Chat widget open/close
- Page transitions on tool cards

---

## Component Patterns

### ToolCard

```
┌─────────────────────────┐
│  [Image]     ★ 4.8      │
│  Tool Name              │
│  One-line tagline       │
│  [Tag] [Tag] [Tag]      │
│  Freemium  →            │
└─────────────────────────┘
```

- Border: `1px solid var(--border)`
- Radius: `0.75rem`
- Hover: `shadow-soft` → `shadow-float`, `translate-y: -2px`
- Image: 48×48, rounded-lg

### CategoryCard

```
┌─────────────────────────┐
│  [Icon]                  │
│  Category Name           │
│  Description text...     │
│  12 tools →              │
└─────────────────────────┘
```

### SearchBar

- **Default**: Standard height, rounded-lg, border
- **Hero variant**: Larger padding, shadow-soft, max-w-2xl

### StarRating

- Uses Lucide `Star` icon
- Filled: `text-yellow-400 fill-yellow-400`
- Empty: `text-gray-300`
- Interactive mode: hover fills stars, click selects

---

## Dark Mode

Implemented via CSS class (`.dark` on `<html>`).

### FOUC Prevention

An inline `<script>` in the root layout checks `localStorage.theme` and `prefers-color-scheme` **before** the first paint:

```js
(function () {
  var t = localStorage.getItem('bestapp-theme');
  if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
})();
```

### Theme Toggle Behavior

1. User clicks toggle → class added/removed on `<html>`
2. Preference saved to `localStorage('bestapp-theme')`
3. CSS variables swap instantly via `:root` / `.dark` selectors

---

## Responsive Breakpoints

| Breakpoint | Min Width | Usage            |
| ---------- | --------- | ---------------- |
| `sm`       | 640px     | Mobile landscape |
| `md`       | 768px     | Tablets          |
| `lg`       | 1024px    | Desktop          |
| `xl`       | 1280px    | Wide desktop     |

### Layout Grid

- Homepage categories: `grid-cols-2 md:grid-cols-3 lg:grid-cols-5`
- Tool grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Tool detail: `lg:grid-cols-3` (2/3 content + 1/3 sidebar)
- Compare: `grid-cols-1 lg:grid-cols-2`

---

## Accessibility

- **WCAG 2.1 AA** target
- Skip-to-content link (visible on focus)
- Focus ring: `ring-2 ring-brand/50 ring-offset-2`
- Color contrast ≥ 4.5:1 for body text
- All images have `alt` text
- Interactive elements have `aria-label` where needed
- `prefers-reduced-motion: reduce` disables all custom animations

---

## Icon System

Using **Lucide React** for all icons. Common icons:

| Icon            | Usage                |
| --------------- | -------------------- |
| `Search`        | Search bars          |
| `Star`          | Ratings              |
| `Sun` / `Moon`  | Theme toggle         |
| `Menu` / `X`    | Mobile menu          |
| `ExternalLink`  | Visit tool links     |
| `ChevronRight`  | Navigation arrows    |
| `Send`          | Chat send button     |
| `MessageCircle` | Chat bubble          |
| `Check`         | Checkmarks, features |
| `AlertCircle`   | Warnings, errors     |
