# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Baby growth tracking app ("小葡萄成长记录") for a single baby. Chinese-language UI. Tracks feeding, sleep, diapers, growth measurements, health (vaccinations, doctor visits, temperature), and developmental milestones.

## Commands

- `npm run dev` — start dev server (http://localhost:3000)
- `npm run build` — production build (standalone output)
- `npm run lint` — run ESLint
- `npx prisma generate` — regenerate Prisma Client after schema changes
- `npx prisma db push` — push schema changes to SQLite database
- `npx prisma migrate dev` — create a migration after schema changes
- `node prisma/seed.js` — seed default baby data ("小葡萄", born 2026-01-06)

No test framework is configured.

## Architecture

**Next.js 16 App Router** with React 19, TypeScript, Tailwind CSS v4, Prisma + SQLite.

### Data Flow Pattern

Server-first architecture with selective client components:
1. **Pages** (`src/app/*/page.tsx`) are async server components that fetch data via server actions
2. **Server Actions** (`src/actions/*.ts`) contain all database CRUD operations using Prisma
3. **Client components** (`"use client"`) are used only where interactivity is needed (forms, timers, tabs)
4. All mutating server actions call `revalidatePath()` to refresh page data after writes

### Single-Baby Design

The app is hardcoded to track one baby. `BABY_ID = "default-baby"` is defined in `src/lib/constants.ts` and used by all server actions. There is no authentication or multi-user support.

### Key Architectural Files

- `src/lib/prisma.ts` — singleton PrismaClient (dev hot-reload safe via `globalThis`)
- `src/lib/constants.ts` — `BABY_ID`, feeding types, diaper types, `NAV_ITEMS` for navigation
- `src/lib/utils.ts` — `cn()` (clsx + tailwind-merge), date/time formatting helpers
- `src/components/layout/navigation.tsx` — desktop Sidebar + mobile bottom MobileNav
- `prisma/schema.prisma` — 9 models, all linked to Baby via foreign key

### API Routes

- `POST /api/upload` — image upload (JPEG/PNG/GIF/WebP/HEIC, max 5MB) → saves to `public/uploads/`
- `GET /api/export` — full data export as downloadable JSON

### Reference Data

- `src/data/who-standards.ts` — WHO growth standards (weight/length/head circumference percentiles)
- `src/data/vaccination-schedule.ts` — China 2024 National Immunization Program schedule

## Style & UI

- Tailwind CSS v4 with custom theme (grape purple / peach pink / mint green palette)
- Glass-morphism card styles defined in `src/app/globals.css`
- Component variants use `class-variance-authority` (CVA)
- Icons from `lucide-react`
- Animations via `framer-motion`
- Custom iOS-style DateTimeWheelPicker in `src/components/ui/`

## Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).
