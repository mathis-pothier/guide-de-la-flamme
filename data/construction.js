// Onglet « Construction ».
// - blocs, autel, confort, survivants : DONNÉES (wiki officiel + guides, sources par entrée)
// - batiments, emplacements : CONSEILS ÉDITORIAUX repris de guides et vidéos (sources par entrée)
// `marqueurs` = identifiants de lieux de la carte du wiki (data/map.js). Un lieu cité par une source mais présent
// plusieurs fois sur la carte (ex. « un Night Sanctum ») n'est PAS épinglé : seule la région est indiquée.
window.ENS = window.ENS || {};
window.ENS.construction = {
  autel: {
    niveaux: [
      { niveau: 1, zone: "40 × 40 × 40 m", cout: "—", flamme: 1 },
      { niveau: 2, zone: "80 × 80 × 80 m", cout: "1 Shroud Core", flamme: 1 },
      { niveau: 3, zone: "120 × 120 × 120 m", cout: "5 Shroud Core", flamme: 2 },
      { niveau: 4, zone: "160 × 160 × 160 m", cout: "5 Shroud Nexus", flamme: 3 }
    ],
    capacite: "Nombre d'autels actifs selon le niveau de Flamme : 4 (Flamme 2), 6, 7, 8, 9, 10, 11, 12, 13, puis 16 (Flamme 11). 16 autels au maximum dans le monde.",
    regles: [
      "Fabrication : 5 pierres, en fabrication manuelle (quête « Claim A Spot For Your Base » nécessaire).",
      "Tout ce que vous construisez dans la zone est permanent ; hors zone, le terrain se réinitialise au bout de 30 minutes ou au redémarrage.",
      "Désactiver l'autel lance un compte à rebours de 30 s ; un nouvel autel ne récupère pas les agrandissements de l'ancien.",
      "Le niveau de Flamme est global et ne baisse jamais."
    ],
    sources: ["wiki-altar"]
  },

  confort: {
    regles: [
      "Le bonus Reposé (endurance et récupération d'endurance nettement augmentées) s'obtient dans un endroit abrité (toit), chauffé (feu ou autel), sans danger proche et avec des objets de confort.",
      "Chaque niveau de confort ajoute du temps de Reposé (1 min par niveau selon le wiki, qui signale un bug possible). Maximum : 120.",
      "Well Rested : +2 min par rang (3 rangs). Jouer d'un instrument : +2 min.",
      "Les guides conseillent au moins un objet de chaque famille : lit, assise, table, tapis, éclairage, décoration murale, cheminée, salle de bain."
    ],
    exemples: [
      { objet: "Gold Scavenger Matron Trophy", confort: 10 }, { objet: "Ancient Bed / Chair / Stool / Bench / Small Ancient Table", confort: 9 },
      { objet: "Granite Throne", confort: 8 }, { objet: "Maritime Shower / Bathtub / Toilet / Sink", confort: 8 },
      { objet: "Ancient Temple Floor Brazier I / Ancient Wall Lamp", confort: 7 }, { objet: "Heart Pillow", confort: 6 }, { objet: "Carpet", confort: 4 }
    ],
    sources: ["wiki-comfort", "allthings-tips"]
  },

  survivants: [
    { nom: "Oswald Anders", role: "Forgeron", debloque: "Armures de mêlée, armes, outils de forge", marqueurs: ["AncientVault-Blacksmith"] },
    { nom: "Balthazar", role: "Alchimiste", debloque: "Armures magiques, potions, Shroud Core, station d'alchimie", marqueurs: ["AncientVault-Alchemist"] },
    { nom: "Cade Hawthorn", role: "Menuisier", debloque: "Meubles et décorations en bois (338 recettes au Carpenter en 1.0)", marqueurs: ["AncientVault-Carpenter"] },
    { nom: "Athalan Skree", role: "Chasseur", debloque: "Armures à distance, équipement de survie", marqueurs: ["AncientVault-Hunter"] },
    { nom: "Emily Fray", role: "Fermière", debloque: "Terre de culture, Seedbed, nourriture, animaux", marqueurs: ["AncientVault-Farmer"] }
  ],
  survivantsNote: "Autres artisans (Collector, Bard, Barber, Fisher, Ancient Researcher) et leurs assistants : voir la page Survivors du wiki. Chaque artisan a besoin d'un lit abrité ; réglez sa zone de déplacement sur 2 m pour qu'il reste près de son poste.",
  survivantsSources: ["wiki-survivors", "allthings-tips"],

  batiments: [
    {
      id: "base-croix", nom: "Base modulaire en croix", icone: "grid", etape: "Début", taille: "4 modules 3×3 autour d'un hub",
      resume: "Une plateforme centrale ouverte pour les établis, et quatre ailes : alchimie et coffres, ferme en contrebas, dortoir des survivants, tour de confort autour de l'autel.",
      etapes: [
        "Posez l'autel sur une butte (exemple : près de Longkeep), puis une grille 3×3 de plafonds en bois de 4 m à sa hauteur.",
        "Une passerelle, puis le hub 3×3 : poteaux de 4 m aux coins, toit en fibres, encadrements de porte posés à plat comme rambardes.",
        "Aile arrière murée : alchimiste et murs de coffres (étagères en encadrements de porte).",
        "Terrasse inférieure : terre de culture et Seedbed ; aile droite : dortoir sur plusieurs étages ; aile gauche : tour de confort autour de l'autel."
      ],
      materiaux: ["Rough Wood Block", "Plant Fiber Roof Block", "Small Chest", "Farm Soil"],
      astuces: ["Pas besoin de fondation en pierre : le jeu ne vérifie pas la solidité des structures.", "Chaque aile peut s'agrandir plus tard avec d'autres grilles 3×3."],
      sources: ["allthings-starter", "yt-onlybase"], video: "yt-onlybase"
    },
    {
      id: "maison-3x5", nom: "Maison 3×5 en bois et pierre (3 niveaux)", icone: "home", etape: "Début → milieu", taille: "3×5 fondations, cave + rez-de-chaussée + grenier",
      resume: "Une vraie maison : cave creusée, rez-de-chaussée avec autel et établis, grenier pour au moins 5 lits de survivants, toit en tuiles de pierre.",
      etapes: [
        "Grille 3×5 de fondations en Rough Wood Block, autel au centre.",
        "Cave : posez une fondation à moitié enterrée puis retirez-la (mode Retirer) pour creuser vite ; sol en Rough Stone Block.",
        "Cadre en pierre autour du plancher, poteaux et encadrements de porte en guise de rambarde.",
        "Murs en retrait d'un petit bloc, toit 4M Stone Shingle débordant, pignons en murs à gradins.",
        "Grenier : plancher en plafonds de bois, escalier en Shroud Wood, 5 lits, tables de chevet et coffres."
      ],
      materiaux: ["Rough Wood Block", "Rough Stone Block", "Shroud Wood Block", "4M Stone Shingle Roof"],
      astuces: ["Pour monter l'autel d'un cran : fondation à côté, désactiver, attendre 30 s, démonter, reposer avec l'aimantation.", "Fenêtres : murs pleins puis ouvertures découpées en mode Retirer."],
      sources: ["allthings-tips", "yt-starterbase"], video: "yt-starterbase"
    },
    {
      id: "ferme", nom: "Ferme et potager", icone: "drop", etape: "Début → fin",
      taille: "Une terrasse 3×3 suffit au départ",
      resume: "Des bacs de terre de culture alimentés en eau, et un Seedbed pour produire les plants. Indispensable pour la nourriture et les fibres.",
      etapes: [
        "Sauvez Emily Fray (Ancient Vault, voir la carte).",
        "Terre de culture : 7 Springlands Dirt + 3 Bonemeal → 10 (chez la fermière). Le Bonemeal sort de la Grinding Stone de l'alchimiste (2 Bones).",
        "Seedbed : 10 Wood Logs, 2 Metal Scraps, 10 Farm Soil. Une plante + une terre → 5 plants en 3 min (10 pour l'aloès et le lin).",
        "Bordez les parcelles, posez la terre, plantez. Une parcelle prête affiche Water 1/1 et Farm Soil 1/1.",
        "Plus tard : terre fertilisée (Veilwater Basin), terre de basalte (Cinder's Cradle), terre fleurie (miel de la ruche)."
      ],
      materiaux: ["Farm Soil", "Seedbed", "Water Dispenser (1 Metal Scraps + 3 Tin Bars)", "Irrigation Gate"],
      astuces: ["Fabriquez une fois sous un toit pour débloquer la recette de terre chez la fermière.", "La vitesse de pousse se règle dans les paramètres du monde (25 à 200 %)."],
      sources: ["pd-farming", "allthings-starter", "pd-base"]
    },
    {
      id: "coffres", nom: "Salle des coffres", icone: "layers", etape: "Début → milieu",
      resume: "Un mur de coffres près de l'entrée pour tout ranger d'un coup, puis des coffres magiques reliés aux établis.",
      etapes: [
        "Placez les coffres près de la porte : Quick-stack et Déposer vident l'inventaire en un passage.",
        "Étagères : encadrements de porte posés à plat sur des poteaux de 2 m, une rangée de coffres par niveau.",
        "Transformez-les en coffres magiques sur place : Medium Magic Chest = 1 Medium Chest + 1 Shroud Core + 2 Goo. « Enlarge » agrandit sans vider.",
        "Large Quick Stack Station : 1 Shroud Core, 2 Goo, 10 Limestone."
      ],
      materiaux: ["Medium Chest (8 Nails, 10 Wood Planks, 2 Metal Sheets)", "Huge Chest (16 Nails, 20 Wood Planks, 2 Iron Bars)", "Shroud Core", "Goo"],
      astuces: ["Désactivez « Recevoir le Quick-stack » sur les coffres qui ne doivent pas prendre vos objets de barre rapide."],
      sources: ["pd-base", "allthings-tips", "allthings-starter"]
    },
    {
      id: "atelier", nom: "Atelier des artisans", icone: "hammer", etape: "Début → fin",
      resume: "Les établis et les survivants regroupés : chaque artisan à côté de son poste, avec un lit abrité.",
      etapes: [
        "Établi, four (Kiln : 30 briques par fabrication), forge et alchimie sur un côté de la pièce principale.",
        "Un lit abrité par artisan (dortoir ou grenier).",
        "Zone de déplacement des survivants : 2 m (le 0 m n'existe plus en 1.0).",
        "Ajoutez les améliorations de poste : outils de maçonnerie (173 recettes), scie (148), outils de forge (41)."
      ],
      materiaux: ["Workbench", "Kiln", "Forge", "Alchemy Station"],
      astuces: ["Les lits d'animaux doivent rester loin des murs, sinon les animaux se coincent."],
      sources: ["allthings-tips", "pd-base", "wiki-survivors"]
    },
    {
      id: "confort", nom: "Pièce de confort", icone: "heart", etape: "Milieu → fin",
      resume: "Une pièce (ou une tour) remplie d'objets de confort pour allonger le bonus Reposé.",
      etapes: [
        "Toit + chaleur (feu ou autel) + aucun ennemi proche : conditions du bonus Reposé.",
        "Un objet de chaque famille : lit, assise, table, tapis, éclairage, décoration murale, cheminée, salle de bain.",
        "Les objets anciens (Ancient Bed, Chair… : +9) et la salle de bain maritime (+8) sont parmi les meilleurs.",
        "Ajoutez des instruments (le barde en fabrique 5) : jouer donne +2 min de Reposé."
      ],
      materiaux: ["Meubles du Carpenter", "Fireplace (pierre + bois, à l'établi)", "Candle (éclairage 2)", "Throne Room Floor Lamp (éclairage 6)"],
      astuces: ["Le statut doit afficher Sheltered, Warmth et Comfortable."],
      sources: ["wiki-comfort", "allthings-tips"]
    },
    {
      id: "cheminee", nom: "Cheminée encastrée et flamme cachée", icone: "flame", etape: "Projet déco",
      resume: "Une alcôve en pierre sous l'escalier, la cheminée enfoncée dans un âtre, et des torches cachées pour un vrai feu.",
      etapes: [
        "Alcôve en pierre avec un sol d'âtre.",
        "Enfoncez la Fireplace dans l'âtre et placez un encadrement de fenêtre devant en guise de grille.",
        "Cachez deux torches derrière en réglage fin, recouvrez de pierre, et percez un conduit vers l'extérieur."
      ],
      materiaux: ["Fireplace", "Standing Torch", "Rough Stone Block"],
      astuces: [],
      sources: ["allthings-tips"]
    },
    {
      id: "base-cinder", nom: "Avant-poste de fin de partie à Cinder's Cradle", icone: "map", etape: "Fin",
      resume: "Un petit avant-poste près du site minier de Celestium (au nord d'un Elixir Well) : plateformes et machines déjà en place, peu d'ennemis, mais de la lave autour.",
      etapes: ["Posez l'autel à l'écart des coulées de lave.", "Construisez sur les plateformes existantes pour économiser des blocs.", "Utilisez les blocs anciens de la région (basalte, pierre de lune) pour le style."],
      materiaux: ["Ancient Stone Block", "Ancient Circles Block", "Moonstone Block"],
      astuces: [],
      sources: ["kg-bases", "allthings-blocks10"]
    }
  ],

  emplacements: [
    { nom: "Braelyn Bridge (bord du lac)", region: "Springlands", etape: "Début", pourquoi: "Grand étang, île, fibres, roseaux, gibier et cultures ; grandes zones d'herbe. Présenté comme l'une des meilleures bases permanentes.", sources: ["kg-bases"] },
    { nom: "Plaines de Longkeep", region: "Springlands", etape: "Début", pourquoi: "Bois, pierre, fibres, silex et ferraille à proximité ; sel à la carrière. Terrain plutôt plat.", marqueurs: ["Longkeep"], sources: ["kg-bases", "allthings-starter"] },
    { nom: "Harvest Homestead", region: "Springlands", etape: "Début", pourquoi: "Champs autour pour cultiver, maison à deux étages déjà debout.", marqueurs: ["HarvestHomestead"], sources: ["kg-bases"] },
    { nom: "Woodgard", region: "Springlands", etape: "Début", pourquoi: "Eau claire, poissons, silex et sel ; cottage en pierre existant. Meilleure base de départ selon Grind n' Strat.", marqueurs: ["Woodgard"], sources: ["kg-bases", "grindnstrat-bases"] },
    { nom: "Ferndale", region: "Springlands", etape: "Début", pourquoi: "Tomates, maïs, fibres, un puits, silex et sel.", marqueurs: ["Ferndale"], sources: ["kg-bases"] },
    { nom: "Taverne « Blue Goblet »", region: "Revelwood", etape: "Milieu", pourquoi: "Taverne de trois étages sur un plateau, grotte proche et place pour une ferme.", marqueurs: ["BlueGobletTavern"], sources: ["kg-bases"] },
    { nom: "Sud de Pikemead's Reach", region: "Revelwood", etape: "Milieu", pourquoi: "Cuivre, bois dur, ambre et matériaux du Voile ; proche de Flame Shrines.", marqueurs: ["PikemeadsReach"], sources: ["kg-bases"] },
    { nom: "Colline de Blackmire", region: "Blackmire", etape: "Milieu", pourquoi: "Large versant en pente douce à aplanir, arbres géants.", sources: ["kg-bases"] },
    { nom: "Lac gelé d'Albaneve", region: "Albaneve Summits", etape: "Fin", pourquoi: "Eau, glace à récolter, plateau surélevé.", sources: ["kg-bases"] },
    { nom: "Salle du trône de Cromville", region: "Veilwater Basin", etape: "Fin", pourquoi: "Château existant avec cours intérieures ; ennemis de niveau 45 autour.", marqueurs: ["CromvilleThroneroom"], sources: ["kg-bases"] },
    { nom: "Site minier de Celestium", region: "Cinder's Cradle", etape: "Fin", pourquoi: "Plateformes et machines, accès au Voile, mines ; lave proche.", sources: ["kg-bases"] }
  ],

  // Blocs de construction (page « Building Materials » du wiki, v1.0.0.0, modifiée le 20/10/2026).
  // mode : "ramassage" = la recette se débloque en ramassant le matériau (partout) ;
  //        "lieu" = la recette se trouve à un endroit précis (coffre, donjon, quête) ;
  //        "fabrication" = débloquée en fabriquant le matériau.
  blocs: [
    { nom: "Rough Wood Block", cat: "Bois", recette: "2 Wood Logs", mode: "ramassage", region: "Springlands" },
    { nom: "Shroud Wood Block", cat: "Bois", recette: "2 Shroud Wood", mode: "ramassage", region: "Springlands", lieu: "Arbres morts du Voile" },
    { nom: "Tarred Wood Block", cat: "Bois", recette: "2 Wood Logs + 2 Tar", mode: "fabrication", region: "Springlands", lieu: "Goudron au Charcoal Kiln" },
    { nom: "Refined Wood Block", cat: "Bois", recette: "8 Wood Planks + 2 Wood Logs", mode: "fabrication", region: "Revelwood", lieu: "Planches à la scie" },
    { nom: "Ornate Wood Block", cat: "Bois", recette: "10 Wood Planks", mode: "fabrication", region: "Revelwood" },
    { nom: "Palm Wood Block", cat: "Bois", recette: "7 Palm Wood Logs + 3 Wood Logs", mode: "ramassage", region: "Kindlewastes" },
    { nom: "Conifer Wood Block", cat: "Bois", recette: "10 Conifer Logs", mode: "ramassage", region: "Albaneve Summits" },
    { nom: "Bamboo Wood Block", cat: "Bois", recette: "10 Bamboo Logs", mode: "ramassage", region: "Veilwater Basin" },
    { nom: "Half-Timbered Block", cat: "Bois", recette: "5 Lump of Clay + 5 Wood Logs", mode: "lieu", region: "Revelwood", lieu: "Diadwyn (coffre près d'une tente)", marqueurs: ["Diadwyn"], quete: "Diadwyn and its Building Blocks" },
    { nom: "Brick-Timbered Block", cat: "Bois", recette: "1 Fired Bricks Block + 5 Wood Logs", mode: "lieu", region: "Revelwood", lieu: "Fort Kelvin", marqueurs: ["FortKelvin"] },
    { nom: "Plaited Block", cat: "Bois", recette: "10 Twigs", mode: "lieu", region: "Blackmire", lieu: "Village vukah abandonné de Blackmire (non marqué sur la carte)" },
    { nom: "Half-timbered Shell Limestone Block", cat: "Bois", recette: "5 Tropical Wood + 5 Shell Limestone", mode: "lieu", region: "Veilwater Basin", lieu: "Déblocage non documenté par le wiki" },
    { nom: "Rough Stone Block", cat: "Pierre", recette: "2 Stone", mode: "ramassage", region: "Springlands" },
    { nom: "Rough Flintstone Block", cat: "Pierre", recette: "10 Flintstone", mode: "ramassage", region: "Springlands" },
    { nom: "Mycelium Overgrown Block", cat: "Pierre", recette: "2 Stone + 2 Mycelium", mode: "ramassage", region: "Springlands", lieu: "Mycélium en minant dans le Voile" },
    { nom: "Roughly Cut Stone Block", cat: "Pierre", recette: "8 Stone + 2 Rubble", mode: "lieu", region: "Springlands", lieu: "Netherton (maisons en ruine)", marqueurs: ["Netherton"], quete: "Ruined Netherton", conflit: "AllThings.How (1.0) indique qu'il se débloque en ramassant n'importe quel bloc de base." },
    { nom: "Hollow Halls Block", cat: "Pierre", recette: "5 Stone + 1 Tar", mode: "lieu", region: "Springlands", lieu: "Springlands Hollow Halls (coffres d'argent des salles latérales, avant le Collector)", marqueurs: ["HollowHalls-Springlands"] },
    { nom: "Fired Bricks Block", cat: "Pierre", recette: "10 Fired Brick", mode: "fabrication", region: "Revelwood", lieu: "Briques au four (Kiln)" },
    { nom: "Weathered Stone Block", cat: "Pierre", recette: "5 Stone + 5 Revelwood Stone", mode: "lieu", region: "Revelwood", lieu: "Bramblespine Boneyard (coffre d'argent au bout des catacombes)", marqueurs: ["BramblespineBoneyard"], quete: "A Rumble in the Catacombs" },
    { nom: "Citywall Block", cat: "Pierre", recette: "8 Revelwood Stone + 2 Revelwood Dirt", mode: "lieu", region: "Revelwood", lieu: "Fawnsong Frontier (coffre d'argent sur les échafaudages de la tour)", marqueurs: ["FawnsongFrontier"], quete: "A Tower to the Stars" },
    { nom: "Temple Stones (Vukah Temple Stone)", cat: "Pierre", recette: "8 Blackmire Stone + 2 Blackmire Dirt", mode: "lieu", region: "Revelwood", lieu: "Treetop Vukah Settlement", marqueurs: ["TreetopVukahSettlement"] },
    { nom: "Castle Wall Stone Block", cat: "Pierre", recette: "5 Stone + 5 Nomad Highlands Dirt", mode: "lieu", region: "Nomad Highlands", lieu: "Mining Rift (coffre d'argent sur la plateforme au-dessus de la faille)", marqueurs: ["MiningRift", "MiningRift2"], quete: "Fortification", note: "Deux « Mining Rift » sur la carte : les deux sont épinglés." },
    { nom: "Fancy Stone Block", cat: "Pierre", recette: "7 Limestone + 3 Wood Planks", mode: "lieu", region: "Nomad Highlands", lieu: "Raven's Keep (après la Matron)", marqueurs: ["RavensKeep"], quete: "In Need of a Tanning Station" },
    { nom: "Limestone Block", cat: "Pierre", recette: "6 Limestone + 4 Springlands Dirt", mode: "lieu", region: "Nomad Highlands", lieu: "Surat's Rest", marqueurs: ["SuratsRest"], quete: "Caravan Raid" },
    { nom: "Mixed Sandstone Block", cat: "Pierre", recette: "5 Sandstone + 5 Limestone", mode: "lieu", region: "Nomad Highlands", lieu: "Scavenger Outpost", marqueurs: ["ScavengerOutpost"] },
    { nom: "Regular Stone Block", cat: "Pierre", recette: "10 Stone", mode: "lieu", region: "Nomad Highlands", lieu: "Ruined Bridge (coffre en bois sur la plateforme du pont)", marqueurs: ["RuinedBridge"], quete: "Mixed Stones" },
    { nom: "Refined Stone Block", cat: "Pierre", recette: "5 Limestone + 5 Flintstone", mode: "lieu", region: "Nomad Highlands", lieu: "Selon un guide de 2024 : coffre de l'Inner Sanctuary, près des Pillars of Creation (non marqué)", quete: "Finding Masonry Tools" },
    { nom: "Rough Sandstone Block", cat: "Pierre", recette: "10 Sandstone", mode: "ramassage", region: "Kindlewastes" },
    { nom: "Regular Sandstone Block", cat: "Pierre", recette: "8 Sandstone + 2 Lump of Clay", mode: "ramassage", region: "Kindlewastes" },
    { nom: "Refined Sandstone Block", cat: "Pierre", recette: "5 Sandstone + 2 Sand + 2 Lump of Clay + 1 Indigo Plant", mode: "ramassage", region: "Kindlewastes" },
    { nom: "Highly Polished Stone Block", cat: "Pierre", recette: "15 Stone", mode: "lieu", region: "Kindlewastes", lieu: "Ocean's Heart (butin de la Scavenger Matron)", marqueurs: ["OceansHeart"], quete: "Loom for the Hunter" },
    { nom: "Desert City Wall", cat: "Pierre", recette: "15 Sandstone", mode: "lieu", region: "Kindlewastes", lieu: "Taverne « Far Away Fray » (coffre d'argent)", marqueurs: ["FarAwayFrayTavern"], quete: "Emily Fray's Tavern", conflit: "Destructoid place le coffre au centre de Brittlebush." },
    { nom: "Desert Temple Block", cat: "Pierre", recette: "8 Sandstone + 2 Indigo Plant", mode: "lieu", region: "Kindlewastes", lieu: "Sun Temple du sud-ouest (à l'ouest de Deepcut) — plusieurs Sun Temples sur la carte, non épinglé", quete: "Derelict Kindlewastes" },
    { nom: "Well Block", cat: "Pierre", recette: "8 Stone + 2 Shroud Liquid", mode: "lieu", region: "Kindlewastes", lieu: "Coffre gardé par une Fell Monstrosity, au nord d'un Elixir Well et au sud-est d'un Ancient Obelisk — non épinglé (21 Elixir Wells)" },
    { nom: "Granite Block", cat: "Pierre", recette: "10 Granite", mode: "ramassage", region: "Albaneve Summits" },
    { nom: "Polished Granite Block", cat: "Pierre", recette: "15 Granite", mode: "lieu", region: "Albaneve Summits", lieu: "Gateway Outpost « Bora »", marqueurs: ["GatewayOutpostBora"] },
    { nom: "Castle Block", cat: "Pierre", recette: "5 Shell Limestone + 5 Granite", mode: "ramassage", region: "Veilwater Basin" },
    { nom: "Shell Limestone Block", cat: "Pierre", recette: "10 Shell Limestone", mode: "ramassage", region: "Veilwater Basin" },
    { nom: "Drak Temple Block", cat: "Pierre", recette: "9 Shell Limestone + 1 Gold Bars", mode: "lieu", region: "Veilwater Basin", lieu: "Un Drak'Dal Temple — 6 sur la carte, non épinglé" },
    { nom: "Ancient Stone Block", cat: "Pierre", recette: "10 Moonstone + 10 Basalt", mode: "ramassage", region: "Cinder's Cradle" },
    { nom: "Ancient Circles Block", cat: "Pierre", recette: "10 Basalt", mode: "ramassage", region: "Cinder's Cradle" },
    { nom: "Ancient Dungeon Block", cat: "Pierre", recette: "10 Basalt", mode: "ramassage", region: "Cinder's Cradle" },
    { nom: "Weathered Ancient Stone Block", cat: "Pierre", recette: "100 Ancient Stone Block + 5 Blackmire Stone", mode: "lieu", region: "Blackmire", lieu: "Lost Ancient Temple de Blackmire : coffre verrouillé derrière une porte à étincelles (10 Sparks) — non marqué", sourcesLieu: ["allthings-blocks10"] },
    { nom: "Blue Luminescent Block", cat: "Lumineux", recette: "5 Stone + 5 Luminous Growth", mode: "ramassage", region: "Springlands", lieu: "Luminous Growth dans les grottes" },
    { nom: "White Luminescent Block", cat: "Lumineux", recette: "5 Stone + 5 White Glowing Substance", mode: "ramassage", region: "Springlands" },
    { nom: "Green Luminescent Block", cat: "Lumineux", recette: "5 Stone + 5 Purified Slime", mode: "ramassage", region: "Revelwood" },
    { nom: "Yellow Luminescent Block", cat: "Lumineux", recette: "3 Glass + 3 Saffron + 4 Flintstone", mode: "ramassage", region: "Kindlewastes" },
    { nom: "Ancient Beacon Block", cat: "Lumineux", recette: "3 Celestium Ore + 3 Magma Gel + 4 Cinder Rock", mode: "lieu", region: "Cinder's Cradle", lieu: "Coffre dans une tour de l'Island Ruin (îles célestes) — non marqué", sourcesLieu: ["allthings-blocks10"] },
    { nom: "Metal Block", cat: "Métal et autres", recette: "1 Metal Sheets + 5 bois", mode: "fabrication", region: "Springlands" },
    { nom: "Copper Block", cat: "Métal et autres", recette: "1 Copper Bar + 5 bois", mode: "fabrication", region: "Revelwood" },
    { nom: "Bronze Block", cat: "Métal et autres", recette: "1 Bronze Bars + 5 bois", mode: "fabrication", region: "Nomad Highlands" },
    { nom: "Iron Block", cat: "Métal et autres", recette: "1 Iron Bars + 5 bois", mode: "fabrication", region: "Kindlewastes" },
    { nom: "Bone Block", cat: "Métal et autres", recette: "10 Bones", mode: "lieu", region: "Springlands", lieu: "Hidden Tomb au nord des Springlands — plusieurs Hidden Tombs sur la carte, non épinglé", quete: "Searching for Hidden Tombs" },
    { nom: "Red Marble Block", cat: "Métal et autres", recette: "10 Red Marble Fragment", mode: "lieu", region: "Revelwood", lieu: "Revelwood Hollow Halls", marqueurs: ["HollowHalls-Revelwood"] },
    { nom: "Ectoplasm Block", cat: "Métal et autres", recette: "5 Flintstone + 5 Ectoplasm Shard", mode: "lieu", region: "Nomad Highlands", lieu: "Nomad Highlands Hollow Halls", marqueurs: ["HollowHalls-NomadHighlands"] },
    { nom: "Midnight Tomb Block", cat: "Métal et autres", recette: "9 Red Marble Fragment + 1 Bronze Bars", mode: "lieu", region: "Albaneve Summits", lieu: "Fin d'une crypte sur une colline à l'est de Balefire Lance Point — non marqué" },
    { nom: "Obsidian Block", cat: "Métal et autres", recette: "9 Obsidian + 1 Silver Bars", mode: "lieu", region: "Albaneve Summits", lieu: "Au sommet de la Forge of Obsidia", marqueurs: ["ForgeOfObsidia"] },
    { nom: "Starlight Block", cat: "Métal et autres", recette: "8 Granite + 1 Bronze Bars + 1 Lapislazuli", mode: "lieu", region: "Albaneve Summits", lieu: "Un Night Sanctum d'Albaneve — 30 Night Sanctums sur la carte, non épinglé" },
    { nom: "Red Carpet Block", cat: "Métal et autres", recette: "4 Red Fabric + 1 Paper Reed", mode: "lieu", region: "Veilwater Basin", lieu: "Stillwater Bay", marqueurs: ["StillwaterBay"] },
    { nom: "Moonstone Block", cat: "Métal et autres", recette: "10 Moonstone + 4 Sparkling Dust + 3 Basalt", mode: "ramassage", region: "Cinder's Cradle" },
    { nom: "Ancient Gold Block", cat: "Métal et autres", recette: "5 Gold Bars", mode: "lieu", region: "Cinder's Cradle", lieu: "Coffre d'argent sur une corniche sous l'Ancient Citadel (plus haute île céleste) — non marqué", sourcesLieu: ["allthings-blocks10"] }
  ],
  blocsSources: ["wiki-building", "allthings-blocks10", "destructoid-blocks", "gamerguides-blocks"],
  blocsNote: "Recettes et lieux : page « Building Materials » du wiki (v1.0, 20/10/2026). Quêtes associées : guide GamerGuides (2024). Blocs 1.0 de Cinder's Cradle et Blackmire : AllThings.How. Un lieu présent plusieurs fois sur la carte n'est pas épinglé.",

  videos: [
    { id: "yt-onlybase", chapitres: [["0:59", "Présentation et agrandissements"], ["1:07", "Emplacement et autel"], ["1:44", "Grilles de plancher"], ["2:18", "Charpente et toit du hub"], ["2:39", "Rambardes en encadrements de porte"], ["3:28", "Le repaire de l'alchimiste"]] },
    { id: "yt-starterbase" }, { id: "yt-buildguide" }, { id: "yt-baselocations" }, { id: "yt-settlement" }
  ]
};
