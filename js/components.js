/* =====================
   SHARED RENDERING HELPERS
   ===================== */

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

/**
 * Renders a single listing card as an HTML string.
 * config: {
 *   cardClass      — root CSS class, e.g. 'vet-card' or 'groomer-card'
 *   tagsField      — item property for primary tags, e.g. 'animals' or 'pets'
 *   tagLabels      — object mapping tag keys to display labels
 *   badgeField     — boolean item property, e.g. 'emergency' or 'mobile'
 *   badgeText      — HTML string shown when badgeField is true
 *   bookBtnLabel   — CTA button text, e.g. 'Book Appointment →'
 *   servicesField  — (optional) item property for a second tag row, e.g. 'services'
 *   serviceLabels  — (optional) label map for servicesField values
 * }
 */
function buildCard(item, config) {
  const {
    cardClass, tagsField, tagLabels,
    badgeField, badgeText, bookBtnLabel,
    servicesField, serviceLabels
  } = config;

  const tagsHTML = (item[tagsField] || [])
    .map(t => `<span class="${cardClass}__tag">${tagLabels[t] || t}</span>`)
    .join('');

  const servicesHTML = servicesField
    ? (item[servicesField] || [])
        .map(s => `<span class="${cardClass}__service-tag">${(serviceLabels || {})[s] || s}</span>`)
        .join('')
    : '';

  return `
    <div class="${cardClass}">
      ${item.image
        ? `<figure class="card-img">
             <img src="${item.image}" alt="${item.name}" loading="lazy">
             ${item.imageSource ? `<figcaption class="img-source">${item.imageSource}</figcaption>` : ""}
           </figure>`
        : `<div class="${cardClass}__photo">🐾</div>`
      }
      <div class="${cardClass}__body">
        <h3 class="${cardClass}__name">${item.name}</h3>
        <p class="${cardClass}__address">📍 ${item.address} · ${item.neighbourhood}</p>
        <div class="${cardClass}__tags">${tagsHTML}</div>
        ${servicesHTML ? `<div class="${cardClass}__services">${servicesHTML}</div>` : ''}
        ${item[badgeField] ? `<p class="${cardClass}__badge">${badgeText}</p>` : ''}
      </div>
      <div class="${cardClass}__rating">
        <span class="${cardClass}__score">${item.rating != null ? item.rating.toFixed(1) : 'N/A'}</span>
        ${buildStars(item.rating, `${cardClass}__stars`)}
        ${item.reviews != null ? `<span class="${cardClass}__review-count">(${item.reviews.toLocaleString()} reviews)</span>` : ""}
        ${item.website
          ? `<a href="${item.website}" class="${cardClass}__book-btn" target="_blank" rel="noopener noreferrer">${bookBtnLabel}</a>`
          : ''}
      </div>
    </div>`;
}

/**
 * Renders a #1-in-the-GTA featured banner into a DOM element.
 * config: {
 *   bannerId    — id of the container element
 *   bannerClass — CSS class prefix, e.g. 'vet-featured-banner' or 'groomer-featured-banner'
 *   badgeText   — pill label, e.g. '#1 in the GTA'
 * }
 */
function renderFeaturedBanner(data, config) {
  const { bannerId, bannerClass, badgeText } = config;
  const banner = document.getElementById(bannerId);
  if (!banner || !data || !data.length) return;
  const item = data[0];
  banner.innerHTML = `
    <div class="${bannerClass}__left">
      <span class="${bannerClass}__badge">${badgeText}</span>
      <h2 class="${bannerClass}__name">${item.name}</h2>
      ${item.tagline ? `<p class="${bannerClass}__tagline">${item.tagline}</p>` : ""}
    </div>
    <div class="${bannerClass}__right">
      <span class="${bannerClass}__score">${item.rating.toFixed(1)}</span>
      ${buildStars(item.rating, `${bannerClass}__stars`)}
    </div>`;
}

const NAV_HTML = `
<nav class="nav">
  <a href="index.html" class="nav-logo">🐾 PetWeb</a>
  <div class="nav-links">
    <a href="vet-services.html">Vet Services</a>
    <a href="grooming.html">Grooming</a>
    <a href="dog-parks.html">Dog Parks</a>
    <a href="events.html">Events</a>
    <div class="nav-dropdown">
      <button class="nav-dropdown-toggle">More &#9660;</button>
      <div class="nav-dropdown-menu">
        <a href="insurance.html">Insurance</a>
        <a href="legislation.html">Legislation</a>
        <a href="nutrition.html">Nutrition</a>
        <a href="products.html">Products</a>
      </div>
    </div>
    <a href="vet-services.html" class="btn-pill nav-cta">Find a Vet</a>
  </div>
  <button class="nav-hamburger" aria-label="Open menu">&#9776;</button>
</nav>
`;

const FOOTER_HTML = `
<footer class="footer">
  <a href="index.html" class="footer-logo">🐾 PetWeb</a>
  <p class="footer-copy">&#169; 2026 PetWeb &middot; Made with love for animals</p>
  <div class="footer-links">
    <a href="#">Privacy</a>
    <a href="#">Contact</a>
  </div>
</footer>
`;

function injectComponents() {
  const navEl = document.getElementById('nav-placeholder');
  const footerEl = document.getElementById('footer-placeholder');
  if (navEl) navEl.innerHTML = NAV_HTML;
  if (footerEl) footerEl.innerHTML = FOOTER_HTML;

  // Mark active nav link
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links > a').forEach(link => {
    if (link.getAttribute('href') === page) link.classList.add('nav-link--active');
  });

  // Dropdown toggle
  const toggle = document.querySelector('.nav-dropdown-toggle');
  const menu = document.querySelector('.nav-dropdown-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', e => {
      e.stopPropagation();
      menu.classList.toggle('open');
    });
    document.addEventListener('click', () => menu.classList.remove('open'));
  }

  // Hamburger menu
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  }
}

document.addEventListener('DOMContentLoaded', injectComponents);
