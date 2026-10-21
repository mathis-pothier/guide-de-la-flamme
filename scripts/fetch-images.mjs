// Copie locale des images du wiki (© Keen Games, crédits dans le README) : icônes d'objets, tuiles et icônes de la carte.
// Prérequis : node scripts/build-data.mjs (produit .collect/download-list.json).
// Usage : node scripts/fetch-images.mjs          → ne télécharge que ce qui manque
//         node scripts/fetch-images.mjs --force  → retélécharge tout
// Produit data/images.js : liste des images présentes sur le disque (id → fichier + dimensions).
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const list = JSON.parse(readFileSync(join(root, ".collect", "download-list.json"), "utf8"));
const force = process.argv.includes("--force");
const UA = { "User-Agent": "guide-de-la-flamme-local/1.0" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function download(url, dest, magic) {
  if (!force && existsSync(dest)) return 0;
  for (let i = 0; i < 4; i++) {
    try {
      const res = await fetch(url, { headers: UA });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        if (magic && !magic(buf)) return -1;
        writeFileSync(dest, buf);
        return buf.length;
      }
      if (res.status === 404) return -1;
    } catch { /* nouvel essai */ }
    await sleep(1000 * (i + 1));
  }
  return -1;
}
const isPng = (b) => b.subarray(1, 4).toString() === "PNG";
const isJpg = (b) => b[0] === 0xff && b[1] === 0xd8;
const isImg = (b) => isPng(b) || isJpg(b) || b.subarray(8, 12).toString() === "WEBP";

const jobs = [
  ...list.items.map((i) => ({ url: i.url, dest: join(root, "images", i.id + ".png"), magic: isImg, kind: "objet" })),
  ...list.tiles.filter((t) => t.url).map((t) => ({ url: t.url, dest: join(root, "images", "map", "tiles", t.f + ".jpg"), magic: isJpg, kind: "tuile" })),
  ...list.icons.map((i) => ({ url: i.url, dest: join(root, i.file), magic: isPng, kind: "icône" }))
];
mkdirSync(join(root, "images", "map", "tiles"), { recursive: true });
let bytes = 0, done = 0, failed = [];
const queue = [...jobs];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const j = queue.shift();
    const n = await download(j.url, j.dest, j.magic);
    if (n < 0) failed.push(`${j.kind} ${j.url}`); else { bytes += n; if (n) done++; }
    if (n > 0) await sleep(120);
  }
}));

// Inventaire des images d'objets présentes (y compris celles du premier lot).
const dims = (buf) => isPng(buf) ? [buf.readUInt32BE(16), buf.readUInt32BE(20)] : (() => {
  for (let i = 2; i < buf.length;) { if (buf[i] !== 0xff) return [0, 0]; const m = buf[i + 1], len = buf.readUInt16BE(i + 2); if (m >= 0xc0 && m <= 0xc3) return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)]; i += 2 + len; }
  return [0, 0];
})();
const out = {};
let total = 0;
for (const f of readdirSync(join(root, "images"))) {
  if (!/\.png$/.test(f)) continue;
  const buf = readFileSync(join(root, "images", f));
  const [l, h] = dims(buf);
  total += buf.length;
  out[f.replace(/\.png$/, "")] = { fichier: "images/" + f, l, h };
}
for (const f of readdirSync(join(root, "images", "map", "tiles"))) total += statSync(join(root, "images", "map", "tiles", f)).size;
writeFileSync(join(root, "data", "images.js"),
  "// Images d'objets (© Keen Games) copiées depuis enshrouded.wiki.gg — crédits dans le README.\n" +
  "// Généré par scripts/fetch-images.mjs — ne pas modifier à la main.\n" +
  "window.ENS = window.ENS || {};\nwindow.ENS.images = " + JSON.stringify(out) + ";\n");
console.log(`${done} fichiers téléchargés (${(bytes / 1048576).toFixed(1)} Mo). Images d'objets disponibles : ${Object.keys(out).length}. Poids total du dossier images : ${(total / 1048576).toFixed(1)} Mo.`);
if (failed.length) console.log(`Échecs (${failed.length}) :\n` + failed.slice(0, 20).join("\n"));
