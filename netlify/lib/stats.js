/* Fetches every platform and stores the combined result as stats.json */
import * as instagram from "./instagram.js";
import * as tiktok from "./tiktok.js";
import { readJSON, writeJSON } from "./util.js";

export const PLATFORMS = { instagram, tiktok };
export const LABELS = { instagram: "Instagram", tiktok: "TikTok" };
export const STATS_KEY = "stats";

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
  return report;
}
