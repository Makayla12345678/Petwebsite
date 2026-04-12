# Grooming Directory Page — Design Spec

**Date:** 2026-04-11  
**Status:** Approved

---

## Overview

Add a `grooming.html` page listing the best dog/cat groomers in the GTA. The page mirrors the existing `vet-services.html` in structure and UX, with grooming-specific data fields and filters. Shared card and featured-banner rendering logic is extracted into `components.js` so both pages benefit from the same helpers.

---

## Files Changed / Created

| File | Change |
|---|---|
| `grooming.html` | New page, mirrors `vet-services.html` |
| `data/groomers.js` | New — 15 GTA groomer records |
| `js/groomers.js` | New — filter state, render calls, panel wiring |
| `js/components.js` | Extended with shared `buildCard()` and `buildFeaturedBanner()` helpers |
| `css/styles.css` | Add `groomer-card` classes (mirrors `vet-card` classes) |

---

## Page Structure

`grooming.html` follows the same layout as `vet-services.html`:

1. **Page hero** — label `✂️ Grooming`, h1 `Pet Grooming`, short description
2. **Featured banner** — `#1 in the GTA` banner driven by `GROOMERS[0]`
3. **Listings section** — header + Filters button + filter panel + active chips strip + groomer cards grid

---

## Data Shape (`data/groomers.js`)

Each record in the `GROOMERS` array:

```js
{
  name: String,
  neighbourhood: String,
  address: String,
  pets: ["dogs", "cats", "small-mammals", "rabbits"],  // subset
  services: ["bath-brush", "haircut", "nail-trim", "teeth-brushing", "de-shedding"],  // subset
  mobile: Boolean,         // true = mobile groomer (comes to you)
  rating: Number,          // e.g. 4.8
  reviews: Number,         // review count
  tagline: String,
  website: String,
  image: String,           // URL
  imageSource: String      // attribution label
}
```

15 records covering GTA neighbourhoods: The Beaches, Midtown, Etobicoke, North York, Scarborough, Mississauga, Markham, Brampton, Oakville, Richmond Hill, Thornhill, East York, Ajax, Pickering, Downtown Core.

---

## Filter Panel

Five filter groups (same chip UI as vets):

| Group | Options |
|---|---|
| Rating | All / 4.5+ / 4.0+ |
| Location | All + each neighbourhood (sorted) |
| Pet Types | Dogs, Cats, Small Mammals, Rabbits |
| Services | Bath & Brush, Haircut, Nail Trim, Teeth Brushing, De-shedding |
| Mobile Grooming | All / Yes / No |

Active filters render as removable chips in the active chips strip. "Clear all filters" resets all groups.

---

## Shared Component Refactor (`js/components.js`)

Extract two generic helpers used by both vets and groomers:

### `buildCard(item, config)`

Renders a single listing card as an HTML string. `config` specifies:
- `tagsField` — the array field to render as tags (e.g. `"animals"` or `"pets"`)
- `tagLabels` — label map for tag keys
- `badgeField` / `badgeLabel` — field for the emergency/mobile badge (e.g. `mobile` → `"📱 Mobile Grooming"`)
- `bookBtnLabel` — CTA button text (e.g. `"Book Appointment →"` or `"Book Grooming →"`)
- `cardClass` — CSS class for the card root (e.g. `"vet-card"` or `"groomer-card"`)

### `buildFeaturedBanner(item, config)`

Renders the `#1 in the GTA` featured banner. `config` specifies:
- `badgeText` — e.g. `"#1 in the GTA"`
- `starsClass` — e.g. `"vet-featured-banner__stars"` or `"groomer-featured-banner__stars"`

`js/vets.js` and `js/groomers.js` each retain their own filter state and wiring logic, and call these shared helpers.

---

## CSS

Add `groomer-card` and `groomer-featured-banner` class families to `css/styles.css`, mirroring the existing `vet-card` and `vet-featured-banner` rules. No visual changes to the vet page.

---

## Navigation

Add `grooming.html` as a top-level link in the main nav bar in `js/components.js`, alongside Vet Services.

---

## Out of Scope

- No booking/appointment system
- No user reviews or ratings input
- No map integration
- No search-by-keyword
