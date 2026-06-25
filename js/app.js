let items = StreamShelfService.getItems();
let selectedId = null;
let activeMood = "All";

const grid = document.getElementById("media-grid");
const drawer = document.getElementById("drawer");
const drawerContent = document.getElementById("drawer-content");
const search = document.getElementById("search");
const genreFilter = document.getElementById("genre-filter");
const platformFilter = document.getElementById("platform-filter");
const statusFilter = document.getElementById("status-filter");
const toast = document.getElementById("toast");
const moodButtons = document.getElementById("mood-buttons");
const continueRail = document.getElementById("continue-rail");
const queueCount = document.getElementById("queue-count");
const resultCount = document.getElementById("result-count");

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

function renderMoodButtons() {
  const moods = ["All", ...unique("mood")];
  moodButtons.innerHTML = moods.map(mood => `
    <button class="${mood === activeMood ? "active" : ""}" data-mood="${mood}">
      ${mood}
    </button>
  `).join("");
}

function filteredItems() {
  const q = search.value.trim().toLowerCase();
  return items.filter(item => {
    const text = `${item.title} ${item.platform} ${item.genre} ${item.mood}`.toLowerCase();
    return (!q || text.includes(q))
      && (activeMood === "All" || item.mood === activeMood)
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
    <span>Tonight's Queue</span>
    <strong>${item.title}</strong>
    <p>${item.genre} on ${item.platform} · ${item.mood}</p>
    <div class="pick-score">
      <i style="width:${Math.round(item.rating * 20)}%"></i>
    </div>
    <small>${item.rating}/5 match based on mood, status, and rating.</small>
  `;
}

function renderSpotlight() {
  const item = items
    .filter(entry => entry.status === "Watching")
    .sort((a, b) => StreamShelfService.progress(b) - StreamShelfService.progress(a))[0] || items[0];
  const percent = StreamShelfService.progress(item);
  document.getElementById("spotlight-title").textContent = item.title;
  document.getElementById("spotlight-copy").textContent = item.note;
  document.getElementById("spotlight-progress").textContent = `${percent}%`;
  document.getElementById("spotlight-bar").style.width = `${percent}%`;
  document.getElementById("spotlight-tags").innerHTML = [item.platform, item.genre, item.mood].map(tag => `<span>${tag}</span>`).join("");
  document.getElementById("spotlight-next").textContent = item.watched < item.episodes
    ? `Next up: episode ${item.watched + 1} of ${item.episodes}`
    : "Finished and ready to rate or favorite.";
}

function card(item) {
  const percent = StreamShelfService.progress(item);
  return `
    <article class="media-card" data-id="${item.id}" style="--poster:${item.color}">
      <div class="poster">
        <span>${item.title.split(" ").map(word => word[0]).join("").slice(0, 3)}</span>
        <b>${item.platform}</b>
      </div>
      <div class="media-copy">
        <div class="card-line"><span>${item.type}</span><strong>${item.rating}</strong></div>
        <h3>${item.title}</h3>
        <p>${item.genre} · ${item.platform}</p>
        <div class="mini-progress"><i style="width:${percent}%"></i></div>
        <div class="status-row"><span>${item.status}</span><span>${percent}%</span></div>
      </div>
    </article>
  `;
}

function railCard(item) {
  const percent = StreamShelfService.progress(item);
  return `
    <button class="rail-card" data-id="${item.id}" style="--poster:${item.color}">
      <span>${item.title}</span>
      <small>${item.platform} · ${percent}% complete</small>
      <i><b style="width:${percent}%"></b></i>
    </button>
  `;
}

function renderContinueRail() {
  const active = items
    .filter(item => item.status === "Watching")
    .sort((a, b) => StreamShelfService.progress(b) - StreamShelfService.progress(a));
  queueCount.textContent = `${active.length} active title${active.length === 1 ? "" : "s"}`;
  continueRail.innerHTML = active.map(railCard).join("") || `<p class="empty">Start a title from the library and it will appear here.</p>`;
}

function renderGrid() {
  const results = filteredItems();
  resultCount.textContent = `${results.length} title${results.length === 1 ? "" : "s"} showing`;
  grid.innerHTML = results.map(card).join("") || `<p class="empty">No titles match the current filters.</p>`;
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
    <div class="drawer-progress">
      <span>Progress</span>
      <i><b style="width:${StreamShelfService.progress(item)}%"></b></i>
    </div>
    <div class="drawer-actions">
      <button data-action="progress">Watch Next</button>
      <button data-status="Watching">Watching</button>
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
  renderPick(StreamShelfService.pickTonight(items, activeMood === "All" ? null : activeMood));
  renderMoodButtons();
  renderSpotlight();
  renderContinueRail();
  renderGrid();
}

document.getElementById("pick-tonight").addEventListener("click", () => {
  renderPick(StreamShelfService.pickTonight(items, activeMood === "All" ? null : activeMood));
  showToast(activeMood === "All" ? "Picked your strongest match" : `Picked a ${activeMood.toLowerCase()} match`);
});

document.getElementById("hero-pick").addEventListener("click", () => {
  const pick = StreamShelfService.pickTonight(items, activeMood === "All" ? null : activeMood);
  openDrawer(pick.id);
  showToast("Tonight's queue is ready");
});

document.getElementById("reset-demo").addEventListener("click", () => {
  items = StreamShelfService.reset();
  activeMood = "All";
  fillFilters();
  refresh();
  showToast("Demo reset");
});

document.addEventListener("click", event => {
  const card = event.target.closest(".media-card, .rail-card");
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

moodButtons.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  activeMood = button.dataset.mood;
  renderMoodButtons();
  renderPick(StreamShelfService.pickTonight(items, activeMood === "All" ? null : activeMood));
  renderGrid();
});

drawer.addEventListener("click", event => {
  if (event.target === drawer) {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
  }
});

[search, genreFilter, platformFilter, statusFilter].forEach(control => control.addEventListener("input", renderGrid));

fillFilters();
refresh();
