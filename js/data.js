const STREAMSHELF_SEED = [
  { id: "m1", title: "Blue Hour", type: "Series", genre: "Drama", platform: "Hulu", mood: "Moody", status: "Watching", rating: 4.7, episodes: 10, watched: 6, runtime: 48, note: "Slow-burn mystery with pretty cinematography and a weekly cliffhanger feel.", color: "#63d2ff" },
  { id: "m2", title: "City Lights Club", type: "Movie", genre: "Comedy", platform: "Netflix", mood: "Fun", status: "Watchlist", rating: 4.2, episodes: 1, watched: 0, runtime: 112, note: "Good for a low-stress Friday night when the goal is easy laughs.", color: "#ff5e9c" },
  { id: "m3", title: "Signal Run", type: "Series", genre: "Sci-Fi", platform: "Prime", mood: "Intense", status: "Favorite", rating: 4.9, episodes: 8, watched: 8, runtime: 52, note: "Smart pacing, big finale, and the kind of ending worth rewatching.", color: "#9cff6e" },
  { id: "m4", title: "Soft Serve Summer", type: "Movie", genre: "Romance", platform: "Max", mood: "Cozy", status: "Finished", rating: 4.1, episodes: 1, watched: 1, runtime: 96, note: "Cute comfort watch with bright visuals and a breezy weekend tone.", color: "#ffe56b" },
  { id: "m5", title: "Archive 77", type: "Series", genre: "Thriller", platform: "Apple TV", mood: "Suspense", status: "Watchlist", rating: 4.5, episodes: 9, watched: 0, runtime: 44, note: "Queued for a weekend binge when a darker mystery sounds right.", color: "#a78bfa" },
  { id: "m6", title: "Kitchen Passport", type: "Series", genre: "Lifestyle", platform: "Disney+", mood: "Chill", status: "Watching", rating: 4.3, episodes: 12, watched: 3, runtime: 31, note: "Easy background watch with travel, food, and low-pressure episodes.", color: "#ff9f6e" },
  { id: "m7", title: "After Midnight Arcade", type: "Series", genre: "Action", platform: "Peacock", mood: "High Energy", status: "Watchlist", rating: 4.6, episodes: 6, watched: 0, runtime: 42, note: "Fast, neon, and perfect for a night where quiet drama is not the move.", color: "#00f0ff" },
  { id: "m8", title: "The Little Observatory", type: "Movie", genre: "Documentary", platform: "YouTube", mood: "Curious", status: "Watchlist", rating: 4.4, episodes: 1, watched: 0, runtime: 74, note: "A calm science pick for when curiosity wins over another scripted series.", color: "#f2c4ce" }
];

if (typeof globalThis !== "undefined") globalThis.STREAMSHELF_SEED = STREAMSHELF_SEED;
if (typeof module !== "undefined") module.exports = STREAMSHELF_SEED;
