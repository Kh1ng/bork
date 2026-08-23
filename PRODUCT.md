# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary audience is hiring managers and developers evaluating Colton's work. They should be able to explore a real, working application and quickly understand both his full-stack competence and his personality.

Within the product, Bork is for dog people who want a lightweight social feed built around short posts, profiles, and playful dog-themed language.

## Product Purpose

Bork is a polished interactive portfolio project. It demonstrates that Colton can build, migrate, test, deploy, and maintain a complete web application while giving a familiar social-media exercise a memorable dog-centered identity.

Success means a reviewer can use the application, understand the engineering choices, and remember the developer behind it. Bork must not imply real customer traction or production scale that it does not have.

## Positioning

Bork is a deliberate dog-themed spin on the Twitter clone commonly built by junior developers. The familiar interaction model makes the engineering easy to evaluate; the coherent theme and working product make the project more personal and memorable than a tutorial copy.

## Operating Context

Visitors can browse a public feed without signing in. Authenticated users can publish short "borks," manage a profile, view user and post pages, switch themes, and sign out. Email magic links provide authentication.

The repository also demonstrates automated tests, CI, Vercel deployment, Supabase authentication and persistence, and experience migrating away from earlier database providers.

## Capabilities and Constraints

- Public timeline and individual post pages.
- User profiles and per-user post feeds.
- Email magic-link authentication.
- Authenticated posting and profile editing.
- Dark and light themes.
- Next.js Pages Router, React, TypeScript, tRPC, Supabase, Tailwind CSS, Jest, GitHub Actions, and Vercel.
- This is a focused resume project, not a general-purpose social network. New work should stay proportionate to that purpose.

## Brand Commitments

- Keep the name Bork.
- Keep the dog-first premise and playful vocabulary, including "borks."
- Preserve the existing dog logo/favicon and animated dog loading asset unless the user explicitly replaces them.
- The voice can be playful, but the application must still feel intentional and technically credible.
- Treat Twitter as interaction inspiration, not visual authority.
- Use a polished, familiar social-feed pattern as the visual foundation; express Bork's identity through exceptional craft, dog-centered content, and restrained details rather than a themed interface metaphor.
- Use Bluesky's friendliness and Twitter's feed clarity as craft references without copying either product's branding or feature set.
- Make dark mode the primary visual presentation; light mode remains complete and accessible.

## Evidence on Hand

- A runnable application with source code, tests, CI, and deployment configuration.
- A dog logo at `public/favicon.ico` and animated dog loader at `public/480.gif`.
- Repository history and migration artifacts showing a move from PlanetScale/Railway to Supabase.
- No testimonials, usage metrics, customer claims, or other proof of traction. Future work must not fabricate them.

## Product Principles

1. Make competence visible through working behavior, clear code, and reliable states.
2. Use the familiar Twitter-clone model as context, then make Bork memorable through coherent dog-themed details.
3. Keep the product small enough that every feature can be finished and explained.
4. Prefer honest evidence from the application over portfolio marketing claims.
5. Let personality support usability rather than compete with it.
