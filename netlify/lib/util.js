/* Shared helpers for the stats functions */
import { timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";

export const DAY = 86400;
export const now = () => Math.floor(Date.now() / 1000);

// Settings + storage handed to the platform modules. PUBLIC_BASE_URL overrides the
// site's primary URL; set it if the OAuth redirect URIs should stay on another domain.
export function getEnv() {
  const get = name => Netlify.env.get(name);
  return {
    IG_APP_ID: get("IG_APP_ID"),
    IG_APP_SECRET: get("IG_APP_SECRET"),
    IG_CONFIG_ID: get("IG_CONFIG_ID"),
    TIKTOK_CLIENT_KEY: get("TIKTOK_CLIENT_KEY"),
    TIKTOK_CLIENT_SECRET: get("TIKTOK_CLIENT_SECRET"),
    ADMIN_KEY: get("ADMIN_KEY"),
    PUBLIC_BASE_URL: (get("PUBLIC_BASE_URL") || get("URL")).replace(/\/$/, ""),
    store: getStore({ name: "social-stats", consistency: "strong" })
  };
}

export const readJSON = (env, key) => env.store.get(key, { type: "json" });
export const writeJSON = (env, key, value) => env.store.setJSON(key, value);

export const round = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
export const pct = (part, whole) => (whole > 0 ? round((part / whole) * 100) : null);

const escapeHtml = s => String(s).replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);

export function page(title, message, status = 200) {
  const body = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
<body style="font:16px/1.5 system-ui,sans-serif;max-width:32rem;margin:15vh auto;padding:0 16px;color:#382c29;background:#faf6f1">
<h1 style="font-weight:500">${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p></body>`;
  return new Response(body, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

// ?key=ADMIN_KEY guards the routes that start OAuth or force a refresh
export function isAdmin(url, env) {
  const given = Buffer.from(url.searchParams.get("key") || "");
  const expected = Buffer.from(env.ADMIN_KEY || "");
  return expected.length > 0 && given.length === expected.length && timingSafeEqual(given, expected);
}

// OAuth CSRF state: single use, expires after 10 minutes (Blobs has no TTL, so it's checked here)
export async function createState(env, platform) {
  const state = crypto.randomUUID();
  await writeJSON(env, "state/" + state, { platform, expiresAt: now() + 600 });
  return state;
}

export async function consumeState(env, state, platform) {
  if (!state || !/^[0-9a-f-]{36}$/.test(state)) return false;
  const key = "state/" + state;
  const value = await readJSON(env, key);
  if (value) await env.store.delete(key);
  return value?.platform === platform && value.expiresAt > now();
}
