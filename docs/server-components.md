# Server Components Coding Standards

## CRITICAL: `params` and `searchParams` Are Promises

**This project runs Next.js 15. `params` and `searchParams` are Promises and MUST be awaited.**

- **DO NOT** access `params` or `searchParams` synchronously — they are not plain objects
- **DO NOT** destructure params inline in the function signature
- **ALWAYS** `await` both `params` and `searchParams` before accessing any of their properties

```tsx
// ✅ CORRECT — params awaited before access
// app/dashboard/workout/[workoutId]/page.tsx
interface EditWorkoutPageProps {
  params: Promise<{ workoutId: string }>
}

export default async function EditWorkoutPage({ params }: EditWorkoutPageProps) {
  const { workoutId } = await params
  ...
}
```

```tsx
// ❌ WRONG — params accessed synchronously (Next.js 14 pattern, breaks in Next.js 15)
export default async function EditWorkoutPage({
  params,
}: {
  params: { workoutId: string }
}) {
  const { workoutId } = params  // Never do this
  ...
}
```

```tsx
// ❌ WRONG — destructured directly in the function signature
export default async function EditWorkoutPage({
  params: { workoutId },
}: {
  params: { workoutId: string }
}) {
  // Never do this — params must be awaited first
}
```

---

## `searchParams` Must Also Be Awaited

The same rule applies to `searchParams`.

```tsx
// ✅ CORRECT — searchParams awaited before access
// app/dashboard/page.tsx
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { date } = await searchParams
  ...
}
```

```tsx
// ❌ WRONG — searchParams accessed without awaiting
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { date?: string }
}) {
  const { date } = searchParams  // Never do this
  ...
}
```

---

## Server Components Are Async

All Server Components that fetch data or access `params`/`searchParams` must be declared with `async`.

```tsx
// ✅ CORRECT — async Server Component
export default async function WorkoutPage({ params }: { params: Promise<{ workoutId: string }> }) {
  const { workoutId } = await params
  const workout = await getWorkoutById(Number(workoutId))
  return <div>{workout.name}</div>
}
```

```tsx
// ❌ WRONG — non-async component trying to await
export default function WorkoutPage({ params }: { params: Promise<{ workoutId: string }> }) {
  const { workoutId } = await params  // Syntax error — function must be async
}
```

---

## TypeScript: Correct Prop Types

Always type `params` and `searchParams` as `Promise<...>` in the component interface.

| Prop | Type |
|---|---|
| `params` with one segment | `Promise<{ segmentName: string }>` |
| `params` with multiple segments | `Promise<{ segmentA: string; segmentB: string }>` |
| `searchParams` | `Promise<{ key?: string }>` |

```tsx
// ✅ CORRECT — typed as Promise
interface PageProps {
  params: Promise<{ workoutId: string }>
  searchParams: Promise<{ date?: string }>
}

export default async function Page({ params, searchParams }: PageProps) {
  const { workoutId } = await params
  const { date } = await searchParams
  ...
}
```

---

## Summary Checklist

| Rule | Required |
|---|---|
| Type `params` and `searchParams` as `Promise<...>` | ✅ Always |
| `await params` before accessing any property | ✅ Always |
| `await searchParams` before accessing any property | ✅ Always |
| Declare data-fetching Server Components as `async` | ✅ Always |
| Access `params` synchronously (Next.js 14 pattern) | ❌ Never |
| Destructure `params` directly in the function signature | ❌ Never |
| Type `params` as a plain object `{ key: string }` | ❌ Never |
