# Real Groomers Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all 15 fictional entries in `data/groomers.js` with real, verified GTA pet grooming businesses.

**Architecture:** Web-search each of the 15 target neighbourhoods for a real operating groomer, verify address and website, then write all 15 entries into `data/groomers.js` in one commit. No other files change.

**Tech Stack:** Static JS data file, web search for verification.

---

## Files

| Action | Path |
|--------|------|
| Modify | `data/groomers.js` |

---

### Task 1: Research groomers — The Beaches, Midtown Toronto, Etobicoke, North York, Mississauga

**Files:**
- Notes only (no file changes yet)

- [ ] **Step 1: Search The Beaches**

Run WebSearch: `pet grooming "The Beaches" Toronto Queen Street address website`

Look for: real business name, street address on Queen St E or nearby, working website URL, Google/Yelp rating.

- [ ] **Step 2: Search Midtown Toronto**

Run WebSearch: `pet grooming Midtown Toronto Yonge Eglinton address website rating`

Look for: real business near Yonge/Eglinton corridor, verified address, website.

- [ ] **Step 3: Search Etobicoke**

Run WebSearch: `pet grooming Etobicoke Toronto address website rating`

Look for: business on or near The Queensway, Bloor, or Kipling area.

- [ ] **Step 4: Search North York**

Run WebSearch: `pet grooming "North York" Toronto Bathurst Yonge address website rating`

Look for: business on Bathurst, Sheppard, or Yonge in North York.

- [ ] **Step 5: Search Mississauga**

Run WebSearch: `pet grooming Mississauga address website rating Google`

Look for: established groomer with a real address and website in Mississauga.

---

### Task 2: Research groomers — Scarborough, Downtown Core, Markham, Brampton, Oakville

**Files:**
- Notes only (no file changes yet)

- [ ] **Step 1: Search Scarborough**

Run WebSearch: `pet grooming Scarborough Toronto Lawrence Kingston address website rating`

- [ ] **Step 2: Search Downtown Core**

Run WebSearch: `pet dog grooming Downtown Toronto Queen King Bay address website rating`

- [ ] **Step 3: Search Markham**

Run WebSearch: `pet grooming Markham Ontario address website rating`

- [ ] **Step 4: Search Brampton**

Run WebSearch: `pet grooming Brampton Ontario address website rating`

- [ ] **Step 5: Search Oakville**

Run WebSearch: `pet grooming Oakville Ontario address website rating`

---

### Task 3: Research groomers — Richmond Hill, East York, Thornhill, Ajax, Pickering

**Files:**
- Notes only (no file changes yet)

- [ ] **Step 1: Search Richmond Hill**

Run WebSearch: `pet grooming "Richmond Hill" Ontario Yonge address website rating`

- [ ] **Step 2: Search East York**

Run WebSearch: `pet grooming "East York" Danforth Toronto address website rating`

- [ ] **Step 3: Search Thornhill**

Run WebSearch: `pet grooming Thornhill Ontario address website rating`

- [ ] **Step 4: Search Ajax**

Run WebSearch: `pet grooming Ajax Ontario address website rating`

- [ ] **Step 5: Search Pickering**

Run WebSearch: `pet grooming Pickering Ontario address website rating`

---

### Task 4: Write verified data to groomers.js

**Files:**
- Modify: `data/groomers.js`

Using all verified results from Tasks 1–3, overwrite `data/groomers.js` with the following structure (fill in real values from research):

- [ ] **Step 1: Write the full updated file**

Replace all contents of `data/groomers.js` with 15 real entries in this shape:

```js
const GROOMERS = [
  {
    name: "...",                          // Real business name
    neighbourhood: "The Beaches",
    address: "..., Toronto, ON",          // Verified street address
    pets: ["dogs", "cats"],               // Based on real services offered
    services: ["bath-brush", "haircut", "nail-trim"],  // Real services
    mobile: false,                        // true only if van/mobile service
    rating: 4.7,                          // From Google or Yelp
    reviews: 150,                         // Review count from same source
    tagline: "...",                       // One sentence about the business
    website: "https://...",               // Real working URL
    image: "https://upload.wikimedia.org/wikipedia/commons/2/26/YellowLabradorLooking_new.jpg",
    imageSource: "Wikimedia Commons"
  },
  // ... 14 more entries, one per neighbourhood
];
```

Rules:
- `pets` array uses only: `"dogs"`, `"cats"`, `"small-mammals"`, `"rabbits"`
- `services` array uses only: `"bath-brush"`, `"haircut"`, `"nail-trim"`, `"de-shedding"`, `"teeth-brushing"`
- Keep existing Wikimedia Commons images (rotate through the 5 already used in the file)
- Neighbourhoods must exactly match: `"The Beaches"`, `"Midtown Toronto"`, `"Etobicoke"`, `"North York"`, `"Mississauga"`, `"Scarborough"`, `"Downtown Core"`, `"Markham"`, `"Brampton"`, `"Oakville"`, `"Richmond Hill"`, `"East York"`, `"Thornhill"`, `"Ajax"`, `"Pickering"`

- [ ] **Step 2: Verify the file parses correctly**

Open `grooming.html` in a browser (or run `node -e "eval(require('fs').readFileSync('data/groomers.js','utf8')); console.log(GROOMERS.length + ' entries loaded')"` in terminal).

Expected output: `15 entries loaded`

- [ ] **Step 3: Spot-check 3 entries**

Pick any 3 entries. For each:
1. Paste the `website` URL into a browser — confirm it loads a real pet grooming business
2. Google the `address` — confirm it shows a real location

- [ ] **Step 4: Commit**

```bash
git add data/groomers.js
git commit -m "feat: replace fictional groomers with real verified GTA businesses"
```
