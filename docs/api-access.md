# Getting API access: Instagram + TikTok

Step-by-step checklist for connecting Emmy's accounts to the live stats on emmyluna.be.
Copy-paste texts are in the boxes.

> **Never paste app secrets into chat, email or git.** They go straight into Netlify as environment
> variables (see `netlify/README.md`).

---

## 0. Before you start

- [x] **`privacy.html` and `terms.html` are live** (both portals check them):
  - https://emmy-luna.netlify.app/privacy.html
  - https://emmy-luna.netlify.app/terms.html
- [ ] **Emmy's Instagram must be a Creator or Business account.**
  Instagram app → Settings → *Account type and tools* → *Switch to professional account* → Creator.
- [x] **Stats service is deployed** as Netlify Functions on the site itself (`https://emmy-luna.netlify.app`).
  `emmyluna.be` isn't live yet, so every URL below uses the Netlify address. Once the domain is connected
  to Netlify, change the URLs in both developer apps (privacy, terms, website, redirect URIs) to emmyluna.be.
- [ ] Use one name everywhere (it matches the privacy policy): **Emmy Luna Social Stats**

---

## A. Instagram (Meta): no App Review needed

Because the app only reads **Emmy's own account**, *Standard Access* is enough. Emmy just needs a role
on the app (Instagram tester). There's no review and no demo video.

1. Go to https://developers.facebook.com → log in (your own Facebook account is fine) → *Get started*
   and register as a developer.
2. **My Apps → Create app**
   - App name: `Emmy Luna Social Stats`
   - Contact email: your email
   - Use case: **Manage messaging & content on Instagram**
   - Business portfolio: skip / "I don't want to connect a business portfolio yet"
3. In the app: **Instagram → API setup with Instagram business login**
   - **Business login settings → OAuth redirect URIs:**
     ```
     https://emmy-luna.netlify.app/auth/instagram/callback
     ```
   - Copy the **Instagram App ID** and **Instagram App Secret** shown on that page.
     ⚠️ Use the *Instagram* app ID/secret, not the Facebook App ID at the top of the dashboard.
   - Skip the *Generate access tokens → Add account* section. The Worker gets the token itself when
     Emmy approves the start link (section C), so you never need her Instagram login.
4. **App roles → Roles → Add people → Instagram Tester** → enter `emmy.luna`.
5. **Emmy accepts the invite:** instagram.com (browser) → Settings → *Apps and websites* →
   *Tester invites* → Accept. (It may take a few minutes to appear.)
6. **App settings → Basic:** fill in
   - Privacy Policy URL: `https://emmy-luna.netlify.app/privacy.html`
   - Terms of Service URL: `https://emmy-luna.netlify.app/terms.html`
   - User data deletion: *Data deletion instructions URL* → `https://emmy-luna.netlify.app/privacy.html`
   - Category: *Business and pages*, app icon 1024×1024 (use Emmy's logo/favicon)
7. Leave the app in **Development** mode. That's fine for this setup.

**What you'll hand over:** `IG_APP_ID`, `IG_APP_SECRET` (as Netlify environment variables).

---

## B. TikTok: needs App Review

1. Go to https://developers.tiktok.com → *Log in* → create a developer account (your email is fine).
   Create or join an **organization** if asked (name: `DRP BuildLab` or `Emmy Luna`).
2. **Manage apps → Connect an app / Create app**: choose "Individual" or the organization.

### B1. Basic information

| Field | Value |
|---|---|
| App icon | 1024×1024 PNG (Emmy's logo) |
| App name | `Emmy Luna Social Stats` (TikTok rejects names that contain "TikTok") |
| Category | Lifestyle |
| Terms of Service URL | `https://emmy-luna.netlify.app/terms.html` |
| Privacy Policy URL | `https://emmy-luna.netlify.app/privacy.html` |
| Platforms | **Web** → Website URL `https://emmy-luna.netlify.app` |

**Description** (max 120 characters):
```
Shows up-to-date follower and video statistics from the creator's own TikTok account on her portfolio website.
```

**URL verification:** TikTok asks you to verify `https://emmy-luna.netlify.app`. Choose *Verify with a file*,
download the `tiktok…txt` signature file, put it in the site's root folder, deploy, then click *Verify*.
(DNS TXT also works if you control DNS.)

### B2. Products & scopes

- **Add products → Login Kit**
  - Redirect URI (Web):
    ```
    https://emmy-luna.netlify.app/auth/tiktok/callback
    ```
- **Scopes**: add exactly these three, and nothing more (extra scopes are the #1 rejection reason):
  - `user.info.basic`
  - `user.info.stats`
  - `video.list`

### B3. Test in Sandbox first

1. At the top of the app page, switch to **Sandbox** → *Create sandbox*.
2. Sandbox → **Target users** → add Emmy's TikTok account (`@emmyluna8`). Emmy must log in to the
   developer portal once, or accept the invite, depending on what the portal shows.
3. Copy the **sandbox Client key + Client secret** so we can deploy and test the whole flow before review.

### B4. App review submission (Production)

**"Explain how each product and scope works within your app":**
```
Emmy Luna Social Stats is a private integration used only by the creator Emmy Luna (@emmyluna8)
to show up-to-date statistics from her own TikTok account in the "Statistics" section of her
portfolio website https://emmy-luna.netlify.app, where brands review her reach before booking a collaboration.

Login Kit: Emmy logs in once with TikTok to authorize the app. No other users log in.

user.info.basic: identifies the connected account (open_id, display name) so we can confirm the
right account (@emmyluna8) is linked.

user.info.stats: reads follower_count, likes_count and video_count, which are displayed on the
website as her current follower count and total likes.

video.list: reads view, like, comment and share counts of her own public videos. We add these up
for the last 60 days to show total views and engagement rate on the website.

Data is refreshed every few hours by a server-side job. Only aggregated numbers are published;
access tokens are stored encrypted on the server and never sent to the browser. The app does not
post content, read messages, or access any other user's data.
```

**Demo video** (screen recording, 1–2 min, mp4/mov, max 50 MB). Record it after the sandbox flow works:
1. Show https://emmy-luna.netlify.app and scroll to the Statistics section (the TikTok card).
2. Open the authorize link (`https://emmy-luna.netlify.app/auth/tiktok/start?key=…`) and show the TikTok
   login and consent screen with the 3 scopes.
3. Approve → show the "connected" success page.
4. Show the website again with the TikTok numbers updated (and `https://emmy-luna.netlify.app/stats.json`).

The domain in the video must match the verified website URL. The `?key=…` in the start link is the
admin key, so blur it in the recording or set a new `ADMIN_KEY` afterwards (Netlify environment variable, then redeploy).

Then click **Submit for review**. Review usually takes from a few days up to ~2 weeks. If it's
rejected, the reason is shown in the portal. Fix that one point and resubmit.

**What you'll hand over:** `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET` (sandbox first, then production).

---

## C. After both are approved

1. Put the secrets in Netlify (`netlify/README.md` has the steps).
2. Emmy opens each `/auth/…/start?key=…` link once and approves. This is a one-time step.
3. Check `https://emmy-luna.netlify.app/stats.json` and the website.
4. Instagram tokens auto-refresh (60-day lifetime). TikTok refresh tokens last ~1 year, after which
   Emmy has to re-authorize once (just repeat step 2).
