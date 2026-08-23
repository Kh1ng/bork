---
version: 1
slug: "src-pages-index-tsx"
primary_target: "src/pages/index.tsx"
related_targets: ["src/components/layout.tsx","src/components/LeftBar.tsx","src/components/feed.tsx","src/components/postview.tsx","src/pages/[slug].tsx","src/pages/post/[id].tsx","src/pages/signin.tsx","src/pages/UserSettingsPage.tsx"]
---

Scope: the shared Bork application shell and its feed, profile, post, sign-in, and settings routes. Mode: Operate.

Audience and job: hiring managers and developers should immediately understand and use a finished full-stack social app; dog people should recognize Bork's personality without learning novelty controls. Visitors read public borks, follow profiles and posts, sign in, publish, edit a profile, and change theme.

Direction: Night Rails, a dark-first polished social feed. Approved comp: `.impeccable/mocks/social-feed-night.webp`. The memorable moment is a new bork joining the same uninterrupted reading lane as the composer. Bluesky friendliness and Twitter feed clarity are the craft bar, not branding sources.

Constraints: Preserve real capabilities only. Do not implement the comp's generated visibility selector, character counter, reply icons, or demo dog photography. Keep the existing dog mark and animated loader. Dark mode is primary; light mode remains complete. Mobile collapses whole rails into a compact header and bottom navigation.

## Fidelity inventory

| Ingredient | Record | Medium |
| --- | --- | --- |
| Page ground | Sampled `#031020`; continuous midnight canvas | CSS |
| Feed plane | Sampled `#020f1d` with raised state near `#071525` | Semantic HTML and CSS |
| Action | Sampled `#167ef3`; only filled saturated control | Native button and CSS |
| Type | Workhorse system sans; compact navigation, 32px route title, 16-18px post copy | Semantic HTML and CSS |
| Left rail | Dog mark, wordmark, route navigation, sign-in or account state | Existing favicon plus semantic HTML and CSS |
| Feed | Integrated composer followed by text posts separated with cool hairlines | Semantic HTML and CSS |
| Right rail | One concise Built by Colton proof note and real stack | Semantic HTML and CSS |
| Portraits | Warm circular avatars; no generated shipping photography | Existing profile URLs and deterministic fallback |
| Motion | One short new-post settle; ordinary hover and focus state elsewhere | CSS with reduced-motion fallback |
| Responsive | Rails collapse as whole units; feed retains source order and full width | CSS media queries |

Unresolved: none. User approved Night Rails and the comp-led path.
