/* Langue du site (français par défaut, anglais en option) — chargé avant les données.
   - t("Texte français", a, b) : texte de l'interface ; en anglais, cherché dans window.ENS_EN ({0}, {1}… = valeurs).
   - tp(n, "{0} objet", "{0} objets") : accord selon le nombre (règles française et anglaise).
   - tr(s) : valeur des données (type, rareté, effet…) dans la langue choisie.
   - nm(s) / nmh(s) : nom du jeu (objet, lieu, bloc, compétence…). En français : nom officiel du wiki français s'il existe,
     sinon traduction du site ; nmh ajoute une info-bulle avec le nom anglais et « traduction non officielle ».
   - appliquer(D) : traduit sur place les textes libres des données (jamais les valeurs utilisées par les filtres).
   Dictionnaires : data/i18n/en.js (français → anglais) et data/i18n/fr.js (anglais → français : noms et textes du wiki). */
window.ENS_I18N = (() => {
  "use strict";
  const LANGS = ["fr", "en"];
  let lang = "fr";
  try { const s = localStorage.getItem("ens.lang"); if (LANGS.includes(s)) lang = s; } catch { /* stockage indisponible */ }
  const q = new URLSearchParams(location.search).get("lang");
  if (LANGS.includes(q)) lang = q;
  document.documentElement.lang = lang;
  const locale = lang === "en" ? "en-GB" : "fr-FR";

  const EN = () => window.ENS_EN || {};
  const FR = () => window.ENS_FR || { noms: {}, textes: {} };
  const fill = (s, a) => (a.length ? String(s).replace(/\{(\d+)\}/g, (_, i) => a[i] ?? "") : s);

  function t(fr, ...a) { return fill(lang === "en" ? (EN()[fr] ?? fr) : fr, a); }
  function tp(n, one, many, ...a) { const pl = lang === "en" ? n !== 1 : n > 1; return t(pl ? many : one, n, ...a); }
  // Nom du jeu : { fr, officiel } ou undefined
  function nomFr(s) { const v = FR().noms[s]; return v == null ? null : Array.isArray(v) ? { fr: v[0], officiel: !!v[1] } : { fr: v, officiel: false }; }
  function nm(s) {
    if (s == null || s === "") return s ?? "";
    if (lang === "en") return EN()[s] ?? s;
    const n = nomFr(s) || nomCompose(s);
    return n ? n.fr : s;
  }
  // Noms composés du wiki : « Ancient Spire - Kindlewastes » → « Tour des Anciens – Regs exaltés »
  function nomCompose(s) {
    const m = String(s).match(/^(.+?) - (.+)$/);
    if (!m) return null;
    const a = nomFr(m[1]), b = nomFr(m[2]);
    if (!a && !b) return null;
    return { fr: `${a ? a.fr : m[1]} – ${b ? b.fr : m[2]}`, officiel: (!a || a.officiel) && (!b || b.officiel) };
  }
  const escA = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function nmh(s) {
    if (lang === "en") return escA(nm(s));
    const n = nomFr(s) || nomCompose(s);
    if (!n || n.fr === s) return escA(s);
    return `<span class="nom-tr${n.officiel ? "" : " nof"}" title="${escA(`Nom anglais : ${s}${n.officiel ? "" : " — traduction non officielle"}`)}">${escA(n.fr)}</span>`;
  }
  function tr(s) {
    if (s == null || s === "") return s ?? "";
    if (lang === "en") return EN()[s] ?? s;
    return FR().textes[s] ?? nm(s);
  }

  // Noms du jeu cités dans un texte rédigé en français (guides, builds…) : remplacés par le nom français (info-bulle = anglais).
  let RE = null, REMAP = null;
  function nomsDansTexte(html) {
    if (lang !== "fr") return html;
    if (!RE) {
      REMAP = new Map();
      for (const k of Object.keys(FR().noms)) { const n = nomFr(k); if (n && n.fr !== k && k.length >= 4 && /^[A-Z]/.test(k)) REMAP.set(k, n); }
      const keys = [...REMAP.keys()].sort((a, b) => b.length - a.length).map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/'/g, "(?:'|&#39;|’)"));
      RE = keys.length ? new RegExp(`(<[^>]*>)|(?<![\\w’'-])(${keys.join("|")})(?![\\w’'-])`, "g") : /$^/;
    }
    return html.replace(RE, (m, tag, name) => {
      if (tag) return tag;
      const k = name.replace(/&#39;|’/g, "'"), n = REMAP.get(k);
      return n ? `<span class="nom-tr${n.officiel ? "" : " nof"}" title="${escA(`Nom anglais : ${k}${n.officiel ? "" : " — traduction non officielle"}`)}">${escA(n.fr)}</span>` : m;
    });
  }

  // Traduction sur place des textes libres. Les clés listées ici servent aux filtres et calculs : elles restent en français
  // (ou en anglais pour les noms du jeu) et sont traduites à l'affichage par tr()/nm().
  const LOGIQUE = new Set(["id", "nom", "type", "typeEn", "emplacement", "rarete", "raretes", "attribut", "classe", "arbre", "etape", "cat", "mode",
    "difficulte", "priorite", "region", "etat", "confiance", "niveau", "statut", "categorie", "style", "styles", "atouts", "effets", "url", "wiki", "image",
    "fichier", "icone", "cls", "g", "f", "src", "sources", "marqueurs", "item", "meilleur", "set", "pieces", "catalogId", "idInterne", "couleur", "dossier", "ext",
    "fond", "vignette", "video", "ressources", "prerequis", "essentielles", "optionnelles", "ordre", "premiersPoints", "portee", "modes", "roles", "depot",
    "branche", "obtention", "recette", "versionJeu"]);
  // Clés « nom » qui sont des textes du site (et non des noms du jeu) : traduites en anglais.
  const NOMS_SITE = /^(builds|styles|guides|construction\.batiments|construction\.emplacements|mapConfig|tronc|skillRecs|buildTags|sources|meta)/;
  function walk(v, path, dict, keepNom) {
    if (Array.isArray(v)) { for (let i = 0; i < v.length; i++) { if (typeof v[i] === "string") { if (dict[v[i]] != null) v[i] = dict[v[i]]; } else walk(v[i], path, dict, keepNom); } return; }
    if (!v || typeof v !== "object") return;
    for (const k of Object.keys(v)) {
      const x = v[k], p = path + "." + k;
      // Clé de logique : on ne touche ni à sa valeur ni à ses listes, mais on descend dans un objet (ex. guides.sources, mapConfig.fonds.wiki)
      if (LOGIQUE.has(k) && (typeof x === "string" || Array.isArray(x)) && !(k === "nom" && !keepNom && NOMS_SITE.test(path) && !/contextes$/.test(path))) continue;
      if (typeof x === "string") { if (dict[x] != null) v[k] = dict[x]; }
      else walk(x, p, dict, keepNom);
    }
  }
  function appliquer(D) {
    if (lang === "en") {
      const d = EN();
      for (const k of Object.keys(D)) if (!["catalog", "images", "blocsImages", "map", "alias", "items"].includes(k)) walk(D[k], k, d, false);
      // Objets : textes rédigés par le site (notes, conflits, améliorations, descriptions de sets…)
      for (const it of D.items || []) for (const k of ["note", "degatsNote", "conflits", "amelioration", "description", "obtention"]) if (it[k] != null) {
        if (Array.isArray(it[k])) it[k] = it[k].map((s) => d[s] ?? s); else it[k] = d[it[k]] ?? it[k];
      }
    } else {
      const d = FR().textes;
      // Textes du wiki traduits par le site (non officiels) : repérés pour l'affichage d'une mention
      D.descTraduites = new Set();
      for (const it of D.items || []) {
        if (it.description && d[it.description] != null) { it.description = d[it.description]; D.descTraduites.add(it.id); }
        if (it.obtentionEn && d[it.obtentionEn] != null) { it.obtentionEn = d[it.obtentionEn]; D.descTraduites.add("o:" + it.id); }
        if (Array.isArray(it.amelioration)) it.amelioration = it.amelioration.map((s) => d[s] ?? s);
      }
      for (const m of D.map?.marqueurs || []) if (m.desc && d[m.desc]) m.desc = d[m.desc];
    }
  }

  function setLang(l) {
    try { localStorage.setItem("ens.lang", l); } catch { /* rien */ }
    // Même adresse (seul l'ancre change) : le navigateur ne recharge pas, on force le rechargement
    const u = new URL(location.href); u.searchParams.delete("lang");
    if (u.toString() === location.href) location.reload(); else location.href = u.toString();
  }
  // Charge le dictionnaire de la langue (appelé dans index.html après les fichiers de données, avant merge.js),
  // avec le même numéro de version que i18n.js (scripts/stamp-version.mjs).
  const V = ((document.currentScript && document.currentScript.src.match(/[?&]v=(\w+)/)) || [])[1];
  function charger() {
    const f = lang === "en" ? "data/i18n/en.js" : "data/i18n/fr.js";
    document.write(`<script src="${f}${V ? "?v=" + V : ""}"><\/script>`);
  }
  // Textes fixes de la page (menus, pied de page, attributs) : traduits au démarrage en anglais.
  function traduirePage(root = document.body) {
    if (lang !== "en") return;
    const d = EN();
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
    for (const n of nodes) { const s = n.nodeValue.trim(); if (s && d[s] != null) n.nodeValue = n.nodeValue.replace(s, d[s]); }
    for (const el of root.querySelectorAll("[aria-label],[placeholder],[title]")) for (const a of ["aria-label", "placeholder", "title"]) { const s = el.getAttribute(a); if (s && d[s] != null) el.setAttribute(a, d[s]); }
    if (d["__titre"]) document.title = d["__titre"];
  }
  // Bouton de langue : tout élément [data-lang-switch] (libellé = langue actuelle, info-bulle = l'autre langue)
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-lang-switch]"); if (b) { e.preventDefault(); setLang(lang === "fr" ? "en" : "fr"); } });
  function boutons() {
    const label = lang === "fr" ? "Switch to English" : "Passer en français";
    for (const b of document.querySelectorAll("[data-lang-switch]")) {
      b.setAttribute("aria-label", label); b.title = label; b.lang = lang === "fr" ? "en" : "fr";
      b.querySelectorAll(".rf-lang-cur").forEach((s) => { s.textContent = lang.toUpperCase(); });
      b.querySelectorAll(".rf-lang-alt").forEach((s) => { s.textContent = lang === "fr" ? "EN" : "FR"; });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boutons); else boutons();

  return { get lang() { return lang; }, locale, t, tp, tr, nm, nmh, nomsDansTexte, appliquer, setLang, charger, traduirePage };
})();
