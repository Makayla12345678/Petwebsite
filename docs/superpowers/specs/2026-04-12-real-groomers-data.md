# Real Groomers Data — Design Spec

**Date:** 2026-04-12  
**Scope:** `data/groomers.js` only

## Goal

Replace all 15 fictional groomer entries in `data/groomers.js` with real, operating GTA pet grooming businesses. No other files are modified.

## Neighbourhoods (unchanged)

The Beaches, Midtown Toronto, Etobicoke, North York, Mississauga, Scarborough, Downtown Core, Markham, Brampton, Oakville, Richmond Hill, East York, Thornhill, Ajax, Pickering

## Data Shape (unchanged)

Each entry keeps the same fields:

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Real business name |
| `neighbourhood` | string | Same 15 as current |
| `address` | string | Verified street address |
| `pets` | array | Real services offered (dogs, cats, small-mammals, rabbits) |
| `services` | array | bath-brush, haircut, nail-trim, de-shedding, teeth-brushing |
| `mobile` | boolean | True if mobile/van service |
| `rating` | number | From Google or Yelp |
| `reviews` | number | Review count from same source |
| `tagline` | string | Short description of the business |
| `website` | string | Real working URL |
| `image` | string | Wikimedia Commons image (existing pattern) |

## Sourcing Rules

- Each business must be verified via web search (real address, real website)
- Ratings pulled from Google Maps or Yelp where available
- If no groomer exists in a specific neighbourhood, use the nearest adjacent area and note it
- Mobile groomers are acceptable for areas with fewer brick-and-mortar options

## Out of Scope

- `grooming.html` — no changes
- `js/components.js` — no changes
- Any other data file — no changes
