(function() {

/* =====================
   HELPERS
   ===================== */

const TAG_LABELS = {
  'in-cabin': 'In-Cabin Allowed',
  'cargo': 'Cargo Option',
  'service-animal': 'Service Animal Program',
  'no-breed-restrictions': 'No Breed Restrictions'
};

const AIRLINE_CARD_CONFIG = {
  cardClass: 'airline-card',
  tagsField: 'tags',
  tagLabels: TAG_LABELS,
  badgeField: null,
  badgeText: '',
  bookBtnLabel: 'Pet Policy →'
};

/* =====================
   CARD RENDERING
   ===================== */

function renderAirlines(list) {
  const container = document.getElementById('airlines-list');
  if (!container) return;
  if (list.length === 0) {
    container.innerHTML = '<p class="airline-no-results">No airlines match your filters. Try clearing some filters.</p>';
    return;
  }
  const enriched = list.map(a => ({ ...a, neighbourhood: `${a.city}, ${a.country}` }));
  container.innerHTML = enriched.map(a => buildCard(a, AIRLINE_CARD_CONFIG)).join('');
}

/* =====================
   FILTER STATE
   ===================== */

let activeFilters = {
  rating: 'all',
  country: 'all',
  cabin: 'all'
};

/* =====================
   FILTER LOGIC
   ===================== */

function filterAirlines() {
  return AIRLINES.filter(a => {
    if (activeFilters.rating !== 'all') {
      const threshold = parseFloat(activeFilters.rating);
      if (!isNaN(threshold) && a.rating < threshold) return false;
    }
    if (activeFilters.country !== 'all' && a.country !== activeFilters.country) return false;
    if (activeFilters.cabin === 'yes' && !a.tags.includes('in-cabin')) return false;
    if (activeFilters.cabin === 'no' && a.tags.includes('in-cabin')) return false;
    return true;
  });
}

function applyFilters() {
  renderAirlines(filterAirlines());
  renderActiveChips();
}

/* =====================
   ACTIVE CHIPS STRIP
   ===================== */

function renderActiveChips() {
  const container = document.getElementById('airline-active-chips');
  if (!container) return;
  const chips = [];

  if (activeFilters.rating !== 'all') chips.push({ label: `Rating: ${activeFilters.rating}+`, key: 'rating' });
  if (activeFilters.country !== 'all') chips.push({ label: `Country: ${activeFilters.country}`, key: 'country' });
  if (activeFilters.cabin !== 'all') chips.push({ label: `In-Cabin: ${activeFilters.cabin === 'yes' ? 'Yes' : 'No'}`, key: 'cabin' });

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
  return `<span class="vet-chip${isActive ? ' active' : ''}" data-air-filter-${filterKey}="${value}" role="button" tabindex="0">${label}</span>`;
}

function buildFilterPanel() {
  const countries = [...new Set(AIRLINES.map(a => a.country))].sort();
  const panel = document.getElementById('airline-filter-panel');
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
      '<span class="vet-filter-group__label">In-Cabin Allowed</span>' +
      '<div class="vet-filter-group__chips">' +
        makeChip('All', 'all', 'cabin', true) +
        makeChip('Yes', 'yes', 'cabin', false) +
        makeChip('No', 'no', 'cabin', false) +
      '</div>' +
    '</div>' +
    '<button class="vet-filter-clear" id="airline-filter-clear">Clear all filters</button>';

  wireFilterChips();
}

function wireFilterChips() {
  const keys = ['rating', 'country', 'cabin'];
  const datasetMap = {
    rating: 'airFilterRating',
    country: 'airFilterCountry',
    cabin: 'airFilterCabin'
  };

  keys.forEach(key => {
    document.querySelectorAll(`[data-air-filter-${key}]`).forEach(chip => {
      chip.addEventListener('click', function() {
        document.querySelectorAll(`[data-air-filter-${key}]`).forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        activeFilters[key] = this.dataset[datasetMap[key]];
        applyFilters();
      });
    });
  });

  document.querySelectorAll('#airline-filter-panel .vet-chip').forEach(chip => {
    chip.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chip.click(); }
    });
  });

  document.getElementById('airline-filter-clear').addEventListener('click', resetFilters);
}

function syncChipUI() {
  const keys = ['rating', 'country', 'cabin'];
  keys.forEach(key => {
    document.querySelectorAll(`[data-air-filter-${key}]`).forEach(c => {
      const val = c.dataset[`airFilter${key.charAt(0).toUpperCase() + key.slice(1)}`];
      c.classList.toggle('active', val === activeFilters[key]);
    });
  });
}

function resetFilters() {
  activeFilters = { rating: 'all', country: 'all', cabin: 'all' };
  syncChipUI();
  applyFilters();
}

/* =====================
   ENTRY POINT
   ===================== */

document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedBanner(AIRLINES, {
    bannerId: 'airline-featured-banner',
    bannerClass: 'airline-featured-banner',
    badgeText: '#1 Pet-Friendly Airline'
  });
  buildFilterPanel();
  renderAirlines(AIRLINES);

  const toggleBtn = document.getElementById('airline-filter-toggle');
  const panel = document.getElementById('airline-filter-panel');
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
