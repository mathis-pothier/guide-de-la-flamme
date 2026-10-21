// Regroupe les notes de docs/recherche/*.md (puis docs/recherche/videos/*.md, résumés des vidéos YouTube)
// dans docs/recherche/contenu.js, lu par recherche.html (la page fonctionne aussi ouverte en double-clic, sans serveur).
// Usage : node scripts/build-recherche.mjs
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const racine = join(import.meta.dirname, "..", "docs", "recherche");
const tri = (a, b) => (a === "README.md" ? -1 : b === "README.md" ? 1 : a.localeCompare(b));

function lire(sousDossier, prefixeTitre) {
  const dir = join(racine, sousDossier);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter(f => f.endsWith(".md")).sort(tri).map(f => {
    let md = readFileSync(join(dir, f), "utf8");
    if (sousDossier) {
      // Liens entre fiches du sous-dossier : préfixés pour rester dans la page ; liens vers l'extérieur du site : texte seul.
      md = md.replace(/\]\(([\w-]+\.md)\)/g, `](${sousDossier}/$1)`)
             .replace(/\[([^\]]+)\]\(\.\.\/[^)]*\)/g, "$1");
    }
    const titre = (md.match(/^# (.+)$/m) || [, f])[1];
    return { fichier: (sousDossier ? sousDossier + "/" : "") + f, titre: prefixeTitre && f === "README.md" ? prefixeTitre : titre, md };
  });
}

const pages = [...lire("", ""), ...lire("videos", "Vidéos : sommaire")];
writeFileSync(join(racine, "contenu.js"),
  "// FICHIER GÉNÉRÉ par scripts/build-recherche.mjs — ne pas modifier à la main.\n" +
  "window.RECHERCHE = " + JSON.stringify(pages, null, 1) + ";\n");
console.log(`${pages.length} pages → docs/recherche/contenu.js`);
