# Vet Card — Book Appointment Button

**Date:** 2026-04-11
**Status:** Approved

## Overview

Add a "Book Appointment" button to the bottom-right of each vet card, linking to the vet's real website so users can book directly from the directory.

## Data Layer

- Add a `website` field (string | null) to every vet object in `data/vets.js`.
- Research and populate real URLs for all 15 vets. Several can be inferred from existing image source URLs; the rest require a web search.
- Vets where no URL can be confirmed receive `website: null`. No button is rendered for those cards.

## Card HTML

The button is inserted as the last child of the existing `.vet-card__rating` div in `renderVets()` inside `js/vets.js`. It is only rendered when `v.website` is truthy.

```html
<div class="vet-card__rating">
  <span class="vet-card__score">4.9</span>
  <!-- stars -->
  <span class="vet-card__review-count">(312 reviews)</span>
  <a href="https://example.com"
     class="vet-card__book-btn"
     target="_blank"
     rel="noopener noreferrer">
    Book Appointment →
  </a>
</div>
```

## Styling

Add `.vet-card__book-btn` to `css/styles.css`:

- `margin-left: auto` — pushes the button to the far right of the flex row
- Small pill shape: `border-radius` matching site tokens, modest `padding`
- Uses existing primary colour (`var(--color-primary)`) as background, white text
- Font: `var(--font-sans)`, small size (~0.78rem) to match `.vet-card__review-count`
- Hover state: slight darkening or lift (`box-shadow`)
- No button is shown when `v.website` is null (conditional template literal in JS)

## Behaviour

- Opens in a new tab (`target="_blank"`) with `rel="noopener noreferrer"` for security.
- No routing or SPA behaviour — plain anchor tag.
- No fallback/placeholder link for vets missing a URL; those cards simply omit the button.

## Files Changed

| File | Change |
|------|--------|
| `data/vets.js` | Add `website` field to all 15 vet objects |
| `js/vets.js` | Conditionally render `<a class="vet-card__book-btn">` in `renderVets()` |
| `css/styles.css` | Add `.vet-card__book-btn` styles |
