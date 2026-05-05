(function() {

/* =====================
   HELPERS
   ===================== */

const TYPE_LABELS = {
  'festival':     'Festival',
  'dog-show':     'Dog Show',
  'charity-walk': 'Charity Walk',
  'market':       'Market',
  'meetup':       'Meetup'
};

const SEASON_LABELS = {
  spring:    'Spring',
  summer:    'Summer',
  fall:      'Fall',
  winter:    'Winter',
  'year-round': 'Year-Round'
};

const EV_CARD_CONFIG = {
  cardClass: 'event-card',
  tagsField: 'tags',
  tagLabels: { festival: 'Festival', 'dog-show': 'Dog Show', 'charity-walk': 'Charity Walk', market: 'Market', meetup: 'Meetup', free: 'Free', paid: 'Paid' },
  badgeField: null,
  badgeText: '',
  bookBtnLabel: 'Learn More →'
};

/* =====================
   FEATURED BANNER
   ===================== */

function renderEventBanner() {
  const banner = document.getElementById('ev-featured-banner');
  if (!banner || !EVENTS.length) return;
  const ev = EVENTS[0];
  banner.innerHTML = `
    <div class="ev-featured-banner__left">
      <span class="ev-featured-banner__badge">🏆 Most Popular in the GTA</span>
      <h2 class="ev-featured-banner__name">${ev.name}</h2>
      ${ev.tagline ? `<p class="ev-featured-banner__tagline">${ev.tagline}</p>` : ''}
    </div>
    <div class="ev-featured-banner__right">
      <span class="ev-featured-banner__when">📅 Annual · ${ev.month}</span>
      <span class="ev-featured-banner__city">📍 ${ev.city}</span>
      ${ev.free ? '<span class="ev-featured-banner__free">Free Entry</span>' : '<span class="ev-featured-banner__free">Paid Entry</span>'}
    </div>`;
}

/* =====================
   SPOTLIGHT (TOP 3)
   ===================== */

function renderSpotlight() {
  const container = document.getElementById('ev-spotlight');
  if (!container) return;
  const top3 = EVENTS.slice(0, 3);
  const rankBadgeClass = ['ev-spotlight-card__rank--1', 'ev-spotlight-card__rank--2', 'ev-spotlight-card__rank--3'];
  const rankLabels = ['#1', '#2', '#3'];

  container.innerHTML = top3.map((ev, i) => {
    const tagsHTML = ev.tags.map(t =>
      `<span class="event-card__tag">${TYPE_LABELS[t] || t}</span>`
    ).join('');

    const imgHTML = ev.image
      ? `<figure class="ev-spotlight-card__img-wrap">
           <img src="${ev.image}" alt="${ev.name}" loading="lazy">
           ${ev.imageSource ? `<figcaption class="img-source">${ev.imageSource}</figcaption>` : ''}
           <span class="ev-spotlight-card__rank ${rankBadgeClass[i]}">${rankLabels[i]}</span>
         </figure>`
      : `<div class="ev-spotlight-card__img-placeholder">🎉</div>`;

    return `
      <div class="ev-spotlight-card">
        ${imgHTML}
        <div class="ev-spotlight-card__body">
          <h3 class="ev-spotlight-card__name">${ev.name}</h3>
          <p class="ev-spotlight-card__meta">${ev.city} &middot; ${TYPE_LABELS[ev.type] || ev.type}</p>
          <p class="ev-spotlight-card__address">📍 ${ev.venue}</p>
          <p class="ev-spotlight-card__tagline">"${ev.tagline}"</p>
          <div class="ev-spotlight-card__tags">${tagsHTML}</div>
          <div class="ev-spotlight-card__when">
            <span class="ev-spotlight-card__date">📅 Annual · ${ev.month}</span>
            ${ev.free
              ? '<span class="ev-spotlight-card__free ev-badge--free">Free</span>'
              : '<span class="ev-spotlight-card__free ev-badge--paid">Paid</span>'}
          </div>
        </div>
      </div>`;
  }).join('');
}

/* =====================
   CARD RENDERING
   ===================== */

function buildEventCard(ev) {
  const tagsHTML = ev.tags
    .map(t => `<span class="event-card__tag">${EV_CARD_CONFIG.tagLabels[t] || t}</span>`)
    .join('');

  const imgHTML = ev.image
    ? `<figure class="card-img">
         <img src="${ev.image}" alt="${ev.name}" loading="lazy">
         ${ev.imageSource ? `<figcaption class="img-source">${ev.imageSource}</figcaption>` : ''}
       </figure>`
    : `<div class="event-card__photo">🎉</div>`;

  return `
    <div class="event-card">
      ${imgHTML}
      <div class="event-card__body">
        <h3 class="event-card__name">${ev.name}</h3>
        <p class="event-card__address">📍 ${ev.venue} · ${ev.city}</p>
        <div class="event-card__tags">${tagsHTML}</div>
      </div>
      <div class="event-card__footer">
        <span class="event-card__date">📅 Annual · ${ev.month}</span>
        ${ev.free
          ? '<span class="event-card__free ev-badge--free">Free</span>'
          : '<span class="event-card__free ev-badge--paid">Paid</span>'}
        ${ev.website
          ? `<a href="${ev.website}" class="event-card__btn" target="_blank" rel="noopener noreferrer">Learn More →</a>`
          : ''}
      </div>
    </div>`;
}

function renderEvents(list) {
  const container = document.getElementById('ev-list');
  if (!container) return;
  if (list.length === 0) {
    container.innerHTML = '<p class="ev-no-results">No events match your filters. Try clearing some filters.</p>';
    return;
  }
  container.innerHTML = list.map(buildEventCard).join('');
}

/* =====================
   FILTER STATE
   ===================== */

let activeFilters = {
  type:   'all',
  city:   'all',
  season: 'all',
  free:   'all'
};

/* =====================
   FILTER LOGIC
   ===================== */

function filterEvents() {
  return EVENTS.filter(ev => {
    if (activeFilters.type !== 'all' && ev.type !== activeFilters.type) return false;
    if (activeFilters.city !== 'all' && ev.city !== activeFilters.city) return false;
    if (activeFilters.season !== 'all' && ev.season !== activeFilters.season) return false;
    if (activeFilters.free === 'yes' && !ev.free) return false;
    if (activeFilters.free === 'no' && ev.free) return false;
    return true;
  });
}

function applyFilters() {
  renderEvents(filterEvents());
  renderActiveChips();
}

/* =====================
   ACTIVE CHIPS STRIP
   ===================== */

function renderActiveChips() {
  const container = document.getElementById('ev-active-chips');
  if (!container) return;
  const chips = [];

  if (activeFilters.type !== 'all')   chips.push({ label: `Type: ${TYPE_LABELS[activeFilters.type] || activeFilters.type}`,       key: 'type' });
  if (activeFilters.city !== 'all')   chips.push({ label: `City: ${activeFilters.city}`,    key: 'city' });
  if (activeFilters.season !== 'all') chips.push({ label: `Season: ${SEASON_LABELS[activeFilters.season] || activeFilters.season}`, key: 'season' });
  if (activeFilters.free !== 'all')   chips.push({ label: `Entry: ${activeFilters.free === 'yes' ? 'Free' : 'Paid'}`, key: 'free' });

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
  return `<span class="vet-chip${isActive ? ' active' : ''}" data-ev-filter-${filterKey}="${value}" role="button" tabindex="0">${label}</span>`;
}

function buildFilterPanel() {
  const cities = [...new Set(EVENTS.map(e => e.city))].sort();
  const panel = document.getElementById('ev-filter-panel');
  if (!panel) return;

  panel.innerHTML =
    '<div class="vet-filter-group">' +
      '<span class="vet-filter-group__label">Type</span>' +
      '<div class="vet-filter-group__chips">' +
        makeChip('All', 'all', 'type', true) +
        makeChip('Festival', 'festival', 'type', false) +
        makeChip('Dog Show', 'dog-show', 'type', false) +
        makeChip('Charity Walk', 'charity-walk', 'type', false) +
        makeChip('Market', 'market', 'type', false) +
        makeChip('Meetup', 'meetup', 'type', false) +
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
      '<span class="vet-filter-group__label">Season</span>' +
      '<div class="vet-filter-group__chips">' +
        makeChip('All', 'all', 'season', true) +
        makeChip('Spring', 'spring', 'season', false) +
        makeChip('Summer', 'summer', 'season', false) +
        makeChip('Fall', 'fall', 'season', false) +
        makeChip('Winter', 'winter', 'season', false) +
        makeChip('Year-Round', 'year-round', 'season', false) +
      '</div>' +
    '</div>' +
    '<div class="vet-filter-group">' +
      '<span class="vet-filter-group__label">Entry</span>' +
      '<div class="vet-filter-group__chips">' +
        makeChip('All', 'all', 'free', true) +
        makeChip('Free', 'yes', 'free', false) +
        makeChip('Paid', 'no', 'free', false) +
      '</div>' +
    '</div>' +
    '<button class="vet-filter-clear" id="ev-filter-clear">Clear all filters</button>';

  wireFilterChips();
}

function wireFilterChips() {
  const keys = ['type', 'city', 'season', 'free'];
  const datasetMap = {
    type:   'evFilterType',
    city:   'evFilterCity',
    season: 'evFilterSeason',
    free:   'evFilterFree'
  };

  keys.forEach(key => {
    document.querySelectorAll(`[data-ev-filter-${key}]`).forEach(chip => {
      chip.addEventListener('click', function() {
        document.querySelectorAll(`[data-ev-filter-${key}]`).forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        activeFilters[key] = this.dataset[datasetMap[key]];
        applyFilters();
      });
    });
  });

  document.querySelectorAll('#ev-filter-panel .vet-chip').forEach(chip => {
    chip.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chip.click(); }
    });
  });

  document.getElementById('ev-filter-clear').addEventListener('click', resetFilters);
}

function syncChipUI() {
  const keys = ['type', 'city', 'season', 'free'];
  keys.forEach(key => {
    document.querySelectorAll(`[data-ev-filter-${key}]`).forEach(c => {
      const val = c.dataset[`evFilter${key.charAt(0).toUpperCase() + key.slice(1)}`];
      c.classList.toggle('active', val === activeFilters[key]);
    });
  });
}

function resetFilters() {
  activeFilters = { type: 'all', city: 'all', season: 'all', free: 'all' };
  syncChipUI();
  applyFilters();
}

/* =====================
   ENTRY POINT
   ===================== */

document.addEventListener('DOMContentLoaded', () => {
  renderEventBanner();
  renderSpotlight();
  buildFilterPanel();
  renderEvents(EVENTS);

  const toggleBtn = document.getElementById('ev-filter-toggle');
  const panel = document.getElementById('ev-filter-panel');
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
