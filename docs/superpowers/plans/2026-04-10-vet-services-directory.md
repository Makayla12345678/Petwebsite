# Vet Services Directory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic vet-services.html content with an interactive directory of 15 top-rated GTA vet clinics, a featured #1 banner, and a dropdown filter system.

**Architecture:** Data lives in `data/vets.js` as a plain global array (same pattern as `data/shelters.js`). Rendering and filter logic live in `js/vets.js`. All styles are appended to `css/styles.css`. No build step, no framework — pure HTML/CSS/JS.

**Tech Stack:** Vanilla JS, custom CSS (CSS variables), static HTML.

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `data/vets.js` | Global `VETS` array — 15 GTA vet objects, sorted rating desc |
| Create | `js/vets.js` | Render featured banner, render vet cards, build filter panel, handle filtering |
| Modify | `vet-services.html` | Replace `<main>` body; add two `<script>` tags |
| Modify | `css/styles.css` | Append `/* VET DIRECTORY */` section + responsive additions |

---

## Task 1: Create the data file

**Files:**
- Create: `data/vets.js`

- [ ] **Step 1: Create `data/vets.js`** with the following content exactly (global `const VETS`, no `export`, sorted by rating descending so `VETS[0]` is always the #1 featured vet):

```js
const VETS = [
  {
    name: "Beaches Animal Hospital",
    neighbourhood: "The Beaches",
    address: "2132 Queen St E, Toronto, ON",
    animals: ["dogs", "cats", "birds", "small-mammals"],
    emergency: true,
    rating: 4.9,
    reviews: 312,
    tagline: "Compassionate, full-service care steps from the lake."
  },
  {
    name: "Yonge-Eglinton Animal Hospital",
    neighbourhood: "Midtown Toronto",
    address: "2323 Yonge St, Toronto, ON",
    animals: ["dogs", "cats", "exotic", "small-mammals"],
    emergency: false,
    rating: 4.8,
    reviews: 241,
    tagline: "Trusted midtown care for cats, dogs, and exotic companions."
  },
  {
    name: "Downtown Animal Hospital",
    neighbourhood: "Downtown Core",
    address: "736 Bay St, Toronto, ON",
    animals: ["dogs", "cats"],
    emergency: true,
    rating: 4.8,
    reviews: 198,
    tagline: "24-hour emergency and preventive care in the heart of the city."
  },
  {
    name: "North York Vet Group",
    neighbourhood: "North York",
    address: "4261 Bathurst St, North York, ON",
    animals: ["dogs", "cats", "birds", "reptiles"],
    emergency: true,
    rating: 4.7,
    reviews: 175,
    tagline: "Comprehensive care for dogs, cats, birds, and reptiles."
  },
  {
    name: "Oakville Veterinary Centre",
    neighbourhood: "Oakville",
    address: "467 Speers Rd, Oakville, ON",
    animals: ["dogs", "cats", "small-mammals", "exotic"],
    emergency: true,
    rating: 4.7,
    reviews: 163,
    tagline: "Expert family vet care serving Oakville and Burlington."
  },
  {
    name: "Etobicoke Pet Hospital",
    neighbourhood: "Etobicoke",
    address: "1170 The Queensway, Etobicoke, ON",
    animals: ["dogs", "cats", "birds"],
    emergency: false,
    rating: 4.7,
    reviews: 144,
    tagline: "Friendly, affordable vet care on the Queensway."
  },
  {
    name: "Markham Village Animal Hospital",
    neighbourhood: "Markham",
    address: "49 Main St N, Markham, ON",
    animals: ["dogs", "cats", "small-mammals", "reptiles"],
    emergency: true,
    rating: 4.6,
    reviews: 132,
    tagline: "Serving Markham families and their pets for over 20 years."
  },
  {
    name: "East York Pet Care",
    neighbourhood: "East York",
    address: "955 Danforth Ave, Toronto, ON",
    animals: ["dogs", "cats", "exotic", "birds"],
    emergency: true,
    rating: 4.6,
    reviews: 119,
    tagline: "Warm, community-focused care on the Danforth."
  },
  {
    name: "North York Vet Group — Brampton",
    neighbourhood: "Brampton",
    address: "70 Gillingham Dr, Brampton, ON",
    animals: ["dogs", "cats"],
    emergency: false,
    rating: 4.6,
    reviews: 108,
    tagline: "Convenient, caring vet services for Brampton pet owners."
  },
  {
    name: "Mississauga West Animal Hospital",
    neighbourhood: "Mississauga",
    address: "3038 Hurontario St, Mississauga, ON",
    animals: ["dogs", "cats", "small-mammals"],
    emergency: false,
    rating: 4.5,
    reviews: 97,
    tagline: "Quality preventive and wellness care in west Mississauga."
  },
  {
    name: "Richmond Hill Animal Hospital",
    neighbourhood: "Richmond Hill",
    address: "9625 Yonge St, Richmond Hill, ON",
    animals: ["dogs", "cats", "birds", "exotic"],
    emergency: false,
    rating: 4.5,
    reviews: 89,
    tagline: "Full-service care for the whole family — fur, feathers, and scales."
  },
  {
    name: "Scarborough Animal Clinic",
    neighbourhood: "Scarborough",
    address: "3050 Lawrence Ave E, Scarborough, ON",
    animals: ["dogs", "cats", "reptiles", "small-mammals"],
    emergency: false,
    rating: 4.5,
    reviews: 82,
    tagline: "Affordable, attentive care for east-end pet owners."
  },
  {
    name: "Thornhill Veterinary Clinic",
    neighbourhood: "Thornhill",
    address: "7700 Yonge St, Thornhill, ON",
    animals: ["dogs", "cats", "birds", "exotic", "small-mammals"],
    emergency: true,
    rating: 4.4,
    reviews: 74,
    tagline: "Five-species expertise with emergency services available."
  },
  {
    name: "Ajax Animal Hospital",
    neighbourhood: "Ajax",
    address: "280 Westney Rd S, Ajax, ON",
    animals: ["dogs", "cats"],
    emergency: false,
    rating: 4.4,
    reviews: 61,
    tagline: "Friendly neighbourhood care for Durham Region pets."
  },
  {
    name: "Pickering Pet Hospital",
    neighbourhood: "Pickering",
    address: "1899 Brock Rd, Pickering, ON",
    animals: ["dogs", "cats", "reptiles", "birds"],
    emergency: true,
    rating: 4.3,
    reviews: 53,
    tagline: "24-hour emergency care serving Pickering and Ajax."
  }
];
```

- [ ] **Step 2: Verify data in browser console**

Open `vet-services.html` in a browser via a local server. Add `<script src="data/vets.js"></script>` to `vet-services.html` temporarily (or just open the file directly and run in console). Open DevTools console and run:
```
// paste this in console after loading data/vets.js manually
VETS.length         // expected: 15
VETS[0].name        // expected: "Beaches Animal Hospital"
VETS[0].rating      // expected: 4.9
```

- [ ] **Step 3: Commit**

```bash
git add data/vets.js
git commit -m "feat: add GTA vet data (15 clinics, sorted by rating)"
```

---

## Task 2: Rewrite `vet-services.html`

**Files:**
- Modify: `vet-services.html`

- [ ] **Step 1: Replace the entire contents of `<main>` in `vet-services.html`** with the following. Keep `<head>`, `<div id="nav-placeholder">`, and `<div id="footer-placeholder">` untouched. Replace only what is between `<main>` and `</main>`, and update the script tags at the bottom of `<body>`:

```html
  <main>
    <section class="page-hero">
      <p class="label">💉 Vet Services</p>
      <h1>Veterinary Care</h1>
      <p>Your pet deserves quality healthcare. Here's how to find the right vet and keep costs manageable.</p>
    </section>

    <div id="vet-featured-banner" class="vet-featured-banner"></div>

    <section class="section section--cream">
      <div class="vet-listings-header">
        <div>
          <p class="label">GTA Vet Directory</p>
          <h2 class="vet-listings-title">Top-Rated Vets Near You</h2>
        </div>
        <div class="vet-filter-wrapper">
          <button id="vet-filter-toggle" class="btn-pill vet-filter-btn" aria-expanded="false">
            Filters &#9660;
          </button>
          <div id="vet-filter-panel" class="vet-filter-panel" hidden></div>
        </div>
      </div>

      <div id="vet-active-chips" class="vet-active-chips"></div>

      <div id="vets-list" class="vets-list"></div>
    </section>
  </main>
```

And update the script block at the bottom of `<body>` to:
```html
  <div id="footer-placeholder"></div>
  <script src="data/vets.js"></script>
  <script src="js/components.js"></script>
  <script src="js/vets.js"></script>
</body>
```

- [ ] **Step 2: Verify structure loads without errors**

Open `vet-services.html` in the browser. The page should:
- Show the nav and footer (components.js ran)
- Show the page-hero with "Veterinary Care" heading
- Show an empty area below (featured banner + listings not yet rendered — js/vets.js doesn't exist yet)
- No console errors about missing files (data/vets.js is loaded, VETS is defined)

Check DevTools console: `VETS.length` should return `15`.

- [ ] **Step 3: Commit**

```bash
git add vet-services.html
git commit -m "feat: restructure vet-services.html for directory layout"
```

---

## Task 3: Add CSS for all new components

**Files:**
- Modify: `css/styles.css`

- [ ] **Step 1: Append the VET DIRECTORY section to the end of `css/styles.css`**, before the closing of the file (after the last existing rule, before or after any `@media` blocks — add it just before the first `@media` block so responsive rules can override):

```css
/* =====================
   VET DIRECTORY
   ===================== */

/* Featured banner */
.vet-featured-banner {
  background: var(--color-secondary);
  padding: 1.6rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}
.vet-featured-banner__badge {
  display: inline-block;
  background: var(--color-pink);
  color: var(--color-primary);
  border-radius: var(--radius-pill);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.2rem 0.75rem;
  margin-bottom: 0.5rem;
}
.vet-featured-banner__name {
  color: var(--color-cream);
  font-family: var(--font-serif);
  font-size: 1.3rem;
  line-height: 1.2;
}
.vet-featured-banner__tagline {
  color: rgba(250,248,243,0.75);
  font-size: 0.875rem;
  margin-top: 0.3rem;
}
.vet-featured-banner__right {
  text-align: center;
  flex-shrink: 0;
}
.vet-featured-banner__score {
  display: block;
  color: var(--color-cream);
  font-family: var(--font-serif);
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1;
}
.vet-featured-banner__stars {
  display: block;
  color: var(--color-pink);
  font-size: 1rem;
  margin-top: 0.3rem;
  letter-spacing: 0.05em;
}

/* Listings header */
.vet-listings-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.2rem;
}
.vet-listings-title {
  color: var(--color-primary);
  font-family: var(--font-serif);
  font-size: 1.2rem;
  margin-top: 0.3rem;
}

/* Filter button + dropdown wrapper */
.vet-filter-wrapper {
  position: relative;
}
.vet-filter-btn {
  white-space: nowrap;
}

/* Filter panel */
.vet-filter-panel {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: #fff;
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-card);
  box-shadow: 0 4px 16px rgba(93,109,158,0.14);
  padding: 1.2rem;
  min-width: 290px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Filter groups inside panel */
.vet-filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.vet-filter-group__label {
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--color-primary);
}
.vet-filter-group__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

/* Chips */
.vet-chip {
  background: var(--color-cream);
  color: var(--color-text);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-pill);
  font-size: 0.78rem;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  font-family: var(--font-sans);
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  line-height: 1.4;
}
.vet-chip:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
.vet-chip.active {
  background: var(--color-primary);
  color: var(--color-cream);
  border-color: var(--color-primary);
}
.vet-chip:hover:not(.active) {
  background: var(--color-pink);
  color: var(--color-primary);
  border-color: var(--color-pink-border);
}

/* Clear all button inside panel */
.vet-filter-clear {
  font-size: 0.78rem;
  color: var(--color-muted);
  cursor: pointer;
  background: none;
  border: none;
  font-family: var(--font-sans);
  padding: 0;
  text-decoration: underline;
  text-align: left;
}
.vet-filter-clear:hover {
  color: var(--color-primary);
}

/* Active chips strip (shown below listings header when filters active) */
.vet-active-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1rem;
}
.vet-active-chip__remove {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  margin-left: 0.3rem;
  font-size: 0.85rem;
  padding: 0;
  line-height: 1;
  font-family: var(--font-sans);
}

/* Vet card list */
.vets-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Individual vet card */
.vet-card {
  background: #fff;
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.vet-card__photo {
  background: var(--color-card-border);
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted);
  font-size: 0.8rem;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}
.vet-card__body {
  padding: 1.2rem 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.vet-card__name {
  color: var(--color-primary);
  font-family: var(--font-serif);
  font-size: 1.05rem;
  line-height: 1.2;
}
.vet-card__address {
  color: var(--color-muted);
  font-size: 0.8rem;
}
.vet-card__animals {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.2rem;
}
.vet-card__animal-tag {
  background: var(--color-pink);
  color: var(--color-primary);
  border: 1px solid var(--color-pink-border);
  border-radius: var(--radius-pill);
  font-size: 0.72rem;
  padding: 0.15rem 0.55rem;
  font-family: var(--font-sans);
}
.vet-card__emergency {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: #B85C38;
  font-weight: 600;
  margin-top: 0.2rem;
}
.vet-card__rating {
  border-top: 1px solid var(--color-card-border);
  padding: 0.8rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.vet-card__score {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  font-family: var(--font-serif);
  line-height: 1;
}
.vet-card__stars {
  color: #C8952A;
  font-size: 1rem;
  letter-spacing: 0.05em;
}
.vet-card__review-count {
  font-size: 0.78rem;
  color: var(--color-muted);
}

/* No-results message */
.vet-no-results {
  text-align: center;
  color: var(--color-muted);
  padding: 3rem;
  font-size: 0.95rem;
}
```

- [ ] **Step 2: Add responsive rules inside the existing `@media (max-width: 768px)` block** in `styles.css`:

```css
  .vet-featured-banner { flex-direction: column; gap: 0.8rem; padding: 1.2rem 1.5rem; }
  .vet-featured-banner__right { text-align: left; }
  .vet-filter-panel { position: fixed; top: auto; bottom: 0; left: 0; right: 0; border-radius: var(--radius-card) var(--radius-card) 0 0; min-width: unset; }
  .vet-listings-header { flex-direction: column; gap: 0.8rem; }
  .vet-card__photo { height: 140px; }
```

- [ ] **Step 3: Verify CSS loads without errors**

Open `vet-services.html` in the browser. Check DevTools → Console for any CSS parse errors. Check DevTools → Elements and confirm `.vet-featured-banner`, `.vet-card`, `.vet-filter-panel` etc. are present in the stylesheet (Elements → Styles panel, search for any vet class).

- [ ] **Step 4: Commit**

```bash
git add css/styles.css
git commit -m "feat: add VET DIRECTORY styles (banner, cards, filter panel, chips)"
```

---

## Task 4: Create `js/vets.js` — rendering functions

**Files:**
- Create: `js/vets.js`

- [ ] **Step 1: Create `js/vets.js`** with the helper functions and render logic:

```js
/* =====================
   HELPERS
   ===================== */

const ANIMAL_LABELS = {
  dogs: 'Dogs',
  cats: 'Cats',
  birds: 'Birds',
  exotic: 'Exotic',
  'small-mammals': 'Small Mammals',
  reptiles: 'Reptiles'
};

function formatAnimal(key) {
  return ANIMAL_LABELS[key] || key;
}

function starsHTML(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    '<span class="vet-card__stars">' +
    '★'.repeat(full) +
    (half ? '<span style="opacity:0.5">★</span>' : '') +
    '☆'.repeat(empty) +
    '</span>'
  );
}

function featuredStarsHTML(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    '<span class="vet-featured-banner__stars">' +
    '★'.repeat(full) +
    (half ? '<span style="opacity:0.6">★</span>' : '') +
    '☆'.repeat(empty) +
    '</span>'
  );
}

/* =====================
   FEATURED BANNER
   ===================== */

function renderFeaturedBanner() {
  const v = VETS[0];
  document.getElementById('vet-featured-banner').innerHTML =
    '<div class="vet-featured-banner__left">' +
      '<span class="vet-featured-banner__badge">#1 in the GTA</span>' +
      '<h2 class="vet-featured-banner__name">' + v.name + '</h2>' +
      '<p class="vet-featured-banner__tagline">' + v.tagline + '</p>' +
    '</div>' +
    '<div class="vet-featured-banner__right">' +
      '<span class="vet-featured-banner__score">' + v.rating.toFixed(1) + '</span>' +
      featuredStarsHTML(v.rating) +
    '</div>';
}

/* =====================
   VET CARD RENDERING
   ===================== */

function renderVets(list) {
  const container = document.getElementById('vets-list');
  if (list.length === 0) {
    container.innerHTML = '<p class="vet-no-results">No vets match your filters. Try clearing some filters.</p>';
    return;
  }
  container.innerHTML = list.map(function(v) {
    return (
      '<div class="vet-card">' +
        '<div class="vet-card__photo">Photo coming soon</div>' +
        '<div class="vet-card__body">' +
          '<h3 class="vet-card__name">' + v.name + '</h3>' +
          '<p class="vet-card__address">📍 ' + v.address + ' · ' + v.neighbourhood + '</p>' +
          '<div class="vet-card__animals">' +
            v.animals.map(function(a) {
              return '<span class="vet-card__animal-tag">' + formatAnimal(a) + '</span>';
            }).join('') +
          '</div>' +
          (v.emergency ? '<p class="vet-card__emergency">🚨 24-hr Emergency Services</p>' : '') +
        '</div>' +
        '<div class="vet-card__rating">' +
          '<span class="vet-card__score">' + v.rating.toFixed(1) + '</span>' +
          starsHTML(v.rating) +
          '<span class="vet-card__review-count">(' + v.reviews.toLocaleString() + ' reviews)</span>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

/* =====================
   ENTRY POINT (partial — filtering added in next task)
   ===================== */

document.addEventListener('DOMContentLoaded', function() {
  renderFeaturedBanner();
  renderVets(VETS);
});
```

- [ ] **Step 2: Verify rendering in browser**

Open `vet-services.html` in the browser. You should see:
- The secondary-blue featured banner with "Beaches Animal Hospital", rating 4.9, and the tagline
- All 15 vet cards stacked in a single column, each with: grey photo placeholder, clinic name, address + neighbourhood, animal type tags (pink pills), emergency indicator (if applicable), and a rating row with score + stars + review count
- No console errors

- [ ] **Step 3: Commit**

```bash
git add js/vets.js
git commit -m "feat: render featured banner and vet cards from VETS data"
```

---

## Task 5: Add filtering logic to `js/vets.js`

**Files:**
- Modify: `js/vets.js`

- [ ] **Step 1: Add the state object and filter/active-chips functions** by inserting the following block into `js/vets.js` after the rendering section and **before** the `DOMContentLoaded` entry point:

```js
/* =====================
   FILTER STATE
   ===================== */

var activeFilters = {
  rating: 'all',
  neighbourhood: 'all',
  animals: [],
  emergency: 'all'
};

/* =====================
   FILTER LOGIC
   ===================== */

function filterVets() {
  return VETS.filter(function(v) {
    // Rating
    if (activeFilters.rating !== 'all' && v.rating < parseFloat(activeFilters.rating)) return false;
    // Neighbourhood
    if (activeFilters.neighbourhood !== 'all' && v.neighbourhood !== activeFilters.neighbourhood) return false;
    // Animals (AND: every selected animal must be in the vet's list)
    if (activeFilters.animals.length > 0) {
      var ok = activeFilters.animals.every(function(a) { return v.animals.indexOf(a) !== -1; });
      if (!ok) return false;
    }
    // Emergency
    if (activeFilters.emergency === 'yes' && !v.emergency) return false;
    if (activeFilters.emergency === 'no' && v.emergency) return false;
    return true;
  });
}

function applyFilters() {
  renderVets(filterVets());
  renderActiveChips();
}

/* =====================
   ACTIVE CHIPS STRIP
   ===================== */

function renderActiveChips() {
  var container = document.getElementById('vet-active-chips');
  var chips = [];

  if (activeFilters.rating !== 'all') {
    chips.push({ label: 'Rating: ' + activeFilters.rating + '+', key: 'rating' });
  }
  if (activeFilters.neighbourhood !== 'all') {
    chips.push({ label: 'Location: ' + activeFilters.neighbourhood, key: 'neighbourhood' });
  }
  if (activeFilters.animals.length > 0) {
    chips.push({ label: 'Animals: ' + activeFilters.animals.map(formatAnimal).join(', '), key: 'animals' });
  }
  if (activeFilters.emergency !== 'all') {
    chips.push({ label: 'Emergency: ' + (activeFilters.emergency === 'yes' ? 'Yes' : 'No'), key: 'emergency' });
  }

  if (chips.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = chips.map(function(c) {
    return (
      '<span class="vet-chip active">' +
        c.label +
        ' <button class="vet-active-chip__remove" data-remove="' + c.key + '" aria-label="Remove ' + c.label + ' filter">×</button>' +
      '</span>'
    );
  }).join('');

  container.querySelectorAll('.vet-active-chip__remove').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var key = this.dataset.remove;
      if (key === 'rating') activeFilters.rating = 'all';
      if (key === 'neighbourhood') activeFilters.neighbourhood = 'all';
      if (key === 'animals') activeFilters.animals = [];
      if (key === 'emergency') activeFilters.emergency = 'all';
      syncChipUI();
      applyFilters();
    });
  });
}

/* =====================
   FILTER PANEL
   ===================== */

function buildFilterPanel() {
  var neighbourhoods = VETS.map(function(v) { return v.neighbourhood; })
    .filter(function(n, i, arr) { return arr.indexOf(n) === i; });

  var panel = document.getElementById('vet-filter-panel');
  panel.innerHTML =
    // Rating group
    '<div class="vet-filter-group">' +
      '<span class="vet-filter-group__label">Rating</span>' +
      '<div class="vet-filter-group__chips">' +
        makeChip('All', 'all', 'rating', true) +
        makeChip('4.5+', '4.5', 'rating', false) +
        makeChip('4.0+', '4.0', 'rating', false) +
      '</div>' +
    '</div>' +

    // Neighbourhood group
    '<div class="vet-filter-group">' +
      '<span class="vet-filter-group__label">Location</span>' +
      '<div class="vet-filter-group__chips">' +
        makeChip('All', 'all', 'neighbourhood', true) +
        neighbourhoods.map(function(n) { return makeChip(n, n, 'neighbourhood', false); }).join('') +
      '</div>' +
    '</div>' +

    // Animals group (multi-select)
    '<div class="vet-filter-group">' +
      '<span class="vet-filter-group__label">Animal Types</span>' +
      '<div class="vet-filter-group__chips">' +
        ['dogs','cats','birds','exotic','small-mammals','reptiles'].map(function(a) {
          return '<span class="vet-chip" data-filter-animal="' + a + '" role="button" tabindex="0">' + formatAnimal(a) + '</span>';
        }).join('') +
      '</div>' +
    '</div>' +

    // Emergency group
    '<div class="vet-filter-group">' +
      '<span class="vet-filter-group__label">Emergency Services</span>' +
      '<div class="vet-filter-group__chips">' +
        makeChip('All', 'all', 'emergency', true) +
        makeChip('Yes', 'yes', 'emergency', false) +
        makeChip('No', 'no', 'emergency', false) +
      '</div>' +
    '</div>' +

    '<button class="vet-filter-clear" id="vet-filter-clear">Clear all filters</button>';

  wireFilterChips();
}

function makeChip(label, value, filterKey, isActive) {
  return (
    '<span class="vet-chip' + (isActive ? ' active' : '') + '" ' +
    'data-filter-' + filterKey + '="' + value + '" ' +
    'role="button" tabindex="0">' +
    label + '</span>'
  );
}

function wireFilterChips() {
  // Single-select: rating, neighbourhood, emergency
  ['rating', 'neighbourhood', 'emergency'].forEach(function(key) {
    document.querySelectorAll('[data-filter-' + key + ']').forEach(function(chip) {
      chip.addEventListener('click', function() {
        document.querySelectorAll('[data-filter-' + key + ']').forEach(function(c) { c.classList.remove('active'); });
        this.classList.add('active');
        activeFilters[key] = this.dataset['filter' + key.charAt(0).toUpperCase() + key.slice(1)];
        applyFilters();
      });
    });
  });

  // Multi-select: animals
  document.querySelectorAll('[data-filter-animal]').forEach(function(chip) {
    chip.addEventListener('click', function() {
      this.classList.toggle('active');
      activeFilters.animals = Array.from(document.querySelectorAll('[data-filter-animal].active'))
        .map(function(el) { return el.dataset.filterAnimal; });
      applyFilters();
    });
  });

  // Clear all
  document.getElementById('vet-filter-clear').addEventListener('click', resetFilters);
}

function syncChipUI() {
  // Rating
  document.querySelectorAll('[data-filter-rating]').forEach(function(c) {
    c.classList.toggle('active', c.dataset.filterRating === activeFilters.rating);
  });
  // Neighbourhood
  document.querySelectorAll('[data-filter-neighbourhood]').forEach(function(c) {
    c.classList.toggle('active', c.dataset.filterNeighbourhood === activeFilters.neighbourhood);
  });
  // Animals
  document.querySelectorAll('[data-filter-animal]').forEach(function(c) {
    c.classList.toggle('active', activeFilters.animals.indexOf(c.dataset.filterAnimal) !== -1);
  });
  // Emergency
  document.querySelectorAll('[data-filter-emergency]').forEach(function(c) {
    c.classList.toggle('active', c.dataset.filterEmergency === activeFilters.emergency);
  });
}

function resetFilters() {
  activeFilters = { rating: 'all', neighbourhood: 'all', animals: [], emergency: 'all' };
  syncChipUI();
  applyFilters();
}
```

- [ ] **Step 2: Update the `DOMContentLoaded` entry point** at the bottom of `js/vets.js` — replace the existing one with:

```js
document.addEventListener('DOMContentLoaded', function() {
  renderFeaturedBanner();
  buildFilterPanel();
  renderVets(VETS);

  // Filter panel toggle
  var toggleBtn = document.getElementById('vet-filter-toggle');
  var panel = document.getElementById('vet-filter-panel');

  toggleBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    var isOpen = !panel.hidden;
    panel.hidden = isOpen;
    toggleBtn.setAttribute('aria-expanded', String(!isOpen));
  });

  document.addEventListener('click', function() {
    panel.hidden = true;
    toggleBtn.setAttribute('aria-expanded', 'false');
  });

  panel.addEventListener('click', function(e) {
    e.stopPropagation();
  });
});
```

- [ ] **Step 3: Verify filters in browser**

Open `vet-services.html`. Test each of the following:

1. Click "Filters ▾" — panel opens. Click outside — panel closes. Click inside panel — stays open.
2. **Rating filter:** Click "4.5+" — cards with rating < 4.5 disappear (Thornhill 4.4, Ajax 4.4, Pickering 4.3 should vanish). Click "All" — all 15 return.
3. **Location filter:** Click "Scarborough" — only Scarborough Animal Clinic remains visible.
4. **Animals filter (multi-select):** Click "Birds" then "Reptiles" — only vets with both `birds` AND `reptiles` in their array remain (should be: North York Vet Group, Pickering Pet Hospital).
5. **Emergency filter:** Click "Yes" — only clinics where `emergency: true` show (Beaches, Downtown, North York, Oakville, Markham, East York, Thornhill, Pickering = 8 clinics).
6. **AND logic:** With "4.5+" AND "Emergency: Yes" active — should be 5 clinics (Beaches 4.9, Downtown 4.8, North York 4.7, Oakville 4.7, Markham 4.6, East York 4.6 — 6 clinics).
7. **Active chips strip:** With "Rating: 4.5+" active, a chip "Rating: 4.5+ ×" appears. Click × — resets rating only.
8. **Clear all:** Apply 2+ filters, click "Clear all" inside panel — all 15 cards return, all "All" chips become active.

- [ ] **Step 4: Commit**

```bash
git add js/vets.js
git commit -m "feat: add filter panel, filter logic, and active chips strip to vet directory"
```

---

## Task 6: Mobile responsive check

**Files:**
- Possibly modify: `css/styles.css` (fix any responsive issues found)

- [ ] **Step 1: Test at 768px viewport width** (DevTools → Toggle device toolbar, set to 768px wide)

Check:
- Featured banner stacks vertically (name above, score/stars below)
- "Filters ▾" button is full-width or clearly accessible
- When filter panel is open, it appears as a bottom sheet (fixed, slides up from bottom of viewport)
- Cards are readable, single column maintained

- [ ] **Step 2: Test at 375px viewport width** (iPhone SE size)

Check:
- All text is readable
- Animal type tags wrap without overflowing
- Rating row stays on one line or wraps gracefully
- Photo placeholder is visible (should be 140px tall per responsive rule)

- [ ] **Step 3: Fix any issues found**, then commit

```bash
git add css/styles.css
git commit -m "fix: responsive adjustments for vet directory on mobile"
```

(Skip this commit if no fixes were needed.)

---

## Verification Checklist

After all tasks are complete, run through this full check:

- [ ] `VETS.length === 15` in browser console
- [ ] `VETS[0].name === "Beaches Animal Hospital"` (highest rated is featured)
- [ ] Featured banner shows correct name, tagline, rating, and 5 stars
- [ ] All 15 cards render on page load
- [ ] Each card has: grey photo placeholder, name, address, animal tags, emergency indicator (where applicable), rating row
- [ ] "Filters ▾" button in top-right of listings section
- [ ] Filter panel opens/closes correctly, closes on outside click
- [ ] Rating, Location, Emergency filters are single-select
- [ ] Animals filter is multi-select
- [ ] AND logic confirmed (two filters = narrower results)
- [ ] Active chips strip shows current filters with × buttons
- [ ] Individual × buttons remove only that filter dimension
- [ ] "Clear all" resets everything
- [ ] No console errors on page load or during filtering
- [ ] Mobile: banner stacks, filter panel is bottom sheet, cards readable
