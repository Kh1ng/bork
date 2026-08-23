# Render verification

Date: 2026-08-23

## Collaborative preview

- URL: `http://127.0.0.1:3000/`
- Viewport: 1280 × 800 CSS pixels
- Document width: 1280 pixels; no horizontal overflow
- App shell: 1230 pixels wide at x=25
- Left rail: 230 pixels
- Feed lane: 720 pixels
- Right rail: 280 pixels
- Theme colors: text `rgb(232, 242, 250)` on canvas `rgb(3, 16, 32)`
- The direction contract is the first body child and is emitted as a comment. Its helper script has `display: none`.
- The public-feed request reached the designed loading and error states. The configured Supabase Cloudflare tunnel returned error 1033 during this run.
- No `cloudflared` process is running on this machine. Docker is not running, and this repository has no local Supabase configuration to start. Restoring the remote tunnel requires infrastructure outside the repository.

## Responsive implementation

- One-column layout below Tailwind's `md` breakpoint
- Sticky mobile header and fixed three-item bottom navigation below `md`
- Left navigation and contracting feed lane from `md`
- Project rail added at `xl`
- Document minimum width: 320 pixels

## Screenshot limitation

The earlier hidden preview timed out. A fresh visible T3 Code preview succeeded on a later attempt. Its recordings supplied the final frames below; no second browser stack was used.

- Desktop: `.impeccable/review/desktop.png` (1440 × 900)
- Hero reproduction: `.impeccable/review/hero-repro.png` (1440 × 900)
- Mobile: `.impeccable/review/mobile.png` (390 × 844, iPhone 12 Pro preset)

The final frames were captured from the visible T3 tab at a larger native canvas and reduced once with Lanczos filtering. This compensates for T3's device-pixel ratio of 1 while preserving the same CSS viewport composition.

The final desktop capture includes the full left-rail sign-in block. The final mobile capture shows the current Feed destination with a distinct surface and blue icon.
