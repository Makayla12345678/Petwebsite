function renderShelters(list) {
  const container = document.getElementById('shelters-list');
  if (!list.length) {
    container.innerHTML = '<p class="no-results">No shelters found. Try a different search or filter.</p>';
    return;
  }
  container.innerHTML = list.map(s => `
    <div class="shelter-card">
      <div class="shelter-card__emoji">${s.emoji}</div>
      <div class="shelter-card__body">
        <h3 class="shelter-card__name">${s.name}</h3>
        <p class="shelter-card__meta">&#128205; ${s.city}, ${s.state} &nbsp;&middot;&nbsp; &#128062; ${s.animals.map(a => a.replace('-', ' ')).join(', ')}</p>
        <p class="shelter-card__desc">${s.description}</p>
        <div class="shelter-card__contacts">
          <span>&#128222; ${s.phone}</span>
          <a href="${s.website}" target="_blank" rel="noopener noreferrer">&#127758; ${s.website.replace('https://', '')}</a>
        </div>
      </div>
      <a href="${s.website}" target="_blank" rel="noopener noreferrer" class="btn-pill shelter-card__cta">Visit &#8594;</a>
    </div>
  `).join('');
}

function filterShelters(query, animalFilter) {
  const q = query.trim().toLowerCase();
  return SHELTERS.filter(s => {
    const matchesQuery = !q ||
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q);
    const matchesAnimal = animalFilter === 'all' || s.animals.includes(animalFilter);
    return matchesQuery && matchesAnimal;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderShelters(SHELTERS);

  const searchInput = document.getElementById('shelter-search');
  const filterBtns = document.querySelectorAll('.filter-pill');
  let activeFilter = 'all';

  searchInput.addEventListener('input', () => {
    renderShelters(filterShelters(searchInput.value, activeFilter));
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderShelters(filterShelters(searchInput.value, activeFilter));
    });
  });
});
