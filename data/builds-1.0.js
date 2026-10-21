// CONTENU ÉDITORIAL — équipement 1.0 pièce par pièce, d'après les guides publiés après la sortie de la 1.0.
// Remplace l'équipement « par set » de data/builds.js pour chaque build listé ici (le reste de la fiche est conservé).
// Chaque emplacement indique les sources qui recommandent l'objet ; les identifiants renvoient au catalogue (data/catalog.js).
window.ENS = window.ENS || {};
window.ENS.builds10 = {
  "mage-bataille": {
    tiers: { solo: "S", duo: "S", source: "aoeah-tier" }, ressources: ["aoeah-tier", "kg-builds", "eb-battlemage", "g2a-builds", "yt-7builds", "yt-top3"],
    equipement: [
      { emplacement: "Arme principale", meilleur: "polymaths-wand", sources: ["kg-builds"], etapes: [
        { etape: "Début (1–15)", texte: "Baguette fabricable de votre niveau ; feu ou foudre de préférence (Enshrouded Builds, AoEAH)." },
        { etape: "Milieu (16–35)", item: "reapers-wand", texte: "Rare niv. 36, foudre, fabriquée chez Balthazar." },
        { etape: "Fin (36–50)", item: "polymaths-wand", texte: "KeenGamer." }] },
      { emplacement: "Main secondaire", meilleur: "prismatic-ward", sources: ["eb-battlemage", "aoeah-tier"], etapes: [
        { etape: "Début", item: "spectral-ward", texte: "AoEAH recommande une Spectral Ward (garde de bas niveau)." },
        { etape: "Fin", item: "prismatic-ward", texte: "Enshrouded Builds." }] },
      { emplacement: "Bâton (optionnel)", meilleur: "staff-of-guidance", sources: ["kg-builds"], etapes: [{ etape: "Début", texte: "Inutile avant Blast and Cast (compétence de fin de partie)." }, { etape: "Milieu", texte: "Inutile avant Blast and Cast (compétence de fin de partie)." }, { etape: "Fin", texte: "Seulement avec Blast and Cast." }] },
      { emplacement: "Tête", meilleur: "vorgoths-soulbound-crown", sources: ["kg-builds", "aoeah-tier"], etapes: [{ etape: "Milieu", item: "hailcaster-hat" }] },
      { emplacement: "Torse", meilleur: "crestflame-chest", sources: ["aoeah-tier"], etapes: [
        { etape: "Début", item: "set-alchemist-apprentice" }, { etape: "Milieu (niv. 33)", item: "hailcaster-chest", texte: "+8 % dégâts de baguette selon le wiki (KeenGamer le garde en fin de partie)." },
        { etape: "Fin", item: "crestflame-chest", texte: "AoEAH : plastron Crestflame (Cinder's Cradle)." }] },
      { emplacement: "Mains", meilleur: "flame-arcanist-gloves", sources: ["aoeah-tier"], etapes: [{ etape: "Fin", item: "flaming-gauntlets", texte: "Alternative KeenGamer." }] },
      { emplacement: "Jambes", meilleur: "vorgoths-soulbound-pants", sources: ["aoeah-tier"], etapes: [{ etape: "Milieu", item: "hailcaster-pants" }] },
      { emplacement: "Pieds", meilleur: "lifelock-boots", sources: ["aoeah-tier"], etapes: [{ etape: "Milieu", item: "hailcaster-boots" }] },
      { emplacement: "Anneau", meilleur: "ring-mother-flame", sources: ["kg-builds", "aoeah-tier"], etapes: [
        { etape: "Début", item: "ring-commanders", texte: "AoEAH : bon anneau de début (santé + mana)." },
        { etape: "Fin", item: "ancient-ring-of-health", texte: "AoEAH : deuxième anneau." }] },
      { emplacement: "Sorts", meilleur: "eternal-ice-bolt-iv", sources: ["aoeah-tier", "eb-battlemage"], etapes: [
        { etape: "Fin", item: "eternal-fireball-iii", texte: "AoEAH : Eternal Ice Bolt et Eternal Fireball." },
        { etape: "Groupes", item: "eternal-entangle", texte: "Enshrouded Builds : Entangle puis totem." }] }
    ]
  },
  "barbare": {
    tiers: { solo: "S", duo: "A", source: "aoeah-tier" }, ressources: ["aoeah-tier", "kg-builds", "sk-barbarian", "pd-best-armor", "yt-berserker", "yt-7builds"],
    equipement: [
      { emplacement: "Arme principale", meilleur: "battering-ram-hammer", sources: ["sk-barbarian"], etapes: [
        { etape: "Alternative", item: "ancestral-star", texte: "Arme de lore : niveau non publié." }, { etape: "Fin", item: "champions-axe", texte: "KeenGamer." },
        { etape: "Alternative 1.0", item: "deeproot-axe", texte: "Légendaire évolutive (niv. 1–55), confirmée dans les fichiers 1.0." }] },
      { emplacement: "Tête", meilleur: "sunpiercer-helmet", sources: ["pd-best-armor"], etapes: [] },
      { emplacement: "Torse", meilleur: "sunpiercer-chestplate", sources: ["pd-best-armor"], etapes: [{ etape: "Milieu", item: "set-brazen-bull" }] },
      { emplacement: "Mains", meilleur: "sunpiercer-gloves", sources: ["pd-best-armor"], etapes: [] },
      { emplacement: "Jambes", meilleur: "sunpiercer-pants", sources: ["pd-best-armor"], etapes: [] },
      { emplacement: "Pieds", meilleur: "vorgoths-soulbound-boots", sources: ["kg-builds"], etapes: [{ etape: "Alternative", item: "sunpiercer-shoes" }] },
      { emplacement: "Anneau", meilleur: "ancient-ring-of-stamina", sources: ["aoeah-tier"], etapes: [
        { etape: "Alternative", item: "ring-ancients", texte: "AoEAH : avec l'amélioration +20 % dégâts critiques." }, { etape: "Cité par KeenGamer", item: "ring-gemini" }] }
    ]
  },
  "tank": {
    tiers: { solo: null, duo: null, source: null }, ressources: ["kg-builds", "pd-best-armor", "g2a-builds"],
    equipement: [
      { emplacement: "Arme principale", meilleur: "mace-of-wrath", sources: ["kg-builds"], etapes: [{ etape: "Alternative", item: "aurora-sword" }] },
      { emplacement: "Main secondaire", meilleur: "golden-bulwark-shield", sources: ["pd-best-armor"], etapes: [
        { etape: "Milieu", item: "brazen-bull-shield" }, { etape: "Parade max", item: "sunpiercer-shield" }, { etape: "Cité par KeenGamer", item: "crestflame-shield" }] },
      { emplacement: "Tête", meilleur: "crestflame-helmet", sources: ["kg-builds"], etapes: [{ etape: "Alternative", item: "golden-bulwark-helmet" }] },
      { emplacement: "Torse", meilleur: "crestflame-chest", sources: ["kg-builds"], etapes: [{ etape: "Alternative", item: "golden-bulwark-chest-plate" }] },
      { emplacement: "Mains", meilleur: "crestflame-gloves", sources: ["kg-builds"], etapes: [{ etape: "Alternative", item: "golden-bulwark-gloves" }] },
      { emplacement: "Jambes", meilleur: "crestflame-pants", sources: ["kg-builds"], etapes: [{ etape: "Alternative", item: "golden-bulwark-pants" }] },
      { emplacement: "Pieds", meilleur: "crestflame-boots", sources: ["kg-builds"], etapes: [{ etape: "Alternative", item: "golden-bulwark-boots" }] },
      { emplacement: "Anneau", meilleur: "ring-commanders", sources: ["kg-builds"], etapes: [{ etape: "Alternative", item: "ancient-ring-of-health" }] }
    ]
  },
  "guerrier": {
    tiers: { solo: "C", duo: "B", source: "aoeah-tier" }, ressources: ["kg-builds", "aoeah-tier"],
    equipement: [
      { emplacement: "Arme principale", meilleur: "vesztahs-mace", sources: ["kg-builds", "aoeah-tier"], etapes: [{ etape: "Fin (pré-1.0)", item: "aurora-sword" }, { etape: "Milieu", item: "broodmothers-eye" }] },
      { emplacement: "Main secondaire", meilleur: "crestflame-shield", sources: ["kg-builds"], etapes: [{ etape: "Milieu", item: "brazen-bull-shield" }] },
      { emplacement: "Tête", meilleur: "sunpiercer-helmet", sources: ["aoeah-tier", "pd-best-armor"], etapes: [] },
      { emplacement: "Torse", meilleur: "sunpiercer-chestplate", sources: ["pd-best-armor"], etapes: [{ etape: "Début", item: "set-rising-fighter" }, { etape: "Milieu", item: "set-knight" }] },
      { emplacement: "Mains", meilleur: "wolfs-fang-gloves", sources: ["kg-builds"], etapes: [] },
      { emplacement: "Jambes", meilleur: "sunpiercer-pants", sources: ["pd-best-armor"], etapes: [] },
      { emplacement: "Pieds", meilleur: "sunpiercer-shoes", sources: ["pd-best-armor"], etapes: [] },
      { emplacement: "Anneau", meilleur: "ring-commanders", sources: ["kg-builds", "aoeah-tier"], etapes: [] }
    ]
  },
  "rodeur": {
    tiers: { solo: "S", duo: "S", source: "aoeah-tier" }, ressources: ["aoeah-tier", "kg-builds", "pd-best-armor", "g2a-builds", "yt-7builds"],
    equipement: [
      { emplacement: "Arme principale", meilleur: "ignited-bow", sources: ["kg-builds", "aoeah-tier"], etapes: [
        { etape: "Milieu (1.0)", item: "draconian-bow" }, { etape: "Fin", item: "arsonists-bow", texte: "Légendaire évolutive (1–55). AoEAH cite aussi un « Fire Feather Bow » introuvable sur le wiki." }] },
      { emplacement: "Tête", meilleur: "ashwind-strider-hood", sources: ["kg-builds", "aoeah-tier"], etapes: [{ etape: "Alternative", item: "quetzal-hunter-helmet" }] },
      { emplacement: "Torse", meilleur: "vorgoths-soulbound-chest", sources: ["kg-builds", "aoeah-tier"], etapes: [{ etape: "Milieu", item: "set-deadeye" }, { etape: "Alternative", item: "ashwind-strider-chest" }] },
      { emplacement: "Mains", meilleur: "ashwind-strider-gloves", sources: ["aoeah-tier"], etapes: [{ etape: "Alternative", item: "quetzal-hunter-gloves" }] },
      { emplacement: "Jambes", meilleur: "ashwind-strider-pants", sources: ["aoeah-tier"], etapes: [{ etape: "Alternative", item: "quetzal-hunter-pants" }] },
      { emplacement: "Pieds", meilleur: "ashwind-strider-boots", sources: ["aoeah-tier"], etapes: [{ etape: "Alternative", item: "quetzal-hunter-shoes" }] },
      { emplacement: "Anneau", meilleur: "ring-ranger-t7", sources: ["pd-rings"], etapes: [{ etape: "Conseil", texte: "AoEAH : n'importe quel anneau de vol de vie." }] }
    ]
  },
  "assassin": {
    tiers: { solo: "C", duo: "B", source: "aoeah-tier" }, ressources: ["aoeah-tier", "kg-builds", "pd-best-armor"],
    equipement: [
      { emplacement: "Arme principale", meilleur: "solstice-daggers", sources: ["kg-builds"], etapes: [{ etape: "Fin (pré-1.0)", item: "adorned-drakling-daggers" }, { etape: "Milieu", item: "blink-daggers" }] },
      { emplacement: "Tête", meilleur: "sky-specter-helmet", sources: ["kg-builds", "aoeah-tier"], etapes: [{ etape: "Alternative (niv. 43)", item: "bloodfeather-helmet", texte: "AoEAH : set Bloodfeather avant Sky Specter." }] },
      { emplacement: "Torse", meilleur: "sky-specter-chest", sources: ["kg-builds", "aoeah-tier"], etapes: [{ etape: "Alternative (niv. 43)", item: "bloodfeather-chest" }] },
      { emplacement: "Mains", meilleur: "vorgoths-soulbound-gloves", sources: ["kg-builds", "aoeah-tier"], etapes: [{ etape: "Alternative (niv. 43)", item: "bloodfeather-gloves" }] },
      { emplacement: "Jambes", meilleur: "sky-specter-pants", sources: ["aoeah-tier"], etapes: [{ etape: "Alternative (niv. 43)", item: "bloodfeather-pants" }] },
      { emplacement: "Pieds", meilleur: "sky-specter-boots", sources: ["aoeah-tier"], etapes: [{ etape: "Alternative (niv. 43)", item: "bloodfeather-shoes" }] },
      { emplacement: "Anneau", meilleur: "ring-t7-fog-assassin", sources: ["pd-rings"], etapes: [{ etape: "Conseil", texte: "AoEAH : des anneaux de vol de vie dans chaque emplacement." }] }
    ]
  },
  "sorcier": {
    tiers: { solo: "B", duo: "S", source: "aoeah-tier" }, ressources: ["aoeah-tier", "kg-builds"],
    equipement: [
      { emplacement: "Arme principale", meilleur: "staff-of-guidance", sources: ["kg-builds"], etapes: [{ etape: "Alternative", item: "violet-storm", texte: "AoEAH (build glace/foudre)." }, { etape: "Baguette", item: "candlelight-wand" }] },
      { emplacement: "Sorts", meilleur: "eternal-fireball-iii", sources: ["kg-builds", "aoeah-tier"], etapes: [
        { etape: "Zone", item: "eternal-blizzard-ii" }, { etape: "Zone", item: "eternal-ball-lightning-i" }, { etape: "Contrôle", item: "eternal-entangle" }] },
      { emplacement: "Tête", meilleur: "flame-arcanist-hat", sources: ["kg-builds"], etapes: [{ etape: "Milieu (niv. 33)", item: "thaumaturge-hat", texte: "Set orienté dégâts de bâton selon le wiki." }] },
      { emplacement: "Torse", meilleur: "flame-arcanist-chest", sources: ["kg-builds"], etapes: [{ etape: "Milieu", item: "thaumaturge-chest" }] },
      { emplacement: "Mains", meilleur: "flame-arcanist-gloves", sources: ["aoeah-tier"], etapes: [{ etape: "Milieu", item: "thaumaturge-gloves" }] },
      { emplacement: "Jambes", meilleur: "vorgoths-soulbound-pants", sources: ["aoeah-tier"], etapes: [{ etape: "Milieu", item: "thaumaturge-pants" }] },
      { emplacement: "Pieds", meilleur: "lifelock-boots", sources: ["aoeah-tier"], etapes: [{ etape: "Milieu", item: "thaumaturge-boots" }] },
      { emplacement: "Anneau", meilleur: "ring-t7-fire", sources: ["pd-rings"], etapes: [{ etape: "Alternative", item: "ancient-ring-of-mana", texte: "AoEAH : anneau de mana + anneau de santé." }] }
    ]
  },
  "soigneur": {
    tiers: { solo: null, duo: null, source: null }, ressources: ["kg-builds", "g2a-builds"],
    equipement: [
      { emplacement: "Arme principale", meilleur: "oracles-everblue", sources: ["kg-builds"], etapes: [] },
      { emplacement: "Sorts", meilleur: "eternal-heal-cascade-ii", sources: ["kg-builds"], etapes: [{ etape: "Alternative", item: "eternal-chain-heal-ii" }] },
      { emplacement: "Tête", meilleur: "lifelock-helmet", sources: ["kg-builds"], etapes: [{ etape: "Alternative (niv. 43)", item: "waveborne-ritualist-helmet", texte: "Set de soigneur cité par plusieurs guides (« intended for healers » selon le wiki)." }] },
      { emplacement: "Torse", meilleur: "lifelock-chest", sources: ["kg-builds"], etapes: [{ etape: "Début", item: "set-healer" }, { etape: "Alternative (niv. 43)", item: "waveborne-ritualist-tunic" }] },
      { emplacement: "Mains", meilleur: "lifelock-gloves", sources: ["kg-builds"], etapes: [{ etape: "Alternative (niv. 43)", item: "waveborne-ritualist-gloves" }] },
      { emplacement: "Jambes", meilleur: "lifelock-pants", sources: ["kg-builds"], etapes: [{ etape: "Alternative (niv. 43)", item: "waveborne-ritualist-pants" }] },
      { emplacement: "Pieds", meilleur: "lifelock-boots", sources: ["kg-builds"], etapes: [{ etape: "Alternative (niv. 43)", item: "waveborne-ritualist-boots" }] },
      { emplacement: "Anneau", meilleur: "ring-ancients", sources: ["kg-builds"], etapes: [{ etape: "Vérifié 1.0", item: "ring-mage-t7" }] }
    ]
  },
  "invocateur": {
    tiers: { solo: "A", duo: "A", source: "aoeah-tier" }, ressources: ["aoeah-tier", "kg-builds", "g2a-builds"],
    equipement: [
      { emplacement: "Arme principale", meilleur: "staff-of-reeds", sources: ["kg-builds", "aoeah-tier"], etapes: [{ etape: "Baguette", item: "candlelight-wand" }] },
      { emplacement: "Sorts", meilleur: "eternal-fire-totem-ii", sources: ["aoeah-tier", "kg-builds"], etapes: [
        { etape: "Totems", item: "eternal-ice-totem-ii" }, { etape: "Totems", item: "eternal-shock-totem" }, { etape: "Contrôle", item: "eternal-entangle" },
        { etape: "Squelettes", texte: "Summon Hollow Skeleton (sort 1.0) : absent du catalogue du wiki au 20/10." }] },
      { emplacement: "Tête", meilleur: "vorgoths-soulbound-crown", sources: ["aoeah-tier", "kg-builds"], etapes: [{ etape: "Alternative", item: "flame-arcanist-hat" }] },
      { emplacement: "Torse", meilleur: "flame-arcanist-chest", sources: ["kg-builds", "aoeah-tier"], etapes: [] },
      { emplacement: "Mains", meilleur: "flame-arcanist-gloves", sources: ["aoeah-tier"], etapes: [] },
      { emplacement: "Jambes", meilleur: "flame-arcanist-pants", sources: ["aoeah-tier"], etapes: [] },
      { emplacement: "Pieds", meilleur: "flame-arcanist-boots", sources: ["aoeah-tier"], etapes: [] },
      { emplacement: "Anneau", meilleur: "ring-mother-flame", sources: ["aoeah-tier"], etapes: [] }
    ]
  }
};
