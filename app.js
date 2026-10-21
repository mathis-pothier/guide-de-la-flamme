/* Guide de la Flamme — application sans dépendance (Leaflet seulement pour la carte).
   Données : window.ENS (dossier data/, fusionnées par data/merge.js), icônes : window.ENS_ICONS. */
(() => {
  "use strict";
  const D = window.ENS, ICONS = window.ENS_ICONS;
  // Langue (i18n.js) : t = interface, tp = pluriel, tr = valeur des données, nm/nmh = nom du jeu (texte / HTML avec info-bulle)
  const I18N = window.ENS_I18N, { t, tp, tr, nm, nmh } = I18N;
  I18N.appliquer(D);
  // Extensions facultatives (page refonte.html) : vues en plus, vue d'accueil, rappel après chaque navigation.
  const EXT = window.ENS_EXT || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const app = $("#app");
  const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));
  const ITEMS = byId(D.items), SKILLS = byId(D.skills), SOURCES = byId(D.sources), BUILDS = byId(D.builds);
  const TAGS = D.buildTags || {}, IMG = D.images || {}, ALIAS = D.alias || {}, MAP = D.map;
  const getItem = (id) => ITEMS[id] || ITEMS[ALIAS[id]];

  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const fmtDate = (iso, short) => (iso ? new Date(iso + "T12:00:00").toLocaleDateString(I18N.locale, short ? { day: "numeric", month: "short" } : { day: "numeric", month: "long", year: "numeric" }) : t("date inconnue"));
  const icon = (name, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.help}</svg>`;
  // Texte de données affiché : traduit, échappé, noms du jeu remplacés par leur nom français (mode français)
  const txt = (s) => I18N.nomsDansTexte(esc(tr(s)));
  // Atout d'objet : nom du jeu, éventuellement suivi de « ×2 »
  const perkH = (a) => { const m = String(a).match(/^(.*?)( ×\d+)$/); return m ? nmh(m[1]) + esc(m[2]) : nmh(a); };

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } }
  };
  let compare = store.get("ens.compare", []).map((id) => (getItem(id) || {}).id).filter(Boolean);
  const saveCompare = () => { store.set("ens.compare", compare); $("#cmp-count").textContent = compare.length || ""; };

  // ── Vocabulaire visuel
  const STATUS = {
    v1: { label: t("Vérifié 1.0"), icon: "check", cls: "ok", desc: t("Valeurs lues dans les fichiers de la version 1.0.") },
    w10: { label: t("Wiki après 1.0"), icon: "refresh", cls: "teal", desc: t("Page du wiki modifiée depuis la sortie de la 1.0 : probablement à jour, sans garantie.") },
    pre: { label: t("Ancienne version"), icon: "clock", cls: "warn", desc: t("Valeurs d'avant la 1.0 : elles ont peut-être changé.") },
    conflit: { label: t("Sources en désaccord"), icon: "alert", cls: "bad", desc: t("Les sources donnent des valeurs différentes.") },
    guide: { label: t("Cité par un guide"), icon: "book", cls: "info", desc: t("Nommé par un guide, pas trouvé dans une base de données.") },
    wiki: { label: t("Texte du wiki"), icon: "clock", cls: "warn", desc: t("Description du wiki, peut-être d'avant la 1.0.") },
    modif: { label: t("Modifiée en 1.0"), icon: "alert", cls: "bad", desc: t("Changée par la 1.0 : la description peut être dépassée.") },
    nouv: { label: t("Nouveauté 1.0"), icon: "spell", cls: "ok", desc: t("Ajoutée par la 1.0.") }
  };
  const ITEM_ST = ["v1", "w10", "pre", "conflit", "guide"];
  const sdot = (st) => STATUS[st] ? `<span class="sdot s-${STATUS[st].cls}" title="${esc(STATUS[st].label + " — " + STATUS[st].desc)}" aria-label="${esc(STATUS[st].label)}">${icon(STATUS[st].icon)}</span>` : "";
  const spill = (st) => STATUS[st] ? `<span class="spill s-${STATUS[st].cls}"><span class="sdot s-${STATUS[st].cls}">${icon(STATUS[st].icon)}</span>${esc(STATUS[st].label)}</span>` : "";

  const RAR = [["legendaire", 5], ["epique", 4], ["rare", 3], ["peu commune", 2], ["commune", 1]];
  const rarRank = (r) => { const n = norm(r); return Math.max(0, ...RAR.filter(([k]) => n.includes(k)).map(([, v]) => v)); };
  const rarKey = (r) => ({ 5: "legendaire", 4: "epique", 3: "rare", 2: "peu-commune", 1: "commune" }[rarRank(r)] || "inconnue");

  const SLOT_GLYPH = { "Tête": "helmet", Torse: "armor", Mains: "gloves", Jambes: "pants", Pieds: "boots" };
  function itemIcon(it) {
    const t = norm(it.type);
    if (it.categorie === "anneau") return "ring";
    if (it.categorie === "sort") return "spell";
    if (it.categorie === "set") return "armor";
    if (it.categorie === "bouclier") return t.includes("ward") || t.includes("garde") ? "ward" : "shield";
    if (it.categorie === "armure") return SLOT_GLYPH[it.emplacement] || (t.includes("gant") ? "gloves" : "armor");
    for (const [k, ic] of [["marteau", "hammer"], ["hache", "axe"], ["massue", "mace"], ["masse", "mace"], ["espadon", "greatsword"], ["epee", "sword"], ["dague", "daggers"], ["arc", "bow"], ["baguette", "wand"], ["baton", "staff"]]) if (t.includes(k)) return ic;
    return "sword";
  }
  const EL_ICON = { feu: "flame", glace: "snow", foudre: "bolt", voile: "skull", poison: "drop", soin: "heart" };
  const ELEMENTS = [["feu", /fire|flame|burn|ember|pyre|feu/i], ["glace", /ice|frost|snow|cold|hail|glace/i], ["foudre", /shock|lightning|thunder|storm|foudre/i], ["voile", /shroud|dark|night|voile/i], ["poison", /poison|venom|acid|toxic/i], ["soin", /heal|renewal|soin/i]];
  const elementOf = (it) => it.element || (ELEMENTS.find(([, re]) => re.test([it.nom, ...(it.atouts || []), ...(it.effets || []), it.typeDegats || ""].join(" "))) || [])[0];
  const initials = (n) => n.replace(/^(Set|Anneau de|Anneau)\s+/i, "").split(/[\s'-]+/).filter((w) => /^[A-Za-zÀ-ÿ]/.test(w) && !/^(of|the|de|du|des|la|le)$/i.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  // Icône dessinée pour chaque objet : forme selon le type, couleur selon l'élément, monogramme du nom.
  const genArt = (it) => {
    const el = elementOf(it);
    return `<span class="gen ${el ? "el-" + el : ""}">${icon(itemIcon(it))}<span class="mono">${esc(initials(nm(it.nom)))}</span>${el ? `<i class="elb">${icon(EL_ICON[el])}</i>` : ""}</span>`;
  };
  const imgOf = (it) => (it && (IMG[it.id] || IMG[it.catalogId])) || null;
  function art(it, size = "") {
    if (!it) return `<span class="art ${size} r-inconnue">${icon("help")}</span>`;
    const im = imgOf(it), rk = rarKey(it.rarete);
    if (im) {
      const wide = im.l > im.h * 1.2 ? " wide" : "";
      return `<span class="art ${size} r-${rk}${wide}">${genArt(it)}<img src="${esc(im.fichier)}" alt="" loading="lazy" decoding="async" onload="this.parentNode.classList.add('loaded')" onerror="this.remove()"></span>`;
    }
    const pieces = (it.pieces || []).map(getItem).filter((p) => p && imgOf(p)).slice(0, 4);
    if (pieces.length >= 2) return `<span class="art ${size} r-${rk} mosaic m${pieces.length}">${pieces.map((p) => `<img src="${esc(imgOf(p).fichier)}" alt="" loading="lazy">`).join("")}</span>`;
    return `<span class="art ${size} r-${rk} generated">${genArt(it)}</span>`;
  };
  const STAT_LABELS = Object.fromEntries(Object.entries({ degats: "Dégâts", armurePhys: "Armure phys.", armureMag: "Armure mag.", parade: "Parade", blocage: "Blocage", durabilite: "Durabilité", vitesse: "Vitesse",
    tension: "Tension", vitesseFleche: "Vitesse flèche", regenMana: "Régén. mana", surcharge: "Surcharge", mana: "Coût mana", incantation: "Incantation", pieces: "Pièces", multDegats: "Mult. dégâts", multVitesse: "Mult. vitesse" }).map(([k, v]) => [k, t(v)]));
  const keyStat = (it) => {
    if (it.stats?.armurePhys != null || it.stats?.armureMag != null) return `<span class="kstat"><b>${it.stats.armurePhys ?? "–"}</b>/<b>${it.stats.armureMag ?? "–"}</b> ${t("armure")}</span>`;
    for (const k of ["degats", "blocage", "parade", "multDegats"]) if (it.stats?.[k] != null) return `<span class="kstat"><b>${esc(it.stats[k])}</b> ${STAT_LABELS[k].toLowerCase()}</span>`;
    if (it.effets?.length) return `<span class="kstat">${txt(it.effets[0])}</span>`;
    if (it.atouts?.length) return `<span class="kstat">${perkH(it.atouts[0])}</span>`;
    return "";
  };
  const lvOf = (it) => it.niveau ?? it.niveauRegion;
  const lvTxt = (it) => it.niveau != null ? t("Niv. {0}", it.niveau) : it.niveauRegion ? t("Zone niv. {0}", it.niveauRegion) : it.categorie === "arme" ? t("Niv. selon la zone") : "";
  const ZONES = (D.map && D.map.zones) || [];
  // Explication du niveau affiché (fiche objet).
  function levelExplain(it) {
    const wikiLv = it.niveauWiki != null ? " " + t("Le wiki affiche « level {0} » : c'est la valeur utilisée pour son calcul de dégâts, pas le niveau de l'objet.", esc(it.niveauWiki)) : "";
    const reg = `<b>${nmh(it.region)}</b>`, zlv = `<b>${esc(it.niveauRegion)}</b>`;
    if (it.niveau != null && it.categorie === "arme" && /–/.test(String(it.niveau))) return `<div class="drow">${icon("info")}<div class="small">${t("Niveau {0} lu dans les fichiers du jeu 1.0 : l'arme évolue avec les améliorations", `<b>${esc(it.niveau)}</b>`)}${it.niveauRegion ? t(", mais on la trouve en {0} (zone de niveau {1})", reg, zlv) : ""}.</div></div>`;
    if (it.niveau == null && it.niveauRegion) return `<div class="drow">${icon("info")}<div class="small">${t("Une arme ou un anneau trouvé prend le niveau de sa zone (wiki officiel : le butin dépend du niveau du joueur et de la difficulté de la zone). Ici : {0}, zone de niveau {1} selon le wiki", reg, zlv)}${/Cinder/.test(it.region) ? " " + t("(PinDrop pour {0})", nmh("Cinder's Cradle")) : ""}.${wikiLv}</div></div>`;
    if (it.niveau == null && it.categorie === "arme") return `<div class="drow">${icon("info")}<div class="small">${t("Niveau non publié : il dépend de l'endroit où vous trouvez ou fabriquez l'arme (butin de donjon, de repaire, d'ennemi ou arme de lore).")}${wikiLv}</div></div>`;
    return "";
  }
  const levelRange = (lv) => { const m = String(lv ?? "").match(/(\d+)(?:\s*[–-]\s*(\d+))?/); return m ? [Number(m[1]), Number(m[2] || m[1])] : null; };

  const STYLE_UI = {
    guerrier: ["sword", "war"], tank: ["shield", "war"], barbare: ["axe", "war"], rodeur: ["bow", "rng"], assassin: ["daggers", "rng"],
    "mage-bataille": ["wand", "mag"], sorcier: ["flame", "mag"], soigneur: ["heart", "mag"], invocateur: ["skull", "mag"], hybride: ["ward", "hyb"]
  };
  const styleIcon = (s) => (STYLE_UI[s] || ["help"])[0];
  const styleColor = (s) => "c-" + (STYLE_UI[s] || [0, "base"])[1];
  const TREE_UI = { Base: ["flame", "base"], Guerrier: ["sword", "war"], "Rôdeur": ["bow", "rng"], Mage: ["wand", "mag"] };
  const treeColor = (t) => "c-" + (TREE_UI[t] || [0, "base"])[1];
  const PORTEE = { melee: ["sword", t("Mêlée")], distance: ["target", t("Distance")], magie: ["wand", t("Magie")] };
  const MODE = { solo: ["user", t("Solo")], equipe: ["users", t("Équipe")] };
  const ROLE = { degats: ["bolt", t("Dégâts")], defense: ["shield", t("Défense")], soutien: ["heart", t("Soutien")] };
  const CAT = { arme: [t("Armes"), "sword"], armure: [t("Armures"), "armor"], set: [t("Sets"), "layers"], bouclier: [t("Boucliers"), "shield"], anneau: [t("Anneaux"), "ring"], sort: [t("Sorts"), "spell"] };
  const WEAPON_SUB = [["sword", "Épées"], ["greatsword", "Espadons"], ["axe", "Haches"], ["hammer", "Marteaux"], ["mace", "Masses"], ["daggers", "Dagues"], ["bow", "Arcs"], ["wand", "Baguettes"], ["staff", "Bâtons"]].map(([k, l]) => [k, t(l)]);
  const ARMOR_SUB = [["Tête", "helmet"], ["Torse", "armor"], ["Mains", "gloves"], ["Jambes", "pants"], ["Pieds", "boots"]];
  const CTX_ICON = { Exploration: "compass", "Groupes d'ennemis": "crowd", Boss: "skull", "Équipe": "users", Solo: "user" };

  const diffLevel = (t) => { const n = norm(t); return n.includes("difficile") ? 3 : n.includes("facile") && n.includes("moyenne") ? 1.5 : n.includes("facile") ? 1 : 2; };
  const pips = (lvl) => `<span class="pips" title="${t("Difficulté")}">${[1, 2, 3].map((i) => `<span class="pip ${lvl >= i ? "on" : lvl >= i - .5 ? "half" : ""}"></span>`).join("")}</span>`;
  const skillChip = (id, extra = "") => { const s = SKILLS[id]; if (!s) return ""; return `<button class="sk ${treeColor(s.arbre)} ${extra}" data-skill="${esc(id)}">${icon(TREE_UI[s.arbre]?.[0] || "flame")}${nmh(s.nom)}</button>`; };
  const srcLinks = (ids) => (ids || []).map((id) => SOURCES[id] ? `<a href="${esc(SOURCES[id].url)}" target="_blank" rel="noopener" title="${esc(SOURCES[id].note || "")}">${esc(SOURCES[id].nom)}</a>` : esc(id)).join(" · ");
  const srcChips = (ids) => (ids || []).filter((id) => SOURCES[id]).map((id) => `<a class="src-chip" href="${esc(SOURCES[id].url)}" target="_blank" rel="noopener" title="${esc(SOURCES[id].nom)}">${esc(SOURCES[id].nom.split(/ — | - /)[0])}</a>`).join("");

  function toast(msg) { const el = $("#toast"); el.textContent = msg; el.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("show"), 2200); }
  async function copy(text, msg) { try { await navigator.clipboard.writeText(text); toast(msg); } catch { prompt(t("Copiez ce lien :"), text); } }
  function openDialog(html) {
    $("#dlg-body").innerHTML = html;
    const d = $("#dlg");
    if (d.showModal) { if (!d.open) d.showModal(); } else d.setAttribute("open", "");
    d.scrollTop = 0;
  }
  const hydrateIcons = (root = document) => $$("[data-icon]", root).forEach((el) => { el.innerHTML = icon(el.dataset.icon); el.removeAttribute("data-icon"); });

  // ── Localisation sur la carte
  const MARKERS = MAP ? byId(MAP.marqueurs) : {};
  const REGIONS = MAP ? MAP.regions : [];
  const regionOf = (it) => { const t = norm([it.obtention, it.obtentionEn].join(" ")); return REGIONS.find((r) => t.includes(norm(r.nom))) || null; };
  const hasMapPin = (it) => (it.marqueurs || []).some((id) => MARKERS[id]);
  const mapLink = (it) => hasMapPin(it) || regionOf(it) ? `#carte/item/${encodeURIComponent(it.id)}` : null;

  // ── En-tête
  function renderHeader() {
    const m = D.meta;
    const days = Math.floor((Date.now() - new Date(m.derniereActualisation + "T12:00:00")) / 864e5);
    const stale = days > 30;
    $("#version-chip").textContent = t("Jeu v{0} · vérifié le {1}", m.versionJeu, fmtDate(m.derniereActualisation, true));
    $("#version-chip").classList.toggle("stale", stale);
    $("#freshness").innerHTML = stale
      ? `<div class="fresh stale">${icon("alert")}<span>${t("Dernière vérification il y a {0} jours : une mise à jour du jeu a pu changer des valeurs.", days)} <a href="#maj">${t("Voir")}</a></span></div>`
      : `<div class="fresh">${icon("info")}<span>${t("Jeu v{0} · {1} objets · certaines valeurs datent d'avant la 1.0.", esc(m.versionJeu), D.items.length)} <button data-help>${t("Comment lire les pastilles ?")}</button></span></div>`;
  }
  function helpDialog() {
    openDialog(`<div class="dhead"><span class="art lg r-legendaire generated">${genArt({ nom: "Guide", categorie: "arme", type: "Épée" })}</span><div><h2>${t("Comment lire ce site")}</h2><p>${t("Trois repères suffisent.")}</p></div></div>
      <h3>${t("1. La couleur du cadre = la rareté")}</h3>
      <div class="legend-list" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr))">${[["commune", "Commune"], ["peu-commune", "Peu commune"], ["rare", "Rare"], ["epique", "Épique"], ["legendaire", "Légendaire"], ["inconnue", "Non indiquée"]].map(([k, l]) => `<div><span class="art xs r-${k} generated">${genArt({ nom: t(l), categorie: "arme", type: "Épée" })}</span>${t(l)}</div>`).join("")}</div>
      <p class="small muted">${t("Quand le wiki n'a pas d'image, l'icône est dessinée : sa forme indique le type, sa couleur l'élément (feu, glace, foudre…), les lettres le nom.")}</p>
      <h3>${t("2. La pastille = la fiabilité de l'info")}</h3>
      <div class="legend-list">${ITEM_ST.map((s) => `<div>${sdot(s)}<span><b>${STATUS[s].label}</b> — ${STATUS[s].desc}</span></div>`).join("")}</div>
      <h3>${t("3. La couleur des compétences = la branche de l'arbre")}</h3>
      <div class="chips">${Object.entries(TREE_UI).map(([tn, [ic, c]]) => `<span class="sk c-${c}">${icon(ic)}${esc(tr(tn))}</span>`).join("")}</div>
      ${I18N.lang === "fr" ? `<h3>${icon("globe")} Noms du jeu</h3><p class="small muted">Les noms soulignés en pointillé sont traduits : survolez-les pour voir le nom anglais. Ceux du wiki français officiel sont repris tels quels ; les autres sont des traductions du site, non officielles.</p>` : ""}
      <p class="small muted" style="margin-top:14px">${t("Les builds sont des conseils (repris de guides), pas des données du jeu. Touchez un objet ou une compétence pour le détail et les sources.")}</p>`);
  }

  // ── Fiche objet
  function itemDetail(id) {
    const it = getItem(id); if (!it) return;
    id = it.id;
    const stats = Object.entries(it.stats || {}).filter(([, v]) => v != null);
    const usedBy = D.builds.filter((b) => b.equipement.some((s) => s.meilleur === id || s.etapes.some((e) => e.item === id)));
    const im = imgOf(it);
    const pieces = (it.pieces || []).map(getItem).filter(Boolean);
    const set = it.set && getItem(it.set);
    const ml = mapLink(it);
    openDialog(`
      ${im && im.l > im.h * 1.2 ? `<img class="banner" src="${esc(im.fichier)}" alt="${esc(t("{0} porté en jeu", nm(it.nom)))}" onerror="this.remove()">` : ""}
      <div class="dhead">${art(it, "xl")}<div><h2>${nmh(it.nom)}</h2>
        ${I18N.lang === "fr" && nm(it.nom) !== it.nom ? `<p class="small muted nom-en">${esc(it.nom)}</p>` : ""}
        <p><span class="r-${rarKey(it.rarete)} rar-txt">${esc(it.rarete ? tr(it.rarete) : t("Rareté non indiquée"))}</span> · ${esc(tr(it.type) || CAT[it.categorie]?.[0] || "")}${it.niveau != null ? ` · ${t("niveau {0}", esc(it.niveau))}` : ""}${it.classe ? ` · ${esc(tr(it.classe))}` : ""}</p></div></div>
      ${levelExplain(it)}
      <div class="chips">${spill(it.statut)}${it.confirmeWiki ? `<span class="spill s-teal">${icon("check")}${t("Existence confirmée par le wiki")}</span>` : ""}</div>
      ${it.statut === "conflit" ? `<div class="warnbox">${icon("alert")}<div><b>${t("Les sources ne sont pas d'accord")}</b><ul class="tight">${(it.conflits || []).map((c) => `<li>${txt(c)}</li>`).join("")}</ul></div></div>` : ""}
      ${it.description ? `<p class="desc">${t("« {0} »", I18N.nomsDansTexte(esc(it.description)))}${I18N.lang === "fr" && D.descTraduites?.has(it.id) ? ` <span class="small muted">(${t("traduction non officielle")})</span>` : ""}</p>` : ""}
      ${stats.length ? `<div class="stat-tiles">${stats.map(([k, v]) => `<div><b>${esc(v)}</b><span>${esc(STAT_LABELS[k] || k)}</span></div>`).join("")}</div>` : `<p class="small muted">${t("Statistiques non publiées par les sources consultées.")}</p>`}
      ${it.attribut || it.typeDegats ? `<div class="drow">${icon("bolt")}<div>${it.attribut ? t("Profite de : {0}", `<b>${esc(tr(it.attribut))}</b>`) : ""}${it.attribut && it.typeDegats ? " · " : ""}${it.typeDegats ? esc(tr(it.typeDegats)) : ""}</div></div>` : ""}
      ${it.atouts ? `<div class="drow">${icon("spell")}<div>${it.atouts.map((a) => `<span class="perk">${perkH(a)}</span>`).join("")}</div></div>` : ""}
      ${it.effets ? `<div class="drow">${icon("spell")}<div>${it.effets.map((a) => `<span class="perk">${txt(a)}</span>`).join("")}</div></div>` : ""}
      ${it.amelioration ? `<div class="drow">${icon("star")}<div><b>${t("Améliorations :")}</b><ul class="tight">${it.amelioration.map((a) => `<li>${txt(a)}</li>`).join("")}</ul></div></div>` : ""}
      ${pieces.length ? `<h3>${t("Pièces du set")}</h3><div class="mini-grid">${pieces.map((p) => `<button class="mini" data-item="${esc(p.id)}">${art(p, "sm")}<span>${esc(tr(p.emplacement || ""))}</span></button>`).join("")}</div>` : ""}
      ${set ? `<div class="drow">${icon("layers")}<div>${t("Fait partie de : {0}", `<button class="ref" data-item="${esc(set.id)}">${nmh(set.nom)}</button>`)}</div></div>` : ""}
      <div class="drow">${icon("pin")}<div><b>${t("Où le trouver :")}</b> ${it.obtention ? txt(it.obtention) : it.obtentionEn ? "" : t("non renseigné")}
        ${it.obtentionEn ? `<div class="small muted">${I18N.lang === "fr" && D.descTraduites?.has("o:" + it.id) ? t("Wiki (traduit, non officiel) :") : t("Wiki (anglais) :")} ${I18N.nomsDansTexte(esc(it.obtentionEn))}</div>` : ""}</div></div>
      ${usedBy.length ? `<div class="drow">${icon("star")}<div><b>${t("Conseillé pour :")}</b> <span class="chips" style="margin-top:6px">${usedBy.map((b) => `<a class="chip small ${styleColor(b.style)}" href="#build/${b.id}">${icon(styleIcon(b.style))}${esc(TAGS[b.id]?.court || b.nom)}</a>`).join("")}</span></div></div>` : ""}
      <div class="btn-row" style="margin-top:14px">
        <button class="btn ${compare.includes(id) ? "" : "primary"}" data-cmp-toggle="${esc(id)}">${icon("compare")}${compare.includes(id) ? t("Retirer du comparateur") : t("Comparer")}</button>
        ${ml ? `<a class="btn" href="${ml}">${icon("map")}${t("Voir sur la carte")}</a>` : ""}
        ${it.wiki ? `<a class="btn" href="${esc(it.wiki)}" target="_blank" rel="noopener">${icon("external")}${t("Page du wiki")}</a>` : ""}
      </div>
      <details class="more"><summary>${icon("book")}${t("Sources et vérification")}</summary><div>
        <p>${t("Vérifié le {0}", fmtDate(it.verifie))}${it.wikiMaj ? ` · ${t("page wiki modifiée le {0}", fmtDate(it.wikiMaj))}` : ""}${it.idInterne ? ` · ${t("identifiant")} <code>${esc(tr(it.idInterne))}</code>` : ""}</p>
        ${it.degatsNote ? `<p>${txt(it.degatsNote)}</p>` : ""}${it.note ? `<p>${txt(it.note)}</p>` : ""}
        <p>${srcLinks(it.sources)}</p>
        <p class="muted">${im ? t("Image : enshrouded.wiki.gg (© Keen Games).") : t("Pas d'image sur le wiki : icône dessinée pour ce site.")}</p></div></details>`);
  }
  function skillDetail(id) {
    const s = SKILLS[id]; if (!s) return;
    const ub = D.builds.filter((b) => [...b.competences.essentielles, ...b.competences.optionnelles, ...(b.competences.ordre || [])].includes(id));
    openDialog(`
      <div class="dhead"><span class="emblem ${treeColor(s.arbre)}">${icon(TREE_UI[s.arbre]?.[0] || "flame")}</span><div><h2>${nmh(s.nom)}</h2>${I18N.lang === "fr" && nm(s.nom) !== s.nom ? `<p class="small muted nom-en">${esc(s.nom)}</p>` : ""}<p>${esc(tr(s.arbre))} › ${esc(tr(s.sous))}</p></div></div>
      ${spill(s.statut)}
      <div class="stat-tiles"><div><b>${s.cout ?? "?"}</b><span>${tp(s.cout ?? 0, "point", "points")}</span></div>${s.rangs ? `<div><b>${s.rangs}</b><span>${tp(s.rangs, "rang", "rangs")}</span></div>` : ""}</div>
      <p style="font-size:1rem">${txt(s.effet)}</p>
      ${s.prerequis ? `<div class="drow">${icon("tree")}<div><b>${t("Prérequis :")}</b> ${s.prerequis.map((p) => skillChip(p)).join(" ")}</div></div>` : ""}
      ${s.conflit ? `<div class="warnbox">${icon("alert")}<div>${txt(s.conflit)}</div></div>` : ""}
      ${ub.length ? `<div class="drow">${icon("star")}<div><b>${t("Utilisée par :")}</b> <span class="chips" style="margin-top:6px">${ub.map((b) => `<a class="chip small ${styleColor(b.style)}" href="#build/${b.id}">${icon(styleIcon(b.style))}${esc(TAGS[b.id]?.court || b.nom)}</a>`).join("")}</span></div></div>` : ""}
      <details class="more"><summary>${icon("book")}${t("Sources")}</summary><div><p>${srcLinks(s.sources)}</p></div></details>`);
  }
  function toggleCompare(id) {
    if (compare.includes(id)) compare = compare.filter((x) => x !== id);
    else if (compare.length >= 4) { toast(t("4 objets maximum dans le comparateur")); return false; }
    else compare.push(id);
    saveCompare(); toast(compare.includes(id) ? t("Ajouté au comparateur") : t("Retiré du comparateur"));
    return true;
  }

  // ── Classement automatique du catalogue par style (heuristique affichée comme telle)
  const WEAPON_PREF = { guerrier: ["sword", "axe", "mace"], tank: ["sword", "axe", "mace"], barbare: ["hammer", "greatsword", "axe"], rodeur: ["bow"], assassin: ["daggers"],
    "mage-bataille": ["wand"], sorcier: ["staff"], soigneur: ["staff", "wand"], invocateur: ["wand", "staff"], hybride: ["wand"] };
  const CLASS_PREF = { guerrier: "Mêlée", tank: "Mêlée", barbare: "Mêlée", rodeur: "Distance", assassin: "Distance", "mage-bataille": "Magie", sorcier: "Magie", soigneur: "Magie", invocateur: "Magie", hybride: "Magie" };
  const KEYWORDS = {
    "mage-bataille": ["wand", "intelligence", "mana", "magic", "spirit"], sorcier: ["staff", "spell", "mana", "intelligence", "magic", "spirit"],
    soigneur: ["heal", "mana", "spirit", "intelligence"], invocateur: ["summon", "skeleton", "totem", "mana", "intelligence"],
    guerrier: ["one-handed", "health", "constitution", "strength", "melee", "parry", "block"], tank: ["health", "constitution", "armor", "block", "parry", "stagger"],
    barbare: ["two-handed", "strength", "melee", "health", "critical"], rodeur: ["bow", "ranged", "dexterity", "stamina", "headshot", "critical"],
    assassin: ["dagger", "backstab", "sneak", "dexterity", "critical", "stamina"], hybride: ["wand", "health", "constitution", "mana", "block"]
  };
  const AUTO_SLOTS = [
    ["Arme", (it, st) => it.categorie === "arme" && WEAPON_PREF[st].includes(itemIcon(it)) && (!["guerrier", "tank"].includes(st) || /une main/i.test(it.type)) && (st !== "barbare" || /deux mains|espadon/i.test(it.type))],
    ["Main secondaire", (it, st) => it.categorie === "bouclier" && (["mage-bataille", "hybride"].includes(st) ? /ward|garde/i.test(it.type + it.nom) || st === "hybride" : ["tank", "guerrier"].includes(st) && !/ward|garde/i.test(it.type + it.nom)), ["tank", "guerrier", "mage-bataille", "hybride"]],
    ["Tête", (it) => it.categorie === "armure" && it.emplacement === "Tête"], ["Torse", (it) => it.categorie === "armure" && it.emplacement === "Torse"],
    ["Mains", (it) => it.categorie === "armure" && it.emplacement === "Mains"], ["Jambes", (it) => it.categorie === "armure" && it.emplacement === "Jambes"],
    ["Pieds", (it) => it.categorie === "armure" && it.emplacement === "Pieds"], ["Anneau", (it) => it.categorie === "anneau"],
    ["Sort", (it) => it.categorie === "sort", ["sorcier", "soigneur", "invocateur", "mage-bataille"]]
  ];
  // Niveau utilisable : un objet évolutif (ex. 1–55) ne s'obtient pas avant d'atteindre sa région.
  const minLevel = (it) => { const lr = levelRange(lvOf(it)); if (!lr) return null; const rg = it.niveau != null && it.niveauRegion ? levelRange(it.niveauRegion) : null; return rg ? [Math.max(lr[0], rg[0]), Math.max(lr[1], rg[0])] : lr; };
  const STAGE_RANGE = { debut: [0, 15], milieu: [16, 35], fin: [36, 99] };
  function autoPicks(style, st) {
    const [lo, hi] = STAGE_RANGE[st] || STAGE_RANGE.fin, kw = KEYWORDS[style] || [];
    return AUTO_SLOTS.filter(([, , only]) => !only || only.includes(style)).map(([slot, pred]) => {
      const cands = D.items.filter((it) => {
        if (!pred(it, style)) return false;
        if (it.categorie === "armure" && it.classe && CLASS_PREF[style] && it.classe !== CLASS_PREF[style] && !(style === "hybride" && it.classe === "Mêlée")) return false;
        const lr = minLevel(it);
        if (!lr) return it.categorie === "anneau";
        // Étape selon le niveau d'accès : Début < 15 ≤ Milieu < 35 ≤ Fin (une zone 15–20 n'est pas « début de partie »).
        return st === "debut" ? lr[0] < 15 : st === "milieu" ? lr[0] < 35 && lr[1] >= 15 : lr[1] >= 35;
      }).map((it) => {
        const lr = minLevel(it) || [0, 0], lvl = Math.min(lr[1], hi);
        const text = norm([...(it.effets || []), ...(it.atouts || []), it.typeEn || "", it.nom].join(" "));
        const hits = kw.filter((k) => text.includes(k));
        if (it.categorie === "sort" && style === "soigneur" && !/heal/i.test(it.nom)) return null;
        if (it.categorie === "sort" && style === "invocateur" && !/totem|skeleton|summon|entangle/i.test(it.nom)) return null;
        const score = lvl * 2 + rarRank(it.rarete) * 4 - (it.categorie === "anneau" && !hits.length ? 15 : 0) + Math.min(hits.length, 3) * 6 + (it.statut === "v1" || it.statut === "w10" ? 3 : 0) + ((it.stats?.armurePhys || 0) + (it.stats?.armureMag || 0)) / 40;
        return { it, score, hits, lvl: lr };
      }).filter(Boolean).sort((a, b) => b.score - a.score);
      const seen = new Set(), top = [];
      for (const c of cands) { const k = c.it.set || c.it.id; if (seen.has(k) && top.length) continue; seen.add(k); top.push(c); if (top.length === 3) break; }
      return { slot, top };
    }).filter((s) => s.top.length);
  }

  // ── Tronc commun (compétences utiles à tous)
  const TRONC = D.tronc;
  const skillCost = (s) => s ? (s.rangs > 1 ? `${s.cout} pt × ${s.rangs}` : `${s.cout ?? "?"} ${tp(s.cout ?? 1, "pt", "pts")}`) : "";
  const troncIds = () => TRONC ? TRONC.groupes.filter((g) => g.niveau !== "selon").flatMap((g) => g.competences.map((c) => c.id)) : [];
  function troncSection(compact) {
    if (!TRONC) return "";
    if (compact) {
      const ess = TRONC.groupes.find((g) => g.niveau === "indispensable");
      return `<div class="tronc-compact">${icon("star")}<span><b>${t("À prendre aussi, comme sur tout personnage :")}</b></span><div class="chips">${ess.competences.map((c) => skillChip(c.id)).join("")}</div><a href="#competences" class="small">${t("Tout le tronc commun →")}</a></div>`;
    }
    let total = 0;
    const path = TRONC.premiersPoints.map((id, i) => { const s = SKILLS[id]; total += s?.cout || 0; return `<div class="step"><span class="step-n">${i + 1}</span>${skillChip(id)}<span class="step-cost">${t("{0} pt · total {1}", s?.cout ?? "?", total)}</span></div>`; }).join("");
    return `
      <section class="tronc">
        <h2>${icon("star")}${t("Tronc commun : pour tous les personnages")}</h2>
        <p class="lead" style="margin-bottom:12px">${txt(TRONC.intro)}</p>
        <h3>${icon("arrow")} ${t("Par où commencer")}</h3>
        <div class="steps-path">${path}</div>
        <p class="small muted">${txt(TRONC.premiersPointsNote)} ${t("Sources :")} ${srcLinks(TRONC.premiersPointsSources)}</p>
        <div class="tronc-groups">${TRONC.groupes.map((g) => `
          <div class="tronc-group lvl-${g.niveau}">
            <h3>${icon(g.icone)} ${txt(g.titre)} <span class="lvl-tag">${g.niveau === "indispensable" ? t("Indispensable") : g.niveau === "conseille" ? t("Conseillé") : t("Selon le style")}</span></h3>
            ${g.competences.map((c) => { const s = SKILLS[c.id]; if (!s) return ""; return `<div class="tronc-row">
              <button class="sk ${treeColor(s.arbre)}" data-skill="${esc(c.id)}">${icon(TREE_UI[s.arbre]?.[0] || "flame")}${nmh(s.nom)}</button>
              <span class="tronc-cost">${skillCost(s)}</span>
              <div class="tronc-why">${txt(c.pourquoi)}${c.citation ? ` <i class="muted">${txt(c.citation)}</i>` : ""}${c.nuance ? `<div class="small muted">${icon("info")} ${txt(c.nuance)}</div>` : ""}
                <div class="tronc-src">${c.site ? `<span class="spill s-ed">${t("Conseil du site")}</span>` : srcChips(c.sources)}${s.conflit ? `<span class="spill s-bad" title="${esc(tr(s.conflit))}">${icon("alert")}${t("Sources en désaccord")}</span>` : ""}</div></div>
            </div>`; }).join("")}
            ${g.note ? `<p class="small muted">${txt(g.note)}</p>` : ""}
          </div>`).join("")}</div>
      </section>`;
  }

  // ════════════ BUILDS ════════════
  const quiz = { portee: "", mode: "", role: "" };
  const matches = (b) => { const t = TAGS[b.id] || {}; return (!quiz.portee || t.portee === quiz.portee) && (!quiz.mode || (t.modes || []).includes(quiz.mode)) && (!quiz.role || (t.roles || []).includes(quiz.role)); };
  function quizRow(key, label, opts) {
    return `<div class="quiz-q"><span>${label}</span><div class="chips">${Object.entries(opts).map(([k, [ic, l]]) => `<button class="chip" data-quiz="${key}:${k}" aria-pressed="${quiz[key] === k}">${icon(ic)}${l}</button>`).join("")}</div></div>`;
  }
  const tierBadge = (b) => b.tiers?.solo ? `<span class="tier" title="${esc(t("Classement {0}", SOURCES[b.tiers.source]?.nom || ""))}">${icon("trophy")}Solo ${b.tiers.solo} · Duo ${b.tiers.duo}</span>` : "";
  function buildCard(b) {
    const tg = TAGS[b.id] || {};
    const preview = b.equipement.map((s) => getItem(s.meilleur)).filter(Boolean).slice(0, 4);
    return `<a class="bcard ${styleColor(b.style)} ${matches(b) ? "" : "dim"}" href="#build/${b.id}">
      <div class="bcard-top"><span class="emblem">${icon(styleIcon(b.style))}</span><div><h3>${esc(tg.court || b.nom)}</h3>${pips(diffLevel(b.difficulte))}</div></div>
      <p>${txt(tg.accroche || b.role)}</p>
      ${preview.length ? `<div class="preview">${preview.map((it) => art(it, "xs")).join("")}</div>` : ""}
      <div class="tags">${tg.portee ? `<span class="tag">${icon(PORTEE[tg.portee][0])}${PORTEE[tg.portee][1]}</span>` : ""}${(tg.modes || []).map((m) => `<span class="tag">${icon(MODE[m][0])}${MODE[m][1]}</span>`).join("")}${tierBadge(b)}</div>
      <div class="bcard-foot">${b.complet ? `<span class="tag hot">${icon("star")}${t("Fiche complète")}</span>` : b.confiance === "editoriale" ? `<span class="tag ed">${t("Expérimental")}</span>` : `<span class="tag">${t("Équipement 1.0 détaillé")}</span>`}<span class="muted">${icon("arrow")}</span></div>
    </a>`;
  }
  function viewBuilds() {
    const sorted = [...D.builds].sort((a, b) => matches(b) - matches(a) || b.complet - a.complet);
    const n = D.builds.filter(matches).length, active = quiz.portee || quiz.mode || quiz.role;
    const mine = store.get("ens.myBuilds", []);
    app.innerHTML = `
      <h1>${t("Trouvez votre build")}</h1>
      <p class="lead">${t("Trois questions, et les builds qui vous correspondent s'allument.")}</p>
      <div class="quiz">
        ${quizRow("portee", t("Comment combattre ?"), PORTEE)}
        ${quizRow("mode", t("Avec qui ?"), MODE)}
        ${quizRow("role", t("Votre rôle ?"), ROLE)}
        <div class="quiz-foot"><span class="muted small">${active ? tp(n, "{0} build correspond", "{0} builds correspondent").replace(/^(\d+)/, '<b style="color:var(--text)">$1</b>') : t("{0} builds disponibles", D.builds.length)}</span>
          ${active ? `<button class="btn small" data-quiz-reset>${icon("refresh")}${t("Recommencer")}</button>` : ""}</div>
      </div>
      <h2>${icon("star")}Builds</h2>
      <div class="grid">${sorted.map(buildCard).join("")}</div>
      <h2>${icon("edit")}${t("Mes builds")}</h2>
      <div class="mybuilds">
        <a class="mybuild" href="#planner" style="text-decoration:none;color:inherit;border-style:dashed"><span class="emblem c-base">${icon("edit")}</span><div><b>${t("Créer mon build")}</b><span class="small muted">${t("Armes, compétences, lien à partager")}</span></div></a>
        ${mine.map((m, i) => `<div class="mybuild ${styleColor(m.style)}"><span class="emblem">${icon(styleIcon(m.style))}</span><div><b>${esc(m.nom || t("Sans nom"))}</b><span class="small muted">${tp(m.skills.length, "{0} compétence", "{0} compétences")} · ${tp(Object.values(m.gear).filter(Boolean).length, "{0} objet", "{0} objets")}</span></div>
          <a class="icon-btn" href="#planner=${encodeBuild(m)}" title="${t("Ouvrir")}" aria-label="${t("Ouvrir")}">${icon("arrow")}</a><button class="icon-btn" data-del-mine="${i}" title="${t("Supprimer")}" aria-label="${t("Supprimer")}">${icon("trash")}</button></div>`).join("")}
      </div>`;
  }

  // ── Fiche build
  const STAGES = [["debut", t("Début")], ["milieu", t("Milieu")], ["fin", t("Fin")]];
  // Étape d'un conseil d'équipement (« Début (niv. 12) », « Fin de partie »…) : mots traduits à l'affichage
  const etapeTxt = (s) => I18N.lang === "en" ? String(s ?? "").replace(/^[^(]+/, (w) => tr(w.trim()) + (w.endsWith(" ") ? " " : "")).replace(/\(niv\. /g, "(lvl ") : String(s ?? "");
  let stage = "fin";
  const AUTO_SLOT = { "Arme principale": "Arme", "Main secondaire": "Main secondaire", "Tête": "Tête", Torse: "Torse", Mains: "Mains", Jambes: "Jambes", Pieds: "Pieds", Anneau: "Anneau", Sorts: "Sort" };
  function slotChoice(slot, st, auto) {
    const find = (key) => slot.etapes.find((e) => norm(e.etape).startsWith(key) && e.item) || slot.etapes.find((e) => norm(e.etape).startsWith(key));
    let c;
    if (st === "fin") { const e = find("fin"); c = { item: slot.meilleur || e?.item, texte: e?.texte }; }
    else { const e = find(st) || find("toutes") || find("progression"); c = e ? { item: e.item, texte: e.texte } : { item: null, texte: null }; }
    // Aucun objet conseillé par une source pour cette étape : meilleur objet du catalogue (classement automatique).
    if (!c.item && auto) { const top = auto[AUTO_SLOT[slot.emplacement]]?.[0]; if (top) c = { item: top.it.id, texte: c.texte, auto: true }; }
    return c;
  }
  const SLOT_ICON = { "Arme principale": "sword", "Main secondaire": "shield", "Bâton (optionnel)": "staff", Armure: "armor", Mains: "gloves", "Tête": "helmet", Torse: "armor", Jambes: "pants", Pieds: "boots", Anneau: "ring", Sorts: "spell" };
  function renderLoadout(b) {
    const auto = autoPicks(b.style, stage);
    const autoMap = Object.fromEntries(auto.map((x) => [x.slot, x.top]));
    $("#loadout").innerHTML = b.equipement.map((s, i) => {
      const c = slotChoice(s, stage, autoMap), it = getItem(c.item);
      return `<button class="slot ${it ? "r-" + rarKey(it.rarete) : ""}" data-slot="${b.id}:${i}">
        <span class="slot-lbl">${esc(tr(s.emplacement))}${c.auto ? ` <span class="auto-tag" title="${t("Aucune source ne conseille d'objet ici à cette étape : meilleur objet du catalogue.")}">auto</span>` : ""}</span>
        ${it ? art(it, "lg") : `<span class="art lg empty">${icon(SLOT_ICON[s.emplacement] || "help")}</span>`}
        <span class="slot-name">${it ? nmh(it.nom) : /optionnel/i.test(s.emplacement) ? t("Pas utile à ce stade") : c.texte ? t("Au choix") : t("Pas de conseil à ce stade")}</span>
        ${it ? `<span class="slot-foot">${sdot(it.statut)}${hasMapPin(it) ? `<span class="pinmark" title="${t("Emplacement précis sur la carte")}">${icon("pin")}</span>` : ""}</span>` : `<span class="slot-note">${c.texte ? t("voir le conseil") : t("voir les suggestions ci-dessous")}</span>`}
      </button>`;
    }).join("");
    $("#auto").innerHTML = auto.map(({ slot, top }) => `<div class="auto-row"><span class="auto-slot">${icon(SLOT_ICON[slot] || SLOT_GLYPH[slot] || (slot === "Arme" ? "sword" : slot === "Sort" ? "spell" : "ring"))}${esc(tr(slot))}</span>
      <div class="auto-items">${top.map(({ it, hits }, k) => `<button class="auto-item" data-item="${esc(it.id)}">${k === 0 ? `<span class="medal">1</span>` : ""}${art(it, "sm")}<span><b>${nmh(it.nom)}</b><small>${[esc(lvTxt(it).toLowerCase()), esc(tr(it.rarete || "")), hits.length ? esc(hits.join(", ")) : ""].filter(Boolean).join(" · ")}</small></span>${sdot(it.statut)}</button>`).join("")}</div></div>`).join("")
      || `<p class="muted small">${t("Aucun objet du catalogue ne correspond à cette étape.")}</p>`;
  }
  function slotDialog(bid, i) {
    const b = BUILDS[bid], s = b.equipement[i];
    const rows = [];
    const best = s.meilleur ? { etape: t("Recommandé (fin de partie)"), item: s.meilleur } : null;
    if (best) rows.push(best);
    s.etapes.forEach((e) => { if (best && e.item === s.meilleur) { if (e.texte) best.texte = e.texte; } else rows.push(e); });
    openDialog(`<div class="dhead"><span class="art lg empty">${icon(SLOT_ICON[s.emplacement] || "help")}</span><div><h2>${esc(tr(s.emplacement))}</h2><p>${esc(TAGS[bid]?.court || b.nom)} · ${t("toutes les options")}</p></div></div>
      <div class="opt-list">${rows.map((e) => { const it = getItem(e.item); return it
        ? `<button class="opt-row" data-item="${esc(it.id)}">${art(it, "sm")}<div><b>${nmh(it.nom)}</b><span>${esc(etapeTxt(e.etape))}${e.texte ? " — " + txt(e.texte) : ""}${it.niveau != null ? ` · ${t("niv. {0}", esc(it.niveau))}` : ""}</span></div>${sdot(it.statut)}</button>`
        : `<div class="opt-row static"><span class="art sm empty">${icon("info")}</span><div><b>${esc(etapeTxt(e.etape))}</b><span>${txt(e.texte || "")}</span></div></div>`; }).join("")}</div>
      ${(() => { const top = Object.fromEntries(autoPicks(b.style, stage).map((x) => [x.slot, x.top]))[AUTO_SLOT[s.emplacement]] || []; return top.length ? `<h3 style="margin-top:16px">${icon("trophy")} ${t("Meilleurs objets du catalogue — étape « {0} »", STAGES.find(([k]) => k === stage)[1])}</h3>
        <div class="opt-list">${top.map(({ it, hits }) => `<button class="opt-row" data-item="${esc(it.id)}">${art(it, "sm")}<div><b>${nmh(it.nom)}</b><span>${t("Suggestion automatique")}${it.niveau != null ? ` · ${t("niv. {0}", esc(it.niveau))}` : ""}${hits.length ? " · " + esc(hits.join(", ")) : ""}</span></div>${sdot(it.statut)}</button>`).join("")}</div>` : ""; })()}
      ${s.sources?.length ? `<p class="small muted" style="margin-top:12px">${t("Recommandé par :")} ${srcLinks(s.sources)}</p>` : ""}`);
  }
  const PRIO = { "tres haute": 100, haute: 75, moyenne: 50, "faible a moyenne": 32, faible: 20, inutiles: 4 };
  function viewBuild(id) {
    const b = BUILDS[id];
    if (!b) { app.innerHTML = `<div class="empty">${icon("help")}<p>${t("Build introuvable.")}</p><a class="btn" href="#builds">${t("Retour aux builds")}</a></div>`; return; }
    const tg = TAGS[id] || {}, c = b.competences;
    const res = (b.ressources || []).filter((r) => SOURCES[r]);
    app.innerHTML = `
      <a class="back" href="#builds">${icon("back")}${t("Tous les builds")}</a>
      <section class="hero ${styleColor(b.style)}">
        <span class="emblem xl">${icon(styleIcon(b.style))}</span>
        <div style="flex:1;min-width:0">
          <h1>${esc(tg.court || b.nom)}</h1>
          <p>${txt(tg.accroche || b.role)}</p>
          <div class="tags" style="margin-bottom:12px">${tg.portee ? `<span class="tag">${icon(PORTEE[tg.portee][0])}${PORTEE[tg.portee][1]}</span>` : ""}${(tg.modes || []).map((m) => `<span class="tag">${icon(MODE[m][0])}${MODE[m][1]}</span>`).join("")}<span class="tag">${pips(diffLevel(b.difficulte))}&nbsp;${esc(tr(b.difficulte))}</span>${tierBadge(b)}${b.confiance === "editoriale" ? `<span class="tag ed">${t("Expérimental")}</span>` : ""}</div>
          <div class="btn-row"><button class="btn small" data-share="${b.id}">${icon("link")}${t("Partager")}</button><a class="btn small" href="#planner=${encodeBuild(fromBuild(b))}">${icon("edit")}${t("Personnaliser")}</a></div>
        </div>
      </section>

      ${tg.enBref ? `<h2>${icon("bolt")}${t("En bref")}</h2><div class="brief ${styleColor(b.style)}">${tg.enBref.map((x, i) => `<div><b>${i + 1}</b>${txt(x)}</div>`).join("")}</div>` : ""}

      <h2>${icon("sword")}${t("Équipement conseillé par les guides")}</h2>
      <div class="seg" role="group" aria-label="${t("Étape de progression")}">${STAGES.map(([k, l]) => `<button data-stage="${k}" aria-pressed="${stage === k}">${l}</button>`).join("")}</div>
      <div id="loadout" class="loadout"></div>
      <p class="small muted">${t("Touchez un emplacement pour voir toutes les options et les guides qui les recommandent.")} ${icon("pin")} = ${t("emplacement précis sur la carte.")} <span class="auto-tag">auto</span> = ${t("aucune source ne conseille d'objet à cette étape : meilleur objet du catalogue.")}</p>

      <h2>${icon("trophy")}${t("Le meilleur du catalogue pour ce style")}</h2>
      <p class="small muted">${t("Classement automatique parmi les {0} objets, selon l'étape choisie au-dessus : niveau, rareté, effets adaptés au style (mots-clés affichés) et fraîcheur des données. C'est une aide au choix, pas un avis de joueur.", D.items.length)}</p>
      <div id="auto" class="auto"></div>

      <h2>${icon("bolt")}${t("Attributs")}</h2>
      <div class="card-plain ${styleColor(b.style)}">${b.attributs.map((a) => `<div class="attr"><span class="attr-name">${esc(tr(a.nom))}</span><span class="meter" title="${esc(tr(a.priorite))}"><i style="width:${PRIO[norm(a.priorite)] ?? 50}%"></i></span><small>${esc(tr(a.priorite))}</small></div>`).join("")}</div>

      <h2>${icon("tree")}${t("Compétences")}</h2>
      ${troncSection(true)}
      <h3>${t("Indispensables pour ce build")}</h3>
      <div class="chips">${c.essentielles.map((s) => skillChip(s)).join("")}</div>
      ${c.ordre ? `<h3 style="margin-top:14px">${t("Dans quel ordre")}</h3><div class="path">${c.ordre.map((s) => skillChip(s)).join(icon("arrow", "sep"))}</div>` : ""}
      ${c.optionnelles.length ? `<h3 style="margin-top:14px">${t("En option")}</h3><div class="chips">${c.optionnelles.map((s) => skillChip(s, "opt")).join("")}</div>` : ""}

      <h2>${icon("compass")}${t("Selon la situation")}</h2>
      <div class="ctx ${styleColor(b.style)}">${b.contextes.map((x) => `<div>${icon(CTX_ICON[x.nom] || "info")}<span><strong>${esc(tr(x.nom))}</strong>${txt(x.texte)}</span></div>`).join("")}</div>

      ${res.length ? `<h2>${icon("video")}${t("Pour approfondir")}</h2><div class="res-list">${res.map((r) => { const s = SOURCES[r]; return `<a class="res" href="${esc(s.url)}" target="_blank" rel="noopener">${icon(s.type === "video" ? "video" : "book")}<span><b>${esc(s.nom)}</b><small>${s.miseAJourSource ? fmtDate(s.miseAJourSource) + " · " : ""}${esc(s.type === "video" ? t("Vidéo (non analysée, titre et date seulement)") : tr(s.type))}</small></span>${icon("external")}</a>`; }).join("")}</div>` : ""}

      <details class="more"><summary>${icon("book")}${t("Pour aller plus loin")}</summary><div>
        <h3>${t("Comment le jouer")}</h3><p>${txt(b.jeu)}</p>
        <h3>${t("Ce qui marche bien ensemble")}</h3><ul class="tight">${b.synergies.map((s) => `<li>${txt(s)}</li>`).join("")}</ul>
        <h3>${t("Rôle et prérequis")}</h3><p>${txt(b.role)}</p><p>${txt(b.prerequis)}</p>
        ${c.note ? `<p class="muted">${txt(c.note)}</p>` : ""}
        <h3>${t("Sources")}</h3><p>${srcLinks(b.sources)}</p>
        <p class="muted">${t("Ce build est un conseil éditorial, pas une donnée du jeu.")}</p>
      </div></details>`;
    renderLoadout(b);
  }

  // ── Mon build
  const PLANNER_SLOTS = [["arme", "Arme", "sword", (i) => i.categorie === "arme"], ["second", "Main secondaire", "shield", (i) => i.categorie === "bouclier"],
    ["sort", "Sort", "spell", (i) => i.categorie === "sort"], ["tete", "Tête", "helmet", (i) => i.categorie === "armure" && i.emplacement === "Tête"],
    ["torse", "Torse", "armor", (i) => (i.categorie === "armure" && i.emplacement === "Torse") || (i.categorie === "armure" && !i.emplacement)],
    ["mains", "Mains", "gloves", (i) => i.categorie === "armure" && i.emplacement === "Mains"], ["jambes", "Jambes", "pants", (i) => i.categorie === "armure" && i.emplacement === "Jambes"],
    ["pieds", "Pieds", "boots", (i) => i.categorie === "armure" && i.emplacement === "Pieds"], ["anneau", "Anneau", "ring", (i) => i.categorie === "anneau"]].map(([k, l, ic, p]) => [k, tr(l), ic, p]);
  function encodeBuild(o) { return encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(o))))); }
  function decodeBuild(s) { try { return JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(s))))); } catch { return null; } }
  function fromBuild(b) {
    const gear = {};
    PLANNER_SLOTS.forEach(([k, , , pred]) => { gear[k] = b.equipement.map((s) => s.meilleur).map(getItem).find((it) => it && pred(it))?.id || ""; });
    return { nom: (TAGS[b.id]?.court || b.nom) + " " + t("(perso)"), style: b.style, gear, skills: [...new Set([...(b.competences.ordre || []), ...b.competences.essentielles])].filter((s) => SKILLS[s]), notes: "" };
  }
  function viewPlanner(encoded) {
    const decoded = encoded ? decodeBuild(encoded) : null;
    if (encoded && !decoded) toast(t("Lien de build invalide"));
    const p = decoded || { nom: "", style: "", gear: {}, skills: [], notes: "" };
    if (p.gear.armure && !p.gear.torse) p.gear.torse = p.gear.armure;
    const cost = () => p.skills.reduce((a, s) => a + (SKILLS[s]?.cout || 0), 0);
    app.innerHTML = `
      <a class="back" href="#builds">${icon("back")}Builds</a>
      <h1>${t("Mon build")}</h1>
      <p class="lead">${t("Choisissez votre équipement et vos compétences, puis enregistrez ou partagez.")}</p>
      <form id="planner" onsubmit="return false">
        <div class="panel">
          <label class="field">${t("Nom du build")}<input name="nom" value="${esc(p.nom)}" maxlength="60" placeholder="${t("ex. Mon mage de feu")}"></label>
          <label class="field">${t("Style")}<select name="style"><option value="">—</option>${D.styles.map((s) => `<option value="${s.id}" ${p.style === s.id ? "selected" : ""}>${esc(s.nom)}</option>`).join("")}</select></label>
        </div>
        <h2>${icon("sword")}${t("Équipement")}</h2>
        <div class="pl-slots">${PLANNER_SLOTS.map(([k, label, ic, pred]) => `<div class="pl-slot"><span data-art="${k}"></span>
          <label class="field">${label}<select name="gear-${k}"><option value="">—</option>${D.items.filter(pred).map((i) => [i, nm(i.nom)]).sort((a, b) => a[1].localeCompare(b[1])).map(([i, n]) => `<option value="${i.id}" ${getItem(p.gear[k])?.id === i.id ? "selected" : ""}>${esc(n)}${i.niveau != null ? " (" + i.niveau + ")" : ""}</option>`).join("")}</select></label></div>`).join("")}</div>
        <h2>${icon("tree")}${t("Compétences")} <span id="cost" class="tag hot"></span></h2>
        <div class="bar"><div class="searchbox">${icon("search")}<input id="sk-filter" type="search" placeholder="${t("Filtrer les compétences…")}"></div><button class="btn" type="button" id="pl-tronc">${icon("star")}${t("Ajouter le tronc commun")}</button></div>
        <div class="sk-pick" id="sk-pick">${D.skills.map((s) => `<button type="button" class="sk ${treeColor(s.arbre)}" data-pick="${s.id}" aria-pressed="${p.skills.includes(s.id)}" data-name="${esc(norm(s.nom + " " + nm(s.nom) + " " + s.arbre + " " + tr(s.arbre)))}">${icon(TREE_UI[s.arbre]?.[0] || "flame")}${nmh(s.nom)} <span class="muted">${s.cout ?? "?"}</span></button>`).join("")}</div>
        <label class="field" style="margin-top:14px">${t("Notes")}<textarea name="notes" rows="2" maxlength="500">${esc(p.notes)}</textarea></label>
        <div class="btn-row" style="margin-top:14px"><button class="btn primary" id="pl-save" type="button">${icon("save")}${t("Enregistrer")}</button><button class="btn" id="pl-share" type="button">${icon("link")}${t("Copier le lien")}</button></div>
        <p class="small muted">${t("Coûts d'un rang par compétence, d'après le wiki (peut-être avant 1.0). Maximum en 1.0 : {0} points.", D.skillMeta.pointsTotal)}</p>
      </form>`;
    const form = $("#planner");
    const read = () => {
      const f = new FormData(form);
      p.nom = f.get("nom"); p.style = f.get("style"); p.notes = f.get("notes");
      PLANNER_SLOTS.forEach(([k, , ic]) => { p.gear[k] = f.get("gear-" + k); const it = getItem(p.gear[k]); $(`[data-art="${k}"]`).innerHTML = it ? art(it, "sm") : `<span class="art sm empty">${icon(ic)}</span>`; });
      p.skills = $$("#sk-pick [aria-pressed=true]").map((x) => x.dataset.pick);
      $("#cost").textContent = `${cost()} / ${D.skillMeta.pointsTotal} pts`;
    };
    read();
    form.addEventListener("input", read);
    $("#sk-pick").addEventListener("click", (e) => { const b = e.target.closest("[data-pick]"); if (!b) return; b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true"); read(); });
    $("#pl-tronc").addEventListener("click", () => { troncIds().forEach((id) => { const el = $(`#sk-pick [data-pick="${id}"]`); if (el) el.setAttribute("aria-pressed", "true"); }); read(); toast(t("Tronc commun ajouté")); });
    $("#sk-filter").addEventListener("input", (e) => { const q = norm(e.target.value); $$("#sk-pick [data-pick]").forEach((l) => { l.style.display = l.dataset.name.includes(q) ? "" : "none"; }); });
    $("#pl-save").addEventListener("click", () => {
      read(); const mine = store.get("ens.myBuilds", []);
      const idx = p.nom ? mine.findIndex((m) => m.nom === p.nom) : -1;
      if (idx >= 0) mine[idx] = p; else mine.push(p);
      toast(store.set("ens.myBuilds", mine) ? t("Build enregistré") : t("Stockage indisponible : utilisez le lien"));
    });
    $("#pl-share").addEventListener("click", () => { read(); const url = location.href.split("#")[0] + "#planner=" + encodeBuild(p); history.replaceState(null, "", url); copy(url, t("Lien copié")); });
  }

  // ════════════ ÉQUIPEMENTS ════════════
  const DEFAULT_EQ = { q: "", cat: "", sub: "", style: "", rar: "", st: "", lvmin: "", lvmax: "", carte: "", sort: "niveau-desc" };
  const eq = Object.assign({}, DEFAULT_EQ, store.get("ens.eq3", {}));
  let filtersOpen = false, eqLimit = 60;
  function viewEquipements() {
    const advCount = ["style", "rar", "st", "lvmin", "lvmax", "carte"].filter((k) => eq[k] !== "").length;
    eqLimit = 60;
    app.innerHTML = `
      <h1>${t("Équipements")}</h1>
      <p class="lead">${t("{0} objets. Touchez-en un pour sa fiche : le cadre indique la rareté, la pastille la fiabilité.", D.items.length)}</p>
      <div class="chips scroll" role="group" aria-label="${t("Catégorie")}">
        <button class="chip" data-cat="" aria-pressed="${!eq.cat}">${icon("grid")}${t("Tout")}</button>
        ${Object.entries(CAT).map(([k, [l, ic]]) => `<button class="chip" data-cat="${k}" aria-pressed="${eq.cat === k}">${icon(ic)}${l}</button>`).join("")}
      </div>
      ${eq.cat === "arme" ? `<div class="chips scroll" style="margin-top:8px" role="group" aria-label="${t("Type d'arme")}"><button class="chip small" data-sub="" aria-pressed="${!eq.sub}">${t("Toutes")}</button>${WEAPON_SUB.map(([k, l]) => `<button class="chip small" data-sub="${k}" aria-pressed="${eq.sub === k}">${icon(k)}${l}</button>`).join("")}</div>` : ""}
      ${eq.cat === "armure" ? `<div class="chips scroll" style="margin-top:8px" role="group" aria-label="${t("Emplacement")}"><button class="chip small" data-sub="" aria-pressed="${!eq.sub}">${t("Tous")}</button>${ARMOR_SUB.map(([k, ic]) => `<button class="chip small" data-sub="${k}" aria-pressed="${eq.sub === k}">${icon(ic)}${esc(tr(k))}</button>`).join("")}</div>` : ""}
      <div class="bar">
        <div class="searchbox">${icon("search")}<input id="eq-q" type="search" value="${esc(eq.q)}" placeholder="${t("Nom, atout, effet ou lieu…")}" aria-label="${t("Rechercher")}"></div>
        <button class="btn" id="eq-toggle" aria-expanded="${filtersOpen}">${icon("sliders")}${t("Filtres")}${advCount ? ` <span class="count">${advCount}</span>` : ""}</button>
      </div>
      <div class="panel" id="eq-panel" ${filtersOpen ? "" : "hidden"}>
        <label class="field">${t("Pour quel build ?")}<select name="style"><option value="">${t("Tous")}</option>${D.styles.map((s) => `<option value="${s.id}">${esc(s.nom)}</option>`).join("")}</select></label>
        <label class="field">${t("Rareté")}<select name="rar"><option value="">${t("Toutes")}</option><option value="1">${t("Commune")}</option><option value="2">${t("Peu commune")}</option><option value="3">${t("Rare")}</option><option value="4">${t("Épique")}</option><option value="5">${t("Légendaire")}</option></select></label>
        <label class="field">${t("Fiabilité")}<select name="st"><option value="">${t("Toutes")}</option>${ITEM_ST.map((s) => `<option value="${s}">${STATUS[s].label}</option>`).join("")}</select></label>
        <label class="field">${t("Sur la carte")}<select name="carte"><option value="">${t("Peu importe")}</option><option value="pin">${t("Emplacement précis")}</option><option value="zone">${t("Précis ou région")}</option></select></label>
        <label class="field">${t("Niveau min")}<input type="number" name="lvmin" min="0" max="55" value="${esc(eq.lvmin)}"></label>
        <label class="field">${t("Niveau max")}<input type="number" name="lvmax" min="0" max="55" value="${esc(eq.lvmax)}"></label>
        <label class="field">${t("Trier par")}<select name="sort"><option value="niveau-desc">${t("Niveau ↓")}</option><option value="niveau-asc">${t("Niveau ↑")}</option><option value="armure-desc">${t("Armure totale")}</option><option value="degats-desc">${t("Dégâts")}</option><option value="parade-desc">${t("Parade")}</option><option value="blocage-desc">${t("Blocage")}</option><option value="rarete-desc">${t("Rareté")}</option><option value="nom-asc">${t("Nom")}</option></select></label>
        <div class="field wide" style="flex-direction:row;justify-content:flex-end"><button class="btn small" id="eq-reset">${icon("refresh")}${t("Tout réinitialiser")}</button></div>
      </div>
      <div class="result-line"><span id="eq-count"></span></div>
      <div id="eq-list" class="igrid"></div>
      <div id="eq-more" style="text-align:center;margin-top:14px"></div>
      <details class="more"><summary>${icon("info")}${t("Ce qui manque encore")}</summary><div><ul class="tight">${D.lacunes.map((l) => `<li>${txt(l)}</li>`).join("")}</ul></div></details>`;
    const panel = $("#eq-panel");
    ["style", "rar", "st", "sort", "carte"].forEach((n) => { panel.querySelector(`[name="${n}"]`).value = eq[n]; });
    const save = () => store.set("ens.eq3", eq);
    panel.addEventListener("input", () => { $$("[name]", panel).forEach((el) => { eq[el.name] = el.value; }); save(); eqLimit = 60; renderEqList(); });
    $("#eq-q").addEventListener("input", (e) => { eq.q = e.target.value; save(); eqLimit = 60; renderEqList(); });
    $("#eq-toggle").addEventListener("click", () => { filtersOpen = !filtersOpen; panel.hidden = !filtersOpen; $("#eq-toggle").setAttribute("aria-expanded", filtersOpen); });
    $("#eq-reset").addEventListener("click", () => { Object.assign(eq, DEFAULT_EQ); save(); viewEquipements(); });
    renderEqList();
  }
  function filterItems(s) {
    const q = norm(s.q).trim();
    const out = D.items.filter((it) => {
      if (s.cat && it.categorie !== s.cat) return false;
      if (s.cat === "arme" && s.sub && itemIcon(it) !== s.sub) return false;
      if (s.cat === "armure" && s.sub && it.emplacement !== s.sub) return false;
      if (s.style && !(it.styles || []).includes(s.style)) return false;
      if (s.rar && rarRank(it.rarete) !== Number(s.rar)) return false;
      if (s.st && it.statut !== s.st) return false;
      if (s.carte === "pin" && !hasMapPin(it)) return false;
      if (s.carte === "zone" && !mapLink(it)) return false;
      const lr = levelRange(lvOf(it));
      if ((s.lvmin !== "" || s.lvmax !== "") && !lr) return false;
      if (s.lvmin !== "" && lr[1] < Number(s.lvmin)) return false;
      if (s.lvmax !== "" && lr[0] > Number(s.lvmax)) return false;
      if (q) { const hay = norm([it.nom, nm(it.nom), it.type, tr(it.type), it.obtention, tr(it.obtention), it.obtentionEn, it.description, ...(it.atouts || []), ...(it.atouts || []).map(tr), ...(it.effets || []), ...(it.effets || []).map(tr)].join(" ")); if (!q.split(/\s+/).every((w) => hay.includes(w))) return false; }
      return true;
    });
    const [key, dir] = s.sort.split("-");
    const val = (it) => key === "niveau" ? (levelRange(lvOf(it))?.[1] ?? -1) : key === "rarete" ? rarRank(it.rarete) : key === "nom" ? nm(it.nom)
      : key === "armure" ? ((it.stats?.armurePhys || 0) + (it.stats?.armureMag || 0)) || -1 : (typeof it.stats?.[key] === "number" ? it.stats[key] : -1);
    return out.sort((a, b) => { const va = val(a), vb = val(b); const r = typeof va === "string" ? va.localeCompare(vb) : va - vb; return (dir === "desc" ? -r : r) || nm(a.nom).localeCompare(nm(b.nom)); });
  }
  const itemTile = (it) => `<article class="itile r-${rarKey(it.rarete)}">
      <button class="itile-main" data-item="${esc(it.id)}">${art(it, "lg")}<span class="iname">${nmh(it.nom)}</span>
        <span class="isub">${[esc(lvTxt(it)), it.rarete ? `<span class="rar-txt">${esc(tr(it.rarete))}</span>` : esc(tr(it.type || ""))].filter(Boolean).join(" · ")}</span>${keyStat(it)}</button>
      ${sdot(it.statut)}
      ${hasMapPin(it) ? `<a class="pin-btn" href="#carte/item/${encodeURIComponent(it.id)}" title="${t("Voir sur la carte")}" aria-label="${esc(t("Voir {0} sur la carte", nm(it.nom)))}">${icon("pin")}</a>` : ""}
      <button class="cmp-btn" data-cmp="${esc(it.id)}" aria-pressed="${compare.includes(it.id)}" title="${t("Comparer")}" aria-label="${esc(t("Comparer {0}", nm(it.nom)))}">${icon("compare")}</button>
    </article>`;
  function renderEqList() {
    const list = filterItems(eq);
    $("#eq-count").textContent = tp(list.length, "{0} objet", "{0} objets");
    $("#eq-list").innerHTML = list.slice(0, eqLimit).map(itemTile).join("") || `<div class="empty" style="grid-column:1/-1">${icon("search")}<p>${t("Aucun objet ne correspond.")}</p><button class="btn small" id="eq-reset2">${t("Réinitialiser")}</button></div>`;
    $("#eq-more").innerHTML = list.length > eqLimit ? `<button class="btn" id="eq-more-btn">${t("Afficher plus ({0} restants)", list.length - eqLimit)}</button>` : "";
    $("#eq-more-btn")?.addEventListener("click", () => { eqLimit += 60; renderEqList(); });
    $("#eq-reset2")?.addEventListener("click", () => { Object.assign(eq, DEFAULT_EQ); store.set("ens.eq3", eq); viewEquipements(); });
  }

  // ════════════ CARTE ════════════
  // Carte dynamique : un seul modèle de points (lieux du wiki, objets, blocs, survivants, emplacements de base,
  // ajouts des administrateurs), avec fiche, filtres, recherche, légende et administration via GitHub (admin.js).
  const MC = D.mapConfig || { categories: {}, groupesWiki: {}, precisions: {}, raretes: [], statuts: {}, categoriesAjout: [] };
  const ADMIN = window.ENS_ADMIN;
  const CONS = D.construction || { blocs: [], survivants: [], emplacements: [] };
  let leaflet = null;
  const mp = { q: "", rar: "", cats: new Set(store.get("ens.mapCats2", Object.keys(MC.categories).filter((c) => c !== "collection"))), adminView: false };
  let adminPoints = [], adminLoad = { etat: "attente", erreur: "", ignores: 0 };
  const CAT_OF_ITEM = (it) => it.categorie === "arme" ? "arme" : it.categorie === "armure" || it.categorie === "set" ? "armure" : "equipement";

  // Points de référence (lecture seule) : construits une fois à partir des données du site.
  let REF = null;
  function refPoints() {
    if (REF) return REF;
    const out = [];
    // Textes affichés déjà traduits (sous-titre, description, lieu) ; le nom reste celui du jeu (nm/nmh à l'affichage).
    const wikiSrc = { nom: t("Carte du wiki (enshrouded.wiki.gg)"), url: MAP.source };
    for (const m of MAP.marqueurs) {
      const cat = MC.groupesWiki[m.g];
      if (!cat) continue;
      const g = MAP.groupes[m.g] || {};
      out.push({ id: "w-" + m.id, nom: m.nom, categorie: cat, sous: nm(g.nom), description: tr(m.desc || ""), x: m.x, y: m.y, precision: "exacte",
        source: wikiSrc, verifie: MAP.marqueursDate, releve: "2026-10-20", origine: "wiki", icone: g.icone });
    }
    for (const it of D.items) for (const mid of (it.marqueurs || []).filter((id) => MARKERS[id])) {
      const m = MARKERS[mid];
      out.push({ id: `o-${it.id}-${mid}`, nom: it.nom, categorie: CAT_OF_ITEM(it), sous: tr(it.type), description: tr(it.obtention || it.obtentionEn || ""), rarete: it.rarete,
        x: m.x, y: m.y, lieu: nm(m.nom), precision: "lieu", source: { nom: it.wiki ? t("Page de l'objet (wiki)") : t("Sources de l'objet"), url: it.wiki || "" }, verifie: it.verifie, origine: "objet", itemId: it.id });
    }
    CONS.blocs.forEach((b, i) => (b.marqueurs || []).filter((id) => MARKERS[id]).forEach((mid) => { const m = MARKERS[mid];
      out.push({ id: `b-${i}-${mid}`, nom: b.nom, categorie: "bloc", sous: tr(b.cat), description: `${tr(b.recette)}. ${tr(b.lieu || "")}${b.conflit ? " — " + tr(b.conflit) : ""}`, x: m.x, y: m.y, lieu: nm(m.nom),
        precision: "lieu", source: { nom: "Wiki — Building Materials", url: SOURCES["wiki-building"]?.url || "" }, verifie: "2026-10-21", origine: "bloc", bloc: b }); }));
    CONS.survivants.forEach((s, i) => (s.marqueurs || []).filter((id) => MARKERS[id]).forEach((mid) => { const m = MARKERS[mid];
      out.push({ id: `s-${i}-${mid}`, nom: s.nom, nomSuffixe: ` (${tr(s.role)})`, categorie: "survivant", sous: t("Artisan à sauver"), description: tr(s.debloque), x: m.x, y: m.y, lieu: nm(m.nom),
        precision: "lieu", source: { nom: "Wiki — Survivors", url: SOURCES["wiki-survivors"]?.url || "" }, verifie: "2026-10-21", origine: "survivant" }); }));
    CONS.emplacements.forEach((s, i) => (s.marqueurs || []).filter((id) => MARKERS[id]).forEach((mid) => { const m = MARKERS[mid];
      out.push({ id: `c-${i}-${mid}`, nom: s.nom, categorie: "construction", sous: t("Emplacement de base · {0}", tr(s.etape)), description: tr(s.pourquoi), x: m.x, y: m.y, lieu: nm(m.nom),
        precision: "approximative", source: { nom: SOURCES[s.sources?.[0]]?.nom || "Guide", url: SOURCES[s.sources?.[0]]?.url || "" }, verifie: "2026-10-21", origine: "base" }); }));
    return (REF = out);
  }
  // Nom d'un point dans la langue du site (texte / HTML avec info-bulle) ; les ajouts des administrateurs restent tels quels.
  const ptNom = (p) => p.origine === "admin" ? p.nom : nm(p.nom) + (p.nomSuffixe || "");
  const ptNomH = (p) => p.origine === "admin" ? esc(p.nom) : nmh(p.nom) + esc(p.nomSuffixe || "");
  const adminAsPoints = () => adminPoints.map((p) => ({ ...p, x: p.position.x, y: p.position.y, origine: "admin", verifie: (p.modifie || p.cree).slice(0, 10) }));
  const allPoints = () => [...refPoints(), ...adminAsPoints()];
  const visible = (p) => p.origine !== "admin" || p.statut === "valide" || (mp.adminView && ADMIN?.session);
  function filtered() {
    const q = norm(mp.q).trim();
    return allPoints().filter((p) => visible(p) && mp.cats.has(p.categorie)
      && (!mp.rar || (mp.rar === "aucune" ? !p.rarete : p.rarete === mp.rar))
      && (!q || q.split(/\s+/).every((w) => norm([p.nom, ptNom(p), p.sous, p.description, p.lieu, p.zone, MC.categories[p.categorie]?.nom].join(" ")).includes(w))));
  }

  // ── Fiche d'un point
  function pointCard(p) {
    const c = MC.categories[p.categorie] || MC.categories.autre, pr = MC.precisions[p.precision];
    const it = p.itemId && getItem(p.itemId);
    const isAdm = p.origine === "admin", canEdit = isAdm && ADMIN?.session;
    const visuel = it ? art(it, "sm") : p.bloc ? blocArt(p.bloc, "sm") : `<span class="mp-ic" style="--pc:${c.couleur}">${icon(c.icone)}</span>`;
    return `<div class="mp-card">
      <div class="mp-head">${visuel}<div><b>${ptNomH(p)}</b><div class="mp-tags"><span class="mp-cat" style="--pc:${c.couleur}">${icon(c.icone)}${esc(c.nom)}</span>${p.sous ? `<span class="muted small">${esc(p.sous)}</span>` : ""}</div></div></div>
      ${p.description ? `<p class="mp-desc">${p.origine === "admin" ? esc(p.description) : I18N.nomsDansTexte(esc(p.description))}</p>` : ""}
      <dl class="mp-dl">
        ${p.rarete ? `<dt>${t("Rareté")}</dt><dd><span class="r-${rarKey(p.rarete)} rar-txt">${esc(tr(p.rarete))}</span></dd>` : ""}
        ${p.lieu ? `<dt>${t("Lieu")}</dt><dd>${esc(p.lieu)}</dd>` : ""}${p.zone ? `<dt>${t("Zone")}</dt><dd>${esc(nm(p.zone))}</dd>` : ""}
        <dt>${t("Position")}</dt><dd><span class="mp-prec prec-${esc(p.precision)}" title="${esc(pr?.desc || "")}">${esc(pr?.nom || p.precision)}</span></dd>
        <dt>${t("Source")}</dt><dd>${p.source?.url ? `<a href="${esc(p.source.url)}" target="_blank" rel="noopener">${esc(p.source.nom || p.source.texte || t("Lien"))}</a>` : esc(p.source?.nom || p.source?.texte || t("Non renseignée"))}${isAdm && p.source?.texte && p.source?.url ? `<br><span class="small">${esc(p.source.texte)}</span>` : ""}</dd>
        <dt>${t("Vérifié le")}</dt><dd>${fmtDate(p.verifie)}${p.origine === "wiki" ? ` <span class="small muted">(${t("carte du wiki, relevée le {0}", fmtDate(p.releve, true))})</span>` : ""}</dd>
        ${isAdm ? `<dt>${t("Ajouté par")}</dt><dd>${t("{0}, le {1}", esc(p.auteur), fmtDate(p.cree.slice(0, 10)))}</dd>${p.modifie ? `<dt>${t("Modifié")}</dt><dd>${t("{0} le {1}", esc(p.modifiePar || ""), fmtDate(p.modifie.slice(0, 10)))}</dd>` : ""}<dt>${t("Statut")}</dt><dd><span class="mp-st st-${esc(p.statut)}">${esc(MC.statuts[p.statut]?.nom || p.statut)}</span></dd>` : `<dt>${t("Fiabilité")}</dt><dd class="small">${p.origine === "wiki" ? t("Marqueur de la carte du wiki") : p.origine === "objet" ? t("Lieu cité par la page de l'objet") : p.origine === "base" ? t("Conseil de guide") : t("Lieu cité par la source")}</dd>`}
      </dl>
      <div class="btn-row">
        ${it ? `<button class="btn small" data-item="${esc(it.id)}">${t("Fiche de l'objet")}</button>` : ""}
        ${canEdit ? `<button class="btn small" data-mpedit="${esc(p.id)}">${icon("edit")}${t("Modifier")}</button>
          ${p.statut !== "valide" ? `<button class="btn small" data-mpstatus="${esc(p.id)}:valide">${icon("check")}${t("Valider")}</button>` : ""}
          ${p.statut !== "masque" ? `<button class="btn small" data-mpstatus="${esc(p.id)}:masque">${t("Masquer")}</button>` : ""}
          <button class="btn small danger" data-mpdel="${esc(p.id)}">${icon("trash")}${t("Supprimer")}</button>` : ""}
      </div>
    </div>`;
  }

  function viewCarte(focus) {
    const cats = Object.entries(MC.categories);
    const sess = ADMIN?.session;
    app.innerHTML = `
      <h1>${t("Carte")}</h1>
      <div class="fresh" style="margin:6px 0 10px">${icon("info")}<span>${t("Fond : {0}, captures en jeu assemblées le 21/10/2026 (sélecteur en haut à droite pour l'ancienne carte du wiki, plus détaillée mais d'avant la 1.0). Positions des lieux : carte du wiki ; fiabilité : voir la légende.", `<b>${t("carte du jeu 1.0")}</b>`)}</span></div>
      <div class="map-layout">
        <div class="map-wrap"><div id="leaflet" class="leaflet-box"></div><div id="mp-pickbar" class="mp-pickbar" hidden>${icon("pin")} ${t("Cliquez sur la carte pour placer le point")} <button class="btn small" data-mppickcancel>${t("Annuler")}</button></div></div>
        <aside class="map-side">
          <div class="mp-admin">
            <button class="btn primary" data-mpadd>${icon("pin")}${t("Ajouter un élément")}</button>
            ${sess ? `<div class="small mp-who">${icon("user")}${t("Administrateur :")} <b>${esc(sess.login)}</b> · <button class="linkbtn" data-mplogout>${t("Se déconnecter")}</button></div>
              <label class="layer small"><input type="checkbox" id="mp-adminview" ${mp.adminView ? "checked" : ""}> ${t("Voir aussi les ajouts en attente et masqués")}</label>` : `<div class="small muted">${t("Réservé aux administrateurs (droit d'écriture sur le dépôt GitHub).")}</div>`}
          </div>
          <div class="searchbox">${icon("search")}<input id="map-q" type="search" value="${esc(mp.q)}" placeholder="${t("Chercher un lieu, un objet, un bloc…")}" aria-label="${t("Chercher sur la carte")}"></div>
          <div class="mp-cats" role="group" aria-label="${t("Catégories")}">
            ${cats.map(([k, c]) => `<button class="mp-chip" data-mpcat="${k}" aria-pressed="${mp.cats.has(k)}" style="--pc:${c.couleur}">${icon(c.icone)}${esc(c.nom)} <span class="mp-n" data-mpn="${k}"></span></button>`).join("")}
            <button class="linkbtn small" data-mpall="1">${t("Tout")}</button> · <button class="linkbtn small" data-mpall="0">${t("Rien")}</button>
          </div>
          <label class="field" style="margin-top:8px">${t("Rareté")}<select id="mp-rar"><option value="">${t("Toutes")}</option>${MC.raretes.map((r) => `<option value="${esc(r)}" ${mp.rar === r ? "selected" : ""}>${esc(tr(r))}</option>`).join("")}<option value="aucune" ${mp.rar === "aucune" ? "selected" : ""}>${t("Sans rareté")}</option></select></label>
          <div class="result-line"><span id="mp-count"></span><span id="mp-load" class="small muted"></span></div>
          <div id="mp-list" class="map-list"></div>
          <details class="more"><summary>${icon("info")}${t("Légende")}</summary><div>
            <div class="mp-legend">${cats.map(([, c]) => `<span><span class="mp-ic sm" style="--pc:${c.couleur}">${icon(c.icone)}</span>${esc(c.nom)}</span>`).join("")}</div>
            <h3>${t("Symboles des lieux (carte du jeu)")}</h3><div class="mp-legend">${Object.values(MAP.groupes || {}).filter((g) => g.icone).map((g) => `<span><img class="mp-leg-img" src="${esc(g.icone)}" alt="" onerror="this.remove()">${nmh(g.nom)}</span>`).join("")}</div>
            <h3>${t("Fiabilité de la position")}</h3><ul class="tight small">${Object.entries(MC.precisions).map(([k, v]) => `<li><span class="mp-prec prec-${k}">${esc(v.nom)}</span> ${esc(v.desc)}</li>`).join("")}</ul>
            <h3>${t("Ajouts des administrateurs")}</h3><ul class="tight small">${Object.entries(MC.statuts).map(([k, v]) => `<li><span class="mp-st st-${k}">${esc(v.nom)}</span> ${esc(v.desc)}</li>`).join("")}</ul>
          </div></details>
          <details class="more"><summary>${icon("external")}${t("Sources et autres cartes")}</summary><div class="small">
            ${Object.values(MC.fonds).map((f) => `<p><b>${esc(f.nom)}</b> : ${esc(f.desc)}</p>`).join("")}
            <p>${t("Lieux : {0} (marqueurs mis à jour le {1}, relevés le 20/10/2026, rendu © Keen Games). Objets, blocs et survivants : pages du wiki et guides cités dans chaque fiche.", `<a href="${esc(MAP.source)}" target="_blank" rel="noopener">${t("carte du wiki")}</a>`, fmtDate(MAP.marqueursDate))}</p>
            <p>${t("Cartes 1.0 complètes (non réutilisables ici, liens seulement) :")} <a href="https://enshrouded.th.gl/" target="_blank" rel="noopener">The Hidden Gaming Lair</a>, <a href="https://mapgenie.io/enshrouded/maps/embervale" target="_blank" rel="noopener">Map Genie</a>, <a href="https://allthings.how/enshrouded/map/" target="_blank" rel="noopener">AllThings.How</a>.</p>
            ${I18N.lang === "fr" ? `<p>${t("Noms des lieux : wiki français officiel quand il existe, sinon traduction du site (non officielle, nom anglais en info-bulle).")}</p>` : ""}
          </div></details>
        </aside>
      </div>`;
    $("#map-q").addEventListener("input", (e) => { mp.q = e.target.value; renderPoints(); });
    $("#mp-rar").addEventListener("change", (e) => { mp.rar = e.target.value; renderPoints(); });
    $("#mp-adminview")?.addEventListener("change", (e) => { mp.adminView = e.target.checked; renderPoints(); });
    initLeaflet(focus);
    loadAdminPoints();
  }

  async function loadAdminPoints(force) {
    if (adminLoad.etat === "ok" && !force) { renderPoints(); return; }
    adminLoad = { etat: "chargement", erreur: "", ignores: 0 };
    renderLoad();
    try {
      const data = ADMIN?.session ? (await ADMIN.loadRemote()).data : await ADMIN.loadPublic();
      const pts = Array.isArray(data?.points) ? data.points : [];
      adminPoints = pts.filter((p) => !D.validateMapPoint(p).length);
      adminLoad = { etat: "ok", erreur: "", ignores: pts.length - adminPoints.length };
    } catch (e) {
      adminPoints = [];
      adminLoad = { etat: "erreur", erreur: location.protocol === "file:" ? t("ouvrez le site par un serveur (node scripts/serve.mjs) pour voir les ajouts") : e.message, ignores: 0 };
    }
    renderPoints();
  }
  function renderLoad() {
    const el = $("#mp-load"); if (!el) return;
    el.textContent = adminLoad.etat === "chargement" ? " · " + t("chargement des ajouts…") : adminLoad.etat === "erreur" ? " · " + t("ajouts indisponibles : {0}", adminLoad.erreur) : adminLoad.ignores ? " · " + t("{0} ajout(s) mal formé(s) ignoré(s)", adminLoad.ignores) : "";
  }

  function initLeaflet(focus) {
    const box = $("#leaflet");
    if (!window.L) { box.innerHTML = `<div class="empty">${icon("alert")}<p>${t("La bibliothèque de carte (Leaflet) n'a pas pu être chargée : une connexion Internet est nécessaire.")}</p></div>`; leaflet = null; return; }
    const L = window.L, S = MAP.taille, T = MAP.tuile;
    const map = L.map(box, { crs: L.CRS.Simple, minZoom: -4, maxZoom: 1, zoomSnap: 0.5, attributionControl: true, maxBounds: [[-1500, -1500], [S + 1500, S + 1500]] });
    map.attributionControl.setPrefix(false);
    // Fonds : carte du jeu 1.0 (captures assemblées) ou carte du wiki (avant 1.0) ; choix mémorisé dans le navigateur.
    const fonds = {};
    for (const [k, f] of Object.entries(MC.fonds)) {
      const tiles = f.grille ? Array.from({ length: f.grille * f.grille }, (_, i) => { const c = i % f.grille, r = Math.floor(i / f.grille); return { f: `${c}_${r}`, x: c, y: f.grille - 1 - r }; }) : MAP.tuiles;
      // bord : marge (en unités de la carte) incluse dans chaque tuile et recouvrant les voisines, pour éviter les lignes entre tuiles
      const t = S / (f.grille || S / T), b = f.bord || 2;
      fonds[k] = L.layerGroup(tiles.map((p) => L.imageOverlay(`${f.dossier}/${p.f}.${f.ext}`, [[p.y * t - b, p.x * t - b], [(p.y + 1) * t + b, (p.x + 1) * t + b]], { attribution: f.credit })));
    }
    let fond = MC.fondDefaut; try { const s = localStorage.getItem("ens.mapFond"); if (fonds[s]) fond = s; } catch { /* stockage indisponible */ }
    fonds[fond].addTo(map);
    L.control.layers(Object.fromEntries(Object.entries(fonds).map(([k, l]) => [MC.fonds[k].nom, l])), null, { position: "topright" }).addTo(map);
    map.on("baselayerchange", (e) => { const k = Object.keys(fonds).find((x) => fonds[x] === e.layer); try { localStorage.setItem("ens.mapFond", k); } catch { /* rien */ } });
    map.fitBounds([[0, 0], [S, S]]);
    L.control.scale({ imperial: false, metric: false }).addTo(map);
    // Regroupement des marqueurs proches (lisibilité) ; repli sur une couche simple si le module n'est pas chargé.
    // De près, seuls les points au même endroit (objets d'un lieu) restent groupés : le groupe affiche le symbole du lieu
    // et le nombre de points en plus ; un clic les écarte.
    const PROCHE = -3;
    const layer = (L.markerClusterGroup ? L.markerClusterGroup({ maxClusterRadius: (z) => z >= PROCHE ? 6 : 36, showCoverageOnHover: false, spiderfyOnMaxZoom: true,
      iconCreateFunction: (cl) => {
        const n = cl.getChildCount();
        const lieu = (cl._zoom ?? map.getZoom()) >= PROCHE && cl.getAllChildMarkers().map((m) => m.options.pt).find((p) => p?.origine === "wiki" && p.icone);
        if (lieu) return L.divIcon({ className: "mp-marker", html: `<span class="mp-sym grp"><img src="${esc(lieu.icone)}" alt=""><b>+${n - 1}</b></span>`, iconSize: [34, 34], iconAnchor: [17, 17] });
        return L.divIcon({ className: "mp-cluster", html: `<span>${n}</span>`, iconSize: n > 99 ? [44, 44] : [36, 36] });
      } }) : L.layerGroup()).addTo(map);
    const markers = new Map();
    let pickMarker = null, regionCircle = null, onPick = null;
    const pinHtml = (p) => {
      const c = MC.categories[p.categorie] || MC.categories.autre;
      const it = p.itemId && getItem(p.itemId);
      if (it) return { html: art(it, "pin"), size: 40 };
      if (p.bloc && BIMG[p.bloc.nom]) return { html: blocArt(p.bloc, "pin"), size: 40 };
      // Symbole du jeu (icône de la carte du wiki) affiché tel quel ; pastille de catégorie si l'icône manque ou ne charge pas.
      if (p.icone && p.origine !== "admin") return { html: `<span class="mp-sym" style="--pc:${c.couleur}"><img src="${esc(p.icone)}" alt="" onerror="this.parentNode.classList.add('ko');this.remove()">${icon(c.icone)}</span>`, size: 34 };
      return { html: `<span class="mp-pin ${p.origine === "admin" ? "adm st-" + esc(p.statut) : ""}" style="--pc:${c.couleur}">${icon(c.icone)}</span>`, size: 28 };
    };
    function draw(list) {
      layer.clearLayers(); markers.clear();
      for (const p of list) {
        const { html, size } = pinHtml(p);
        const mk = L.marker([p.y, p.x], { icon: L.divIcon({ className: "mp-marker", html, iconSize: [size, size], iconAnchor: [size / 2, size / 2] }), pt: p, title: ptNom(p), zIndexOffset: p.origine === "admin" ? 800 : p.origine === "wiki" ? 0 : 400 })
          .bindPopup(() => pointCard(p), { maxWidth: 320, minWidth: 240 });
        mk.addTo(layer);
        markers.set(p.id, mk);
      }
    }
    map.on("click", (e) => {
      if (!onPick) return;
      const x = Math.round(Math.min(S, Math.max(0, e.latlng.lng))), y = Math.round(Math.min(S, Math.max(0, e.latlng.lat)));
      if (pickMarker) pickMarker.remove();
      pickMarker = L.marker([y, x], { icon: L.divIcon({ className: "mp-marker", html: `<span class="mp-pin pick">${icon("pin")}</span>`, iconSize: [30, 30], iconAnchor: [15, 15] }) }).addTo(map);
      const cb = onPick; onPick = null; $("#mp-pickbar").hidden = true; box.classList.remove("picking");
      cb({ x, y });
    });
    leaflet = {
      map, draw,
      focusPoint(id) { const mk = markers.get(id); if (!mk) return false; map.flyTo(mk.getLatLng(), 0, { duration: .6 }); setTimeout(() => (layer.zoomToShowLayer ? layer.zoomToShowLayer(mk, () => mk.openPopup()) : mk.openPopup()), 700); return true; },
      focusRegion(name) {
        const r = REGIONS.find((x) => x.nom === name); if (!r) return;
        if (regionCircle) regionCircle.remove();
        regionCircle = L.circle([r.y, r.x], { radius: 1100, color: "#f2913d", weight: 2, fillOpacity: .08, dashArray: "6 6" }).addTo(map).bindTooltip(esc(t("{0} — zone approximative", nm(r.nom))), { permanent: true, direction: "top" });
        map.flyTo([r.y, r.x], -2, { duration: .6 });
      },
      pick(cb) { onPick = cb; $("#mp-pickbar").hidden = false; box.classList.add("picking"); },
      cancelPick() { onPick = null; $("#mp-pickbar").hidden = true; box.classList.remove("picking"); },
      clearPick() { if (pickMarker) { pickMarker.remove(); pickMarker = null; } }
    };
    renderPoints();
    setTimeout(() => {
      map.invalidateSize();
      if (!focus) return;
      const ensure = (cat) => { if (!mp.cats.has(cat)) { mp.cats.add(cat); renderPoints(); } };
      if (focus.item) {
        const it = getItem(focus.item);
        const p = it && refPoints().find((x) => x.itemId === it.id);
        if (p) { ensure(p.categorie); leaflet.focusPoint(p.id); }
        else if (it && regionOf(it)) { leaflet.focusRegion(regionOf(it).nom); toast(t("{0} : seule la région est connue ({1}).", nm(it.nom), nm(regionOf(it).nom))); }
      } else if (focus.cons) {
        const [kind, i] = focus.cons.split("-"), pre = { bloc: "b", artisan: "s", base: "c" }[kind];
        const p = refPoints().find((x) => x.id.startsWith(`${pre}-${i}-`));
        if (p) { ensure(p.categorie); leaflet.focusPoint(p.id); }
      } else if (focus.region) leaflet.focusRegion(focus.region);
      else if (focus.point) { const p = allPoints().find((x) => x.id === focus.point); if (p) { ensure(p.categorie); leaflet.focusPoint(p.id); } }
    }, 80);
  }

  function renderPoints() {
    if (!$("#mp-list")) return;
    const list = filtered();
    const counts = {};
    allPoints().filter(visible).forEach((p) => { counts[p.categorie] = (counts[p.categorie] || 0) + 1; });
    $$("[data-mpn]").forEach((el) => { el.textContent = counts[el.dataset.mpn] || 0; });
    $$("[data-mpcat]").forEach((b) => b.setAttribute("aria-pressed", mp.cats.has(b.dataset.mpcat)));
    $("#mp-count").textContent = tp(list.length, "{0} point", "{0} points");
    renderLoad();
    const shown = list.slice(0, 150);
    $("#mp-list").innerHTML = shown.map((p) => { const c = MC.categories[p.categorie] || MC.categories.autre;
      return `<button class="map-row" data-mpfocus="${esc(p.id)}"><span class="mp-ic sm" style="--pc:${c.couleur}">${icon(c.icone)}</span><span><b>${ptNomH(p)}</b><small>${esc([p.sous || c.nom, p.lieu, p.origine === "admin" && p.statut !== "valide" ? MC.statuts[p.statut]?.nom : ""].filter(Boolean).join(" · "))}</small></span></button>`; }).join("")
      + (list.length > shown.length ? `<p class="small muted">${t("… et {0} autres : affinez la recherche.", list.length - shown.length)}</p>` : "")
      || `<div class="empty">${icon("search")}<p>${t("Aucun point ne correspond.")}${mp.cats.size ? "" : " " + t("Toutes les catégories sont décochées.")}</p></div>`;
    if (leaflet) leaflet.draw(list);
  }

  // ── Administration
  function loginDialog(next) {
    const R = ADMIN.repo;
    openDialog(`<div class="dhead"><span class="emblem c-base">${icon("user")}</span><div><h2>${t("Connexion administrateur")}</h2><p>${t("Réservé aux comptes GitHub ayant le droit d'écriture sur {0}.", `<b>${esc(R.depot)}</b>`)}</p></div></div>
      <ol class="tight small">
        <li>${t("Créez un {0} : dépôt {1} uniquement, permission {2}, durée courte.", `<a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">${t("jeton GitHub « fine-grained »")}</a>`, `<b>${esc(R.depot)}</b>`, "<b>Contents : Read and write</b>")}</li>
        <li>${t("Collez-le ci-dessous. Il reste dans votre navigateur et n'est envoyé qu'à GitHub.")}</li>
      </ol>
      <form id="mp-login" class="mp-form" novalidate>
        <label class="field">${t("Jeton GitHub")}<input type="password" name="token" autocomplete="off" spellcheck="false" required></label>
        <label class="layer small"><input type="checkbox" name="remember"> ${t("Rester connecté sur cet appareil")}</label>
        <p class="mp-err" id="mp-login-err" role="alert"></p>
        <div class="btn-row"><button class="btn primary" type="submit">${t("Se connecter")}</button><button class="btn" type="button" data-close>${t("Annuler")}</button></div>
      </form>
      <p class="small muted">${t("GitHub vérifie le droit d'écriture à chaque enregistrement : masquer ce bouton ne suffirait pas à donner l'accès.")}</p>`);
    $("#mp-login").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = new FormData(e.target), btn = e.target.querySelector("[type=submit]");
      btn.disabled = true; $("#mp-login-err").textContent = t("Vérification auprès de GitHub…");
      try { await ADMIN.connect(f.get("token"), !!f.get("remember")); toast(t("Connecté : {0}", ADMIN.session.login)); adminLoad.etat = "attente"; viewCarte(); if (next) next(); }
      catch (err) { $("#mp-login-err").textContent = err.message; btn.disabled = false; }
    });
  }
  const ZONES_FORM = () => [...REGIONS.map((r) => r.nom), "Cinder's Cradle"];
  function pointForm(existing, preset) {
    const p = existing || { nom: "", description: "", categorie: "", rarete: "", precision: "exacte", zone: "", source: {}, statut: "en_attente", ...(preset || {}) };
    const pos = existing ? existing.position : preset?.position || null;
    openDialog(`<div class="dhead"><span class="emblem c-base">${icon(existing ? "edit" : "pin")}</span><div><h2>${existing ? t("Modifier l'élément") : t("Ajouter un élément")}</h2><p>${t("Enregistré dans {0} par un commit GitHub.", `<code>${esc(ADMIN.repo.fichier)}</code>`)}</p></div></div>
      <form id="mp-form" class="mp-form" novalidate>
        <label class="field">${t("Nom")} *<input name="nom" maxlength="80" required value="${esc(p.nom)}"></label>
        <label class="field">${t("Description")}<textarea name="description" rows="3" maxlength="1000">${esc(p.description || "")}</textarea></label>
        <div class="mp-row">
          <label class="field">${t("Catégorie")} *<select name="categorie" required><option value="">—</option>${MC.categoriesAjout.map((k) => `<option value="${k}" ${p.categorie === k ? "selected" : ""}>${esc(MC.categories[k].nom)}</option>`).join("")}</select></label>
          <label class="field">${t("Rareté")}<select name="rarete"><option value="">${t("Non applicable")}</option>${MC.raretes.map((r) => `<option value="${esc(r)}" ${p.rarete === r ? "selected" : ""}>${esc(tr(r))}</option>`).join("")}</select></label>
        </div>
        <fieldset class="mp-pos"><legend>${t("Emplacement")} *</legend>
          <div class="mp-row">
            <label class="field">X (0–${MC.taille})<input name="x" type="number" min="0" max="${MC.taille}" step="1" value="${pos ? pos.x : ""}"></label>
            <label class="field">Y (0–${MC.taille})<input name="y" type="number" min="0" max="${MC.taille}" step="1" value="${pos ? pos.y : ""}"></label>
          </div>
          <button class="btn small" type="button" data-mppick>${icon("pin")}${t("Choisir sur la carte")}</button>
          <div class="mp-row">
            <label class="field">${t("Précision")} *<select name="precision">${Object.entries(MC.precisions).map(([k, v]) => `<option value="${k}" ${p.precision === k ? "selected" : ""}>${esc(v.nom)}</option>`).join("")}</select></label>
            <label class="field">${t("Zone")}<input name="zone" list="mp-zones" maxlength="80" value="${esc(p.zone || "")}"><datalist id="mp-zones">${ZONES_FORM().map((z) => `<option value="${esc(z)}">`).join("")}</datalist></label>
          </div>
        </fieldset>
        <label class="field">${t("Source ou preuve")}<input name="source_texte" maxlength="300" placeholder="${t("ex. Relevé en jeu, capture du 21/10…")}" value="${esc(p.source?.texte || "")}"></label>
        <label class="field">${t("Lien de la source (https://…)")}<input name="source_url" type="url" maxlength="500" value="${esc(p.source?.url || "")}"></label>
        <label class="field">${t("Auteur")}<input value="${esc(existing ? existing.auteur : ADMIN.session.login)}" disabled></label>
        ${existing ? "" : `<label class="layer small"><input type="checkbox" name="valider"> ${t("Valider tout de suite (sinon : « En attente », visible des administrateurs seulement)")}</label>`}
        <p class="mp-err" id="mp-form-err" role="alert"></p>
        <div class="btn-row"><button class="btn primary" type="submit">${icon("save")}${t("Enregistrer")}</button><button class="btn" type="button" data-close>${t("Annuler")}</button></div>
      </form>`);
    const form = $("#mp-form");
    form.querySelector("[data-mppick]").addEventListener("click", () => {
      const keep = readForm(form);
      $("#dlg").close();
      leaflet?.pick((xy) => pointForm(existing ? { ...existing, ...keep.values, position: xy } : null, existing ? null : { ...keep.values, position: xy }));
    });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const { values } = readForm(form);
      const now = new Date().toISOString();
      const pt = existing
        ? { ...existing, ...values, modifie: now, modifiePar: ADMIN.session.login }
        : { id: ADMIN.newId(), ...values, auteur: ADMIN.session.login, cree: now, statut: form.valider?.checked ? "valide" : "en_attente", extra: {} };
      if (!pt.rarete) delete pt.rarete;
      if (!pt.zone) delete pt.zone;
      const errs = D.validateMapPoint(pt);
      if (errs.length) { $("#mp-form-err").textContent = t("À corriger : {0}.", errs.map((x) => t(x)).join(" ; ")); return; }
      const btn = form.querySelector("[type=submit]"); btn.disabled = true; $("#mp-form-err").textContent = t("Enregistrement sur GitHub…");
      try {
        const res = await ADMIN.save((data) => { const i = data.points.findIndex((x) => x.id === pt.id); if (i >= 0) data.points[i] = pt; else data.points.push(pt); }, `Carte : ${existing ? "modification" : "ajout"} « ${pt.nom} »`);
        adminPoints = res.data.points; $("#dlg").close(); leaflet?.clearPick();
        if (pt.statut !== "valide") mp.adminView = true;
        mp.cats.add(pt.categorie); viewCarte({ point: pt.id });
        toast(pt.statut === "valide" ? t("Enregistré (commit {0}). Visible pour tous après la mise à jour du site (1 à 2 min).", res.commit) : t("Enregistré (commit {0}). Visible pour tous après la mise à jour du site (1 à 2 min), une fois validé.", res.commit));
      } catch (err) { $("#mp-form-err").textContent = err.message; btn.disabled = false; }
    });
  }
  function readForm(form) {
    const f = new FormData(form);
    const num = (v) => (v === "" || v == null ? NaN : Number(v));
    const surl = String(f.get("source_url") || "").trim(), stxt = String(f.get("source_texte") || "").trim();
    return { values: {
      nom: String(f.get("nom") || "").trim(), description: String(f.get("description") || "").trim(), categorie: f.get("categorie") || "", rarete: f.get("rarete") || "",
      precision: f.get("precision") || "exacte", zone: String(f.get("zone") || "").trim(), position: { x: num(f.get("x")), y: num(f.get("y")) },
      source: (surl || stxt) ? { ...(stxt ? { texte: stxt } : {}), ...(surl ? { url: surl } : {}) } : undefined
    } };
  }
  async function setStatus(id, statut) {
    const p = adminPoints.find((x) => x.id === id); if (!p) return;
    try {
      const res = await ADMIN.save((data) => { const x = data.points.find((q) => q.id === id); if (!x) throw new Error(t("Élément introuvable (supprimé entre-temps ?).")); x.statut = statut; x.modifie = new Date().toISOString(); x.modifiePar = ADMIN.session.login; }, `Carte : « ${p.nom} » → ${{ valide: "validé", en_attente: "en attente", masque: "masqué" }[statut] || statut}`);
      adminPoints = res.data.points; renderPoints(); toast(t("« {0} » : {1} (commit {2}).", p.nom, MC.statuts[statut].nom, res.commit));
    } catch (e) { toast(e.message); }
  }
  function deleteDialog(id) {
    const p = adminPoints.find((x) => x.id === id); if (!p) return;
    openDialog(`<div class="dhead"><span class="emblem c-war">${icon("trash")}</span><div><h2>${t("Supprimer cet élément ?")}</h2><p>${t("« {0} », ajouté par {1} le {2}.", esc(p.nom), esc(p.auteur), fmtDate(p.cree.slice(0, 10)))}</p></div></div>
      <p>${t("La suppression est enregistrée par un commit : l'élément disparaît du site, mais reste récupérable dans l'historique du dépôt. Pour le cacher sans le supprimer, utilisez plutôt « Masquer ».")}</p>
      <p class="mp-err" id="mp-del-err" role="alert"></p>
      <div class="btn-row"><button class="btn danger" data-mpdelok="${esc(id)}">${icon("trash")}${t("Supprimer définitivement")}</button><button class="btn" data-close>${t("Annuler")}</button></div>`);
  }
  async function doDelete(id) {
    const p = adminPoints.find((x) => x.id === id); if (!p) return;
    $("#mp-del-err").textContent = t("Suppression sur GitHub…");
    try {
      const res = await ADMIN.save((data) => { data.points = data.points.filter((x) => x.id !== id); }, `Carte : suppression « ${p.nom} »`);
      adminPoints = res.data.points; $("#dlg").close(); renderPoints(); toast(t("Supprimé (commit {0}).", res.commit));
    } catch (e) { $("#mp-del-err").textContent = e.message; }
  }
  function handleMapClick(d) {
    if (d.mpcat) { mp.cats.has(d.mpcat) ? mp.cats.delete(d.mpcat) : mp.cats.add(d.mpcat); store.set("ens.mapCats2", [...mp.cats]); renderPoints(); return true; }
    if (d.mpall !== undefined) { mp.cats = new Set(d.mpall === "1" ? Object.keys(MC.categories) : []); store.set("ens.mapCats2", [...mp.cats]); renderPoints(); return true; }
    if (d.mpfocus) { leaflet?.focusPoint(d.mpfocus); if (innerWidth < 720) $("#leaflet")?.scrollIntoView({ behavior: "smooth", block: "center" }); return true; }
    if (d.mpadd !== undefined) { ADMIN?.session ? pointForm(null) : loginDialog(() => pointForm(null)); return true; }
    if (d.mplogout !== undefined) { ADMIN.logout(); mp.adminView = false; adminLoad.etat = "attente"; viewCarte(); toast(t("Déconnecté.")); return true; }
    if (d.mppickcancel !== undefined) { leaflet?.cancelPick(); return true; }
    if (d.mpedit) { const p = adminPoints.find((x) => x.id === d.mpedit); if (p) pointForm(p); return true; }
    if (d.mpstatus) { const [id, st] = d.mpstatus.split(":"); setStatus(id, st); return true; }
    if (d.mpdel) { deleteDialog(d.mpdel); return true; }
    if (d.mpdelok) { doDelete(d.mpdelok); return true; }
    return false;
  }
  // Reprise de session administrateur (jeton déjà enregistré dans ce navigateur)
  if (ADMIN?.hasToken) ADMIN.restore().then((s) => { if (s && location.hash.startsWith("#carte")) { adminLoad.etat = "attente"; viewCarte(); } });

  // ════════════ CONSTRUCTION ════════════
  const cons = { cat: "", mode: "", q: "" };
  const CTABS = [["batiments", "Bâtiments", "home"], ["blocs", "Blocs", "block"], ["emplacements", "Où bâtir", "compass"], ["autel", "Autel & confort", "flame"], ["artisans", "Artisans", "users"], ["videos", "Vidéos", "video"]].map(([k, l, ic]) => [k, t(l), ic]);
  const BCAT = { Bois: [t("Bois"), "c-rng"], Pierre: [t("Pierre"), "c-base"], Lumineux: [t("Lumineux"), "c-mag"], "Métal et autres": [t("Métal et autres"), "c-war"] };
  const BMODE = { ramassage: [t("Se débloque en ramassant le matériau"), "leaf"], fabrication: [t("Se débloque en fabriquant le matériau"), "hammer"], lieu: [t("À trouver dans le monde"), "pin"] };
  const pinnedBloc = (b) => (b.marqueurs || []).some((id) => MARKERS[id]);
  const BIMG = D.blocsImages || {};
  // Image du bloc : icône du wiki officiel, ou capture de l'établi (wiki Fandom) recadrée sur le rendu du bloc ; sinon icône dessinée.
  const blocArt = (b, cls = "") => {
    const im = BIMG[b.nom];
    const gen = `${icon("block")}<span class="bl-mono">${esc(initials(nm(b.nom)))}</span>`;
    if (!im) return `<span class="bl-ic ${cls}">${gen}</span>`;
    return im.type === "capture"
      ? `<span class="bl-ic has-img ${cls}" title="${t("Rendu du bloc (capture de l'établi, wiki Fandom)")}"><span class="bl-crop" style="background-image:url('${esc(im.fichier)}')"></span></span>`
      : `<span class="bl-ic has-img ${cls}"><img src="${esc(im.fichier)}" alt="" loading="lazy" onerror="this.parentNode.classList.remove('has-img');this.remove()">${gen}</span>`;
  };
  function viewConstruction(tab) {
    if (!CONS.blocs.length) { app.innerHTML = `<div class="empty">${icon("alert")}<p>${t("Données de construction absentes.")}</p></div>`; return; }
    tab = CTABS.some(([k]) => k === tab) ? tab : "batiments";
    const nLieu = CONS.blocs.filter((b) => b.mode === "lieu").length, nPin = CONS.blocs.filter(pinnedBloc).length;
    app.innerHTML = `
      <h1>${t("Construction")}</h1>
      <p class="lead">${t("Des idées de bâtiments pour votre base, tous les blocs et où les débloquer, et les règles de l'autel et du confort.")}</p>
      <div class="facts">
        <div class="fact"><b>${CONS.blocs.length}</b><span>${t("blocs de construction (wiki, 1.0)")}</span></div>
        <div class="fact"><b>${nLieu}</b><span>${t("à trouver dans le monde, dont {0} épinglés sur la carte", nPin)}</span></div>
        <div class="fact"><b>${CONS.batiments.length}</b><span>${t("idées de bâtiments pas à pas")}</span></div>
      </div>
      <div class="chips scroll" role="group" aria-label="${t("Rubrique")}" style="margin-top:14px">${CTABS.map(([k, l, ic]) => `<button class="chip" data-ctab="${k}" aria-pressed="${tab === k}">${icon(ic)}${l}</button>`).join("")}</div>
      <div id="cons-body"></div>`;
    const body = $("#cons-body");
    if (tab === "batiments") body.innerHTML = `
      <p class="small muted">${t("Conseils repris de guides et de vidéos 1.0 (sources sur chaque carte). Touchez « Voir les étapes ».")}</p>
      <div class="bgrid">${CONS.batiments.map((b) => `<article class="bld">
        <div class="bld-top"><span class="emblem c-base">${icon(b.icone)}</span><div><h3>${txt(b.nom)}</h3><div class="tags"><span class="tag hot">${esc(tr(b.etape))}</span>${b.taille ? `<span class="tag">${txt(b.taille)}</span>` : ""}</div></div></div>
        <p>${txt(b.resume)}</p>
        <details class="more"><summary>${icon("arrow")}${t("Voir les étapes")}</summary><div>
          <ol class="bld-steps">${b.etapes.map((s) => `<li>${txt(s)}</li>`).join("")}</ol>
          ${b.astuces.length ? `<h3>${t("Astuces")}</h3><ul class="tight">${b.astuces.map((s) => `<li>${txt(s)}</li>`).join("")}</ul>` : ""}
        </div></details>
        <div class="chips small-chips">${b.materiaux.map((m) => `<span class="perk">${txt(m)}</span>`).join("")}</div>
        <div class="bld-foot">${srcChips(b.sources)}${b.video && SOURCES[b.video] ? `<a class="btn small" href="${esc(SOURCES[b.video].url)}" target="_blank" rel="noopener">${icon("video")}${t("Vidéo")}</a>` : ""}</div>
      </article>`).join("")}</div>`;
    else if (tab === "blocs") { body.innerHTML = `
      <div class="chips scroll" style="margin-top:6px"><button class="chip" data-bcat="" aria-pressed="${!cons.cat}">${icon("grid")}${t("Tous")}</button>${Object.entries(BCAT).map(([k, [l, c]]) => `<button class="chip ${c}" data-bcat="${k}" aria-pressed="${cons.cat === k}">${icon("block")}${l}</button>`).join("")}</div>
      <div class="chips scroll" style="margin-top:8px"><button class="chip small" data-bmode="" aria-pressed="${!cons.mode}">${t("Tous les déblocages")}</button>${Object.entries(BMODE).map(([k, [l, ic]]) => `<button class="chip small" data-bmode="${k}" aria-pressed="${cons.mode === k}">${icon(ic)}${l}</button>`).join("")}</div>
      <div class="bar"><div class="searchbox">${icon("search")}<input id="bloc-q" type="search" value="${esc(cons.q)}" placeholder="${t("Nom, matériau, lieu, région…")}" aria-label="${t("Chercher un bloc")}"></div>
        <a class="btn" href="#carte">${icon("map")}${t("Voir sur la carte")}</a></div>
      <div class="result-line"><span id="bloc-count"></span></div>
      <div id="bloc-list" class="blgrid"></div>
      <p class="small muted">${txt(CONS.blocsNote)} ${t("Sources :")} ${srcLinks(CONS.blocsSources)}</p>`;
      $("#bloc-q").addEventListener("input", (e) => { cons.q = e.target.value; renderBlocs(); });
      renderBlocs(); }
    else if (tab === "emplacements") body.innerHTML = `
      <p class="small muted">${t("Emplacements conseillés par les guides. {0} = visible sur la carte (couche « Lieux de base conseillés »).", icon("pin"))}</p>
      <div class="loc-list">${CONS.emplacements.map((s, i) => `<div class="loc">
        <span class="tag hot">${esc(tr(s.etape))}</span><div><b>${txt(s.nom)}</b> <span class="muted small">· ${nmh(s.region)}${ZONES.find((z) => z.nom === s.region) ? " (" + t("niv. {0}", esc(ZONES.find((z) => z.nom === s.region).niveau)) + ")" : ""}</span><p>${txt(s.pourquoi)}</p><div class="tronc-src">${srcChips(s.sources)}</div></div>
        ${(s.marqueurs || []).some((id) => MARKERS[id]) ? `<a class="btn small" href="#carte/cons/base-${i}">${icon("pin")}${t("Carte")}</a>` : ""}</div>`).join("")}</div>`;
    else if (tab === "autel") body.innerHTML = `
      <h2>${icon("flame")}${t("Autel de la Flamme")}</h2>
      <div class="table-wrap"><table><thead><tr><th>${t("Niveau")}</th><th>${t("Zone constructible")}</th><th>${t("Coût")}</th><th>${t("Flamme requise")}</th></tr></thead><tbody>
        ${CONS.autel.niveaux.map((n) => `<tr><td><b>${n.niveau}</b></td><td>${txt(n.zone)}</td><td>${txt(n.cout)}</td><td>${n.flamme}</td></tr>`).join("")}</tbody></table></div>
      <p class="small">${txt(CONS.autel.capacite)}</p>
      <ul class="tight small">${CONS.autel.regles.map((r) => `<li>${txt(r)}</li>`).join("")}</ul>
      <p class="small muted">${t("Source :")} ${srcLinks(CONS.autel.sources)}</p>
      <h2>${icon("heart")}${t("Confort et bonus Reposé")}</h2>
      <ul class="tight">${CONS.confort.regles.map((r) => `<li>${txt(r)}</li>`).join("")}</ul>
      <h3>${t("Exemples d'objets de confort")}</h3>
      <div class="table-wrap"><table><thead><tr><th>${t("Objet")}</th><th>${t("Confort")}</th></tr></thead><tbody>${CONS.confort.exemples.map((x) => `<tr><td>${nmh(x.objet)}</td><td><b>+${x.confort}</b></td></tr>`).join("")}</tbody></table></div>
      <p class="small muted">${t("Valeurs observées en jeu selon le wiki. Sources :")} ${srcLinks(CONS.confort.sources)}</p>`;
    else if (tab === "artisans") body.innerHTML = `
      <p class="small muted">${txt(CONS.survivantsNote)}</p>
      <div class="bgrid">${CONS.survivants.map((s, i) => `<article class="bld"><div class="bld-top"><span class="emblem c-mag">${icon("users")}</span><div><h3>${esc(s.nom)}</h3><div class="tags"><span class="tag">${esc(tr(s.role))}</span></div></div></div>
        <p>${txt(s.debloque)}</p><div class="bld-foot">${(s.marqueurs || []).some((id) => MARKERS[id]) ? `<a class="btn small" href="#carte/cons/artisan-${i}">${icon("pin")}${t("Où le sauver")}</a>` : ""}</div></article>`).join("")}</div>
      <p class="small muted">${t("Sources :")} ${srcLinks(CONS.survivantsSources)}</p>`;
    else if (tab === "videos") body.innerHTML = `
      <p class="small muted">${t("Tutoriels YouTube 1.0. Seule la première vidéo a été résumée (chapitres repris par AllThings.How) ; les autres sont listées avec leur titre et leur date.")}</p>
      <div class="res-list">${CONS.videos.map((v) => { const s = SOURCES[v.id]; if (!s) return ""; return `<div class="res vid"><span class="vid-ic">${icon("video")}</span><span><b>${esc(s.nom.replace(/^YouTube — /, ""))}</b><small>${s.miseAJourSource ? fmtDate(s.miseAJourSource) + " · " : ""}${txt(s.note)}</small>
        ${v.chapitres ? `<span class="chaps">${v.chapitres.map(([tc, l]) => { const p = tc.split(":").map(Number); return `<a href="${esc(s.url)}&t=${p[0] * 60 + p[1]}s" target="_blank" rel="noopener">${tc} ${txt(l)}</a>`; }).join("")}</span>` : ""}</span>
        <a class="btn small" href="${esc(s.url)}" target="_blank" rel="noopener">${icon("external")}${t("Regarder")}</a></div>`; }).join("")}</div>`;
  }
  function renderBlocs() {
    const q = norm(cons.q).trim();
    $$("[data-bcat]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.bcat === cons.cat));
    $$("[data-bmode]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.bmode === cons.mode));
    const list = CONS.blocs.map((b, i) => [b, i]).filter(([b]) => (!cons.cat || b.cat === cons.cat) && (!cons.mode || b.mode === cons.mode)
      && (!q || q.split(/\s+/).every((w) => norm([b.nom, nm(b.nom), b.recette, tr(b.recette), b.lieu, tr(b.lieu), b.region, nm(b.region), b.quete, nm(b.quete)].join(" ")).includes(w))));
    $("#bloc-count").textContent = tp(list.length, "{0} bloc", "{0} blocs");
    $("#bloc-list").innerHTML = list.map(([b, i]) => `<article class="bl ${BCAT[b.cat]?.[1] || ""}">
      ${blocArt(b)}
      <div class="bl-body"><b>${nmh(b.nom)}</b>
        <small>${icon("hammer")}${txt(b.recette)}</small>
        <small>${icon(BMODE[b.mode][1])}${b.mode === "ramassage" ? t("Ramasser le matériau") : b.mode === "fabrication" ? (b.lieu ? txt(b.lieu) : t("Fabriquer le matériau")) : (b.lieu ? txt(b.lieu) : t("Lieu non documenté"))}</small>
        ${b.quete ? `<small class="muted">${t("Quête associée : « {0} »", nmh(b.quete))}</small>` : ""}
        ${b.conflit ? `<small class="conflict">${icon("alert")}${txt(b.conflit)}</small>` : ""}
        <span class="tag">${nmh(b.region)}</span></div>
      ${pinnedBloc(b) ? `<a class="pin-btn bl-pin" href="#carte/cons/bloc-${i}" title="${t("Voir sur la carte")}" aria-label="${esc(t("Voir {0} sur la carte", nm(b.nom)))}">${icon("pin")}</a>` : ""}
    </article>`).join("") || `<div class="empty" style="grid-column:1/-1">${icon("search")}<p>${t("Aucun bloc ne correspond.")}</p></div>`;
  }

  // ════════════ COMPÉTENCES ════════════
  const sk = { q: "", arbre: "", build: "" };
  function viewCompetences() {
    const R = D.skillRecs;
    app.innerHTML = `
      <h1>${t("Compétences")}</h1>
      <div class="facts">
        <div class="fact"><b>${D.skillMeta.pointsTotal}</b><span>${t("points max en 1.0")}</span></div>
        <div class="fact"><b>0</b><span>${t("classe imposée : mélangez les branches")}</span></div>
        <div class="fact"><b>1.0</b><span>${t("arbre remis à zéro pour tous")}</span></div>
      </div>
      <h2>${icon("star")}${t("Montrer les compétences d'un build")}</h2>
      <div class="chips scroll" role="group" aria-label="Build">
        <button class="chip" data-skb="" aria-pressed="${!sk.build}">${icon("grid")}${t("Toutes")}</button>
        ${D.builds.map((b) => `<button class="chip ${styleColor(b.style)}" data-skb="${b.id}" aria-pressed="${sk.build === b.id}">${icon(styleIcon(b.style))}${esc(TAGS[b.id]?.court || b.nom)}</button>`).join("")}
      </div>
      ${!sk.build ? troncSection(false) : troncSection(true)}
      <h2>${icon("tree")}${sk.build ? t("Compétences de ce build") : t("Toutes les compétences")}</h2>
      <div class="chips scroll" role="group" aria-label="${t("Branche")}">
        <button class="chip" data-tree="" aria-pressed="${!sk.arbre}">${t("Toutes les branches")}</button>
        ${Object.entries(TREE_UI).map(([tn, [ic, c]]) => `<button class="chip c-${c}" data-tree="${tn}" aria-pressed="${sk.arbre === tn}">${icon(ic)}${esc(tr(tn))}</button>`).join("")}
      </div>
      <div class="bar"><div class="searchbox">${icon("search")}<input id="sk-q" type="search" value="${esc(sk.q)}" placeholder="${t("ex. mana, parade, dague…")}" aria-label="${t("Rechercher une compétence")}"></div></div>
      <div class="result-line"><span id="sk-count"></span></div>
      <div id="sk-list" class="sgrid"></div>`;
    $("#sk-q").addEventListener("input", (e) => { sk.q = e.target.value; renderSkills(); });
    renderSkills();
  }
  function renderSkills() {
    const q = norm(sk.q).trim(), b = BUILDS[sk.build];
    const roleOf = (id) => !b ? "" : b.competences.essentielles.includes(id) ? "ess" : (b.competences.optionnelles.includes(id) ? "opt" : (b.competences.ordre || []).includes(id) ? "ess" : "");
    let list = D.skills.filter((s) => (!sk.arbre || s.arbre === sk.arbre) && (!b || roleOf(s.id)) && (!q || q.split(/\s+/).every((w) => norm(s.nom + " " + nm(s.nom) + " " + tr(s.effet) + " " + tr(s.sous)).includes(w))));
    if (b) list = list.sort((x, y) => (roleOf(x.id) === "ess" ? 0 : 1) - (roleOf(y.id) === "ess" ? 0 : 1));
    $("#sk-count").textContent = tp(list.length, "{0} compétence", "{0} compétences");
    $("#sk-list").innerHTML = list.map((s) => `<button class="stile ${treeColor(s.arbre)}" data-skill="${s.id}">
        <span class="stile-top">${icon(TREE_UI[s.arbre]?.[0] || "flame")}<span class="stile-name">${nmh(s.nom)}</span></span>
        ${roleOf(s.id) ? `<span class="role-tag ${roleOf(s.id)}">${roleOf(s.id) === "ess" ? t("Indispensable") : t("Option")}</span>` : ""}
        <span class="stile-eff">${txt(s.effet)}</span>
        <span class="cost">${s.cout ? Array.from({ length: Math.min(s.cout, 5) }, () => "<i></i>").join("") + ` ${s.cout} ${tp(s.cout, "pt", "pts")}` : t("coût inconnu")}</span>
        ${sdot(s.statut)}
      </button>`).join("") || `<div class="empty" style="grid-column:1/-1">${icon("search")}<p>${t("Aucune compétence ne correspond.")}</p></div>`;
  }

  // ════════════ COMPARATEUR ════════════
  function viewComparateur() {
    const items = compare.map(getItem).filter(Boolean);
    const numRows = Object.keys(STAT_LABELS).filter((k) => items.some((i) => i.stats?.[k] != null));
    app.innerHTML = `
      <h1>${t("Comparateur")}</h1>
      <p class="lead">${t("Jusqu'à 4 objets côte à côte. La meilleure valeur est en vert.")}</p>
      <div class="bar"><div class="searchbox">${icon("search")}<input id="cmp-q" type="search" placeholder="${t("Ajouter un objet : tapez son nom…")}" list="cmp-names" aria-label="${t("Ajouter un objet")}"></div>
        <datalist id="cmp-names">${D.items.filter((i) => !compare.includes(i.id)).map((i) => `<option value="${esc(nm(i.nom))}">`).join("")}</datalist></div>
      ${items.length ? `<div class="table-wrap"><table class="cmp-table"><thead><tr><th></th>${items.map((i) => `<th><div class="cmp-head"><button class="itile-main" style="padding:4px" data-item="${i.id}">${art(i, "lg")}<span class="iname">${nmh(i.nom)}</span></button>${sdot(i.statut)}<button class="btn small" data-cmp-remove="${i.id}">${icon("x")}${t("Retirer")}</button></div></th>`).join("")}</tr></thead>
        <tbody>
          <tr><td><b>${t("Type")}</b></td>${items.map((i) => `<td>${esc(tr(i.type) || "—")}</td>`).join("")}</tr>
          <tr><td><b>${t("Niveau")}</b></td>${items.map((i) => `<td>${esc(i.niveau ?? "—")}</td>`).join("")}</tr>
          <tr><td><b>${t("Rareté")}</b></td>${items.map((i) => `<td class="r-${rarKey(i.rarete)}"><span class="rar-txt">${esc(tr(i.rarete) || "—")}</span></td>`).join("")}</tr>
          ${numRows.map((k) => {
            const nums = items.map((i) => (typeof i.stats?.[k] === "number" ? i.stats[k] : null)), valid = nums.filter((n) => n != null), max = Math.max(...valid);
            return `<tr><td><b>${STAT_LABELS[k]}</b></td>${items.map((i, x) => nums[x] != null
              ? `<td class="numcell ${valid.length > 1 && nums[x] === max ? "best" : ""}"><b>${nums[x]}</b><span class="meter"><i style="width:${max ? Math.round(nums[x] / max * 100) : 0}%"></i></span></td>`
              : `<td>${esc(i.stats?.[k] ?? "—")}</td>`).join("")}</tr>`;
          }).join("")}
          <tr><td><b>${t("Attribut")}</b></td>${items.map((i) => `<td>${esc(tr(i.attribut) || "—")}</td>`).join("")}</tr>
          <tr><td><b>${t("Atouts / effets")}</b></td>${items.map((i) => `<td>${[...(i.atouts || []).map(perkH), ...(i.effets || []).map(txt)].map((a) => `<span class="perk">${a}</span>`).join("") || "—"}</td>`).join("")}</tr>
          <tr><td><b>${t("Où le trouver")}</b></td>${items.map((i) => `<td>${i.obtention ? txt(i.obtention) : i.obtentionEn ? I18N.nomsDansTexte(esc(i.obtentionEn)) : "—"}</td>`).join("")}</tr>
        </tbody></table></div>
        ${new Set(items.map((i) => i.statut === "v1" || i.statut === "w10" ? "a" : "b")).size > 1 ? `<div class="warnbox">${icon("alert")}<div>${t("Attention : vous comparez des valeurs récentes avec des valeurs d'avant la 1.0.")}</div></div>` : ""}
        <p><button class="btn small" id="cmp-clear">${icon("trash")}${t("Vider")}</button></p>`
      : `<div class="empty">${icon("compare")}<p>${t("Aucun objet à comparer pour l'instant.")}<br>${t("Touchez le bouton {0} sur un objet.", icon("compare"))}</p><a class="btn primary" href="#equipements">${t("Voir les équipements")}</a></div>`}`;
    $("#cmp-q").addEventListener("change", (e) => {
      const it = D.items.find((i) => nm(i.nom) === e.target.value || i.nom === e.target.value);
      if (it && !compare.includes(it.id) && toggleCompare(it.id)) viewComparateur();
    });
    $("#cmp-clear")?.addEventListener("click", () => { compare = []; saveCompare(); viewComparateur(); });
  }

  // ════════════ GUIDES ════════════
  const G = D.guides || { categories: [], liste: [], sources: {} };
  const GCAT = byId(G.categories);
  let gcat = "";
  const gsrc = (id) => G.sources[id] || SOURCES[id];
  // **gras** et [lien](#vue) autorisés dans les textes des guides
  const gtext = (s) => I18N.nomsDansTexte(esc(tr(s)).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\[([^\]]+)\]\((#[\w/-]+)\)/g, '<a href="$2">$1</a>'));
  // Visuels des guides : crédits affichés sous chaque image
  const CREDIT_WIKI = t("Image © Keen Games, via {0}", `<a href="https://enshrouded.wiki.gg" target="_blank" rel="noopener">enshrouded.wiki.gg</a>`);
  const gcredit = (c) => `<small class="g-credit">${c}</small>`;
  // Carte : fond découpé (images/guides) + épingles placées d'après data/map.js (bornes = coordonnées de carte, y vers le haut)
  function gcarte(c) {
    const fond = (G.cartes || {})[c.fond], M = MAP;
    if (!fond || !M) return "";
    const [x0, y0, x1, y1] = fond.bornes;
    const pos = (x, y) => `left:${((x - x0) / (x1 - x0) * 100).toFixed(2)}%;top:${((y1 - y) / (y1 - y0) * 100).toFixed(2)}%`;
    const mk = Object.fromEntries(M.marqueurs.map((m) => [m.id, m]));
    const pts = (c.points || []).map(([id, l]) => mk[id] && { m: mk[id], l }).filter(Boolean);
    const grp = (c.groupes || []).filter((g) => M.groupes[g]);
    // deux groupes avec la même icône (Shroud Root / Elixir Well sur le wiki) : le second est cerclé
    const alt = (g) => grp.slice(0, grp.indexOf(g)).some((h) => M.groupes[h].icone === M.groupes[g].icone) ? " alt" : "";
    const html = [
      ...(c.regions ? M.regions.map((r) => { const z = M.zones.find((z) => z.nom === r.nom); return `<span class="g-reg${(c.regionsHaut || []).includes(r.nom) ? " up" : ""}" style="${pos(r.x, r.y)}">${esc(nm(r.nom))}${z ? `<small>${t("niv. {0}", esc(z.niveau))}</small>` : ""}</span>`; }) : []),
      ...grp.flatMap((g) => M.marqueurs.filter((m) => m.g === g).map((m) => `<span class="g-ico${alt(g)}" style="${pos(m.x, m.y)}" title="${esc(nm(m.nom))}"><img src="${esc(M.groupes[g].icone)}" alt=""></span>`)),
      ...pts.map((p, k) => `<span class="g-pin" style="${pos(p.m.x, p.m.y)}" title="${esc(tr(p.l).replace(/\*\*/g, ""))}">${k + 1}</span>`)
    ].join("");
    return `<figure class="g-fig g-map">
      <div class="g-map-box" style="aspect-ratio:${x1 - x0}/${y1 - y0}"><img src="${esc(fond.fichier)}" alt="${esc(c.alt ? tr(c.alt) : t("Carte d'Embervale"))}" decoding="async">${html}</div>
      <figcaption>${c.legende ? `<p>${gtext(c.legende)}</p>` : ""}
        ${grp.length ? `<ul class="g-keys">${grp.map((g) => `<li><span class="g-ico${alt(g)}"><img src="${esc(M.groupes[g].icone)}" alt=""></span>${nmh(M.groupes[g].nom)} <span class="muted">(${M.marqueurs.filter((m) => m.g === g).length})</span></li>`).join("")}</ul>` : ""}
        ${pts.length ? `<ol class="g-pins">${pts.map((p) => `<li>${gtext(p.l)}</li>`).join("")}</ol>` : ""}
        ${gcredit(t("Fond : carte du jeu © Keen Games, rendu de {0} ({1}, sans Cinder's Cradle). Emplacements : wiki, CC BY-SA 4.0. {2}", `<a href="${esc(M.source)}" target="_blank" rel="noopener">enshrouded.wiki.gg</a>`, fmtDate(M.fondDate, true), `<a href="#carte">${t("Carte interactive")}</a>`))}</figcaption>
    </figure>`;
  }
  // Rangée d'objets du catalogue : chaque vignette ouvre la fiche
  const gobjets = (o) => { const its = o.ids.map(getItem).filter(Boolean); return its.length ? `<figure class="g-fig g-objs">
      <div class="g-obj-row">${its.map((it) => `<button class="g-obj" data-item="${esc(it.id)}">${art(it, "lg")}<span>${nmh(it.nom)}</span></button>`).join("")}</div>
      <figcaption>${o.legende ? `<p>${gtext(o.legende)}</p>` : ""}${gcredit(`${CREDIT_WIKI}. ${t("Touchez un objet pour voir sa fiche.")}`)}</figcaption></figure>` : ""; };
  const gfigure = (f) => `<figure class="g-fig ${f.cls || ""}"><img src="${esc(f.src)}" alt="${esc(tr(f.alt))}" loading="lazy" decoding="async">
      <figcaption>${f.legende ? `<p>${gtext(f.legende)}</p>` : ""}${gcredit(f.credit ? tr(f.credit) : CREDIT_WIKI)}</figcaption></figure>`;
  const gbloc = (b) => b.p ? `<p>${gtext(b.p)}</p>`
    : b.ul ? `<ul class="tight">${b.ul.map((x) => `<li>${gtext(x)}</li>`).join("")}</ul>`
    : b.ol ? `<ol class="g-steps">${b.ol.map((x) => `<li>${gtext(x)}</li>`).join("")}</ol>`
    : b.table ? `<div class="table-wrap"><table${b.table.tete.length > 3 ? ' class="g-wide"' : ""}><thead><tr>${b.table.tete.map((h) => `<th>${esc(tr(h))}</th>`).join("")}</tr></thead><tbody>${b.table.lignes.map((r) => `<tr>${r.map((v, k) => `<td>${k ? gtext(v) : `<b>${gtext(v)}</b>`}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`
    : b.astuce ? `<div class="g-note tip">${icon("star")}<p><b>${t("Astuce.")}</b> ${gtext(b.astuce)}</p></div>`
    : b.attention ? `<div class="g-note warn">${icon("alert")}<p>${gtext(b.attention)}</p></div>`
    : b.verifier ? `<div class="g-note check">${icon("help")}<p><b>${t("À vérifier en jeu.")}</b> ${gtext(b.verifier)}</p></div>`
    : b.carte ? gcarte(b.carte)
    : b.objets ? gobjets(b.objets)
    : b.figure ? gfigure(b.figure) : "";
  const nVerif = (g) => g.sections.reduce((n, s) => n + s.blocs.filter((b) => b.verifier).length, 0);
  const gcard = (g) => { const c = GCAT[g.cat] || {}; return `<a class="bld g-card" href="#guides/${esc(g.id)}">
      <div class="bld-top">${g.vignette && getItem(g.vignette) ? art(getItem(g.vignette), "sm") : `<span class="emblem ${c.cls || ""}">${icon(g.icone)}</span>`}<div><h3>${txt(g.titre)}</h3>
        <div class="tags"><span class="tag hot">${esc(tr(g.niveau))}</span><span class="tag">${esc(tr(g.version))}</span>${g.spoiler ? `<span class="tag ed">${icon("alert")}Spoilers</span>` : ""}</div></div></div>
      <p>${txt(g.resume)}</p></a>`; };
  function viewGuides(id) {
    if (id) return viewGuide(id);
    if (gcat && !GCAT[gcat]) gcat = "";
    const verif = G.liste.reduce((n, g) => n + nVerif(g), 0);
    app.innerHTML = `
      <h1>${t("Guides")}</h1>
      <p class="lead">${t("Des guides pratiques rédigés à partir de nos recherches sur la 1.0 : par où commencer, comment monter la Flamme, battre les boss, résoudre les salles et bâtir sa base.")}</p>
      <div class="facts">
        <div class="fact"><b>${G.liste.length}</b><span>${t("guides")}</span></div>
        <div class="fact"><b>${G.categories.length}</b><span>${t("catégories")}</span></div>
        <div class="fact"><b>${verif}</b><span>${t("points signalés « à vérifier en jeu »")}</span></div>
      </div>
      <div class="chips scroll" role="group" aria-label="${t("Catégorie")}" style="margin-top:14px"><button class="chip" data-gcat="" aria-pressed="${!gcat}">${icon("grid")}${t("Toutes")}</button>${G.categories.map((c) => `<button class="chip ${c.cls}" data-gcat="${c.id}" aria-pressed="${gcat === c.id}">${icon(c.icone)}${esc(c.nom)}</button>`).join("")}</div>
      ${G.categories.filter((c) => !gcat || c.id === gcat).map((c) => `<section class="g-cat">
        <h2>${icon(c.icone)}${esc(c.nom)}</h2><p class="small muted">${txt(c.desc)}</p>
        <div class="bgrid">${G.liste.filter((g) => g.cat === c.id).map(gcard).join("")}</div></section>`).join("")}
      <p class="small muted" style="margin-top:22px">${I18N.lang === "fr" ? "Les noms d'objets, de lieux et de compétences sont en français : nom officiel du wiki français quand il existe, sinon traduction du site (non officielle). Survolez un nom souligné en pointillé pour voir le nom anglais." : t("Les noms du jeu sont les noms anglais officiels.")} ${t("Ce qui n'est pas encore confirmé en 1.0 est signalé dans chaque guide. Mis à jour le {0}.", fmtDate(G.maj))}</p>`;
  }
  function viewGuide(id) {
    const g = G.liste.find((x) => x.id === id);
    if (!g) { app.innerHTML = `<div class="empty">${icon("help")}<p>${t("Guide introuvable.")}</p><a class="btn" href="#guides">${t("Retour aux guides")}</a></div>`; return; }
    const c = GCAT[g.cat] || {};
    const others = G.liste.filter((x) => x.cat === g.cat && x !== g);
    const i = G.liste.indexOf(g), prev = G.liste[i - 1], next = G.liste[i + 1];
    const srcs = (g.sources || []).map(gsrc).filter(Boolean);
    const body = `
      <nav class="g-toc" aria-label="${t("Sommaire")}"><b>${t("Sommaire")}</b><ol>${g.sections.map((s, k) => `<li><button data-gto="g-s${k}">${txt(s.titre)}</button></li>`).join("")}</ol></nav>
      ${g.sections.map((s, k) => `<section class="g-sec" id="g-s${k}"><h2>${txt(s.titre)}</h2>${s.blocs.map(gbloc).join("")}</section>`).join("")}`;
    app.innerHTML = `
      <a class="back" href="#guides">${icon("back")}${t("Tous les guides")}</a>
      <article class="guide">
        <header class="g-head"><span class="emblem ${c.cls || ""}">${icon(g.icone)}</span><div>
          <div class="tags"><span class="tag">${icon(c.icone)}${esc(c.nom)}</span><span class="tag hot">${esc(tr(g.niveau))}</span><span class="tag">${t("Version {0}", esc(tr(g.version)))}</span>${nVerif(g) ? `<span class="tag">${icon("help")}${t("{0} à vérifier", nVerif(g))}</span>` : ""}</div>
          <h1>${txt(g.titre)}</h1><p class="lead">${txt(g.resume)}</p></div></header>
        ${g.spoiler ? `<div class="g-note warn">${icon("alert")}<p><b>Spoilers.</b> ${t("Ce guide révèle la fin de l'histoire.")}</p></div><details class="more g-spoil"><summary>${icon("book")}${t("Afficher le guide")}</summary><div>${body}</div></details>` : body}
        ${g.liens ? `<h2>${icon("link")}${t("Sur le site")}</h2><div class="btn-row">${g.liens.map(([l, h]) => `<a class="btn small" href="${esc(h)}">${txt(l)}</a>`).join("")}</div>` : ""}
        <h2>${icon("book")}${t("Sources")}</h2>
        <p class="small muted">${t("Texte rédigé pour ce site à partir de ces sources, recoupées entre elles quand c'est possible.")}</p>
        <div class="chips small-chips">${srcs.map((s) => `<a class="src-chip" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(tr(s.nom))}</a>`).join("")}</div>
      </article>
      ${others.length ? `<h2>${icon(c.icone)}${t("Dans la même catégorie")}</h2><div class="bgrid">${others.map(gcard).join("")}</div>` : ""}
      <nav class="g-nav" aria-label="${t("Guides voisins")}">${prev ? `<a class="btn" href="#guides/${esc(prev.id)}">${icon("back")}${txt(prev.titre)}</a>` : "<span></span>"}${next ? `<a class="btn" href="#guides/${esc(next.id)}">${txt(next.titre)}${icon("arrow")}</a>` : ""}</nav>`;
  }

  // ════════════ MISES À JOUR & SOURCES ════════════
  const COV = { "1.0": ["ok", t("À jour")], partiel: ["warn", t("Partiel")], "pre-1.0": ["warn", t("Avant 1.0")], absent: ["bad", t("Absent")], editorial: ["ed", t("Conseils")] };
  function viewMaj() {
    const m = D.meta;
    const counts = D.items.reduce((a, i) => ((a[i.statut] = (a[i.statut] || 0) + 1), a), {});
    app.innerHTML = `
      <h1>${t("Mises à jour & sources")}</h1>
      <div class="facts">
        <div class="fact"><b>${esc(m.versionJeu)}</b><span>${t("version du jeu prise en compte")}</span></div>
        <div class="fact"><b>${fmtDate(m.derniereActualisation, true)}</b><span>${t("dernière vérification")}</span></div>
        <div class="fact"><b>${(counts.v1 || 0) + (counts.w10 || 0)}/${D.items.length}</b><span>${t("objets vérifiés en 1.0 ou mis à jour sur le wiki depuis")}</span></div>
      </div>
      <div class="chips" style="margin-top:10px">${ITEM_ST.map((s) => counts[s] ? `<span class="spill s-${STATUS[s].cls}">${icon(STATUS[s].icon)}${counts[s]} · ${STATUS[s].label}</span>` : "").join("")}</div>
      <h2>${icon("compass")}${t("Niveau des zones")}</h2>
      <p class="small muted">${t("Une arme ou un anneau trouvé prend le niveau de la zone où on le trouve : c'est ce niveau qu'affiche le site quand le jeu ne publie pas le niveau de l'objet.")}</p>
      <div class="zones">${ZONES.map((z) => `<div class="zone"><b>${nmh(z.nom)}</b><span class="zone-lv">${esc(z.niveau)}</span><small>${z.source === "wiki-biomes" ? t("Wiki officiel") : t("PinDrop (pas encore de page wiki)")}${z.maj ? " · " + fmtDate(z.maj, true) : ""}</small></div>`).join("")}</div>
      <p class="small muted">${t("Sources :")} ${srcLinks(["wiki-biomes", "wiki-chests", "wiki-10", "pd-biomes"])}</p>
      <h2>${icon("check")}${t("Ce qui est à jour")}</h2>
      <div class="cov">${m.couverture.map((c) => { const [cls, l] = COV[c.etat] || ["info", c.etat]; return `<div class="cov-row"><b>${txt(c.domaine)}</b><span class="spill s-${cls}">${l}</span><span class="muted">${txt(c.detail)}</span></div>`; }).join("")}</div>
      <h2>${icon("refresh")}${t("Historique des versions")}</h2>
      <div class="timeline">${D.versions.map((v) => `<div class="tl-item">
        <h3>${t("Version {0}", esc(v.version))} <span class="muted small">· ${fmtDate(v.date)}</span></h3>
        <p style="margin:4px 0">${txt(v.resume)}</p>
        <details class="more" style="margin-top:8px"><summary>${t("Ce qui change pour les builds")}</summary><div>
          ${Array.isArray(v.impact) ? `<ul class="tight">${v.impact.map((x) => `<li>${txt(x)}</li>`).join("")}</ul>` : `<p>${txt(v.impact)}</p>`}
          <p><b>${t("Sur ce site :")}</b> ${txt(v.etatSite)}</p><p class="muted">${srcLinks(v.sources)}</p></div></details>
      </div>`).join("")}</div>
      <h2>${icon("info")}${t("Comment le site est mis à jour")}</h2>
      <p class="small muted">${t("Pas de mise à jour automatique : les nouvelles versions sont détectées automatiquement, mais les valeurs sont vérifiées avant d'être modifiées.")}</p>
      <div class="steps">
        <div>${t("Un script détecte les nouvelles annonces officielles sur Steam ({0}).", "<code>node scripts/check-updates.mjs</code>")}</div>
        <div>${t("La page {0} relit le wiki, puis {1} reconstruit le catalogue et la carte.", "<code>scripts/collect.html</code>", "<code>node scripts/build-data.mjs</code>")}</div>
        <div>${t("On relit les changements, on met à jour les conseils, puis {0}.", "<code>node scripts/validate.mjs</code>")}</div>
      </div>
      ${I18N.lang === "fr" ? `<p class="small muted">Traductions : noms français officiels repris du wiki français (enshrouded.wiki.gg/fr) ; les autres noms et les descriptions du wiki anglais sont traduits par le site (non officiel, nom anglais en info-bulle).</p>` : `<p class="small muted">${t("Version anglaise : interface et textes du site traduits du français ; noms et descriptions du jeu repris du wiki anglais.")}</p>`}
      <details class="more"><summary>${icon("book")}${t("Toutes les sources ({0})", D.sources.length)}</summary><div>
        <div class="table-wrap"><table><thead><tr><th>${t("Source")}</th><th>${t("Type")}</th><th>${t("Fiabilité")}</th><th>${t("Remarque")}</th></tr></thead><tbody>
        ${D.sources.map((s) => `<tr><td><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(tr(s.nom))}</a>${s.miseAJourSource ? `<br><span class="muted small">${t("màj {0}", fmtDate(s.miseAJourSource, true))}</span>` : ""}</td><td>${esc(tr(s.type))}</td><td>${esc(tr(s.fiabilite))}</td><td class="small">${txt(s.note)}</td></tr>`).join("")}
        </tbody></table></div></div></details>`;
  }

  // ── Routeur
  function route() {
    const h = decodeURIComponent(location.hash.slice(1)) || EXT.accueil || "builds";
    const [view] = h.split(/[/=]/);
    $$("a[data-view]").forEach((a) => a.classList.toggle("active", a.dataset.view === view || ((view === "build" || view === "planner") && a.dataset.view === "builds")));
    if ($("#dlg").open) $("#dlg").close();
    if (leaflet) { leaflet.map.remove(); leaflet = null; }
    if (EXT.vues?.[view]) EXT.vues[view](h);
    else if (view === "build") viewBuild(h.split("/")[1]);
    else if (view === "planner") viewPlanner(location.hash.split("=")[1]);
    else if (view === "carte") { const [, kind, val] = h.split("/"); viewCarte(kind === "item" ? { item: val } : kind === "region" ? { region: val } : kind === "cons" ? { cons: val } : kind === "point" ? { point: val } : null); }
    else if (view === "construction") viewConstruction(h.split("/")[1]);
    else if (view === "guides") viewGuides(h.split("/")[1]);
    else ({ builds: viewBuilds, equipements: viewEquipements, competences: viewCompetences, comparateur: viewComparateur, maj: viewMaj }[view] || viewBuilds)();
    window.scrollTo(0, 0);
    EXT.apres?.(view, h);
  }

  // ── Événements (délégation)
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-item],[data-skill],[data-slot],[data-quiz],[data-quiz-reset],[data-stage],[data-cat],[data-sub],[data-skb],[data-tree],[data-share],[data-cmp],[data-cmp-toggle],[data-cmp-remove],[data-del-mine],[data-help],[data-close],[data-ctab],[data-bcat],[data-bmode],[data-mpcat],[data-mpall],[data-mpfocus],[data-mpadd],[data-mplogout],[data-mppickcancel],[data-mpedit],[data-mpstatus],[data-mpdel],[data-mpdelok],[data-gcat],[data-gto]");
    if (!el) return;
    if (handleMapClick(el.dataset)) return;
    const d = el.dataset;
    if (d.item) itemDetail(d.item);
    else if (d.skill) skillDetail(d.skill);
    else if (d.slot) { const [bid, i] = d.slot.split(":"); slotDialog(bid, Number(i)); }
    else if (d.quiz) { const [k, v] = d.quiz.split(":"); quiz[k] = quiz[k] === v ? "" : v; viewBuilds(); }
    else if (d.quizReset !== undefined) { Object.keys(quiz).forEach((k) => { quiz[k] = ""; }); viewBuilds(); }
    else if (d.stage) { stage = d.stage; $$("[data-stage]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.stage === stage)); renderLoadout(BUILDS[location.hash.split("/")[1]]); }
    else if (d.cat !== undefined) { eq.cat = d.cat; eq.sub = ""; store.set("ens.eq3", eq); viewEquipements(); }
    else if (d.sub !== undefined) { eq.sub = d.sub; store.set("ens.eq3", eq); viewEquipements(); }
    else if (d.skb !== undefined) { sk.build = d.skb; viewCompetences(); }
    else if (d.tree !== undefined) { sk.arbre = d.tree; $$("[data-tree]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.tree === sk.arbre)); renderSkills(); }
    else if (d.share) copy(location.href.split("#")[0] + "#build/" + d.share, t("Lien du build copié"));
    else if (d.cmp) { if (toggleCompare(d.cmp)) el.setAttribute("aria-pressed", compare.includes(d.cmp)); }
    else if (d.cmpToggle) { toggleCompare(d.cmpToggle); itemDetail(d.cmpToggle); if (location.hash.startsWith("#equipements")) renderEqList(); else if (location.hash.startsWith("#comparateur")) viewComparateur(); }
    else if (d.cmpRemove) { toggleCompare(d.cmpRemove); viewComparateur(); }
    else if (d.delMine) { const mine = store.get("ens.myBuilds", []); mine.splice(Number(d.delMine), 1); store.set("ens.myBuilds", mine); viewBuilds(); }
    else if (d.help !== undefined) helpDialog();
    else if (d.close !== undefined) $("#dlg").close();
    else if (d.ctab) { location.hash = "#construction/" + d.ctab; }
    else if (d.bcat !== undefined) { cons.cat = d.bcat; renderBlocs(); }
    else if (d.bmode !== undefined) { cons.mode = d.bmode; renderBlocs(); }
    else if (d.gcat !== undefined) { gcat = d.gcat; viewGuides(); }
    else if (d.gto) document.getElementById(d.gto)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("#help-btn").addEventListener("click", helpDialog);
  $("#dlg").addEventListener("click", (e) => { if (e.target.id === "dlg") e.target.close(); });

  // Outils partagés avec les extensions (refonte.html)
  window.ENS_API = { app, D, $, $$, esc, norm, icon, art, sdot, getItem, itemDetail, skillDetail, helpDialog, openDialog, toast, hydrateIcons,
    rarKey, lvTxt, keyStat, styleIcon, styleColor, treeColor, TREE_UI, TAGS, BUILDS, SKILLS, buildCard, gcard, G, GCAT, CONS, CAT, t, tp, tr, nm, nmh, txt, fmtDate };

  I18N.traduirePage(); hydrateIcons(); renderHeader(); saveCompare();
  window.addEventListener("hashchange", route);
  route();
})();
