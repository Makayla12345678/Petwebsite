(function() {

/* =====================
   HELPERS
   ===================== */

const TAG_LABELS = {
  'no-fee': 'No Pet Fee',
  'unlimited-size': 'No Size Limit',
  'in-cabin-with-owner': 'In-Cabin with Owner',
  'dedicated-pet-relief': 'Pet Relief Area'
};

const FLEET_LABELS = { 'Light Jet': 'Light Jet', 'Midsize Jet': 'Midsize Jet', 'Heavy Jet': 'Heavy Jet' };

const PRIVATE_JET_CARD_CONFIG = {
  cardClass: 'private-jet-card',
  tagsField: 'tags',
  tagLabels: TAG_LABELS,
  badgeField: 'noFee',
  badgeText: '💸 No Pet Fee',
  bookBtnLabel: 'Charter →'
};

/* =====================
   CARD RENDERING
   ===================== */

function renderPrivateJets(list) {
  const container = document.getElementById('private-jets-list');
  if (!container) return;
  if (list.length === 0) {
    container.innerHTML = '<p class="private-jet-no-results">No charters match your filters. Try clearing some filters.</p>';
    return;
  }
  const enriched = list.map(j => ({ ...j, neighbourhood: `${j.city}, ${j.country}` }));
  container.innerHTML = enriched.map(j => buildCard(j, PRIVATE_JET_CARD_CONFIG)).join('');
}

/* =====================
   FILTER STATE
   ===================== */

let activeFilters = {
  rating: 'all',
  fleetType: 'all',
  noFee: 'all'
};

/* =====================
   FILTER LOGIC
   ===================== */

function filterPrivateJets() {
  return PRIVATE_JETS.filter(j => {
    if (activeFilters.rating !== 'all') {
      const threshold = parseFloat(activeFilters.rating);
      if (!isNaN(threshold) && j.rating < threshold) return false;
    }
    if (activeFilters.fleetType !== 'all' && j.fleetType !== activeFilters.fleetType) return false;
    if (activeFilters.noFee === 'yes' && !j.noFee) return false;
    if (activeFilters.noFee === 'no' && j.noFee) return false;
    return true;
  });
}

function applyFilters() {
  renderPrivateJets(filterPrivateJets());
  renderActiveChips();
}

/* =====================
   ACTIVE CHIPS STRIP
   ===================== */

function renderActiveChips() {
  const container = document.getElementById('private-jet-active-chips');
  if (!container) return;
  const chips = [];

  if (activeFilters.rating !== 'all') chips.push({ label: `Rating: ${activeFilters.rating}+`, key: 'rating' });
  if (activeFilters.fleetType !== 'all') chips.push({ label: `Fleet: ${FLEET_LABELS[activeFilters.fleetType]}`, key: 'fleetType' });
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
  return `<span class="vet-chip${isActive ? ' active' : ''}" data-jet-filter-${filterKey}="${value}" role="button" tabindex="0">${label}</span>`;
}

function buildFilterPanel() {
  const panel = document.getElementById('private-jet-filter-panel');
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
      '<span class="vet-filter-group__label">Fleet Type</span>' +
      '<div class="vet-filter-group__chips">' +
        makeChip('All', 'all', 'fleetType', true) +
        makeChip('Light Jet', 'Light Jet', 'fleetType', false) +
        makeChip('Midsize Jet', 'Midsize Jet', 'fleetType', false) +
        makeChip('Heavy Jet', 'Heavy Jet', 'fleetType', false) +
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
    '<button class="vet-filter-clear" id="private-jet-filter-clear">Clear all filters</button>';

  wireFilterChips();
}

function wireFilterChips() {
  const keys = ['rating', 'fleetType', 'noFee'];
  const datasetMap = {
    rating: 'jetFilterRating',
    fleetType: 'jetFilterFleetType',
    noFee: 'jetFilterNoFee'
  };

  keys.forEach(key => {
    document.querySelectorAll(`[data-jet-filter-${key}]`).forEach(chip => {
      chip.addEventListener('click', function() {
        document.querySelectorAll(`[data-jet-filter-${key}]`).forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        activeFilters[key] = this.dataset[datasetMap[key]];
        applyFilters();
      });
    });
  });

  document.querySelectorAll('#private-jet-filter-panel .vet-chip').forEach(chip => {
    chip.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chip.click(); }
    });
  });

  document.getElementById('private-jet-filter-clear').addEventListener('click', resetFilters);
}

function syncChipUI() {
  const keys = ['rating', 'fleetType', 'noFee'];
  keys.forEach(key => {
    document.querySelectorAll(`[data-jet-filter-${key}]`).forEach(c => {
      const val = c.dataset[`jetFilter${key.charAt(0).toUpperCase() + key.slice(1)}`];
      c.classList.toggle('active', val === activeFilters[key]);
    });
  });
}

function resetFilters() {
  activeFilters = { rating: 'all', fleetType: 'all', noFee: 'all' };
  syncChipUI();
  applyFilters();
}

/* =====================
   ENTRY POINT
   ===================== */

document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedBanner(PRIVATE_JETS, {
    bannerId: 'private-jet-featured-banner',
    bannerClass: 'private-jet-featured-banner',
    badgeText: '#1 Pet-Friendly Charter'
  });
  buildFilterPanel();
  renderPrivateJets(PRIVATE_JETS);

  const toggleBtn = document.getElementById('private-jet-filter-toggle');
  const panel = document.getElementById('private-jet-filter-panel');
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
