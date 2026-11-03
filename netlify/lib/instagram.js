/* Instagram API with Unified login (Facebook Login for Business, graph.facebook.com).
   New Meta apps can't use Instagram Login (instagram.com/oauth) any more. */
import { DAY, now, readJSON, writeJSON, pct } from "./util.js";

const API_VERSION = "v26.0";
const GRAPH = "https://graph.facebook.com/" + API_VERSION;
const TOKEN_KEY = "tokens:instagram";
const PERIOD_DAYS = 30; // longest since/until range the insights endpoint accepts

const TOTALS = ["views", "reach", "accounts_engaged", "total_interactions", "likes", "comments", "shares", "saves"];

const redirectUri = env => env.PUBLIC_BASE_URL + "/auth/instagram/callback";

// The permissions come from the login configuration (IG_CONFIG_ID), not a scope param
export function authorizeUrl(env, state) {
  const u = new URL(`https://www.facebook.com/${API_VERSION}/dialog/oauth`);
  u.search = new URLSearchParams({
    client_id: env.IG_APP_ID,
    config_id: env.IG_CONFIG_ID,
    redirect_uri: redirectUri(env),
    response_type: "code",
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
  const u = new URL(`${GRAPH}/${path}`);
  u.search = new URLSearchParams({ ...params, access_token: token });
  return igFetch(u, {}, label);
};

// The code becomes a business integration system user token; its expiry is set in the
// login configuration (default: never), so there's no refresh step
export async function handleCallback(env, code) {
  const u = new URL(GRAPH + "/oauth/access_token");
  u.search = new URLSearchParams({
    client_id: env.IG_APP_ID,
    client_secret: env.IG_APP_SECRET,
    redirect_uri: redirectUri(env),
    code
  });
  const t = await igFetch(u, {}, "code exchange");

  const { data = [] } = await get(t.access_token, "me/assigned_instagram_accounts", { fields: "id,username" }, "account lookup");
  if (!data.length) throw new Error("Instagram: no Instagram account was shared during login");

  await writeJSON(env, TOKEN_KEY, {
    accessToken: t.access_token,
    userId: data[0].id,
    username: data[0].username,
    issuedAt: now(),
    expiresAt: t.expires_in ? now() + t.expires_in : null
  });
}

async function getToken(env) {
  const t = await readJSON(env, TOKEN_KEY);
  if (!t) throw new Error("Instagram not connected — visit /auth/instagram/start");
  if (t.expiresAt && t.expiresAt < now()) throw new Error("Instagram token expired — reconnect via /auth/instagram/start");
  return t;
}

// One request per metric: an unsupported metric shouldn't take the others down
async function insight(account, metric, params) {
  try {
    const label = params.breakdown ? metric + " by " + params.breakdown : metric;
    const body = await get(account.accessToken, account.userId + "/insights", { metric, period: "day", metric_type: "total_value", ...params }, label);
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
  const account = await getToken(env);
  const profile = await get(account.accessToken, account.userId, { fields: "username,followers_count,media_count" }, "profile");

  const until = now();
  const range = { since: until - PERIOD_DAYS * DAY, until };
  const lifetime = { period: "lifetime" };

  const [totals, byFollow, byType, age, gender, country] = await Promise.all([
    Promise.all(TOTALS.map(m => insight(account, m, range))),
    insight(account, "views", { ...range, breakdown: "follow_type" })
      .then(v => v || insight(account, "views", { ...range, breakdown: "follower_type" })),
    insight(account, "views", { ...range, breakdown: "media_product_type" }),
    insight(account, "follower_demographics", { ...lifetime, breakdown: "age" }),
    insight(account, "follower_demographics", { ...lifetime, breakdown: "gender" }),
    insight(account, "follower_demographics", { ...lifetime, breakdown: "country" })
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
