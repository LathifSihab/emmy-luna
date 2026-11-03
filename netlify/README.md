# Social stats functions

Netlify Functions that fetch Emmy's Instagram and TikTok stats every 3 hours and serve them at `/stats.json` on the site itself. [`assets/js/live-stats.js`](../assets/js/live-stats.js) reads that file. If it fails, the site keeps showing its hardcoded numbers. Tokens and the cached stats live in a Netlify Blobs store named `social-stats`. Everything here runs on the free plan.

## Routes

| Route | Purpose |
|---|---|
| `GET /stats.json` | Public stats, cached 10 min |
| `GET /auth/instagram/start?key=ADMIN_KEY` | Sends Emmy to Instagram login (one-time) |
| `GET /auth/tiktok/start?key=ADMIN_KEY` | Sends Emmy to TikTok login (one-time) |
| `GET /auth/{instagram,tiktok}/callback` | OAuth redirect URIs (register these in the developer apps) |
| `POST /refresh?key=ADMIN_KEY` | Fetch now instead of waiting for the schedule; returns `ok` or the error per platform |
| `scheduled-refresh` | Runs every 3 hours |

## Setup

1. **Environment variables:** Netlify → *emmy-luna* → Site configuration → Environment variables. Add these (or run `netlify env:set NAME value`):
   - `IG_APP_ID`, `IG_APP_SECRET`: the Meta app ID and secret (App settings → Basic). New Meta apps only offer *API setup with Unified login*, so these are the Meta values, not a separate Instagram app ID.
   - `IG_CONFIG_ID`: Use cases → Instagram API → API setup with Unified login → step 1, the configuration ID. The configuration needs `instagram_basic` and `instagram_manage_insights`, with a system-user token that never expires.
   - `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`: TikTok developer app
   - `ADMIN_KEY`: a long random string (already set). Read it with `netlify env:get ADMIN_KEY`.
   - `PUBLIC_BASE_URL` (optional): defaults to the site's primary URL. Set it only if the redirect URIs must stay on a different domain.
2. **Redeploy** after changing a variable. Functions only see the values from their deploy (push to `main`, or Deploys → *Trigger deploy*).
3. **Redirect URIs:** register these exactly in the developer apps:
   - Instagram: `https://emmy-luna.netlify.app/auth/instagram/callback`
   - TikTok: `https://emmy-luna.netlify.app/auth/tiktok/callback`
4. **Connect the accounts (once):** Emmy opens each link while logged in to her account and approves access:
   - `https://emmy-luna.netlify.app/auth/instagram/start?key=<ADMIN_KEY>`
   - `https://emmy-luna.netlify.app/auth/tiktok/start?key=<ADMIN_KEY>`

   Each callback page confirms the connection and triggers a first fetch. Check the result at `/stats.json` (cached for up to 10 minutes).

When emmyluna.be is connected to Netlify and set as the primary domain, the redirect URIs move with it. Update both developer apps at the same time.

## Maintenance

- The Instagram token is a system-user token whose expiry comes from the login configuration (never, by default), so it isn't refreshed. If the configuration sets an expiry, reconnect before it runs out. The TikTok access token lasts 24 hours, and its refresh token about a year. If a refresh fails, the previous data stays live.
- If a platform stops updating, run `curl -X POST "https://emmy-luna.netlify.app/refresh?key=<ADMIN_KEY>"` to see the error. If it says "reconnect", repeat step 4 for that platform.
- Logs: Netlify → *emmy-luna* → Logs → Functions. Tokens are never logged.
- Bump `API_VERSION` in `lib/instagram.js` when Meta retires the current Graph API version.
- `netlify.toml` returns 404 for `/netlify/*`, `/docs/*` and the package files, because the site publishes from the repo root.

## What the numbers mean

- **Instagram:** account insights for the last 30 days (the maximum range). The engagement rate is total interactions divided by views.
- **TikTok:** the Display API has no time-windowed analytics. "Views", "likes · comments · shares" and the engagement rate are the lifetime totals of videos *posted* in the last 60 days. The "viewers / new viewers" rows become total likes and video count, because those viewer metrics are not available.
- Audience demographics on the site stay static (TikTok viewers). `stats.json` does include Instagram follower demographics if you want to switch that block later.
