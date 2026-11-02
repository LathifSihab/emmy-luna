/* TikTok Login Kit v2 + Display API */
import { DAY, now, readJSON, writeJSON, pct } from "./util.js";

const API = "https://open.tiktokapis.com/v2";
const SCOPES = "user.info.basic,user.info.stats,video.list";
const TOKEN_KEY = "tokens:tiktok";
const PERIOD_DAYS = 60;
const MAX_PAGES = 25; // 20 videos per page

const redirectUri = env => env.PUBLIC_BASE_URL + "/auth/tiktok/callback";

export function authorizeUrl(env, state) {
  const u = new URL("https://www.tiktok.com/v2/auth/authorize/");
  u.search = new URLSearchParams({
    client_key: env.TIKTOK_CLIENT_KEY,
    scope: SCOPES,
    response_type: "code",
    redirect_uri: redirectUri(env),
    state
  });
  return u.toString();
}

// Exchanges a code or refresh token and persists the (possibly rotated) tokens
async function tokenRequest(env, params, label) {
  const res = await fetch(API + "/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_key: env.TIKTOK_CLIENT_KEY, client_secret: env.TIKTOK_CLIENT_SECRET, ...params })
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.access_token) {
    throw new Error(`TikTok ${label}: ${body.error_description || body.error || res.status}`);
  }
  const t = now();
  await writeJSON(env, TOKEN_KEY, {
    accessToken: body.access_token,
    refreshToken: body.refresh_token,
    openId: body.open_id,
    expiresAt: t + body.expires_in - 300,
    refreshExpiresAt: t + body.refresh_expires_in
  });
  return body.access_token;
}

export async function handleCallback(env, code) {
  await tokenRequest(env, { code, grant_type: "authorization_code", redirect_uri: redirectUri(env) }, "code exchange");
}

// Access tokens last 24h, refresh tokens ~365 days
async function getToken(env) {
  const t = await readJSON(env, TOKEN_KEY);
  if (!t) throw new Error("TikTok not connected — visit /auth/tiktok/start");
  if (t.expiresAt > now()) return t.accessToken;
  if (t.refreshExpiresAt < now()) throw new Error("TikTok refresh token expired — reconnect via /auth/tiktok/start");
  return tokenRequest(env, { grant_type: "refresh_token", refresh_token: t.refreshToken }, "token refresh");
}

async function call(token, path, init = {}) {
  const res = await fetch(API + path, {
    ...init,
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" }
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || (body.error && body.error.code !== "ok")) {
    throw new Error(`TikTok ${path.split("?")[0]}: ${body.error?.message || res.status}`);
  }
  return body.data;
}

export async function fetchStats(env) {
  const token = await getToken(env);
  const { user } = await call(token, "/user/info/?fields=follower_count,likes_count,video_count");

  // Lifetime counts of videos posted in the last 60 days (the Display API has no time-windowed analytics)
  const cutoff = now() - PERIOD_DAYS * DAY;
  const sum = { videos: 0, views: 0, likes: 0, comments: 0, shares: 0 };
  let cursor;
  for (let p = 0; p < MAX_PAGES; p++) {
    const data = await call(token, "/video/list/?fields=id,create_time,view_count,like_count,comment_count,share_count", {
      method: "POST",
      body: JSON.stringify(cursor ? { max_count: 20, cursor } : { max_count: 20 })
    });
    const videos = data.videos || [];
    const recent = videos.filter(v => v.create_time >= cutoff);
    recent.forEach(v => {
      sum.videos++;
      sum.views += v.view_count || 0;
      sum.likes += v.like_count || 0;
      sum.comments += v.comment_count || 0;
      sum.shares += v.share_count || 0;
    });
    // pinned videos can be old, so only stop once a whole page is past the cutoff
    if (!data.has_more || (videos.length && !recent.length)) break;
    cursor = data.cursor;
  }

  return {
    followers: user.follower_count ?? null,
    totalLikes: user.likes_count ?? null,
    videoCount: user.video_count ?? null,
    periodDays: PERIOD_DAYS,
    videosInPeriod: sum.videos,
    views: sum.views,
    likes: sum.likes,
    comments: sum.comments,
    shares: sum.shares,
    engagementRate: pct(sum.likes + sum.comments + sum.shares, sum.views)
  };
}
