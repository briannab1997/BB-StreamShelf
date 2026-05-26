const STREAMSHELF_SEED = [
  { id: "m1", title: "Blue Hour", type: "Series", genre: "Drama", platform: "Hulu", mood: "Moody", status: "Watching", rating: 4.7, episodes: 10, watched: 6, runtime: 48, note: "Slow-burn mystery with pretty cinematography.", color: "#63d2ff" },
  { id: "m2", title: "City Lights Club", type: "Movie", genre: "Comedy", platform: "Netflix", mood: "Fun", status: "Watchlist", rating: 4.2, episodes: 1, watched: 0, runtime: 112, note: "Good for a low-stress Friday night.", color: "#ff5e9c" },
  { id: "m3", title: "Signal Run", type: "Series", genre: "Sci-Fi", platform: "Prime", mood: "Intense", status: "Favorite", rating: 4.9, episodes: 8, watched: 8, runtime: 52, note: "Smart pacing, big finale, worth rewatching.", color: "#c7ff5e" },
  { id: "m4", title: "Soft Serve Summer", type: "Movie", genre: "Romance", platform: "Max", mood: "Cozy", status: "Finished", rating: 4.1, episodes: 1, watched: 1, runtime: 96, note: "Cute comfort watch with bright visuals.", color: "#ffe56b" },
  { id: "m5", title: "Archive 77", type: "Series", genre: "Thriller", platform: "Apple TV", mood: "Suspense", status: "Watchlist", rating: 4.5, episodes: 9, watched: 0, runtime: 44, note: "Queued for a weekend binge.", color: "#a78bfa" },
  { id: "m6", title: "Kitchen Passport", type: "Series", genre: "Lifestyle", platform: "Disney+", mood: "Chill", status: "Watching", rating: 4.3, episodes: 12, watched: 3, runtime: 31, note: "Easy background watch while cooking.", color: "#ff9f6e" }
];

if (typeof globalThis !== "undefined") globalThis.STREAMSHELF_SEED = STREAMSHELF_SEED;
if (typeof module !== "undefined") module.exports = STREAMSHELF_SEED;
