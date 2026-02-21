# Data Mutations

## CRITICAL: Server Actions Only

**ALL data mutations MUST be done exclusively via Next.js Server Actions.**

- **DO NOT** mutate data in Route Handlers (`app/api/`)
- **DO NOT** mutate data directly inside Client Components
- **DO NOT** call Drizzle ORM directly from a Server Action — always go through a `/data` helper function
- **DO NOT** use `FormData` as a parameter type for any Server Action

---

## Server Actions: `actions.ts` Files

Server Actions must be defined in colocated `actions.ts` files, placed alongside the route or feature they belong to.

- One `actions.ts` file per route/feature directory
- All functions in `actions.ts` must have the `'use server'` directive at the top of the file
- Action function parameters must be explicitly typed — never use `FormData`
- Every action must validate its arguments with **Zod** before doing anything else

```ts
// ✅ CORRECT — app/workouts/actions.ts
'use server'

import { z } from 'zod'
import { createWorkout } from '@/data/workouts'

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.string().date(),
})

export async function createWorkoutAction(params: {
  name: string
  date: string
}) {
  const parsed = createWorkoutSchema.safeParse(params)
  if (!parsed.success) throw new Error('Invalid input')

  await createWorkout(parsed.data)
}
```

```ts
// ❌ WRONG — FormData parameter type
export async function createWorkoutAction(formData: FormData) {
  const name = formData.get('name')
  ...
}
```

```ts
// ❌ WRONG — No Zod validation
export async function createWorkoutAction(params: {
  name: string
  date: string
}) {
  await createWorkout(params)  // Never skip validation
}
```

```ts
// ❌ WRONG — Drizzle called directly from the action
'use server'
import { db } from '@/db'
import { workouts } from '@/db/schema'

export async function createWorkoutAction(params: { name: string }) {
  await db.insert(workouts).values(params)  // Must go through /data helper
}
```

---

## Database Mutations: `/data` Directory

All database mutation logic must live in helper functions inside the `/data` directory. Server Actions call these helpers — they never call Drizzle directly.

- One file per domain entity (e.g., `data/workouts.ts`, `data/exercises.ts`)
- All mutations use **Drizzle ORM** — never raw SQL strings
- Functions are `async` and accept typed arguments

```ts
// ✅ CORRECT — /data/workouts.ts
import { db } from '@/db'
import { workouts } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'

export async function createWorkout(data: { name: string; date: string }) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  await db.insert(workouts).values({ ...data, userId: session.user.id })
}

export async function deleteWorkout(workoutId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  await db
    .delete(workouts)
    .where(eq(workouts.id, workoutId) && eq(workouts.userId, session.user.id))
}
```

```ts
// ❌ WRONG — Raw SQL
export async function createWorkout(data: { name: string }) {
  await db.execute(sql`INSERT INTO workouts ...`)
}
```

---

## Authorization: Scope All Mutations to the Authenticated User

Every data helper function that mutates user-owned data MUST scope the operation to the authenticated user's ID. A user must never be able to modify another user's data.

### Rules

1. Always retrieve the current user's ID from the auth session inside the `/data` helper — never accept a `userId` as a caller argument.
2. Always include a `where` clause filtering by `userId` on `UPDATE` and `DELETE` operations.
3. Always attach the `userId` from the session when inserting new records.

```ts
// ✅ CORRECT — userId sourced from session, enforced on delete
export async function deleteWorkout(workoutId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  await db
    .delete(workouts)
    .where(eq(workouts.id, workoutId) && eq(workouts.userId, session.user.id))
}
```

```ts
// ❌ WRONG — No userId scoping on delete (another user's record could be deleted)
export async function deleteWorkout(workoutId: string) {
  await db.delete(workouts).where(eq(workouts.id, workoutId))
}
```

Failing to scope mutations to the authenticated user is a **critical security vulnerability**.

---

## Zod Validation Rules

All Server Action parameters must be validated with Zod before the action performs any work.

- Define a Zod schema for every action in the same `actions.ts` file
- Use `safeParse` and throw (or return an error) on failure — never proceed with invalid data
- Validate the parsed data (not the raw input) when calling `/data` helpers

```ts
// ✅ CORRECT — schema defined, safeParse used, parsed data forwarded
const updateWorkoutSchema = z.object({
  workoutId: z.string().uuid(),
  name: z.string().min(1).max(100),
})

export async function updateWorkoutAction(params: {
  workoutId: string
  name: string
}) {
  const parsed = updateWorkoutSchema.safeParse(params)
  if (!parsed.success) throw new Error('Invalid input')

  await updateWorkout(parsed.data)
}
```

---

## Redirects After Mutations

**Never call `redirect()` inside a Server Action.** Redirects must be handled client-side after the action resolves.

- Server Actions should return (implicitly or explicitly) when their work is done — they must not call `redirect()` from `next/navigation`
- The calling Client Component is responsible for navigating after a successful action, using `useRouter` from `next/navigation`

```ts
// ✅ CORRECT — action returns, client handles redirect
// actions.ts
export async function createWorkoutAction(params: { name?: string; date: string }) {
  const parsed = createWorkoutSchema.safeParse(params)
  if (!parsed.success) throw new Error('Invalid input')

  await createWorkout(parsed.data)
  // no redirect() here
}

// CreateWorkoutForm.tsx (Client Component)
'use client'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { createWorkoutAction } from './actions'

function CreateWorkoutForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleSubmit() {
    startTransition(async () => {
      await createWorkoutAction({ date: '2026-02-20' })
      router.push('/dashboard')  // redirect happens client-side
    })
  }
}
```

```ts
// ❌ WRONG — redirect() called inside the Server Action
export async function createWorkoutAction(params: { date: string }) {
  await createWorkout(params)
  redirect('/dashboard')  // Never do this
}
```

---

## Summary Checklist

| Rule | Required |
|---|---|
| Mutate data only via Server Actions | ✅ Always |
| Place Server Actions in colocated `actions.ts` files | ✅ Always |
| Use typed parameters (never `FormData`) | ✅ Always |
| Validate all action params with Zod before proceeding | ✅ Always |
| Call `/data` helper functions for all DB mutations | ✅ Always |
| Use Drizzle ORM in `/data` helpers (no raw SQL) | ✅ Always |
| Scope all mutations to the authenticated user's ID | ✅ Always |
| Source userId from server session (not caller input) | ✅ Always |
| Handle redirects client-side after action resolves | ✅ Always |
| Mutate data in Route Handlers or Client Components | ❌ Never |
| Call Drizzle directly from a Server Action | ❌ Never |
| Accept `FormData` as a Server Action parameter | ❌ Never |
| Skip Zod validation | ❌ Never |
| Call `redirect()` inside a Server Action | ❌ Never |
