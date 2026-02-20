# Authentication Coding Standards

## Provider: Clerk

**This project uses [Clerk](https://clerk.com/) exclusively for authentication.**

- Do NOT use NextAuth, Auth.js, Supabase Auth, or any other authentication library.
- Do NOT implement custom session handling, JWT generation, or cookie-based auth.
- All authentication is managed by Clerk — trust its session, middleware, and component APIs.

---

## Middleware

Route protection is handled by `clerkMiddleware()` in `src/middleware.ts`.

```ts
// ✅ CORRECT — src/middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

- Do NOT write manual redirect logic to protect routes — rely on Clerk middleware and Clerk's route protection helpers.

---

## Getting the Current User (Server-Side)

To get the authenticated user's ID in Server Components or data helper functions, use `auth()` from `@clerk/nextjs/server`.

```ts
// ✅ CORRECT — Server Component or /data helper
import { auth } from '@clerk/nextjs/server'

const { userId } = await auth()
if (!userId) throw new Error('Unauthorized')
```

- Always `await auth()` — it is async.
- Always check that `userId` is non-null before proceeding. Throw `'Unauthorized'` if not.
- **Never** accept a `userId` as a function argument from external/untrusted input. Always derive it from the server-side Clerk session.

```ts
// ❌ WRONG — userId passed in from the caller
export async function getWorkoutsForUser(userId: string) { ... }

// ✅ CORRECT — userId sourced from Clerk session inside the function
export async function getWorkoutsForUser() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  ...
}
```

---

## Provider Setup

The `<ClerkProvider>` must wrap the entire application. It is set up once in the root layout and must not be duplicated elsewhere.

```tsx
// ✅ CORRECT — src/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

- Do NOT add `<ClerkProvider>` in nested layouts or individual pages.

---

## UI Components

Use Clerk's built-in UI components for all auth-related UI. Do not build custom sign-in, sign-up, or user profile UIs.

| Use Case | Component | Import |
|---|---|---|
| Wrap the app | `<ClerkProvider>` | `@clerk/nextjs` |
| Show content only when signed out | `<SignedOut>` | `@clerk/nextjs` |
| Show content only when signed in | `<SignedIn>` | `@clerk/nextjs` |
| Sign-in trigger | `<SignInButton>` | `@clerk/nextjs` |
| Sign-up trigger | `<SignUpButton>` | `@clerk/nextjs` |
| User avatar + account menu | `<UserButton>` | `@clerk/nextjs` |

```tsx
// ✅ CORRECT — Clerk UI components used directly
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

<SignedOut>
  <SignInButton mode="modal">...</SignInButton>
  <SignUpButton mode="modal">...</SignUpButton>
</SignedOut>
<SignedIn>
  <UserButton />
</SignedIn>
```

---

## Import Locations

| Context | Import from |
|---|---|
| Server Components, data helpers, middleware | `@clerk/nextjs/server` |
| Client Components, layouts, UI | `@clerk/nextjs` |

```ts
// Server-side
import { auth } from '@clerk/nextjs/server'
import { clerkMiddleware } from '@clerk/nextjs/server'

// Client-side / shared UI
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
```

---

## Summary Checklist

| Rule | Required |
|---|---|
| Use Clerk for all authentication | ✅ Always |
| Wrap app with `<ClerkProvider>` in root layout only | ✅ Always |
| Use `auth()` from `@clerk/nextjs/server` to get `userId` on the server | ✅ Always |
| Check `userId` is non-null before querying data | ✅ Always |
| Derive `userId` from server session — never from caller input | ✅ Always |
| Use Clerk UI components for sign-in/sign-up/user UI | ✅ Always |
| Use any other auth library or custom auth implementation | ❌ Never |
| Accept `userId` as an untrusted argument in data functions | ❌ Never |
| Add `<ClerkProvider>` in nested layouts or pages | ❌ Never |
