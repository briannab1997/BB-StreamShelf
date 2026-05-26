(function (global) {
  const KEY = "streamshelf-data-v1";
  const clone = value => JSON.parse(JSON.stringify(value));
  const load = () => {
    const saved = global.localStorage?.getItem(KEY);
    return saved ? JSON.parse(saved) : clone(global.STREAMSHELF_SEED);
  };
  const save = data => global.localStorage?.setItem(KEY, JSON.stringify(data));
  const progress = item => Math.round((item.watched / item.episodes) * 100);

  function stats(items) {
    return {
      total: items.length,
      watchlist: items.filter(item => item.status === "Watchlist").length,
      watching: items.filter(item => item.status === "Watching").length,
      favorites: items.filter(item => item.status === "Favorite").length,
      hoursWatched: Math.round(items.reduce((sum, item) => sum + item.watched * item.runtime, 0) / 60)
    };
  }

  function updateStatus(id, status) {
    const items = load();
    const item = items.find(entry => entry.id === id);
    if (!item) throw new Error(`Title not found: ${id}`);
    item.status = status;
    if (status === "Finished" || status === "Favorite") item.watched = item.episodes;
    save(items);
    return clone(item);
  }

  function incrementProgress(id) {
    const items = load();
    const item = items.find(entry => entry.id === id);
    if (!item) throw new Error(`Title not found: ${id}`);
    item.watched = Math.min(item.episodes, item.watched + 1);
    if (item.watched > 0 && item.status === "Watchlist") item.status = "Watching";
    if (item.watched === item.episodes && item.status !== "Favorite") item.status = "Finished";
    save(items);
    return clone(item);
  }

  function pickTonight(items, mood = null) {
    const pool = items.filter(item => item.status !== "Finished" && item.status !== "Favorite");
    const filtered = mood ? pool.filter(item => item.mood === mood) : pool;
    return clone((filtered.length ? filtered : pool).sort((a, b) => b.rating - a.rating)[0]);
  }

  function reset() {
    const items = clone(global.STREAMSHELF_SEED);
    save(items);
    return clone(items);
  }

  global.StreamShelfService = { getItems: () => clone(load()), incrementProgress, pickTonight, progress, reset, stats, updateStatus };
  if (typeof module !== "undefined") module.exports = global.StreamShelfService;
})(typeof window !== "undefined" ? window : globalThis);
