# Instagram: Meta dashboard setup (Unified login)

This sets up the Meta app **Emmy Luna Social Stats** so Emmy can connect her Instagram once and the website
(https://emmy-luna.netlify.app) can show her live Instagram stats.

**Why this setup:** Meta no longer lets new apps use the old "API setup with Instagram login". Our app has to use
**API setup with Unified login** instead. The site's code has already been updated for it.

**You need:** admin access to the app at https://developers.facebook.com/apps → *Emmy Luna Social Stats*.
The app is already linked to a business portfolio, which Unified login requires.

**When you're done:** send the **Configuration ID** from step 2 to Lathif. The Configuration ID isn't secret, but
**never paste the App secret** into chat, email or screenshots.

---

## Step 1: Basic app settings

**App settings → Basic**

| Field | Value |
|---|---|
| App domains | `emmy-luna.netlify.app` |
| Privacy Policy URL | `https://emmy-luna.netlify.app/privacy.html` |
| Terms of Service URL | `https://emmy-luna.netlify.app/terms.html` |
| User data deletion | *Data deletion instructions URL* → `https://emmy-luna.netlify.app/privacy.html` |
| Category | *Business and pages* (or the closest option) |
| App icon | [`app-icon-1024.png`](app-icon-1024.png) (in this folder) |

Click **Save changes**.

## Step 2: Create the login configuration

**Use cases → Instagram API → Customise → API setup with Unified login**

1. Under **1. Configure your app**, click **Create new configuration**.
2. Name: `Emmy Luna stats`
3. Login variation: **General**
4. Access token: **System-user access token (SUAT)**. Expiration: **Never**
5. Business assets: **Instagram account** (required). Leave *Ad account* off.
6. Permissions → **Edit permissions**:
   - **Add** `instagram_manage_insights`. Without it, views and reach can't be read.
   - **Keep** `instagram_basic`.
   - **Remove** these if Meta allows it: `ads_management`, `ads_read`, `instagram_manage_messages`,
     `instagram_manage_comments`, `instagram_content_publish`. The site doesn't use them, and Emmy would otherwise be
     asked to grant them.
7. Save, then select the new configuration in the dropdown on the page.
8. Redirect URL: `https://emmy-luna.netlify.app/auth/instagram/callback`. It should already be saved. If not,
   enter it under *Register a new redirect URL* and click **Save**.
9. **Copy the Configuration ID.** It's the long number shown for the configuration, also visible as `config_id=…`
   in the generated **Login URL**.

✅ **Check:** the page shows a **Login URL** that contains `config_id=<the number>`.

## Step 3: Facebook Login for Business settings

**Left sidebar → Facebook Login for Business → Settings**

| Setting | Value |
|---|---|
| Client OAuth login | **On** |
| Web OAuth login | **On** |
| Valid OAuth Redirect URIs | `https://emmy-luna.netlify.app/auth/instagram/callback` |

Click **Save changes**. Meta checks the redirect URI here too, when the site exchanges the login code for a token.

## Step 4: Give Emmy access

The app is unpublished (development mode), so only people with a role on the app can connect.

1. **App roles → Roles → Add people → Instagram Tester** → enter `emmy.luna` → send.
2. Ask Emmy to accept, **on instagram.com in a browser** (not in the app):
   *Settings → Website permissions → Apps and websites → Tester invites → Accept*.
3. Ask Emmy to confirm her Instagram is a **Creator** or **Business** account
   (Instagram app → *Settings → Account type and tools*). Personal accounts can't be connected.

✅ **Check:** under *App roles → Roles*, Emmy shows as **Instagram Tester** with status **Accepted**.

---

## Hand-off checklist

- [ ] Step 1 saved
- [ ] Step 2: configuration created with `instagram_manage_insights`, SUAT, expiration *Never*
- [ ] Step 2: **Configuration ID sent to Lathif**
- [ ] Step 3: redirect URI saved under Facebook Login for Business
- [ ] Step 4: Emmy is an Instagram Tester (Accepted), account is Creator/Business

After this, Lathif deploys the Configuration ID and sends Emmy a one-time connect link. She logs in on Meta's own
screen and her password is never shared with us.

## If something looks different

| What you see | What to do |
|---|---|
| No *API setup with Unified login* tab | The app isn't owned by a business portfolio. Check *App settings → Basic → Business portfolio*. |
| `instagram_manage_insights` not offered | Screenshot the permissions list and send it to Lathif. |
| Can't remove the extra permissions | Leave them and carry on. It only adds lines to Emmy's consent screen. |
| Emmy doesn't see the tester invite | She must open instagram.com in a desktop browser, not the app. Re-send the invite if needed. |
