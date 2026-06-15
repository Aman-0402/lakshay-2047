# AGENTS.md — Lakshay 2047

Guidance for AI agents working in this repository. Read before making any changes.

---

## Project Identity

Next.js 15 App Router app for Parul University's Centre of Future Skills. 14 innovation labs: booking system, team finder, student portal. Dark sci-fi aesthetic, React 19, TypeScript strict, Tailwind v4.

---

## Commands

```bash
npm run dev          # Dev server (Turbopack, port 3000)
npm run build        # Production build — run to verify no regressions
npm run check        # TypeScript check (tsc --noEmit) — run after every edit
npm run seed         # Seed DB with 14 labs
npx prisma db push   # Sync schema.prisma → MySQL (no migration files)
npx prisma studio    # Browse DB
```

**Always run `npm run check` after edits. Always run `npm run build` before reporting done.**

---

## Architecture Rules

### Server vs Client Components

- Default: Server Component. Add `'use client'` only when using hooks, event listeners, or browser APIs.
- Pages in `app/(auth)/` and `app/(public)/` are Server Components.
- Client Component islands: `TeamCard`, `TeamGrid`, `CreateTeamForm`, `JoinTeamButton`, `BookingSlotPicker`, `BookingCard`, `BookingList`, `LabFilter`, `LabsView`.
- Never import a Client Component into a Server Component without passing serializable props.

### Date Serialization

Server→Client boundary: **never pass `Date` objects as props.** Always convert:

```ts
createdAt: row.createdAt.toISOString()
```

Matching `Serialized*` types in `types/` enforce this. Add new ones for any new entity crossing the boundary.

### Auth Pattern (Server Components)

```ts
const session = await auth()
if (!session?.user?.id) redirect('/login')
```

In API routes:

```ts
const session = await auth()
if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
```

### API Route Pattern

```ts
// 1. Auth check
// 2. Parse + validate with Zod (safeParse → 422 on failure)
// 3. Rate limit if applicable (bookingRateLimit)
// 4. Business logic check (conflict, capacity, ownership)
// 5. Prisma operation
// 6. Return serialized JSON
```

### Zod Validation

Use `z.safeParse()` in API routes:

```ts
const parsed = schema.safeParse(body)
if (!parsed.success) {
  return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 422 })
}
```

Never throw on parse failure. Always return 422 with issues.

---

## File Conventions

### Imports

- `@/` → `client/src/` alias (maps to project root in this Next.js setup)
- `@/lib/utils` → `cn()` (clsx + tailwind-merge)
- `@/lib/auth` → `auth`, `signIn`, `signOut`
- `@/lib/prisma` → `prisma` singleton
- `@shared/` is NOT used — this is a Next.js project, not the LMS monorepo

### Types

Add new types to `types/<entity>.ts` and re-export from `types/index.ts`.

Serialized types (for Server→Client):
- `SerializedBookingWithLab` — `types/booking.ts`
- `SerializedTeam`, `SerializedTeamMember` — `types/team.ts`
- `UserProfile` — `types/user.ts`

### CSS

- Tailwind utility classes only. No inline `style={{}}` except for dynamic values (color hex strings, width percentages from data).
- `cn()` for all class merging.
- Design tokens in `app/globals.css` → `@theme inline {}`. Use `bg-primary`, `text-accent`, `bg-surface-2`, etc.
- Custom CSS only in `app/globals.css` or module files.

### Routing

- Wouter is NOT used here — this is Next.js with `next/navigation`.
- Use `<Link href="...">` from `next/link`.
- Use `redirect()` from `next/navigation` in Server Components.
- Use `useRouter()` from `next/navigation` in Client Components.
- Route groups: `(public)` = no auth gate, `(auth)` = redirect to `/login` if unauthenticated.
- Async params in Next.js 15: `params: Promise<{ id: string }>` → `const { id } = await params`.

---

## Database

### Schema Changes

Edit `prisma/schema.prisma` → run `npx prisma db push`. Do **not** generate migration files.

### Prisma Usage

Always import from `@/lib/prisma`:

```ts
import { prisma } from '@/lib/prisma'
```

Use `Prisma.EntityGetPayload<{...}>` for typed query results:

```ts
import type { Prisma } from '@prisma/client'
type TeamWithMembers = Prisma.TeamGetPayload<{
  include: { members: { include: { user: { select: { id: true; name: true; image: true } } } } }
}>
```

### Soft Delete

Never hard-delete bookings or teams. Use status fields:
- Bookings: set `status: 'CANCELLED'`
- Teams: set `isOpen: false`

---

## Component Patterns

### Forms (react-hook-form + Zod)

```ts
const schema = z.object({ ... })
type FormValues = z.infer<typeof schema>

const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
  resolver: zodResolver(schema),
})
```

For `<select>` with numeric value, use `{ valueAsNumber: true }`:

```ts
<select {...register('maxMembers', { valueAsNumber: true })}>
```

Use `z.number()` (not `z.coerce.number()`) when pairing with `valueAsNumber`.

### Optimistic Updates

Pattern from `BookingCard`:
```ts
setLocalStatus('CANCELLED')              // optimistic
const res = await fetch(...)
if (!res.ok) setLocalStatus(prev)        // revert
```

### Radix Dialog

Import: `import * as Dialog from '@radix-ui/react-dialog'`

Always add `type="button"` to non-submit buttons inside forms. Always add `aria-label` to icon-only buttons.

### AnimatePresence (Framer Motion)

Use `mode="popLayout"` for grid filter transitions. Wrap items in `<motion.div key={...}>` with `layout` prop.

### 3D Components (R3F)

All R3F components must be dynamically imported with `ssr: false`:

```ts
const HeroCanvas = dynamic(() => import('@/components/3d/HeroCanvas'), { ssr: false })
```

The `r3f.d.ts` shim in root extends `React.JSX.IntrinsicElements` with Three.js elements (required for React 19 compatibility).

---

## Installation

Always use `--legacy-peer-deps`:

```bash
npm install <package> --legacy-peer-deps
```

R3F + React 19 peer dep chain requires this.

---

## Pinned Versions (Do Not Upgrade Without Testing)

| Package | Version | Reason |
|---|---|---|
| `next-auth` | `5.0.0-beta.31` | Later betas may break adapter API |
| `prisma` + `@prisma/client` | `^6` | v7 removed `url` from datasource |
| `@react-three/fiber` | `^9.6.1` | v8 breaks on React 19 |
| `@react-three/drei` | `^10.7.7` | Must match fiber v9 |

---

## Redis / Rate Limiting

All Redis helpers are null-safe — app works without `UPSTASH_*` env vars:

```ts
export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redis) return null
  ...
}
```

Rate limiter (`bookingRateLimit`) is `null` when Redis unavailable. Always null-check before calling `.limit()`.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | MySQL connection string |
| `AUTH_SECRET` | Yes | NextAuth secret |
| `AUTH_GOOGLE_ID` | Yes | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Yes | Google OAuth client secret |
| `AUTH_URL` | Yes | App base URL (e.g. `http://localhost:3000`) |
| `UPSTASH_REDIS_REST_URL` | No | Upstash Redis endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | No | Upstash Redis token |

Prisma reads `.env`. NextAuth reads `.env.local` or `.env`. Put all vars in `.env` to cover both.

---

## What NOT to Do

- Do not use `style={{}}` for values available as Tailwind utilities
- Do not pass `Date` objects across Server→Client boundary
- Do not hard-delete records — use status/soft cancel
- Do not use Wouter (this is Next.js, not the Innolance LMS project)
- Do not generate Prisma migration files — use `db push`
- Do not add `--no-verify` to git commands
- Do not upgrade pinned packages without testing TypeScript + build
- Do not add comments explaining WHAT code does — only add comments for non-obvious WHY
- Do not create `*.md` documentation files unless explicitly requested
