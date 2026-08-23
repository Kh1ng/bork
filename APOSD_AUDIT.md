# APOSD design audit

Target: `src/` after the APOSD implementation pass. All 25 source files were scanned.

## Design health score

| Dimension | Score | Count and evidence |
| --- | ---: | --- |
| Pass-through proliferation | 4/4 | 0 pass-through methods or variable chains. `src/proxy.ts:6-12` refreshes auth before returning; `src/components/PageLayout.tsx:29-42` composes the responsive shell. |
| Information duplication | 3/4 | 2 pieces of knowledge remain duplicated: the source URL in `src/components/PageLayout.tsx:22` and `src/components/LeftBar.tsx:57`; the favicon path in `src/pages/_app.tsx:35`, `src/components/LeftBar.tsx:26`, and the static proxy matcher at `src/proxy.ts:16`. |
| Interface documentation | 2/4 | 12 of 28 exported runtime callables have useful interface comments (43%). Examples: `src/lib/profile.ts:37-77`, `src/lib/theme.ts:7-41`, and `src/proxy.ts:5-6`. Undocumented examples include `src/components/Loading.tsx:3-20`, `src/components/LeftBar.tsx:84-106`, and `src/pages/[slug].tsx:52-60`. |
| Naming quality | 4/4 | 0 vague blocklist identifiers or convention violations. Supabase and tRPC properties named `data` are external API fields and are aliased to domain names at their destructuring sites, for example `src/server/api/routers/posts.ts:31` and `src/pages/[slug].tsx:11`. |
| Exception discipline | 4/4 | 0 custom exception classes and 0 catch-and-rethrow blocks. Boundary catches either present a user-safe failure or preserve public access when auth cookies are stale. |
| **Total** | **17/20** | **Good** |

Tactical tornado risk: **Low**. Only interface documentation scores 2 or lower, and no systemic pass-through or exception pattern remains.

## Findings

### P2 — Public interface documentation is selective

- Location: `src/components/Loading.tsx:3-20`, `src/components/LeftBar.tsx:84-106`, `src/pages/[slug].tsx:52-60`, plus 13 other exported page or component callables.
- Dimension: Interface documentation.
- Count: 16 of 28 exported runtime callables are undocumented.
- Impact: Reusable boundaries are documented, but a new contributor must inspect some component bodies and route loaders to learn their contracts.
- Recommendation: Add comments only when these exports gain non-obvious behavior or become shared outside their current route. Commenting every self-explanatory React component now would add more surface than guidance.

### P3 — Repository URL is repeated

- Location: `src/components/PageLayout.tsx:22` and `src/components/LeftBar.tsx:57`.
- Dimension: Information duplication.
- Count: 2 occurrences of one URL.
- Impact: A repository move needs two edits.
- Recommendation: Move the URL to `src/lib/bork.ts` when it changes or gains another consumer.

### P3 — Favicon path is repeated across runtime and build configuration

- Location: `src/pages/_app.tsx:35`, `src/components/LeftBar.tsx:26`, and `src/proxy.ts:16`.
- Dimension: Information duplication.
- Count: 3 occurrences of one asset path.
- Impact: Renaming the asset requires coordinated edits.
- Recommendation: Keep the proxy matcher literal because Next.js statically analyzes it. If the brand asset changes, update these three references in one change.

## Positive findings

- Profile normalization now lives in `src/lib/profile.ts`; feed and profile routers no longer duplicate metadata rules.
- The 280-character rule and trimming behavior live in `src/lib/bork.ts` and are shared by validation and the composer.
- Authentication is enforced once by `privateProcedure` in `src/server/api/trpc.ts:134-153`.
- Public Supabase reads use the context client instead of repeating REST URLs and headers.
- Missing profile data remains `null` until the presentation boundary; the data layer no longer invents an `anonymous` username.

No P0 or P1 design findings remain.
