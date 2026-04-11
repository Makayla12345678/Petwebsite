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

function starsHTML(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    '<span class="vet-card__stars">' +
    '★'.repeat(full) +
    (half ? '<span style="opacity:0.5">★</span>' : '') +
    '☆'.repeat(empty) +
    '</span>'
  );
}

function featuredStarsHTML(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    '<span class="vet-featured-banner__stars">' +
    '★'.repeat(full) +
    (half ? '<span style="opacity:0.6">★</span>' : '') +
    '☆'.repeat(empty) +
    '</span>'
  );
}

/* =====================
   FEATURED BANNER
   ===================== */

function renderFeaturedBanner() {
  const v = VETS[0];
  document.getElementById('vet-featured-banner').innerHTML =
    '<div class="vet-featured-banner__left">' +
      '<span class="vet-featured-banner__badge">#1 in the GTA</span>' +
      '<h2 class="vet-featured-banner__name">' + v.name + '</h2>' +
      '<p class="vet-featured-banner__tagline">' + v.tagline + '</p>' +
    '</div>' +
    '<div class="vet-featured-banner__right">' +
      '<span class="vet-featured-banner__score">' + v.rating.toFixed(1) + '</span>' +
      featuredStarsHTML(v.rating) +
    '</div>';
}

/* =====================
   VET CARD RENDERING
   ===================== */

function renderVets(list) {
  const container = document.getElementById('vets-list');
  if (list.length === 0) {
    container.innerHTML = '<p class="vet-no-results">No vets match your filters. Try clearing some filters.</p>';
    return;
  }
  container.innerHTML = list.map(function(v) {
    return (
      '<div class="vet-card">' +
        '<div class="vet-card__photo">Photo coming soon</div>' +
        '<div class="vet-card__body">' +
          '<h3 class="vet-card__name">' + v.name + '</h3>' +
          '<p class="vet-card__address">📍 ' + v.address + ' · ' + v.neighbourhood + '</p>' +
          '<div class="vet-card__animals">' +
            v.animals.map(function(a) {
              return '<span class="vet-card__animal-tag">' + formatAnimal(a) + '</span>';
            }).join('') +
          '</div>' +
          (v.emergency ? '<p class="vet-card__emergency">🚨 24-hr Emergency Services</p>' : '') +
        '</div>' +
        '<div class="vet-card__rating">' +
          '<span class="vet-card__score">' + v.rating.toFixed(1) + '</span>' +
          starsHTML(v.rating) +
          '<span class="vet-card__review-count">(' + v.reviews.toLocaleString() + ' reviews)</span>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

/* =====================
   ENTRY POINT (filtering added in next task)
   ===================== */

document.addEventListener('DOMContentLoaded', function() {
  renderFeaturedBanner();
  renderVets(VETS);
});
