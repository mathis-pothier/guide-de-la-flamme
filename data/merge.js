// Fusionne les objets vérifiés à la main (items.js) avec le catalogue du wiki (catalog.js).
// - Un objet présent dans les deux garde son identifiant, son statut et ses sources « manuels », et reçoit
//   les champs manquants du wiki (niveau, effets, emplacement sur la carte, description…).
// - Un objet seulement « cité par un guide » qui existe sur le wiki passe au statut de sa page wiki.
// - window.ENS.alias associe l'identifiant du catalogue à l'identifiant conservé.
// Chargé par index.html et par scripts/validate.mjs.
(function () {
  const D = window.ENS;
  const norm = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/['’]/g, "")
    .replace(/^set (.*)$/, "$1 set").replace(/[^a-z0-9]+/g, " ").trim();
  const catalog = D.catalog || [];
  const byName = new Map(catalog.map((c) => [norm(c.nom), c]));
  const alias = {}, used = new Set();
  const FIELDS = ["niveau", "rarete", "atouts", "effets", "obtention", "obtentionEn", "marqueurs", "description", "wiki", "wikiMaj",
    "pieces", "set", "classe", "amelioration", "element", "typeEn", "lore", "emplacement", "niveauRegion", "region", "niveauWiki", "niveauSource"];
  const curated = D.items.map((it) => {
    const c = byName.get(norm(it.nom));
    if (!c) {
      // Set sans page « Set » sur le wiki : on rattache les pièces qui portent son nom.
      if (it.categorie === "armure" && /^Set /.test(it.nom)) {
        const prefix = norm(it.nom.replace(/^Set /, "")) + " ";
        const pieces = catalog.filter((p) => p.categorie === "armure" && norm(p.nom).startsWith(prefix));
        if (pieces.length) {
          const m = Object.assign({}, it, { pieces: pieces.map((p) => p.id), sources: Array.from(new Set((it.sources || []).concat("wiki-catalogue"))) });
          if (m.niveau == null) m.niveau = Math.max.apply(null, pieces.map((p) => p.niveau || 0)) || undefined;
          if (!m.rarete) m.rarete = pieces.map((p) => p.rarete).filter(Boolean)[0];
          if (!m.classe) m.classe = pieces.map((p) => p.classe).filter(Boolean)[0];
          if (it.statut === "guide") { m.statut = pieces.some((p) => p.statut === "w10") ? "w10" : "pre"; m.confirmeWiki = true; }
          pieces.forEach((p) => { p.set = it.id; });
          return m;
        }
      }
      return it;
    }
    used.add(c.id); alias[c.id] = it.id;
    const m = Object.assign({}, it);
    FIELDS.forEach((k) => { if (m[k] == null && c[k] != null) m[k] = c[k]; });
    const stats = Object.assign({}, c.stats || {}, it.stats || {});
    if (Object.keys(stats).length) m.stats = stats;
    m.sources = Array.from(new Set((it.sources || []).concat("wiki-catalogue")));
    m.catalogId = c.id;
    if (it.statut === "guide") { m.statut = c.statut; m.confirmeWiki = true; }
    return m;
  });
  const rest = catalog.filter((c) => !used.has(c.id)).map((c) => Object.assign({}, c));
  const all = curated.concat(rest);
  // Armes : un niveau unique hors fichiers 1.0 vient du champ de calcul du wiki (souvent 40 ou 50), pas du jeu.
  // On le retire : le niveau affiché est alors celui de la zone où l'arme se trouve (wiki, pages de biomes).
  // Les plages des fichiers 1.0 (ex. « 1–55 » pour une légendaire évolutive) et les armes fabriquées (statut v1) sont gardées.
  all.forEach((i) => { if (i.categorie === "arme" && i.statut !== "v1" && /^\d+$/.test(String(i.niveau ?? ""))) { i.niveauWiki = i.niveau; delete i.niveau; } });
  // Références de set/pièces vers les identifiants conservés.
  all.forEach((i) => {
    if (i.set && alias[i.set]) i.set = alias[i.set];
    if (i.pieces) i.pieces = i.pieces.map((p) => alias[p] || p);
  });
  D.items = all;
  D.alias = alias;
  // Équipement 1.0 pièce par pièce (builds-1.0.js) : remplace l'équipement « par set » des builds concernés.
  const B10 = D.builds10 || {};
  const ref = (id) => alias[id] || id;
  (D.builds || []).forEach((b) => {
    const x = B10[b.id];
    if (!x) return;
    b.equipement = x.equipement.map((s) => Object.assign({}, s, { meilleur: s.meilleur && ref(s.meilleur), etapes: (s.etapes || []).map((e) => Object.assign({}, e, { item: e.item && ref(e.item) })) }));
    b.tiers = x.tiers; b.ressources = x.ressources;
    b.sources = Array.from(new Set((b.sources || []).concat(x.equipement.flatMap((s) => s.sources || []))));
  });

  // Progression d'armure (progression.js) : chaque set devient la pièce de l'emplacement concerné.
  const byIdAll = new Map(all.map((i) => [i.id, i]));
  const PIECE_SLOTS = ["Tête", "Torse", "Mains", "Jambes", "Pieds"];
  const pieceOf = (setId, slot) => {
    const set = byIdAll.get(ref(setId));
    if (!set) return null;
    return (set.pieces || []).map((p) => byIdAll.get(p)).find((p) => p && p.emplacement === slot) || null;
  };
  const plain = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const PROG = D.progression || {};
  (D.builds || []).forEach((b) => {
    // Un set cité dans un emplacement de pièce est remplacé par la pièce correspondante.
    b.equipement.forEach((s) => {
      if (!PIECE_SLOTS.includes(s.emplacement)) return;
      const toPiece = (id) => { const it = byIdAll.get(id); return it && it.pieces ? (pieceOf(id, s.emplacement) || it).id : id; };
      if (s.meilleur) s.meilleur = toPiece(s.meilleur);
      s.etapes.forEach((e) => { if (e.item) e.item = toPiece(e.item); });
    });
    const pr = PROG[b.id];
    if (!pr) return;
    // Builds sans emplacements de pièces : on les crée à partir du set de fin.
    if (!b.equipement.some((s) => PIECE_SLOTS.includes(s.emplacement)) && pr.fin) {
      const insertAt = Math.max(1, b.equipement.findIndex((s) => s.emplacement === "Anneau"));
      const slots = PIECE_SLOTS.map((slot) => ({ emplacement: slot, meilleur: (pieceOf(pr.fin, slot) || {}).id, etapes: [], sources: [] }));
      b.equipement.splice(insertAt, 0, ...slots);
    }
    b.equipement.forEach((s) => {
      if (!PIECE_SLOTS.includes(s.emplacement)) return;
      [["debut", "Début"], ["milieu", "Milieu"]].forEach(([key, label]) => {
        const has = s.etapes.some((e) => plain(e.etape).startsWith(key) && e.item);
        (pr[key] || []).forEach((setId, k) => {
          const p = pieceOf(setId, s.emplacement), set = byIdAll.get(ref(setId));
          if (!p || s.etapes.some((e) => e.item === p.id)) return;
          const e = { etape: `${label} (niv. ${p.niveau ?? set.niveau ?? "?"})`, item: p.id, texte: k === 0 ? pr.pourquoi : `Set ${set.nom.replace(/^Set | Set$/g, "")}`, auto: false, progression: true };
          if (has || k > 0) s.etapes.push(e); else s.etapes.unshift(e);
        });
      });
      s.sources = Array.from(new Set((s.sources || []).concat("wiki-catalogue")));
    });
    b.sources = Array.from(new Set((b.sources || []).concat("wiki-catalogue", "pd-best-armor")));
  });
})();
