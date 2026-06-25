let items = StreamShelfService.getItems();
let selectedId = null;
let activeMood = "All";
let featuredIndex = 0;
let carouselTimer = null;

const hero = document.getElementById("hero");
const heroTitle = document.getElementById("hero-title");
const heroKicker = document.getElementById("hero-kicker");
const heroDescription = document.getElementById("hero-description");
const heroTags = document.getElementById("hero-tags");
const heroDots = document.getElementById("hero-dots");
const previewWindow = document.getElementById("preview-window");
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

function titleInitials(item) {
  return item.title.split(" ").map(word => word[0]).join("").slice(0, 3);
}

function withDefaults(item) {
  return {
    ...item,
    tagline: item.tagline || item.note,
    accent: item.accent || item.color,
    poster: item.poster || "default",
    preview: item.preview || item.note
  };
}

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

function featuredItems() {
  const priority = ["Watching", "Watchlist", "Favorite", "Finished"];
  return [...items]
    .sort((a, b) => priority.indexOf(a.status) - priority.indexOf(b.status) || b.rating - a.rating)
    .slice(0, 5)
    .map(withDefaults);
}

function setFeatured(index, userInitiated = false) {
  const featured = featuredItems();
  if (!featured.length) return;
  featuredIndex = (index + featured.length) % featured.length;
  const item = featured[featuredIndex];
  const percent = StreamShelfService.progress(item);

  hero.style.setProperty("--hero-color", item.color);
  hero.style.setProperty("--hero-accent", item.accent);
  hero.style.setProperty("--hero-bg", `linear-gradient(90deg, rgba(16, 13, 22, 0.98) 0%, rgba(16, 13, 22, 0.78) 48%, rgba(16, 13, 22, 0.24) 100%), radial-gradient(circle at 82% 28%, ${item.color}88, transparent 32%), linear-gradient(135deg, #130f17, #251529 64%, #101d24)`);
  heroKicker.textContent = `${item.type} spotlight`;
  heroTitle.textContent = item.title;
  heroDescription.textContent = `${item.tagline} ${item.preview}`;
  heroTags.innerHTML = [item.platform, item.genre, item.mood, `${item.rating}/5`, `${percent}% watched`].map(tag => `<span>${tag}</span>`).join("");
  previewWindow.innerHTML = `
    <div class="preview-art poster-${item.poster}" style="--poster:${item.color}; --accent:${item.accent}">
      <div class="preview-frame">
        <span>${titleInitials(item)}</span>
        <i></i>
      </div>
      <div class="preview-caption">
        <b>${item.title}</b>
        <small>${item.preview}</small>
      </div>
    </div>
  `;
  heroDots.innerHTML = featured.map((entry, dotIndex) => `
    <button class="${dotIndex === featuredIndex ? "active" : ""}" data-featured-index="${dotIndex}" aria-label="Show ${entry.title}"></button>
  `).join("");

  if (userInitiated) restartCarousel();
}

function restartCarousel() {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(() => setFeatured(featuredIndex + 1), 6500);
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
  item = withDefaults(item);
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
  const item = withDefaults(items
    .filter(entry => entry.status === "Watching")
    .sort((a, b) => StreamShelfService.progress(b) - StreamShelfService.progress(a))[0] || items[0]);
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
  item = withDefaults(item);
  const percent = StreamShelfService.progress(item);
  return `
    <article class="media-card" data-id="${item.id}" style="--poster:${item.color}; --accent:${item.accent}">
      <div class="poster poster-${item.poster}">
        <span>${titleInitials(item)}</span>
        <em>${item.tagline}</em>
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
  item = withDefaults(item);
  const percent = StreamShelfService.progress(item);
  return `
    <button class="rail-card" data-id="${item.id}" style="--poster:${item.color}; --accent:${item.accent}">
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
  const item = withDefaults(items.find(entry => entry.id === id));
  drawerContent.innerHTML = `
    <div class="drawer-poster poster-${item.poster}" style="--poster:${item.color}; --accent:${item.accent}">
      <span>${titleInitials(item)}</span>
    </div>
    <p class="eyebrow">${item.platform} · ${item.genre}</p>
    <h2>${item.title}</h2>
    <h3>${item.tagline}</h3>
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
  setFeatured(featuredIndex);
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

document.getElementById("hero-play").addEventListener("click", () => {
  const item = featuredItems()[featuredIndex];
  showToast(`Previewing ${item.title}`);
  previewWindow.classList.remove("pulse");
  requestAnimationFrame(() => previewWindow.classList.add("pulse"));
});

document.getElementById("hero-pick").addEventListener("click", () => {
  const item = featuredItems()[featuredIndex];
  openDrawer(item.id);
  showToast("Title details opened");
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

heroDots.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  setFeatured(Number(button.dataset.featuredIndex), true);
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
restartCarousel();
