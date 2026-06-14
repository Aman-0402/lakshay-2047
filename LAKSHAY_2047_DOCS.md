# LAKSHAY 2047 — Project Documentation
> Centre of Future Skills · Parul University · Vadodara, Gujarat
> Version: 1.0.0 | Last Updated: June 2026 | Status: Active Development

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Environment Variables](#4-environment-variables)
5. [Database Schema](#5-database-schema)
6. [Route & Page Map](#6-route--page-map)
7. [Component Architecture](#7-component-architecture)
8. [3D Strategy](#8-3d-strategy)
9. [API Routes](#9-api-routes)
10. [Auth Strategy](#10-auth-strategy)
11. [Phase Plan](#11-phase-plan)
12. [Design System](#12-design-system)
13. [Performance & SEO](#13-performance--seo)
14. [Deployment](#14-deployment)
15. [Naming Conventions](#15-naming-conventions)
16. [AI Coding Agent Context](#16-ai-coding-agent-context)

---

## 1. Project Overview

| Field | Value |
|---|---|
| **Project Name** | Lakshay 2047 |
| **Tagline** | Centre of Future Skills |
| **Institution** | Parul University, Vadodara, Gujarat |
| **Live URL** | https://lakshya-2047-web-application.vercel.app |
| **Repo** | github.com/Aman-0402/lakshay-2047 |
| **Owner** | Aman (Full-Stack Developer, Ethnotech Academy) |
| **Target Users** | Parul University students (@paruluniversity.ac.in), faculty, lab admins |
| **Core Purpose** | Browse, book, and manage 14 cutting-edge lab facilities across disciplines |

### What This App Does

Lakshay 2047 is a full-stack web application for Parul University's Centre of Future Skills — a campus hub with 14 world-class labs across AI/ML, Robotics, Design, Extended Reality, Media, Hardware, and Cybersecurity. The platform allows:

- Students to discover labs by discipline and availability
- Students to book lab slots with their institutional Google account
- Students to form and find project teams
- Admins to manage labs, bookings, events, and users via a superadmin panel
- The public to explore the centre's capabilities without logging in

---

## 2. Tech Stack

### Core Framework

| Package | Version | Purpose |
|---|---|---|
| `next` | `^15.x` | App Router, Server Components, Turbopack |
| `react` | `^19.x` | UI library |
| `react-dom` | `^19.x` | DOM rendering |
| `typescript` | `^5.x` | Type safety across entire codebase |

### Styling

| Package | Version | Purpose |
|---|---|---|
| `tailwindcss` | `^4.x` | Utility-first CSS |
| `@tailwindcss/typography` | latest | Prose styling for insights/blog pages |
| `clsx` | latest | Conditional class merging |
| `tailwind-merge` | latest | Tailwind class conflict resolution |

### Animation

| Package | Version | Purpose |
|---|---|---|
| `framer-motion` | `^11.x` | Page transitions, UI micro-animations, card hovers |
| `gsap` | `^3.x` | Scroll-linked 3D choreography, ScrollTrigger |
| `@gsap/react` | latest | GSAP React hooks |

### 3D / WebGL

| Package | Version | Purpose |
|---|---|---|
| `three` | `^0.170.x` | WebGL 3D engine |
| `@react-three/fiber` | `^8.x` | Three.js as React components (R3F) |
| `@react-three/drei` | `^9.x` | R3F helpers: orbit controls, environment, loaders, floating |
| `@react-three/postprocessing` | `^2.x` | Bloom, depth of field, film grain effects |

### Database & ORM

| Package | Version | Purpose |
|---|---|---|
| `prisma` | `^6.x` | ORM + schema management |
| `@prisma/client` | `^6.x` | Auto-generated type-safe DB client |
| MySQL | `8.x` | Primary database (hosted on cPanel or PlanetScale) |

### Auth

| Package | Version | Purpose |
|---|---|---|
| `next-auth` | `^5.x` (Auth.js v5) | Google OAuth SSO + session management |
| `@auth/prisma-adapter` | latest | Persist sessions/users to MySQL via Prisma |

### Caching & Rate Limiting

| Package | Version | Purpose |
|---|---|---|
| `@upstash/redis` | latest | Edge-compatible Redis client |
| `@upstash/ratelimit` | latest | Rate limiting on booking + auth APIs |

### UI Components

| Package | Version | Purpose |
|---|---|---|
| `lucide-react` | latest | Icon library (consistent outline icons) |
| `@radix-ui/react-dialog` | latest | Accessible modal primitives |
| `@radix-ui/react-select` | latest | Accessible select/dropdown primitives |
| `@radix-ui/react-tabs` | latest | Accessible tab primitives |
| `date-fns` | latest | Date formatting and slot calculations |
| `react-hook-form` | latest | Form state management |
| `zod` | latest | Schema validation (forms + API) |

### SEO & Meta

| Package | Version | Purpose |
|---|---|---|
| `@vercel/og` | latest | Dynamic Open Graph image generation per lab page |

### Dev Tools

| Package | Version | Purpose |
|---|---|---|
| `eslint` | latest | Linting |
| `prettier` | latest | Code formatting |
| `husky` | latest | Pre-commit hooks |
| `lint-staged` | latest | Run linting only on staged files |

---

## 3. Folder Structure

```
lakshay-2047/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Route group — no auth required
│   │   ├── page.tsx              # / — 3D Hero homepage
│   │   ├── labs/
│   │   │   ├── page.tsx          # /labs — Labs directory
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # /labs/[slug] — Lab detail + booking CTA
│   │   ├── about/
│   │   │   └── page.tsx          # /about — Centre info, Parul University
│   │   ├── insights/
│   │   │   ├── page.tsx          # /insights — Articles listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # /insights/[slug] — Article detail
│   │   ├── partners/
│   │   │   └── page.tsx          # /partners — Partners grid
│   │   └── events/
│   │       └── page.tsx          # /events — Workshops and sessions
│   │
│   ├── (auth)/                   # Route group — auth required
│   │   ├── dashboard/
│   │   │   └── page.tsx          # /dashboard — Student's bookings + profile
│   │   ├── teams/
│   │   │   ├── page.tsx          # /teams — Team finder
│   │   │   └── [id]/
│   │   │       └── page.tsx      # /teams/[id] — Team detail
│   │   └── book/
│   │       └── [labSlug]/
│   │           └── page.tsx      # /book/[labSlug] — Slot booking flow
│   │
│   ├── superadmin/               # Admin panel (role-protected)
│   │   ├── page.tsx              # /superadmin — Dashboard overview
│   │   ├── labs/
│   │   │   └── page.tsx          # Manage labs
│   │   ├── bookings/
│   │   │   └── page.tsx          # Manage bookings
│   │   ├── users/
│   │   │   └── page.tsx          # Manage users
│   │   └── events/
│   │       └── page.tsx          # Manage events
│   │
│   ├── login/
│   │   └── page.tsx              # /login — Google SSO sign-in
│   │
│   ├── api/                      # API Routes (Route Handlers)
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts      # NextAuth handler
│   │   ├── labs/
│   │   │   ├── route.ts          # GET all labs
│   │   │   └── [slug]/
│   │   │       └── route.ts      # GET single lab
│   │   ├── bookings/
│   │   │   ├── route.ts          # GET user bookings / POST new booking
│   │   │   └── [id]/
│   │   │       └── route.ts      # PATCH / DELETE booking
│   │   ├── teams/
│   │   │   └── route.ts          # GET all teams / POST create team
│   │   ├── events/
│   │   │   └── route.ts          # GET events
│   │   └── og/
│   │       └── route.tsx         # Dynamic OG image generation
│   │
│   ├── layout.tsx                # Root layout (fonts, providers)
│   ├── globals.css               # Tailwind base + CSS custom properties
│   └── not-found.tsx             # 404 page
│
├── components/                   # Shared components
│   ├── 3d/                       # All Three.js / R3F components
│   │   ├── HeroCanvas.tsx        # Main homepage 3D scene
│   │   ├── ParticleField.tsx     # Floating particle background
│   │   ├── LabCard3D.tsx         # 3D flip card for lab listings
│   │   ├── FloatingOrb.tsx       # Ambient floating orbs
│   │   └── SceneWrapper.tsx      # Suspense + error boundary for R3F
│   │
│   ├── layout/                   # Layout components
│   │   ├── Navbar.tsx            # Top navigation
│   │   ├── Footer.tsx            # Site footer
│   │   └── PageWrapper.tsx       # Page transition wrapper (Framer Motion)
│   │
│   ├── ui/                       # Primitive UI components
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Avatar.tsx
│   │   └── Input.tsx
│   │
│   ├── labs/                     # Lab-specific components
│   │   ├── LabGrid.tsx           # Grid of lab cards
│   │   ├── LabCard.tsx           # Single lab card (2D fallback)
│   │   ├── LabFilter.tsx         # Discipline filter tabs
│   │   ├── LabDetail.tsx         # Lab detail content block
│   │   └── BookingSlotPicker.tsx # Calendar + time slot UI
│   │
│   ├── dashboard/                # Student dashboard components
│   │   ├── BookingCard.tsx       # Single booking display
│   │   ├── BookingList.tsx       # List of user's bookings
│   │   └── ProfileCard.tsx       # Student profile summary
│   │
│   ├── teams/                    # Team components
│   │   ├── TeamCard.tsx
│   │   ├── TeamGrid.tsx
│   │   └── CreateTeamForm.tsx
│   │
│   └── home/                     # Homepage-specific sections
│       ├── HeroSection.tsx       # 3D hero wrapper + CTA overlay
│       ├── LabsPreview.tsx       # Animated labs preview grid
│       ├── InsightsSection.tsx   # Latest articles strip
│       ├── PartnersSection.tsx   # Partner logos marquee
│       └── HowItWorks.tsx        # Step-by-step explainer
│
├── lib/                          # Utility and config
│   ├── prisma.ts                 # Prisma client singleton
│   ├── auth.ts                   # NextAuth config
│   ├── redis.ts                  # Upstash Redis client
│   ├── ratelimit.ts              # Rate limiter instances
│   ├── utils.ts                  # cn(), formatDate(), slugify()
│   └── constants.ts              # LAB_CATEGORIES, ROLES, etc.
│
├── hooks/                        # Custom React hooks
│   ├── useSession.ts             # Wrapper around NextAuth useSession
│   ├── useScrollProgress.ts      # GSAP scroll progress hook
│   └── useMediaQuery.ts          # Responsive breakpoint hook
│
├── types/                        # Global TypeScript types
│   ├── index.ts                  # Re-exports
│   ├── lab.ts                    # Lab, LabCategory types
│   ├── booking.ts                # Booking, Slot types
│   ├── user.ts                   # User, Role types
│   └── team.ts                   # Team, Member types
│
├── prisma/
│   └── schema.prisma             # Database schema
│
├── public/
│   ├── fonts/                    # Self-hosted fonts
│   ├── images/                   # Static images
│   ├── models/                   # .glb / .gltf 3D model assets
│   └── icons/                    # SVG icons
│
├── .env.local                    # Local environment variables (gitignored)
├── .env.example                  # Template for env vars (committed)
├── next.config.ts                # Next.js config
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
├── prisma/schema.prisma          # Prisma schema
└── package.json
```

---

## 4. Environment Variables

Copy `.env.example` to `.env.local` and fill in all values before running locally.

```env
# ─── App ────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Lakshay 2047"

# ─── Database ────────────────────────────────────────────────────────
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/lakshay2047"

# ─── NextAuth ────────────────────────────────────────────────────────
AUTH_SECRET="generate-with: openssl rand -base64 32"
AUTH_GOOGLE_ID="your-google-oauth-client-id"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"

# ─── Upstash Redis ───────────────────────────────────────────────────
UPSTASH_REDIS_REST_URL="https://your-upstash-endpoint.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"

# ─── Vercel OG ───────────────────────────────────────────────────────
# No extra vars needed — uses @vercel/og at /api/og

# ─── Optional: Analytics ─────────────────────────────────────────────
NEXT_PUBLIC_POSTHOG_KEY=""
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
```

> **Auth Restriction:** Google OAuth must be configured to only accept `@paruluniversity.ac.in` accounts. Enforce this in `lib/auth.ts` via the `signIn` callback.

---

## 5. Database Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ─── Enums ───────────────────────────────────────────────────────────

enum Role {
  STUDENT
  FACULTY
  LAB_ADMIN
  SUPER_ADMIN
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

enum LabCategory {
  AI_ML
  ROBOTICS
  DESIGN
  HARDWARE
  MEDIA
  EXTENDED_REALITY
  CYBERSECURITY
  BIOTECH
}

// ─── Models ──────────────────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  role          Role      @default(STUDENT)
  rollNumber    String?
  department    String?
  year          Int?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts   Account[]
  sessions   Session[]
  bookings   Booking[]
  teams      TeamMember[]

  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model Lab {
  id           String      @id @default(cuid())
  name         String
  slug         String      @unique
  description  String      @db.Text
  category     LabCategory
  capacity     Int
  location     String
  equipment    Json        // Array of equipment strings
  image        String?
  model3dUrl   String?     // Path to .glb file in /public/models/
  isActive     Boolean     @default(true)
  openTime     String      // e.g. "09:00"
  closeTime    String      // e.g. "18:00"
  slotDuration Int         @default(60) // in minutes
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  bookings Booking[]

  @@map("labs")
}

model Booking {
  id        String        @id @default(cuid())
  userId    String
  labId     String
  date      DateTime
  startTime String        // e.g. "10:00"
  endTime   String        // e.g. "11:00"
  purpose   String        @db.Text
  status    BookingStatus @default(PENDING)
  notes     String?       @db.Text
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  user User @relation(fields: [userId], references: [id])
  lab  Lab  @relation(fields: [labId], references: [id])

  @@map("bookings")
}

model Team {
  id          String   @id @default(cuid())
  name        String
  description String   @db.Text
  skills      Json     // Array of skill tag strings
  projectIdea String?  @db.Text
  isOpen      Boolean  @default(true)
  maxMembers  Int      @default(5)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  members TeamMember[]

  @@map("teams")
}

model TeamMember {
  id       String   @id @default(cuid())
  teamId   String
  userId   String
  isLeader Boolean  @default(false)
  joinedAt DateTime @default(now())

  team Team @relation(fields: [teamId], references: [id])
  user User @relation(fields: [userId], references: [id])

  @@unique([teamId, userId])
  @@map("team_members")
}

model Event {
  id          String   @id @default(cuid())
  title       String
  description String   @db.Text
  date        DateTime
  location    String
  image       String?
  isPublic    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("events")
}

model Insight {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String   @db.LongText
  excerpt     String   @db.Text
  coverImage  String?
  publishedAt DateTime?
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("insights")
}

model Partner {
  id       String  @id @default(cuid())
  name     String
  logo     String
  website  String?
  featured Boolean @default(false)

  @@map("partners")
}
```

---

## 6. Route & Page Map

| Route | Auth | Component | Description |
|---|---|---|---|
| `/` | No | `HeroSection` + sections | 3D hero, labs preview, insights, partners |
| `/labs` | No | `LabGrid` + `LabFilter` | All 14 labs with category filters |
| `/labs/[slug]` | No | `LabDetail` | Lab info, equipment, book CTA |
| `/about` | No | Static | Centre overview, Parul University info |
| `/insights` | No | `InsightsList` | Articles and research posts |
| `/insights/[slug]` | No | `InsightDetail` | Full article with rich text |
| `/partners` | No | `PartnersGrid` | Partner logos and info |
| `/events` | No | `EventsList` | Upcoming workshops and sessions |
| `/login` | No | `LoginPage` | Google SSO sign in |
| `/dashboard` | Student | `BookingList` + `ProfileCard` | User's bookings + profile |
| `/book/[labSlug]` | Student | `BookingSlotPicker` | Slot selection + booking form |
| `/teams` | Student | `TeamGrid` + `CreateTeamForm` | Browse and create teams |
| `/teams/[id]` | Student | `TeamDetail` | Team info + join request |
| `/superadmin` | SuperAdmin | `AdminDashboard` | Stats overview |
| `/superadmin/labs` | SuperAdmin | `AdminLabsTable` | CRUD labs |
| `/superadmin/bookings` | SuperAdmin | `AdminBookingsTable` | View/manage all bookings |
| `/superadmin/users` | SuperAdmin | `AdminUsersTable` | View/manage users |
| `/superadmin/events` | SuperAdmin | `AdminEventsForm` | CRUD events |

---

## 7. Component Architecture

### Rendering Strategy

| Component Type | Strategy | Reason |
|---|---|---|
| Homepage hero | Client Component | Three.js requires browser APIs |
| Lab listing grid | Server Component | SEO, static data |
| Lab filter tabs | Client Component | Interactive state |
| Lab detail page | Server Component + RSC | Static with dynamic booking CTA |
| Booking slot picker | Client Component | Calendar state, real-time availability |
| Dashboard | Server Component | Auth-gated, data fetch on server |
| Admin tables | Client Component | Sorting, filtering, pagination |
| 3D canvas components | Client Component | WebGL, always client-side |

### Key Pattern: 3D Lazy Loading

All Three.js components must be dynamically imported with `ssr: false`:

```tsx
// components/home/HeroSection.tsx
import dynamic from 'next/dynamic'

const HeroCanvas = dynamic(
  () => import('@/components/3d/HeroCanvas'),
  {
    ssr: false,
    loading: () => <HeroSkeleton />
  }
)
```

### Key Pattern: SceneWrapper

All R3F canvas components wrap with error boundary + Suspense:

```tsx
// components/3d/SceneWrapper.tsx
<ErrorBoundary fallback={<FallbackUI />}>
  <Suspense fallback={<CanvasLoader />}>
    <Canvas>
      {children}
    </Canvas>
  </Suspense>
</ErrorBoundary>
```

---

## 8. 3D Strategy

### Tech Decisions

| Choice | Why |
|---|---|
| **React Three Fiber** over raw Three.js | Native React component model, hooks support, works perfectly with Next.js |
| **@react-three/drei** | Pre-built helpers save 80% of setup (lights, controls, environment, loaders) |
| **GSAP ScrollTrigger** for scroll-3D | Framer Motion doesn't sync well with canvas animation timelines |
| **Framer Motion** for UI animations | Page transitions, card hovers, modal entrances — all outside canvas |

### 3D Scene Plan: Homepage Hero

```
Scene: HeroCanvas
├── Environment (Drei) — HDRI environment map for reflections
├── ParticleField — 2000 floating points, drift slowly
├── FloatingOrbs (x3) — Large glowing spheres, different speeds
├── CenterModel — Abstract geometric shape or lab icon
│   └── Rotate slowly on Y axis
│   └── Responds to mouse position (parallax)
└── PostProcessing
    ├── Bloom — glow on bright elements
    └── DepthOfField — subtle bokeh on distant particles
```

### 3D Lab Cards (Labs Directory)

Each lab card in `/labs` uses a CSS 3D flip card pattern (not R3F) for performance:
- **Front face:** Lab name, category badge, cover image
- **Back face:** Equipment list, capacity, "Book Now" CTA
- Flip triggered by hover (desktop) or tap (mobile)
- Use Framer Motion `rotateY` for smooth flip animation

Reserve full R3F for the homepage hero only. Lab cards use CSS 3D.

### Performance Rules for 3D

- Always use `dynamic(() => import(...), { ssr: false })` for canvas components
- Implement `useDetectGPU` from drei to reduce quality on low-end devices
- Add `<Canvas dpr={[1, 2]}>` to cap pixel ratio at 2x
- Dispose geometries and materials on component unmount
- Target 60fps on desktop, 30fps graceful on mobile

---

## 9. API Routes

All API routes live in `app/api/`. They use Next.js Route Handlers (not pages/api).

### GET /api/labs

Returns all active labs. Cached via Redis (TTL: 5 minutes).

```ts
// Response shape
{
  labs: Lab[]
}
```

### GET /api/labs/[slug]

Returns single lab with availability slots for the next 7 days.

```ts
// Response shape
{
  lab: Lab,
  availability: {
    date: string,
    slots: { startTime: string, endTime: string, available: boolean }[]
  }[]
}
```

### POST /api/bookings

Creates a booking. Requires auth. Rate limited to 5 bookings/hour per user.

```ts
// Request body
{
  labId: string,
  date: string,        // ISO date string
  startTime: string,   // "HH:MM"
  endTime: string,     // "HH:MM"
  purpose: string
}

// Response
{
  booking: Booking
}
```

### GET /api/bookings

Returns the authenticated user's bookings.

### PATCH /api/bookings/[id]

Cancel or update a booking. Only owner or admin can modify.

### GET /api/teams

Returns all open teams. Filterable by skill tags.

### POST /api/teams

Creates a new team. Requires auth. Creator is auto-assigned as leader.

### GET /api/og

Generates dynamic OG image for a lab or insight page.

```
/api/og?type=lab&slug=ai-ml-lab
/api/og?type=insight&slug=future-of-robotics
```

---

## 10. Auth Strategy

### Provider

- Google OAuth only — restricted to `@paruluniversity.ac.in` domain
- Using **NextAuth.js v5 (Auth.js)** with `@auth/prisma-adapter`

### Session Strategy

- Database sessions (stored in MySQL via Prisma adapter)
- Session includes `user.role` for client-side UI gating

### Role Hierarchy

```
SUPER_ADMIN > LAB_ADMIN > FACULTY > STUDENT
```

### Auth Config (`lib/auth.ts`)

```ts
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user }) {
      // Restrict to Parul University accounts only
      if (!user.email?.endsWith('@paruluniversity.ac.in')) {
        return false
      }
      return true
    },
    async session({ session, user }) {
      // Attach role to session
      session.user.role = user.role
      return session
    }
  }
})
```

### Route Protection

Use Next.js middleware for server-side route protection:

```ts
// middleware.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  const protectedPaths = ['/dashboard', '/book', '/teams']
  const adminPaths = ['/superadmin']

  if (adminPaths.some(p => pathname.startsWith(p))) {
    if (session?.user?.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  if (protectedPaths.some(p => pathname.startsWith(p))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
})

export const config = {
  matcher: ['/dashboard/:path*', '/book/:path*', '/teams/:path*', '/superadmin/:path*']
}
```

---

## 11. Phase Plan

### Phase 1 — 3D Hero + Visual Identity
**Goal:** Transform the homepage into a world-class 3D experience.

- [ ] Set up R3F + Drei + GSAP in Next.js 15
- [ ] Build `HeroCanvas` — particle field, floating orbs, center model
- [ ] Add GSAP ScrollTrigger — hero scales/fades on scroll
- [ ] Add `HeroSection.tsx` overlay — tagline, CTA buttons, animated text
- [ ] Implement Framer Motion page transitions
- [ ] Finalize design tokens — colors, typography, spacing
- [ ] Build `Navbar.tsx` with scroll-aware background
- [ ] Build `Footer.tsx`

**Key Files:** `components/3d/`, `components/home/HeroSection.tsx`, `app/globals.css`

---

### Phase 2 — Labs Directory Upgrade
**Goal:** Dynamic, data-driven labs directory with immersive card design.

- [ ] Seed all 14 labs into the database
- [ ] Build `GET /api/labs` with Redis caching
- [ ] Build `/labs` page as Server Component
- [ ] Build `LabCard.tsx` — 3D CSS flip card (Framer Motion)
- [ ] Build `LabFilter.tsx` — animated category tabs
- [ ] Build `/labs/[slug]` page — lab detail, equipment list, map location
- [ ] Add Vercel OG image for each lab page

**Key Files:** `app/(public)/labs/`, `components/labs/`, `prisma/schema.prisma`

---

### Phase 3 — Booking Flow + Student Dashboard
**Goal:** Full lab booking system with calendar slot picker.

- [ ] Build `BookingSlotPicker.tsx` — date picker + time slots grid
- [ ] Build `POST /api/bookings` with Upstash rate limiting
- [ ] Build `GET /api/bookings` for user history
- [ ] Build `/dashboard` page — active bookings, past history, profile
- [ ] Add booking confirmation email (optional: Resend)
- [ ] Add booking status badges (PENDING / CONFIRMED / CANCELLED)

**Key Files:** `app/(auth)/book/`, `app/(auth)/dashboard/`, `app/api/bookings/`

---

### Phase 4 — Team Finder
**Goal:** Students can form and discover project teams.

- [ ] Build `/teams` page — team grid with skill tag filters
- [ ] Build `CreateTeamForm.tsx` — form with skill tag multi-select
- [ ] Build `/teams/[id]` page — team detail + join request
- [ ] Build `POST /api/teams` and `GET /api/teams`
- [ ] Add leader/member profile cards

**Key Files:** `app/(auth)/teams/`, `components/teams/`, `app/api/teams/`

---

### Phase 5 — Admin Panel + SEO + Performance
**Goal:** Full superadmin control panel and production-ready performance.

- [ ] Build `/superadmin` dashboard — stats cards (total labs, bookings, users)
- [ ] Build `/superadmin/labs` — CRUD table for labs
- [ ] Build `/superadmin/bookings` — filterable bookings table with status control
- [ ] Build `/superadmin/users` — user table with role management
- [ ] Build `/superadmin/events` — create/edit events
- [ ] Add `sitemap.ts` and `robots.ts`
- [ ] Add dynamic OG image (`/api/og`) for labs and insights
- [ ] Lighthouse audit — target 90+ on Performance, SEO, Accessibility
- [ ] Add `loading.tsx` skeletons for all major routes

**Key Files:** `app/superadmin/`, `app/sitemap.ts`, `app/api/og/`

---

## 12. Design System

### Color Palette

```css
/* globals.css */
:root {
  /* Brand */
  --color-primary: #6C63FF;       /* Electric violet — primary CTA */
  --color-primary-dark: #4A42CC;
  --color-accent: #00D4FF;        /* Cyan — 3D glow, highlights */
  --color-accent-warm: #FF6B6B;   /* Coral — warnings, badges */

  /* Backgrounds */
  --color-bg: #0A0A0F;            /* Near-black — main background */
  --color-surface: #111118;       /* Slightly lighter surface */
  --color-surface-2: #1A1A25;     /* Cards, modals */
  --color-border: rgba(255,255,255,0.08);

  /* Text */
  --color-text: #F0F0F5;          /* Primary text */
  --color-text-muted: #8888A0;    /* Muted labels */
  --color-text-subtle: #444458;   /* Placeholder / disabled */

  /* Lab Category Colors */
  --color-ai-ml: #6C63FF;
  --color-robotics: #00D4FF;
  --color-design: #FF6B6B;
  --color-hardware: #FFB347;
  --color-media: #4ECDC4;
  --color-xr: #A855F7;
  --color-cybersecurity: #22C55E;
  --color-biotech: #F97316;
}
```

### Typography

```css
/* Font: Space Grotesk (headings) + Inter (body) */
--font-heading: 'Space Grotesk', sans-serif;
--font-body: 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
--text-6xl: 3.75rem;   /* 60px */
--text-hero: clamp(3rem, 8vw, 6rem); /* Responsive hero text */
```

### Spacing

- Base unit: `4px`
- Scale: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`px

### Border Radius

```css
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;  /* Pills, avatars */
```

---

## 13. Performance & SEO

### Core Web Vitals Targets

| Metric | Target |
|---|---|
| LCP | < 2.5s |
| FID / INP | < 100ms |
| CLS | < 0.1 |
| Lighthouse Performance | 90+ |
| Lighthouse SEO | 100 |
| Lighthouse Accessibility | 90+ |

### SEO Setup

Every page must export a `generateMetadata()` function:

```ts
// app/(public)/labs/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const lab = await getLabBySlug(params.slug)
  return {
    title: `${lab.name} — Lakshay 2047`,
    description: lab.description,
    openGraph: {
      title: lab.name,
      description: lab.description,
      images: [`/api/og?type=lab&slug=${lab.slug}`],
    }
  }
}
```

### 3D Performance

- Dynamic import all R3F canvas components with `ssr: false`
- Use `<Canvas dpr={[1, 2]}>` to cap device pixel ratio
- Detect low-end GPU with `useDetectGPU()` from drei; reduce particle count on mobile
- Dispose all Three.js objects in `useEffect` cleanup

---

## 14. Deployment

### Platform: Vercel (Primary)

```
Production:  https://lakshay-2047-web-application.vercel.app
Preview:     Auto-deployed on every PR
```

### Build Command

```bash
prisma generate && next build
```

### Environment

Set all variables from `.env.example` in Vercel project settings under Environment Variables.

### Database

- **Development:** Local MySQL via XAMPP or Docker
- **Production:** PlanetScale (serverless MySQL, Prisma compatible) or cPanel MySQL with connection pooling

### Redis

- **Development:** Local Redis or Upstash free tier
- **Production:** Upstash Redis (already familiar from TMS project)

### Post-Deploy Checklist

- [ ] Run `prisma db push` or `prisma migrate deploy` on production
- [ ] Verify Google OAuth redirect URIs include production domain
- [ ] Confirm `@paruluniversity.ac.in` restriction is active
- [ ] Test OG image route (`/api/og`)
- [ ] Run Lighthouse on production URL

---

## 15. Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Components | PascalCase | `LabCard.tsx`, `HeroCanvas.tsx` |
| Hooks | camelCase, `use` prefix | `useScrollProgress.ts` |
| Utility functions | camelCase | `formatDate()`, `slugify()` |
| API routes | kebab-case folders | `app/api/lab-slots/route.ts` |
| DB model fields | camelCase | `startTime`, `isActive` |
| CSS variables | kebab-case | `--color-primary` |
| Constants | SCREAMING_SNAKE_CASE | `LAB_CATEGORIES`, `MAX_BOOKING_HOURS` |
| Types/Interfaces | PascalCase | `type Lab`, `interface BookingSlot` |
| 3D model files | kebab-case | `floating-orb.glb`, `hero-model.gltf` |

---

## 16. AI Coding Agent Context

> This section is specifically for Claude Code, GitHub Copilot, Cursor, or any AI agent working on this codebase. Read this before generating any code.

### Project Identity

- **Project name:** Lakshay 2047 (not "Lakshya")
- **Framework:** Next.js 15 App Router — use Server Components by default, Client Components only when needed
- **Styling:** Tailwind CSS v4 only — no inline styles, no CSS Modules
- **No `pages/` directory** — this is App Router only. All routes live in `app/`

### Critical Rules

1. **Never use `pages/` router patterns.** All routes are in `app/` using App Router conventions.
2. **All 3D components must be dynamically imported** with `ssr: false`. Never import Three.js or R3F in Server Components.
3. **Use `'use client'` only when strictly necessary** — interactivity, browser APIs, hooks.
4. **Prisma client must be a singleton.** Always import from `@/lib/prisma`, never instantiate directly.
5. **Auth always via `auth()` from `@/lib/auth`** — never use raw session cookies.
6. **Validate all API inputs with Zod** before touching the database.
7. **Rate limit all mutation endpoints** using `@/lib/ratelimit`.
8. **Use `cn()` from `@/lib/utils`** for merging Tailwind classes — never string concatenation.
9. **All database queries go in Server Components or API Route Handlers** — never fetch from Prisma inside Client Components.
10. **Student auth is `@paruluniversity.ac.in` only** — enforce in `lib/auth.ts` `signIn` callback.

### Common Patterns

```ts
// ✅ Correct — Prisma in Server Component
// app/(public)/labs/page.tsx
import { prisma } from '@/lib/prisma'
const labs = await prisma.lab.findMany({ where: { isActive: true } })

// ❌ Wrong — Prisma in Client Component
'use client'
import { prisma } from '@/lib/prisma' // Never do this

// ✅ Correct — Dynamic import for 3D
const HeroCanvas = dynamic(() => import('@/components/3d/HeroCanvas'), { ssr: false })

// ✅ Correct — cn() for class merging
import { cn } from '@/lib/utils'
<div className={cn('base-class', isActive && 'active-class', className)} />
```

### File Creation Rules for AI Agents

- When creating a new page, always add `generateMetadata()` export
- When creating a new API route, always add Zod validation + auth check + rate limit
- When creating a 3D component, always include dispose logic in `useEffect` cleanup
- When creating a form, use `react-hook-form` + `zod` resolver — never uncontrolled forms

---

*Documentation maintained by Aman · Ethnotech Academy · Vadodara, Gujarat*
*Feed this file to Claude Code or Copilot as project context before starting any session.*
