// Regroupe les notes de docs/recherche/*.md dans docs/recherche/contenu.js, lu par recherche.html
// (ainsi la page fonctionne aussi ouverte en double-clic, sans serveur).
// Usage : node scripts/build-recherche.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(import.meta.dirname, "..", "docs", "recherche");
const fichiers = readdirSync(dir).filter(f => f.endsWith(".md")).sort((a, b) => (a === "README.md" ? -1 : b === "README.md" ? 1 : a.localeCompare(b)));
const pages = fichiers.map(f => {
  const md = readFileSync(join(dir, f), "utf8");
  const titre = (md.match(/^# (.+)$/m) || [, f])[1];
  return { fichier: f, titre, md };
});
writeFileSync(join(dir, "contenu.js"),
  "// FICHIER GÉNÉRÉ par scripts/build-recherche.mjs — ne pas modifier à la main.\n" +
  "window.RECHERCHE = " + JSON.stringify(pages, null, 1) + ";\n");
console.log(`${pages.length} pages → docs/recherche/contenu.js`);
