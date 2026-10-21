// Collecte du wiki (enshrouded.wiki.gg) sans navigateur : même contenu que scripts/collect.html.
// Produit .collect/wiki-items.json et .collect/wiki-maps.json, puis :
//   node scripts/build-data.mjs && node scripts/fetch-images.mjs && node scripts/validate.mjs
// Usage : node scripts/collect.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const API = "https://enshrouded.wiki.gg/api.php?format=json&";
const UA = { "User-Agent": "guide-de-la-flamme/1.0 (https://github.com/mathis-pothier/guide-de-la-flamme)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (m) => console.log(m);

async function api(q, tries = 5) {
  let last = "";
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(API + q, { headers: UA });
      const t = await r.text();
      if (r.ok && t.startsWith("{")) return JSON.parse(t);
      // Diagnostic lisible dans le journal de l'Action
      const title = (t.match(/<title>([^<]*)<\/title>/i) || [])[1] || "";
      last = /maintenance/i.test(title) ? `wiki.gg en maintenance (HTTP ${r.status})`
        : r.status === 403 || r.status === 429 ? `accès refusé ou limité par le wiki (HTTP ${r.status}${title ? ", « " + title + " »" : ""})`
        : `réponse inattendue (HTTP ${r.status}${title ? ", « " + title + " »" : ""})`;
    } catch (e) { last = "connexion impossible (" + (e.cause?.code || e.message) + ")"; }
    console.log(`  essai ${i + 1}/${tries} : ${last}`);
    await sleep(1500 * (i + 1));
  }
  throw new Error(`Collecte impossible — ${last}. Rien n'a été modifié ; la prochaine collecte prendra le relais.`);
}
async function members(cat, depth = 2, seen = new Set()) {
  if (seen.has(cat)) return [];
  seen.add(cat);
  let out = [], cont = "";
  do {
    const j = await api("action=query&list=categorymembers&cmlimit=500&cmtitle=" + encodeURIComponent(cat) + cont);
    for (const m of j.query.categorymembers) {
      if (m.ns === 0) out.push({ title: m.title, cat });
      else if (m.ns === 14 && depth > 0) out = out.concat(await members(m.title, depth - 1, seen));
    }
    cont = j.continue ? "&cmcontinue=" + encodeURIComponent(j.continue.cmcontinue) : "";
  } while (cont);
  return out;
}
async function pages(titles) {
  const res = {};
  for (let k = 0; k < titles.length; k += 50) {
    const batch = titles.slice(k, k + 50);
    const j = await api("action=query&redirects=1&prop=revisions|pageimages&piprop=original&rvprop=content|timestamp&rvslots=main&titles=" + encodeURIComponent(batch.join("|")));
    for (const p of Object.values(j.query.pages)) {
      const r = p.revisions?.[0];
      res[p.title] = { ts: r?.timestamp, text: r?.slots.main["*"] || "", image: p.original?.source || null, missing: p.missing !== undefined };
    }
    for (const rd of j.query.redirects || []) if (res[rd.to]) res[rd.to].from = (res[rd.to].from || []).concat(rd.from);
    log(`  pages ${Math.min(k + 50, titles.length)}/${titles.length}`);
    await sleep(300);
  }
  return res;
}

const CATS = ["Category:Melee Weapons", "Category:Ranged Weapons", "Category:Magic Weapons", "Category:Lore Weapons",
  "Category:Armor Set", "Category:Magic Armor", "Category:Melee Armor", "Category:Ranged Armor",
  "Category:Rings", "Category:Shields", "Category:Staff Charges"];
const list = [];
for (const c of CATS) { const m = await members(c); log(`${c} : ${m.length}`); list.push(...m); }
const byTitle = {};
for (const m of list) (byTitle[m.title] ||= new Set()).add(m.cat);
const titles = Object.keys(byTitle);
log(`Total pages uniques : ${titles.length}`);
if (titles.length < 500) throw new Error(`Seulement ${titles.length} pages : collecte incomplète, arrêt sans rien écrire.`);
const content = await pages(titles);
for (const t of titles) if (content[t]) content[t].cats = [...byTitle[t]];

const MAPS = ["Map:Embervale", "Map:Embervale/Background", "Map:Embervale/Groups", "Map:Embervale/Main", "Map:Embervale/Collectibles2",
  "Map:Embervale/Lore", "Map:Embervale/Lore-Groups", "Map:Embervale/Quests", "Map:Embervale/Collectibles",
  // Pages de biomes (niveau de zone, qui détermine le niveau du butin) et pages de référence
  "Springlands", "Revelwood", "Nomad Highlands", "Kindlewastes", "Albaneve Summits", "Veilwater Basin", "Cinder's Cradle", "Chests", "1.0 Update"];
const maps = await pages(MAPS);
let bg = {};
try { bg = JSON.parse(maps["Map:Embervale/Background"].text); } catch { log("fond de carte illisible"); }
const files = new Set();
JSON.stringify(bg).replace(/"image"\s*:\s*"([^"]+)"/g, (_, f) => files.add(f));
let groups = {};
try { groups = JSON.parse(maps["Map:Embervale/Groups"].text).groups || {}; } catch { /* rien */ }
Object.values(groups).forEach((g) => g.icon && files.add(g.icon));
const urls = {};
const fl = [...files];
for (let k = 0; k < fl.length; k += 50) {
  const j = await api("action=query&prop=imageinfo&iiprop=url|size|timestamp&titles=" + encodeURIComponent(fl.slice(k, k + 50).map((f) => "File:" + f).join("|")));
  for (const p of Object.values(j.query.pages)) if (p.imageinfo) urls[p.title.replace(/^File:/, "")] = p.imageinfo[0];
}
log(`Fichiers de carte : ${Object.keys(urls).length}/${fl.length}`);

const fetched = new Date().toISOString();
mkdirSync(join(root, ".collect"), { recursive: true });
writeFileSync(join(root, ".collect", "wiki-items.json"), JSON.stringify({ fetched, pages: content }));
writeFileSync(join(root, ".collect", "wiki-maps.json"), JSON.stringify({ fetched, pages: maps, files: urls }));
log("TERMINÉ");
