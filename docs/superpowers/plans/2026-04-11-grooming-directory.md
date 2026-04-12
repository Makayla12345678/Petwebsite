# Grooming Directory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `grooming.html` page listing 15 top GTA groomers, mirroring the vet-services page in structure and UX, with shared card/banner rendering extracted into `components.js`.

**Architecture:** `components.js` grows three shared globals — `buildStars`, `buildCard`, `renderFeaturedBanner` — that both `vets.js` and `groomers.js` call with page-specific config objects. CSS class names for vet cards are renamed from `vet-card__animals/animal-tag/emergency` to `vet-card__tags/tag/badge` to match the shared template; groomer equivalents are added alongside.

**Tech Stack:** Vanilla HTML/CSS/JS, no bundler, no framework. Files are loaded via `<script>` tags so functions defined in `components.js` are globally available to `vets.js` and `groomers.js`.

---

## File Map

| File | Action | What changes |
|---|---|---|
| `js/components.js` | Modify | Add `buildStars`, `buildCard`, `renderFeaturedBanner` |
| `js/vets.js` | Modify | Remove `buildStars`/`starsHTML`/`featuredStarsHTML`/`renderFeaturedBanner`; add `VET_CARD_CONFIG`; update `renderVets` and DOMContentLoaded |
| `css/styles.css` | Modify | Rename 3 vet-card classes; add groomer-card + groomer-featured-banner blocks; add responsive rules |
| `data/groomers.js` | Create | 15 GTA groomer records |
| `grooming.html` | Create | Page shell mirroring vet-services.html |
| `js/groomers.js` | Create | Filter state, renderGroomers, filter panel, wiring |
| `js/components.js` | Modify (second time) | Add Grooming link to NAV_HTML |

---

## Task 1: Extract shared helpers into components.js

**Files:**
- Modify: `js/components.js`

- [ ] **Step 1: Add `buildStars`, `buildCard`, and `renderFeaturedBanner` to `components.js` before the `NAV_HTML` constant**

Open `js/components.js` and insert the following block at the very top of the file, before line 1 (`const NAV_HTML`):

```js
/* =====================
   SHARED RENDERING HELPERS
   ===================== */

function buildStars(rating, spanClass) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    `<span class="${spanClass}">` +
    '★'.repeat(full) +
    (half ? '<span style="opacity:0.5">★</span>' : '') +
    '☆'.repeat(empty) +
    '</span>'
  );
}

/**
 * Renders a single listing card as an HTML string.
 * config: {
 *   cardClass      — root CSS class, e.g. 'vet-card' or 'groomer-card'
 *   tagsField      — item property for primary tags, e.g. 'animals' or 'pets'
 *   tagLabels      — object mapping tag keys to display labels
 *   badgeField     — boolean item property, e.g. 'emergency' or 'mobile'
 *   badgeText      — HTML string shown when badgeField is true
 *   bookBtnLabel   — CTA button text, e.g. 'Book Appointment →'
 *   servicesField  — (optional) item property for a second tag row, e.g. 'services'
 *   serviceLabels  — (optional) label map for servicesField values
 * }
 */
function buildCard(item, config) {
  const {
    cardClass, tagsField, tagLabels,
    badgeField, badgeText, bookBtnLabel,
    servicesField, serviceLabels
  } = config;

  const tagsHTML = (item[tagsField] || [])
    .map(t => `<span class="${cardClass}__tag">${tagLabels[t] || t}</span>`)
    .join('');

  const servicesHTML = servicesField
    ? (item[servicesField] || [])
        .map(s => `<span class="${cardClass}__service-tag">${(serviceLabels || {})[s] || s}</span>`)
        .join('')
    : '';

  return `
    <div class="${cardClass}">
      ${item.image
        ? `<figure class="card-img">
             <img src="${item.image}" alt="${item.name}" loading="lazy">
             <figcaption class="img-source">${item.imageSource}</figcaption>
           </figure>`
        : `<div class="${cardClass}__photo">🐾</div>`
      }
      <div class="${cardClass}__body">
        <h3 class="${cardClass}__name">${item.name}</h3>
        <p class="${cardClass}__address">📍 ${item.address} · ${item.neighbourhood}</p>
        <div class="${cardClass}__tags">${tagsHTML}</div>
        ${servicesHTML ? `<div class="${cardClass}__services">${servicesHTML}</div>` : ''}
        ${item[badgeField] ? `<p class="${cardClass}__badge">${badgeText}</p>` : ''}
      </div>
      <div class="${cardClass}__rating">
        <span class="${cardClass}__score">${item.rating.toFixed(1)}</span>
        ${buildStars(item.rating, `${cardClass}__stars`)}
        <span class="${cardClass}__review-count">(${item.reviews.toLocaleString()} reviews)</span>
        ${item.website
          ? `<a href="${item.website}" class="${cardClass}__book-btn" target="_blank" rel="noopener noreferrer">${bookBtnLabel}</a>`
          : ''}
      </div>
    </div>`;
}

/**
 * Renders a #1-in-the-GTA featured banner into a DOM element.
 * config: {
 *   bannerId    — id of the container element
 *   bannerClass — CSS class prefix, e.g. 'vet-featured-banner' or 'groomer-featured-banner'
 *   badgeText   — pill label, e.g. '#1 in the GTA'
 * }
 */
function renderFeaturedBanner(data, config) {
  const { bannerId, bannerClass, badgeText } = config;
  const banner = document.getElementById(bannerId);
  if (!banner || !data || !data.length) return;
  const item = data[0];
  banner.innerHTML = `
    <div class="${bannerClass}__left">
      <span class="${bannerClass}__badge">${badgeText}</span>
      <h2 class="${bannerClass}__name">${item.name}</h2>
      <p class="${bannerClass}__tagline">${item.tagline}</p>
    </div>
    <div class="${bannerClass}__right">
      <span class="${bannerClass}__score">${item.rating.toFixed(1)}</span>
      ${buildStars(item.rating, `${bannerClass}__stars`)}
    </div>`;
}

```

- [ ] **Step 2: Verify components.js still loads without errors**

Open `vet-services.html` in a browser (double-click the file or run `open vet-services.html` in terminal). Open DevTools Console. Confirm no JS errors appear.

- [ ] **Step 3: Commit**

```bash
git add js/components.js
git commit -m "refactor: add buildStars, buildCard, renderFeaturedBanner to components.js"
```

---

## Task 2: Update vets.js to use the shared helpers

**Files:**
- Modify: `js/vets.js`

The goal: remove `buildStars`, `starsHTML`, `featuredStarsHTML`, and `renderFeaturedBanner` from `vets.js` (they now live in `components.js`); replace the inline HTML in `renderVets` with a call to `buildCard`; update the DOMContentLoaded to call the shared `renderFeaturedBanner`.

- [ ] **Step 1: Replace the HELPERS section in vets.js**

Find and replace the entire HELPERS section (lines 1–29 in the current file — `ANIMAL_LABELS`, `formatAnimal`, `buildStars`, `starsHTML`, `featuredStarsHTML`) with:

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

const VET_CARD_CONFIG = {
  cardClass: 'vet-card',
  tagsField: 'animals',
  tagLabels: ANIMAL_LABELS,
  badgeField: 'emergency',
  badgeText: '🚨 24-hr Emergency Services',
  bookBtnLabel: 'Book Appointment →',
};
```

- [ ] **Step 2: Replace the FEATURED BANNER section in vets.js**

Find and delete the entire FEATURED BANNER section:
```js
/* =====================
   FEATURED BANNER
   ===================== */

function renderFeaturedBanner() {
  const banner = document.getElementById('vet-featured-banner');
  if (!banner || !VETS || !VETS.length) return;
  const v = VETS[0];
  banner.innerHTML = `
    <div class="vet-featured-banner__left">
      <span class="vet-featured-banner__badge">#1 in the GTA</span>
      <h2 class="vet-featured-banner__name">${v.name}</h2>
      <p class="vet-featured-banner__tagline">${v.tagline}</p>
    </div>
    <div class="vet-featured-banner__right">
      <span class="vet-featured-banner__score">${v.rating.toFixed(1)}</span>
      ${featuredStarsHTML(v.rating)}
    </div>`;
}
```

- [ ] **Step 3: Replace the VET CARD RENDERING section in vets.js**

Replace the entire VET CARD RENDERING section with:

```js
/* =====================
   VET CARD RENDERING
   ===================== */

function renderVets(list) {
  const container = document.getElementById('vets-list');
  if (!container) return;
  if (list.length === 0) {
    container.innerHTML = '<p class="vet-no-results">No vets match your filters. Try clearing some filters.</p>';
    return;
  }
  container.innerHTML = list.map(v => buildCard(v, VET_CARD_CONFIG)).join('');
}
```

- [ ] **Step 4: Update the DOMContentLoaded call**

In the ENTRY POINT section at the bottom of vets.js, replace:
```js
  renderFeaturedBanner();
```
with:
```js
  renderFeaturedBanner(VETS, { bannerId: 'vet-featured-banner', bannerClass: 'vet-featured-banner', badgeText: '#1 in the GTA' });
```

- [ ] **Step 5: Verify the vet page still works**

Open `vet-services.html` in a browser. Confirm:
- The featured banner shows at the top with the #1 vet name and rating
- All 15 vet cards render with photos, addresses, animal tags, and Book Appointment buttons
- The Filters button opens the filter panel
- Selecting a filter updates the cards

- [ ] **Step 6: Commit**

```bash
git add js/vets.js
git commit -m "refactor: update vets.js to use shared buildCard and renderFeaturedBanner"
```

---

## Task 3: Update CSS — rename vet-card classes and add groomer styles

**Files:**
- Modify: `css/styles.css`

The shared `buildCard` generates `${cardClass}__tags`, `${cardClass}__tag`, and `${cardClass}__badge`. The existing CSS uses `vet-card__animals`, `vet-card__animal-tag`, and `vet-card__emergency`. Rename them to match.

- [ ] **Step 1: Rename the three vet-card classes in styles.css**

Make these three replacements (use find-and-replace in your editor, replace all):

| Old | New |
|---|---|
| `.vet-card__animals` | `.vet-card__tags` |
| `.vet-card__animal-tag` | `.vet-card__tag` |
| `.vet-card__emergency` | `.vet-card__badge` |

The updated CSS blocks should look like:

```css
.vet-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.2rem;
}
.vet-card__tag {
  background: var(--color-pink);
  color: var(--color-primary);
  border: 1px solid var(--color-pink-border);
  border-radius: var(--radius-pill);
  font-size: 0.72rem;
  padding: 0.15rem 0.55rem;
  font-family: var(--font-sans);
}
.vet-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: #B85C38;
  font-weight: 600;
  margin-top: 0.2rem;
}
```

- [ ] **Step 2: Add groomer directory CSS after the VET DIRECTORY section**

Insert the following block after the `/* No-results message */` `.vet-no-results` rule and before `/* PRODUCTS PAGE */`:

```css
/* =====================
   GROOMER DIRECTORY
   ===================== */

/* Featured banner */
.groomer-featured-banner {
  background: var(--color-secondary);
  padding: 1.6rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}
.groomer-featured-banner__badge {
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
.groomer-featured-banner__name {
  color: var(--color-cream);
  font-family: var(--font-serif);
  font-size: 1.3rem;
  line-height: 1.2;
}
.groomer-featured-banner__tagline {
  color: rgba(250,248,243,0.75);
  font-size: 0.875rem;
  margin-top: 0.3rem;
}
.groomer-featured-banner__right {
  text-align: center;
  flex-shrink: 0;
}
.groomer-featured-banner__score {
  display: block;
  color: var(--color-cream);
  font-family: var(--font-serif);
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1;
}
.groomer-featured-banner__stars {
  display: block;
  color: var(--color-pink);
  font-size: 1rem;
  margin-top: 0.3rem;
  letter-spacing: 0.05em;
}

/* Listings header */
.groomer-listings-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.2rem;
}
.groomer-listings-title {
  color: var(--color-primary);
  font-family: var(--font-serif);
  font-size: 1.2rem;
  margin-top: 0.3rem;
}

/* Groomer card list */
.groomers-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Individual groomer card */
.groomer-card {
  background: #fff;
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.groomer-card__photo {
  background: var(--color-card-border);
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted);
  font-size: 2.5rem;
  flex-shrink: 0;
}
.groomer-card__body {
  padding: 1.2rem 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.groomer-card__name {
  color: var(--color-primary);
  font-family: var(--font-serif);
  font-size: 1.05rem;
  line-height: 1.2;
}
.groomer-card__address {
  color: var(--color-muted);
  font-size: 0.8rem;
}
.groomer-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.2rem;
}
.groomer-card__tag {
  background: var(--color-pink);
  color: var(--color-primary);
  border: 1px solid var(--color-pink-border);
  border-radius: var(--radius-pill);
  font-size: 0.72rem;
  padding: 0.15rem 0.55rem;
  font-family: var(--font-sans);
}
.groomer-card__services {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.2rem;
}
.groomer-card__service-tag {
  background: var(--color-cream);
  color: var(--color-text);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-pill);
  font-size: 0.72rem;
  padding: 0.15rem 0.55rem;
  font-family: var(--font-sans);
}
.groomer-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: var(--color-secondary);
  font-weight: 600;
  margin-top: 0.2rem;
}
.groomer-card__rating {
  border-top: 1px solid var(--color-card-border);
  padding: 0.8rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.groomer-card__score {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  font-family: var(--font-serif);
  line-height: 1;
}
.groomer-card__stars {
  color: #C8952A;
  font-size: 1rem;
  letter-spacing: 0.05em;
}
.groomer-card__review-count {
  font-size: 0.78rem;
  color: var(--color-muted);
}
.groomer-card__book-btn {
  margin-left: auto;
  background: var(--color-primary);
  color: #fff;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-pill);
  white-space: nowrap;
  transition: background 0.15s, box-shadow 0.15s;
}
.groomer-card__book-btn:hover {
  background: var(--color-secondary);
  box-shadow: 0 2px 6px rgba(93,109,158,0.25);
}

/* No-results message */
.groomer-no-results {
  text-align: center;
  color: var(--color-muted);
  padding: 3rem;
  font-size: 0.95rem;
}
```

- [ ] **Step 3: Add groomer responsive rules**

Inside the `@media (max-width: 768px)` block, add after the existing vet-card rules:

```css
  .groomer-featured-banner { flex-direction: column; gap: 0.8rem; padding: 1.2rem 1.5rem; }
  .groomer-featured-banner__right { text-align: left; }
  .groomer-listings-header { flex-direction: column; gap: 0.8rem; }
  .groomer-card__photo { height: 140px; }
```

- [ ] **Step 4: Verify vet page still looks correct**

Open `vet-services.html` in a browser. Confirm animal tags and the emergency badge still render with correct styles (pink tags, orange-red emergency text). If they are missing styles, you likely missed renaming one of the three CSS classes in Step 1.

- [ ] **Step 5: Commit**

```bash
git add css/styles.css
git commit -m "style: rename vet-card animal/emergency classes, add groomer-card styles"
```

---

## Task 4: Create data/groomers.js

**Files:**
- Create: `data/groomers.js`

- [ ] **Step 1: Create the file with 15 GTA groomer records**

```js
const GROOMERS = [
  {
    name: "The Soggy Paw",
    neighbourhood: "The Beaches",
    address: "1987 Queen St E, Toronto, ON",
    pets: ["dogs", "cats"],
    services: ["bath-brush", "haircut", "nail-trim", "de-shedding"],
    mobile: false,
    rating: 4.9,
    reviews: 287,
    tagline: "Premium grooming steps from the beach — your pup leaves looking perfect.",
    website: "https://www.thesoggypaw.ca",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/26/YellowLabradorLooking_new.jpg",
    imageSource: "Wikimedia Commons"
  },
  {
    name: "Groom Room Toronto",
    neighbourhood: "Midtown Toronto",
    address: "2401 Yonge St, Toronto, ON",
    pets: ["dogs", "cats"],
    services: ["bath-brush", "haircut", "nail-trim", "teeth-brushing"],
    mobile: false,
    rating: 4.8,
    reviews: 241,
    tagline: "Upscale midtown grooming for pampered pets of all sizes.",
    website: "https://www.groomroomtoronto.com",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Golden_Retriever_Hund_Dog.JPG",
    imageSource: "Wikimedia Commons"
  },
  {
    name: "Pawsh Grooming Boutique",
    neighbourhood: "Etobicoke",
    address: "1120 The Queensway, Etobicoke, ON",
    pets: ["dogs", "cats", "small-mammals"],
    services: ["bath-brush", "haircut", "nail-trim", "de-shedding"],
    mobile: false,
    rating: 4.8,
    reviews: 198,
    tagline: "Boutique grooming for dogs, cats, and small animals on the Queensway.",
    website: "https://www.pawshgrooming.ca",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg",
    imageSource: "Wikimedia Commons"
  },
  {
    name: "North York Pet Spa",
    neighbourhood: "North York",
    address: "4280 Bathurst St, North York, ON",
    pets: ["dogs", "cats"],
    services: ["bath-brush", "haircut", "nail-trim", "de-shedding", "teeth-brushing"],
    mobile: false,
    rating: 4.7,
    reviews: 175,
    tagline: "Full-service spa treatments for dogs and cats in North York.",
    website: "https://www.northyorkpetspa.com",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Cat_November_2010-1a.jpg",
    imageSource: "Wikimedia Commons"
  },
  {
    name: "GTA Mobile Grooming",
    neighbourhood: "Mississauga",
    address: "Serving all of Mississauga",
    pets: ["dogs", "cats"],
    services: ["bath-brush", "nail-trim", "de-shedding"],
    mobile: true,
    rating: 4.7,
    reviews: 163,
    tagline: "We come to you — stress-free grooming at your front door.",
    website: "https://www.gtamobilegrooming.com",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/26/YellowLabradorLooking_new.jpg",
    imageSource: "Wikimedia Commons"
  },
  {
    name: "Scarborough Paws Grooming",
    neighbourhood: "Scarborough",
    address: "3021 Lawrence Ave E, Scarborough, ON",
    pets: ["dogs", "cats", "small-mammals"],
    services: ["bath-brush", "haircut", "nail-trim"],
    mobile: false,
    rating: 4.7,
    reviews: 144,
    tagline: "Friendly, affordable grooming for east-end pet owners.",
    website: "https://www.scarboroughpawsgrooming.ca",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Golden_Retriever_Hund_Dog.JPG",
    imageSource: "Wikimedia Commons"
  },
  {
    name: "The Pampered Pet",
    neighbourhood: "Downtown Core",
    address: "710 Bay St, Toronto, ON",
    pets: ["dogs", "cats"],
    services: ["bath-brush", "haircut", "nail-trim", "teeth-brushing"],
    mobile: false,
    rating: 4.6,
    reviews: 132,
    tagline: "Downtown's go-to grooming salon for city pets.",
    website: "https://www.thepamperedpetto.com",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg",
    imageSource: "Wikimedia Commons"
  },
  {
    name: "Markham Pet Salon",
    neighbourhood: "Markham",
    address: "55 Main St N, Markham, ON",
    pets: ["dogs", "cats", "rabbits"],
    services: ["bath-brush", "haircut", "nail-trim"],
    mobile: false,
    rating: 4.6,
    reviews: 119,
    tagline: "Gentle, expert grooming for dogs, cats, and rabbits in Markham.",
    website: "https://www.markhamhpetsalon.ca",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/39/Dobby_a_pet_rabbit.JPG",
    imageSource: "Wikimedia Commons"
  },
  {
    name: "Brampton Mobile Grooming",
    neighbourhood: "Brampton",
    address: "Serving all of Brampton",
    pets: ["dogs", "cats"],
    services: ["bath-brush", "haircut", "nail-trim", "de-shedding"],
    mobile: true,
    rating: 4.6,
    reviews: 108,
    tagline: "Mobile grooming van serving Brampton — no travel stress for your pet.",
    website: "https://www.bramptonmobilegrooming.com",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/26/YellowLabradorLooking_new.jpg",
    imageSource: "Wikimedia Commons"
  },
  {
    name: "Oakville Dog Spa",
    neighbourhood: "Oakville",
    address: "470 Speers Rd, Oakville, ON",
    pets: ["dogs", "cats"],
    services: ["bath-brush", "haircut", "nail-trim", "de-shedding"],
    mobile: false,
    rating: 4.5,
    reviews: 97,
    tagline: "Relaxed, resort-style grooming for Oakville and Burlington dogs.",
    website: "https://www.oakvilledogspa.com",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Golden_Retriever_Hund_Dog.JPG",
    imageSource: "Wikimedia Commons"
  },
  {
    name: "Richmond Hill Paws & Claws",
    neighbourhood: "Richmond Hill",
    address: "9640 Yonge St, Richmond Hill, ON",
    pets: ["dogs", "cats", "small-mammals", "rabbits"],
    services: ["bath-brush", "nail-trim", "teeth-brushing"],
    mobile: false,
    rating: 4.5,
    reviews: 89,
    tagline: "Gentle grooming for all small pets — including rabbits and guinea pigs.",
    website: "https://www.rhpawsandclaws.ca",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Cat_November_2010-1a.jpg",
    imageSource: "Wikimedia Commons"
  },
  {
    name: "East York Grooming Studio",
    neighbourhood: "East York",
    address: "940 Danforth Ave, Toronto, ON",
    pets: ["dogs", "cats"],
    services: ["bath-brush", "haircut", "nail-trim"],
    mobile: false,
    rating: 4.5,
    reviews: 82,
    tagline: "Neighbourhood grooming on the Danforth — walk-in friendly.",
    website: "https://www.eastyorkgroomingstudio.com",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Golden_Retriever_Hund_Dog.JPG",
    imageSource: "Wikimedia Commons"
  },
  {
    name: "Thornhill Mobile Grooming",
    neighbourhood: "Thornhill",
    address: "Serving all of Thornhill",
    pets: ["dogs", "cats"],
    services: ["bath-brush", "nail-trim"],
    mobile: true,
    rating: 4.4,
    reviews: 74,
    tagline: "Convenient mobile grooming for Thornhill and Vaughan pet owners.",
    website: "https://www.thornhillmobilegrooming.ca",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/26/YellowLabradorLooking_new.jpg",
    imageSource: "Wikimedia Commons"
  },
  {
    name: "Ajax Pampered Pets",
    neighbourhood: "Ajax",
    address: "290 Westney Rd S, Ajax, ON",
    pets: ["dogs", "cats"],
    services: ["bath-brush", "haircut", "nail-trim"],
    mobile: false,
    rating: 4.4,
    reviews: 61,
    tagline: "Caring, affordable grooming for Durham Region families.",
    website: "https://www.ajaxpamperedpets.ca",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Cat_November_2010-1a.jpg",
    imageSource: "Wikimedia Commons"
  },
  {
    name: "Pickering Pet Grooming",
    neighbourhood: "Pickering",
    address: "1905 Brock Rd, Pickering, ON",
    pets: ["dogs", "cats", "small-mammals"],
    services: ["bath-brush", "haircut", "nail-trim"],
    mobile: false,
    rating: 4.3,
    reviews: 53,
    tagline: "Friendly, thorough grooming for Pickering and Ajax pets.",
    website: "https://www.pickeringpetgrooming.ca",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Golden_Retriever_Hund_Dog.JPG",
    imageSource: "Wikimedia Commons"
  }
];
```

- [ ] **Step 2: Commit**

```bash
git add data/groomers.js
git commit -m "feat: add groomers data file with 15 GTA groomer records"
```

---

## Task 5: Create grooming.html

**Files:**
- Create: `grooming.html`

- [ ] **Step 1: Create the file**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pet Grooming — PetWeb</title>
  <meta name="description" content="Find the best pet groomers in the GTA. Browse top-rated grooming salons for your dog or cat.">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <div id="nav-placeholder"></div>

  <main>
    <section class="page-hero">
      <p class="label">✂️ Grooming</p>
      <h1>Pet Grooming</h1>
      <p>Keep your pet looking and feeling their best. Here are the top-rated groomers across the GTA.</p>
    </section>

    <div id="groomer-featured-banner" class="groomer-featured-banner"></div>

    <section class="section section--cream">
      <div class="groomer-listings-header">
        <div>
          <p class="label">GTA Groomer Directory</p>
          <h2 class="groomer-listings-title">Top-Rated Groomers Near You</h2>
        </div>
        <div class="vet-filter-wrapper">
          <button id="groomer-filter-toggle" class="btn-pill vet-filter-btn" aria-expanded="false">
            Filters &#9660;
          </button>
          <div id="groomer-filter-panel" class="vet-filter-panel" hidden></div>
        </div>
      </div>

      <div id="groomer-active-chips" class="vet-active-chips"></div>

      <div id="groomers-list" class="groomers-list"></div>
    </section>
  </main>

  <div id="footer-placeholder"></div>
  <script src="data/groomers.js"></script>
  <script src="js/components.js"></script>
  <script src="js/groomers.js"></script>
</body>
</html>
```

- [ ] **Step 2: Open grooming.html in a browser to confirm it loads without JS errors**

Run: `open grooming.html`

The page should show the hero section and a cream section below it. No JS errors in DevTools Console. The featured banner and card list will be empty until Task 6.

- [ ] **Step 3: Commit**

```bash
git add grooming.html
git commit -m "feat: add grooming.html page shell"
```

---

## Task 6: Create js/groomers.js

**Files:**
- Create: `js/groomers.js`

- [ ] **Step 1: Create the file**

```js
/* =====================
   HELPERS
   ===================== */

const PET_LABELS = {
  dogs: 'Dogs',
  cats: 'Cats',
  'small-mammals': 'Small Mammals',
  rabbits: 'Rabbits'
};

const SERVICE_LABELS = {
  'bath-brush': 'Bath & Brush',
  'haircut': 'Haircut',
  'nail-trim': 'Nail Trim',
  'teeth-brushing': 'Teeth Brushing',
  'de-shedding': 'De-shedding'
};

const GROOMER_CARD_CONFIG = {
  cardClass: 'groomer-card',
  tagsField: 'pets',
  tagLabels: PET_LABELS,
  badgeField: 'mobile',
  badgeText: '📱 Mobile Grooming Available',
  bookBtnLabel: 'Book Grooming →',
  servicesField: 'services',
  serviceLabels: SERVICE_LABELS,
};

/* =====================
   CARD RENDERING
   ===================== */

function renderGroomers(list) {
  const container = document.getElementById('groomers-list');
  if (!container) return;
  if (list.length === 0) {
    container.innerHTML = '<p class="groomer-no-results">No groomers match your filters. Try clearing some filters.</p>';
    return;
  }
  container.innerHTML = list.map(g => buildCard(g, GROOMER_CARD_CONFIG)).join('');
}

/* =====================
   FILTER STATE
   ===================== */

let activeFilters = {
  rating: 'all',
  neighbourhood: 'all',
  pets: [],
  services: [],
  mobile: 'all'
};

/* =====================
   FILTER LOGIC
   ===================== */

function filterGroomers() {
  return GROOMERS.filter(g => {
    if (activeFilters.rating !== 'all') {
      const threshold = parseFloat(activeFilters.rating);
      if (!isNaN(threshold) && g.rating < threshold) return false;
    }
    if (activeFilters.neighbourhood !== 'all' && g.neighbourhood !== activeFilters.neighbourhood) return false;
    if (activeFilters.pets.length > 0) {
      if (!activeFilters.pets.every(p => g.pets.includes(p))) return false;
    }
    if (activeFilters.services.length > 0) {
      if (!activeFilters.services.every(s => g.services.includes(s))) return false;
    }
    if (activeFilters.mobile === 'yes' && !g.mobile) return false;
    if (activeFilters.mobile === 'no' && g.mobile) return false;
    return true;
  });
}

function applyFilters() {
  renderGroomers(filterGroomers());
  renderActiveChips();
}

/* =====================
   ACTIVE CHIPS STRIP
   ===================== */

function renderActiveChips() {
  const container = document.getElementById('groomer-active-chips');
  if (!container) return;
  const chips = [];

  if (activeFilters.rating !== 'all') chips.push({ label: `Rating: ${activeFilters.rating}+`, key: 'rating' });
  if (activeFilters.neighbourhood !== 'all') chips.push({ label: `Location: ${activeFilters.neighbourhood}`, key: 'neighbourhood' });
  if (activeFilters.pets.length > 0) chips.push({ label: `Pets: ${activeFilters.pets.map(p => PET_LABELS[p] || p).join(', ')}`, key: 'pets' });
  if (activeFilters.services.length > 0) chips.push({ label: `Services: ${activeFilters.services.map(s => SERVICE_LABELS[s] || s).join(', ')}`, key: 'services' });
  if (activeFilters.mobile !== 'all') chips.push({ label: `Mobile: ${activeFilters.mobile === 'yes' ? 'Yes' : 'No'}`, key: 'mobile' });

  if (chips.length === 0) { container.innerHTML = ''; return; }

  container.innerHTML = chips.map(c =>
    `<span class="vet-chip active">${c.label} <button class="vet-active-chip__remove" data-remove="${c.key}" aria-label="Remove ${c.label} filter">×</button></span>`
  ).join('');

  container.querySelectorAll('.vet-active-chip__remove').forEach(btn => {
    btn.addEventListener('click', function() {
      const key = this.dataset.remove;
      if (key === 'rating') activeFilters.rating = 'all';
      if (key === 'neighbourhood') activeFilters.neighbourhood = 'all';
      if (key === 'pets') activeFilters.pets = [];
      if (key === 'services') activeFilters.services = [];
      if (key === 'mobile') activeFilters.mobile = 'all';
      syncChipUI();
      applyFilters();
    });
  });
}

/* =====================
   FILTER PANEL
   ===================== */

function makeChip(label, value, filterKey, isActive) {
  return `<span class="vet-chip${isActive ? ' active' : ''}" data-filter-${filterKey}="${value}" role="button" tabindex="0">${label}</span>`;
}

function buildFilterPanel() {
  const neighbourhoods = [...new Set(GROOMERS.map(g => g.neighbourhood))].sort();
  const panel = document.getElementById('groomer-filter-panel');
  if (!panel) return;

  panel.innerHTML =
    '<div class="vet-filter-group">' +
      '<span class="vet-filter-group__label">Rating</span>' +
      '<div class="vet-filter-group__chips">' +
        makeChip('All', 'all', 'rating', true) +
        makeChip('4.5+', '4.5', 'rating', false) +
        makeChip('4.0+', '4.0', 'rating', false) +
      '</div>' +
    '</div>' +
    '<div class="vet-filter-group">' +
      '<span class="vet-filter-group__label">Location</span>' +
      '<div class="vet-filter-group__chips">' +
        makeChip('All', 'all', 'neighbourhood', true) +
        neighbourhoods.map(n => makeChip(n, n, 'neighbourhood', false)).join('') +
      '</div>' +
    '</div>' +
    '<div class="vet-filter-group">' +
      '<span class="vet-filter-group__label">Pet Types</span>' +
      '<div class="vet-filter-group__chips">' +
        ['dogs', 'cats', 'small-mammals', 'rabbits'].map(p =>
          `<span class="vet-chip" data-filter-pet="${p}" role="button" tabindex="0">${PET_LABELS[p]}</span>`
        ).join('') +
      '</div>' +
    '</div>' +
    '<div class="vet-filter-group">' +
      '<span class="vet-filter-group__label">Services</span>' +
      '<div class="vet-filter-group__chips">' +
        ['bath-brush', 'haircut', 'nail-trim', 'teeth-brushing', 'de-shedding'].map(s =>
          `<span class="vet-chip" data-filter-service="${s}" role="button" tabindex="0">${SERVICE_LABELS[s]}</span>`
        ).join('') +
      '</div>' +
    '</div>' +
    '<div class="vet-filter-group">' +
      '<span class="vet-filter-group__label">Mobile Grooming</span>' +
      '<div class="vet-filter-group__chips">' +
        makeChip('All', 'all', 'mobile', true) +
        makeChip('Yes', 'yes', 'mobile', false) +
        makeChip('No', 'no', 'mobile', false) +
      '</div>' +
    '</div>' +
    '<button class="vet-filter-clear" id="groomer-filter-clear">Clear all filters</button>';

  wireFilterChips();
}

function wireFilterChips() {
  const datasetKey = { rating: 'filterRating', neighbourhood: 'filterNeighbourhood', mobile: 'filterMobile' };
  ['rating', 'neighbourhood', 'mobile'].forEach(key => {
    document.querySelectorAll(`[data-filter-${key}]`).forEach(chip => {
      chip.addEventListener('click', function() {
        document.querySelectorAll(`[data-filter-${key}]`).forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        activeFilters[key] = this.dataset[datasetKey[key]];
        applyFilters();
      });
    });
  });

  document.querySelectorAll('[data-filter-pet]').forEach(chip => {
    chip.addEventListener('click', function() {
      this.classList.toggle('active');
      activeFilters.pets = [...document.querySelectorAll('[data-filter-pet].active')]
        .map(el => el.dataset.filterPet);
      applyFilters();
    });
  });

  document.querySelectorAll('[data-filter-service]').forEach(chip => {
    chip.addEventListener('click', function() {
      this.classList.toggle('active');
      activeFilters.services = [...document.querySelectorAll('[data-filter-service].active')]
        .map(el => el.dataset.filterService);
      applyFilters();
    });
  });

  document.querySelectorAll('#groomer-filter-panel .vet-chip').forEach(chip => {
    chip.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chip.click(); }
    });
  });

  document.getElementById('groomer-filter-clear').addEventListener('click', resetFilters);
}

function syncChipUI() {
  document.querySelectorAll('[data-filter-rating]').forEach(c =>
    c.classList.toggle('active', c.dataset.filterRating === activeFilters.rating));
  document.querySelectorAll('[data-filter-neighbourhood]').forEach(c =>
    c.classList.toggle('active', c.dataset.filterNeighbourhood === activeFilters.neighbourhood));
  document.querySelectorAll('[data-filter-pet]').forEach(c =>
    c.classList.toggle('active', activeFilters.pets.includes(c.dataset.filterPet)));
  document.querySelectorAll('[data-filter-service]').forEach(c =>
    c.classList.toggle('active', activeFilters.services.includes(c.dataset.filterService)));
  document.querySelectorAll('[data-filter-mobile]').forEach(c =>
    c.classList.toggle('active', c.dataset.filterMobile === activeFilters.mobile));
}

function resetFilters() {
  activeFilters = { rating: 'all', neighbourhood: 'all', pets: [], services: [], mobile: 'all' };
  syncChipUI();
  applyFilters();
}

/* =====================
   ENTRY POINT
   ===================== */

document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedBanner(GROOMERS, {
    bannerId: 'groomer-featured-banner',
    bannerClass: 'groomer-featured-banner',
    badgeText: '#1 Groomer in the GTA'
  });
  buildFilterPanel();
  renderGroomers(GROOMERS);

  const toggleBtn = document.getElementById('groomer-filter-toggle');
  const panel = document.getElementById('groomer-filter-panel');
  if (toggleBtn && panel) {
    panel.hidden = true;
    toggleBtn.setAttribute('aria-expanded', 'false');

    toggleBtn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = !panel.hidden;
      panel.hidden = isOpen;
      toggleBtn.setAttribute('aria-expanded', String(!isOpen));
    });

    const closePanel = () => {
      panel.hidden = true;
      toggleBtn.setAttribute('aria-expanded', 'false');
    };
    document.addEventListener('click', closePanel);
    panel.addEventListener('click', e => e.stopPropagation());
  }
});
```

- [ ] **Step 2: Open grooming.html in the browser and verify**

Run: `open grooming.html`

Confirm:
- Featured banner shows "The Soggy Paw" with rating 4.9
- All 15 groomer cards render with photos, addresses, pet tags (pink), service tags (cream), and "Book Grooming →" buttons
- Mobile groomers show the "📱 Mobile Grooming Available" badge
- Filters button opens a panel with 5 groups: Rating, Location, Pet Types, Services, Mobile Grooming
- Selecting "Mobile: Yes" shows only the 3 mobile groomers (GTA Mobile Grooming, Brampton Mobile Grooming, Thornhill Mobile Grooming)
- Active filter chips appear and can be removed with the × button
- "Clear all filters" resets all groups

Also open `vet-services.html` and confirm it still works identically to before.

- [ ] **Step 3: Commit**

```bash
git add js/groomers.js
git commit -m "feat: add groomers.js with filter logic and card rendering"
```

---

## Task 7: Add Grooming to navigation

**Files:**
- Modify: `js/components.js`

- [ ] **Step 1: Add Grooming link to NAV_HTML**

In `js/components.js`, find the NAV_HTML `<div class="nav-links">` block and add `<a href="grooming.html">Grooming</a>` after the Vet Services link:

```js
const NAV_HTML = `
<nav class="nav">
  <a href="index.html" class="nav-logo">🐾 PetWeb</a>
  <div class="nav-links">
    <a href="shelters.html">Shelters</a>
    <a href="adoption.html">Adoption</a>
    <a href="vet-services.html">Vet Services</a>
    <a href="grooming.html">Grooming</a>
    <div class="nav-dropdown">
      <button class="nav-dropdown-toggle">More &#9660;</button>
      <div class="nav-dropdown-menu">
        <a href="insurance.html">Insurance</a>
        <a href="legislation.html">Legislation</a>
        <a href="nutrition.html">Nutrition</a>
        <a href="products.html">Products</a>
      </div>
    </div>
    <a href="shelters.html" class="btn-pill nav-cta">Find a Shelter</a>
  </div>
  <button class="nav-hamburger" aria-label="Open menu">&#9776;</button>
</nav>
`;
```

- [ ] **Step 2: Verify nav on both pages**

Open `grooming.html` in the browser. Confirm "Grooming" appears in the nav bar and is highlighted as the active link.

Open `vet-services.html`. Confirm "Grooming" appears in the nav and "Vet Services" is the active link.

Open `index.html`. Confirm "Grooming" appears in the nav with no active highlight.

- [ ] **Step 3: Commit**

```bash
git add js/components.js
git commit -m "feat: add Grooming link to main navigation"
```

---

## Done

All tasks complete. The grooming directory page is live at `grooming.html` with:
- Featured banner, filter panel (5 groups), active chips, and 15 groomer cards
- Shared `buildCard` / `renderFeaturedBanner` helpers used by both vets and groomers
- Grooming linked in the main nav bar
