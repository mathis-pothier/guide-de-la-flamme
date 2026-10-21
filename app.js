/* Guide de la Flamme — application sans dépendance (Leaflet seulement pour la carte).
   Données : window.ENS (dossier data/, fusionnées par data/merge.js), icônes : window.ENS_ICONS. */
(() => {
  "use strict";
  const D = window.ENS, ICONS = window.ENS_ICONS;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const app = $("#app");
  const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));
  const ITEMS = byId(D.items), SKILLS = byId(D.skills), SOURCES = byId(D.sources), BUILDS = byId(D.builds);
  const TAGS = D.buildTags || {}, IMG = D.images || {}, ALIAS = D.alias || {}, MAP = D.map;
  const getItem = (id) => ITEMS[id] || ITEMS[ALIAS[id]];

  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const fmtDate = (iso, short) => (iso ? new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", short ? { day: "numeric", month: "short" } : { day: "numeric", month: "long", year: "numeric" }) : "date inconnue");
  const icon = (name, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.help}</svg>`;

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } }
  };
  let compare = store.get("ens.compare", []).map((id) => (getItem(id) || {}).id).filter(Boolean);
  const saveCompare = () => { store.set("ens.compare", compare); $("#cmp-count").textContent = compare.length || ""; };

  // ── Vocabulaire visuel
  const STATUS = {
    v1: { label: "Vérifié 1.0", icon: "check", cls: "ok", desc: "Valeurs lues dans les fichiers de la version 1.0." },
    w10: { label: "Wiki après 1.0", icon: "refresh", cls: "teal", desc: "Page du wiki modifiée depuis la sortie de la 1.0 : probablement à jour, sans garantie." },
    pre: { label: "Ancienne version", icon: "clock", cls: "warn", desc: "Valeurs d'avant la 1.0 : elles ont peut-être changé." },
    conflit: { label: "Sources en désaccord", icon: "alert", cls: "bad", desc: "Les sources donnent des valeurs différentes." },
    guide: { label: "Cité par un guide", icon: "book", cls: "info", desc: "Nommé par un guide, pas trouvé dans une base de données." },
    wiki: { label: "Texte du wiki", icon: "clock", cls: "warn", desc: "Description du wiki, peut-être d'avant la 1.0." },
    modif: { label: "Modifiée en 1.0", icon: "alert", cls: "bad", desc: "Changée par la 1.0 : la description peut être dépassée." },
    nouv: { label: "Nouveauté 1.0", icon: "spell", cls: "ok", desc: "Ajoutée par la 1.0." }
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
    return `<span class="gen ${el ? "el-" + el : ""}">${icon(itemIcon(it))}<span class="mono">${esc(initials(it.nom))}</span>${el ? `<i class="elb">${icon(EL_ICON[el])}</i>` : ""}</span>`;
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
  const STAT_LABELS = { degats: "Dégâts", armurePhys: "Armure phys.", armureMag: "Armure mag.", parade: "Parade", blocage: "Blocage", durabilite: "Durabilité", vitesse: "Vitesse",
    tension: "Tension", vitesseFleche: "Vitesse flèche", regenMana: "Régén. mana", surcharge: "Surcharge", mana: "Coût mana", incantation: "Incantation", pieces: "Pièces", multDegats: "Mult. dégâts", multVitesse: "Mult. vitesse" };
  const keyStat = (it) => {
    if (it.stats?.armurePhys != null || it.stats?.armureMag != null) return `<span class="kstat"><b>${it.stats.armurePhys ?? "–"}</b>/<b>${it.stats.armureMag ?? "–"}</b> armure</span>`;
    for (const k of ["degats", "blocage", "parade", "multDegats"]) if (it.stats?.[k] != null) return `<span class="kstat"><b>${esc(it.stats[k])}</b> ${STAT_LABELS[k].toLowerCase()}</span>`;
    if (it.effets?.length) return `<span class="kstat">${esc(it.effets[0])}</span>`;
    if (it.atouts?.length) return `<span class="kstat">${esc(it.atouts[0])}</span>`;
    return "";
  };
  const lvOf = (it) => it.niveau ?? it.niveauRegion;
  const lvTxt = (it) => it.niveau != null ? "Niv. " + it.niveau : it.niveauRegion ? "Zone niv. " + it.niveauRegion : it.categorie === "arme" ? "Niv. selon la zone" : "";
  const ZONES = (D.map && D.map.zones) || [];
  // Explication du niveau affiché (fiche objet).
  function levelExplain(it) {
    const wikiLv = it.niveauWiki != null ? ` Le wiki affiche « level ${esc(it.niveauWiki)} » : c'est la valeur utilisée pour son calcul de dégâts, pas le niveau de l'objet.` : "";
    if (it.niveau != null && it.categorie === "arme" && /–/.test(String(it.niveau))) return `<div class="drow">${icon("info")}<div class="small">Niveau <b>${esc(it.niveau)}</b> lu dans les fichiers du jeu 1.0 : l'arme évolue avec les améliorations${it.niveauRegion ? `, mais on la trouve en <b>${esc(it.region)}</b> (zone de niveau <b>${esc(it.niveauRegion)}</b>)` : ""}.</div></div>`;
    if (it.niveau == null && it.niveauRegion) return `<div class="drow">${icon("info")}<div class="small">Une arme ou un anneau trouvé prend le niveau de sa zone (wiki officiel : le butin dépend du niveau du joueur et de la difficulté de la zone). Ici : <b>${esc(it.region)}</b>, zone de niveau <b>${esc(it.niveauRegion)}</b> selon le wiki${/Cinder/.test(it.region) ? " (PinDrop pour Cinder's Cradle)" : ""}.${wikiLv}</div></div>`;
    if (it.niveau == null && it.categorie === "arme") return `<div class="drow">${icon("info")}<div class="small">Niveau non publié : il dépend de l'endroit où vous trouvez ou fabriquez l'arme (butin de donjon, de repaire, d'ennemi ou arme de lore).${wikiLv}</div></div>`;
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
  const PORTEE = { melee: ["sword", "Mêlée"], distance: ["target", "Distance"], magie: ["wand", "Magie"] };
  const MODE = { solo: ["user", "Solo"], equipe: ["users", "Équipe"] };
  const ROLE = { degats: ["bolt", "Dégâts"], defense: ["shield", "Défense"], soutien: ["heart", "Soutien"] };
  const CAT = { arme: ["Armes", "sword"], armure: ["Armures", "armor"], set: ["Sets", "layers"], bouclier: ["Boucliers", "shield"], anneau: ["Anneaux", "ring"], sort: ["Sorts", "spell"] };
  const WEAPON_SUB = [["sword", "Épées"], ["greatsword", "Espadons"], ["axe", "Haches"], ["hammer", "Marteaux"], ["mace", "Masses"], ["daggers", "Dagues"], ["bow", "Arcs"], ["wand", "Baguettes"], ["staff", "Bâtons"]];
  const ARMOR_SUB = [["Tête", "helmet"], ["Torse", "armor"], ["Mains", "gloves"], ["Jambes", "pants"], ["Pieds", "boots"]];
  const CTX_ICON = { Exploration: "compass", "Groupes d'ennemis": "crowd", Boss: "skull", "Équipe": "users", Solo: "user" };

  const diffLevel = (t) => { const n = norm(t); return n.includes("difficile") ? 3 : n.includes("facile") && n.includes("moyenne") ? 1.5 : n.includes("facile") ? 1 : 2; };
  const pips = (lvl) => `<span class="pips" title="Difficulté">${[1, 2, 3].map((i) => `<span class="pip ${lvl >= i ? "on" : lvl >= i - .5 ? "half" : ""}"></span>`).join("")}</span>`;
  const skillChip = (id, extra = "") => { const s = SKILLS[id]; if (!s) return ""; return `<button class="sk ${treeColor(s.arbre)} ${extra}" data-skill="${esc(id)}">${icon(TREE_UI[s.arbre]?.[0] || "flame")}${esc(s.nom)}</button>`; };
  const srcLinks = (ids) => (ids || []).map((id) => SOURCES[id] ? `<a href="${esc(SOURCES[id].url)}" target="_blank" rel="noopener" title="${esc(SOURCES[id].note || "")}">${esc(SOURCES[id].nom)}</a>` : esc(id)).join(" · ");
  const srcChips = (ids) => (ids || []).filter((id) => SOURCES[id]).map((id) => `<a class="src-chip" href="${esc(SOURCES[id].url)}" target="_blank" rel="noopener" title="${esc(SOURCES[id].nom)}">${esc(SOURCES[id].nom.split(/ — | - /)[0])}</a>`).join("");

  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2200); }
  async function copy(text, msg) { try { await navigator.clipboard.writeText(text); toast(msg); } catch { prompt("Copiez ce lien :", text); } }
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
    $("#version-chip").textContent = `Jeu v${m.versionJeu} · vérifié le ${fmtDate(m.derniereActualisation, true)}`;
    $("#version-chip").classList.toggle("stale", stale);
    $("#freshness").innerHTML = stale
      ? `<div class="fresh stale">${icon("alert")}<span>Dernière vérification il y a ${days} jours : une mise à jour du jeu a pu changer des valeurs. <a href="#maj">Voir</a></span></div>`
      : `<div class="fresh">${icon("info")}<span>Jeu v${esc(m.versionJeu)} · ${D.items.length} objets · certaines valeurs datent d'avant la 1.0. <button data-help>Comment lire les pastilles ?</button></span></div>`;
  }
  function helpDialog() {
    openDialog(`<div class="dhead"><span class="art lg r-legendaire generated">${genArt({ nom: "Guide", categorie: "arme", type: "Épée" })}</span><div><h2>Comment lire ce site</h2><p>Trois repères suffisent.</p></div></div>
      <h3>1. La couleur du cadre = la rareté</h3>
      <div class="legend-list" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr))">${[["commune", "Commune"], ["peu-commune", "Peu commune"], ["rare", "Rare"], ["epique", "Épique"], ["legendaire", "Légendaire"], ["inconnue", "Non indiquée"]].map(([k, l]) => `<div><span class="art xs r-${k} generated">${genArt({ nom: l, categorie: "arme", type: "Épée" })}</span>${l}</div>`).join("")}</div>
      <p class="small muted">Quand le wiki n'a pas d'image, l'icône est dessinée : sa forme indique le type, sa couleur l'élément (feu, glace, foudre…), les lettres le nom.</p>
      <h3>2. La pastille = la fiabilité de l'info</h3>
      <div class="legend-list">${ITEM_ST.map((s) => `<div>${sdot(s)}<span><b>${STATUS[s].label}</b> — ${STATUS[s].desc}</span></div>`).join("")}</div>
      <h3>3. La couleur des compétences = la branche de l'arbre</h3>
      <div class="chips">${Object.entries(TREE_UI).map(([t, [ic, c]]) => `<span class="sk c-${c}">${icon(ic)}${t}</span>`).join("")}</div>
      <p class="small muted" style="margin-top:14px">Les builds sont des conseils (repris de guides), pas des données du jeu. Touchez un objet ou une compétence pour le détail et les sources.</p>`);
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
      ${im && im.l > im.h * 1.2 ? `<img class="banner" src="${esc(im.fichier)}" alt="${esc(it.nom)} porté en jeu" onerror="this.remove()">` : ""}
      <div class="dhead">${art(it, "xl")}<div><h2>${esc(it.nom)}</h2>
        <p><span class="r-${rarKey(it.rarete)} rar-txt">${esc(it.rarete || "Rareté non indiquée")}</span> · ${esc(it.type || CAT[it.categorie]?.[0] || "")}${it.niveau != null ? ` · niveau ${esc(it.niveau)}` : ""}${it.classe ? ` · ${esc(it.classe)}` : ""}</p></div></div>
      ${levelExplain(it)}
      <div class="chips">${spill(it.statut)}${it.confirmeWiki ? `<span class="spill s-teal">${icon("check")}Existence confirmée par le wiki</span>` : ""}</div>
      ${it.statut === "conflit" ? `<div class="warnbox">${icon("alert")}<div><b>Les sources ne sont pas d'accord</b><ul class="tight">${(it.conflits || []).map((c) => `<li>${esc(c)}</li>`).join("")}</ul></div></div>` : ""}
      ${it.description ? `<p class="desc">« ${esc(it.description)} »</p>` : ""}
      ${stats.length ? `<div class="stat-tiles">${stats.map(([k, v]) => `<div><b>${esc(v)}</b><span>${esc(STAT_LABELS[k] || k)}</span></div>`).join("")}</div>` : `<p class="small muted">Statistiques non publiées par les sources consultées.</p>`}
      ${it.attribut || it.typeDegats ? `<div class="drow">${icon("bolt")}<div>${it.attribut ? `Profite de la <b>${esc(it.attribut)}</b>` : ""}${it.attribut && it.typeDegats ? " · " : ""}${it.typeDegats ? esc(it.typeDegats) : ""}</div></div>` : ""}
      ${it.atouts ? `<div class="drow">${icon("spell")}<div>${it.atouts.map((a) => `<span class="perk">${esc(a)}</span>`).join("")}</div></div>` : ""}
      ${it.effets ? `<div class="drow">${icon("spell")}<div>${it.effets.map((a) => `<span class="perk">${esc(a)}</span>`).join("")}</div></div>` : ""}
      ${it.amelioration ? `<div class="drow">${icon("star")}<div><b>Améliorations :</b><ul class="tight">${it.amelioration.map((a) => `<li>${esc(a)}</li>`).join("")}</ul></div></div>` : ""}
      ${pieces.length ? `<h3>Pièces du set</h3><div class="mini-grid">${pieces.map((p) => `<button class="mini" data-item="${esc(p.id)}">${art(p, "sm")}<span>${esc(p.emplacement || "")}</span></button>`).join("")}</div>` : ""}
      ${set ? `<div class="drow">${icon("layers")}<div>Fait partie du <button class="ref" data-item="${esc(set.id)}">${esc(set.nom)}</button></div></div>` : ""}
      <div class="drow">${icon("pin")}<div><b>Où le trouver :</b> ${esc(it.obtention || (it.obtentionEn ? "" : "non renseigné"))}
        ${it.obtentionEn ? `<div class="small muted">Wiki (anglais) : ${esc(it.obtentionEn)}</div>` : ""}</div></div>
      ${usedBy.length ? `<div class="drow">${icon("star")}<div><b>Conseillé pour :</b> <span class="chips" style="margin-top:6px">${usedBy.map((b) => `<a class="chip small ${styleColor(b.style)}" href="#build/${b.id}">${icon(styleIcon(b.style))}${esc(TAGS[b.id]?.court || b.nom)}</a>`).join("")}</span></div></div>` : ""}
      <div class="btn-row" style="margin-top:14px">
        <button class="btn ${compare.includes(id) ? "" : "primary"}" data-cmp-toggle="${esc(id)}">${icon("compare")}${compare.includes(id) ? "Retirer du comparateur" : "Comparer"}</button>
        ${ml ? `<a class="btn" href="${ml}">${icon("map")}Voir sur la carte</a>` : ""}
        ${it.wiki ? `<a class="btn" href="${esc(it.wiki)}" target="_blank" rel="noopener">${icon("external")}Page du wiki</a>` : ""}
      </div>
      <details class="more"><summary>${icon("book")}Sources et vérification</summary><div>
        <p>Vérifié le ${fmtDate(it.verifie)}${it.wikiMaj ? ` · page wiki modifiée le ${fmtDate(it.wikiMaj)}` : ""}${it.idInterne ? ` · identifiant <code>${esc(it.idInterne)}</code>` : ""}</p>
        ${it.degatsNote ? `<p>${esc(it.degatsNote)}</p>` : ""}${it.note ? `<p>${esc(it.note)}</p>` : ""}
        <p>${srcLinks(it.sources)}</p>
        <p class="muted">${im ? "Image : enshrouded.wiki.gg (© Keen Games)." : "Pas d'image sur le wiki : icône dessinée pour ce site."}</p></div></details>`);
  }
  function skillDetail(id) {
    const s = SKILLS[id]; if (!s) return;
    const ub = D.builds.filter((b) => [...b.competences.essentielles, ...b.competences.optionnelles, ...(b.competences.ordre || [])].includes(id));
    openDialog(`
      <div class="dhead"><span class="emblem ${treeColor(s.arbre)}">${icon(TREE_UI[s.arbre]?.[0] || "flame")}</span><div><h2>${esc(s.nom)}</h2><p>${esc(s.arbre)} › ${esc(s.sous)}</p></div></div>
      ${spill(s.statut)}
      <div class="stat-tiles"><div><b>${s.cout ?? "?"}</b><span>point${s.cout > 1 ? "s" : ""}</span></div>${s.rangs ? `<div><b>${s.rangs}</b><span>rang${s.rangs > 1 ? "s" : ""}</span></div>` : ""}</div>
      <p style="font-size:1rem">${esc(s.effet)}</p>
      ${s.prerequis ? `<div class="drow">${icon("tree")}<div><b>Prérequis :</b> ${s.prerequis.map((p) => skillChip(p)).join(" ")}</div></div>` : ""}
      ${s.conflit ? `<div class="warnbox">${icon("alert")}<div>${esc(s.conflit)}</div></div>` : ""}
      ${ub.length ? `<div class="drow">${icon("star")}<div><b>Utilisée par :</b> <span class="chips" style="margin-top:6px">${ub.map((b) => `<a class="chip small ${styleColor(b.style)}" href="#build/${b.id}">${icon(styleIcon(b.style))}${esc(TAGS[b.id]?.court || b.nom)}</a>`).join("")}</span></div></div>` : ""}
      <details class="more"><summary>${icon("book")}Sources</summary><div><p>${srcLinks(s.sources)}</p></div></details>`);
  }
  function toggleCompare(id) {
    if (compare.includes(id)) compare = compare.filter((x) => x !== id);
    else if (compare.length >= 4) { toast("4 objets maximum dans le comparateur"); return false; }
    else compare.push(id);
    saveCompare(); toast(compare.includes(id) ? "Ajouté au comparateur" : "Retiré du comparateur");
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
  const skillCost = (s) => s ? (s.rangs > 1 ? `${s.cout} pt × ${s.rangs}` : `${s.cout ?? "?"} pt${s.cout > 1 ? "s" : ""}`) : "";
  const troncIds = () => TRONC ? TRONC.groupes.filter((g) => g.niveau !== "selon").flatMap((g) => g.competences.map((c) => c.id)) : [];
  function troncSection(compact) {
    if (!TRONC) return "";
    if (compact) {
      const ess = TRONC.groupes.find((g) => g.niveau === "indispensable");
      return `<div class="tronc-compact">${icon("star")}<span><b>À prendre aussi, comme sur tout personnage :</b></span><div class="chips">${ess.competences.map((c) => skillChip(c.id)).join("")}</div><a href="#competences" class="small">Tout le tronc commun →</a></div>`;
    }
    let total = 0;
    const path = TRONC.premiersPoints.map((id, i) => { const s = SKILLS[id]; total += s?.cout || 0; return `<div class="step"><span class="step-n">${i + 1}</span>${skillChip(id)}<span class="step-cost">${s?.cout ?? "?"} pt · total ${total}</span></div>`; }).join("");
    return `
      <section class="tronc">
        <h2>${icon("star")}Tronc commun : pour tous les personnages</h2>
        <p class="lead" style="margin-bottom:12px">${esc(TRONC.intro)}</p>
        <h3>${icon("arrow")} Par où commencer</h3>
        <div class="steps-path">${path}</div>
        <p class="small muted">${esc(TRONC.premiersPointsNote)} Sources : ${srcLinks(TRONC.premiersPointsSources)}</p>
        <div class="tronc-groups">${TRONC.groupes.map((g) => `
          <div class="tronc-group lvl-${g.niveau}">
            <h3>${icon(g.icone)} ${esc(g.titre)} <span class="lvl-tag">${g.niveau === "indispensable" ? "Indispensable" : g.niveau === "conseille" ? "Conseillé" : "Selon le style"}</span></h3>
            ${g.competences.map((c) => { const s = SKILLS[c.id]; if (!s) return ""; return `<div class="tronc-row">
              <button class="sk ${treeColor(s.arbre)}" data-skill="${esc(c.id)}">${icon(TREE_UI[s.arbre]?.[0] || "flame")}${esc(s.nom)}</button>
              <span class="tronc-cost">${skillCost(s)}</span>
              <div class="tronc-why">${esc(c.pourquoi)}${c.citation ? ` <i class="muted">${esc(c.citation)}</i>` : ""}${c.nuance ? `<div class="small muted">${icon("info")} ${esc(c.nuance)}</div>` : ""}
                <div class="tronc-src">${c.site ? `<span class="spill s-ed">Conseil du site</span>` : srcChips(c.sources)}${s.conflit ? `<span class="spill s-bad" title="${esc(s.conflit)}">${icon("alert")}Sources en désaccord</span>` : ""}</div></div>
            </div>`; }).join("")}
            ${g.note ? `<p class="small muted">${esc(g.note)}</p>` : ""}
          </div>`).join("")}</div>
      </section>`;
  }

  // ════════════ BUILDS ════════════
  const quiz = { portee: "", mode: "", role: "" };
  const matches = (b) => { const t = TAGS[b.id] || {}; return (!quiz.portee || t.portee === quiz.portee) && (!quiz.mode || (t.modes || []).includes(quiz.mode)) && (!quiz.role || (t.roles || []).includes(quiz.role)); };
  function quizRow(key, label, opts) {
    return `<div class="quiz-q"><span>${label}</span><div class="chips">${Object.entries(opts).map(([k, [ic, l]]) => `<button class="chip" data-quiz="${key}:${k}" aria-pressed="${quiz[key] === k}">${icon(ic)}${l}</button>`).join("")}</div></div>`;
  }
  const tierBadge = (b) => b.tiers?.solo ? `<span class="tier" title="Classement ${esc(SOURCES[b.tiers.source]?.nom || "")}">${icon("trophy")}Solo ${b.tiers.solo} · Duo ${b.tiers.duo}</span>` : "";
  function buildCard(b) {
    const t = TAGS[b.id] || {};
    const preview = b.equipement.map((s) => getItem(s.meilleur)).filter(Boolean).slice(0, 4);
    return `<a class="bcard ${styleColor(b.style)} ${matches(b) ? "" : "dim"}" href="#build/${b.id}">
      <div class="bcard-top"><span class="emblem">${icon(styleIcon(b.style))}</span><div><h3>${esc(t.court || b.nom)}</h3>${pips(diffLevel(b.difficulte))}</div></div>
      <p>${esc(t.accroche || b.role)}</p>
      ${preview.length ? `<div class="preview">${preview.map((it) => art(it, "xs")).join("")}</div>` : ""}
      <div class="tags">${t.portee ? `<span class="tag">${icon(PORTEE[t.portee][0])}${PORTEE[t.portee][1]}</span>` : ""}${(t.modes || []).map((m) => `<span class="tag">${icon(MODE[m][0])}${MODE[m][1]}</span>`).join("")}${tierBadge(b)}</div>
      <div class="bcard-foot">${b.complet ? `<span class="tag hot">${icon("star")}Fiche complète</span>` : b.confiance === "editoriale" ? `<span class="tag ed">Expérimental</span>` : `<span class="tag">Équipement 1.0 détaillé</span>`}<span class="muted">${icon("arrow")}</span></div>
    </a>`;
  }
  function viewBuilds() {
    const sorted = [...D.builds].sort((a, b) => matches(b) - matches(a) || b.complet - a.complet);
    const n = D.builds.filter(matches).length, active = quiz.portee || quiz.mode || quiz.role;
    const mine = store.get("ens.myBuilds", []);
    app.innerHTML = `
      <h1>Trouvez votre build</h1>
      <p class="lead">Trois questions, et les builds qui vous correspondent s'allument.</p>
      <div class="quiz">
        ${quizRow("portee", "Comment combattre ?", PORTEE)}
        ${quizRow("mode", "Avec qui ?", MODE)}
        ${quizRow("role", "Votre rôle ?", ROLE)}
        <div class="quiz-foot"><span class="muted small">${active ? `<b style="color:var(--text)">${n}</b> build${n > 1 ? "s" : ""} correspond${n > 1 ? "ent" : ""}` : `${D.builds.length} builds disponibles`}</span>
          ${active ? `<button class="btn small" data-quiz-reset>${icon("refresh")}Recommencer</button>` : ""}</div>
      </div>
      <h2>${icon("star")}Builds</h2>
      <div class="grid">${sorted.map(buildCard).join("")}</div>
      <h2>${icon("edit")}Mes builds</h2>
      <div class="mybuilds">
        <a class="mybuild" href="#planner" style="text-decoration:none;color:inherit;border-style:dashed"><span class="emblem c-base">${icon("edit")}</span><div><b>Créer mon build</b><span class="small muted">Armes, compétences, lien à partager</span></div></a>
        ${mine.map((m, i) => `<div class="mybuild ${styleColor(m.style)}"><span class="emblem">${icon(styleIcon(m.style))}</span><div><b>${esc(m.nom || "Sans nom")}</b><span class="small muted">${m.skills.length} compétences · ${Object.values(m.gear).filter(Boolean).length} objets</span></div>
          <a class="icon-btn" href="#planner=${encodeBuild(m)}" title="Ouvrir" aria-label="Ouvrir">${icon("arrow")}</a><button class="icon-btn" data-del-mine="${i}" title="Supprimer" aria-label="Supprimer">${icon("trash")}</button></div>`).join("")}
      </div>`;
  }

  // ── Fiche build
  const STAGES = [["debut", "Début"], ["milieu", "Milieu"], ["fin", "Fin"]];
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
        <span class="slot-lbl">${esc(s.emplacement)}${c.auto ? ` <span class="auto-tag" title="Aucune source ne conseille d'objet ici à cette étape : meilleur objet du catalogue.">auto</span>` : ""}</span>
        ${it ? art(it, "lg") : `<span class="art lg empty">${icon(SLOT_ICON[s.emplacement] || "help")}</span>`}
        <span class="slot-name">${it ? esc(it.nom) : /optionnel/i.test(s.emplacement) ? "Pas utile à ce stade" : c.texte ? "Au choix" : "Pas de conseil à ce stade"}</span>
        ${it ? `<span class="slot-foot">${sdot(it.statut)}${hasMapPin(it) ? `<span class="pinmark" title="Emplacement précis sur la carte">${icon("pin")}</span>` : ""}</span>` : `<span class="slot-note">${c.texte ? "voir le conseil" : "voir les suggestions ci-dessous"}</span>`}
      </button>`;
    }).join("");
    $("#auto").innerHTML = auto.map(({ slot, top }) => `<div class="auto-row"><span class="auto-slot">${icon(SLOT_ICON[slot] || SLOT_GLYPH[slot] || (slot === "Arme" ? "sword" : slot === "Sort" ? "spell" : "ring"))}${esc(slot)}</span>
      <div class="auto-items">${top.map(({ it, hits }, k) => `<button class="auto-item" data-item="${esc(it.id)}">${k === 0 ? `<span class="medal">1</span>` : ""}${art(it, "sm")}<span><b>${esc(it.nom)}</b><small>${[lvTxt(it).toLowerCase(), it.rarete || "", hits.length ? hits.join(", ") : ""].filter(Boolean).join(" · ")}</small></span>${sdot(it.statut)}</button>`).join("")}</div></div>`).join("")
      || `<p class="muted small">Aucun objet du catalogue ne correspond à cette étape.</p>`;
  }
  function slotDialog(bid, i) {
    const b = BUILDS[bid], s = b.equipement[i];
    const rows = [];
    const best = s.meilleur ? { etape: "Recommandé (fin de partie)", item: s.meilleur } : null;
    if (best) rows.push(best);
    s.etapes.forEach((e) => { if (best && e.item === s.meilleur) { if (e.texte) best.texte = e.texte; } else rows.push(e); });
    openDialog(`<div class="dhead"><span class="art lg empty">${icon(SLOT_ICON[s.emplacement] || "help")}</span><div><h2>${esc(s.emplacement)}</h2><p>${esc(TAGS[bid]?.court || b.nom)} · toutes les options</p></div></div>
      <div class="opt-list">${rows.map((e) => { const it = getItem(e.item); return it
        ? `<button class="opt-row" data-item="${esc(it.id)}">${art(it, "sm")}<div><b>${esc(it.nom)}</b><span>${esc(e.etape)}${e.texte ? " — " + esc(e.texte) : ""}${it.niveau != null ? ` · niv. ${esc(it.niveau)}` : ""}</span></div>${sdot(it.statut)}</button>`
        : `<div class="opt-row static"><span class="art sm empty">${icon("info")}</span><div><b>${esc(e.etape)}</b><span>${esc(e.texte || "")}</span></div></div>`; }).join("")}</div>
      ${(() => { const top = Object.fromEntries(autoPicks(b.style, stage).map((x) => [x.slot, x.top]))[AUTO_SLOT[s.emplacement]] || []; return top.length ? `<h3 style="margin-top:16px">${icon("trophy")} Meilleurs objets du catalogue — étape « ${STAGES.find(([k]) => k === stage)[1]} »</h3>
        <div class="opt-list">${top.map(({ it, hits }) => `<button class="opt-row" data-item="${esc(it.id)}">${art(it, "sm")}<div><b>${esc(it.nom)}</b><span>Suggestion automatique${it.niveau != null ? ` · niv. ${esc(it.niveau)}` : ""}${hits.length ? " · " + esc(hits.join(", ")) : ""}</span></div>${sdot(it.statut)}</button>`).join("")}</div>` : ""; })()}
      ${s.sources?.length ? `<p class="small muted" style="margin-top:12px">Recommandé par : ${srcLinks(s.sources)}</p>` : ""}`);
  }
  const PRIO = { "tres haute": 100, haute: 75, moyenne: 50, "faible a moyenne": 32, faible: 20, inutiles: 4 };
  function viewBuild(id) {
    const b = BUILDS[id];
    if (!b) { app.innerHTML = `<div class="empty">${icon("help")}<p>Build introuvable.</p><a class="btn" href="#builds">Retour aux builds</a></div>`; return; }
    const t = TAGS[id] || {}, c = b.competences;
    const res = (b.ressources || []).filter((r) => SOURCES[r]);
    app.innerHTML = `
      <a class="back" href="#builds">${icon("back")}Tous les builds</a>
      <section class="hero ${styleColor(b.style)}">
        <span class="emblem xl">${icon(styleIcon(b.style))}</span>
        <div style="flex:1;min-width:0">
          <h1>${esc(t.court || b.nom)}</h1>
          <p>${esc(t.accroche || b.role)}</p>
          <div class="tags" style="margin-bottom:12px">${t.portee ? `<span class="tag">${icon(PORTEE[t.portee][0])}${PORTEE[t.portee][1]}</span>` : ""}${(t.modes || []).map((m) => `<span class="tag">${icon(MODE[m][0])}${MODE[m][1]}</span>`).join("")}<span class="tag">${pips(diffLevel(b.difficulte))}&nbsp;${esc(b.difficulte)}</span>${tierBadge(b)}${b.confiance === "editoriale" ? `<span class="tag ed">Expérimental</span>` : ""}</div>
          <div class="btn-row"><button class="btn small" data-share="${b.id}">${icon("link")}Partager</button><a class="btn small" href="#planner=${encodeBuild(fromBuild(b))}">${icon("edit")}Personnaliser</a></div>
        </div>
      </section>

      ${t.enBref ? `<h2>${icon("bolt")}En bref</h2><div class="brief ${styleColor(b.style)}">${t.enBref.map((x, i) => `<div><b>${i + 1}</b>${esc(x)}</div>`).join("")}</div>` : ""}

      <h2>${icon("sword")}Équipement conseillé par les guides</h2>
      <div class="seg" role="group" aria-label="Étape de progression">${STAGES.map(([k, l]) => `<button data-stage="${k}" aria-pressed="${stage === k}">${l}</button>`).join("")}</div>
      <div id="loadout" class="loadout"></div>
      <p class="small muted">Touchez un emplacement pour voir toutes les options et les guides qui les recommandent. ${icon("pin")} = emplacement précis sur la carte. <span class="auto-tag">auto</span> = aucune source ne conseille d'objet à cette étape : meilleur objet du catalogue.</p>

      <h2>${icon("trophy")}Le meilleur du catalogue pour ce style</h2>
      <p class="small muted">Classement automatique parmi les ${D.items.length} objets, selon l'étape choisie au-dessus : niveau, rareté, effets adaptés au style (mots-clés affichés) et fraîcheur des données. C'est une aide au choix, pas un avis de joueur.</p>
      <div id="auto" class="auto"></div>

      <h2>${icon("bolt")}Attributs</h2>
      <div class="card-plain ${styleColor(b.style)}">${b.attributs.map((a) => `<div class="attr"><span class="attr-name">${esc(a.nom)}</span><span class="meter" title="${esc(a.priorite)}"><i style="width:${PRIO[norm(a.priorite)] ?? 50}%"></i></span><small>${esc(a.priorite)}</small></div>`).join("")}</div>

      <h2>${icon("tree")}Compétences</h2>
      ${troncSection(true)}
      <h3>Indispensables pour ce build</h3>
      <div class="chips">${c.essentielles.map((s) => skillChip(s)).join("")}</div>
      ${c.ordre ? `<h3 style="margin-top:14px">Dans quel ordre</h3><div class="path">${c.ordre.map((s) => skillChip(s)).join(icon("arrow", "sep"))}</div>` : ""}
      ${c.optionnelles.length ? `<h3 style="margin-top:14px">En option</h3><div class="chips">${c.optionnelles.map((s) => skillChip(s, "opt")).join("")}</div>` : ""}

      <h2>${icon("compass")}Selon la situation</h2>
      <div class="ctx ${styleColor(b.style)}">${b.contextes.map((x) => `<div>${icon(CTX_ICON[x.nom] || "info")}<span><strong>${esc(x.nom)}</strong>${esc(x.texte)}</span></div>`).join("")}</div>

      ${res.length ? `<h2>${icon("video")}Pour approfondir</h2><div class="res-list">${res.map((r) => { const s = SOURCES[r]; return `<a class="res" href="${esc(s.url)}" target="_blank" rel="noopener">${icon(s.type === "video" ? "video" : "book")}<span><b>${esc(s.nom)}</b><small>${s.miseAJourSource ? fmtDate(s.miseAJourSource) + " · " : ""}${esc(s.type === "video" ? "Vidéo (non analysée, titre et date seulement)" : s.type)}</small></span>${icon("external")}</a>`; }).join("")}</div>` : ""}

      <details class="more"><summary>${icon("book")}Pour aller plus loin</summary><div>
        <h3>Comment le jouer</h3><p>${esc(b.jeu)}</p>
        <h3>Ce qui marche bien ensemble</h3><ul class="tight">${b.synergies.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
        <h3>Rôle et prérequis</h3><p>${esc(b.role)}</p><p>${esc(b.prerequis)}</p>
        ${c.note ? `<p class="muted">${esc(c.note)}</p>` : ""}
        <h3>Sources</h3><p>${srcLinks(b.sources)}</p>
        <p class="muted">Ce build est un conseil éditorial, pas une donnée du jeu.</p>
      </div></details>`;
    renderLoadout(b);
  }

  // ── Mon build
  const PLANNER_SLOTS = [["arme", "Arme", "sword", (i) => i.categorie === "arme"], ["second", "Main secondaire", "shield", (i) => i.categorie === "bouclier"],
    ["sort", "Sort", "spell", (i) => i.categorie === "sort"], ["tete", "Tête", "helmet", (i) => i.categorie === "armure" && i.emplacement === "Tête"],
    ["torse", "Torse", "armor", (i) => (i.categorie === "armure" && i.emplacement === "Torse") || (i.categorie === "armure" && !i.emplacement)],
    ["mains", "Mains", "gloves", (i) => i.categorie === "armure" && i.emplacement === "Mains"], ["jambes", "Jambes", "pants", (i) => i.categorie === "armure" && i.emplacement === "Jambes"],
    ["pieds", "Pieds", "boots", (i) => i.categorie === "armure" && i.emplacement === "Pieds"], ["anneau", "Anneau", "ring", (i) => i.categorie === "anneau"]];
  function encodeBuild(o) { return encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(o))))); }
  function decodeBuild(s) { try { return JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(s))))); } catch { return null; } }
  function fromBuild(b) {
    const gear = {};
    PLANNER_SLOTS.forEach(([k, , , pred]) => { gear[k] = b.equipement.map((s) => s.meilleur).map(getItem).find((it) => it && pred(it))?.id || ""; });
    return { nom: (TAGS[b.id]?.court || b.nom) + " (perso)", style: b.style, gear, skills: [...new Set([...(b.competences.ordre || []), ...b.competences.essentielles])].filter((s) => SKILLS[s]), notes: "" };
  }
  function viewPlanner(encoded) {
    const decoded = encoded ? decodeBuild(encoded) : null;
    if (encoded && !decoded) toast("Lien de build invalide");
    const p = decoded || { nom: "", style: "", gear: {}, skills: [], notes: "" };
    if (p.gear.armure && !p.gear.torse) p.gear.torse = p.gear.armure;
    const cost = () => p.skills.reduce((a, s) => a + (SKILLS[s]?.cout || 0), 0);
    app.innerHTML = `
      <a class="back" href="#builds">${icon("back")}Builds</a>
      <h1>Mon build</h1>
      <p class="lead">Choisissez votre équipement et vos compétences, puis enregistrez ou partagez.</p>
      <form id="planner" onsubmit="return false">
        <div class="panel">
          <label class="field">Nom du build<input name="nom" value="${esc(p.nom)}" maxlength="60" placeholder="ex. Mon mage de feu"></label>
          <label class="field">Style<select name="style"><option value="">—</option>${D.styles.map((s) => `<option value="${s.id}" ${p.style === s.id ? "selected" : ""}>${esc(s.nom)}</option>`).join("")}</select></label>
        </div>
        <h2>${icon("sword")}Équipement</h2>
        <div class="pl-slots">${PLANNER_SLOTS.map(([k, label, ic, pred]) => `<div class="pl-slot"><span data-art="${k}"></span>
          <label class="field">${label}<select name="gear-${k}"><option value="">—</option>${D.items.filter(pred).sort((a, b) => a.nom.localeCompare(b.nom)).map((i) => `<option value="${i.id}" ${getItem(p.gear[k])?.id === i.id ? "selected" : ""}>${esc(i.nom)}${i.niveau != null ? " (" + i.niveau + ")" : ""}</option>`).join("")}</select></label></div>`).join("")}</div>
        <h2>${icon("tree")}Compétences <span id="cost" class="tag hot"></span></h2>
        <div class="bar"><div class="searchbox">${icon("search")}<input id="sk-filter" type="search" placeholder="Filtrer les compétences…"></div><button class="btn" type="button" id="pl-tronc">${icon("star")}Ajouter le tronc commun</button></div>
        <div class="sk-pick" id="sk-pick">${D.skills.map((s) => `<button type="button" class="sk ${treeColor(s.arbre)}" data-pick="${s.id}" aria-pressed="${p.skills.includes(s.id)}" data-name="${esc(norm(s.nom + " " + s.arbre))}">${icon(TREE_UI[s.arbre]?.[0] || "flame")}${esc(s.nom)} <span class="muted">${s.cout ?? "?"}</span></button>`).join("")}</div>
        <label class="field" style="margin-top:14px">Notes<textarea name="notes" rows="2" maxlength="500">${esc(p.notes)}</textarea></label>
        <div class="btn-row" style="margin-top:14px"><button class="btn primary" id="pl-save" type="button">${icon("save")}Enregistrer</button><button class="btn" id="pl-share" type="button">${icon("link")}Copier le lien</button></div>
        <p class="small muted">Coûts d'un rang par compétence, d'après le wiki (peut-être avant 1.0). Maximum en 1.0 : ${D.skillMeta.pointsTotal} points.</p>
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
    $("#pl-tronc").addEventListener("click", () => { troncIds().forEach((id) => { const el = $(`#sk-pick [data-pick="${id}"]`); if (el) el.setAttribute("aria-pressed", "true"); }); read(); toast("Tronc commun ajouté"); });
    $("#sk-filter").addEventListener("input", (e) => { const q = norm(e.target.value); $$("#sk-pick [data-pick]").forEach((l) => { l.style.display = l.dataset.name.includes(q) ? "" : "none"; }); });
    $("#pl-save").addEventListener("click", () => {
      read(); const mine = store.get("ens.myBuilds", []);
      const idx = p.nom ? mine.findIndex((m) => m.nom === p.nom) : -1;
      if (idx >= 0) mine[idx] = p; else mine.push(p);
      toast(store.set("ens.myBuilds", mine) ? "Build enregistré" : "Stockage indisponible : utilisez le lien");
    });
    $("#pl-share").addEventListener("click", () => { read(); const url = location.href.split("#")[0] + "#planner=" + encodeBuild(p); history.replaceState(null, "", url); copy(url, "Lien copié"); });
  }

  // ════════════ ÉQUIPEMENTS ════════════
  const DEFAULT_EQ = { q: "", cat: "", sub: "", style: "", rar: "", st: "", lvmin: "", lvmax: "", carte: "", sort: "niveau-desc" };
  const eq = Object.assign({}, DEFAULT_EQ, store.get("ens.eq3", {}));
  let filtersOpen = false, eqLimit = 60;
  function viewEquipements() {
    const advCount = ["style", "rar", "st", "lvmin", "lvmax", "carte"].filter((k) => eq[k] !== "").length;
    eqLimit = 60;
    app.innerHTML = `
      <h1>Équipements</h1>
      <p class="lead">${D.items.length} objets. Touchez-en un pour sa fiche : le cadre indique la rareté, la pastille la fiabilité.</p>
      <div class="chips scroll" role="group" aria-label="Catégorie">
        <button class="chip" data-cat="" aria-pressed="${!eq.cat}">${icon("grid")}Tout</button>
        ${Object.entries(CAT).map(([k, [l, ic]]) => `<button class="chip" data-cat="${k}" aria-pressed="${eq.cat === k}">${icon(ic)}${l}</button>`).join("")}
      </div>
      ${eq.cat === "arme" ? `<div class="chips scroll" style="margin-top:8px" role="group" aria-label="Type d'arme"><button class="chip small" data-sub="" aria-pressed="${!eq.sub}">Toutes</button>${WEAPON_SUB.map(([k, l]) => `<button class="chip small" data-sub="${k}" aria-pressed="${eq.sub === k}">${icon(k)}${l}</button>`).join("")}</div>` : ""}
      ${eq.cat === "armure" ? `<div class="chips scroll" style="margin-top:8px" role="group" aria-label="Emplacement"><button class="chip small" data-sub="" aria-pressed="${!eq.sub}">Tous</button>${ARMOR_SUB.map(([k, ic]) => `<button class="chip small" data-sub="${k}" aria-pressed="${eq.sub === k}">${icon(ic)}${k}</button>`).join("")}</div>` : ""}
      <div class="bar">
        <div class="searchbox">${icon("search")}<input id="eq-q" type="search" value="${esc(eq.q)}" placeholder="Nom, atout, effet ou lieu…" aria-label="Rechercher"></div>
        <button class="btn" id="eq-toggle" aria-expanded="${filtersOpen}">${icon("sliders")}Filtres${advCount ? ` <span class="count">${advCount}</span>` : ""}</button>
      </div>
      <div class="panel" id="eq-panel" ${filtersOpen ? "" : "hidden"}>
        <label class="field">Pour quel build ?<select name="style"><option value="">Tous</option>${D.styles.map((s) => `<option value="${s.id}">${esc(s.nom)}</option>`).join("")}</select></label>
        <label class="field">Rareté<select name="rar"><option value="">Toutes</option><option value="1">Commune</option><option value="2">Peu commune</option><option value="3">Rare</option><option value="4">Épique</option><option value="5">Légendaire</option></select></label>
        <label class="field">Fiabilité<select name="st"><option value="">Toutes</option>${ITEM_ST.map((s) => `<option value="${s}">${STATUS[s].label}</option>`).join("")}</select></label>
        <label class="field">Sur la carte<select name="carte"><option value="">Peu importe</option><option value="pin">Emplacement précis</option><option value="zone">Précis ou région</option></select></label>
        <label class="field">Niveau min<input type="number" name="lvmin" min="0" max="55" value="${esc(eq.lvmin)}"></label>
        <label class="field">Niveau max<input type="number" name="lvmax" min="0" max="55" value="${esc(eq.lvmax)}"></label>
        <label class="field">Trier par<select name="sort"><option value="niveau-desc">Niveau ↓</option><option value="niveau-asc">Niveau ↑</option><option value="armure-desc">Armure totale</option><option value="degats-desc">Dégâts</option><option value="parade-desc">Parade</option><option value="blocage-desc">Blocage</option><option value="rarete-desc">Rareté</option><option value="nom-asc">Nom</option></select></label>
        <div class="field wide" style="flex-direction:row;justify-content:flex-end"><button class="btn small" id="eq-reset">${icon("refresh")}Tout réinitialiser</button></div>
      </div>
      <div class="result-line"><span id="eq-count"></span></div>
      <div id="eq-list" class="igrid"></div>
      <div id="eq-more" style="text-align:center;margin-top:14px"></div>
      <details class="more"><summary>${icon("info")}Ce qui manque encore</summary><div><ul class="tight">${D.lacunes.map((l) => `<li>${esc(l)}</li>`).join("")}</ul></div></details>`;
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
      if (q) { const hay = norm([it.nom, it.type, it.obtention, it.obtentionEn, it.description, ...(it.atouts || []), ...(it.effets || [])].join(" ")); if (!q.split(/\s+/).every((w) => hay.includes(w))) return false; }
      return true;
    });
    const [key, dir] = s.sort.split("-");
    const val = (it) => key === "niveau" ? (levelRange(lvOf(it))?.[1] ?? -1) : key === "rarete" ? rarRank(it.rarete) : key === "nom" ? it.nom
      : key === "armure" ? ((it.stats?.armurePhys || 0) + (it.stats?.armureMag || 0)) || -1 : (typeof it.stats?.[key] === "number" ? it.stats[key] : -1);
    return out.sort((a, b) => { const va = val(a), vb = val(b); const r = typeof va === "string" ? va.localeCompare(vb) : va - vb; return (dir === "desc" ? -r : r) || a.nom.localeCompare(b.nom); });
  }
  const itemTile = (it) => `<article class="itile r-${rarKey(it.rarete)}">
      <button class="itile-main" data-item="${esc(it.id)}">${art(it, "lg")}<span class="iname">${esc(it.nom)}</span>
        <span class="isub">${[esc(lvTxt(it)), it.rarete ? `<span class="rar-txt">${esc(it.rarete)}</span>` : esc(it.type || "")].filter(Boolean).join(" · ")}</span>${keyStat(it)}</button>
      ${sdot(it.statut)}
      ${hasMapPin(it) ? `<a class="pin-btn" href="#carte/item/${encodeURIComponent(it.id)}" title="Voir sur la carte" aria-label="Voir ${esc(it.nom)} sur la carte">${icon("pin")}</a>` : ""}
      <button class="cmp-btn" data-cmp="${esc(it.id)}" aria-pressed="${compare.includes(it.id)}" title="Comparer" aria-label="Comparer ${esc(it.nom)}">${icon("compare")}</button>
    </article>`;
  function renderEqList() {
    const list = filterItems(eq);
    $("#eq-count").textContent = `${list.length} objet${list.length > 1 ? "s" : ""}`;
    $("#eq-list").innerHTML = list.slice(0, eqLimit).map(itemTile).join("") || `<div class="empty" style="grid-column:1/-1">${icon("search")}<p>Aucun objet ne correspond.</p><button class="btn small" id="eq-reset2">Réinitialiser</button></div>`;
    $("#eq-more").innerHTML = list.length > eqLimit ? `<button class="btn" id="eq-more-btn">Afficher plus (${list.length - eqLimit} restants)</button>` : "";
    $("#eq-more-btn")?.addEventListener("click", () => { eqLimit += 60; renderEqList(); });
    $("#eq-reset2")?.addEventListener("click", () => { Object.assign(eq, DEFAULT_EQ); store.set("ens.eq3", eq); viewEquipements(); });
  }

  // ════════════ CARTE ════════════
  let mapMode = "objets", leaflet = null;
  const GROUP_DEFAULT = ["Ancient_Spire", "Elixir_Well", "Shroud_Root", "Hollow_Halls", "Shroud_Lair"];
  const mapLayers = new Set(store.get("ens.mapLayers", GROUP_DEFAULT));
  const mapItems = () => D.items.filter((it) => hasMapPin(it));
  const regionItems = (r) => D.items.filter((it) => !hasMapPin(it) && regionOf(it) === r && it.obtention && !/fabrication|craft/i.test(it.obtention));
  function viewCarte(focus) {
    const pins = mapItems();
    app.innerHTML = `
      <h1>Carte</h1>
      <div class="seg" role="group" aria-label="Type de carte">
        <button data-mapmode="objets" aria-pressed="${mapMode === "objets"}">${icon("pin")} Où trouver les objets</button>
        <button data-mapmode="complete" aria-pressed="${mapMode === "complete"}">${icon("map")} Carte 1.0 complète</button>
      </div>
      ${mapMode === "objets" ? `
        <div class="fresh" style="margin:10px 0">${icon("info")}<span>Fond de carte du wiki (rendu du jeu, nov. 2025) : <b>Cinder's Cradle (1.0) n'y figure pas</b>. Pour cette zone, utilisez « Carte 1.0 complète ».</span></div>
        <div class="map-layout">
          <div class="map-wrap"><div id="leaflet" class="leaflet-box"></div></div>
          <aside class="map-side">
            <div class="searchbox">${icon("search")}<input id="map-q" type="search" placeholder="Chercher un objet ou un lieu…" aria-label="Chercher sur la carte"></div>
            <div class="layer-list cons-layers">${CLAYERS.map(([k, label, ic, n]) => `<label class="layer"><input type="checkbox" data-clayer="${k}" ${cLayers.has(k) ? "checked" : ""}><span class="clayer-ic c-${k}">${icon(ic)}</span>${label} <span class="muted">${n()}</span></label>`).join("")}</div>
            <details class="more" style="margin-top:10px"><summary>${icon("layers")}Lieux affichés</summary><div class="layer-list">
              ${Object.entries(MAP.groupes).map(([g, info]) => `<label class="layer"><input type="checkbox" data-layer="${g}" ${mapLayers.has(g) ? "checked" : ""}>${info.icone ? `<img src="${esc(info.icone)}" alt="">` : icon("pin")}${esc(info.nom)} <span class="muted">${MAP.marqueurs.filter((m) => m.g === g).length}</span></label>`).join("")}
            </div></details>
            <h3 style="margin-top:14px">${icon("pin")} Emplacement précis <span class="muted">(${pins.length})</span></h3>
            <div id="map-list" class="map-list"></div>
            <h3 style="margin-top:14px">${icon("compass")} Par région</h3>
            <p class="small muted">Objets dont le wiki ne donne que la région : la carte centre la zone, sans point exact.</p>
            <div class="chips">${REGIONS.map((r) => { const n = regionItems(r).length, z = ZONES.find((x) => x.nom === r.nom); return n ? `<button class="chip small" data-region="${esc(r.nom)}">${esc(r.nom)}${z ? ` <span class="muted">niv. ${esc(z.niveau)}</span>` : ""} <span class="count">${n}</span></button>` : ""; }).join("")}</div>
            <div id="region-list" class="map-list" style="margin-top:8px"></div>
          </aside>
        </div>
        <p class="small muted">Source : <a href="${esc(MAP.source)}" target="_blank" rel="noopener">carte du wiki</a> (marqueurs mis à jour le ${fmtDate(MAP.marqueursDate)}). Emplacements d'objets : liens de carte et lieux cités sur les pages du wiki.</p>`
      : `
        <div class="fresh" style="margin:10px 0">${icon("info")}<span>Carte communautaire intégrée (AllThings.How), qui inclut Cinder's Cradle. Ce n'est pas une carte officielle : Keen Games ne publie pas de carte interactive.</span></div>
        <div class="iframe-box"><iframe src="https://allthings.how/enshrouded/map/" title="Carte interactive Enshrouded (AllThings.How)" loading="lazy" referrerpolicy="no-referrer"></iframe></div>
        <div class="btn-row" style="margin-top:10px">
          <a class="btn" href="https://enshrouded.th.gl/" target="_blank" rel="noopener">${icon("external")}The Hidden Gaming Lair (1.0, données du jeu)</a>
          <a class="btn" href="https://mapgenie.io/enshrouded/maps/embervale" target="_blank" rel="noopener">${icon("external")}Map Genie</a>
          <a class="btn" href="https://enshrouded.wiki.gg/wiki/Map" target="_blank" rel="noopener">${icon("external")}Carte du wiki</a>
        </div>
        <p class="small muted">Ces cartes refusent l'intégration dans une autre page : elles s'ouvrent dans un nouvel onglet.</p>`}`;
    if (mapMode === "objets") initLeaflet(focus);
  }
  // Couches de l'onglet Construction
  const CONS = D.construction || { blocs: [], survivants: [], emplacements: [] };
  const consPinned = (list) => list.filter((x) => (x.marqueurs || []).some((id) => MARKERS[id]));
  const CLAYERS = [
    ["blocs", "Blocs de construction", "block", () => consPinned(CONS.blocs).length],
    ["artisans", "Artisans à sauver", "users", () => consPinned(CONS.survivants).length],
    ["bases", "Lieux de base conseillés", "home", () => consPinned(CONS.emplacements).length]
  ];
  const cLayers = new Set(store.get("ens.cLayers", ["blocs", "artisans"]));
  function initLeaflet(focus) {
    const box = $("#leaflet");
    if (!window.L) { box.innerHTML = `<div class="empty">${icon("alert")}<p>La bibliothèque de carte (Leaflet) n'a pas pu être chargée : une connexion Internet est nécessaire la première fois.</p></div>`; return; }
    const L = window.L, S = MAP.taille, T = MAP.tuile;
    const map = L.map(box, { crs: L.CRS.Simple, minZoom: -4, maxZoom: 1, zoomSnap: 0.5, attributionControl: false, maxBounds: [[-1000, -1000], [S + 1000, S + 1000]] });
    MAP.tuiles.forEach((t) => L.imageOverlay(`images/map/tiles/${t.f}.jpg`, [[t.y * T - 2, t.x * T - 2], [(t.y + 1) * T + 2, (t.x + 1) * T + 2]]).addTo(map));
    map.fitBounds([[0, 0], [S, S]]);
    const layer = {};
    Object.entries(MAP.groupes).forEach(([g, info]) => {
      layer[g] = L.layerGroup(MAP.marqueurs.filter((m) => m.g === g).map((m) => L.marker([m.y, m.x], {
        icon: L.divIcon({ className: "poi", html: info.icone ? `<img src="${esc(info.icone)}" alt="">` : `<span class="poi-gen">${icon("pin")}</span>`, iconSize: [26, 26] }), title: m.nom
      }).bindPopup(`<b>${esc(m.nom)}</b><br><span class="muted">${esc(info.nom)}</span>${m.desc ? `<br>${esc(m.desc)}` : ""}`)));
      if (mapLayers.has(g)) layer[g].addTo(map);
    });
    const itemMarkers = {};
    const itemLayer = L.layerGroup().addTo(map);
    mapItems().forEach((it) => {
      itemMarkers[it.id] = it.marqueurs.filter((id) => MARKERS[id]).map((id) => {
        const m = MARKERS[id];
        return L.marker([m.y, m.x], { icon: L.divIcon({ className: "item-pin r-" + rarKey(it.rarete), html: art(it, "pin"), iconSize: [40, 40], iconAnchor: [20, 20] }), title: it.nom, zIndexOffset: 500 })
          .bindPopup(`<div class="pop">${art(it, "sm")}<div><b>${esc(it.nom)}</b><br><span>${esc(m.nom)}</span><br><button class="btn small" data-item="${esc(it.id)}">Voir la fiche</button></div></div>`)
          .addTo(itemLayer);
      });
    });
    // Couches Construction
    const cLayer = {}, cMarkers = {};
    const consPin = (kind, ic, title, html, id) => (mid) => {
      const m = MARKERS[mid];
      const mk = L.marker([m.y, m.x], { icon: L.divIcon({ className: "cons-pin c-" + kind, html: `<span>${icon(ic)}</span>`, iconSize: [30, 30], iconAnchor: [15, 15] }), title, zIndexOffset: 400 })
        .bindPopup(`<div class="pop-cons"><b>${esc(title)}</b><br><span class="muted">${esc(m.nom)}</span>${html}</div>`);
      (cMarkers[id] ||= []).push(mk);
      return mk;
    };
    cLayer.blocs = L.layerGroup(CONS.blocs.flatMap((b, i) => (b.marqueurs || []).filter((id) => MARKERS[id]).map(consPin("blocs", "block", b.nom, `<br>${esc(b.recette)}<br><small>${esc(b.lieu || "")}</small><br><a class="btn small" href="#construction/blocs">Tous les blocs</a>`, "bloc-" + i))));
    cLayer.artisans = L.layerGroup(CONS.survivants.flatMap((s, i) => (s.marqueurs || []).filter((id) => MARKERS[id]).map(consPin("artisans", "users", `${s.nom} (${s.role})`, `<br><small>${esc(s.debloque)}</small>`, "artisan-" + i))));
    cLayer.bases = L.layerGroup(CONS.emplacements.flatMap((s, i) => (s.marqueurs || []).filter((id) => MARKERS[id]).map(consPin("bases", "home", s.nom, `<br><small>${esc(s.etape)} · ${esc(s.pourquoi)}</small>`, "base-" + i))));
    Object.entries(cLayer).forEach(([k, l]) => { if (cLayers.has(k)) l.addTo(map); });
    let regionCircle = null;
    leaflet = {
      focusCons(id) {
        const kind = id.split("-")[0], k = kind === "bloc" ? "blocs" : kind === "artisan" ? "artisans" : "bases";
        if (!cLayers.has(k)) { cLayers.add(k); cLayer[k].addTo(map); const cb = $(`[data-clayer="${k}"]`); if (cb) cb.checked = true; }
        const ms = cMarkers[id]; if (!ms?.length) return;
        map.flyTo(ms[0].getLatLng(), 0, { duration: .6 }); setTimeout(() => ms[0].openPopup(), 650);
      },
      ctoggle(k, on) { on ? cLayer[k].addTo(map) : cLayer[k].remove(); },
      map,
      focusItem(id) {
        const it = getItem(id); if (!it) return;
        const ms = itemMarkers[it.id];
        if (ms?.length) { map.flyTo(ms[0].getLatLng(), 0, { duration: .6 }); setTimeout(() => ms[0].openPopup(), 650); return; }
        const r = regionOf(it); if (r) this.focusRegion(r.nom, it.id);
      },
      focusRegion(name, highlight) {
        const r = REGIONS.find((x) => x.nom === name); if (!r) return;
        if (regionCircle) regionCircle.remove();
        regionCircle = L.circle([r.y, r.x], { radius: 1100, color: "#f2913d", weight: 2, fillOpacity: .08, dashArray: "6 6" }).addTo(map).bindTooltip(`${r.nom} (zone approximative)`, { permanent: true, direction: "top" });
        map.flyTo([r.y, r.x], -2, { duration: .6 });
        const list = regionItems(r);
        $("#region-list").innerHTML = list.map((it) => `<button class="map-row ${it.id === highlight ? "hl" : ""}" data-item="${esc(it.id)}">${art(it, "xs")}<span><b>${esc(it.nom)}</b><small>${esc(it.obtention || "")}</small></span></button>`).join("");
      },
      toggle(g, on) { on ? layer[g].addTo(map) : layer[g].remove(); }
    };
    const renderList = (q = "") => {
      const nq = norm(q);
      const list = mapItems().filter((it) => !nq || norm(it.nom + " " + it.marqueurs.map((id) => MARKERS[id]?.nom).join(" ")).includes(nq));
      $("#map-list").innerHTML = list.map((it) => `<button class="map-row" data-mapfocus="${esc(it.id)}">${art(it, "xs")}<span><b>${esc(it.nom)}</b><small>${esc(it.marqueurs.map((id) => MARKERS[id]?.nom).filter(Boolean).join(", "))}</small></span></button>`).join("") || `<p class="small muted">Aucun objet.</p>`;
      if (nq) {
        const poi = MAP.marqueurs.find((m) => norm(m.nom).includes(nq));
        if (!list.length && poi) map.flyTo([poi.y, poi.x], -1, { duration: .5 });
      }
    };
    renderList();
    $("#map-q").addEventListener("input", (e) => renderList(e.target.value));
    setTimeout(() => { map.invalidateSize(); if (focus?.item) leaflet.focusItem(focus.item); if (focus?.region) leaflet.focusRegion(focus.region); if (focus?.cons) leaflet.focusCons(focus.cons); }, 80);
  }

  // ════════════ CONSTRUCTION ════════════
  const cons = { cat: "", mode: "", q: "" };
  const CTABS = [["batiments", "Bâtiments", "home"], ["blocs", "Blocs", "block"], ["emplacements", "Où bâtir", "compass"], ["autel", "Autel & confort", "flame"], ["artisans", "Artisans", "users"], ["videos", "Vidéos", "video"]];
  const BCAT = { Bois: ["Bois", "c-rng"], Pierre: ["Pierre", "c-base"], Lumineux: ["Lumineux", "c-mag"], "Métal et autres": ["Métal et autres", "c-war"] };
  const BMODE = { ramassage: ["Se débloque en ramassant le matériau", "leaf"], fabrication: ["Se débloque en fabriquant le matériau", "hammer"], lieu: ["À trouver dans le monde", "pin"] };
  const pinnedBloc = (b) => (b.marqueurs || []).some((id) => MARKERS[id]);
  function viewConstruction(tab) {
    if (!CONS.blocs.length) { app.innerHTML = `<div class="empty">${icon("alert")}<p>Données de construction absentes.</p></div>`; return; }
    tab = CTABS.some(([k]) => k === tab) ? tab : "batiments";
    const nLieu = CONS.blocs.filter((b) => b.mode === "lieu").length, nPin = CONS.blocs.filter(pinnedBloc).length;
    app.innerHTML = `
      <h1>Construction</h1>
      <p class="lead">Des idées de bâtiments pour votre base, tous les blocs et où les débloquer, et les règles de l'autel et du confort.</p>
      <div class="facts">
        <div class="fact"><b>${CONS.blocs.length}</b><span>blocs de construction (wiki, 1.0)</span></div>
        <div class="fact"><b>${nLieu}</b><span>à trouver dans le monde, dont ${nPin} épinglés sur la carte</span></div>
        <div class="fact"><b>${CONS.batiments.length}</b><span>idées de bâtiments pas à pas</span></div>
      </div>
      <div class="chips scroll" role="group" aria-label="Rubrique" style="margin-top:14px">${CTABS.map(([k, l, ic]) => `<button class="chip" data-ctab="${k}" aria-pressed="${tab === k}">${icon(ic)}${l}</button>`).join("")}</div>
      <div id="cons-body"></div>`;
    const body = $("#cons-body");
    if (tab === "batiments") body.innerHTML = `
      <p class="small muted">Conseils repris de guides et de vidéos 1.0 (sources sur chaque carte). Touchez « Voir les étapes ».</p>
      <div class="bgrid">${CONS.batiments.map((b) => `<article class="bld">
        <div class="bld-top"><span class="emblem c-base">${icon(b.icone)}</span><div><h3>${esc(b.nom)}</h3><div class="tags"><span class="tag hot">${esc(b.etape)}</span>${b.taille ? `<span class="tag">${esc(b.taille)}</span>` : ""}</div></div></div>
        <p>${esc(b.resume)}</p>
        <details class="more"><summary>${icon("arrow")}Voir les étapes</summary><div>
          <ol class="bld-steps">${b.etapes.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
          ${b.astuces.length ? `<h3>Astuces</h3><ul class="tight">${b.astuces.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>` : ""}
        </div></details>
        <div class="chips small-chips">${b.materiaux.map((m) => `<span class="perk">${esc(m)}</span>`).join("")}</div>
        <div class="bld-foot">${srcChips(b.sources)}${b.video && SOURCES[b.video] ? `<a class="btn small" href="${esc(SOURCES[b.video].url)}" target="_blank" rel="noopener">${icon("video")}Vidéo</a>` : ""}</div>
      </article>`).join("")}</div>`;
    else if (tab === "blocs") { body.innerHTML = `
      <div class="chips scroll" style="margin-top:6px"><button class="chip" data-bcat="" aria-pressed="${!cons.cat}">${icon("grid")}Tous</button>${Object.entries(BCAT).map(([k, [l, c]]) => `<button class="chip ${c}" data-bcat="${k}" aria-pressed="${cons.cat === k}">${icon("block")}${l}</button>`).join("")}</div>
      <div class="chips scroll" style="margin-top:8px"><button class="chip small" data-bmode="" aria-pressed="${!cons.mode}">Tous les déblocages</button>${Object.entries(BMODE).map(([k, [l, ic]]) => `<button class="chip small" data-bmode="${k}" aria-pressed="${cons.mode === k}">${icon(ic)}${l}</button>`).join("")}</div>
      <div class="bar"><div class="searchbox">${icon("search")}<input id="bloc-q" type="search" value="${esc(cons.q)}" placeholder="Nom, matériau, lieu, région…" aria-label="Chercher un bloc"></div>
        <a class="btn" href="#carte">${icon("map")}Voir sur la carte</a></div>
      <div class="result-line"><span id="bloc-count"></span></div>
      <div id="bloc-list" class="blgrid"></div>
      <p class="small muted">${esc(CONS.blocsNote)} Sources : ${srcLinks(CONS.blocsSources)}</p>`;
      $("#bloc-q").addEventListener("input", (e) => { cons.q = e.target.value; renderBlocs(); });
      renderBlocs(); }
    else if (tab === "emplacements") body.innerHTML = `
      <p class="small muted">Emplacements conseillés par les guides. ${icon("pin")} = visible sur la carte (couche « Lieux de base conseillés »).</p>
      <div class="loc-list">${CONS.emplacements.map((s, i) => `<div class="loc">
        <span class="tag hot">${esc(s.etape)}</span><div><b>${esc(s.nom)}</b> <span class="muted small">· ${esc(s.region)}${ZONES.find((z) => z.nom === s.region) ? " (niv. " + esc(ZONES.find((z) => z.nom === s.region).niveau) + ")" : ""}</span><p>${esc(s.pourquoi)}</p><div class="tronc-src">${srcChips(s.sources)}</div></div>
        ${(s.marqueurs || []).some((id) => MARKERS[id]) ? `<a class="btn small" href="#carte/cons/base-${i}">${icon("pin")}Carte</a>` : ""}</div>`).join("")}</div>`;
    else if (tab === "autel") body.innerHTML = `
      <h2>${icon("flame")}Autel de la Flamme</h2>
      <div class="table-wrap"><table><thead><tr><th>Niveau</th><th>Zone constructible</th><th>Coût</th><th>Flamme requise</th></tr></thead><tbody>
        ${CONS.autel.niveaux.map((n) => `<tr><td><b>${n.niveau}</b></td><td>${esc(n.zone)}</td><td>${esc(n.cout)}</td><td>${n.flamme}</td></tr>`).join("")}</tbody></table></div>
      <p class="small">${esc(CONS.autel.capacite)}</p>
      <ul class="tight small">${CONS.autel.regles.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
      <p class="small muted">Source : ${srcLinks(CONS.autel.sources)}</p>
      <h2>${icon("heart")}Confort et bonus Reposé</h2>
      <ul class="tight">${CONS.confort.regles.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
      <h3>Exemples d'objets de confort</h3>
      <div class="table-wrap"><table><thead><tr><th>Objet</th><th>Confort</th></tr></thead><tbody>${CONS.confort.exemples.map((x) => `<tr><td>${esc(x.objet)}</td><td><b>+${x.confort}</b></td></tr>`).join("")}</tbody></table></div>
      <p class="small muted">Valeurs observées en jeu selon le wiki. Sources : ${srcLinks(CONS.confort.sources)}</p>`;
    else if (tab === "artisans") body.innerHTML = `
      <p class="small muted">${esc(CONS.survivantsNote)}</p>
      <div class="bgrid">${CONS.survivants.map((s, i) => `<article class="bld"><div class="bld-top"><span class="emblem c-mag">${icon("users")}</span><div><h3>${esc(s.nom)}</h3><div class="tags"><span class="tag">${esc(s.role)}</span></div></div></div>
        <p>${esc(s.debloque)}</p><div class="bld-foot">${(s.marqueurs || []).some((id) => MARKERS[id]) ? `<a class="btn small" href="#carte/cons/artisan-${i}">${icon("pin")}Où le sauver</a>` : ""}</div></article>`).join("")}</div>
      <p class="small muted">Sources : ${srcLinks(CONS.survivantsSources)}</p>`;
    else if (tab === "videos") body.innerHTML = `
      <p class="small muted">Tutoriels YouTube 1.0. Seule la première vidéo a été résumée (chapitres repris par AllThings.How) ; les autres sont listées avec leur titre et leur date.</p>
      <div class="res-list">${CONS.videos.map((v) => { const s = SOURCES[v.id]; if (!s) return ""; return `<div class="res vid"><span class="vid-ic">${icon("video")}</span><span><b>${esc(s.nom.replace(/^YouTube — /, ""))}</b><small>${s.miseAJourSource ? fmtDate(s.miseAJourSource) + " · " : ""}${esc(s.note)}</small>
        ${v.chapitres ? `<span class="chaps">${v.chapitres.map(([t, l]) => { const p = t.split(":").map(Number); return `<a href="${esc(s.url)}&t=${p[0] * 60 + p[1]}s" target="_blank" rel="noopener">${t} ${esc(l)}</a>`; }).join("")}</span>` : ""}</span>
        <a class="btn small" href="${esc(s.url)}" target="_blank" rel="noopener">${icon("external")}Regarder</a></div>`; }).join("")}</div>`;
  }
  function renderBlocs() {
    const q = norm(cons.q).trim();
    $$("[data-bcat]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.bcat === cons.cat));
    $$("[data-bmode]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.bmode === cons.mode));
    const list = CONS.blocs.map((b, i) => [b, i]).filter(([b]) => (!cons.cat || b.cat === cons.cat) && (!cons.mode || b.mode === cons.mode)
      && (!q || q.split(/\s+/).every((w) => norm([b.nom, b.recette, b.lieu, b.region, b.quete].join(" ")).includes(w))));
    $("#bloc-count").textContent = `${list.length} bloc${list.length > 1 ? "s" : ""}`;
    $("#bloc-list").innerHTML = list.map(([b, i]) => `<article class="bl ${BCAT[b.cat]?.[1] || ""}">
      <span class="bl-ic">${icon("block")}<span class="bl-mono">${esc(initials(b.nom))}</span></span>
      <div class="bl-body"><b>${esc(b.nom)}</b>
        <small>${icon("hammer")}${esc(b.recette)}</small>
        <small>${icon(BMODE[b.mode][1])}${esc(b.mode === "ramassage" ? "Ramasser le matériau" : b.mode === "fabrication" ? (b.lieu || "Fabriquer le matériau") : (b.lieu || "Lieu non documenté"))}</small>
        ${b.quete ? `<small class="muted">Quête associée : « ${esc(b.quete)} »</small>` : ""}
        ${b.conflit ? `<small class="conflict">${icon("alert")}${esc(b.conflit)}</small>` : ""}
        <span class="tag">${esc(b.region)}</span></div>
      ${pinnedBloc(b) ? `<a class="pin-btn bl-pin" href="#carte/cons/bloc-${i}" title="Voir sur la carte" aria-label="Voir ${esc(b.nom)} sur la carte">${icon("pin")}</a>` : ""}
    </article>`).join("") || `<div class="empty" style="grid-column:1/-1">${icon("search")}<p>Aucun bloc ne correspond.</p></div>`;
  }

  // ════════════ COMPÉTENCES ════════════
  const sk = { q: "", arbre: "", build: "" };
  function viewCompetences() {
    const R = D.skillRecs;
    app.innerHTML = `
      <h1>Compétences</h1>
      <div class="facts">
        <div class="fact"><b>${D.skillMeta.pointsTotal}</b><span>points max en 1.0</span></div>
        <div class="fact"><b>0</b><span>classe imposée : mélangez les branches</span></div>
        <div class="fact"><b>1.0</b><span>arbre remis à zéro pour tous</span></div>
      </div>
      <h2>${icon("star")}Montrer les compétences d'un build</h2>
      <div class="chips scroll" role="group" aria-label="Build">
        <button class="chip" data-skb="" aria-pressed="${!sk.build}">${icon("grid")}Toutes</button>
        ${D.builds.map((b) => `<button class="chip ${styleColor(b.style)}" data-skb="${b.id}" aria-pressed="${sk.build === b.id}">${icon(styleIcon(b.style))}${esc(TAGS[b.id]?.court || b.nom)}</button>`).join("")}
      </div>
      ${!sk.build ? troncSection(false) : troncSection(true)}
      <h2>${icon("tree")}${sk.build ? "Compétences de ce build" : "Toutes les compétences"}</h2>
      <div class="chips scroll" role="group" aria-label="Branche">
        <button class="chip" data-tree="" aria-pressed="${!sk.arbre}">Toutes les branches</button>
        ${Object.entries(TREE_UI).map(([t, [ic, c]]) => `<button class="chip c-${c}" data-tree="${t}" aria-pressed="${sk.arbre === t}">${icon(ic)}${t}</button>`).join("")}
      </div>
      <div class="bar"><div class="searchbox">${icon("search")}<input id="sk-q" type="search" value="${esc(sk.q)}" placeholder="ex. mana, parade, dague…" aria-label="Rechercher une compétence"></div></div>
      <div class="result-line"><span id="sk-count"></span></div>
      <div id="sk-list" class="sgrid"></div>`;
    $("#sk-q").addEventListener("input", (e) => { sk.q = e.target.value; renderSkills(); });
    renderSkills();
  }
  function renderSkills() {
    const q = norm(sk.q).trim(), b = BUILDS[sk.build];
    const roleOf = (id) => !b ? "" : b.competences.essentielles.includes(id) ? "ess" : (b.competences.optionnelles.includes(id) ? "opt" : (b.competences.ordre || []).includes(id) ? "ess" : "");
    let list = D.skills.filter((s) => (!sk.arbre || s.arbre === sk.arbre) && (!b || roleOf(s.id)) && (!q || q.split(/\s+/).every((w) => norm(s.nom + " " + s.effet + " " + s.sous).includes(w))));
    if (b) list = list.sort((x, y) => (roleOf(x.id) === "ess" ? 0 : 1) - (roleOf(y.id) === "ess" ? 0 : 1));
    $("#sk-count").textContent = `${list.length} compétence${list.length > 1 ? "s" : ""}`;
    $("#sk-list").innerHTML = list.map((s) => `<button class="stile ${treeColor(s.arbre)}" data-skill="${s.id}">
        <span class="stile-top">${icon(TREE_UI[s.arbre]?.[0] || "flame")}<span class="stile-name">${esc(s.nom)}</span></span>
        ${roleOf(s.id) ? `<span class="role-tag ${roleOf(s.id)}">${roleOf(s.id) === "ess" ? "Indispensable" : "Option"}</span>` : ""}
        <span class="stile-eff">${esc(s.effet)}</span>
        <span class="cost">${s.cout ? Array.from({ length: Math.min(s.cout, 5) }, () => "<i></i>").join("") + ` ${s.cout} pt${s.cout > 1 ? "s" : ""}` : "coût inconnu"}</span>
        ${sdot(s.statut)}
      </button>`).join("") || `<div class="empty" style="grid-column:1/-1">${icon("search")}<p>Aucune compétence ne correspond.</p></div>`;
  }

  // ════════════ COMPARATEUR ════════════
  function viewComparateur() {
    const items = compare.map(getItem).filter(Boolean);
    const numRows = Object.keys(STAT_LABELS).filter((k) => items.some((i) => i.stats?.[k] != null));
    app.innerHTML = `
      <h1>Comparateur</h1>
      <p class="lead">Jusqu'à 4 objets côte à côte. La meilleure valeur est en vert.</p>
      <div class="bar"><div class="searchbox">${icon("search")}<input id="cmp-q" type="search" placeholder="Ajouter un objet : tapez son nom…" list="cmp-names" aria-label="Ajouter un objet"></div>
        <datalist id="cmp-names">${D.items.filter((i) => !compare.includes(i.id)).map((i) => `<option value="${esc(i.nom)}">`).join("")}</datalist></div>
      ${items.length ? `<div class="table-wrap"><table class="cmp-table"><thead><tr><th></th>${items.map((i) => `<th><div class="cmp-head"><button class="itile-main" style="padding:4px" data-item="${i.id}">${art(i, "lg")}<span class="iname">${esc(i.nom)}</span></button>${sdot(i.statut)}<button class="btn small" data-cmp-remove="${i.id}">${icon("x")}Retirer</button></div></th>`).join("")}</tr></thead>
        <tbody>
          <tr><td><b>Type</b></td>${items.map((i) => `<td>${esc(i.type || "—")}</td>`).join("")}</tr>
          <tr><td><b>Niveau</b></td>${items.map((i) => `<td>${esc(i.niveau ?? "—")}</td>`).join("")}</tr>
          <tr><td><b>Rareté</b></td>${items.map((i) => `<td class="r-${rarKey(i.rarete)}"><span class="rar-txt">${esc(i.rarete || "—")}</span></td>`).join("")}</tr>
          ${numRows.map((k) => {
            const nums = items.map((i) => (typeof i.stats?.[k] === "number" ? i.stats[k] : null)), valid = nums.filter((n) => n != null), max = Math.max(...valid);
            return `<tr><td><b>${STAT_LABELS[k]}</b></td>${items.map((i, x) => nums[x] != null
              ? `<td class="numcell ${valid.length > 1 && nums[x] === max ? "best" : ""}"><b>${nums[x]}</b><span class="meter"><i style="width:${max ? Math.round(nums[x] / max * 100) : 0}%"></i></span></td>`
              : `<td>${esc(i.stats?.[k] ?? "—")}</td>`).join("")}</tr>`;
          }).join("")}
          <tr><td><b>Attribut</b></td>${items.map((i) => `<td>${esc(i.attribut || "—")}</td>`).join("")}</tr>
          <tr><td><b>Atouts / effets</b></td>${items.map((i) => `<td>${[...(i.atouts || []), ...(i.effets || [])].map((a) => `<span class="perk">${esc(a)}</span>`).join("") || "—"}</td>`).join("")}</tr>
          <tr><td><b>Où le trouver</b></td>${items.map((i) => `<td>${esc(i.obtention || i.obtentionEn || "—")}</td>`).join("")}</tr>
        </tbody></table></div>
        ${new Set(items.map((i) => i.statut === "v1" || i.statut === "w10" ? "a" : "b")).size > 1 ? `<div class="warnbox">${icon("alert")}<div>Attention : vous comparez des valeurs récentes avec des valeurs d'avant la 1.0.</div></div>` : ""}
        <p><button class="btn small" id="cmp-clear">${icon("trash")}Vider</button></p>`
      : `<div class="empty">${icon("compare")}<p>Aucun objet à comparer pour l'instant.<br>Touchez le bouton ${icon("compare")} sur un objet.</p><a class="btn primary" href="#equipements">Voir les équipements</a></div>`}`;
    $("#cmp-q").addEventListener("change", (e) => {
      const it = D.items.find((i) => i.nom === e.target.value);
      if (it && !compare.includes(it.id) && toggleCompare(it.id)) viewComparateur();
    });
    $("#cmp-clear")?.addEventListener("click", () => { compare = []; saveCompare(); viewComparateur(); });
  }

  // ════════════ MISES À JOUR & SOURCES ════════════
  const COV = { "1.0": ["ok", "À jour"], partiel: ["warn", "Partiel"], "pre-1.0": ["warn", "Avant 1.0"], absent: ["bad", "Absent"], editorial: ["ed", "Conseils"] };
  function viewMaj() {
    const m = D.meta;
    const counts = D.items.reduce((a, i) => ((a[i.statut] = (a[i.statut] || 0) + 1), a), {});
    app.innerHTML = `
      <h1>Mises à jour &amp; sources</h1>
      <div class="facts">
        <div class="fact"><b>${esc(m.versionJeu)}</b><span>version du jeu prise en compte</span></div>
        <div class="fact"><b>${fmtDate(m.derniereActualisation, true)}</b><span>dernière vérification</span></div>
        <div class="fact"><b>${(counts.v1 || 0) + (counts.w10 || 0)}/${D.items.length}</b><span>objets vérifiés en 1.0 ou mis à jour sur le wiki depuis</span></div>
      </div>
      <div class="chips" style="margin-top:10px">${ITEM_ST.map((s) => counts[s] ? `<span class="spill s-${STATUS[s].cls}">${icon(STATUS[s].icon)}${counts[s]} · ${STATUS[s].label}</span>` : "").join("")}</div>
      <h2>${icon("compass")}Niveau des zones</h2>
      <p class="small muted">Une arme ou un anneau trouvé prend le niveau de la zone où on le trouve : c'est ce niveau qu'affiche le site quand le jeu ne publie pas le niveau de l'objet.</p>
      <div class="zones">${ZONES.map((z) => `<div class="zone"><b>${esc(z.nom)}</b><span class="zone-lv">${esc(z.niveau)}</span><small>${z.source === "wiki-biomes" ? "Wiki officiel" : "PinDrop (pas encore de page wiki)"}${z.maj ? " · " + fmtDate(z.maj, true) : ""}</small></div>`).join("")}</div>
      <p class="small muted">Sources : ${srcLinks(["wiki-biomes", "wiki-chests", "wiki-10", "pd-biomes"])}</p>
      <h2>${icon("check")}Ce qui est à jour</h2>
      <div class="cov">${m.couverture.map((c) => { const [cls, l] = COV[c.etat] || ["info", c.etat]; return `<div class="cov-row"><b>${esc(c.domaine)}</b><span class="spill s-${cls}">${l}</span><span class="muted">${esc(c.detail)}</span></div>`; }).join("")}</div>
      <h2>${icon("refresh")}Historique des versions</h2>
      <div class="timeline">${D.versions.map((v) => `<div class="tl-item">
        <h3>Version ${esc(v.version)} <span class="muted small">· ${fmtDate(v.date)}</span></h3>
        <p style="margin:4px 0">${esc(v.resume)}</p>
        <details class="more" style="margin-top:8px"><summary>Ce qui change pour les builds</summary><div>
          ${Array.isArray(v.impact) ? `<ul class="tight">${v.impact.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : `<p>${esc(v.impact)}</p>`}
          <p><b>Sur ce site :</b> ${esc(v.etatSite)}</p><p class="muted">${srcLinks(v.sources)}</p></div></details>
      </div>`).join("")}</div>
      <h2>${icon("info")}Comment le site est mis à jour</h2>
      <p class="small muted">Pas de mise à jour automatique : les nouvelles versions sont détectées automatiquement, mais les valeurs sont vérifiées avant d'être modifiées.</p>
      <div class="steps">
        <div>Un script détecte les nouvelles annonces officielles sur Steam (<code>node scripts/check-updates.mjs</code>).</div>
        <div>La page <code>scripts/collect.html</code> relit le wiki, puis <code>node scripts/build-data.mjs</code> reconstruit le catalogue et la carte.</div>
        <div>On relit les changements, on met à jour les conseils, puis <code>node scripts/validate.mjs</code>.</div>
      </div>
      <details class="more"><summary>${icon("book")}Toutes les sources (${D.sources.length})</summary><div>
        <div class="table-wrap"><table><thead><tr><th>Source</th><th>Type</th><th>Fiabilité</th><th>Remarque</th></tr></thead><tbody>
        ${D.sources.map((s) => `<tr><td><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.nom)}</a>${s.miseAJourSource ? `<br><span class="muted small">màj ${fmtDate(s.miseAJourSource, true)}</span>` : ""}</td><td>${esc(s.type)}</td><td>${esc(s.fiabilite)}</td><td class="small">${esc(s.note)}</td></tr>`).join("")}
        </tbody></table></div></div></details>`;
  }

  // ── Routeur
  function route() {
    const h = decodeURIComponent(location.hash.slice(1)) || "builds";
    const [view] = h.split(/[/=]/);
    $$(".tabs a").forEach((a) => a.classList.toggle("active", a.dataset.view === view || ((view === "build" || view === "planner") && a.dataset.view === "builds")));
    if ($("#dlg").open) $("#dlg").close();
    if (leaflet) { leaflet.map.remove(); leaflet = null; }
    if (view === "build") viewBuild(h.split("/")[1]);
    else if (view === "planner") viewPlanner(location.hash.split("=")[1]);
    else if (view === "carte") { const [, kind, val] = h.split("/"); if (kind) mapMode = "objets"; viewCarte(kind === "item" ? { item: val } : kind === "region" ? { region: val } : kind === "cons" ? { cons: val } : null); }
    else if (view === "construction") viewConstruction(h.split("/")[1]);
    else ({ builds: viewBuilds, equipements: viewEquipements, competences: viewCompetences, comparateur: viewComparateur, maj: viewMaj }[view] || viewBuilds)();
    window.scrollTo(0, 0);
  }

  // ── Événements (délégation)
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-item],[data-skill],[data-slot],[data-quiz],[data-quiz-reset],[data-stage],[data-cat],[data-sub],[data-skb],[data-tree],[data-share],[data-cmp],[data-cmp-toggle],[data-cmp-remove],[data-del-mine],[data-help],[data-close],[data-mapmode],[data-mapfocus],[data-region],[data-ctab],[data-bcat],[data-bmode]");
    if (!t) return;
    const d = t.dataset;
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
    else if (d.share) copy(location.href.split("#")[0] + "#build/" + d.share, "Lien du build copié");
    else if (d.cmp) { if (toggleCompare(d.cmp)) t.setAttribute("aria-pressed", compare.includes(d.cmp)); }
    else if (d.cmpToggle) { toggleCompare(d.cmpToggle); itemDetail(d.cmpToggle); if (location.hash.startsWith("#equipements")) renderEqList(); else if (location.hash.startsWith("#comparateur")) viewComparateur(); }
    else if (d.cmpRemove) { toggleCompare(d.cmpRemove); viewComparateur(); }
    else if (d.delMine) { const mine = store.get("ens.myBuilds", []); mine.splice(Number(d.delMine), 1); store.set("ens.myBuilds", mine); viewBuilds(); }
    else if (d.help !== undefined) helpDialog();
    else if (d.close !== undefined) $("#dlg").close();
    else if (d.mapmode) { mapMode = d.mapmode; if (leaflet) { leaflet.map.remove(); leaflet = null; } viewCarte(); }
    else if (d.mapfocus) leaflet?.focusItem(d.mapfocus);
    else if (d.region) leaflet?.focusRegion(d.region);
    else if (d.ctab) { location.hash = "#construction/" + d.ctab; }
    else if (d.bcat !== undefined) { cons.cat = d.bcat; renderBlocs(); }
    else if (d.bmode !== undefined) { cons.mode = d.bmode; renderBlocs(); }
  });
  document.addEventListener("change", (e) => {
    const ck = e.target.dataset?.clayer;
    if (ck) { e.target.checked ? cLayers.add(ck) : cLayers.delete(ck); store.set("ens.cLayers", [...cLayers]); leaflet?.ctoggle(ck, e.target.checked); return; }
    const g = e.target.dataset?.layer;
    if (!g) return;
    e.target.checked ? mapLayers.add(g) : mapLayers.delete(g);
    store.set("ens.mapLayers", [...mapLayers]);
    leaflet?.toggle(g, e.target.checked);
  });
  $("#help-btn").addEventListener("click", helpDialog);
  $("#dlg").addEventListener("click", (e) => { if (e.target.id === "dlg") e.target.close(); });

  hydrateIcons(); renderHeader(); saveCompare();
  window.addEventListener("hashchange", route);
  route();
})();
