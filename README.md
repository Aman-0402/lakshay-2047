# Lakshay 2047

**Parul University — Centre of Future Skills**  
Lab booking, team finder, and student portal for 14 world-class innovation labs.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4, Framer Motion v11 |
| 3D | React Three Fiber v9, Drei v10 |
| Database | MySQL via Prisma v6 |
| Auth | NextAuth v5 beta (Google OAuth, Parul email gate) |
| Forms | react-hook-form v7 + Zod v4 |
| UI Primitives | Radix UI (Dialog) |
| Cache / Rate limit | Upstash Redis (optional, graceful degradation) |
| OG Images | @vercel/og |

---

## Project Structure

```
lakshay-2047/
├── app/
│   ├── (public)/               # No auth required
│   │   ├── page.tsx            # Home — 3D hero + sections
│   │   ├── labs/               # Lab directory + detail
│   │   └── labs/[slug]/        # Lab detail page
│   ├── (auth)/                 # Auth required — redirects to /login
│   │   ├── book/[labSlug]/     # Slot picker + booking flow
│   │   ├── dashboard/          # Student dashboard + bookings
│   │   └── teams/              # Team finder + team detail
│   ├── api/
│   │   ├── auth/[...nextauth]/ # NextAuth handlers
│   │   ├── bookings/           # GET + POST bookings
│   │   ├── bookings/[id]/      # PATCH (cancel)
│   │   ├── labs/               # GET all labs
│   │   ├── labs/[slug]/        # GET single lab + 14-day availability
│   │   ├── teams/              # GET open teams + POST create
│   │   ├── teams/[id]/join/    # POST join team
│   │   └── og/                 # Dynamic OG image
│   └── layout.tsx              # Root layout (fonts, navbar, footer)
├── components/
│   ├── 3d/                     # R3F canvas, particle field, floating orb
│   ├── home/                   # HeroSection
│   ├── labs/                   # LabCard, LabGrid, LabFilter, BookingSlotPicker
│   ├── dashboard/              # ProfileCard, BookingList, BookingCard
│   ├── teams/                  # TeamCard, TeamGrid, CreateTeamForm, JoinTeamButton
│   ├── layout/                 # Navbar, Footer, PageWrapper
│   └── ui/                     # Badge, StatusBadge
├── lib/
│   ├── auth.ts                 # NextAuth config
│   ├── prisma.ts               # Prisma singleton
│   ├── redis.ts                # Upstash Redis (null-safe)
│   ├── ratelimit.ts            # Sliding window rate limiter
│   ├── utils.ts                # cn() helper
│   └── constants.ts            # Lab category labels + colors
├── types/
│   ├── booking.ts              # SerializedBookingWithLab
│   ├── lab.ts                  # Lab, LabCategory, TimeSlot
│   ├── team.ts                 # SerializedTeam, SerializedTeamMember
│   └── user.ts                 # UserProfile, UserRole
├── prisma/
│   ├── schema.prisma           # Full DB schema
│   └── seed.ts                 # Seed 14 labs
└── r3f.d.ts                    # R3F + React 19 JSX type shim
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- MySQL 8+ running locally
- Google OAuth app (Parul University domain)

### 1. Clone + install

```bash
git clone https://github.com/your-org/lakshay-2047.git
cd lakshay-2047
npm install --legacy-peer-deps
```

### 2. Environment variables

Create `.env` (Prisma reads `.env`, not `.env.local`):

```env
DATABASE_URL="mysql://root:@localhost:3306/lakshay"
AUTH_SECRET="your-random-secret-here"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
AUTH_URL="http://localhost:3000"
```

Optional (Upstash Redis — rate limiting + caching):

```env
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."
```

Create `.env.local` for Next.js client vars (none required currently).

### 3. Database setup

```bash
npx prisma db push          # Sync schema → MySQL
npm run seed                # Seed 14 labs
```

### 4. Run dev server

```bash
npm run dev                 # http://localhost:3000
```

---

## Scripts

```bash
npm run dev       # Next.js dev server (Turbopack)
npm run build     # Production build
npm run check     # TypeScript check (tsc --noEmit)
npm run seed      # Seed database (tsx prisma/seed.ts)
npx prisma studio # Browse DB in browser
```

---

## Authentication

- **Provider**: Google OAuth only
- **Gate**: `signIn` callback rejects emails not ending in `@paruluniversity.ac.in`
- **Session**: `session.user.id` + `session.user.role` available server-side via `await auth()`
- **Login page**: `/login`
- **Roles**: `STUDENT` | `FACULTY` | `LAB_ADMIN` | `SUPER_ADMIN`

---

## API Reference

### Bookings

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/bookings` | any | List current user's bookings |
| POST | `/api/bookings` | auth | Create booking (rate-limited: 5/hr) |
| PATCH | `/api/bookings/[id]` | owner/admin | Cancel booking |

### Labs

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/labs` | — | All active labs |
| GET | `/api/labs/[slug]` | — | Lab + 14-day availability |

### Teams

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/teams` | — | Open teams (optional `?skills=react,ts` filter) |
| POST | `/api/teams` | auth | Create team + auto-assign leader |
| POST | `/api/teams/[id]/join` | auth | Join team (open + capacity + not-member checks) |

---

## Features

### Phase 1 — 3D Hero
- React Three Fiber canvas with particle field + animated orb
- Space Grotesk + Inter + JetBrains Mono font stack
- Tailwind v4 design tokens via `@theme inline {}`
- Dynamic OG image via `@vercel/og`

### Phase 2 — Lab Directory
- 14 labs with category, capacity, equipment, availability
- Category filter strip with AnimatePresence transitions
- 14-day slot picker (60-min slots, conflict detection)
- `BookingSlotPicker` Radix Dialog modal

### Phase 3 — Student Dashboard
- Auth-gated dashboard at `/dashboard`
- Booking list split into Upcoming / Past & Cancelled
- Optimistic cancel with revert on error
- Rate-limited booking creation (Upstash, graceful degradation without Redis)

### Phase 4 — Team Finder
- Browse open teams with skill-tag filter
- Stacked avatar display, member count / capacity bar
- `CreateTeamForm`: react-hook-form + Zod, tag input (Enter/comma to add)
- `JoinTeamButton` Client Component island in Server Component detail page
- Full team detail at `/teams/[id]`

---

## Design Tokens

Defined in `app/globals.css` under `@theme inline {}`:

| Token | Value |
|---|---|
| `--color-primary` | `#6C63FF` (indigo) |
| `--color-accent` | `#00D4FF` (cyan) |
| `--color-bg` | `#0A0A0F` |
| `--color-surface` | `#111118` |
| `--color-surface-2` | `#1A1A25` |
| `--font-heading` | Space Grotesk |
| `--font-mono` | JetBrains Mono |

---

## Known Constraints

- `--legacy-peer-deps` required for npm installs (R3F/React 19 peer dep chain)
- Prisma v6 required — v7 removed `url` field from datasource
- NextAuth `5.0.0-beta.31` pinned — later betas may have breaking changes
- R3F components must be dynamically imported with `ssr: false`
- All Server→Client date props must be `.toISOString()` strings (never `Date` objects)
- `suppressHydrationWarning` on `<html>` and `<body>` (browser extension attributes)
