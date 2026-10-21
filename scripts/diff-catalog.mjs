// Compare deux versions du catalogue et écrit un résumé Markdown (description de la pull request automatique).
// Usage : node scripts/diff-catalog.mjs <ancien catalog.js> <nouveau catalog.js> [sortie.md]
import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";

const load = (f) => { const c = { window: {} }; vm.createContext(c); vm.runInContext(readFileSync(f, "utf8"), c); return c.window.ENS.catalog || []; };
const [oldF, newF, outF] = process.argv.slice(2);
const A = new Map(load(oldF).map((i) => [i.id, i])), B = new Map(load(newF).map((i) => [i.id, i]));
const FIELDS = { niveau: "niveau", niveauRegion: "niveau de zone", rarete: "rareté", stats: "statistiques", effets: "effets", atouts: "atouts", obtention: "obtention", marqueurs: "emplacement sur la carte", statut: "statut", image: "image" };
const same = (x, y) => JSON.stringify(x ?? null) === JSON.stringify(y ?? null);

const added = [...B.values()].filter((i) => !A.has(i.id));
const removed = [...A.values()].filter((i) => !B.has(i.id));
const changed = [];
for (const [id, b] of B) {
  const a = A.get(id);
  if (!a) continue;
  const diffs = Object.entries(FIELDS).filter(([k]) => !same(a[k], b[k])).map(([k, label]) => {
    const fmt = (v) => v == null ? "—" : typeof v === "object" ? JSON.stringify(v).slice(0, 80) : String(v);
    return `${label} : ${fmt(a[k])} → ${fmt(b[k])}`;
  });
  if (diffs.length) changed.push({ b, diffs });
}
const cat = { arme: "arme", armure: "armure", set: "set", anneau: "anneau", bouclier: "bouclier", sort: "sort" };
const line = (i) => `- **${i.nom}** (${cat[i.categorie] || i.categorie}${i.wikiMaj ? `, page modifiée le ${i.wikiMaj}` : ""}) — [wiki](${i.wiki})`;

let md = `## Collecte automatique du wiki\n\n`;
md += `| | Nombre |\n|---|---|\n| Objets ajoutés | ${added.length} |\n| Objets retirés | ${removed.length} |\n| Objets modifiés | ${changed.length} |\n| Total du catalogue | ${B.size} |\n\n`;
if (!added.length && !removed.length && !changed.length) md += "Aucun changement dans le catalogue depuis la dernière collecte.\n";
if (added.length) md += `### Ajoutés\n${added.slice(0, 60).map(line).join("\n")}${added.length > 60 ? `\n- … et ${added.length - 60} autres` : ""}\n\n`;
if (removed.length) md += `### Retirés (page supprimée ou renommée sur le wiki)\n${removed.slice(0, 60).map(line).join("\n")}\n\n`;
if (changed.length) md += `### Modifiés\n${changed.slice(0, 80).map(({ b, diffs }) => `${line(b)}\n${diffs.map((d) => `  - ${d}`).join("\n")}`).join("\n")}${changed.length > 80 ? `\n- … et ${changed.length - 80} autres` : ""}\n\n`;
md += `---\nÀ vérifier avant de fusionner : les valeurs viennent du wiki communautaire. Les conseils des builds (\`data/builds-1.0.js\`, \`data/progression.js\`, \`data/tronc-commun.js\`) ne sont **pas** modifiés automatiquement.\n`;
if (outF) writeFileSync(outF, md); else console.log(md);
console.log(`Ajoutés ${added.length}, retirés ${removed.length}, modifiés ${changed.length}.`);
// Pour GitHub Actions : nombre de changements (0 = pas de pull request).
if (process.env.GITHUB_OUTPUT) {
  const { appendFileSync } = await import("node:fs");
  appendFileSync(process.env.GITHUB_OUTPUT, `changes=${added.length + removed.length + changed.length}\n`);
}
