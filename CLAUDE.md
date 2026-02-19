# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16.1.6 application using React 19.2.3, TypeScript, and Tailwind CSS v4. The project appears to be for a lifting diary/workout tracking application (based on the project name "liftingdiarycourse").

## Development Commands

- `npm run dev` - Start development server (runs on http://localhost:3000)
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture & Key Patterns

### Next.js App Router
- Uses the modern App Router with the `src/app/` directory structure
- Server Components by default (use `'use client'` directive when client-side interactivity is needed)
- File-based routing: pages are defined by `page.tsx` files in the `src/app/` directory
- Layouts are defined using `layout.tsx` files for shared UI

### TypeScript Configuration
- Strict mode enabled
- Path alias: `@/*` maps to `./src/*` for cleaner imports
- Example: `import Component from '@/components/Component'`

### Styling
- Tailwind CSS v4 with PostCSS integration
- Uses `@tailwindcss/postcss` plugin (note: this is Tailwind v4 which has different patterns than v3)
- Global styles in `src/app/globals.css`
- Supports dark mode via `dark:` class prefix
- Uses Geist and Geist Mono fonts from `next/font/google`

### ESLint Setup
- Uses `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Configured with ESLint v9 flat config format (`.mjs` file)
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Project Structure

```
src/
  app/
    layout.tsx      # Root layout with fonts and metadata
    page.tsx        # Homepage
    globals.css     # Global styles and Tailwind directives
```

## Important Notes

- Next.js 16 uses React 19, which has breaking changes from React 18 (e.g., `react-hook-form` may require updates)
- Tailwind CSS v4 is a major version with new configuration patterns - configuration is now done via PostCSS rather than `tailwind.config.js`
- The project uses TypeScript strict mode - ensure all types are properly defined
