/* Instagram API with Instagram Login (graph.instagram.com) */
import { DAY, now, readJSON, writeJSON, pct } from "./util.js";

const API_VERSION = "v26.0";
const GRAPH = "https://graph.instagram.com";
const SCOPES = "instagram_business_basic,instagram_business_manage_insights";
const TOKEN_KEY = "tokens:instagram";
const PERIOD_DAYS = 30; // longest since/until range the insights endpoint accepts
const REFRESH_WHEN_LEFT = 15 * DAY;

const TOTALS = ["views", "reach", "accounts_engaged", "total_interactions", "likes", "comments", "shares", "saves"];

const redirectUri = env => env.PUBLIC_BASE_URL + "/auth/instagram/callback";

export function authorizeUrl(env, state) {
  const u = new URL("https://www.instagram.com/oauth/authorize");
  u.search = new URLSearchParams({
    client_id: env.IG_APP_ID,
    redirect_uri: redirectUri(env),
    response_type: "code",
    scope: SCOPES,
    state
  });
  return u.toString();
}

// Errors never include the request URL: it carries the access token
async function igFetch(url, init, label) {
  const res = await fetch(url, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.error) {
    throw new Error(`Instagram ${label}: ${body.error?.message || body.error_message || res.status}`);
  }
  return body;
}

const get = (token, path, params, label) => {
  const u = new URL(`${GRAPH}/${API_VERSION}/${path}`);
  u.search = new URLSearchParams({ ...params, access_token: token });
  return igFetch(u, {}, label);
};

async function saveToken(env, t, userId) {
  await writeJSON(env, TOKEN_KEY, {
    accessToken: t.access_token,
    userId,
    issuedAt: now(),
    expiresAt: now() + (t.expires_in || 60 * DAY)
  });
}

export async function handleCallback(env, code) {
  const form = new URLSearchParams({
    client_id: env.IG_APP_ID,
    client_secret: env.IG_APP_SECRET,
    grant_type: "authorization_code",
    redirect_uri: redirectUri(env),
    code
  });
  const short = await igFetch("https://api.instagram.com/oauth/access_token", { method: "POST", body: form }, "code exchange");
  const s = short.data?.[0] || short; // older responses wrap the token in data[]

  const u = new URL(GRAPH + "/access_token");
  u.search = new URLSearchParams({ grant_type: "ig_exchange_token", client_secret: env.IG_APP_SECRET, access_token: s.access_token });
  const long = await igFetch(u, {}, "long-lived token");
  await saveToken(env, long, String(s.user_id));
}

// Long-lived tokens last 60 days; refresh once fewer than 15 remain (must be >24h old)
async function getToken(env) {
  const t = await readJSON(env, TOKEN_KEY);
  if (!t) throw new Error("Instagram not connected — visit /auth/instagram/start");
  if (t.expiresAt < now()) throw new Error("Instagram token expired — reconnect via /auth/instagram/start");
  if (t.expiresAt - now() < REFRESH_WHEN_LEFT && now() - t.issuedAt > DAY) {
    const u = new URL(GRAPH + "/refresh_access_token");
    u.search = new URLSearchParams({ grant_type: "ig_refresh_token", access_token: t.accessToken });
    const fresh = await igFetch(u, {}, "token refresh");
    await saveToken(env, fresh, t.userId);
    return fresh.access_token;
  }
  return t.accessToken;
}

// One request per metric: an unsupported metric shouldn't take the others down
async function insight(token, metric, params) {
  try {
    const label = params.breakdown ? metric + " by " + params.breakdown : metric;
    const body = await get(token, "me/insights", { metric, period: "day", metric_type: "total_value", ...params }, label);
    return body.data?.[0]?.total_value ?? null;
  } catch (err) {
    console.error(err.message);
    return null;
  }
}

// { dimension_value: value } for a single-dimension breakdown
const breakdown = totalValue => {
  const results = totalValue?.breakdowns?.[0]?.results;
  if (!results) return null;
  return Object.fromEntries(results.map(r => [r.dimension_values.join(" "), r.value]));
};

export async function fetchStats(env) {
  const token = await getToken(env);
  const profile = await get(token, "me", { fields: "username,followers_count,media_count" }, "profile");

  const until = now();
  const range = { since: until - PERIOD_DAYS * DAY, until };
  const lifetime = { period: "lifetime" };

  const [totals, byFollow, byType, age, gender, country] = await Promise.all([
    Promise.all(TOTALS.map(m => insight(token, m, range))),
    insight(token, "views", { ...range, breakdown: "follow_type" })
      .then(v => v || insight(token, "views", { ...range, breakdown: "follower_type" })),
    insight(token, "views", { ...range, breakdown: "media_product_type" }),
    insight(token, "follower_demographics", { ...lifetime, breakdown: "age" }),
    insight(token, "follower_demographics", { ...lifetime, breakdown: "gender" }),
    insight(token, "follower_demographics", { ...lifetime, breakdown: "country" })
  ]);
  const t = Object.fromEntries(TOTALS.map((m, i) => [m, totals[i]?.value ?? null]));

  const follow = breakdown(byFollow);
  const nonFollowerViewsPct = follow
    ? pct(follow.NON_FOLLOWER || 0, (follow.FOLLOWER || 0) + (follow.NON_FOLLOWER || 0))
    : null;

  const types = breakdown(byType);
  let viewsByType = null;
  if (types) {
    const stories = types.STORY || 0, reels = types.REEL || 0;
    const posts = (types.POST || 0) + (types.CAROUSEL_CONTAINER || 0);
    const sum = stories + reels + posts;
    if (sum > 0) viewsByType = { stories: pct(stories, sum), reels: pct(reels, sum), posts: pct(posts, sum) };
  }

  return {
    username: profile.username,
    followers: profile.followers_count ?? null,
    mediaCount: profile.media_count ?? null,
    periodDays: PERIOD_DAYS,
    views: t.views,
    reach: t.reach,
    accountsEngaged: t.accounts_engaged,
    totalInteractions: t.total_interactions,
    likes: t.likes,
    comments: t.comments,
    shares: t.shares,
    saves: t.saves,
    // same definition as TikTok: interactions / views
    engagementRate: t.views ? pct(t.total_interactions || 0, t.views) : null,
    nonFollowerViewsPct,
    viewsByType,
    demographics: { age: breakdown(age), gender: breakdown(gender), country: breakdown(country) }
  };
}
