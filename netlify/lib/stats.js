/* Fetches every platform and stores the combined result as stats.json */
import * as instagram from "./instagram.js";
import * as tiktok from "./tiktok.js";
import * as tiktokBusiness from "./tiktok-business.js";
import { purgeCache } from "@netlify/functions";
import { readJSON, writeJSON } from "./util.js";

// Keys double as the /auth/:platform/ path segment and the stats.json key
export const PLATFORMS = { instagram, tiktok, "tiktok-business": tiktokBusiness };
export const LABELS = { instagram: "Instagram", tiktok: "TikTok", "tiktok-business": "TikTok audience" };
export const STATS_KEY = "stats";
export const STATS_CACHE_TAG = "stats";

// A failed platform keeps its last good data; per-platform updatedAt shows its age
export async function refreshAll(env) {
  const prev = (await readJSON(env, STATS_KEY)) || {};
  const updatedAt = new Date().toISOString();
  const next = { updatedAt };
  const report = {};
  await Promise.all(Object.entries(PLATFORMS).map(async ([name, platform]) => {
    try {
      next[name] = { ...(await platform.fetchStats(env)), updatedAt };
      report[name] = "ok";
    } catch (err) {
      console.error(err.message);
      next[name] = prev[name] ?? null;
      report[name] = err.message;
    }
  }));
  await writeJSON(env, STATS_KEY, next);
  // Visitors still get the browser's own copy for up to max-age (10 min)
  await purgeCache({ tags: [STATS_CACHE_TAG] }).catch(err => console.error("Cache purge: " + err.message));
  return report;
}
