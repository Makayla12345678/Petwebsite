(function() {

/* =====================
   HELPERS
   ===================== */

const TAG_LABELS = {
  'no-fee': 'No Pet Fee',
  'unlimited-size': 'No Size Limit',
  'welcome-treats': 'Welcome Treats',
  'pet-bed-on-request': 'Pet Bed on Request',
  'room-service-menu': 'Pet Room Service',
  'loews-loves-pets': 'Loews Loves Pets',
  'concierge-dog-walker': 'Dog Walking Concierge',
  'beach-access': 'Pet Beach Access'
};

const HOTEL_CARD_CONFIG = {
  cardClass: 'hotel-card',
  tagsField: 'tags',
  tagLabels: TAG_LABELS,
  badgeField: 'noFee',
  badgeText: '💸 No Pet Fee',
  bookBtnLabel: 'View Hotel →'
};

/* =====================
   CARD RENDERING
   ===================== */

function renderHotels(list) {
  const container = document.getElementById('hotels-list');
  if (!container) return;
  if (list.length === 0) {
    container.innerHTML = '<p class="hotel-no-results">No hotels match your filters. Try clearing some filters.</p>';
    return;
  }
  const enriched = list.map(h => ({ ...h, neighbourhood: `${h.city}, ${h.country}` }));
  container.innerHTML = enriched.map(h => buildCard(h, HOTEL_CARD_CONFIG)).join('');
}

/* =====================
   FILTER STATE
   ===================== */

let activeFilters = {
  rating: 'all',
  city: 'all',
  priceTier: 'all',
  noFee: 'all'
};

/* =====================
   FILTER LOGIC
   ===================== */

function filterHotels() {
  return HOTELS.filter(h => {
    if (activeFilters.rating !== 'all') {
      const threshold = parseFloat(activeFilters.rating);
      if (!isNaN(threshold) && h.rating < threshold) return false;
    }
    if (activeFilters.city !== 'all' && h.city !== activeFilters.city) return false;
    if (activeFilters.priceTier !== 'all' && h.priceTier !== activeFilters.priceTier) return false;
    if (activeFilters.noFee === 'yes' && !h.noFee) return false;
    if (activeFilters.noFee === 'no' && h.noFee) return false;
    return true;
  });
}

function applyFilters() {
  renderHotels(filterHotels());
  renderActiveChips();
}

/* =====================
   ACTIVE CHIPS STRIP
   ===================== */

function renderActiveChips() {
  const container = document.getElementById('hotel-active-chips');
  if (!container) return;
  const chips = [];

  if (activeFilters.rating !== 'all') chips.push({ label: `Rating: ${activeFilters.rating}+`, key: 'rating' });
  if (activeFilters.city !== 'all') chips.push({ label: `City: ${activeFilters.city}`, key: 'city' });
  if (activeFilters.priceTier !== 'all') chips.push({ label: `Price: ${activeFilters.priceTier}`, key: 'priceTier' });
  if (activeFilters.noFee !== 'all') chips.push({ label: `No Fee: ${activeFilters.noFee === 'yes' ? 'Yes' : 'No'}`, key: 'noFee' });

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
  return `<span class="vet-chip${isActive ? ' active' : ''}" data-hotel-filter-${filterKey}="${value}" role="button" tabindex="0">${label}</span>`;
}

function buildFilterPanel() {
  const cities = [...new Set(HOTELS.map(h => h.city))].sort();
  const priceTiers = [...new Set(HOTELS.map(h => h.priceTier))].sort((a, b) => a.length - b.length);
  const panel = document.getElementById('hotel-filter-panel');
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
      '<span class="vet-filter-group__label">City</span>' +
      '<div class="vet-filter-group__chips">' +
        makeChip('All', 'all', 'city', true) +
        cities.map(c => makeChip(c, c, 'city', false)).join('') +
      '</div>' +
    '</div>' +
    '<div class="vet-filter-group">' +
      '<span class="vet-filter-group__label">Price Tier</span>' +
      '<div class="vet-filter-group__chips">' +
        makeChip('All', 'all', 'priceTier', true) +
        priceTiers.map(p => makeChip(p, p, 'priceTier', false)).join('') +
      '</div>' +
    '</div>' +
    '<div class="vet-filter-group">' +
      '<span class="vet-filter-group__label">No Pet Fee</span>' +
      '<div class="vet-filter-group__chips">' +
        makeChip('All', 'all', 'noFee', true) +
        makeChip('Yes', 'yes', 'noFee', false) +
        makeChip('No', 'no', 'noFee', false) +
      '</div>' +
    '</div>' +
    '<button class="vet-filter-clear" id="hotel-filter-clear">Clear all filters</button>';

  wireFilterChips();
}

function wireFilterChips() {
  const keys = ['rating', 'city', 'priceTier', 'noFee'];
  const datasetMap = {
    rating: 'hotelFilterRating',
    city: 'hotelFilterCity',
    priceTier: 'hotelFilterPriceTier',
    noFee: 'hotelFilterNoFee'
  };

  keys.forEach(key => {
    document.querySelectorAll(`[data-hotel-filter-${key}]`).forEach(chip => {
      chip.addEventListener('click', function() {
        document.querySelectorAll(`[data-hotel-filter-${key}]`).forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        activeFilters[key] = this.dataset[datasetMap[key]];
        applyFilters();
      });
    });
  });

  document.querySelectorAll('#hotel-filter-panel .vet-chip').forEach(chip => {
    chip.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chip.click(); }
    });
  });

  document.getElementById('hotel-filter-clear').addEventListener('click', resetFilters);
}

function syncChipUI() {
  const keys = ['rating', 'city', 'priceTier', 'noFee'];
  keys.forEach(key => {
    document.querySelectorAll(`[data-hotel-filter-${key}]`).forEach(c => {
      const val = c.dataset[`hotelFilter${key.charAt(0).toUpperCase() + key.slice(1)}`];
      c.classList.toggle('active', val === activeFilters[key]);
    });
  });
}

function resetFilters() {
  activeFilters = { rating: 'all', city: 'all', priceTier: 'all', noFee: 'all' };
  syncChipUI();
  applyFilters();
}

/* =====================
   ENTRY POINT
   ===================== */

document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedBanner(HOTELS, {
    bannerId: 'hotel-featured-banner',
    bannerClass: 'hotel-featured-banner',
    badgeText: '#1 Pet-Friendly Hotel'
  });
  buildFilterPanel();
  renderHotels(HOTELS);

  const toggleBtn = document.getElementById('hotel-filter-toggle');
  const panel = document.getElementById('hotel-filter-panel');
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
