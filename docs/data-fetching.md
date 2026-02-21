# Data Fetching

## CRITICAL: Server Components Only

**ALL data fetching MUST be done exclusively via React Server Components.**

- **DO NOT** fetch data in Route Handlers (`app/api/`)
- **DO NOT** fetch data in Client Components (`'use client'`)
- **DO NOT** use `useEffect` + `fetch` or any client-side data fetching pattern
- **DO NOT** use SWR, React Query, or similar client-side fetching libraries

Server Components fetch data at render time on the server. This is the only approved pattern.

```tsx
// ✅ CORRECT — Server Component fetching data
// app/workouts/page.tsx
import { getWorkoutsForUser } from '@/data/workouts'

export default async function WorkoutsPage() {
  const workouts = await getWorkoutsForUser(userId)
  return <WorkoutList workouts={workouts} />
}
```

```tsx
// ❌ WRONG — Client Component fetching data
'use client'
import { useEffect, useState } from 'react'

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState([])
  useEffect(() => {
    fetch('/api/workouts').then(...)  // Never do this
  }, [])
}
```

```ts
// ❌ WRONG — Route Handler used for data fetching
// app/api/workouts/route.ts
export async function GET() {
  const workouts = await db.select()...  // Never do this for data fetching
}
```

---

## Database Queries: `/data` Directory

All database queries must live in helper functions inside the `/data` directory.

- One file per domain entity (e.g., `data/workouts.ts`, `data/exercises.ts`)
- All queries use **Drizzle ORM** — never raw SQL strings
- Functions are `async` and return typed results

```ts
// ✅ CORRECT — /data/workouts.ts
import { db } from '@/db'
import { workouts } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId))
}
```

```ts
// ❌ WRONG — Raw SQL
export async function getWorkouts(userId: string) {
  return db.execute(sql`SELECT * FROM workouts WHERE user_id = ${userId}`)
}
```

---

## Authorization: Users Can Only Access Their Own Data

**Every** data helper function that returns user-owned data MUST filter by the authenticated user's ID. It is never acceptable for a logged-in user to access another user's data.

### Rules

1. Always retrieve the current user's ID from the auth session before querying.
2. Always include a `where` clause filtering by `userId` (or equivalent ownership column).
3. Never accept a `userId` as an argument from untrusted input — always derive it from the server-side session.

```ts
// ✅ CORRECT — userId sourced from server session, enforced in query
import { auth } from '@/auth'
import { db } from '@/db'
import { workouts } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getWorkoutsForUser() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, session.user.id))
}
```

```ts
// ❌ WRONG — userId passed in from caller (could be tampered with)
export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId))
}
```

Failing to enforce ownership at the data layer is a **critical security vulnerability**.

---

## Summary Checklist

| Rule | Required |
|---|---|
| Fetch data only in Server Components | ✅ Always |
| Use helper functions in `/data` directory | ✅ Always |
| Use Drizzle ORM (no raw SQL) | ✅ Always |
| Filter every query by authenticated user's ID | ✅ Always |
| Source userId from server session (not caller input) | ✅ Always |
| Fetch data in Client Components or Route Handlers | ❌ Never |
