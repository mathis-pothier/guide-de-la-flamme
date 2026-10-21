// Ajoute un numéro de version (?v=…) aux scripts et feuilles de style locaux de index.html et ancien.html.
// GitHub Pages laisse les navigateurs garder les fichiers 10 minutes : sans ce numéro, un visiteur peut recevoir
// le nouvel index.html avec un ancien app.js. À lancer avant chaque commit qui modifie le site :
//   node scripts/stamp-version.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const v = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 12); // AAAAMMJJhhmm (UTC)
for (const name of ["index.html", "ancien.html"]) {
  const file = join(root, name);
  let html = readFileSync(file, "utf8");
  let n = 0;
  html = html.replace(/(<(?:script|link)\b[^>]*\b(?:src|href)=")((?!https?:|\/\/)[^"?#]+\.(?:js|css))(?:\?v=[^"]*)?"/g, (_, before, path) => { n++; return `${before}${path}?v=${v}"`; });
  writeFileSync(file, html);
  console.log(`${name} : ${n} fichiers locaux marqués ?v=${v}`);
}
