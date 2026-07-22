(function() {

/* =====================
   HELPERS
   ===================== */

const FEATURE_LABELS = {
  'off-leash': 'Off-Leash',
  river: 'River',
  lake: 'Lake',
  pond: 'Pond',
  fountain: 'Drinking Water',
  fenced: 'Fenced',
  small: 'Small',
  medium: 'Medium',
  large: 'Large'
};

const SIZE_LABELS = { small: 'Small', medium: 'Medium', large: 'Large' };

function computeFeatures(park) {
  const features = [];
  if (park.offLeash) features.push('off-leash');
  if (park.water) features.push(park.water);
  if (park.fenced) features.push('fenced');
  features.push(park.size);
  return features;
}

const DP_CARD_CONFIG = {
  cardClass: 'dog-park-card',
  tagsField: 'features',
  tagLabels: FEATURE_LABELS,
  badgeField: null,
  badgeText: '',
  bookBtnLabel: 'Location →'
};

/* =====================
   SPOTLIGHT (TOP 3)
   ===================== */

function renderSpotlight() {
  const container = document.getElementById('dp-spotlight');
  if (!container) return;
  const top3 = DOG_PARKS.slice(0, 3);
  const rankBadgeClass = ['dp-spotlight-card__rank--1', 'dp-spotlight-card__rank--2', 'dp-spotlight-card__rank--3'];
  const rankLabels = ['#1', '#2', '#3'];

  container.innerHTML = top3.map((park, i) => {
    const features = computeFeatures(park);
    const tagsHTML = features.map(f =>
      `<span class="dog-park-card__tag">${FEATURE_LABELS[f] || f}</span>`
    ).join('');

    const imgHTML = park.image
      ? `<figure class="dp-spotlight-card__img-wrap">
           <img src="${park.image}" alt="${park.name}" loading="lazy">
           ${park.imageSource ? `<figcaption class="img-source">${park.imageSource}</figcaption>` : ''}
           <span class="dp-spotlight-card__rank ${rankBadgeClass[i]}">${rankLabels[i]}</span>
         </figure>`
      : `<div class="dp-spotlight-card__img-placeholder">🌳</div>`;

    return `
      <div class="dp-spotlight-card">
        ${imgHTML}
        <div class="dp-spotlight-card__body">
          <h3 class="dp-spotlight-card__name">${park.name}</h3>
          <p class="dp-spotlight-card__meta">${park.neighbourhood} &middot; ${SIZE_LABELS[park.size]}</p>
          <p class="dp-spotlight-card__address">📍 ${park.address}</p>
          <p class="dp-spotlight-card__tagline">"${park.tagline}"</p>
          <div class="dp-spotlight-card__tags">${tagsHTML}</div>
          <div class="dp-spotlight-card__rating">
            <span class="dp-spotlight-card__score">${park.rating.toFixed(1)}</span>
            ${buildStars(park.rating, 'dp-spotlight-card__stars')}
            <span class="dp-spotlight-card__reviews">(${park.reviews.toLocaleString()} reviews)</span>
          </div>
        </div>
      </div>`;
  }).join('');
}

/* =====================
   CARD RENDERING
   ===================== */

function renderDogParks(list) {
  const container = document.getElementById('dp-list');
  if (!container) return;
  if (list.length === 0) {
    container.innerHTML = '<p class="dp-no-results">No parks match your filters. Try clearing some filters.</p>';
    return;
  }
  const enriched = list.map(p => ({ ...p, features: computeFeatures(p) }));
  container.innerHTML = enriched.map(p => buildCard(p, DP_CARD_CONFIG)).join('');
}

/* =====================
   FILTER STATE
   ===================== */

let activeFilters = {
  rating: 'all',
  neighbourhood: 'all',
  offLeash: 'all',
  water: 'all',
  fenced: 'all',
  size: 'all'
};

/* =====================
   FILTER LOGIC
   ===================== */

function filterDogParks() {
  return DOG_PARKS.filter(p => {
    if (activeFilters.rating !== 'all') {
      const threshold = parseFloat(activeFilters.rating);
      if (!isNaN(threshold) && p.rating < threshold) return false;
    }
    if (activeFilters.neighbourhood !== 'all' && p.neighbourhood !== activeFilters.neighbourhood) return false;
    if (activeFilters.offLeash === 'yes' && !p.offLeash) return false;
    if (activeFilters.offLeash === 'no' && p.offLeash) return false;
    if (activeFilters.water !== 'all') {
      if (activeFilters.water === 'none' && p.water) return false;
      if (activeFilters.water !== 'none' && p.water !== activeFilters.water) return false;
    }
    if (activeFilters.fenced === 'yes' && !p.fenced) return false;
    if (activeFilters.fenced === 'no' && p.fenced) return false;
    if (activeFilters.size !== 'all' && p.size !== activeFilters.size) return false;
    return true;
  });
}

function applyFilters() {
  renderDogParks(filterDogParks());
  renderActiveChips();
}

/* =====================
   ACTIVE CHIPS STRIP
   ===================== */

function renderActiveChips() {
  const container = document.getElementById('dp-active-chips');
  if (!container) return;
  const chips = [];

  if (activeFilters.rating !== 'all') chips.push({ label: `Rating: ${activeFilters.rating}+`, key: 'rating' });
  if (activeFilters.neighbourhood !== 'all') chips.push({ label: `Area: ${activeFilters.neighbourhood}`, key: 'neighbourhood' });
  if (activeFilters.offLeash !== 'all') chips.push({ label: `Off-Leash: ${activeFilters.offLeash === 'yes' ? 'Yes' : 'No'}`, key: 'offLeash' });
  if (activeFilters.water !== 'all') chips.push({ label: `Water: ${activeFilters.water === 'none' ? 'None' : (FEATURE_LABELS[activeFilters.water] || activeFilters.water)}`, key: 'water' });
  if (activeFilters.fenced !== 'all') chips.push({ label: `Fenced: ${activeFilters.fenced === 'yes' ? 'Yes' : 'No'}`, key: 'fenced' });
  if (activeFilters.size !== 'all') chips.push({ label: `Size: ${SIZE_LABELS[activeFilters.size]}`, key: 'size' });

  if (chips.length === 0) { container.innerHTML = ''; return; }

  container.innerHTML = chips.map(c =>
    `<span class="vet-chip active">${c.label} <button class="vet-active-chip__remove" data-remove="${c.key}" aria-label="Remove ${c.label} filter">&#215;</button></span>`
  ).join('');

  container.querySelectorAll('.vet-active-chip__remove').forEach(btn => {
    btn.addEventListener('click', function() {
      activeFilters[this.dataset.remove] = 'all';
      syncChipUI();
      applyFilters();
    });
  });
}

/* =====================
   FILTER PANEL
   ===================== */

function makeChip(label, value, filterKey, isActive) {
  return `<span class="vet-chip${isActive ? ' active' : ''}" data-dp-filter-${filterKey}="${value}" role="button" tabindex="0">${label}</span>`;
}

function buildFilterPanel() {
  const neighbourhoods = [...new Set(DOG_PARKS.map(p => p.neighbourhood))].sort();
  const panel = document.getElementById('dp-filter-panel');
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
      '<span class="vet-filter-group__label">Area</span>' +
      '<div class="vet-filter-group__chips">' +
        makeChip('All', 'all', 'neighbourhood', true) +
        neighbourhoods.map(n => makeChip(n, n, 'neighbourhood', false)).join('') +
      '</div>' +
    '</div>' +
    '<div class="vet-filter-group">' +
      '<span class="vet-filter-group__label">Off-Leash</span>' +
      '<div class="vet-filter-group__chips">' +
        makeChip('All', 'all', 'offLeash', true) +
        makeChip('Yes', 'yes', 'offLeash', false) +
        makeChip('No', 'no', 'offLeash', false) +
      '</div>' +
    '</div>' +
    '<div class="vet-filter-group">' +
      '<span class="vet-filter-group__label">Water Access</span>' +
      '<div class="vet-filter-group__chips">' +
        makeChip('All', 'all', 'water', true) +
        makeChip('River', 'river', 'water', false) +
        makeChip('Lake', 'lake', 'water', false) +
        makeChip('Pond', 'pond', 'water', false) +
        makeChip('None', 'none', 'water', false) +
      '</div>' +
    '</div>' +
    '<div class="vet-filter-group">' +
      '<span class="vet-filter-group__label">Fenced</span>' +
      '<div class="vet-filter-group__chips">' +
        makeChip('All', 'all', 'fenced', true) +
        makeChip('Yes', 'yes', 'fenced', false) +
        makeChip('No', 'no', 'fenced', false) +
      '</div>' +
    '</div>' +
    '<div class="vet-filter-group">' +
      '<span class="vet-filter-group__label">Size</span>' +
      '<div class="vet-filter-group__chips">' +
        makeChip('All', 'all', 'size', true) +
        makeChip('Small', 'small', 'size', false) +
        makeChip('Medium', 'medium', 'size', false) +
        makeChip('Large', 'large', 'size', false) +
      '</div>' +
    '</div>' +
    '<button class="vet-filter-clear" id="dp-filter-clear">Clear all filters</button>';

  wireFilterChips();
}

function wireFilterChips() {
  const singleKeys = ['rating', 'neighbourhood', 'offLeash', 'water', 'fenced', 'size'];
  const datasetMap = {
    rating: 'dpFilterRating',
    neighbourhood: 'dpFilterNeighbourhood',
    offLeash: 'dpFilterOffLeash',
    water: 'dpFilterWater',
    fenced: 'dpFilterFenced',
    size: 'dpFilterSize'
  };

  singleKeys.forEach(key => {
    document.querySelectorAll(`[data-dp-filter-${key}]`).forEach(chip => {
      chip.addEventListener('click', function() {
        document.querySelectorAll(`[data-dp-filter-${key}]`).forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        activeFilters[key] = this.dataset[datasetMap[key]];
        applyFilters();
      });
    });
  });

  document.querySelectorAll('#dp-filter-panel .vet-chip').forEach(chip => {
    chip.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chip.click(); }
    });
  });

  document.getElementById('dp-filter-clear').addEventListener('click', resetFilters);
}

function syncChipUI() {
  const keys = ['rating', 'neighbourhood', 'offLeash', 'water', 'fenced', 'size'];
  keys.forEach(key => {
    document.querySelectorAll(`[data-dp-filter-${key}]`).forEach(c => {
      const val = c.dataset[`dpFilter${key.charAt(0).toUpperCase() + key.slice(1)}`];
      c.classList.toggle('active', val === activeFilters[key]);
    });
  });
}

function resetFilters() {
  activeFilters = { rating: 'all', neighbourhood: 'all', offLeash: 'all', water: 'all', fenced: 'all', size: 'all' };
  syncChipUI();
  applyFilters();
}

/* =====================
   ENTRY POINT
   ===================== */

document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedBanner(DOG_PARKS, {
    bannerId: 'dp-featured-banner',
    bannerClass: 'dp-featured-banner',
    badgeText: '#1 in the GTA'
  });
  renderSpotlight();
  buildFilterPanel();
  renderDogParks(DOG_PARKS);
  injectItemListSchema(DOG_PARKS, 'Park', 'Toronto', 'dog-parks-jsonld');

  const toggleBtn = document.getElementById('dp-filter-toggle');
  const panel = document.getElementById('dp-filter-panel');
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

})();
