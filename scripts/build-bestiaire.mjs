// Bestiaire : transforme la collecte du wiki (.collect/wiki-creatures.json, voir scripts/collect-creatures.mjs) en data/bestiaire.js.
// Usage : node scripts/build-bestiaire.mjs   (après node scripts/collect.mjs, ou scripts/collect.html?creatures sans réseau)
// Ne déduit rien : chaque valeur affichée vient d'un champ du wiki. Les notes et recoupements rédigés à la main sont dans
// data/bestiaire-notes.js (jamais écrasé par ce script).
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(root, ".collect", "wiki-creatures.json");
if (!existsSync(SRC)) { console.error("Collecte absente : lancez d'abord node scripts/collect.mjs (ou scripts/collect.html?creatures)."); process.exit(1); }
const C = JSON.parse(readFileSync(SRC, "utf8"));
const WIKI = "https://enshrouded.wiki.gg/wiki/";
const RELEASE_10 = "2026-10-15"; // même date que scripts/build-data.mjs (sortie de la 1.0)

const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const url = (t) => WIKI + encodeURIComponent(t.replace(/ /g, "_")).replace(/%2F/g, "/").replace(/%3A/g, ":");
function clean(s) {
  if (!s) return "";
  return s
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\[\[[a-z]{2}:[^\]]*\]\]/g, "") // liens vers les autres langues du wiki
    .replace(/\{\{\s*MapLink\s*\|([^}]*)\}\}/gi, (_, a) => { const p = a.split("|").map((x) => x.trim()).filter((x) => !/^(icon|size|tab|map)\s*=/i.test(x)); return p[1] || p[0]; })
    .replace(/\{\{\s*(?:SUBPAGENAME|PAGENAME)\s*\}\}/g, "")
    .replace(/\{\{[^{}]*\}\}/g, "")
    .replace(/\[\[(?:File|Image|Fichier|Category|Catégorie):[^\]]*\]\]/gi, "")
    .replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, "$1")
    .replace(/\[\[([^\]]*)\]\]/g, "$1")
    .replace(/'''?/g, "").replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "")
    .replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/[ \t]+/g, " ").trim();
}
// Infobox {{NPC Infobox | champ = valeur …}} (anglais) ou {{Infobox/NPC …}} (wiki français)
function infobox(text, nom = "NPC Infobox") {
  const i = text.indexOf("{{" + nom);
  if (i < 0) return null;
  let depth = 0, j = i;
  for (; j < text.length; j++) { if (text.startsWith("{{", j)) { depth++; j++; } else if (text.startsWith("}}", j)) { depth--; j++; if (!depth) break; } }
  const o = {};
  for (const l of text.slice(i + nom.length + 2, j - 1).split(/\n\s*\|/)) { const m = l.match(/^\s*\|?\s*([^=|]+?)\s*=\s*([\s\S]*)$/); if (m) o[m[1].trim()] = m[2].trim(); }
  return { champs: o, fin: j + 1 };
}
// Tableaux du wiki ({| … |}) et tout ce qui suit un titre mal formé (« =Locations= », « ==Drops== » en cours de ligne)
const sansTableaux = (s) => s.replace(/\{\|[\s\S]*?\n\|\}/g, "").split(/^\s*=+[^=\n]+=+\s*$|={2,}\s*(?:Drops|Unique Drops|Loot)\s*={2,}/m)[0];
// Puces vides et lignes blanches en trop
const propre = (s) => s.replace(/^•\s*$/gm, "").replace(/\n{3,}/g, "\n\n").trim();
// Corps des modèles {{Nom|…}} (accolades imbriquées comprises) et arguments séparés par les « | » de premier niveau
function modeles(text, nom) {
  const out = [], re = new RegExp("\\{\\{\\s*" + nom + "\\s*\\|", "gi");
  let m;
  while ((m = re.exec(text))) {
    let depth = 1, j = m.index + m[0].length;
    for (; j < text.length && depth; j++) { if (text.startsWith("{{", j)) { depth++; j++; } else if (text.startsWith("}}", j)) { depth--; if (!depth) break; j++; } }
    out.push(text.slice(m.index + m[0].length, j));
  }
  return out;
}
function argsHaut(s) {
  const parts = []; let cur = "", depth = 0;
  for (let i = 0; i < s.length; i++) {
    if (s.startsWith("{{", i) || s.startsWith("[[", i)) { depth++; cur += s.slice(i, i + 2); i++; continue; }
    if ((s.startsWith("}}", i) || s.startsWith("]]", i)) && depth) { depth--; cur += s.slice(i, i + 2); i++; continue; }
    if (s[i] === "|" && !depth) { parts.push(cur); cur = ""; continue; }
    cur += s[i];
  }
  parts.push(cur);
  return parts;
}
// Sections « == Titre == » → { titre: texte }
function sections(text) {
  const out = [], re = /^(==+)\s*(.+?)\s*\1\s*$/gm;
  let m, prev = null;
  while ((m = re.exec(text))) { if (prev) prev.texte = text.slice(prev.debut, m.index); prev = { titre: m[2].trim(), niveau: m[1].length, debut: m.index + m[0].length }; out.push(prev); }
  if (prev) prev.texte = text.slice(prev.debut);
  return out;
}

// Types de dégâts du wiki (ordre de l'infobox : défense physique puis magique)
const TYPES = ["Cutting", "Piercing", "Blunt", "Poison", "Fire", "Ice", "Shock", "Shroud"];
const VALEURS = new Set(["Effective", "Weak", "Neutral", "Resisted", "Immune"]);
const CATEGORIE = { Hostile: "hostile", Fleeting: "passive", Peaceful: "passive", Neutral: "neutre" };
// Sections utiles au combat (texte du wiki, repris tel quel puis traduit dans data/i18n/src/)
const COMBAT = /^(Behavior|Behaviour|Attacks|Abilities|Tips|Strategy|Strategies|Combat|Overview)$/i;
const BUTIN = /^(Drops|Loot|General Drops|Weapon Drops|Corpse drops)$/i;

// ── Multiplicateurs mesurés (page « Combat Mechanics », tableaux par famille)
const mesures = {}, mesuresSans = [];
const MECA = C.mecaniques?.text || "";
{
  const fam = sections(MECA).filter((s) => s.niveau === 3);
  for (const s of fam) {
    const prefixe = { Fell: ["Fell ", "Shroud ", "Fell Critter "], Wildlife: [""], Scavenger: ["Scavenger "], Vukah: ["Vukah "], Hollow: ["Hollow "], Drak: ["Drak "] }[s.titre] || [""];
    for (const ligne of s.texte.split(/\n\|-/)) {
      const cells = ligne.replace(/^\s*\|\s*/, "").split("||").map((x) => x.trim());
      if (cells.length !== 9 || /^!/.test(ligne.trim())) continue;
      const lien = cells[0].match(/\[\[([^\]|]+)/), libelle = clean(cells[0]);
      const candidats = [lien?.[1], ...prefixe.map((p) => p + libelle), libelle].filter(Boolean);
      const titre = candidats.find((t) => C.pages[t] && infobox(C.pages[t].text));
      const v = {};
      cells.slice(1).forEach((x, k) => { const typ = ["Blunt", "Cutting", "Piercing", "Poison", "Fire", "Ice", "Shock", "Shroud"][k]; if (/^immune$/i.test(x)) v[typ] = 0; else if (/^\d+(\.\d+)?$/.test(x)) v[typ] = Number(x); else if (/^\d/.test(x)) v[typ] = x; });
      if (!Object.keys(v).length) continue;
      if (titre) mesures[titre] = v; else mesuresSans.push(`${s.titre} / ${libelle}`);
    }
  }
}

// ── Noms officiels du wiki français (correspondance par l'image de l'infobox, ou par le champ id)
const imgKey = (f) => String(f || "").split(",")[0].split(":")[0].replace(/_/g, " ").trim().toLowerCase();
const frParImage = {}, frParId = {};
for (const [titre, p] of Object.entries(C.fr || {})) {
  const ib = infobox(p.text, "Infobox/NPC");
  if (!ib) continue;
  const nom = ib.champs.title || ib.champs.titre || titre;
  if (ib.champs.images) frParImage[imgKey(ib.champs.images)] = nom;
  const id = ib.champs.id || ib.champs.ID;
  if (id) frParId[id.trim()] = nom;
}

// ── Créatures
const creatures = [];
const ignorees = [];
for (const [titre, p] of Object.entries(C.pages).sort((a, b) => a[0].localeCompare(b[0]))) {
  const ib = p.missing ? null : infobox(p.text);
  if (!ib) { ignorees.push(titre); continue; }
  const f = ib.champs;
  const reste = p.text.slice(ib.fin);
  const secs = sections(reste);
  // Introduction, sans la phrase générique « X is an enemy in Enshrouded. », les tableaux et titres mal formés du wiki
  let intro = propre(clean(sansTableaux((secs.length ? reste.slice(0, reste.search(/^==/m)) : reste).replace(/\{\{Bestiary\}\}/gi, ""))))
    .replace(/^(?:The )?[^\n]+? is an? (?:enemy|boss|miniboss|mini-boss|creature) in Enshrouded\.\s*/i, "")
    .replace(/^The defense labels above describe the wild animal\.$/m, "");
  // « In their normal state, variants differ in their defenses: Ice (Neutral or Effective); Shroud (Resisted or Neutral). »
  // → valeurs possibles selon la variante, affichées dans le tableau des résistances
  const variantes = {};
  intro = intro.replace(/In their normal state, variants differ in their defenses:\s*([^\n]+?)\.(?=\s|$)/i, (_, liste) => {
    for (const m of liste.matchAll(/(\w+) \(([^)]+)\)/g)) { const vals = m[2].split(/ or /).map((x) => x.trim()).filter((x) => VALEURS.has(x)); if (TYPES.includes(m[1]) && vals.length > 1) variantes[m[1]] = vals; }
    return "";
  }).replace(/\n{3,}/g, "\n\n").trim();
  const degats = {};
  for (const ty of TYPES) { const v = (f[ty] || "").replace(/\s+/g, " ").trim(); if (VALEURS.has(v)) degats[ty] = v; }
  const combat = secs.filter((s) => COMBAT.test(s.titre)).map((s) => ({ titre: s.titre, texte: propre(clean(sansTableaux(s.texte).replace(/^\s*[*#]+\s*/gm, "• ")).replace(/\s*• /g, "\n• ")) }))
    .filter((s) => s.texte);
  // Butin : {{ItemsLine|item=…|quantity=…|source=…}} ; « Unique Drops » = butin propre à un lieu
  const butin = [];
  for (const s of secs) {
    const unique = /unique/i.test(s.titre);
    if (!unique && !BUTIN.test(s.titre)) continue;
    for (const corps of modeles(s.texte, "ItemsLine")) {
      const a = Object.fromEntries(argsHaut(corps).map((x) => x.split("=")).filter((x) => x.length >= 2).map(([k, ...v]) => [k.trim(), v.join("=").trim()]));
      if (!a.item) continue;
      const src = a.source || "";
      butin.push({ nom: a.item, quantite: a.quantity || null, ...(unique ? { lieu: clean(src).replace(/\s*\bDrop$/i, "").replace(/^Drop\s*-\s*/i, "") || null } : { condition: /conditional/i.test(src) ? (/variant/i.test(src) ? "variantes" : "conditionnel") : null }) });
    }
  }
  const regions = (f.Region || "").split(",").map((x) => clean(x)).filter(Boolean);
  const cats = (p.cats || []).map((c) => c.replace(/^Category:/, ""));
  const nomFr = frParId[titre] || frParImage[imgKey(f.images)] || null;
  creatures.push({
    id: slug(titre), nom: titre, wiki: url(titre), wikiMaj: p.ts?.slice(0, 10) || null, statut: p.ts && p.ts.slice(0, 10) >= RELEASE_10 ? "w10" : "pre",
    comportement: f.Behavior || null, categorie: CATEGORIE[f.Behavior] || null, faction: f.Faction || null,
    boss: cats.includes("Bosses") || undefined,
    apprivoisable: f.Tameable ? /^yes$/i.test(f.Tameable) : undefined, coeurs: f.Hearts ? Number(f.Hearts) || f.Hearts : undefined,
    regions, degats, variantes: Object.keys(variantes).length ? variantes : undefined, mesures: mesures[titre], description: intro || undefined, combat: combat.length ? combat : undefined,
    butin: butin.length ? butin : undefined, imageWiki: p.image || undefined, nomFr: nomFr || undefined
  });
}

// Identifiants uniques
const vus = new Set();
for (const c of creatures) { if (vus.has(c.id)) throw new Error("Identifiant en double : " + c.id); vus.add(c.id); }

const meta = {
  collecte: C.fetched.slice(0, 10), source: WIKI + "Bestiary",
  mecaniques: C.mecaniques ? { url: url("Combat Mechanics"), maj: C.mecaniques.ts?.slice(0, 10) || null } : null,
  wikiFr: Object.keys(C.fr || {}).length ? "https://enshrouded.wiki.gg/fr/wiki/Bestiaire" : null
};
writeFileSync(join(root, "data", "bestiaire.js"),
  "// Bestiaire généré depuis enshrouded.wiki.gg par scripts/build-bestiaire.mjs — ne pas modifier à la main.\n" +
  "// Notes rédigées et recoupements : data/bestiaire-notes.js. Valeurs de dégâts = termes de l'infobox du wiki (Effective, Resisted…).\n" +
  `// Collecte : ${C.fetched}. statut « w10 » = page modifiée depuis la sortie 1.0 (${RELEASE_10}), « pre » = avant.\n` +
  "window.ENS = window.ENS || {};\nwindow.ENS.bestiaire = " + JSON.stringify({ meta, creatures }) + ";\n");
writeFileSync(join(root, ".collect", "creatures-download.json"), JSON.stringify(creatures.filter((c) => c.imageWiki).map((c) => ({ id: c.id, url: c.imageWiki })), null, 1));

const n = (fn) => creatures.filter(fn).length;
console.log(`Bestiaire : ${creatures.length} créatures (${n((c) => c.categorie === "hostile")} hostiles, ${n((c) => c.categorie === "passive")} passives, ${n((c) => c.categorie === "neutre")} neutres, ${n((c) => !c.categorie)} sans comportement) ; ${n((c) => c.boss)} boss.`);
console.log(`  résistances renseignées : ${n((c) => Object.keys(c.degats).length === 8)} complètes, ${n((c) => Object.keys(c.degats).length && Object.keys(c.degats).length < 8)} partielles, ${n((c) => !Object.keys(c.degats).length)} absentes`);
console.log(`  pages modifiées depuis la 1.0 : ${n((c) => c.statut === "w10")} ; multiplicateurs mesurés : ${Object.keys(mesures).length} créatures (page du ${meta.mecaniques?.maj}) ; noms du wiki français : ${n((c) => c.nomFr)} ; images : ${n((c) => c.imageWiki)}`);
if (mesuresSans.length) console.log(`  lignes de « Combat Mechanics » sans page de créature : ${mesuresSans.join(", ")}`);
if (ignorees.length) console.log(`  pages sans infobox ignorées : ${ignorees.join(", ")}`);
