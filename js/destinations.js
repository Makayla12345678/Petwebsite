(function() {

/* =====================
   HELPERS
   ===================== */

const TAG_LABELS = {
  'off-leash-trails': 'Off-Leash Trails',
  'dog-beach': 'Dog Beach',
  'dog-friendly-transit': 'Pet-Friendly Transit',
  'dog-friendly-cabins': 'Pet-Friendly Cabins',
  'pet-friendly-cafes': 'Pet-Friendly Cafes',
  'no-quarantine': 'No Quarantine'
};

const TYPE_LABELS = { beach: 'Beach', mountain: 'Mountain', city: 'City', countryside: 'Countryside' };

const DESTINATION_CARD_CONFIG = {
  cardClass: 'destination-card',
  tagsField: 'tags',
  tagLabels: TAG_LABELS,
  badgeField: 'noFee',
  badgeText: '🛬 No Quarantine Required',
  bookBtnLabel: 'Explore →'
};

/* =====================
   CARD RENDERING
   ===================== */

function renderDestinations(list) {
  const container = document.getElementById('destinations-list');
  if (!container) return;
  if (list.length === 0) {
    container.innerHTML = '<p class="destination-no-results">No destinations match your filters. Try clearing some filters.</p>';
    return;
  }
  const enriched = list.map(d => ({ ...d, neighbourhood: `${d.city}, ${d.country}` }));
  container.innerHTML = enriched.map(d => buildCard(d, DESTINATION_CARD_CONFIG)).join('');
}

/* =====================
   FILTER STATE
   ===================== */

let activeFilters = {
  rating: 'all',
  country: 'all',
  type: 'all'
};

/* =====================
   FILTER LOGIC
   ===================== */

function filterDestinations() {
  return DESTINATIONS.filter(d => {
    if (activeFilters.rating !== 'all') {
      const threshold = parseFloat(activeFilters.rating);
      if (!isNaN(threshold) && d.rating < threshold) return false;
    }
    if (activeFilters.country !== 'all' && d.country !== activeFilters.country) return false;
    if (activeFilters.type !== 'all' && d.type !== activeFilters.type) return false;
    return true;
  });
}

function applyFilters() {
  renderDestinations(filterDestinations());
  renderActiveChips();
}

/* =====================
   ACTIVE CHIPS STRIP
   ===================== */

function renderActiveChips() {
  const container = document.getElementById('destination-active-chips');
  if (!container) return;
  const chips = [];

  if (activeFilters.rating !== 'all') chips.push({ label: `Rating: ${activeFilters.rating}+`, key: 'rating' });
  if (activeFilters.country !== 'all') chips.push({ label: `Country: ${activeFilters.country}`, key: 'country' });
  if (activeFilters.type !== 'all') chips.push({ label: `Type: ${TYPE_LABELS[activeFilters.type]}`, key: 'type' });

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
  return `<span class="vet-chip${isActive ? ' active' : ''}" data-dest-filter-${filterKey}="${value}" role="button" tabindex="0">${label}</span>`;
}

function buildFilterPanel() {
  const countries = [...new Set(DESTINATIONS.map(d => d.country))].sort();
  const panel = document.getElementById('destination-filter-panel');
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
      '<span class="vet-filter-group__label">Country</span>' +
      '<div class="vet-filter-group__chips">' +
        makeChip('All', 'all', 'country', true) +
        countries.map(c => makeChip(c, c, 'country', false)).join('') +
      '</div>' +
    '</div>' +
    '<div class="vet-filter-group">' +
      '<span class="vet-filter-group__label">Type</span>' +
      '<div class="vet-filter-group__chips">' +
        makeChip('All', 'all', 'type', true) +
        makeChip('Beach', 'beach', 'type', false) +
        makeChip('Mountain', 'mountain', 'type', false) +
        makeChip('City', 'city', 'type', false) +
        makeChip('Countryside', 'countryside', 'type', false) +
      '</div>' +
    '</div>' +
    '<button class="vet-filter-clear" id="destination-filter-clear">Clear all filters</button>';

  wireFilterChips();
}

function wireFilterChips() {
  const keys = ['rating', 'country', 'type'];
  const datasetMap = {
    rating: 'destFilterRating',
    country: 'destFilterCountry',
    type: 'destFilterType'
  };

  keys.forEach(key => {
    document.querySelectorAll(`[data-dest-filter-${key}]`).forEach(chip => {
      chip.addEventListener('click', function() {
        document.querySelectorAll(`[data-dest-filter-${key}]`).forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        activeFilters[key] = this.dataset[datasetMap[key]];
        applyFilters();
      });
    });
  });

  document.querySelectorAll('#destination-filter-panel .vet-chip').forEach(chip => {
    chip.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chip.click(); }
    });
  });

  document.getElementById('destination-filter-clear').addEventListener('click', resetFilters);
}

function syncChipUI() {
  const keys = ['rating', 'country', 'type'];
  keys.forEach(key => {
    document.querySelectorAll(`[data-dest-filter-${key}]`).forEach(c => {
      const val = c.dataset[`destFilter${key.charAt(0).toUpperCase() + key.slice(1)}`];
      c.classList.toggle('active', val === activeFilters[key]);
    });
  });
}

function resetFilters() {
  activeFilters = { rating: 'all', country: 'all', type: 'all' };
  syncChipUI();
  applyFilters();
}

/* =====================
   ENTRY POINT
   ===================== */

document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedBanner(DESTINATIONS, {
    bannerId: 'destination-featured-banner',
    bannerClass: 'destination-featured-banner',
    badgeText: '#1 Pet-Friendly Destination'
  });
  buildFilterPanel();
  renderDestinations(DESTINATIONS);

  const toggleBtn = document.getElementById('destination-filter-toggle');
  const panel = document.getElementById('destination-filter-panel');
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
