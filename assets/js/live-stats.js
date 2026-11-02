/* =========================================================
   EMMY LUNA — live social stats
   Replaces the hardcoded numbers with data from the stats
   function. On any failure the HTML values stay as they are.
   ========================================================= */
(function () {
  "use strict";

  const ENDPOINT = "/stats.json";
  const TIMEOUT = 6000;

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const num = v => typeof v === "number" && isFinite(v);

  /* ---------- Formatting (matches the site: 1.6K, 45.9K, 102K, 6.8%) ---------- */
  const compact = (n, floor) => {
    const [div, suffix] = n >= 1e6 ? [1e6, "M"] : n >= 1e3 ? [1e3, "K"] : [1, ""];
    const v = n / div, dec = suffix && v < 100 ? 1 : 0, f = Math.pow(10, dec);
    return { count: String((floor ? Math.floor(v * f) : Math.round(v * f)) / f), suffix };
  };
  const short = (n, floor) => { const c = compact(n, floor); return c.count + c.suffix; };
  const percent = n => String(Math.round(n * 10) / 10);

  const date = (iso, locale) =>
    new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "short" }).replace(".", "");

  /* ---------- Copy for the swapped-in labels ---------- */
  const label = (el, key, nl, en) => {
    if (!el) return;
    if (window.elI18n) window.elI18n.set(el, key, nl, en);
    else el.textContent = nl;
  };

  /* ---------- Writers ---------- */
  // value: string for a <dd>; hero <strong> elements also get data-count for the counter
  function put(key, value, counter) {
    $$('[data-stat="' + key + '"]').forEach(el => {
      const row = el.tagName === "DD" ? el.parentElement : null;
      if (value == null) { if (row) row.hidden = true; return; }
      if (row) row.hidden = false;
      if (el.hasAttribute("data-count") && counter) {
        el.dataset.count = counter.count;
        el.dataset.suffix = counter.suffix;
      }
      el.textContent = value;
    });
  }

  function renderTikTok(t) {
    const n = t.periodDays || 60;
    const v = num(t.views) ? compact(t.views) : null;
    put("tt.followers", num(t.followers) ? short(t.followers, true) + "+" : null);
    put("tt.views", v && v.count + v.suffix, v);
    put("tt.eng", num(t.engagementRate) ? percent(t.engagementRate) + "%" : null,
      num(t.engagementRate) && { count: percent(t.engagementRate), suffix: "%" });
    put("tt.lcs", num(t.likes) ? [t.likes, t.comments || 0, t.shares || 0].map(x => short(x)).join(" · ") : null);

    // the Display API has no viewer counts: those two rows show lifetime likes and video count instead
    const likes = $('[data-stat="tt.totalLikes"]'), videos = $('[data-stat="tt.videoCount"]');
    if (likes) label(likes.previousElementSibling, "s.ttTotalLikes", "Totale likes", "Total likes");
    if (videos) label(videos.previousElementSibling, "s.ttVideos", "Video's", "Videos");
    put("tt.totalLikes", num(t.totalLikes) ? short(t.totalLikes) : null);
    put("tt.videoCount", num(t.videoCount) ? String(t.videoCount) : null);

    if (t.updatedAt) label($('[data-i18n="s.ttPeriod"]'), "s.ttLive",
      "Video's van de laatste " + n + " dagen · bijgewerkt " + date(t.updatedAt, "nl-BE"),
      "Videos from the last " + n + " days · updated " + date(t.updatedAt, "en-GB"));
  }

  function renderInstagram(i) {
    const n = i.periodDays || 30;
    const v = num(i.views) ? compact(i.views) : null;
    put("ig.followers", num(i.followers) ? short(i.followers, true) + "+" : null);
    put("ig.views", v && v.count + v.suffix, v);
    put("ig.reach", num(i.reach) ? short(i.reach) : null);
    put("ig.nonFollowers", num(i.nonFollowerViewsPct) ? percent(i.nonFollowerViewsPct) + "%" : null);
    put("ig.eng", num(i.engagementRate) ? percent(i.engagementRate) + "%" : null);
    const mix = i.viewsByType;
    put("ig.mix", mix ? [mix.stories, mix.reels, mix.posts].map(percent).join(" · ") + "%" : null);

    if (v) label($('[data-i18n="stats.igViews"]'), "stats.igViewsLive",
      "Instagram weergaven · " + n + " dagen", "Instagram views · " + n + " days");
    if (i.updatedAt) label($('[data-i18n="s.igPeriod"]'), "s.igLive",
      "Laatste " + n + " dagen · bijgewerkt " + date(i.updatedAt, "nl-BE"),
      "Last " + n + " days · updated " + date(i.updatedAt, "en-GB"));
  }

  /* ---------- Fetch ---------- */
  if (!window.fetch) return;
  const ctrl = "AbortController" in window ? new AbortController() : null;
  const timer = ctrl && setTimeout(() => ctrl.abort(), TIMEOUT);

  fetch(ENDPOINT, { signal: ctrl && ctrl.signal })
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(data => {
      // render each platform on its own so one bad payload can't blank the other
      if (data.tiktok) try { renderTikTok(data.tiktok); } catch (e) {}
      if (data.instagram) try { renderInstagram(data.instagram); } catch (e) {}
    })
    .catch(() => { /* keep the hardcoded numbers */ })
    .finally(() => clearTimeout(timer));
})();
