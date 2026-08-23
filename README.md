# Bork

Bork is a dog-themed social feed and portfolio project. Visitors can read the public feed. Signed-in users can publish short borks, edit a profile, and switch themes.

The familiar feed makes the full-stack work easy to evaluate. The dog language gives the project its own character without copying another product's brand or feature set.

## Stack

- Next.js, React, and TypeScript
- tRPC and TanStack Query
- Supabase authentication and PostgreSQL
- Jest and Testing Library
- GitHub Actions and Vercel

## Run locally

Use Node.js 20 or later. Copy `.env.example` to `.env.local`, then add a Supabase project URL and anonymous key.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Checks

```bash
npm test
npm run lint
npm run typecheck
npm run build
npm run coverage
```

## Project notes

- The Pages Router keeps the route structure small and direct.
- tRPC procedures own input validation and data access.
- Shared profile, theme, and bork modules keep domain rules out of components.
- The project moved from PlanetScale and Railway to Supabase. The current repository contains only the active application, not one-off migration data.

Production: [bork.coltonspurgin.tech](https://bork.coltonspurgin.tech/)
