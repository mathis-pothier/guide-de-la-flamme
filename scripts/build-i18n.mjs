// Construit les dictionnaires de langue chargés par le site :
//   data/i18n/fr.js  window.ENS_FR = { noms: { anglais: français | [français, 1 = officiel] }, textes: { anglais: français } }
//   data/i18n/en.js  window.ENS_EN = { français: anglais }  (interface + textes rédigés par le site)
// Sources : data/i18n/src/ (noms officiels du wiki français, traductions du site, textes par identifiant).
// Usage : node scripts/build-i18n.mjs  (à relancer après une collecte du wiki ou une modification des textes du site)
// Affiche la couverture : noms et textes encore sans traduction (ils restent dans la langue d'origine sur le site).
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(root, "data", "i18n", "src");
const imp = (f) => import(pathToFileURL(join(SRC, f)).href);
const json = (f) => (existsSync(join(SRC, f)) ? JSON.parse(readFileSync(join(SRC, f), "utf8")) : {});
const { OFFICIELS } = await imp("officiels-fr.mjs");
const { PIECES, SETS, SORTS, ANNEAUX, GRADES, OBJETS } = await imp("objets-fr.mjs");
const { LIEUX, COMPETENCES, BLOCS, ATOUTS, QUETES, DIVERS, MATERIAUX } = await imp("lieux-fr.mjs");

// Données du site (comme scripts/validate.mjs)
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ["sources", "items", "skills", "builds", "builds-1.0", "versions", "catalog", "images", "map", "progression", "tronc-commun", "construction", "blocs-images", "guides", "map-config", "merge"])
  vm.runInContext(readFileSync(join(root, "data", f + ".js"), "utf8"), ctx, { filename: f + ".js" });
const D = ctx.window.ENS;

// ── Noms : anglais → français
const SITE = { ...OBJETS, ...LIEUX, ...COMPETENCES, ...BLOCS, ...ATOUTS, ...QUETES, ...DIVERS };
const ROMAIN = /^(.*?)( [IVX]+)?$/;
function regle(en) {
  // Pièce de set : « Alpine Antler Boots » → « Bottes des bois alpins »
  for (const p of Object.keys(PIECES).sort((a, b) => b.length - a.length)) {
    if (en.endsWith(" " + p)) { const s = en.slice(0, -p.length - 1); if (SETS[s]) return `${PIECES[p]} ${SETS[s]}`; }
  }
  // Sort : « Eternal Fireball II » → « Boule de feu éternelle II »
  const m = en.match(/^(Eternal )?(.+?)( [IVX]+)?$/);
  if (m && SORTS[m[2]]) { const [fr, g] = SORTS[m[2]]; return `${fr}${m[1] ? (g === "f" ? " éternelle" : " éternel") : ""}${m[3] || ""}`; }
  // Anneaux : « Greater Ring of Mana » → « Anneau de mana majeur »
  const r = en.match(/^(?:(\w+) )?Ring of (Health|Mana|Stamina)$/);
  if (r && (!r[1] || GRADES[r[1]])) return `Anneau ${ANNEAUX[r[2]]}${r[1] ? " " + GRADES[r[1]] : ""}`;
  return null;
}
function frNom(en) {
  if (OFFICIELS[en]) return [OFFICIELS[en], 1];
  if (SITE[en]) return SITE[en];
  const x = regle(en);
  if (x) return x;
  const n = en.match(ROMAIN);
  if (n && n[2] && (SITE[n[1]] || OFFICIELS[n[1]])) return (OFFICIELS[n[1]] || SITE[n[1]]) + n[2];
  return null;
}
const noms = {}, manque = {};
const nom = (en, cat) => {
  if (!en || typeof en !== "string" || noms[en] !== undefined) return;
  const fr = frNom(en);
  if (fr != null) noms[en] = fr;
  else if (!/ - /.test(en)) (manque[cat] ||= new Set()).add(en);
};
for (const it of D.items) { nom(it.nom, "objets"); (it.atouts || []).forEach((a) => nom(a.replace(/ ×\d+$/, ""), "atouts")); nom(it.region, "regions"); }
for (const s of D.skills) nom(s.nom, "competences");
for (const g of Object.values(D.map.groupes)) nom(g.nom, "typesLieux");
for (const m of D.map.marqueurs) { nom(m.nom, "lieux"); m.nom.split(" - ").forEach((p) => nom(p, "lieux")); }
for (const r of [...D.map.regions, ...D.map.zones]) nom(r.nom, "regions");
for (const b of D.construction.blocs) { nom(b.nom, "blocs"); nom(b.quete, "quetes"); nom(b.region, "regions"); }
for (const x of D.construction.confort.exemples) nom(x.objet, "divers");
for (const [en] of Object.entries({ ...LIEUX, ...DIVERS, ...OFFICIELS })) nom(en, "divers");

// ── Textes : anglais → français
const textes = {};
// Recettes de blocs, traduites élément par élément
for (const b of D.construction.blocs) {
  if (!b.recette) continue;
  const parts = b.recette.split(" + ").map((p) => { const m = p.match(/^(\d+) (.+)$/); return m && MATERIAUX[m[2]] ? `${m[1]} ${MATERIAUX[m[2]]}` : null; });
  if (parts.every(Boolean)) textes[b.recette] = parts.join(" + "); else (manque.recettes ||= new Set()).add(b.recette);
}
// « Où le trouver » du catalogue : « World Drop in Revelwood », « Fabrication : Manual Crafting »
const FABRICATION = { "Manual Crafting": "à la main", "Ancient Researcher": "Chercheur ancien", Alchemist: "Alchimiste", Hunter: "Chasseuse", Collector: "Collectionneur", Blacksmith: "Forgeron" };
for (const it of D.items) {
  const o = it.obtention || "";
  let m = o.match(/^World Drop in (.+)$/);
  if (m) { const n = frNom(m[1]); textes[o] = `Butin aléatoire : ${n == null ? m[1] : Array.isArray(n) ? n[0] : n}`; }
  m = o.match(/^Fabrication : (.+)$/);
  if (m && FABRICATION[m[1]]) textes[o] = `Fabrication : ${FABRICATION[m[1]]}`;
}
// Textes par identifiant (descriptions d'objets, « où le trouver », descriptions des lieux)
const parId = (fichiers, liste, champ, cat) => {
  const t = {};
  for (const f of readdirSync(SRC).filter((x) => fichiers.test(x))) Object.assign(t, json(f));
  // Un texte partagé par plusieurs identifiants n'est traduit qu'une fois (sous le premier identifiant qui le porte).
  // Contrôle : l'empreinte du texte anglais traduit est mémorisée (controle-fr.json) ; si le wiki modifie le texte,
  // la traduction n'est plus appliquée (le site affiche l'anglais) et le texte est signalé « à revoir ».
  const C = (CONTROLE[cat] ||= {});
  for (const x of liste) {
    if (!x[champ] || t[x.id] == null || t[x.id] === "") continue;
    const h = empreinte(x[champ]);
    if (C[x.id] && C[x.id] !== h) { (manque[cat + " (texte du wiki modifié, à revoir)"] ||= new Map()).set(x[champ], x.id); continue; }
    C[x.id] = h; textes[x[champ]] = t[x.id];
  }
  for (const x of liste) if (x[champ] && textes[x[champ]] == null) (manque[cat] ||= new Map()).set(x[champ], x.id);
};
const empreinte = (s) => { let h = 0x811c9dc5; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); };
const CONTROLE = json("controle-fr.json");
parId(/^descriptions-fr.*\.json$/, D.items, "description", "descriptions");
parId(/^obtention-fr.*\.json$/, D.items, "obtentionEn", "obtentionEn");
parId(/^lieux-desc-fr.*\.json$/, D.map.marqueurs, "desc", "descLieux");
writeFileSync(join(SRC, "controle-fr.json"), JSON.stringify(CONTROLE) + "\n");
// Textes courts traduits tels quels (effets, améliorations…)
for (const f of readdirSync(SRC).filter((x) => /^textes-fr.*\.json$/.test(x))) Object.assign(textes, json(f));
// Effets et améliorations : « +7 Mana Regeneration », « Commune : +8 Cutting Armor », « Wizard +1 rang », « Brutal +20 % »
const { TERMES, EFFETS } = await imp("effets-fr.mjs");
const nomTxt = (s) => { const n = frNom(s) ?? EFFETS[s]; return n == null ? null : Array.isArray(n) ? n[0] : n; };
function effet(e) {
  const pre = e.match(/^(Commune|Peu commune|Rare|Épique|Légendaire) : (.+)$/);
  if (pre) { const r = effet(pre[2]); return r == null ? (/[éèàùç]/.test(pre[2]) ? e : null) : `${pre[1]} : ${r}`; }
  let m = e.match(/^(.+?) (\+\d+\s(?:rangs?|%))$/);
  if (m && nomTxt(m[1])) return `${nomTxt(m[1])} ${m[2]}`;
  if (TERMES[e] || nomTxt(e)) return TERMES[e] || nomTxt(e);
  // Une ou plusieurs paires « valeur terme » : « +1/+1 Armor +6 Cutting Armor »
  const paires = [...e.matchAll(/([+\-−]?\s?[\d.,:/+]+\s?(?:%|s|m|min\.?)?) ([^+\-−\d][^+−]*?)(?= [+\-−]\d| *$)/g)];
  if (!paires.length || paires.map((p) => p[0]).join(" ").replace(/\s+/g, " ") !== e.replace(/\s+/g, " ")) return null;
  const out = paires.map(([, v, terme]) => { const tt = TERMES[terme.trim()] ?? nomTxt(terme.trim()); return tt == null ? null : `${v.trim()} ${tt}`; });
  return out.every((x) => x != null) ? out.join(" ") : null;
}
for (const it of D.items) for (const e of [...(it.effets || []), ...(it.amelioration || [])]) {
  if (textes[e] != null || !/[A-Z][a-z]+/.test(e.replace(/^(Commune|Peu commune|Rare|Épique|Légendaire) : /, "")) || /^Bonus listé/.test(e)) continue;
  const fr = effet(e);
  if (fr != null && fr !== e) textes[e] = fr; else if (fr == null) (manque.effets ||= new Set()).add(e);
}

writeFileSync(join(root, "data", "i18n", "fr.js"),
  "// Généré par scripts/build-i18n.mjs — ne pas modifier à la main (sources : data/i18n/src/).\n" +
  "// noms : [français, 1] = nom officiel (wiki français) ; texte seul = traduction du site, non officielle.\n" +
  "window.ENS_FR = " + JSON.stringify({ noms, textes }) + ";\n");

// ── Anglais : français → anglais
// Textes à traduire : interface (t/tp/tr dans le code), textes fixes des pages et textes français des données.
// Les fichiers data/i18n/src/en-*.json associent l'empreinte du texte français (FNV-1a, base 36) à sa traduction :
// un texte français modifié change d'empreinte et redevient « à traduire » (le site affiche alors le français).
const aTraduire = new Set();
const STR = '"((?:[^"\\\\]|\\\\.)*)"';
for (const f of ["app.js", "refonte/refonte.js", "admin.js", "data/map-config.js"]) {
  const s = readFileSync(join(root, f), "utf8");
  for (const re of [new RegExp("\\bt\\(" + STR, "g"), new RegExp("\\btp\\([^,]+, " + STR + ", " + STR, "g"), new RegExp("\\btr\\(" + STR + "\\)", "g")])
    for (const m of s.matchAll(re)) for (const g of m.slice(1)) if (g != null) aTraduire.add(JSON.parse('"' + g + '"'));
}
// Listes traduites par t() à l'exécution (étiquettes, catégories…) : chaînes entre guillemets dans ces déclarations
for (const decl of ["STAT_LABELS", "WEAPON_SUB", "CTABS", "TITRES", "PLANNER_SLOTS"])
  for (const f of ["app.js", "refonte/refonte.js"]) {
    const s = readFileSync(join(root, f), "utf8"), i = s.indexOf(`const ${decl} =`);
    if (i >= 0) for (const m of s.slice(i, s.indexOf(";\n", i)).matchAll(/"([^"]*[A-Za-zÀ-ÿ][^"]*)"/g)) if (/[A-ZÀ-Ý]/.test(m[1][0])) aTraduire.add(m[1]);
  }
// Textes fixes des pages (menus, pied de page, attributs)
for (const f of ["index.html", "ancien.html"]) {
  const h = readFileSync(join(root, f), "utf8").replace(/<script[\s\S]*?<\/script>/g, "");
  for (const m of h.matchAll(/>([^<>]*[A-Za-zÀ-ÿ][^<>]*)</g)) { const s = m[1].trim().replace(/&amp;/g, "&"); if (s && !/^\s*$/.test(s)) aTraduire.add(s); }
  for (const m of h.matchAll(/(?:aria-label|placeholder|title)="([^"]+)"/g)) aTraduire.add(m[1].replace(/&amp;/g, "&"));
}
// Données : textes français (et valeurs affichées par tr()), hors noms et textes anglais du wiki
const FR_RE = /[éèêàùçôîâœ]|\b(le|la|les|des|du|de|et|un|une|pour|avec|sur|dans|est|sont|au|aux|ou|pas|plus|par|en|à)\b/i;
const SAUTE = new Set(["id", "url", "wiki", "image", "fichier", "icone", "cls", "g", "f", "src", "sources", "marqueurs", "item", "meilleur", "set", "pieces", "catalogId",
  "statut", "categorie", "style", "styles", "mode", "vignette", "fond", "iconeUrl", "dossier", "ext", "couleur", "depot", "branche", "video", "ressources",
  "typeEn", "prerequis", "essentielles", "optionnelles", "ordre", "premiersPoints", "description", "obtentionEn", "lore", "resume_en"]);
const ENUM = new Set(["type", "emplacement", "rarete", "raretes", "attribut", "classe", "arbre", "sous", "etape", "cat", "difficulte", "priorite", "niveau", "version", "typeDegats", "role", "fiabilite"]);
const walkFr = (v, k) => {
  if (typeof v === "string") { if (v.length > 1 && !/^https?:|^#|^[\d\s.,–:%+-]+$/.test(v) && (FR_RE.test(v) || ENUM.has(k))) aTraduire.add(v); return; }
  if (Array.isArray(v)) return v.forEach((x) => walkFr(x, k));
  // Clés « techniques » ignorées, sauf texte libre (builds.prerequis) ou objet (guides.sources, mapConfig.fonds.wiki)
  if (v && typeof v === "object") for (const [kk, x] of Object.entries(v)) if (!SAUTE.has(kk) || (x && typeof x === "object" && !Array.isArray(x)) || (kk === "prerequis" && typeof x === "string")) walkFr(x, kk);
};
for (const [k, v] of Object.entries(D)) if (!["catalog", "images", "blocsImages", "alias"].includes(k)) walkFr(v, k);
for (const it of D.items) { walkFr(it.description && FR_RE.test(it.description) && !/[a-z]{3} [a-z]{3} the /.test(it.description) ? it.description : null, "description"); }
// « Où le trouver » mêlant français et anglais (« Fabrication : Manual Crafting », « Butin des Hollow Halls »)
for (const it of D.items) if (/^(Fabrication|Butin)\b|fabricable/.test(it.obtention || "")) aTraduire.add(it.obtention);
for (const k of ["Rareté non indiquée", "Commune", "Peu commune", "Rare", "Épique", "Légendaire", "Non indiquée"]) aTraduire.add(k);
// Configuration de la carte : tous les libellés (catégories, précisions, statuts, fonds) et messages de validation
const walkAll = (v) => { if (typeof v === "string") { if (/[A-Za-zÀ-ÿ]{3}/.test(v) && !/^(#|https?:|images\/)/.test(v) && !/^[a-z0-9-]+$/.test(v)) aTraduire.add(v); } else if (v && typeof v === "object") Object.entries(v).forEach(([k, x]) => { if (!["couleur", "icone", "depot", "branche", "fichier", "dossier", "ext"].includes(k)) walkAll(x); }); };
walkAll({ categories: D.mapConfig.categories, precisions: D.mapConfig.precisions, statuts: D.mapConfig.statuts, fonds: D.mapConfig.fonds });
for (const m of readFileSync(join(root, "data", "map-config.js"), "utf8").matchAll(/e\.push\((["`])(.*?)\1\)/g)) aTraduire.add(m[2].replace("${cfg.taille}", "10240"));

const enParEmpreinte = {};
for (const f of readdirSync(SRC).filter((x) => /^en-.*\.json$/.test(x)).sort()) Object.assign(enParEmpreinte, json(f));
const en = {}, sansEn = [];
for (const fr of aTraduire) { const tr = enParEmpreinte[empreinte(fr)]; if (tr != null) en[fr] = tr; else sansEn.push(fr); }
writeFileSync(join(root, "data", "i18n", "en.js"),
  "// Généré par scripts/build-i18n.mjs — ne pas modifier à la main (sources : data/i18n/src/en-*.json, par empreinte du texte français).\n" +
  "window.ENS_EN = " + JSON.stringify(en) + ";\n");
if (process.argv.includes("--a-traduire")) writeFileSync(join(root, "data", "i18n", "a-traduire.txt"), sansEn.map((s) => empreinte(s) + "\t" + s.replace(/\n/g, " ")).join("\n") + "\n");

// ── Couverture
const off = Object.values(noms).filter(Array.isArray).length;
console.log(`Français : ${Object.keys(noms).length} noms (${off} officiels), ${Object.keys(textes).length} textes.`);
for (const [k, v] of Object.entries(manque)) console.log(`  sans traduction — ${k} : ${v.size}${process.argv.includes("--detail") ? " : " + [...(v instanceof Map ? v.values() : v)].slice(0, 400).join(" | ") : ""}`);
console.log(`Anglais : ${Object.keys(en).length} textes traduits ; ${sansEn.length} sans traduction (${sansEn.reduce((n, s) => n + s.length, 0)} caractères)` +
  (process.argv.includes("--a-traduire") ? " — liste : data/i18n/a-traduire.txt" : " — détail : --a-traduire"));
