// Transforme la collecte brute du wiki (.collect/*.json, produite par scripts/collect.html) en données du site :
//   data/catalog.js : catalogue complet (armes, pièces d'armure, sets, anneaux, boucliers, sorts)
//   data/map.js     : carte (tuiles, marqueurs utiles, emplacements des objets)
// Usage : node scripts/build-data.mjs
// Règle : aucune valeur n'est inventée. Un champ absent du wiki reste absent.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const W = JSON.parse(readFileSync(join(root, ".collect", "wiki-items.json"), "utf8"));
const M = JSON.parse(readFileSync(join(root, ".collect", "wiki-maps.json"), "utf8"));
const RELEASE_10 = "2026-10-15";
const WIKI = "https://enshrouded.wiki.gg/wiki/";

// ── Outils wikitext
function templates(text, names) {
  const out = [];
  const re = new RegExp("\\{\\{\\s*(" + names.map((n) => n.replace(/[ _]/g, "[ _]")).join("|") + ")\\s*[|\\n}]", "gi");
  let m;
  while ((m = re.exec(text))) {
    let depth = 0, i = m.index;
    for (; i < text.length; i++) {
      if (text.startsWith("{{", i)) { depth++; i++; } else if (text.startsWith("}}", i)) { depth--; i++; if (!depth) break; }
    }
    const body = text.slice(m.index + 2, i - 1);
    const parts = splitTop(body).slice(1);
    const params = {}, pos = [];
    for (const p of parts) { const k = p.match(/^\s*([^=]+?)\s*=([\s\S]*)$/); if (k && !/\{\{|\[\[/.test(k[1])) params[k[1].trim()] = k[2].trim(); else pos.push(p.trim()); }
    out.push({ name: m[1], params, pos });
  }
  return out;
}
function splitTop(s) {
  const parts = []; let depth = 0, cur = "";
  for (let i = 0; i < s.length; i++) {
    const two = s.slice(i, i + 2);
    if (two === "{{" || two === "[[") { depth++; cur += two; i++; continue; }
    if ((two === "}}" || two === "]]") && depth) { depth--; cur += two; i++; continue; }
    if (s[i] === "|" && !depth) { parts.push(cur); cur = ""; continue; }
    cur += s[i];
  }
  parts.push(cur);
  return parts;
}
function clean(s) {
  if (!s) return "";
  return s
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\{\{\s*MapLink\s*\|([^}]*)\}\}/gi, (_, a) => { const p = a.split("|").map((x) => x.trim()).filter((x) => !/^(icon|size|tab|map)\s*=/i.test(x)); return p[1] || p[0]; })
    .replace(/\{\{\s*item\+icon\w*\s*\|([^}|]*)[^}]*\}\}/gi, "$1")
    .replace(/\{\{\s*(?:SUBPAGENAME|PAGENAME)\s*\}\}/g, "")
    .replace(/\{\{[^{}]*\}\}/g, "")
    .replace(/\[\[(?:File|Image|Fichier):[^\]]*\]\]/gi, "")
    .replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, "$1")
    .replace(/\[\[([^\]]*)\]\]/g, "$1")
    .replace(/'''?/g, "").replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "")
    .replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}
function section(text, names) {
  const re = new RegExp("^==+\\s*(" + names.join("|") + ")\\s*==+\\s*$", "im");
  const m = text.match(re);
  if (!m) return "";
  const rest = text.slice(m.index + m[0].length);
  const end = rest.search(/^==[^=]/m);
  return end < 0 ? rest : rest.slice(0, end);
}
const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const num = (v) => { const m = String(v ?? "").match(/-?\d+(?:[.,]\d+)?/); return m ? Number(m[0].replace(",", ".")) : undefined; };

// ── Traductions courtes
const RARITY = { common: "Commune", uncommon: "Peu commune", rare: "Rare", epic: "Épique", legendary: "Légendaire" };
const rar = (r) => RARITY[String(r || "").trim().toLowerCase()];
const WTYPE = {
  "one-handed sword": "Épée à une main", "one-handed axe": "Hache à une main", "one-handed club": "Massue à une main", "one-handed mace": "Massue à une main",
  "two-handed axe": "Hache à deux mains", "two-handed hammer": "Marteau à deux mains", "two-handed club": "Massue à deux mains", "two-handed greatsword": "Espadon",
  "two-handed sword": "Espadon", greatsword: "Espadon", daggers: "Dagues", dagger: "Dagues", bow: "Arc", wand: "Baguette", staff: "Bâton"
};
const SLOT = { "head armor": "Tête", helmet: "Tête", "upper body armor": "Torse", "chest armor": "Torse", "hand armor": "Mains", "arm armor": "Mains", gloves: "Mains",
  "lower body armor": "Jambes", "leg armor": "Jambes", "feet armor": "Pieds", "foot armor": "Pieds", boots: "Pieds" };
const CLASSE = { magic: "Magie", melee: "Mêlée", ranged: "Distance" };
const PLACE = { craftable: "Fabrication", "lore weapon": "Arme de lore", "hollow halls loot": "Butin des Hollow Halls", "shroud lair loot": "Butin de repaire du Voile",
  "fell enemy drop": "Butin d'ennemi Fell", "scavenger enemy drop": "Butin de Scavenger", "vukah enemy drop": "Butin de Vukah", "drak enemy drop": "Butin de Drak" };
const place = (s) => s.split(/\s*,\s*/).map((p) => PLACE[p.toLowerCase()] || p).join(", ");

// Niveau des zones : champ « Biome Level » des pages de biomes du wiki officiel (le butin prend le niveau de sa zone :
// page « Chests » du wiki et notes 1.0). Cinder's Cradle n'a pas encore de page wiki : PinDrop (fichiers 1.0).
// Le champ « level » des armes du wiki sert à son calcul de dégâts (213 armes sur 284 à 40) : ce n'est pas le niveau de l'objet.
const BIOMES = ["Springlands", "Revelwood", "Nomad Highlands", "Kindlewastes", "Albaneve Summits", "Veilwater Basin", "Cinder's Cradle"];
const REGION_LV = {}, REGION_SRC = {};
for (const b of BIOMES) {
  const m = (M.pages[b]?.text || "").match(/Biome Level[^0-9]*(\d+)\s*-\s*(\d+)/);
  if (m) { REGION_LV[b] = `${m[1]}–${m[2]}`; REGION_SRC[b] = "wiki-biomes"; }
}
if (!REGION_LV["Cinder's Cradle"]) { REGION_LV["Cinder's Cradle"] = "46–50"; REGION_SRC["Cinder's Cradle"] = "pd-biomes"; }
// Objet présent dans plusieurs zones : de la plus basse à la plus haute.
const regionLevel = (...txt) => {
  const t = txt.filter(Boolean).join(" ");
  const rs = BIOMES.filter((k) => REGION_LV[k] && t.includes(k));
  if (!rs.length) return {};
  const lo = Math.min(...rs.map((r) => Number(REGION_LV[r].split("–")[0]))), hi = Math.max(...rs.map((r) => Number(REGION_LV[r].split("–")[1])));
  return { niveauRegion: `${lo}–${hi}`, region: rs.join(", "), niveauSource: [...new Set(rs.map((r) => REGION_SRC[r]))] };
};

// ── Marqueurs de carte
const markers = {};
for (const page of ["Map:Embervale/Main", "Map:Embervale/Lore", "Map:Embervale/Collectibles2", "Map:Embervale/Quests"]) {
  let j; try { j = JSON.parse(M.pages[page].text); } catch { continue; }
  for (const [g, arr] of Object.entries(j.markers || {})) for (const mk of arr) {
    const id = mk.id || (g + ":" + mk.name);
    markers[id] = { id, g, nom: clean(mk.name || ""), x: mk.x, y: mk.y, desc: clean(mk.description || "").slice(0, 200), page: page.split("/")[1] };
  }
}
// Correspondance par nom de lieu : uniquement les noms uniques (un nom générique comme « Shroud Lair » existe à plusieurs endroits).
const nameCount = {};
for (const mk of Object.values(markers)) nameCount[mk.nom.toLowerCase()] = (nameCount[mk.nom.toLowerCase()] || 0) + 1;
const genericNames = new Set(Object.values(markers).map((m) => m.g.replace(/_/g, " ").toLowerCase()));
const markerByName = {};
for (const mk of Object.values(markers)) {
  const n = mk.nom.toLowerCase();
  if (n.length > 5 && !/^Lore/.test(mk.g) && nameCount[n] === 1 && !genericNames.has(n) && !/^(catacombs|cave passage|cyclops cave)$/.test(n)) markerByName[n] = mk;
}

// ── Classement par style (éditorial, heuristique documentée dans l'interface)
function stylesFor(it) {
  const t = (it.typeEn || "").toLowerCase(), e = [...(it.effets || []), ...(it.atouts || [])].join(" ").toLowerCase(), c = it.classe;
  const s = new Set();
  if (it.categorie === "arme") {
    if (/two-handed|greatsword/.test(t)) s.add("barbare");
    else if (/one-handed/.test(t)) { s.add("guerrier"); s.add("tank"); }
    if (/dagger/.test(t)) s.add("assassin");
    if (/bow/.test(t)) s.add("rodeur");
    if (/wand/.test(t)) { s.add("mage-bataille"); s.add("invocateur"); s.add("hybride"); }
    if (/staff/.test(t)) { s.add("sorcier"); s.add("invocateur"); if (/heal|spiritual|renewal/.test(e)) s.add("soigneur"); }
  } else if (it.categorie === "sort") {
    if (/heal/i.test(it.nom + e)) s.add("soigneur"); else { s.add("sorcier"); s.add("mage-bataille"); }
    if (/summon|totem|skeleton/i.test(it.nom)) s.add("invocateur");
  } else if (it.categorie === "bouclier") {
    if (/ward|garde/i.test(it.nom + (it.typeEn || "") + it.type)) { s.add("mage-bataille"); s.add("hybride"); } else { s.add("tank"); s.add("guerrier"); s.add("hybride"); }
  } else {
    if (c === "Mêlée") { s.add("guerrier"); s.add("tank"); s.add("barbare"); }
    if (c === "Distance") { s.add("rodeur"); s.add("assassin"); }
    if (c === "Magie") { s.add("mage-bataille"); s.add("sorcier"); s.add("soigneur"); s.add("invocateur"); }
    if (/wand/.test(e)) { s.add("mage-bataille"); s.add("hybride"); }
    if (/staff|spell/.test(e)) s.add("sorcier");
    if (/heal/.test(e)) s.add("soigneur");
    if (/dagger|backstab|sneak/.test(e)) s.add("assassin");
    if (/bow|ranged|headshot|skillshot/.test(e)) s.add("rodeur");
    if (/two-handed/.test(e)) s.add("barbare");
    if (/one-handed|block|parry/.test(e)) s.add("guerrier");
    if (it.categorie === "anneau" && !s.size) ["guerrier", "tank", "barbare", "rodeur", "assassin", "mage-bataille", "sorcier", "soigneur", "invocateur", "hybride"].forEach((x) => s.add(x));
  }
  return [...s];
}
const ELEMENTS = [["feu", /fire|flame|burn|ember|pyre/i], ["glace", /ice|frost|snow|cold|hail/i], ["foudre", /shock|lightning|thunder|storm/i], ["voile", /shroud|dark|night/i], ["poison", /poison|venom|acid|toxic/i], ["soin", /heal|health regen|renewal|life/i]];
const elementOf = (it) => (ELEMENTS.find(([, re]) => re.test([it.nom, ...(it.atouts || []), ...(it.effets || []), it.typeDegats || ""].join(" "))) || [])[0];

// ── Lecture des pages
const items = [], sets = [];
for (const [title, pg] of Object.entries(W.pages)) {
  if (pg.missing || !pg.text) continue;
  const text = pg.text, cats = pg.cats || [];
  const tp = (names) => templates(text, names)[0]?.params || {};
  const info = { ...tp(["Item Infobox", "Item_Infobox", "Armor Infobox"]) };
  const base = {
    nom: title, id: slug(title), wiki: WIKI + encodeURIComponent(title.replace(/ /g, "_")), wikiMaj: pg.ts?.slice(0, 10),
    statut: pg.ts && pg.ts.slice(0, 10) >= RELEASE_10 ? "w10" : "pre", image: pg.image || null,
    description: clean(info.description).slice(0, 320) || undefined, verifie: W.fetched.slice(0, 10), sources: ["wiki-catalogue"]
  };
  if (/\{\{\s*Update Needed/i.test(text)) base.note = "Page signalée « mise à jour nécessaire » sur le wiki.";
  const maplinks = [...text.matchAll(/\{\{\s*MapLink\s*\|([^}]*)\}\}/gi)].map((m) => m[1].split("|").map((x) => x.trim()).filter((x) => !/^(icon|size|tab|map)\s*=/i.test(x))[0]);
  const srcSec = clean(section(text, ["Source", "Sources", "Location", "Locations", "How to obtain", "Obtaining"]));
  const crafting = tp(["Crafting"]);
  const lvl = num(info.Level ?? info.level);
  const r = rar(info.Rarity);

  if (cats.includes("Category:Armor Set")) {
    const pieces = (templates(text, ["Armor Set"])[0]?.pos || []).map(clean).filter(Boolean);
    const intro = clean(text.split(/\n==/)[0]);
    sets.push({ ...base, categorie: "set", niveau: num(intro.match(/level (\d+)/i)?.[1]),
      classe: CLASSE[(text.match(/\[\[Armor\/(Magic|Melee|Ranged)/i)?.[1] || "").toLowerCase()],
      pieces: pieces.map(slug), piecesNoms: pieces, resume: intro.slice(0, 280), obtentionEn: srcSec.slice(0, 260) || undefined, marqueurs: maplinks });
    continue;
  }
  const ws = templates(text, ["Weapon Stats"])[0]?.params;
  const as = { ...tp(["Armor Stats", "Armor_Stats"]) };
  const is = tp(["ItemStats"]);
  const effets = Object.keys(as).filter((k) => /^Effects?\d+$/.test(k)).sort().map((k) => clean(as[k]).replace(/^\+\s*/, "+")).filter(Boolean);
  const amelio = ["Common", "Uncommon", "Rare", "Epic", "Legendary"].map((k) => as["Upgrade" + k] ? `${rar(k)} : ${clean(as["Upgrade" + k])}` : null).filter(Boolean);
  let it;
  if (ws) {
    const perks = (ws.perks || "").split(",").map((p) => p.trim()).filter(Boolean);
    const counted = Object.entries(perks.reduce((a, p) => ((a[p] = (a[p] || 0) + 1), a), {})).map(([p, n]) => (n > 1 ? `${p} ×${n}` : p));
    const typeEn = clean(ws.weaponType) || clean(info.Type);
    it = { ...base, categorie: "arme", typeEn, type: WTYPE[typeEn.toLowerCase()] || typeEn, emplacement: "Main", rarete: r, niveauWiki: num(ws.level),
      stats: Object.fromEntries(Object.entries({ parade: num(ws.parryPower), vitesse: ws.attackSpeed || undefined, tension: ws.drawSpeed || undefined, vitesseFleche: ws.arrowSpeed || undefined, regenMana: ws.manaRegeneration || undefined, surcharge: ws.overcharge || undefined }).filter(([, v]) => v !== undefined && v !== "")),
      atouts: counted.length ? counted : undefined, obtention: ws.source ? place(clean(ws.source)) : undefined,
      attribut: /bow|dagger/i.test(typeEn) ? "Dextérité" : /wand|staff/i.test(typeEn) ? "Intelligence" : "Force" };
    if (cats.includes("Category:Lore Weapons")) it.lore = true;
  } else if (/armor infobox/i.test(text) || cats.some((c) => /Armor$/.test(c) && c !== "Category:Armor Set")) {
    const typeEn = clean(info.Type);
    it = { ...base, categorie: "armure", typeEn, type: typeEn ? `${SLOT[typeEn.toLowerCase()] || typeEn}` : "Armure", emplacement: SLOT[typeEn.toLowerCase()] || typeEn || undefined,
      rarete: r, niveau: lvl, classe: CLASSE[clean(info.ArmorClass).toLowerCase()] || (cats.find((c) => /Magic Armor/.test(c)) ? "Magie" : cats.find((c) => /Melee Armor/.test(c)) ? "Mêlée" : cats.find((c) => /Ranged Armor/.test(c)) ? "Distance" : undefined),
      stats: Object.fromEntries(Object.entries({ armurePhys: num(as.Physical), armureMag: num(as.Magical) }).filter(([, v]) => v !== undefined)),
      effets: effets.length ? effets : undefined, amelioration: amelio.length ? amelio : undefined,
      setNom: clean(text.match(/part of the \[\[([^\]|]+ Set)/i)?.[1] || "") || undefined,
      obtention: info.Source ? place(clean(info.Source)) : undefined };
  } else if (cats.includes("Category:Rings")) {
    it = { ...base, categorie: "anneau", typeEn: "Ring", type: "Anneau", emplacement: "Anneau", rarete: r, niveau: lvl, effets: effets.length ? effets : undefined, amelioration: amelio.length ? amelio : undefined };
  } else if (cats.includes("Category:Shields")) {
    const typeEn = clean(info.Type) || "Shield";
    const extra = Object.entries(is).filter(([k]) => !/^(Block|Parry Power|Durability)$/i.test(k)).map(([k, v]) => (/^Effects?\d+$/i.test(k) ? clean(v).replace(/^\+\s*/, "+") : `${k} : ${clean(v)}`));
    it = { ...base, categorie: "bouclier", typeEn, type: /ward/i.test(typeEn + title) || extra.some((e) => /mana/i.test(e)) ? "Garde (ward)" : "Bouclier", emplacement: "Main secondaire", rarete: r, niveau: lvl,
      stats: Object.fromEntries(Object.entries({ blocage: num(is.Block), parade: num(is["Parry Power"]), durabilite: num(is.Durability) }).filter(([, v]) => v !== undefined)),
      effets: extra.length ? extra : effets.length ? effets : undefined };
  } else if (cats.includes("Category:Staff Charges")) {
    it = { ...base, categorie: "sort", typeEn: "Spell", type: /eternal/i.test(title) ? "Sort éternel" : "Sort", emplacement: "Bâton", rarete: r, niveau: lvl,
      stats: Object.fromEntries(Object.entries({ degats: num(is.Damage), mana: num(is["Mana Cost"]), incantation: is["Cast Time"] ? clean(is["Cast Time"]) : undefined }).filter(([, v]) => v !== undefined)),
      typeDegats: is["Element Type"] ? clean(is["Element Type"]) : undefined };
  } else continue;

  if (!it.obtention && crafting.Crafter) it.obtention = "Fabrication : " + clean(crafting.Crafter);
  if (srcSec) it.obtentionEn = srcSec.slice(0, 260);
  if (it.niveau == null) Object.assign(it, regionLevel(it.obtention, it.obtentionEn));
  // Emplacements sur la carte : liens MapLink explicites, puis noms de lieux cités dans la provenance.
  const ids = new Set(maplinks.filter((id) => markers[id]));
  for (const txt of [it.obtention, it.obtentionEn]) {
    if (!txt) continue;
    const low = txt.toLowerCase();
    for (const [n, mk] of Object.entries(markerByName)) if (low.includes(n) && !/^(ancient spire|flame shrine)/.test(n)) ids.add(mk.id);
  }
  if (ids.size) it.marqueurs = [...ids];
  it.styles = stylesFor(it);
  const el = elementOf(it); if (el) it.element = el;
  for (const k of Object.keys(it)) if (it[k] === undefined || (Array.isArray(it[k]) && !it[k].length) || (it[k] && typeof it[k] === "object" && !Array.isArray(it[k]) && !Object.keys(it[k]).length)) delete it[k];
  items.push(it);
}
// Rattacher les pièces aux sets
const setBySlug = Object.fromEntries(sets.map((s) => [s.id, s]));
for (const it of items) if (it.setNom) { it.set = slug(it.setNom); delete it.setNom; }
for (const s of sets) {
  const ps = items.filter((i) => i.set === s.id || s.pieces.includes(i.id));
  ps.forEach((p) => { p.set = s.id; });
  s.pieces = ps.map((p) => p.id);
  if (!s.niveau) s.niveau = Math.max(0, ...ps.map((p) => p.niveau || 0)) || undefined;
  if (!s.classe) s.classe = ps.find((p) => p.classe)?.classe;
  s.styles = stylesFor({ ...s, categorie: "armure", effets: ps.flatMap((p) => p.effets || []) });
  const tot = (k) => ps.reduce((a, p) => a + (p.stats?.[k] || 0), 0);
  if (ps.length) s.stats = { armurePhys: tot("armurePhys") || undefined, armureMag: tot("armureMag") || undefined, pieces: ps.length };
  s.type = "Set " + (s.classe ? s.classe.toLowerCase() : "");
  s.rarete = ps.map((p) => p.rarete).filter(Boolean)[0];
  s.marqueurs = [...new Set([...(s.marqueurs || []).filter((id) => markers[id]), ...ps.flatMap((p) => p.marqueurs || [])])];
  if (!s.marqueurs.length) delete s.marqueurs;
  delete s.piecesNoms;
}
const catalog = [...items, ...sets].sort((a, b) => a.nom.localeCompare(b.nom));

// ── Carte : tuiles + marqueurs utiles + régions (repères Ancient Spire)
const bg = JSON.parse(M.pages["Map:Embervale/Background"].text);
const tiles = bg.background.tiles.map((t) => ({ f: t.image.replace(/\.jpg$/, ""), x: t.position[0], y: t.position[1], url: M.files[t.image.replace(/_/g, " ")]?.url }));
// Tous les types de lieux de la carte principale et des objets à collectionner (les notes de lore sont exclues).
const KEEP = [...new Set(["Map:Embervale/Main", "Map:Embervale/Collectibles2"].flatMap((p) => { try { return Object.keys(JSON.parse(M.pages[p].text).markers || {}); } catch { return []; } }))];
const groupPage = Object.fromEntries(["Map:Embervale/Main", "Map:Embervale/Collectibles2"].flatMap((p) => { try { return Object.keys(JSON.parse(M.pages[p].text).markers || {}).map((g) => [g, p.split("/")[1]]); } catch { return []; } }));
const usedIds = new Set(catalog.flatMap((i) => i.marqueurs || []));
// Lieux cités par l'onglet Construction (data/construction.js) : blocs, survivants, emplacements de base.
try { for (const m of readFileSync(join(root, "data", "construction.js"), "utf8").matchAll(/marqueurs: \[([^\]]*)\]/g)) for (const id of m[1].match(/"([^"]+)"/g) || []) usedIds.add(id.slice(1, -1)); } catch { /* pas d'onglet construction */ }
const mapMarkers = Object.values(markers).filter((m) => (KEEP.includes(m.g) || usedIds.has(m.id)) && m.x >= 0 && m.y >= 0 && m.x <= 10240 && m.y <= 10240)
  .map(({ id, g, nom, x, y, desc, page }) => ({ id, g, nom, x, y, desc: desc || undefined, src: page === "Main" ? undefined : page }));
const groups = JSON.parse(M.pages["Map:Embervale/Groups"].text).groups;
const groupInfo = Object.fromEntries(KEEP.map((g) => [g, { page: groupPage[g], nom: groups[g]?.name || g.replace(/_/g, " "), icone: groups[g]?.icon && M.files[groups[g].icon]?.url ? "images/map/" + slug(groups[g].icon.replace(/\.png$/, "")) + ".png" : null, iconeUrl: M.files[groups[g]?.icon]?.url || null }]));
const regions = Object.values(markers).filter((m) => m.g === "Ancient_Spire").map((m) => ({ nom: m.nom.replace(/^Ancient Spire - /, ""), x: m.x, y: m.y }));
const zones = BIOMES.map((b) => ({ nom: b, niveau: REGION_LV[b], source: REGION_SRC[b], maj: M.pages[b]?.ts?.slice(0, 10) }));
const mapData = {
  zones,
  source: WIKI + "Map", fondDate: Object.values(M.files).find((f) => /\d_\d\.jpg/.test(f.url))?.timestamp?.slice(0, 10), marqueursDate: M.pages["Map:Embervale/Main"].ts.slice(0, 10),
  taille: 10240, tuile: 1280, tuiles: tiles.map(({ f, x, y }) => ({ f, x, y })), groupes: groupInfo, marqueurs: mapMarkers, regions
};

writeFileSync(join(root, "data", "catalog.js"),
  "// Catalogue généré depuis enshrouded.wiki.gg par scripts/build-data.mjs — ne pas modifier à la main.\n" +
  `// Collecte : ${W.fetched}. statut « w10 » = page modifiée depuis la sortie 1.0 (${RELEASE_10}), « pre » = avant.\n` +
  "window.ENS = window.ENS || {};\nwindow.ENS.catalog = " + JSON.stringify(catalog) + ";\n");
writeFileSync(join(root, "data", "map.js"),
  "// Carte générée depuis les DataMaps de enshrouded.wiki.gg par scripts/build-data.mjs.\nwindow.ENS = window.ENS || {};\nwindow.ENS.map = " + JSON.stringify(mapData) + ";\n");
writeFileSync(join(root, ".collect", "download-list.json"), JSON.stringify({
  items: catalog.filter((i) => i.image).map((i) => ({ id: i.id, url: i.image })),
  tiles: tiles.map((t) => ({ f: t.f, url: t.url })),
  icons: Object.values(groupInfo).filter((g) => g.iconeUrl).map((g) => ({ file: g.icone, url: g.iconeUrl }))
}, null, 1));

const count = (f) => catalog.filter(f).length;
console.log(`Catalogue : ${catalog.length} entrées — armes ${count((i) => i.categorie === "arme")}, pièces d'armure ${count((i) => i.categorie === "armure")}, sets ${sets.length}, anneaux ${count((i) => i.categorie === "anneau")}, boucliers ${count((i) => i.categorie === "bouclier")}, sorts ${count((i) => i.categorie === "sort")}`);
console.log(`Statut : ${count((i) => i.statut === "w10")} pages modifiées depuis la 1.0, ${count((i) => i.statut === "pre")} avant. Avec image : ${count((i) => i.image)}. Avec emplacement sur la carte : ${count((i) => i.marqueurs)}`);
console.log(`Carte : ${mapMarkers.length} marqueurs, ${tiles.length} tuiles (fond du ${mapData.fondDate}, marqueurs du ${mapData.marqueursDate}), ${regions.length} régions`);
const types = {}; items.filter((i) => i.categorie === "arme").forEach((i) => { types[i.typeEn] = (types[i.typeEn] || 0) + 1; }); console.log("Types d'armes :", types);
const slots = {}; items.filter((i) => i.categorie === "armure").forEach((i) => { slots[i.emplacement] = (slots[i.emplacement] || 0) + 1; }); console.log("Emplacements d'armure :", slots);
