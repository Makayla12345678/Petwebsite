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

function starsHTML(rating) {
  return buildStars(rating, 'vet-card__stars');
}

function featuredStarsHTML(rating) {
  return buildStars(rating, 'vet-featured-banner__stars');
}

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
  container.innerHTML = list.map(v => `
    <div class="vet-card">
      <div class="vet-card__photo">Photo coming soon</div>
      <div class="vet-card__body">
        <h3 class="vet-card__name">${v.name}</h3>
        <p class="vet-card__address">📍 ${v.address} · ${v.neighbourhood}</p>
        <div class="vet-card__animals">
          ${v.animals.map(a => `<span class="vet-card__animal-tag">${formatAnimal(a)}</span>`).join('')}
        </div>
        ${v.emergency ? '<p class="vet-card__emergency">🚨 24-hr Emergency Services</p>' : ''}
      </div>
      <div class="vet-card__rating">
        <span class="vet-card__score">${v.rating.toFixed(1)}</span>
        ${starsHTML(v.rating)}
        <span class="vet-card__review-count">(${v.reviews.toLocaleString()} reviews)</span>
      </div>
    </div>`).join('');
}

/* =====================
   FILTER STATE
   ===================== */

let activeFilters = {
  rating: 'all',
  neighbourhood: 'all',
  animals: [],
  emergency: 'all'
};

/* =====================
   FILTER LOGIC
   ===================== */

function filterVets() {
  return VETS.filter(v => {
    if (activeFilters.rating !== 'all' && v.rating < parseFloat(activeFilters.rating)) return false;
    if (activeFilters.neighbourhood !== 'all' && v.neighbourhood !== activeFilters.neighbourhood) return false;
    if (activeFilters.animals.length > 0) {
      if (!activeFilters.animals.every(a => v.animals.includes(a))) return false;
    }
    if (activeFilters.emergency === 'yes' && !v.emergency) return false;
    if (activeFilters.emergency === 'no' && v.emergency) return false;
    return true;
  });
}

function applyFilters() {
  renderVets(filterVets());
  renderActiveChips();
}

/* =====================
   ACTIVE CHIPS STRIP
   ===================== */

function renderActiveChips() {
  const container = document.getElementById('vet-active-chips');
  if (!container) return;
  const chips = [];

  if (activeFilters.rating !== 'all') chips.push({ label: `Rating: ${activeFilters.rating}+`, key: 'rating' });
  if (activeFilters.neighbourhood !== 'all') chips.push({ label: `Location: ${activeFilters.neighbourhood}`, key: 'neighbourhood' });
  if (activeFilters.animals.length > 0) chips.push({ label: `Animals: ${activeFilters.animals.map(formatAnimal).join(', ')}`, key: 'animals' });
  if (activeFilters.emergency !== 'all') chips.push({ label: `Emergency: ${activeFilters.emergency === 'yes' ? 'Yes' : 'No'}`, key: 'emergency' });

  if (chips.length === 0) { container.innerHTML = ''; return; }

  container.innerHTML = chips.map(c =>
    `<span class="vet-chip active">${c.label} <button class="vet-active-chip__remove" data-remove="${c.key}" aria-label="Remove ${c.label} filter">×</button></span>`
  ).join('');

  container.querySelectorAll('.vet-active-chip__remove').forEach(btn => {
    btn.addEventListener('click', function() {
      const key = this.dataset.remove;
      if (key === 'rating') activeFilters.rating = 'all';
      if (key === 'neighbourhood') activeFilters.neighbourhood = 'all';
      if (key === 'animals') activeFilters.animals = [];
      if (key === 'emergency') activeFilters.emergency = 'all';
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
  const neighbourhoods = [...new Set(VETS.map(v => v.neighbourhood))];
  const panel = document.getElementById('vet-filter-panel');
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
      '<span class="vet-filter-group__label">Animal Types</span>' +
      '<div class="vet-filter-group__chips">' +
        ['dogs','cats','birds','exotic','small-mammals','reptiles'].map(a =>
          `<span class="vet-chip" data-filter-animal="${a}" role="button" tabindex="0">${formatAnimal(a)}</span>`
        ).join('') +
      '</div>' +
    '</div>' +
    '<div class="vet-filter-group">' +
      '<span class="vet-filter-group__label">Emergency Services</span>' +
      '<div class="vet-filter-group__chips">' +
        makeChip('All', 'all', 'emergency', true) +
        makeChip('Yes', 'yes', 'emergency', false) +
        makeChip('No', 'no', 'emergency', false) +
      '</div>' +
    '</div>' +
    '<button class="vet-filter-clear" id="vet-filter-clear">Clear all filters</button>';

  wireFilterChips();
}

function wireFilterChips() {
  ['rating', 'neighbourhood', 'emergency'].forEach(key => {
    document.querySelectorAll(`[data-filter-${key}]`).forEach(chip => {
      chip.addEventListener('click', function() {
        document.querySelectorAll(`[data-filter-${key}]`).forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        activeFilters[key] = this.dataset[`filter${key.charAt(0).toUpperCase()}${key.slice(1)}`];
        applyFilters();
      });
    });
  });

  document.querySelectorAll('[data-filter-animal]').forEach(chip => {
    chip.addEventListener('click', function() {
      this.classList.toggle('active');
      activeFilters.animals = [...document.querySelectorAll('[data-filter-animal].active')]
        .map(el => el.dataset.filterAnimal);
      applyFilters();
    });
  });

  document.getElementById('vet-filter-clear').addEventListener('click', resetFilters);
}

function syncChipUI() {
  document.querySelectorAll('[data-filter-rating]').forEach(c =>
    c.classList.toggle('active', c.dataset.filterRating === activeFilters.rating));
  document.querySelectorAll('[data-filter-neighbourhood]').forEach(c =>
    c.classList.toggle('active', c.dataset.filterNeighbourhood === activeFilters.neighbourhood));
  document.querySelectorAll('[data-filter-animal]').forEach(c =>
    c.classList.toggle('active', activeFilters.animals.includes(c.dataset.filterAnimal)));
  document.querySelectorAll('[data-filter-emergency]').forEach(c =>
    c.classList.toggle('active', c.dataset.filterEmergency === activeFilters.emergency));
}

function resetFilters() {
  activeFilters = { rating: 'all', neighbourhood: 'all', animals: [], emergency: 'all' };
  syncChipUI();
  applyFilters();
}

/* =====================
   ENTRY POINT
   ===================== */

document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedBanner();
  buildFilterPanel();
  renderVets(VETS);

  const toggleBtn = document.getElementById('vet-filter-toggle');
  const panel = document.getElementById('vet-filter-panel');
  if (toggleBtn && panel) {
    toggleBtn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = !panel.hidden;
      panel.hidden = isOpen;
      toggleBtn.setAttribute('aria-expanded', String(!isOpen));
    });
    document.addEventListener('click', () => {
      panel.hidden = true;
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
    panel.addEventListener('click', e => e.stopPropagation());
  }
});
