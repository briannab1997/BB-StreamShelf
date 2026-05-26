const assert = require("node:assert/strict");
globalThis.localStorage = { data: {}, getItem(k) { return this.data[k] || null; }, setItem(k, v) { this.data[k] = v; } };
require("../js/data");
const service = require("../js/mediaService");

let items = service.reset();
assert.equal(items.length, 6);
assert.equal(service.stats(items).watching, 2);
assert.equal(service.progress(items[0]), 60);

const updated = service.incrementProgress("m2");
assert.equal(updated.status, "Finished");
assert.equal(updated.watched, 1);

const favorite = service.updateStatus("m1", "Favorite");
assert.equal(favorite.watched, favorite.episodes);

const pick = service.pickTonight(service.getItems());
assert.equal(Boolean(pick.title), true);

console.log("All StreamShelf tests passed.");
