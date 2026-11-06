/* GET /auth/{instagram,tiktok}/{start,callback}: one-time account connection */
import { getEnv, page, isAdmin, createState, consumeState } from "../lib/util.js";
import { PLATFORMS, LABELS, refreshAll } from "../lib/stats.js";

export default async (request, context) => {
  const { platform: name, step } = context.params;
  const platform = PLATFORMS[name], label = LABELS[name];
  if (!platform || !["start", "callback"].includes(step)) return new Response("Not found", { status: 404 });

  const env = getEnv();
  const url = new URL(request.url);

  if (step === "start") {
    if (!isAdmin(url, env)) return page("Forbidden", "Missing or wrong key.", 403);
    return Response.redirect(platform.authorizeUrl(env, await createState(env, name)), 302);
  }

  if (!(await consumeState(env, url.searchParams.get("state"), name))) {
    return page("Link expired", "This login link is invalid or expired. Start again from the setup link.", 400);
  }
  const denied = url.searchParams.get("error_description") || url.searchParams.get("error");
  const code = url.searchParams.get("code") || url.searchParams.get("auth_code");
  if (denied || !code) return page(`${label} not connected`, denied || "No authorization code received.", 400);

  try {
    await platform.handleCallback(env, code);
  } catch (err) {
    console.error(err.message);
    return page(`${label} not connected`, err.message, 502);
  }
  context.waitUntil(refreshAll(env));
  return page(`${label} connected ✓`, "Thanks! The website stats will update within a few minutes. You can close this page.");
};

// TikTok for Business requires redirect URLs ending in "/"
export const config = { path: ["/auth/:platform/:step", "/auth/:platform/:step/"], method: "GET" };
