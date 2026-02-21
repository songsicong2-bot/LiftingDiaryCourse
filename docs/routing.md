# Routing Coding Standards

## Route Structure

**All application routes must live under `/dashboard`.**

- The homepage (`/`) is public and serves as the landing/sign-in page.
- All authenticated app features are accessed via `/dashboard` or a sub-path of it.
- Do NOT create top-level routes (e.g., `/workouts`, `/profile`) outside of `/dashboard`.

```
✅ CORRECT route structure:
/                          → public landing page
/dashboard                 → main dashboard (protected)
/dashboard/workout/new     → create a workout (protected)
/dashboard/workout/[id]    → view/edit a workout (protected)

❌ WRONG — routes outside /dashboard:
/workouts
/profile
/settings
```

---

## Route Protection

**All `/dashboard` routes are protected — they require the user to be signed in.**

Route protection is enforced via **Next.js middleware** using Clerk. Do NOT implement manual redirect logic inside individual page components.

```ts
// ✅ CORRECT — src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

- `createRouteMatcher(["/dashboard(.*)"])` matches `/dashboard` and all sub-paths.
- `auth.protect()` redirects unauthenticated users to the Clerk sign-in page automatically.
- Do NOT call `auth.protect()` or add redirect logic inside page components — that is the middleware's responsibility.

---

## Adding New Routes

When adding a new page to the app:

1. **Place it under `src/app/dashboard/`** — never at the top level.
2. **No extra protection needed** — the middleware already protects all `/dashboard` routes.
3. Follow the Next.js App Router file convention: create a `page.tsx` inside the appropriate folder.

```
✅ Adding a "profile" page:
src/app/dashboard/profile/page.tsx  →  accessible at /dashboard/profile

❌ Wrong location:
src/app/profile/page.tsx  →  accessible at /profile (not protected, violates convention)
```

---

## Summary Checklist

| Rule | Required |
|---|---|
| All app routes live under `/dashboard` | ✅ Always |
| `/dashboard` and all sub-routes are protected | ✅ Always |
| Route protection is handled in `src/middleware.ts` via Clerk | ✅ Always |
| Use `createRouteMatcher` + `auth.protect()` in middleware | ✅ Always |
| Add redirect/auth logic inside page components | ❌ Never |
| Create protected pages outside of `/dashboard` | ❌ Never |
