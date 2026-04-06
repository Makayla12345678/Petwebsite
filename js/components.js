const NAV_HTML = `
<nav class="nav">
  <a href="index.html" class="nav-logo">🐾 PetWeb</a>
  <div class="nav-links">
    <a href="shelters.html">Shelters</a>
    <a href="adoption.html">Adoption</a>
    <a href="vet-services.html">Vet Services</a>
    <div class="nav-dropdown">
      <button class="nav-dropdown-toggle">More &#9660;</button>
      <div class="nav-dropdown-menu">
        <a href="insurance.html">Insurance</a>
        <a href="legislation.html">Legislation</a>
        <a href="nutrition.html">Nutrition</a>
        <a href="products.html">Products</a>
      </div>
    </div>
    <a href="shelters.html" class="btn-pill nav-cta">Find a Shelter</a>
  </div>
  <button class="nav-hamburger" aria-label="Open menu">&#9776;</button>
</nav>
`;

const FOOTER_HTML = `
<footer class="footer">
  <a href="index.html" class="footer-logo">🐾 PetWeb</a>
  <p class="footer-copy">&#169; 2024 PetWeb &middot; Made with love for animals</p>
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
