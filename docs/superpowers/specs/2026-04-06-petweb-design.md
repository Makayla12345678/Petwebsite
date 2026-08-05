# Pets of GTA — Design Specification
**Date:** 2026-04-06

---

## Overview

Pets of GTA is a plain HTML/CSS/JavaScript website that connects visitors with local animal shelters and provides educational resources on pet care. The site is focused on compassion for animals and generating genuine trust from users. It feels warm, friendly, and inviting while maintaining a clean, elegant aesthetic.

---

## Goals

- Help visitors find local animal shelters with contact information
- Provide trustworthy, informative content across 6 pet care topics
- Feel welcoming and emotionally resonant without being childish or cluttered
- Be easy to maintain with no frameworks or build tools

---

## Color Palette

| Role | Value |
|------|-------|
| Primary blue | `#5D6D9E` |
| Secondary blue (lighter) | `#8290BA` |
| Cream (backgrounds, nav) | `#FAF8F3` |
| Blush pink (accents, CTAs) | `#FFF4F2` |
| Pink border/outline | `#F0DDD9` |
| Body text | `#3D3D3D` |
| Muted text | `#888888` |

---

## Typography

- **Headlines:** Georgia, serif — used for page titles, card headings, logo
- **Body:** System sans-serif — used for all body copy, nav links, labels
- **Accent labels:** Uppercase, letter-spacing 2px, small size — used for section tags and category labels

---

## Design Style

- **Rounded pill buttons** throughout (border-radius: 20px on CTAs)
- **Pill badges** for category tags and announcement strips
- **Cream nav bar** with periwinkle logo and blush pink CTA button
- **Periwinkle hero sections** on every page with blush pink accent elements
- **White content cards** with subtle cream borders on cream backgrounds
- **Serif headings** inside cards for an elegant, trustworthy feel

---

## Architecture

- **Tech stack:** Plain HTML, CSS, vanilla JavaScript — no frameworks, no build tools
- **Shared components:** Nav and footer are written once in `js/components.js` and injected via JavaScript on every page (avoids copy-pasting across 8 files)
- **Shelter data:** Stored as a static array in `data/shelters.js` — manually edited to add/update shelters
- **File structure:**
  ```
  /
  ├── index.html
  ├── shelters.html
  ├── adoption.html
  ├── vet-services.html
  ├── insurance.html
  ├── legislation.html
  ├── nutrition.html
  ├── products.html
  ├── css/
  │   └── styles.css
  ├── js/
  │   ├── components.js   ← shared nav + footer
  │   ├── shelters.js     ← shelter search/filter logic
  │   └── main.js         ← general utilities
  └── data/
      └── shelters.js     ← static shelter data array
  ```

---

## Pages

### 1. Homepage (`index.html`)
- **Cream nav bar** — logo left, nav links centre, pink pill CTA right ("Find a Shelter")
- **Split hero** — periwinkle left panel (headline, subtext, pill CTA), lighter blue right panel (emoji + featured shelter card). The featured shelter is the first entry in `data/shelters.js` — to change it, reorder the array.
- **Topic cards grid** (3×2) — one card per topic, white on cream background, emoji + serif title + short description
- **Latest Tips & Guides** strip — periwinkle background, 3 article preview cards with blush pink category labels. Content is static HTML — manually updated in `index.html`.
- **Footer** — cream background, logo left, copyright centre, Privacy + Contact links right

### 2. Shelter Directory (`shelters.html`)
- **Periwinkle page hero** with search bar and filter pills (All / Dogs / Cats / Small Animals)
- **Search** filters shelter cards in real time by name or city (client-side JS)
- **Filter pills** narrow results by animal type
- **Shelter cards** — emoji icon, shelter name (serif), location + animal types, short description, phone + website, blush pink "Visit →" pill button
- **Data source:** `data/shelters.js` — each shelter entry includes: name, city, state, animals, description, phone, website, emoji

### 3. Topic Pages — shared template (`adoption.html`, `vet-services.html`, `insurance.html`, `legislation.html`, `nutrition.html`, `products.html`)
- **Periwinkle page hero** — category label (pink, uppercase), page title (cream serif), subtitle
- **Intro content block** — white card, serif heading, body text
- **Two-column feature cards** — icon + heading + body text per card
- **CTA strip** — lighter blue background, call to action linking to shelter directory
- Each page is populated with static informational content relevant to its topic

### 4. Products Page (`products.html`)
- Same template as other topic pages
- Product cards include: product name, description, recommended for (dog/cat/etc.), optional "Buy on Amazon →" or similar external link (opens in new tab)
- Links are optional — cards without links display cleanly without a button

---

## Navigation

- **Full nav links:** Shelters, Adoption, Vet Services, and a "More ▾" dropdown (JS click toggle) containing Insurance, Legislation, Nutrition, Products
- **Mobile:** Nav collapses to a hamburger menu (simple JS toggle)
- Active page is indicated with a periwinkle underline on the nav link

---

## Trust Signals

- Serif typography signals credibility and care
- Consistent, calm colour palette (no jarring colours)
- Clear contact info on every shelter card
- "Made with love for animals" footer tagline
- No ads, no popups, no dark patterns

---

## Verification

To verify the site works correctly end-to-end:

1. Open `index.html` in a browser — confirm nav, hero, topic cards, tips strip, and footer render correctly
2. Click each nav link — confirm all 8 pages load with correct titles and content
3. Open `shelters.html` — type a shelter name in the search box and confirm results filter in real time
4. Click a filter pill (e.g. "Cats") — confirm only shelters matching that animal type are shown
5. Resize the browser window below 768px — confirm nav collapses to hamburger menu
6. Check that all "Find a Shelter" CTAs link to `shelters.html`
7. On `products.html`, confirm that product cards with links open in a new tab and cards without links display cleanly
