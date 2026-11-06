/* TikTok API for Business (Accounts API): follower demographics, which the Display API in tiktok.js doesn't offer */
import { now, readJSON, writeJSON, round } from "./util.js";

const API = "https://business-api.tiktok.com/open_api/v1.3";
const SCOPES = "user.info.basic,user.insights";
const TOKEN_KEY = "tokens:tiktok-business";
const FIELDS = ["audience_genders", "audience_ages", "audience_countries"];

// Business apps only accept redirect URLs that end with "/"
const redirectUri = env => env.PUBLIC_BASE_URL + "/auth/tiktok-business/callback/";

export function authorizeUrl(env, state) {
  const u = new URL("https://www.tiktok.com/v2/auth/authorize/");
  u.search = new URLSearchParams({
    client_key: env.TIKTOK_BIZ_APP_ID,
    scope: SCOPES,
    response_type: "code",
    redirect_uri: redirectUri(env),
    state
  });
  return u.toString();
}

// Errors come back as HTTP 200 with a non-zero code inside a { code, message, data } envelope
async function bizFetch(path, init, label) {
  const res = await fetch(API + path, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.code !== 0) throw new Error(`TikTok audience ${label}: ${body.message || res.status}`);
  return body.data;
}

// Exchanges a code or refresh token and persists the (possibly rotated) tokens
async function tokenRequest(env, path, params, label) {
  const data = await bizFetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: env.TIKTOK_BIZ_APP_ID, client_secret: env.TIKTOK_BIZ_APP_SECRET, ...params })
  }, label);
  const t = now();
  await writeJSON(env, TOKEN_KEY, {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    openId: data.open_id,
    expiresAt: t + data.expires_in - 300,
    refreshExpiresAt: t + data.refresh_token_expires_in
  });
  return data;
}

export async function handleCallback(env, code) {
  await tokenRequest(env, "/tt_user/oauth2/token/",
    { grant_type: "authorization_code", auth_code: code, redirect_uri: redirectUri(env) }, "code exchange");
}

// Access tokens last 24h, refresh tokens 1 year
async function getToken(env) {
  const t = await readJSON(env, TOKEN_KEY);
  if (!t) throw new Error("TikTok audience not connected — visit /auth/tiktok-business/start");
  if (t.expiresAt > now()) return t;
  if (t.refreshExpiresAt < now()) throw new Error("TikTok audience refresh token expired — reconnect via /auth/tiktok-business/start");
  const data = await tokenRequest(env, "/tt_user/oauth2/refresh_token/",
    { grant_type: "refresh_token", refresh_token: t.refreshToken }, "token refresh");
  return { accessToken: data.access_token, openId: data.open_id };
}

// [{ gender: "Female", percentage: 0.6031 }] -> { Female: 60.31 }
const shares = (list, key) =>
  Array.isArray(list) && list.length ? Object.fromEntries(list.map(x => [x[key], round(x.percentage * 100, 1)])) : null;

export async function fetchStats(env) {
  const { accessToken, openId } = await getToken(env);
  const u = new URLSearchParams({ business_id: openId, fields: JSON.stringify(FIELDS) });
  const data = await bizFetch("/business/get/?" + u, { headers: { "Access-Token": accessToken } }, "insights");

  // TikTok only returns demographics for accounts with at least 100 followers; they lag 24-48h
  const audience = {
    gender: shares(data.audience_genders, "gender"),
    age: shares(data.audience_ages, "age"),
    country: shares(data.audience_countries, "country")
  };
  if (!audience.gender && !audience.age && !audience.country) throw new Error("TikTok audience: no demographics returned");
  return { audience };
}
