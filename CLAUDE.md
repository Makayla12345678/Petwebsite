# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

PetWeb is a **static, dependency-free website** (HTML + CSS + vanilla JS) — a pet-care resource directory focused on the Greater Toronto Area (GTA). There is no build system, no package manager, no test suite, and no framework. Files are served as-is.

## Running locally

Open any `.html` file directly in a browser, or serve the directory:

```sh
python3 -m http.server 8000     # then visit http://localhost:8000
```

There are no install, build, lint, or test commands. Changes are visible on browser refresh.

## Architecture

### Page composition

Every `.html` page is self-contained but follows the same pattern:

1. `<div id="nav-placeholder"></div>` and `<div id="footer-placeholder"></div>` near the top/bottom of `<body>`.
2. Scripts load in a strict order at the bottom: **data file → `js/components.js` → page-specific JS**. `components.js` must come *before* the page script because the page script calls helpers (`buildCard`, `renderFeaturedBanner`, `buildStars`) defined there.
3. On `DOMContentLoaded`, `components.js` injects the shared nav and footer into the placeholders, marks the active nav link based on `window.location.pathname`, and wires the dropdown + hamburger. Page JS then renders directory content.

### Directory pages (the repeating pattern)

Four pages — **vet-services**, **grooming**, **dog-parks**, **events** — share an identical structural template:

| Concern        | Where it lives                                                          |
| -------------- | ----------------------------------------------------------------------- |
| Data           | `data/<name>.js` — exposes a global `const` array (e.g. `VETS`, `GROOMERS`, `DOG_PARKS`, `EVENTS`) |
| Page logic     | `js/<name>.js` — wrapped in an IIFE; owns `activeFilters` state, filter logic, chip UI, render entrypoint |
| Markup         | `<name>.html` — placeholders for `*-featured-banner`, `*-filter-panel`, `*-active-chips`, list container |
| Shared helpers | `js/components.js` — `buildCard`, `renderFeaturedBanner`, `buildStars` |

The shared `buildCard(item, config)` produces every listing card. To change the card shape *anywhere*, edit `components.js`; per-page differences are passed in via a `*_CARD_CONFIG` object (`cardClass`, `tagsField`, `tagLabels`, `badgeField`/`badgeText`, `bookBtnLabel`, optional `servicesField`/`serviceLabels`). Card images are hot-linked from official sources and display an `imageSource` attribution overlay via `<figcaption class="img-source">`.

CSS for filter chips, active-chips strips, and filter panels is centralized under `.vet-chip`, `.vet-filter-*`, and `.vet-active-chip__remove` — the other directory pages reuse these classes rather than duplicating styles. Keep that in mind when restyling: a change to `.vet-chip` affects all four directories.

Static content pages (`insurance.html`, `legislation.html`, `nutrition.html`, `products.html`) have no data file or page JS — they only need `components.js` for nav/footer injection.

### Adding a new directory entry

1. Append an object to the relevant `data/*.js` array. Match the existing shape exactly — the filter chips are built from `[...new Set(LIST.map(x => x.neighbourhood))]` (or `.city`), so a new neighbourhood automatically gets a chip.
2. For ranked pages (vets, groomers, dog-parks, events), **the first array element is the "#1" featured banner / spotlight item** — order matters.

### Adding a new directory-style page

Copy the triad (`data/X.js`, `js/X.js`, `X.html`) from the closest existing page, then add the page to the nav array in `NAV_HTML` inside `js/components.js`.

### Design tokens

All colors, fonts, radii, and the card shadow are CSS custom properties at the top of `css/styles.css` under `:root`. Prefer these tokens over hard-coded values when adding styles.

## Images

Images are referenced by absolute URL (hot-linked from official sites: brand pages, BlogTO, Wikimedia, etc.) and paired with an `imageSource` string for attribution. Local image assets under `images/` are only used for the favicon and a few directory-specific folders — most listing images are remote URLs.

The `/photos` slash command (defined under the `photos` skill) finds official brand/vet/shelter images and injects them into the site with source attribution. Use it rather than manually hunting for images.

## Conventions worth knowing

- Page JS files are wrapped in `(function() { ... })();` IIFEs to keep their `activeFilters` and helpers off the global scope. The only globals are the data arrays (`VETS`, etc.) and the helpers in `components.js`.
- Filter panels use a uniform pattern: `buildFilterPanel()` renders chips, `wireFilterChips()` attaches listeners, `syncChipUI()` reflects state back into the DOM after a chip is removed from the active strip, `resetFilters()` clears state. When adding a filter, update all four functions plus `activeFilters` and `renderActiveChips()`.
- Click-outside-to-close is wired by adding a `document` click listener that closes the panel; the panel itself calls `stopPropagation()` to avoid self-closing.
- The `.superpowers/`, `.claude/`, `.worktrees/`, and `Icon\r` entries in `.gitignore` are intentional — don't remove them.
