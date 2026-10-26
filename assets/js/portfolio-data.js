/* =========================================================
   PORTFOLIO — edit this file to add or change work.
   ---------------------------------------------------------
   Each item:
     brand     : brand / client name shown on the card
     category  : "food" | "beauty" | "family" | "fitness" | "lifestyle"
     format    : small label, e.g. "UGC", "TikTok", "Reel"
     poster    : cover image (9:16 works best). Leave "" for a styled name card.
     video     : (optional) path to an .mp4 in assets/videos, e.g. "assets/videos/brownie-box.mp4"
     embed     : (optional) a TikTok or Instagram link, used when there is no .mp4
                 e.g. "https://www.tiktok.com/@emmyluna8/video/1234567890"
                 or   "https://www.instagram.com/reel/ABC123/"
   If neither video nor embed is set, the card opens the image.
   ========================================================= */

window.PORTFOLIO = [
  /* Food */
  { brand: "Kirbie",               category: "food",      format: "Reel",   poster: "assets/images/work/kirbie.jpg",          video: "", embed: "https://www.instagram.com/reel/DePYcaiMQFH/" },
  { brand: "Morso",                category: "food",      format: "Reel",   poster: "assets/images/work/morso.jpg",           video: "", embed: "https://www.instagram.com/reel/De6WUkmxqiD/" },
  { brand: "Chocoladefondue.be",   category: "food",      format: "Reel",   poster: "assets/images/work/chocoladefondue.jpg", video: "", embed: "https://www.instagram.com/reel/DekEJ8wRTaD/" },
  { brand: "The Brownie Box",      category: "food",      format: "Reel",   poster: "assets/images/brownie-box.jpg",          video: "", embed: "https://www.instagram.com/reel/Dcq1yX8Mx2a/" },
  { brand: "Pampas Rodizio",       category: "food",      format: "Reel",   poster: "assets/images/pampas-rodizio.jpg",       video: "", embed: "" },

  /* Beauty & fashion */
  { brand: "Lashbabe",             category: "beauty",    format: "Reel",   poster: "assets/images/work/lashbabe.jpg",        video: "", embed: "https://www.instagram.com/reel/DeUnCQxMDX1/" },
  { brand: "Wondr",                category: "beauty",    format: "TikTok", poster: "",                                       video: "", embed: "https://www.tiktok.com/@emmyluna8/video/7592704378117688608" },
  { brand: "Aurenna Nail Studio",  category: "beauty",    format: "Reel",   poster: "assets/images/aurenna-nails.jpg",        video: "", embed: "https://www.instagram.com/reel/Dd4R844xsO_/" },
  { brand: "Wearboco",             category: "beauty",    format: "TikTok", poster: "",                                       video: "", embed: "https://www.tiktok.com/@emmyluna8/video/7696606634843409696" },
  { brand: "Binqcare",             category: "beauty",    format: "UGC",    poster: "assets/images/binqcare.jpg",             video: "", embed: "" },

  /* Family & kids */
  { brand: "Smossie",              category: "family",    format: "Reel",   poster: "assets/images/smossie.jpg",              video: "", embed: "https://www.instagram.com/reel/DeHq0iMNUP-/" },
  { brand: "Swubbie",              category: "family",    format: "UGC",    poster: "assets/images/swubie.jpg",               video: "", embed: "" },
  { brand: "SPA",                  category: "family",    format: "Reel",   poster: "assets/images/spa.jpg",                  video: "", embed: "https://www.instagram.com/reel/Dd7CHZ_xPbc/" },
  { brand: "HiPP",                 category: "family",    format: "TikTok", poster: "",                                       video: "", embed: "https://www.tiktok.com/@emmyluna8/video/7572314427421134113" },

  /* Fitness & health */
  { brand: "SPA Active",           category: "fitness",   format: "Reel",   poster: "assets/images/work/spa-active.jpg",        video: "", embed: "https://www.instagram.com/reel/De42XR7xMNo/" },
  { brand: "Afslankhuys",          category: "fitness",   format: "Reel",   poster: "assets/images/work/afslankhuys-cryo.jpg",  video: "", embed: "https://www.instagram.com/reel/Deubl9qRUXh/" },
  { brand: "Afslankhuys",          category: "fitness",   format: "Reel",   poster: "assets/images/work/afslankhuys-laser.jpg", video: "", embed: "https://www.instagram.com/reel/De7kHxcRmvZ/" },

  /* Lifestyle */
  { brand: "Housewine",            category: "lifestyle", format: "Reel",   poster: "assets/images/housewine.jpg",                 video: "", embed: "https://www.instagram.com/reel/DeABvkkRbi9/" },
  { brand: "Flowershop Oudeman",   category: "lifestyle", format: "Reel",   poster: "assets/images/work/flowershop-oudeman.jpg",   video: "", embed: "https://www.instagram.com/reel/DecThXfsSPR/" },
  { brand: "Schilderen op nummers × Housewine", category: "lifestyle", format: "Reel", poster: "assets/images/work/schilderen-op-nummers.jpg", video: "", embed: "https://www.instagram.com/reel/DdZcaDXxxT1/" },
  { brand: "Mynaverse",            category: "lifestyle", format: "Reel",   poster: "assets/images/work/mynaverse.jpg",            video: "", embed: "https://www.instagram.com/reel/Dey8kTtsgUB/" },
  { brand: "Pure Plastic Dreams",  category: "lifestyle", format: "Reel",   poster: "assets/images/pure-wine.jpg",                 video: "", embed: "" },
  { brand: "Travel — Egypt",       category: "lifestyle", format: "Reel",   poster: "assets/images/egypt-dress.jpg",               video: "", embed: "" }
];

/* =========================================================
   BRANDS — everyone Emmy has worked with.
   ---------------------------------------------------------
     name     : shown in the list (and as a wordmark until a logo is added)
     featured : true = shown large in the logo row
     logo     : (optional) path to a logo file, e.g. "assets/images/logos/huggies.svg"
                Transparent SVG or PNG, about 300px wide, in the colour you want shown.
   ========================================================= */

window.BRANDS = [
  { name: "Huggies",             featured: true, logo: "" },
  { name: "HiPP",                featured: true, logo: "" },
  { name: "SPA",                 featured: true, logo: "" },
  { name: "Colmar",              featured: true, logo: "" },
  { name: "Maxistock Leuven",    featured: true, logo: "" },
  { name: "Dermocreme",          featured: true, logo: "" },
  { name: "Born Rosé Barcelona", featured: true, logo: "" },
  { name: "Wondr",               featured: true, logo: "" },

  { name: "Afslankhuys" },
  { name: "Aurenna Nail Studio" },
  { name: "Bakkerij Wauters" },
  { name: "Barbier Patricio" },
  { name: "Blinq" },
  { name: "Carbon" },
  { name: "Chocoladefondue.be" },
  { name: "Crunch Crousty" },
  { name: "Daily Bingsu" },
  { name: "Desair Skincare" },
  { name: "DRKS" },
  { name: "DRP BuildLab" },
  { name: "Flowershop Oudeman" },
  { name: "G4u-app" },
  { name: "Gaio Beauty" },
  { name: "Het Snoephuisje Dessel" },
  { name: "Housewine" },
  { name: "Kirbie" },
  { name: "Kwaliteitslagerij Thyssen" },
  { name: "Lashbabe" },
  { name: "Lenora Kids" },
  { name: "LTX Skincare" },
  { name: "Luminora" },
  { name: "Meltix" },
  { name: "Morso" },
  { name: "Myléne" },
  { name: "Mynaverse" },
  { name: "N'Sane" },
  { name: "Pampas" },
  { name: "Plekt.be" },
  { name: "Schilderen op nummers" },
  { name: "Smossie" },
  { name: "Swubbie" },
  { name: "Tajeli" },
  { name: "The Brownie Box" },
  { name: "Twizzy Candystore" },
  { name: "Vioryna" },
  { name: "Wearboco" }
];
