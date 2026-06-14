# Lakshay 2047 — Design Spec
**Date:** 2026-06-14  
**Status:** Approved  
**Owner:** Aman · Ethnotech Academy

---

## 1. Project Summary

Full-stack web app for Parul University's Centre of Future Skills. Students browse 14 labs, book slots via Google SSO, form teams. Admins manage labs, bookings, events via superadmin panel.

**Live URL:** https://lakshay-2047-web-application.vercel.app  
**Repo:** github.com/Aman-0402/lakshay-2047

---

## 2. Visual Identity

### Theme: Dark Monochrome
- **Background:** `#111114`
- **Surface:** `#0D0D10` (card interiors), `#1A1A1D` (elevated)
- **Border:** `#1F1F22` default, `#2A2A2D` hover
- **Text primary:** `#FFFFFF`
- **Text muted:** `#888888`
- **Text subtle:** `#444444`
- **Accent:** `#6C63FF` (violet) — used sparingly: active nav, primary CTA, focus rings only

### Typography
- **Heading:** Space Grotesk, 700–800 weight, tight letter-spacing (`-0.03em`)
- **Body:** Inter, 400–500 weight
- **Mono:** JetBrains Mono (labels, tags, metadata)

### Spacing
Base unit 4px. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px.

### Border Radius
- `4px` — buttons, badges
- `8px` — cards
- `12px` — modals, panels

### Cards
Simple bordered cards: `border: 1px solid #1F1F22`, `background: #0D0D10`. No glassmorphism. Subtle `box-shadow: 0 2px 8px rgba(0,0,0,0.4)` on hover.

### Motion
- Framer Motion text reveal on hero (word-by-word, staggered)
- Scroll-triggered section fade-in (`opacity: 0 → 1`, `y: 20 → 0`)
- Card hover: `translateY(-2px)` + border brightens
- No heavy 3D animations in Phase 1

---

## 3. Hero: Typography-First

```
[Navbar: Logo + links + Sign in CTA]

                CENTRE OF
                FUTURE SKILLS

      Parul University · 14 Labs · 8 Disciplines

         [Explore Labs]    [Book a Slot]

      ─────────────────────────────────────
      14 Labs        5000+ Students        8 Disciplines
```

- Animated: words reveal sequentially with Framer Motion
- Stats row: count-up animation on scroll-into-view
- CTA buttons: primary = white bg + black text; secondary = ghost (border only)
- No 3D canvas on hero. Minimal background: very subtle noise texture via CSS.

---

## 4. Navbar

- Sticky top, `backdrop-filter: blur(12px)`, bg `rgba(17,17,20,0.8)` on scroll
- Left: Logo mark + "LAKSHAY 2047" wordmark
- Right: Labs · About · Events · [Sign in →]
- Mobile: hamburger → slide-down sheet
- Active link: violet underline `#6C63FF`

---

## 5. Lab Cards (Directory)

CSS 3D flip card pattern (Framer Motion `rotateY`), NOT R3F, for performance:
- **Front:** Lab name, discipline badge (monochrome tag), cover image (grayscale)
- **Back:** Equipment list, capacity, "Book Now" CTA
- Flip on hover (desktop) / tap (mobile)
- Category color: single accent dot only (no full color blocks)

---

## 6. Architecture

### Stack
| Layer | Choice |
|---|---|
| Framework | Next.js 15 App Router |
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion v11 |
| Database | MySQL 8 via Prisma 6 |
| Auth | NextAuth v5 + Google OAuth |
| Caching | Upstash Redis |
| Rate limiting | @upstash/ratelimit |
| Deploy | Vercel |

### Rendering Strategy
- Server Components by default
- `'use client'` only for interactivity/hooks
- No 3D in Phase 1 (added Phase 2 if needed)
- All Prisma queries in Server Components or Route Handlers

### Route Protection
Middleware (`middleware.ts`) guards `/dashboard`, `/book`, `/teams` (auth required) and `/superadmin` (SUPER_ADMIN role).

### Auth Restriction
`signIn` callback in `lib/auth.ts` rejects non-`@paruluniversity.ac.in` emails.

---

## 7. Database Schema (Prisma/MySQL)

Core models: `User`, `Account`, `Session`, `Lab`, `Booking`, `Team`, `TeamMember`, `Event`, `Insight`, `Partner`.

Full schema in `prisma/schema.prisma` (matches LAKSHAY_2047_DOCS.md §5).

---

## 8. Phase Plan

### Phase 1 — Scaffold + Design System
- Next.js 15 project init with TypeScript, Tailwind v4, Prisma
- `globals.css` with full design tokens (colors, typography, spacing)
- `lib/utils.ts` (`cn()`), `lib/prisma.ts`, `lib/auth.ts`, `lib/redis.ts`
- `AGENT.md` and `README.md`
- Root `layout.tsx` with font loading
- `.env.example`

**Exit criteria:** `npm run dev` boots, `/` renders blank dark page with correct font.

### Phase 2 — Homepage
- `Navbar.tsx` — sticky, scroll-aware, mobile hamburger
- `HeroSection.tsx` — typography hero with Framer Motion reveals
- `LabsPreview.tsx` — horizontal scroll strip of 4 lab teasers
- `Footer.tsx` — links, socials, copyright
- `PageWrapper.tsx` — page transition wrapper

**Exit criteria:** Homepage renders with hero, nav, labs strip, footer. Animations work.

### Phase 3 — Labs Directory
- `GET /api/labs` with Redis cache (5min TTL)
- `GET /api/labs/[slug]` with availability slots
- `/labs` page — Server Component, grid + filter tabs
- `/labs/[slug]` page — detail, equipment list, book CTA
- `LabCard.tsx` — CSS 3D flip card (Framer Motion)
- `LabFilter.tsx` — category filter tabs
- Seed all 14 labs via Prisma seed script

**Exit criteria:** `/labs` shows all 14 labs, filter by category works, detail page loads.

### Phase 4 — Auth + Booking + Dashboard
- Google OAuth setup, `@paruluniversity.ac.in` restriction
- `/login` page
- `POST /api/bookings` with Upstash rate limit (5/hr per user)
- `GET /api/bookings` — user's bookings
- `PATCH /api/bookings/[id]` — cancel/update
- `/book/[labSlug]` — `BookingSlotPicker.tsx` (date + time slots)
- `/dashboard` — active bookings, history, profile card

**Exit criteria:** Student can sign in, book a slot, see it in dashboard, cancel it.

### Phase 5 — Admin + Teams + SEO
- `/superadmin` dashboard — stats cards
- `/superadmin/labs` — CRUD table
- `/superadmin/bookings` — filterable table with status control
- `/superadmin/users` — role management
- `/superadmin/events` — CRUD events
- `/teams` — team grid + `CreateTeamForm`
- `/teams/[id]` — team detail + join
- `app/sitemap.ts` + `app/robots.ts`
- `/api/og` — dynamic OG images
- `loading.tsx` skeletons for all major routes
- Lighthouse audit: 90+ performance, 100 SEO

**Exit criteria:** Full admin panel works, teams feature works, Lighthouse 90+.

---

## 9. Key Rules for Implementation

1. Never use `pages/` directory — App Router only
2. Prisma singleton from `@/lib/prisma`
3. Use `cn()` from `@/lib/utils` for class merging
4. Zod validation on all API routes
5. Rate limit all mutation endpoints
6. `auth()` from `@/lib/auth` — never raw session cookies
7. `@paruluniversity.ac.in` restriction enforced in `signIn` callback
8. Tailwind utility classes only — no inline `style={{}}` props
9. `generateMetadata()` on every page
10. All DB queries in Server Components or Route Handlers
