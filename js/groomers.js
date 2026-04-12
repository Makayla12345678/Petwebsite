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
