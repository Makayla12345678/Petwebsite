// Injects schema.org JSON-LD for the directory pages from the same data arrays
// that render the listings. Load after the data file; independent of components.js.
(function() {
  const SITE = 'https://petsofgta.com';

  function addJsonLd(obj) {
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(obj);
    document.head.appendChild(el);
  }

  // "172 Sheppard Ave W, North York, ON M2N 1M8" -> PostalAddress
  function parseAddress(address) {
    const parts = address.split(',').map(s => s.trim());
    const last = parts[parts.length - 1] || '';
    if (!/^ON\b/.test(last) || parts.length < 3) return { '@type': 'PostalAddress', streetAddress: address };
    const postal = last.match(/[A-Z]\d[A-Z] ?\d[A-Z]\d/);
    const out = {
      '@type': 'PostalAddress',
      streetAddress: parts.slice(0, -2).join(', '),
      addressLocality: parts[parts.length - 2],
      addressRegion: 'ON',
      addressCountry: 'CA'
    };
    if (postal) out.postalCode = postal[0];
    return out;
  }

  function placeItem(item, type) {
    const out = { '@type': type, name: item.name };
    if (item.address) out.address = parseAddress(item.address);
    if (item.tagline) out.description = item.tagline;
    if (item.website && !/google\.com\/search/.test(item.website)) out.url = item.website;
    if (item.image) out.image = item.image;
    return out;
  }

  function addItemList(name, items, toThing) {
    addJsonLd({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: name,
      numberOfItems: items.length,
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: toThing(item)
      }))
    });
  }

  if (typeof VETS !== 'undefined') {
    addItemList('Vets in Toronto & the GTA', VETS, v => placeItem(v, 'VeterinaryCare'));
  }
  if (typeof GROOMERS !== 'undefined') {
    addItemList('Pet Groomers in Toronto & the GTA', GROOMERS, g => placeItem(g, 'LocalBusiness'));
  }
  if (typeof DOG_PARKS !== 'undefined') {
    addItemList('Best Dog Parks in the GTA', DOG_PARKS, p => placeItem(p, 'Park'));
  }
  if (typeof EVENTS !== 'undefined') {
    // Events only carry a month, not a startDate, so they can't be valid Event
    // rich results; list them as named things with a venue instead.
    addItemList('Dog Events in the GTA', EVENTS, e => {
      const o = { '@type': 'Thing', name: e.name };
      if (e.tagline) o.description = e.tagline;
      if (e.website) o.url = e.website;
      return o;
    });
  }

  // FAQ markup from the visible #seo-faq block (kept in the static HTML so
  // the schema always matches what users can read).
  const faq = document.getElementById('seo-faq');
  if (faq) {
    const entities = [];
    faq.querySelectorAll('details').forEach(d => {
      const q = d.querySelector('summary');
      const a = d.querySelector('p');
      if (q && a) entities.push({
        '@type': 'Question',
        name: q.textContent.trim(),
        acceptedAnswer: { '@type': 'Answer', text: a.textContent.trim() }
      });
    });
    if (entities.length) addJsonLd({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: entities });
  }
})();
