let items = StreamShelfService.getItems();
let selectedId = null;

const grid = document.getElementById("media-grid");
const drawer = document.getElementById("drawer");
const drawerContent = document.getElementById("drawer-content");
const search = document.getElementById("search");
const genreFilter = document.getElementById("genre-filter");
const platformFilter = document.getElementById("platform-filter");
const statusFilter = document.getElementById("status-filter");
const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function unique(key) {
  return [...new Set(items.map(item => item[key]))].sort();
}

function fillFilters() {
  genreFilter.innerHTML = `<option value="All">All Genres</option>${unique("genre").map(value => `<option>${value}</option>`).join("")}`;
  platformFilter.innerHTML = `<option value="All">All Platforms</option>${unique("platform").map(value => `<option>${value}</option>`).join("")}`;
}

function filteredItems() {
  const q = search.value.trim().toLowerCase();
  return items.filter(item => {
    const text = `${item.title} ${item.platform} ${item.genre} ${item.mood}`.toLowerCase();
    return (!q || text.includes(q))
      && (genreFilter.value === "All" || item.genre === genreFilter.value)
      && (platformFilter.value === "All" || item.platform === platformFilter.value)
      && (statusFilter.value === "All" || item.status === statusFilter.value);
  });
}

function renderMetrics() {
  const stats = StreamShelfService.stats(items);
  document.getElementById("metrics").innerHTML = [
    ["Total Titles", stats.total],
    ["Watchlist", stats.watchlist],
    ["Watching", stats.watching],
    ["Hours Watched", stats.hoursWatched]
  ].map(([label, value]) => `<article><span>${label}</span><strong>${value}</strong></article>`).join("");
}

function renderPick(item = StreamShelfService.pickTonight(items)) {
  document.getElementById("tonight-pick").innerHTML = `
    <span>Tonight's Pick</span>
    <strong>${item.title}</strong>
    <p>${item.genre} on ${item.platform} · ${item.mood}</p>
  `;
}

function renderSpotlight() {
  const item = items.find(entry => entry.status === "Watching") || items[0];
  const percent = StreamShelfService.progress(item);
  document.getElementById("spotlight-title").textContent = item.title;
  document.getElementById("spotlight-copy").textContent = item.note;
  document.getElementById("spotlight-progress").textContent = `${percent}%`;
  document.getElementById("spotlight-bar").style.width = `${percent}%`;
  document.getElementById("spotlight-tags").innerHTML = [item.platform, item.genre, item.mood].map(tag => `<span>${tag}</span>`).join("");
}

function card(item) {
  return `
    <article class="media-card" data-id="${item.id}" style="--poster:${item.color}">
      <div class="poster"><span>${item.title.split(" ").map(word => word[0]).join("").slice(0, 3)}</span></div>
      <div class="media-copy">
        <div class="card-line"><span>${item.type}</span><strong>${item.rating}</strong></div>
        <h3>${item.title}</h3>
        <p>${item.genre} · ${item.platform}</p>
        <div class="status-row"><span>${item.status}</span><span>${StreamShelfService.progress(item)}%</span></div>
      </div>
    </article>
  `;
}

function renderGrid() {
  grid.innerHTML = filteredItems().map(card).join("") || `<p class="empty">No titles match the current filters.</p>`;
}

function openDrawer(id) {
  selectedId = id;
  const item = items.find(entry => entry.id === id);
  drawerContent.innerHTML = `
    <p class="eyebrow">${item.platform} · ${item.genre}</p>
    <h2>${item.title}</h2>
    <p>${item.note}</p>
    <div class="detail-grid">
      <div><span>Status</span><strong>${item.status}</strong></div>
      <div><span>Rating</span><strong>${item.rating}/5</strong></div>
      <div><span>Progress</span><strong>${item.watched}/${item.episodes}</strong></div>
      <div><span>Mood</span><strong>${item.mood}</strong></div>
    </div>
    <div class="drawer-actions">
      <button data-action="progress">Watch Next</button>
      <button data-status="Watchlist">Watchlist</button>
      <button data-status="Favorite">Favorite</button>
      <button data-status="Finished">Finished</button>
    </div>
  `;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
}

function refresh() {
  renderMetrics();
  renderPick();
  renderSpotlight();
  renderGrid();
}

document.getElementById("pick-tonight").addEventListener("click", () => {
  renderPick(StreamShelfService.pickTonight(items));
  showToast("Picked your strongest match");
});

document.getElementById("reset-demo").addEventListener("click", () => {
  items = StreamShelfService.reset();
  fillFilters();
  refresh();
  showToast("Demo reset");
});

grid.addEventListener("click", event => {
  const card = event.target.closest(".media-card");
  if (card) openDrawer(card.dataset.id);
});

drawerContent.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button || !selectedId) return;
  if (button.dataset.action === "progress") StreamShelfService.incrementProgress(selectedId);
  if (button.dataset.status) StreamShelfService.updateStatus(selectedId, button.dataset.status);
  items = StreamShelfService.getItems();
  openDrawer(selectedId);
  refresh();
  showToast("Shelf updated");
});

document.getElementById("close-drawer").addEventListener("click", () => {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
});

[search, genreFilter, platformFilter, statusFilter].forEach(control => control.addEventListener("input", renderGrid));

fillFilters();
refresh();
