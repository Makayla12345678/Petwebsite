# Vet Services Directory — Design Spec
_Date: 2026-04-10_

## Context

The current `vet-services.html` page contains only generic advice about veterinary care. The goal is to replace the body of the page with a real, interactive directory of the 15 best-rated vet clinics in the Greater Toronto Area, giving users a practical place to find and compare local vets.

---

## Page Structure

### 1. Existing page-hero (unchanged)
Keep the current hero section (emoji label, "Veterinary Care" h1, subtitle) exactly as-is.

### 2. Featured banner
A full-width strip using `--color-secondary` (#8290BA) that highlights the #1 best-rated vet in the GTA. Contains:
- A "#1 in the GTA" pink pill badge
- Clinic name (serif, cream)
- One-line tagline
- Large rating score + stars on the right

### 3. Listings section
A `section.section.section--cream` containing:

**Header row** (flex, space-between):
- Left: "GTA Vet Directory" label + "Top-Rated Vets Near You" h2
- Right: "Filters ▾" button (inherits `.btn-pill`)

**Filters dropdown** (absolute-positioned panel below the button):
Four filter groups, each with a label and clickable chips:
- **Rating** — All / 4.5+ / 4.0+ (single-select)
- **Location** — All + one chip per unique neighbourhood (single-select)
- **Animals** — Dogs / Cats / Birds / Exotic / Small Mammals / Reptiles (multi-select, AND logic)
- **Emergency** — All / Yes / No (single-select)
- "Clear all filters" text button at the bottom

Clicking outside the panel closes it. Clicking inside does not.

**Active filter chips strip** — appears below the header when any filter is active. Each chip shows the active filter value and a × to remove just that filter.

**Vet listing** — 15 cards in a single column, sorted by rating descending.

---

## Vet Card Layout (top-to-bottom)

```
┌─────────────────────────────────┐
│  📷  Photo placeholder (grey)    │
├─────────────────────────────────┤
│  Clinic Name                    │
│  📍 Address · Neighbourhood     │
│  [Dogs] [Cats] [Birds]          │
│  🚨 24-hr Emergency (if true)   │
├─────────────────────────────────┤
│  4.9  ★★★★★  (203 reviews)      │
└─────────────────────────────────┘
```

---

## Filter Logic

- All four filter dimensions combine with **AND** logic — adding more filters narrows results
- Rating and neighbourhood filters are single-select (clicking a new option deselects the previous)
- Animals filter is multi-select (chips toggle; all selected animal types must be present on a vet)
- Emergency is single-select
- "Clear all" resets all dimensions to "All" / empty

---

## Data

**`data/vets.js`** — global `const VETS = [...]` array, sorted rating descending. `VETS[0]` is always the featured #1.

Each object shape:
```js
{
  name:          string,   // clinic name
  neighbourhood: string,   // e.g. "The Beaches"
  address:       string,   // full street address
  animals:       string[], // e.g. ["dogs","cats","birds"]
  emergency:     boolean,
  rating:        number,   // e.g. 4.9
  reviews:       number,   // integer
  tagline:       string    // used in featured banner
}
```

15 clinics spanning: The Beaches, Midtown Toronto, Downtown Core, Scarborough, Oakville, Etobicoke, Markham, Brampton, North York, Mississauga, East York, Richmond Hill, Thornhill, Ajax, Pickering.

---

## New Files

| File | Purpose |
|---|---|
| `data/vets.js` | Vet data (15 entries, global `VETS` array) |
| `js/vets.js` | Render cards, build filter panel, handle filtering |

## Modified Files

| File | Change |
|---|---|
| `vet-services.html` | Replace `<main>` body; add two `<script>` tags |
| `css/styles.css` | Append `/* VET DIRECTORY */` section + responsive rules |

---

## Verification

1. All 15 cards render on initial load, no console errors
2. Featured banner shows `VETS[0]` data
3. Filter panel opens/closes correctly; closes on outside click
4. Each filter group works in isolation (rating, location, animals, emergency)
5. AND logic: applying two filters produces a subset of either alone
6. Active chips strip appears when a filter is active; × removes individual filters
7. "Clear all" resets everything and shows all 15 cards
8. Mobile (768px): banner stacks, filter panel slides up from bottom
