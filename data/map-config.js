// Configuration de la carte dynamique (onglet Carte) — partagée par le site (index.html) et scripts/validate.mjs.
// Ajouter une catégorie : une entrée dans `categories` (et, pour les lieux du wiki, une ligne dans `groupesWiki`).
// Aucun secret ici : le dépôt et la branche sont publics ; l'écriture est autorisée par GitHub (droit d'écriture sur le dépôt).
window.ENS = window.ENS || {};
window.ENS.mapConfig = {
  // Stockage des ajouts des administrateurs : un fichier JSON du dépôt, modifié par l'API GitHub.
  stockage: { depot: "mathis-pothier/guide-de-la-flamme", branche: "main", fichier: "data/map-points.json" },

  categories: {
    lieu:         { nom: "Lieu",                  icone: "pin",     couleur: "#7fb2f0" },
    ressource:    { nom: "Ressource",             icone: "hammer",  couleur: "#c9a27a" },
    coffre:       { nom: "Coffre",                icone: "layers",  couleur: "#f2c94c" },
    equipement:   { nom: "Équipement",            icone: "ring",    couleur: "#b07be8" },
    arme:         { nom: "Arme",                  icone: "sword",   couleur: "#ef7d6b" },
    armure:       { nom: "Armure",                icone: "armor",   couleur: "#6cc45c" },
    construction: { nom: "Construction",          icone: "home",    couleur: "#4fc7b6" },
    bloc:         { nom: "Bloc de construction",  icone: "block",   couleur: "#e0a84a" },
    survivant:    { nom: "Survivant / artisan",   icone: "users",   couleur: "#7a93f5" },
    collection:   { nom: "Objet à collectionner", icone: "star",    couleur: "#ff8fb0" },
    autre:        { nom: "Autre",                 icone: "help",    couleur: "#9babaa" }
  },
  // Catégories proposées dans le formulaire d'ajout (ordre d'affichage)
  categoriesAjout: ["ressource", "coffre", "equipement", "arme", "armure", "construction", "bloc", "lieu", "survivant", "collection", "autre"],

  // Type de lieu du wiki → catégorie de la carte
  groupesWiki: {
    Ancient_Spire: "lieu", Flame_Shrine: "lieu", Sun_Temple: "lieu", Night_Sanctum: "lieu", Ancient_Vault: "lieu", Ancient_Obelisk: "lieu",
    Elixir_Well: "lieu", Balefire: "lieu", Hollow_Halls: "lieu", Village: "lieu", Camp: "lieu", Farm: "lieu", Enemy_Camp: "lieu",
    Shroud_Lair: "lieu", Hidden_Temple: "lieu", Tomb: "lieu", Cave_Passage: "lieu", Gem_Forge: "construction", Shroud_Root: "collection",
    Mine: "ressource",
    Fossil: "collection", Music_Sheet: "collection", QueenPikemeadStatuePiece: "collection", AlchemistWallHanging: "collection",
    CyclopsSkeleton: "collection", WallTapestry: "collection", DragonsMapPiece: "collection", DrakRelief: "collection"
  },

  // Fiabilité de la position (affichée dans chaque fiche et dans la légende)
  precisions: {
    exacte:        { nom: "Position exacte",       desc: "Coordonnée publiée par la source (marqueur de la carte du wiki, lien de carte d'une page d'objet ou relevé d'un administrateur)." },
    lieu:          { nom: "Dans ce lieu",          desc: "La source cite le lieu (village, donjon…) : l'objet s'y trouve, mais pas forcément au point exact du marqueur." },
    approximative: { nom: "Approximative",         desc: "Position estimée : à vérifier en jeu." },
    zone:          { nom: "Zone seulement",        desc: "Seule la région est connue : le point indique la zone, pas l'emplacement." }
  },

  raretes: ["Commune", "Peu commune", "Rare", "Épique", "Légendaire"],
  statuts: {
    valide:     { nom: "Validé",      desc: "Visible par tous." },
    en_attente: { nom: "En attente",  desc: "Ajouté par un administrateur, à valider par un autre (visible des administrateurs seulement)." },
    masque:     { nom: "Masqué",      desc: "Conservé mais invisible pour les visiteurs." }
  },
  taille: 10240
};

// Validation d'un point ajouté par un administrateur (utilisée avant chaque enregistrement et par scripts/validate.mjs).
// Retourne une liste d'erreurs (vide si le point est valide).
window.ENS.validateMapPoint = function (p, cfg) {
  cfg = cfg || window.ENS.mapConfig;
  const e = [];
  const str = (v, min, max) => typeof v === "string" && v.trim().length >= min && v.length <= max;
  if (!p || typeof p !== "object") return ["point absent"];
  if (!/^[a-z0-9-]{6,64}$/.test(p.id || "")) e.push("identifiant invalide");
  if (!str(p.nom, 2, 80)) e.push("nom : 2 à 80 caractères");
  if (p.description != null && !str(p.description, 0, 1000)) e.push("description : 1 000 caractères maximum");
  if (!cfg.categories[p.categorie]) e.push("catégorie inconnue");
  if (p.rarete != null && p.rarete !== "" && !cfg.raretes.includes(p.rarete)) e.push("rareté inconnue");
  if (!cfg.precisions[p.precision]) e.push("précision inconnue");
  const pos = p.position;
  if (!pos || typeof pos.x !== "number" || typeof pos.y !== "number" || !isFinite(pos.x) || !isFinite(pos.y) || pos.x < 0 || pos.y < 0 || pos.x > cfg.taille || pos.y > cfg.taille) e.push(`position : x et y entre 0 et ${cfg.taille}`);
  if (p.zone != null && !str(p.zone, 0, 80)) e.push("zone : 80 caractères maximum");
  if (!str(p.auteur, 1, 60)) e.push("auteur manquant");
  if (!/^\d{4}-\d{2}-\d{2}T/.test(p.cree || "")) e.push("date de création invalide");
  if (p.modifie != null && !/^\d{4}-\d{2}-\d{2}T/.test(p.modifie)) e.push("date de modification invalide");
  if (!cfg.statuts[p.statut]) e.push("statut inconnu");
  if (p.source != null) {
    if (typeof p.source !== "object") e.push("source invalide");
    else {
      if (p.source.texte != null && !str(p.source.texte, 0, 300)) e.push("source : 300 caractères maximum");
      if (p.source.url != null && p.source.url !== "" && !/^https:\/\/[^\s<>"]{3,500}$/.test(p.source.url)) e.push("lien de source : adresse https:// valide attendue");
    }
  }
  if (p.extra != null && (typeof p.extra !== "object" || Array.isArray(p.extra))) e.push("propriétés supplémentaires : objet attendu");
  return e;
};
