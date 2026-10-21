// CONTENU ÉDITORIAL : recommandations et builds.
// Tout ce fichier est de l'opinion sourcée (guides) ou de la synthèse éditoriale — jamais une donnée de jeu.
// Les objets/compétences sont référencés par `id` (items.js / skills.js) ; `texte` = recommandation non liée à un objet précis.
// confiance : "sourcée" (reprise d'au moins un guide 1.0) | "editoriale" (synthèse de ce site, à valider en jeu)
window.ENS = window.ENS || {};

window.ENS.styles = [
  { id: "guerrier", nom: "Guerrier" }, { id: "tank", nom: "Tank" }, { id: "barbare", nom: "Barbare" },
  { id: "rodeur", nom: "Archer / Rôdeur" }, { id: "assassin", nom: "Assassin" },
  { id: "mage-bataille", nom: "Mage de bataille" }, { id: "sorcier", nom: "Sorcier élémentaire" },
  { id: "soigneur", nom: "Soigneur" }, { id: "invocateur", nom: "Invocateur" }, { id: "hybride", nom: "Hybride" }
];

window.ENS.builds = [
  {
    id: "mage-bataille", nom: "Mage de bataille (baguette + garde)", style: "mage-bataille", complet: true,
    role: "Dégâts soutenus à moyenne portée, autonome en solo. Un guide le classe S (Enshrouded Builds), KeenGamer le désigne « meilleur build global » — classements d'opinion.",
    difficulte: "Facile à moyenne", prerequis: "Aucun pour démarrer. Wand Evasion Attack et Aerial Wand Attack sont des compétences 1.0. Points cumulés indicatifs : 65 (niv. 1–15), 140 (16–35), 212 (36–50).",
    sources: ["eb-battlemage", "kg-builds"], confiance: "sourcée",
    attributs: [
      { nom: "Intelligence", priorite: "Très haute", pourquoi: "+5 % de dégâts magiques par point (wiki-skills) ; Life Burst et Chain Hit en dépendent aussi." },
      { nom: "Constitution", priorite: "Haute", pourquoi: "+50 santé par point : compense le jeu à moyenne portée." },
      { nom: "Esprit", priorite: "Moyenne", pourquoi: "+20 mana par point ; Unity et Arcane Deflection couvrent une partie des besoins." },
      { nom: "Endurance", priorite: "Faible à moyenne", pourquoi: "Esquives et Wand Evasion Attack." },
      { nom: "Force / Dextérité", priorite: "Inutiles", pourquoi: "N'améliorent pas les baguettes." }
    ],
    equipement: [
      { emplacement: "Arme principale", meilleur: "polymaths-wand",
        etapes: [{ etape: "Début (1–15)", texte: "Baguette fabricable la plus haute disponible ; privilégier feu ou foudre (Enshrouded Builds)." },
                 { etape: "Milieu (16–35)", item: "reapers-wand", texte: "Rare niv. 36, foudre, fabriquée chez Balthazar : valeurs 1.0 confirmées dans les fichiers." },
                 { etape: "Fin (36–50)", item: "polymaths-wand", texte: "Recommandée par KeenGamer ; statistiques encore pré-1.0." }] },
      { emplacement: "Main secondaire", meilleur: "prismatic-ward",
        etapes: [{ etape: "Toutes étapes", texte: "Une garde (ward) ou un bouclier : la parade alimente Arcane Deflection." },
                 { etape: "Alternative bouclier", item: "wolfs-fang-shield" }] },
      { emplacement: "Bâton (optionnel)", meilleur: "staff-of-guidance",
        etapes: [{ etape: "Fin", texte: "Uniquement si vous prenez Blast and Cast (critique baguette → +50 % sur le coup de bâton suivant)." }] },
      { emplacement: "Armure", meilleur: "set-hailcaster",
        etapes: [{ etape: "Début", item: "set-alchemist-apprentice" },
                 { etape: "Début (niv. 13)", item: "set-wizard", texte: "+3 % dégâts de baguette (bonus pré-1.0)." },
                 { etape: "Milieu (niv. 25)", item: "set-elder" },
                 { etape: "Fin", item: "set-hailcaster", texte: "KeenGamer : plastron Hailcaster + Flaming Gauntlets + couronne Vorgoth's Soulbound (ces deux dernières non recoupées)." }] },
      { emplacement: "Mains", meilleur: "flaming-gauntlets", etapes: [] },
      { emplacement: "Tête", meilleur: "set-vorgoths-soulbound", etapes: [{ etape: "Fin", texte: "« Vorgoth's Soulbound Crown » selon KeenGamer, non recoupée." }] },
      { emplacement: "Anneau", meilleur: "ring-mage-t7",
        etapes: [{ etape: "Progression", texte: "La lignée Mage existe aux niveaux 5, 10, 15, 20, 30, 40, 45 (fichiers 1.0) : prenez le palier le plus haut." },
                 { etape: "Variante foudre", item: "ring-t6-shock" },
                 { etape: "Cité par un guide", item: "ring-mother-flame", texte: "Nom non vérifiable dans les fichiers." }] },
      { emplacement: "Sorts", etapes: [{ etape: "Groupes", texte: "Entangle (immobilise) puis Summon Shock/Fire Totem." }, { etape: "Boss", texte: "Mana Drain pour tenir les longs combats." }] }
    ],
    competences: {
      essentielles: ["mage-apprentice", "wand-specialization", "wand-master", "sting", "intelligence", "unity", "arcane-deflection"],
      ordre: ["mage-apprentice", "wand-specialization", "wand-master", "arcane-proliferation", "sting", "intelligence", "constitution", "unity", "arcane-deflection", "life-burst", "chain-hit", "wand-evasion-attack", "aerial-wand-attack", "blink", "blast-and-cast"],
      optionnelles: ["blink", "blast-and-cast", "water-aura", "eternal-spark", "blood-magic"],
      note: "Ordre repris d'Enshrouded Builds (qui donne aussi une version courte s'arrêtant à Arcane Deflection). « Wand Specialization » et « Arcane Proliferation » n'ont pas été retrouvées dans les bases consultées."
    },
    synergies: [
      "Parade avec la garde → Arcane Deflection (+20 mana) : la défense finance l'attaque.",
      "Unity (récupération de mana sur dégâts de baguette) + Sting (dégâts répétés) : boucle de tir continu.",
      "Critiques magiques → Chain Hit : dégâts de foudre en rebond, d'où l'intérêt des baguettes de foudre et de l'anneau de foudre.",
      "Critique de baguette → Blast and Cast → coup de bâton renforcé (si vous portez un bâton)."
    ],
    contextes: [
      { nom: "Exploration", texte: "Aerial Wand Attack depuis le planeur sur les essaims ; Blink pour la mobilité." },
      { nom: "Groupes d'ennemis", texte: "Entangle ou totem avant d'engager, puis Wand Evasion Attack pour traverser les ennemis alignés (projectiles perforants)." },
      { nom: "Boss", texte: "Rester à moyenne portée, parer les attaques lisibles pour le mana, Mana Drain sur la durée." },
      { nom: "Équipe", texte: "Life Burst soigne les alliés à 15 m à chaque victime magique ; Water Aura en option (KeenGamer)." }
    ],
    jeu: "Maintenez le tir à moyenne distance, parez les élites avec la garde pour regagner du mana, esquivez en tirant (Wand Evasion Attack) et utilisez le planeur pour les attaques aériennes. Nourriture : santé, mana et dégâts (les trois emplacements)."
  },
  {
    id: "barbare", nom: "Barbare à deux mains", style: "barbare", complet: false,
    role: "Plus gros dégâts physiques en mêlée selon Sportskeeda ; zone d'effet avec Whirlwind Crescendo.",
    difficulte: "Moyenne", prerequis: "Endgame : armes légendaires niveau 40+.", sources: ["kg-builds", "sk-barbarian"], confiance: "sourcée",
    attributs: [{ nom: "Force", priorite: "Très haute", pourquoi: "+5 % dégâts de mêlée par point." }, { nom: "Constitution", priorite: "Haute", pourquoi: "Survie au corps à corps." }],
    equipement: [
      { emplacement: "Arme principale", meilleur: "battering-ram-hammer", etapes: [{ etape: "Alternative tranchante", item: "spiked-greatsword" }, { etape: "Cité par KeenGamer", item: "champions-axe" }, { etape: "Milieu", item: "ancestral-star" }] },
      { emplacement: "Armure", meilleur: "set-emerguard", etapes: [{ etape: "Milieu", item: "set-brazen-bull" }] },
      { emplacement: "Anneau", meilleur: "ring-warrior-t7", etapes: [{ etape: "Cité par un guide", item: "ring-gemini" }] }
    ],
    competences: { essentielles: ["strength", "heavy-spec", "whirlwind-crescendo", "barbarian", "blood-rage"], optionnelles: ["battle-heal", "breach", "relentless", "steadfast"],
      note: "Sportskeeda démarre par « Two-Handed Specialization » (probablement Heavy Specialization) et finit par Whirlwind Crescendo." },
    synergies: ["Blood Rage + combats de groupe : chaque victime relance +20 % de dégâts.", "Breach : enchaîner les gros coups sur un ennemi submergé.", "Vol de vie des bijoux pour tenir (Sportskeeda)."],
    contextes: [{ nom: "Groupes d'ennemis", texte: "Whirlwind Crescendo ; en 1.0 les attaques lourdes touchent plusieurs ennemis proches (kg-patch)." }, { nom: "Boss", texte: "Breach + Relentless pour les fenêtres d'ouverture." }],
    jeu: "Esquisse : à compléter après vérification en jeu."
  },
  {
    id: "tank", nom: "Tank de groupe", style: "tank", complet: false,
    role: "Attire l'aggro et réduit les dégâts de l'équipe. Surtout pertinent en coopération.",
    difficulte: "Moyenne", prerequis: "Groupe de 2+ joueurs recommandé.", sources: ["kg-builds"], confiance: "sourcée",
    attributs: [{ nom: "Constitution", priorite: "Très haute", pourquoi: "Santé ; Thick Skin la renforce avec la Flamme." }, { nom: "Force", priorite: "Moyenne", pourquoi: "Dégâts minimum." }],
    equipement: [
      { emplacement: "Arme principale", meilleur: "mace-of-wrath", etapes: [{ etape: "Alternative", item: "aurora-sword" }] },
      { emplacement: "Main secondaire", meilleur: "crestflame-shield", etapes: [{ etape: "Valeurs connues les plus hautes (pré-1.0)", item: "sunpiercer-shield", texte: "Parade 321." }, { etape: "Blocage max (pré-1.0)", item: "golden-bulwark-shield", texte: "Blocage 42." }] },
      { emplacement: "Armure", meilleur: "set-crestflame", etapes: [{ etape: "Milieu", item: "set-brazen-bull" }, { etape: "Fin (pré-1.0)", item: "set-golden-bulwark" }] },
      { emplacement: "Anneau", meilleur: "ring-warrior-t7", etapes: [{ etape: "Cité par un guide", item: "ring-commanders" }] }
    ],
    competences: { essentielles: ["nemesis", "arch-nemesis", "thick-skin", "heavy-plates", "tower", "warden"], optionnelles: ["earth-aura", "shiny-plates", "soul-leech", "power-parry"], note: "Liste KeenGamer ; Earth Aura ajoutée par ce site pour le jeu en équipe." },
    synergies: ["Tower + Warden ne s'activent qu'avec 3+ ennemis à 20 m : idéal quand Nemesis/Arch Nemesis les attirent.", "Earth Aura (−10 % dégâts à 10 m) profite aux alliés proches."],
    contextes: [{ nom: "Équipe", texte: "Rôle principal du build." }, { nom: "Solo", texte: "Peu intéressant : les compétences d'aggro n'ont pas d'effet sans alliés." }],
    jeu: "Esquisse : à compléter après vérification en jeu."
  },
  {
    id: "guerrier", nom: "Guerrier une main + bouclier", style: "guerrier", complet: false,
    role: "Mêlée solo robuste avec auto-soin (KeenGamer : « meilleure mêlée solo »).", difficulte: "Facile", prerequis: "Aucun.", sources: ["kg-builds"], confiance: "sourcée",
    attributs: [{ nom: "Force", priorite: "Haute", pourquoi: "Dégâts." }, { nom: "Constitution", priorite: "Haute", pourquoi: "Survie." }],
    equipement: [
      { emplacement: "Arme principale", meilleur: "vesztahs-mace", etapes: [{ etape: "Fin (pré-1.0)", item: "aurora-sword" }, { etape: "Milieu", item: "broodmothers-eye" }] },
      { emplacement: "Main secondaire", meilleur: "crestflame-shield", etapes: [{ etape: "Milieu", item: "brazen-bull-shield" }] },
      { emplacement: "Armure", meilleur: "set-emerguard", etapes: [{ etape: "Début", item: "set-rising-fighter" }, { etape: "Milieu", item: "set-knight" }] },
      { emplacement: "Anneau", meilleur: "ring-warrior-t7", etapes: [{ etape: "Cité par un guide", item: "ring-commanders" }] }
    ],
    competences: { essentielles: ["veteran", "battle-heal", "one-handed-spec", "power-parry", "merciless-attack"], optionnelles: ["swift-blades", "warriors-path", "opportunity"], note: "Veteran et One-Handed Specialization ont été modifiées en 1.0." },
    synergies: ["Veteran (critiques) → Battle Heal (soin sur critique).", "Power Parry → étourdissement → Merciless Attack (+ Opportunity)."],
    contextes: [{ nom: "Boss", texte: "Parer pour étourdir, puis Merciless Attack." }],
    jeu: "Esquisse : à compléter après vérification en jeu."
  },
  {
    id: "rodeur", nom: "Archer / Rôdeur", style: "rodeur", complet: false,
    role: "Dégâts à distance et kiting ; plusieurs guides le placent en tête des builds à distance.", difficulte: "Moyenne", prerequis: "Flèches spéciales (explosives, étourdissantes, éternelles en 1.0).", sources: ["kg-builds", "htm-tier"], confiance: "sourcée",
    attributs: [{ nom: "Dextérité", priorite: "Très haute", pourquoi: "+5 % dégâts d'arc par point." }, { nom: "Endurance", priorite: "Moyenne", pourquoi: "Bee Sting, sprint, esquives." }],
    equipement: [
      { emplacement: "Arme principale", meilleur: "ignited-bow", etapes: [{ etape: "Milieu (1.0)", item: "draconian-bow" }, { etape: "Alternative 1.0", item: "arsonists-bow" }] },
      { emplacement: "Armure", meilleur: "set-ashwind-strider", etapes: [{ etape: "Milieu", item: "set-deadeye" }, { etape: "Fin (pré-1.0)", item: "set-skull-stalker" }] },
      { emplacement: "Anneau", meilleur: "ring-ranger-t7", etapes: [] }
    ],
    competences: { essentielles: ["ranger", "fatal-precision", "marksman", "multi-shot", "puncture", "barrage"], optionnelles: ["shell-shock", "skill-shot", "sharpshooter", "sniper"], note: "Liste KeenGamer. Puncture et Barrage sont nouvelles en 1.0 (valeurs non publiées)." },
    synergies: ["Barrage limite l'usure de l'arc sur la durée.", "Shell Shock + flèches explosives : contrôle de groupe."],
    contextes: [{ nom: "Groupes d'ennemis", texte: "Flèches explosives + Shell Shock." }, { nom: "Boss", texte: "Tirs à la tête (Skill Shot) depuis une position sûre." }],
    jeu: "Esquisse : à compléter après vérification en jeu."
  },
  {
    id: "assassin", nom: "Assassin (dagues)", style: "assassin", complet: false,
    role: "Combat rapide aux dagues axé attaques dans le dos et furtivité.", difficulte: "Difficile", prerequis: "En 1.0, les compétences de dagues sont dans le sous-arbre Assassin.", sources: ["kg-builds", "kg-patch"], confiance: "sourcée",
    attributs: [{ nom: "Dextérité", priorite: "Très haute", pourquoi: "+5 % dégâts de dague par point." }],
    equipement: [
      { emplacement: "Arme principale", meilleur: "solstice-daggers", etapes: [{ etape: "Fin (pré-1.0)", item: "adorned-drakling-daggers" }, { etape: "Milieu", item: "blink-daggers" }] },
      { emplacement: "Armure", meilleur: "set-sky-specter", etapes: [] },
      { emplacement: "Anneau", meilleur: "ring-t7-fog-assassin", etapes: [] }
    ],
    competences: { essentielles: ["dagger-master", "expose-weakness", "backstab-mastery", "graceful-stride", "survival-instinct"], optionnelles: ["sneak-attack", "opportunity", "backstab-damage"], note: "Liste KeenGamer." },
    synergies: ["Sneak Attack (+900 %) + Opportunity pour l'ouverture.", "Expose Weakness : +25 % de dégâts subis après un critique."],
    contextes: [{ nom: "Exploration", texte: "Éliminations furtives." }],
    jeu: "Esquisse : à compléter après vérification en jeu."
  },
  {
    id: "sorcier", nom: "Sorcier élémentaire", style: "sorcier", complet: false,
    role: "Gros dégâts magiques via bâtons et sorts.", difficulte: "Moyenne", prerequis: "Sorts 1.0 : Blizzard, Ball Lightning ; Eternal Fireball.", sources: ["kg-builds"], confiance: "sourcée",
    attributs: [{ nom: "Intelligence", priorite: "Très haute", pourquoi: "Dégâts magiques." }, { nom: "Esprit", priorite: "Haute", pourquoi: "Mana pour les sorts." }],
    equipement: [
      { emplacement: "Arme principale", meilleur: "staff-of-guidance", etapes: [{ etape: "Alternative", item: "candlelight-wand" }] },
      { emplacement: "Sorts", meilleur: "eternal-fireball", etapes: [{ etape: "Zone", texte: "Blizzard, Ball Lightning (sorts 1.0)." }] },
      { emplacement: "Armure", meilleur: "set-flame-arcanist", etapes: [{ etape: "Milieu", item: "set-archmage" }] },
      { emplacement: "Anneau", meilleur: "ring-t7-fire", etapes: [{ etape: "Variante", item: "ring-mage-t7" }] }
    ],
    competences: { essentielles: ["wizard", "arsonist", "quick-charge", "chain-hit", "mass-destruction", "radiant-aura"], optionnelles: ["thunder", "intelligence", "spirit"], note: "Liste KeenGamer." },
    synergies: ["Wizard (+critique) alimente Chain Hit et Mass Destruction."],
    contextes: [{ nom: "Groupes d'ennemis", texte: "Mass Destruction et sorts de zone." }],
    jeu: "Esquisse : à compléter après vérification en jeu."
  },
  {
    id: "soigneur", nom: "Soigneur", style: "soigneur", complet: false,
    role: "Soutien de groupe.", difficulte: "Moyenne", prerequis: "Coopération.", sources: ["kg-builds"], confiance: "sourcée",
    attributs: [{ nom: "Intelligence", priorite: "Très haute", pourquoi: "Water Aura et Life Burst en dépendent." }],
    equipement: [
      { emplacement: "Arme principale", meilleur: "oracles-everblue", etapes: [] },
      { emplacement: "Armure", meilleur: "set-lifelock", etapes: [{ etape: "Début", item: "set-healer" }] },
      { emplacement: "Anneau", meilleur: "ring-ancients", etapes: [{ etape: "Vérifié 1.0", item: "ring-mage-t7" }] },
      { emplacement: "Sorts", etapes: [{ etape: "Fin", texte: "Eternal Heal Cascade II, Eternal Chain Heal II (KeenGamer)." }] }
    ],
    competences: { essentielles: ["healer", "water-aura", "waters-of-life", "life-burst", "saviour", "healing-revive"], optionnelles: ["blink"], note: "Liste KeenGamer." },
    synergies: ["Water Aura → Waters Of Life double le soin passif."],
    contextes: [{ nom: "Équipe", texte: "Rôle principal." }, { nom: "Solo", texte: "Déconseillé : faible dégâts." }],
    jeu: "Esquisse : à compléter après vérification en jeu."
  },
  {
    id: "invocateur", nom: "Invocateur (squelettes et totems)", style: "invocateur", complet: false,
    role: "Combat par invocations (nouveau en 1.0).", difficulte: "Moyenne", prerequis: "Sorts 1.0 : Summon Hollow Skeleton, totems.", sources: ["kg-builds", "kg-patch"], confiance: "sourcée",
    attributs: [{ nom: "Intelligence", priorite: "Haute", pourquoi: "Dégâts magiques." }, { nom: "Esprit", priorite: "Haute", pourquoi: "Mana pour invoquer." }],
    equipement: [
      { emplacement: "Arme principale", meilleur: "candlelight-wand", etapes: [{ etape: "Bâton", texte: "Staff of Reeds (KeenGamer, non recoupé)." }] },
      { emplacement: "Armure", meilleur: "set-flame-arcanist", etapes: [] }
    ],
    competences: { essentielles: ["advanced-necromancy", "totem-mastery", "necromancer", "mana-currents", "quick-charge"], optionnelles: [], note: "Gem of Lesser Necromancy plafonne désormais le nombre de compagnons morts-vivants (kg-patch)." },
    synergies: ["Entangle immobilise pendant que les totems frappent."],
    contextes: [{ nom: "Boss", texte: "Entangle + totems." }],
    jeu: "Esquisse : à compléter après vérification en jeu."
  },
  {
    id: "hybride-mage-tank", nom: "Hybride Mage de bataille / Tank", style: "hybride", complet: false,
    role: "Proposition éditoriale : mage résistant qui exploite les nœuds partagés entre Mage de bataille et Tank.",
    difficulte: "Moyenne", prerequis: "Beaucoup de points : viser la fin de partie.", sources: ["wiki-skills"], confiance: "editoriale",
    attributs: [{ nom: "Intelligence", priorite: "Haute", pourquoi: "Dégâts de baguette." }, { nom: "Constitution", priorite: "Haute", pourquoi: "Encaissement." }],
    equipement: [
      { emplacement: "Arme principale", meilleur: "reapers-wand", etapes: [] },
      { emplacement: "Main secondaire", meilleur: "sunpiercer-shield", etapes: [] },
      { emplacement: "Anneau", meilleur: "ring-any-t7", etapes: [] }
    ],
    competences: { essentielles: ["unity", "arcane-deflection", "bloodletting", "blood-magic", "earth-aura", "constitution"], optionnelles: ["battle-heal", "evasion-attack"], note: "Aucun guide consulté ne propose ce build : à tester." },
    synergies: ["Arcane Deflection (mana sur parade) + gros bouclier.", "Blood Magic convertit la santé élevée en mana."],
    contextes: [{ nom: "Équipe", texte: "Earth Aura protège les alliés proches." }],
    jeu: "Proposition non testée — ne pas considérer comme optimale."
  }
];

// Recommandations générales (éditoriales) : utiles pour la plupart des builds, avec nuances.
window.ENS.skillRecs = {
  generales: [
    { id: "dessert-stomach", pourquoi: "+1 emplacement de nourriture : plus de buffs, quel que soit le style.", nuance: "4 points ; à placer dès qu'il est accessible sur votre chemin." },
    { id: "runner", pourquoi: "Sprint plus rapide et moins coûteux : exploration.", nuance: "Utile surtout hors combat." },
    { id: "arachnoid", pourquoi: "Escalade moitié moins coûteuse.", nuance: "Exploration uniquement." },
    { id: "double-jump", pourquoi: "Mobilité et accès aux reliefs.", nuance: "Débloque aussi Crash Down : Force pour la mêlée." },
    { id: "good-metabolism", pourquoi: "Orbes et potions plus efficaces.", nuance: "Plus rentable si votre build génère des orbes (Bloodletting, Blood Warrior)." },
    { id: "constitution", pourquoi: "Santé brute pour tous.", nuance: "Moins prioritaire pour un archer qui reste à distance." }
  ],
  equipe: [
    { id: "saviour", pourquoi: "Réanimation deux fois plus rapide.", nuance: "Sans intérêt en solo." },
    { id: "healing-revive", pourquoi: "Les alliés réanimés reviennent avec plus de santé.", nuance: "Sans intérêt en solo." }
  ],
  avertissement: "Aucune compétence n'est présentée comme universellement optimale : leur intérêt dépend du build, du solo/coop et de la version. Les effets proviennent du wiki (structure possiblement pré-1.0)."
};

// Résumés courts pour l'affichage visuel (cartes, quiz « Trouver mon build », « En bref »).
// portee : melee | distance | magie ; modes : solo / equipe ; roles : degats / defense / soutien. Éditorial.
window.ENS.buildTags = {
  "mage-bataille": { court: "Mage de bataille", accroche: "Baguette rapide et garde : tir continu à mi-distance.", portee: "magie", modes: ["solo"], roles: ["degats"],
    enBref: ["Tirez sans arrêt à la baguette, à mi-distance", "Parez avec la garde pour regagner du mana", "Montez l'Intelligence, puis la Constitution"] },
  "barbare": { court: "Barbare", accroche: "Arme à deux mains, gros dégâts en zone.", portee: "melee", modes: ["solo", "equipe"], roles: ["degats"],
    enBref: ["Une arme lourde à deux mains", "Tourbillon contre les groupes", "Tout en Force, un peu de Constitution"] },
  "tank": { court: "Tank", accroche: "Attire les ennemis et protège l'équipe.", portee: "melee", modes: ["equipe"], roles: ["defense"],
    enBref: ["Bouclier et arme à une main", "Attirez l'attention des ennemis sur vous", "Surtout utile en équipe"] },
  "guerrier": { court: "Guerrier", accroche: "Arme à une main et bouclier : solide et simple.", portee: "melee", modes: ["solo"], roles: ["degats", "defense"],
    enBref: ["Parez pour étourdir l'ennemi", "Frappe impitoyable sur l'ennemi étourdi", "Les coups critiques vous soignent"] },
  "rodeur": { court: "Archer", accroche: "Tue de loin avec l'arc et des flèches spéciales.", portee: "distance", modes: ["solo", "equipe"], roles: ["degats"],
    enBref: ["Restez à distance", "Visez la tête", "Flèches explosives contre les groupes"] },
  "assassin": { court: "Assassin", accroche: "Dagues, discrétion et attaques dans le dos.", portee: "melee", modes: ["solo"], roles: ["degats"],
    enBref: ["Approchez sans être vu", "Attaque furtive : +900 % de dégâts", "Style exigeant"] },
  "sorcier": { court: "Sorcier", accroche: "Bâton et sorts élémentaires de zone.", portee: "magie", modes: ["solo", "equipe"], roles: ["degats"],
    enBref: ["Bâton et sorts de zone", "Misez sur les coups critiques", "Intelligence et Esprit"] },
  "soigneur": { court: "Soigneur", accroche: "Garde toute l'équipe en vie.", portee: "magie", modes: ["equipe"], roles: ["soutien"],
    enBref: ["Aura de soin autour de vous", "Réanimations plus rapides", "Peu de dégâts : à jouer en groupe"] },
  "invocateur": { court: "Invocateur", accroche: "Squelettes et totems se battent pour vous.", portee: "magie", modes: ["solo"], roles: ["degats"],
    enBref: ["Invoquez squelettes et totems", "Immobilisez les ennemis avec Entangle", "Nouveau style de la 1.0"] },
  "hybride-mage-tank": { court: "Mage cuirassé", accroche: "Expérimental : un mage résistant avec bouclier.", portee: "magie", modes: ["solo", "equipe"], roles: ["defense"],
    enBref: ["Baguette et gros bouclier", "Chaque parade rend du mana", "Proposition non testée"] }
};
