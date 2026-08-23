---
name: Bork
description: A dark-first social feed with restrained dog-first personality.
colors:
  dark-canvas: "#031020"
  dark-surface: "#071525"
  dark-surface-raised: "#0c1c2d"
  dark-surface-hover: "#102438"
  dark-text: "#e8f2fa"
  dark-text-muted: "#9cb1c2"
  dark-border: "#21384b"
  dark-accent: "#167ef3"
  dark-accent-hover: "#3596ff"
  dark-danger: "#ff8b8b"
  dark-focus: "#75b8ff"
  light-canvas: "#eef5f9"
  light-surface: "#ffffff"
  light-surface-raised: "#f4f8fb"
  light-surface-hover: "#e9f2f8"
  light-text: "#102334"
  light-text-muted: "#526b7c"
  light-border: "#c6d7e2"
  light-accent: "#086fc8"
  light-accent-hover: "#055ca7"
  light-danger: "#b4232c"
  light-focus: "#086fc8"
typography:
  display:
    fontFamily: 'ui-rounded, "Avenir Next", Avenir, "Segoe UI", sans-serif'
    fontSize: "1.875rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.03em"
    fontFeature: '"kern", "liga"'
  headline:
    fontFamily: 'ui-rounded, "Avenir Next", Avenir, "Segoe UI", sans-serif'
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.333
    letterSpacing: "-0.025em"
    fontFeature: '"kern", "liga"'
  title:
    fontFamily: 'ui-rounded, "Avenir Next", Avenir, "Segoe UI", sans-serif'
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-0.02em"
    fontFeature: '"kern", "liga"'
  body:
    fontFamily: 'ui-rounded, "Avenir Next", Avenir, "Segoe UI", sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: '"kern", "liga"'
  post:
    fontFamily: 'ui-rounded, "Avenir Next", Avenir, "Segoe UI", sans-serif'
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.75
    fontFeature: '"kern", "liga"'
  label:
    fontFamily: 'ui-rounded, "Avenir Next", Avenir, "Segoe UI", sans-serif'
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.25
    fontFeature: '"kern", "liga"'
  control:
    fontFamily: 'ui-rounded, "Avenir Next", Avenir, "Segoe UI", sans-serif'
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.25
    fontFeature: '"kern", "liga"'
  navigation:
    fontFamily: 'ui-rounded, "Avenir Next", Avenir, "Segoe UI", sans-serif'
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.333
    fontFeature: '"kern", "liga"'
  caption:
    fontFamily: 'ui-rounded, "Avenir Next", Avenir, "Segoe UI", sans-serif'
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.333
    fontFeature: '"kern", "liga"'
rounded:
  brand: "8px"
  control: "12px"
  full: "9999px"
spacing:
  step-1: "4px"
  step-2: "8px"
  step-3: "12px"
  step-4: "16px"
  step-5: "20px"
  step-6: "24px"
  step-7: "28px"
  step-8: "32px"
  step-9: "36px"
  step-10: "40px"
  step-12: "48px"
  step-14: "56px"
  step-16: "64px"
  step-20: "80px"
components:
  button-primary:
    backgroundColor: "{colors.dark-accent}"
    textColor: "{colors.light-surface}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0 20px"
  button-primary-hover:
    backgroundColor: "{colors.dark-accent-hover}"
    textColor: "{colors.light-surface}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.dark-text}"
    typography: "{typography.control}"
    rounded: "{rounded.full}"
    padding: "0 16px"
  button-secondary-hover:
    backgroundColor: "{colors.dark-surface-hover}"
    textColor: "{colors.dark-text}"
  input:
    backgroundColor: "{colors.dark-surface-raised}"
    textColor: "{colors.dark-text}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.dark-text-muted}"
    typography: "{typography.navigation}"
    rounded: "{rounded.control}"
    padding: "0 12px"
  nav-link-active:
    backgroundColor: "{colors.dark-surface-hover}"
    textColor: "{colors.dark-text}"
  post-row:
    backgroundColor: "transparent"
    textColor: "{colors.dark-text}"
    padding: "20px 16px"
  post-row-desktop:
    padding: "20px 24px"
  avatar:
    backgroundColor: "{colors.dark-surface-raised}"
    rounded: "{rounded.full}"
    size: "48px"
---

# Design System: Bork

## Overview

**Creative North Star: "Night Rails"**

Night Rails is a familiar social feed drawn as one continuous midnight workspace. A compact navigation rail, a broad reading lane, and a concise project rail share the same canvas. Cool hairlines and small tonal shifts separate regions without turning the page into a stack of cards.

Bork's personality lives in the dog mark, the word "bork," friendly copy, circular portraits, and the animated loading dog. Controls stay recognizable. The result should read first as a finished social product, then as a dog-first project with a point of view.

**Key Characteristics:**

- Dark mode is primary, with a complete light role mapping.
- Desktop uses one continuous three-lane shell; mobile replaces both rails with a header and bottom navigation.
- One filled blue action carries the strongest emphasis.
- Tonal surfaces and cool hairlines provide depth without authored shadows.
- Rounded controls and circular avatars soften an otherwise compact layout.

## Colors

The palette moves through midnight navy, cool blue-gray, and one clear action blue. Light mode preserves the same roles on pale blue-white surfaces.

### Primary

- **Clear Bork Blue** (`dark-accent`, #167ef3; `light-accent`, #086fc8): Filled primary buttons, the composer caret, selection, and active navigation icons.
- **Action Hover Blue** (`dark-accent-hover`, #3596ff; `light-accent-hover`, #055ca7): Hover state for the filled action.
- **Focus Blue** (`dark-focus`, #75b8ff; `light-focus`, #086fc8): The global keyboard outline.
- **Warning Red** (`dark-danger`, #ff8b8b; `light-danger`, #b4232c): Error and destructive messaging only. It is not a decorative accent.

### Neutral

- **Midnight Canvas** (`dark-canvas`, #031020): The dark page ground and continuous shell.
- **Night Surface** (`dark-surface`, #071525): Sticky mobile chrome and local surface fills.
- **Raised Night Surface** (`dark-surface-raised`, #0c1c2d): Composer bands, fields, avatar backing, and toast backgrounds.
- **Hover Night Surface** (`dark-surface-hover`, #102438): Navigation and feed-row hover feedback.
- **Frost Text** (`dark-text`, #e8f2fa) and **Muted Steel** (`dark-text-muted`, #9cb1c2): Primary and supporting dark-mode copy.
- **Cool Hairline** (`dark-border`, #21384b): Rail, row, field, and section boundaries.
- **Pale Canvas** (`light-canvas`, #eef5f9), **White Surface** (`light-surface`, #ffffff), **Raised Pale Surface** (`light-surface-raised`, #f4f8fb), and **Pale Hover** (`light-surface-hover`, #e9f2f8): Light-mode surface roles.
- **Ink Text** (`light-text`, #102334), **Muted Slate** (`light-text-muted`, #526b7c), and **Pale Hairline** (`light-border`, #c6d7e2): Light-mode copy and boundaries.

**The One Blue Action Rule.** Blue may identify state, focus, and links, but only the primary action receives a filled saturated treatment.

**The Role-Pair Rule.** Every dark semantic role has a light counterpart. Theme changes swap role values, not component structure.

## Typography

**Display Font:** ui-rounded, with Avenir Next, Avenir, Segoe UI, and sans-serif fallbacks  
**Body Font:** the same system stack  
**Label Font:** the same system stack

**Character:** Rounded system letterforms keep Bork friendly without making the interface look themed. Weight and tight heading tracking create hierarchy; the body stays plain and readable.

### Hierarchy

- **Display** (800, 30px, 36px line height, -0.03em): The sign-in page title.
- **Headline** (800, 24px, 32px line height, -0.025em): Route titles, profile names, and the Bork wordmark.
- **Title** (700, 20px, 28px line height, -0.02em where used): Project-rail headings and prominent state titles.
- **Body** (400, 16px, 24px line height): Forms, explanatory copy, and general content.
- **Post** (400, 17px, 28px line height, 70ch maximum): Public bork content.
- **Label** (700, 14px, 20px line height): Field labels, buttons, metadata emphasis, and project details.
- **Control** (600, 14px, 20px line height): Secondary buttons and restrained utility actions.
- **Navigation** (600, 15px, 20px line height): Desktop rail destinations.
- **Caption** (600, 12px, 16px line height): Mobile navigation and compact composer guidance.

**The One Family Rule.** Use the rounded system stack for every role. Hierarchy comes from size, weight, line height, and tracking, not a second typeface.

## Layout

The shell centers within a 1230px maximum width. Below 768px, content fills one column with a 64px sticky header, 64px fixed bottom navigation, and 80px bottom clearance. From 768px, a 220px sticky left rail sits beside a feed lane capped at 720px; the mobile chrome disappears. At 1280px, the left rail becomes 230px and a 280px project rail appears. The right rail stays hidden below that breakpoint. The settings form moves to two columns at 640px, while feed source order never changes.

The spacing system uses Tailwind's 4px base step. Dense control gaps use 4px to 12px. Page and row insets use 16px on small screens and 24px from 768px. Section spacing uses 20px to 40px, with 48px to 80px reserved for empty states and centered single-purpose pages.

**The Whole-Rail Collapse Rule.** Do not squeeze desktop rails into narrow sidebars. Remove them as complete units and supply the mobile header and bottom navigation.

**The Reading-Lane Rule.** Keep composer, state messages, and posts in the same 720px lane, separated by hairlines rather than floating cards.

## Elevation & Depth

The application does not author a shadow scale. Canvas, surface, raised surface, hover surface, and 1px borders establish depth. Sticky and fixed chrome uses `z-index: 20`; stacking keeps it available without glass or a shadow. The third-party toast may retain its library shadow, but that shadow is not a system token.

**The Flat-by-Default Rule.** Use tonal layering and cool hairlines at rest. Do not add shadows to feed rows, rails, fields, or cards.

## Shapes

Controls use three recurring silhouettes. The brand link has an 8px corner, navigation links and inputs use 12px corners, and buttons, avatars, profile frames, scrollbar thumbs, and other circular elements use a full pill radius. Borders stay thin. Avatar borders use a mix of 48% accent and the current hairline color.

**The Compact-Round Rule.** Rounded shapes soften controls without turning content regions into bubbles. Feed rows and page sections remain square and continuous.

## Components

### Buttons

- **Primary:** A 40px minimum-height pill with 20px horizontal padding, bold 14px white text, and the current action blue. Disabled buttons use 50% opacity and a not-allowed cursor.
- **Secondary:** A 40px minimum-height transparent pill with a 1px hairline and 16px horizontal padding. Hover fills the current hover surface.
- **Hover and focus:** Color changes use a 150ms standard transition. All keyboard focus uses a 2px focus-blue outline with a 3px offset.
- **Compact icon:** Mobile theme control keeps the secondary treatment at a 36px minimum height and 12px horizontal padding.

### Inputs / Fields

- **Style:** Full width, 12px corners, a 1px hairline, raised-surface fill, and 12px by 16px padding.
- **Focus:** The border changes to action blue. The global 2px focus-visible outline remains present.
- **Disabled:** Opacity drops to 62% and the cursor becomes not-allowed.
- **Composer:** The textarea removes its border and fill inside the raised composer band. It keeps an action-blue caret, 18px copy, a 28px line height, and a 92px minimum height.

### Navigation

- **Desktop links:** 44px minimum height, 12px corners, 12px horizontal padding, a 12px icon gap, and semibold 15px text. Hover and current states use the hover surface; the current icon turns blue.
- **Mobile header:** A sticky 64px surface with the dog mark, wordmark, bottom hairline, and compact theme control.
- **Mobile navigation:** A fixed 64px three-column bar. Each item stacks a 20px line icon above a 12px label. Default links use muted text. The `aria-current="page"` link uses primary text on the hover surface with a blue icon.

### Feed rows and composer

- **Rows:** Flex layout with a 12px gap, a bottom hairline, 20px vertical padding, and 16px horizontal padding that increases to 24px at 768px.
- **Post copy:** 17px with a 28px line height and a 70ch cap. Newlines are preserved.
- **Composer:** Shares the reading lane and uses the raised surface. The footer pairs muted guidance with the filled `BORK` action.
- **New-post motion:** The first row settles for 420ms with `cubic-bezier(0.16, 1, 0.3, 1)`, fading from a 13% accent tint to transparent.

### Avatars and loading

- **Avatars:** Circular images at 48px by default, 42px in account summaries, and 104px on profiles. A 2px mixed accent and hairline border keeps portraits legible in both themes.
- **Loading dog:** The 64px by 32px animated dog is the page and feed loading signature. Small in-button work uses the 16px to 18px circular spinner.

### Feedback and empty states

Errors, empty states, and not-found states use centered text with 24px horizontal padding and 48px to 64px vertical padding. Query failures say the requested content is unavailable instead of claiming a connection problem or an empty result. Public and profile feed failures offer a secondary `Try again` button. Empty feeds keep their quiet-state copy, while missing profiles and posts use separate not-found copy. Toasts use the raised surface, current text, and a 1px hairline.

### Motion and focus behavior

Color transitions use Tailwind's 150ms `cubic-bezier(0.4, 0, 0.2, 1)` default. The spinner rotates for 1s with linear easing. When reduced motion is requested, animations and transitions collapse to 0.01ms, one iteration, and automatic scroll behavior.

## Do's and Don'ts

### Do:

- **Do** keep dark mode as the primary presentation and maintain every light-mode role.
- **Do** reserve the filled blue pill for the strongest action in a region.
- **Do** use hairlines and tonal surfaces to separate rails, composer, posts, forms, and empty states.
- **Do** keep dog personality in the mark, loading asset, portraits, vocabulary, and concise copy.
- **Do** preserve the global 2px focus-visible outline and reduced-motion fallback.
- **Do** give every mobile `aria-current="page"` link primary text, a hover-surface fill, and a blue icon.

### Don't:

- **Don't** add gradients. Every shipped surface is a solid semantic color.
- **Don't** add glass effects, blur, translucent panels, or glow.
- **Don't** wrap feed rows or rail sections in floating rounded cards.
- **Don't** introduce a second saturated action color or use warning red as decoration.
- **Don't** add novelty controls or dog-themed chrome such as paw-shaped buttons.
- **Don't** animate routine content beyond the short first-row settle and ordinary state transitions.
- **Don't** present a query failure as an empty or not-found state.
