/* =========================================================
   EMMY LUNA — interactions
   ========================================================= */
(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- English copy (Dutch lives in the HTML) ---------- */
  const EN = {
    "nav.about": "About",
    "nav.portfolio": "Portfolio",
    "nav.services": "Services",
    "nav.process": "Process",
    "nav.contact": "Work with me",

    "hero.eyebrow": "Content creator · UGC creator · Belgium",
    "hero.tagline": "Follow your inner moonlight; don't hide the madness.",
    "hero.lead": "I turn products, services and experiences into short-form content that feels natural, looks beautiful and actually sticks.",
    "hero.cta1": "View my work",
    "hero.cta2": "Start a collaboration",

    "stats.tiktokViews": "TikTok views · 60 days",
    "stats.tiktokEng": "TikTok engagement",
    "stats.igViews": "Instagram views · 90 days",
    "stats.igReach": "reach among non-followers",

    "about.caption": "Mom · account manager · creator",
    "about.eyebrow": "(01) Nice to meet you",
    "about.title": "Hi, I'm <em>Emmy</em>.",
    "about.p1": "I'm 28 and a creative UGC creator from Belgium. As a mom, account manager and content creator, I know how important it is to make content that isn't just beautiful, but truly connects.",
    "about.p2": "I love showing brands in a natural, stylish and authentic way. From beauty and lifestyle to food, fashion, home and mom content: I enjoy playing with different concepts and details to create content that looks professional and feels personal.",
    "about.p3": "My style is creative, modern and detail-driven, with a luxurious feel that never seems forced. I like to think along with a brand and translate a product into content people actually want to watch, remember and discover.",
    "values.1": "Authenticity & trust",
    "values.2": "Creativity & originality",
    "values.3": "Feminine & confident",
    "values.4": "Attention to detail",
    "values.5": "Relatable, with a premium finish",

    "portfolio.eyebrow": "(02) Selected work",
    "portfolio.title": "Content that <em>sticks</em>",
    "portfolio.intro": "A selection of UGC videos, Reels and TikToks for brands in food, beauty, lifestyle and motherhood. Tap a video to play it.",
    "filter.all": "All",
    "portfolio.foodNote": "<span>Fun fact</span> My food content — think juicy meat and grill visuals — performs remarkably well with a male audience.",

    "services.eyebrow": "(03) Services",
    "services.title": "Rates <em>&amp;</em> offer",
    "svc.ugc.title": "UGC video production",
    "svc.ugc.text": "Content for your brand's own channels — without posting on my personal account.",
    "svc.social.title": "Social media collaborations",
    "svc.social.text": "Reels, TikToks, stories and posts shared with my own community on Instagram and TikTok.",
    "svc.story.title": "Product storytelling",
    "svc.story.text": "Concept, script and hooks that make a product feel like an honest recommendation, not an ad.",
    "rates.tabAds": "Paid ads",
    "r.ugc1": "1 UGC video",
    "r.ugc3": "3 UGC videos",
    "r.ugc5": "5 UGC videos",
    "r.ugcScript": "UGC video + concept & script",
    "r.from200": "from €200",
    "r.hook": "Extra hook / variant",
    "r.raw": "Raw footage, per video",
    "r.ugcNote": "UGC content is delivered without posting on the creator's own channel, unless agreed otherwise.",
    "r.story3": "Story series · 3 stories",
    "r.story5": "Story series · 5 stories",
    "r.post": "Instagram post / photo",
    "r.adsIntro": "For using content as advertising (Meta Ads, TikTok Ads and other paid channels):",
    "r.m1": "1 month",
    "r.m3": "3 months",
    "r.m6": "6 months",
    "r.m12": "12 months",
    "r.pv100": "€100 / video",
    "r.pv200": "€200 / video",
    "r.pv300": "€300 / video",
    "r.pv450": "€450 / video",
    "r.adsNote": "Paid advertising, extended buy-out, raw footage and exclusivity are not included by default and are agreed separately.",

    "process.eyebrow": "(04) My process",
    "process.title": "How I <em>work</em>",
    "process.text": "For me, a good collaboration starts with a clear briefing and a brand that truly fits my content and audience. I want collaborations to feel natural, with a product or service becoming an authentic part of my content.",
    "step1": "Introduction & briefing",
    "step1t": "We discuss your brand, goal, audience and the message that needs to land.",
    "step2": "Creative translation",
    "step2t": "I develop a concept, hook and script that fit your brand and my style.",
    "step3": "Creating the content",
    "step3t": "Shot in natural light, with an eye for detail and a polished, premium look.",
    "step4": "Feedback & delivery",
    "step4t": "You review the content; small adjustments are included.",
    "step5": "Publishing & results",
    "step5t": "After publishing I share the results, so you can see what the content delivers.",
    "process.quote": "Professional in collaboration.<br><em>Personal in content.</em>",

    "statsSec.eyebrow": "(05) Statistics",
    "statsSec.title": "Reach that goes <em>further</em>",
    "s.followers": "Followers",
    "s.views60": "Views · 60 days",
    "s.views90": "Views · 90 days",
    "s.eng": "Engagement rate",
    "s.unique": "Unique viewers",
    "s.nonfollow": "Non-follower reach",

    "contact.eyebrow": "(06) Contact",
    "contact.title": "Let's create something <em>beautiful</em>.",
    "contact.text": "I love working with brands I'm genuinely excited about. Tell me about your brand and idea — I usually reply within two working days.",
    "contact.phone": "Phone",
    "form.name": "Name",
    "form.brand": "Brand / company",
    "form.type": "Type of collaboration",
    "form.opt1": "UGC videos",
    "form.opt2": "Instagram / TikTok collaboration",
    "form.opt3": "Content for paid ads",
    "form.opt4": "Something else",
    "form.msg": "Tell me about your idea",
    "form.send": "Send request",
    "footer.top": "Back to top ↑"
  };

  const UI = {
    nl: { soon: "De video wordt binnenkort toegevoegd.", formErr: "Vul je naam, e-mail en bericht in.", formOk: "Je e-mailprogramma wordt geopend met je aanvraag. Bedankt!", close: "Sluiten", play: "Bekijk video" },
    en: { soon: "The video will be added soon.", formErr: "Please fill in your name, email and message.", formOk: "Your email app is opening with your request. Thank you!", close: "Close", play: "Watch video" }
  };

  let lang = "nl";
  const NL = {}; // originals captured from the HTML

  function applyLang(next) {
    lang = next;
    document.documentElement.lang = next;
    $$("[data-i18n]").forEach(el => {
      const k = el.dataset.i18n;
      if (!(k in NL)) NL[k] = el.textContent;
      el.textContent = next === "en" && EN[k] ? EN[k] : NL[k];
    });
    $$("[data-i18n-html]").forEach(el => {
      const k = "html:" + el.dataset.i18nHtml;
      if (!(k in NL)) NL[k] = el.innerHTML;
      el.innerHTML = next === "en" && EN[el.dataset.i18nHtml] ? EN[el.dataset.i18nHtml] : NL[k];
    });
    $$(".lang-btn").forEach(b => b.classList.toggle("is-active", b.dataset.lang === next));
    $("#lightboxClose").setAttribute("aria-label", UI[next].close);
    try { localStorage.setItem("el-lang", next); } catch (e) {}
  }

  $$(".lang-btn").forEach(b => b.addEventListener("click", () => applyLang(b.dataset.lang)));

  /* ---------- Header + mobile menu ---------- */
  const header = $(".site-header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 30);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const toggle = $("#menuToggle");
  const nav = $("#nav");
  const setMenu = open => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  $$("a", nav).forEach(a => a.addEventListener("click", () => setMenu(false)));

  /* ---------- Portfolio ---------- */
  const grid = $("#portfolioGrid");
  const items = window.PORTFOLIO || [];
  const playIcon = '<svg viewBox="0 0 12 14" aria-hidden="true"><path d="M0 0l12 7-12 7z"/></svg>';

  items.forEach((it, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "card";
    btn.dataset.category = it.category;
    btn.dataset.index = i;
    btn.style.animationDelay = (i % 5) * 60 + "ms";
    btn.setAttribute("aria-label", it.brand + " — " + it.format);
    btn.innerHTML =
      '<img src="' + it.poster + '" alt="" loading="lazy">' +
      '<span class="card-play">' + playIcon + "</span>" +
      '<span class="card-meta"><small>' + it.category + " · " + it.format + "</small><strong>" + it.brand + "</strong></span>";
    btn.addEventListener("click", () => openLightbox(it, btn));
    grid.appendChild(btn);
  });

  $$(".filter").forEach(f => f.addEventListener("click", () => {
    const val = f.dataset.filter;
    $$(".filter").forEach(x => { x.classList.toggle("is-active", x === f); x.setAttribute("aria-selected", x === f); });
    let n = 0;
    $$(".card", grid).forEach(c => {
      const show = val === "all" || c.dataset.category === val;
      c.classList.toggle("is-hidden", !show);
      if (show) { c.style.animation = "none"; void c.offsetWidth; c.style.animation = ""; c.style.animationDelay = (n++ % 5) * 60 + "ms"; }
    });
  }));

  /* ---------- Lightbox (mp4, TikTok, Instagram, or image) ---------- */
  const lb = $("#lightbox"), stage = $("#lightboxStage"), meta = $("#lightboxMeta");
  let lastFocus = null;

  function embedUrl(url) {
    let m = url.match(/tiktok\.com\/.*video\/(\d+)/);
    if (m) return "https://www.tiktok.com/embed/v2/" + m[1];
    m = url.match(/instagram\.com\/(?:reel|p|tv)\/([\w-]+)/);
    if (m) return "https://www.instagram.com/reel/" + m[1] + "/embed";
    return url;
  }

  function openLightbox(it, trigger) {
    lastFocus = trigger;
    stage.innerHTML = "";
    let note = "";
    if (it.video) {
      const v = document.createElement("video");
      v.src = it.video; v.poster = it.poster; v.controls = true; v.autoplay = true; v.playsInline = true;
      stage.appendChild(v);
    } else if (it.embed) {
      const f = document.createElement("iframe");
      f.src = embedUrl(it.embed);
      f.allow = "autoplay; encrypted-media; picture-in-picture";
      f.allowFullscreen = true;
      f.title = it.brand;
      stage.appendChild(f);
    } else {
      const img = document.createElement("img");
      img.src = it.poster; img.alt = it.brand;
      stage.appendChild(img);
      note = UI[lang].soon;
    }
    meta.innerHTML = "<strong>" + it.brand + "</strong>" + it.category + " · " + it.format + (note ? "<br><em>" + note + "</em>" : "");
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    $("#lightboxClose").focus();
  }

  function closeLightbox() {
    lb.hidden = true;
    stage.innerHTML = ""; // stops video playback
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  $("#lightboxClose").addEventListener("click", closeLightbox);
  lb.addEventListener("click", e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !lb.hidden) closeLightbox(); });

  /* ---------- Rate tabs ---------- */
  const tabs = $$(".rate-tab");
  tabs.forEach(t => t.addEventListener("click", () => {
    tabs.forEach(x => {
      const on = x === t;
      x.classList.toggle("is-active", on);
      x.setAttribute("aria-selected", on);
      const p = document.getElementById(x.getAttribute("aria-controls"));
      p.hidden = !on;
      p.classList.toggle("is-active", on);
    });
  }));

  /* ---------- Reveal on scroll + counters ---------- */
  const countUp = el => {
    const target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || "";
    const dec = (el.dataset.count.split(".")[1] || "").length;
    const t0 = performance.now(), dur = 1600;
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * e).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  let watchCounters = null;
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-visible");
        io.unobserve(en.target);
      });
    }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach(el => io.observe(el));

    const co = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { countUp(en.target); co.unobserve(en.target); } });
    }, { threshold: .6 });
    watchCounters = () => $$("[data-count]").forEach(el => co.observe(el));
  } else {
    $$(".reveal").forEach(el => el.classList.add("is-visible"));
    $$("[data-count]").forEach(el => el.textContent = el.dataset.count + (el.dataset.suffix || ""));
  }

  /* ---------- Hero intro: play once the portrait is ready ---------- */
  const portrait = $(".hero-arch img");
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let introStarted = false;
  const startIntro = () => {
    if (introStarted) return;
    introStarted = true;
    document.body.classList.remove("intro-pending");
    // hero stats fade in at ~1.15s; count once they're showing
    if (watchCounters) setTimeout(watchCounters, calm ? 0 : 1150);
  };
  if (!portrait || portrait.complete) startIntro();
  else {
    portrait.addEventListener("load", startIntro);
    portrait.addEventListener("error", startIntro);
    setTimeout(startIntro, 1500);
  }

  /* ---------- Contact form (static: opens email app) ---------- */
  const form = $("#contactForm"), status = $("#formStatus");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    let ok = true;
    ["name", "email", "message"].forEach(k => {
      const field = form.elements[k].closest(".field");
      const bad = !d[k] || (k === "email" && !/^\S+@\S+\.\S+$/.test(d[k]));
      field.classList.toggle("has-error", bad);
      if (bad) ok = false;
    });
    if (!ok) { status.textContent = UI[lang].formErr; return; }
    const subject = "Samenwerking / Collaboration — " + (d.brand || d.name) + " (" + d.type + ")";
    const body = d.message + "\n\n— " + d.name + (d.brand ? " · " + d.brand : "") + "\n" + d.email;
    window.location.href = "mailto:emmy-luna@hotmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    status.textContent = UI[lang].formOk;
  });

  /* ---------- Misc ---------- */
  $("#year").textContent = new Date().getFullYear();

  let saved = null;
  try { saved = localStorage.getItem("el-lang"); } catch (e) {}
  if (saved === "en") applyLang("en");
})();
