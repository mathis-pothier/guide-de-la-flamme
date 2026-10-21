// Images des blocs de construction (onglet Construction).
// 1. Icône de la page du bloc sur enshrouded.wiki.gg (wiki officiel) quand le wiki répond ;
// 2. sinon capture de l'établi du wiki Fandom (enshrouded.fandom.com) : le rendu du bloc y est recadré par CSS.
// Produit images/blocs/<slug>.<ext> et data/blocs-images.js. Usage : node scripts/fetch-block-images.mjs [--force]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(readFileSync(join(root, "data", "construction.js"), "utf8"), ctx);
const blocs = ctx.window.ENS.construction.blocs;
const force = process.argv.includes("--force");
const UA = { "User-Agent": "guide-de-la-flamme/1.0 (https://github.com/mathis-pothier/guide-de-la-flamme)" };
const BROWSER = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36", Referer: "https://enshrouded.fandom.com/", Accept: "image/avif,image/webp,image/*,*/*" };
const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const norm = (s) => s.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z]+/g, " ").replace(/\bstones?\b/g, "stone").trim();
// Noms différents entre le wiki officiel et le wiki Fandom.
const ALIAS = { "temple stone": "vukah temple stone" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const kind = (b) => b[0] === 0xff && b[1] === 0xd8 ? "jpg" : b.subarray(1, 4).toString() === "PNG" ? "png" : b.subarray(8, 12).toString() === "WEBP" ? "webp" : null;

async function json(url, headers = UA) {
  for (let i = 0; i < 3; i++) {
    try { const r = await fetch(url, { headers }); const t = await r.text(); if (r.ok && t.startsWith("{")) return JSON.parse(t); } catch { /* nouvel essai */ }
    await sleep(1500 * (i + 1));
  }
  return null;
}
async function bin(url, headers) {
  for (let i = 0; i < 3; i++) {
    try { const r = await fetch(url, { headers }); const b = Buffer.from(await r.arrayBuffer()); if (r.ok && kind(b)) return b; } catch { /* nouvel essai */ }
    await sleep(1000 * (i + 1));
  }
  return null;
}

// 1) wiki.gg : image principale de la page de chaque bloc
const names = blocs.map((b) => b.nom.replace(/\s*\(.*\)$/, ""));
const wikiImg = {};
let wikiUp = false;
for (let k = 0; k < names.length; k += 40) {
  const t = names.slice(k, k + 40);
  const j = await json("https://enshrouded.wiki.gg/api.php?format=json&redirects=1&prop=pageimages&piprop=original&titles=" + encodeURIComponent(t.join("|")));
  if (!j) break;
  wikiUp = true;
  const map = (x) => { for (const n of j.query.normalized || []) if (n.from === x) x = n.to; for (const r of j.query.redirects || []) if (r.from === x) x = r.to; return x; };
  const P = Object.fromEntries(Object.values(j.query.pages).map((p) => [p.title, p.original?.source]));
  t.forEach((n) => { if (P[map(n)]) wikiImg[n] = { url: P[map(n)], page: "https://enshrouded.wiki.gg/wiki/" + encodeURIComponent(map(n).replace(/ /g, "_")) }; });
}
console.log(wikiUp ? `wiki.gg : ${Object.keys(wikiImg).length} icônes trouvées` : "wiki.gg indisponible : repli sur le wiki Fandom");

// 2) Fandom : captures de l'établi « Blocks - <Catégorie> - <Nom> - Workbench.jpg »
const fandom = {};
let cont = "", files = [];
do {
  const j = await json("https://enshrouded.fandom.com/api.php?format=json&action=query&list=allimages&ailimit=500&aiprop=url|size&aiprefix=Blocks_-_" + cont);
  if (!j) break;
  files = files.concat(j.query.allimages);
  cont = j.continue ? "&aicontinue=" + encodeURIComponent(j.continue.aicontinue) : "";
} while (cont);
for (const f of files) {
  const m = f.name.match(/^Blocks_-_[^-]+_-_(.+)_-_Workbench\./);
  if (m) fandom[norm(m[1].replace(/_/g, " "))] = { url: f.url, page: f.descriptionurl, l: f.width, h: f.height };
}
console.log(`Fandom : ${Object.keys(fandom).length} captures de blocs`);

mkdirSync(join(root, "images", "blocs"), { recursive: true });
const out = {};
let dl = 0;
for (const [i, b] of blocs.entries()) {
  const n = names[i], s = slug(n);
  const w = wikiImg[n];
  // Correspondance exacte uniquement (une approximation donnait l'image du Limestone Block au Shell Limestone Block).
  const fd = fandom[norm(n)] || fandom[ALIAS[norm(n)]];
  const pick = w ? { ...w, type: "icone", src: "wiki-building", headers: UA } : fd ? { ...fd, type: "capture", src: "fandom-blocks", headers: BROWSER } : null;
  if (!pick) continue;
  const prev = ["png", "jpg", "webp"].map((e) => `images/blocs/${s}-${pick.type}.${e}`).find((p) => existsSync(join(root, p)));
  let file = prev;
  if (!prev || force) {
    const buf = await bin(pick.url, pick.headers);
    if (!buf) { console.log("échec :", n); continue; }
    file = `images/blocs/${s}-${pick.type}.${kind(buf)}`;
    writeFileSync(join(root, file), buf);
    dl++;
    await sleep(150);
  }
  out[b.nom] = { fichier: file, type: pick.type, page: pick.page, source: pick.src };
}
writeFileSync(join(root, "data", "blocs-images.js"),
  "// Images des blocs de construction — généré par scripts/fetch-block-images.mjs, ne pas modifier à la main.\n" +
  "// type « icone » : icône du wiki officiel ; type « capture » : capture de l'établi (wiki Fandom), recadrée par CSS sur le rendu du bloc.\n" +
  "window.ENS = window.ENS || {};\nwindow.ENS.blocsImages = " + JSON.stringify(out, null, 1) + ";\n");
const missing = blocs.filter((b) => !out[b.nom]).map((b) => b.nom);
console.log(`${Object.keys(out).length}/${blocs.length} blocs avec image (${dl} téléchargées). Sans image : ${missing.join(", ") || "aucun"}`);
