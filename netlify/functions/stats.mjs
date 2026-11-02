/* GET /stats.json: the latest stats for live-stats.js (same origin, so no CORS) */
import { getEnv, readJSON } from "../lib/util.js";
import { STATS_KEY } from "../lib/stats.js";

export default async () => {
  const stats = await readJSON(getEnv(), STATS_KEY);
  return Response.json(stats || { updatedAt: null, instagram: null, tiktok: null }, {
    headers: {
      "Cache-Control": "public, max-age=600",
      // cache on Netlify's CDN too, so most visits don't run the function
      "Netlify-CDN-Cache-Control": "public, durable, s-maxage=600, stale-while-revalidate=3600"
    }
  });
};

export const config = { path: "/stats.json", method: "GET" };
