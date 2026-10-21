// Registre des sources consultées. Chaque donnée du site référence un ou plusieurs `id` ci-dessous.
// type : officiel | wiki | base-donnees | guide | presse
// fiabilite : haute | moyenne | faible  (appréciation éditoriale, pas une garantie)
window.ENS = window.ENS || {};
window.ENS.sources = [
  {
    id: "steam-news", nom: "Actualités officielles Enshrouded (Steam)", type: "officiel", fiabilite: "haute",
    url: "https://store.steampowered.com/news/app/1203620",
    consulte: "2026-10-20",
    note: "Source de référence. Lue via l'API publique ISteamNews (scripts/check-updates.mjs) : notes des hotfix 1.0.0.1 et 1.0.0.2 vérifiées. Le détail de la note 1.0.0.0 est repris via la presse (KeenGamer, Nodecraft)."
  },
  {
    id: "wiki-skills", nom: "Enshrouded Wiki — Skills", type: "wiki", fiabilite: "moyenne",
    url: "https://enshrouded.wiki.gg/wiki/Skills",
    consulte: "2026-10-20", miseAJourSource: "2026-10-15",
    note: "Modifiée le 15/10/2026, mais la structure semble pré-1.0 : les compétences de dagues y figurent encore dans l'Athlète alors que la 1.0 les a déplacées vers l'Assassin, et les nouvelles compétences 1.0 n'y apparaissent pas."
  },
  {
    id: "wiki-weapons", nom: "Enshrouded Wiki — Weapons", type: "wiki", fiabilite: "moyenne",
    url: "https://enshrouded.wiki.gg/wiki/Weapons",
    consulte: "2026-10-20",
    note: "Liste longue avec atouts et provenance, sans dégâts ni niveaux. Données pré-1.0."
  },
  {
    id: "wiki-armor", nom: "Enshrouded Wiki — Armor", type: "wiki", fiabilite: "moyenne",
    url: "https://enshrouded.wiki.gg/wiki/Armor",
    consulte: "2026-10-20",
    note: "Niveaux, rareté et provenance des sets. Niveaux pré-1.0 (plafond d'équipement de l'époque : 45)."
  },
  {
    id: "wiki-shields", nom: "Enshrouded Wiki — Shields", type: "wiki", fiabilite: "moyenne",
    url: "https://enshrouded.wiki.gg/wiki/Shields",
    consulte: "2026-10-20", miseAJourSource: "2026-05-23",
    note: "Dernière modification le 23/05/2026 : antérieure à la 1.0."
  },
  {
    id: "pd-weapons", nom: "PinDrop — Weapons", type: "base-donnees", fiabilite: "moyenne",
    url: "https://pindrop.gg/enshrouded/weapons",
    consulte: "2026-10-20", miseAJourSource: "2026-10-16",
    note: "Site de fans. Indique lui-même : 30 armes sur 294 vérifiées dans les fichiers 1.0, le reste repris du wiki pré-1.0. Les lignes 1.0 donnent des multiplicateurs, pas de dégâts affichés en jeu."
  },
  {
    id: "pd-armor", nom: "PinDrop — Armor", type: "base-donnees", fiabilite: "moyenne",
    url: "https://pindrop.gg/enshrouded/armor",
    consulte: "2026-10-20", miseAJourSource: "2026-10-18",
    note: "Partiellement mis à jour pour la 1.0 (plafonds, déblocages, butin des sets). Bonus de sets majoritairement pré-1.0."
  },
  {
    id: "pd-rings", nom: "PinDrop — Rings", type: "base-donnees", fiabilite: "moyenne",
    url: "https://pindrop.gg/enshrouded/rings",
    consulte: "2026-10-20", miseAJourSource: "2026-10-17",
    note: "Extrait des fichiers du serveur dédié 1.0 (build 1267041). Les fichiers ne contiennent pas les noms anglais des anneaux : seuls des identifiants internes sont connus."
  },
  {
    id: "pd-skilltree", nom: "PinDrop — Skill tree", type: "base-donnees", fiabilite: "moyenne",
    url: "https://pindrop.gg/enshrouded/skill-tree",
    consulte: "2026-10-20", miseAJourSource: "2026-10-17",
    note: "Mis à jour pour la 1.0 depuis les fichiers (build 1267041). Donne coûts/rangs et 212 points au total, mais peu de descriptions d'effets."
  },
  {
    id: "pd-ignited-bow", nom: "PinDrop — Ignited Bow", type: "base-donnees", fiabilite: "moyenne",
    url: "https://pindrop.gg/enshrouded/weapons/ignited-bow",
    consulte: "2026-10-20", miseAJourSource: "2026-10-16",
    note: "Valeurs pré-1.0 : la page indique explicitement qu'elles n'ont pas été vérifiées sur la 1.0."
  },
  {
    id: "pd-battering-ram", nom: "PinDrop — Battering Ram Hammer", type: "base-donnees", fiabilite: "moyenne",
    url: "https://pindrop.gg/enshrouded/weapons/battering-ram-hammer",
    consulte: "2026-10-20", miseAJourSource: "2026-10-16",
    note: "Valeurs pré-1.0, non vérifiées sur la 1.0 (indiqué sur la page)."
  },
  {
    id: "gameleap-legendary", nom: "GameLeap — All Legendary Weapons", type: "guide", fiabilite: "faible",
    url: "https://www.gameleap.com/articles/enshrouded-all-legendary-weapons-list",
    consulte: "2026-10-20",
    note: "Valeurs divergentes de PinDrop pour certaines armes ; date de mise à jour inconnue."
  },
  {
    id: "kg-patch", nom: "KeenGamer — Enshrouded 1.0 Patch Notes", type: "presse", fiabilite: "moyenne",
    url: "https://www.keengamer.com/articles/guides/enshrouded-1-0-patch-notes-all-new-features-and-changes/",
    consulte: "2026-10-20",
    note: "Résumé de presse des notes 1.0. À recouper avec l'annonce officielle Steam."
  },
  {
    id: "nodecraft-10", nom: "Nodecraft — 1.0 combat changes", type: "presse", fiabilite: "moyenne",
    url: "https://nodecraft.com/blog/game-news-tips/enshrouded-1-0-combat-changes-new-spells-skills-level-cap-and-more",
    consulte: "2026-10-20",
    note: "Basé sur l'annonce du 23/09/2026, avant la sortie : le contenu final peut différer."
  },
  {
    id: "theclick-hotfix", nom: "TheClick — Hotfix 1.0.0.2", type: "presse", fiabilite: "moyenne",
    url: "https://www.theclick.gg/enshrouded-hotfix-1-0-0-2-patch-notes/",
    consulte: "2026-10-20",
    note: "Hotfix 1.0.0.2 du 16/10/2026 (build 1269579) : corrections de sauvegardes et plantages."
  },
  {
    id: "kg-builds", nom: "KeenGamer — Enshrouded 1.0 Best Builds", type: "guide", fiabilite: "moyenne",
    url: "https://www.keengamer.com/articles/guides/enshrouded-1-0-best-builds-weapons-armor-skills/",
    consulte: "2026-10-20", miseAJourSource: "2026-10-17",
    note: "Guide 1.0 nommant des objets précis. Plusieurs noms (anneaux notamment) n'ont pu être recoupés avec aucune base de données."
  },
  {
    id: "eb-battlemage", nom: "Enshrouded Builds — Battlemage 1.0", type: "guide", fiabilite: "moyenne",
    url: "https://enshroudedbuilds.org/builds/battlemage/",
    consulte: "2026-10-20", miseAJourSource: "2026-10-20",
    note: "Ordre de compétences détaillé. Incohérences internes signalées (numéro de build, arbre de Blink, ordre court vs long)."
  },
  {
    id: "htm-tier", nom: "Hack The Minotaur — Class tier list 1.0", type: "guide", fiabilite: "faible",
    url: "https://hacktheminotaur.com/enshrouded/enshrouded-best-class-tier-list/",
    consulte: "2026-10-20",
    note: "Classements d'opinion ; d'autres sites classent différemment."
  },
  {
    id: "sk-barbarian", nom: "Sportskeeda — Barbarian build 1.0", type: "guide", fiabilite: "faible",
    url: "https://www.sportskeeda.com/mmo/best-enshrouded-1-0-barbarian-build-guide",
    consulte: "2026-10-20",
    note: "Page non lisible automatiquement (HTTP 405) : seul le résumé du moteur de recherche a été exploité. À vérifier manuellement."
  },
  {
    id: "wiki-catalogue", nom: "Enshrouded Wiki — catalogue complet (API)", type: "wiki", fiabilite: "moyenne",
    url: "https://enshrouded.wiki.gg/wiki/Category:Weapons",
    consulte: "2026-10-20", miseAJourSource: "2026-10-20",
    note: "882 pages lues via l'API du wiki (armes, armures, sets, anneaux, boucliers, sorts). Chaque objet indique la date de dernière modification de sa page : 526 pages ont été modifiées depuis la 1.0. Le wiki prévient que ses calculs de dégâts d'armes ne sont plus à jour depuis Wake of Water : ils ne sont pas repris."
  },
  {
    id: "wiki-map", nom: "Enshrouded Wiki — carte interactive (DataMaps)", type: "wiki", fiabilite: "moyenne",
    url: "https://enshrouded.wiki.gg/wiki/Map",
    consulte: "2026-10-20", miseAJourSource: "2026-08-02",
    note: "Fond de carte (rendu du jeu) daté du 11/11/2025, donc antérieur à la 1.0 : Cinder's Cradle n'y figure pas. Marqueurs mis à jour le 02/08/2026. Emplacements d'objets issus des liens de carte des pages du wiki."
  },
  {
    id: "allthings-map", nom: "AllThings.How — carte interactive Enshrouded", type: "base-donnees", fiabilite: "moyenne",
    url: "https://allthings.how/enshrouded/map/",
    consulte: "2026-10-20",
    note: "Carte complète incluant Cinder's Cradle (1.0). Seule carte 1.0 testée qui accepte d'être intégrée dans une page. Pas de date de mise à jour ni d'origine des données indiquées."
  },
  {
    id: "thgl-map", nom: "The Hidden Gaming Lair — Enshrouded map", type: "base-donnees", fiabilite: "moyenne",
    url: "https://enshrouded.th.gl/",
    consulte: "2026-10-20",
    note: "Carte construite depuis les données du jeu, annoncée à jour pour la 1.0. Refuse l'intégration dans une autre page : lien externe uniquement."
  },
  {
    id: "mapgenie", nom: "Map Genie — Enshrouded", type: "base-donnees", fiabilite: "moyenne",
    url: "https://mapgenie.io/enshrouded/maps/embervale",
    consulte: "2026-10-20",
    note: "Refuse l'intégration dans une autre page : lien externe uniquement. Contenu non vérifié pour la 1.0."
  },
  {
    id: "aoeah-tier", nom: "AoEAH — Enshrouded 1.0 Best Builds Tier List (Solo & Duo)", type: "guide", fiabilite: "moyenne",
    url: "https://www.aoeah.com/news/4895--enshrouded-10-best-builds-tier-list-solo--duo",
    consulte: "2026-10-20", miseAJourSource: "2026-10-19",
    note: "11 builds 1.0 classés en solo et en duo, avec armes, armures, anneaux et compétences. Plusieurs pièces sans emplacement indiqué ; certains noms sont approximatifs (« Vesta's Mace », « Welling Blade »…)."
  },
  {
    id: "pd-best-armor", nom: "PinDrop — Best Armor Sets", type: "guide", fiabilite: "moyenne",
    url: "https://pindrop.gg/enshrouded/guides/best-armor-sets",
    consulte: "2026-10-20", miseAJourSource: "2026-10-19",
    note: "Classement des sets par classe selon l'armure totale (valeurs du wiki d'avant la 1.0 ; niveaux vérifiés dans les fichiers 1.0 pour certains sets)."
  },
  {
    id: "pd-best-weapons", nom: "PinDrop — Best Weapons 1.0", type: "guide", fiabilite: "moyenne",
    url: "https://pindrop.gg/enshrouded/guides/best-weapons",
    consulte: "2026-10-20", miseAJourSource: "2026-10-19",
    note: "Armes nommées par famille et rareté, issues des fichiers 1.0 (build 1267041). Pas de classement par dégâts."
  },
  {
    id: "g2a-builds", nom: "G2A News — Best Enshrouded builds for 1.0", type: "guide", fiabilite: "faible",
    url: "https://www.g2a.com/news/features/guide/best-enshrouded-builds-for-1-0-mage-ranger-warrior-and-more/",
    consulte: "2026-10-20", miseAJourSource: "2026-10-15",
    note: "Classement : Mage de bataille, puis Invocateur, puis Archer à critiques."
  },
  {
    id: "yt-7builds", nom: "YouTube — « 7 BEST Builds For Enshrouded 1.0 Ranked! »", type: "video", fiabilite: "faible",
    url: "https://www.youtube.com/watch?v=gPSXNscZ6Sw", consulte: "2026-10-20", miseAJourSource: "2026-10-18",
    note: "Vidéo non analysée : seuls le titre et la date sont lisibles automatiquement."
  },
  {
    id: "yt-top3", nom: "YouTube — « Enshrouded 1.0 - NEW TOP 3 BEST BUILDS! »", type: "video", fiabilite: "faible",
    url: "https://www.youtube.com/watch?v=MiMobBWTn4w", consulte: "2026-10-20", miseAJourSource: "2026-10-16",
    note: "Vidéo non analysée : seuls le titre et la date sont lisibles automatiquement."
  },
  {
    id: "yt-berserker", nom: "YouTube — « DEADLIEST & Most Fun Berserker Build in Enshrouded 1.0 »", type: "video", fiabilite: "faible",
    url: "https://www.youtube.com/watch?v=-1EJeZdGXR0", consulte: "2026-10-20", miseAJourSource: "2026-10-16",
    note: "Vidéo non analysée : seuls le titre et la date sont lisibles automatiquement."
  },
  {
    id: "yt-start", nom: "YouTube — « Enshrouded 1.0 - How To Have The Absolute Best Start »", type: "video", fiabilite: "faible",
    url: "https://www.youtube.com/watch?v=JZsWe66A3ZM", consulte: "2026-10-20",
    note: "Vidéo de début de partie ; non analysée."
  },
  {
    id: "htm-skills", nom: "Hack The Minotaur — Best Skills Ranked (1.0)", type: "guide", fiabilite: "moyenne",
    url: "https://hacktheminotaur.com/enshrouded/best-skills-in-enshrouded/", consulte: "2026-10-20", miseAJourSource: "2026-10-15",
    note: "Classement 1.0 : Double Jump (« à prendre sur tous les builds »), Blink, Updraft, Dessert Stomach (« utile pour tous les builds »), spécialisation d'arme (« recommandée pour tous les builds »)… Quelques incohérences d'arbre entre sections."
  },
  {
    id: "gamesgg-skills", nom: "games.gg — Enshrouded Best Skills Guide", type: "guide", fiabilite: "faible",
    url: "https://games.gg/enshrouded/guides/enshrouded-best-skills-guide/", consulte: "2026-10-20", miseAJourSource: "2026-06-09",
    note: "Basé sur l'update 7 (avant 1.0) : coûts parfois périmés. Liste « tous les builds, tôt » : Double Jump, Airborne, Rebound, Miner."
  },
  {
    id: "gameboost-reset", nom: "GameBoost — Builds rebuilt for 1.0", type: "guide", fiabilite: "faible",
    url: "https://gameboost.com/blog/enshrouded-builds-skill-tree-reset", consulte: "2026-10-20", miseAJourSource: "2026-10-19",
    note: "Confirme la réinitialisation de l'arbre en 1.0 ; un build hybride prend Double Jump et Blink pour se déplacer."
  },
  {
    id: "pd-biomes", nom: "PinDrop — Biomes (niveaux des régions)", type: "base-donnees", fiabilite: "moyenne",
    url: "https://pindrop.gg/enshrouded/biomes", consulte: "2026-10-20",
    note: "Plages de niveau par région : Springlands 3–9, Revelwood 11–15, Nomad Highlands 16–20, Kindlewastes 21–27, Albaneve Summits 28–35, Veilwater Basin 37–45, Cinder's Cradle 46–50. Seul Cinder's Cradle est confirmé pour la 1.0. Le site utilise désormais les niveaux du wiki officiel, et PinDrop seulement pour Cinder's Cradle."
  },
  {
    id: "wiki-biomes", nom: "Enshrouded Wiki — pages des biomes (niveau de zone)", type: "wiki", fiabilite: "haute",
    url: "https://enshrouded.wiki.gg/wiki/Springlands", consulte: "2026-10-20", miseAJourSource: "2026-10-04",
    note: "Champ « Biome Level » : Springlands 1–10, Revelwood 10–15, Nomad Highlands 15–20, Kindlewastes 20–30, Albaneve Summits 30–40, Veilwater Basin 35–45 (pages modifiées début octobre 2026). Cinder's Cradle n'a pas encore de page."
  },
  {
    id: "wiki-chests", nom: "Enshrouded Wiki — Chests", type: "wiki", fiabilite: "moyenne",
    url: "https://enshrouded.wiki.gg/wiki/Chests", consulte: "2026-10-20", miseAJourSource: "2025-12-06",
    note: "« Loot from chests is semi-randomized based on the player's level and the zone difficulty » : une arme trouvée prend le niveau de sa zone."
  },
  {
    id: "wiki-10", nom: "Enshrouded Wiki — 1.0 Update (notes officielles recopiées)", type: "officiel", fiabilite: "haute",
    url: "https://enshrouded.wiki.gg/wiki/1.0_Update", consulte: "2026-10-20", miseAJourSource: "2026-10-14",
    note: "Notes de version officielles : niveau max 50, équipement 55 une fois amélioré ; correction d'un coffre de niveau 30 qui donnait du butin de niveau 1 (le butin suit le niveau de la zone)."
  },
  {
    id: "wiki-building", nom: "Enshrouded Wiki — Building Materials", type: "wiki", fiabilite: "haute",
    url: "https://enshrouded.wiki.gg/wiki/Building_Materials", consulte: "2026-10-21", miseAJourSource: "2026-10-20",
    note: "61 blocs avec recette et lieu de déblocage ; page indiquée pour la version 1.0.0.0."
  },
  {
    id: "wiki-comfort", nom: "Enshrouded Wiki — Comfort", type: "wiki", fiabilite: "moyenne",
    url: "https://enshrouded.wiki.gg/wiki/Comfort", consulte: "2026-10-21", miseAJourSource: "2026-10-20",
    note: "Conditions du bonus Reposé, confort max 120, valeurs de confort observées ; le wiki signale un bug possible sur la durée par niveau."
  },
  {
    id: "wiki-survivors", nom: "Enshrouded Wiki — Survivors", type: "wiki", fiabilite: "moyenne",
    url: "https://enshrouded.wiki.gg/wiki/Survivors", consulte: "2026-10-21", miseAJourSource: "2026-10-16",
    note: "27 survivants (artisans, assistants, villageois) et lieux de sauvetage."
  },
  {
    id: "wiki-altar", nom: "Enshrouded Wiki — Flame Altar", type: "wiki", fiabilite: "haute",
    url: "https://enshrouded.wiki.gg/wiki/Flame_Altar", consulte: "2026-10-21", miseAJourSource: "2026-10-19",
    note: "Taille de zone par niveau d'autel, coûts, nombre d'autels par niveau de Flamme."
  },
  {
    id: "allthings-blocks10", nom: "AllThings.How — All New Building Blocks in 1.0", type: "guide", fiabilite: "moyenne",
    url: "https://allthings.how/enshrouded-1-0-all-new-building-blocks-and-how-to-get-them/", consulte: "2026-10-21", miseAJourSource: "2026-10-17",
    note: "Les 7 blocs de Cinder's Cradle / Blackmire et leurs coffres."
  },
  {
    id: "allthings-starter", nom: "AllThings.How — Starter Base Guide (Modular Hub)", type: "guide", fiabilite: "moyenne",
    url: "https://allthings.how/enshrouded-1-0-starter-base-guide-modular-hub-farm-and-alchemist-wing/", consulte: "2026-10-21", miseAJourSource: "2026-10-19",
    note: "Base en croix pas à pas, d'après la vidéo de P4wnyhof."
  },
  {
    id: "allthings-tips", nom: "AllThings.How — Base Building Tips (1.0)", type: "guide", fiabilite: "moyenne",
    url: "https://allthings.how/enshrouded-1-0-base-building-tips-that-save-materials-and-time/", consulte: "2026-10-21", miseAJourSource: "2026-10-17",
    note: "Maison 3×5 sur trois niveaux, cheminée, coffres, confort, astuces de construction."
  },
  {
    id: "pd-base", nom: "PinDrop — Base Building (1.0)", type: "base-donnees", fiabilite: "moyenne",
    url: "https://pindrop.gg/enshrouded/guides/base-building", consulte: "2026-10-21", miseAJourSource: "2026-10-18",
    note: "Recettes de coffres, eau, irrigation et lits lues dans les fichiers 1.0."
  },
  {
    id: "pd-farming", nom: "PinDrop — Farming Guide (1.0)", type: "base-donnees", fiabilite: "moyenne",
    url: "https://pindrop.gg/enshrouded/guides/farming", consulte: "2026-10-21", miseAJourSource: "2026-10-18",
    note: "Terre de culture, Seedbed, plants, terres améliorées (fichiers 1.0)."
  },
  {
    id: "kg-bases", nom: "KeenGamer — 1.0 Best Base Locations", type: "guide", fiabilite: "moyenne",
    url: "https://www.keengamer.com/articles/guides/enshrouded-1-0-best-base-locations-where-to-build-your-base/", consulte: "2026-10-21", miseAJourSource: "2026-10-18",
    note: "14 emplacements de base du début à la fin de partie."
  },
  {
    id: "grindnstrat-bases", nom: "Grind n' Strat — 1.0 Base Location Guide", type: "guide", fiabilite: "faible",
    url: "https://grindnstrat.com/enshrouded-1-0-base-location-guide/", consulte: "2026-10-21", miseAJourSource: "2026-10-15",
    note: "Classe Woodgard meilleure base de départ (KeenGamer préfère Braelyn Bridge)."
  },
  {
    id: "destructoid-blocks", nom: "Destructoid — All building blocks and locations", type: "guide", fiabilite: "faible",
    url: "https://www.destructoid.com/all-building-blocks-and-material-locations-in-enshrouded/", consulte: "2026-10-21", miseAJourSource: "2025-05-20",
    note: "Antérieur à la 1.0 ; précise plusieurs coffres."
  },
  {
    id: "gamerguides-blocks", nom: "GamerGuides — All Building Block Materials", type: "guide", fiabilite: "faible",
    url: "https://www.gamerguides.com/enshrouded/guide/crafting/workbench/all-building-block-materials-in-enshrouded", consulte: "2026-10-21", miseAJourSource: "2024-05-22",
    note: "Ancien (2024) ; donne les quêtes associées aux blocs."
  },
  {
    id: "yt-onlybase", nom: "YouTube — « Enshrouded 1.0: The Only Base You'll Ever Need » (P4wnyhof)", type: "video", fiabilite: "moyenne",
    url: "https://www.youtube.com/watch?v=eRhxZc5jPms", consulte: "2026-10-21", miseAJourSource: "2026-10-19",
    note: "Base modulaire en croix ; chapitres repris par AllThings.How."
  },
  {
    id: "yt-starterbase", nom: "YouTube — « Enshrouded 1.0 Build Tutorial: The Perfect Starter Base »", type: "video", fiabilite: "faible",
    url: "https://www.youtube.com/watch?v=NsuqzPXPez4", consulte: "2026-10-21", miseAJourSource: "2026-10-16",
    note: "Tutoriel de base de départ ; vidéo non analysée (titre et date)."
  },
  {
    id: "yt-buildguide", nom: "YouTube — « Enshrouded Building Guide for 1.0: Everything You Need to Know »", type: "video", fiabilite: "faible",
    url: "https://www.youtube.com/watch?v=lVAd4Bm5pKU", consulte: "2026-10-21", miseAJourSource: "2026-10-05",
    note: "Guide général de construction ; vidéo non analysée."
  },
  {
    id: "yt-baselocations", nom: "YouTube — « Enshrouded 1.0 Best Base Locations: Building Tips »", type: "video", fiabilite: "faible",
    url: "https://www.youtube.com/watch?v=N6s-IfMClWg", consulte: "2026-10-21",
    note: "Emplacements et conseils ; vidéo non analysée."
  },
  {
    id: "yt-settlement", nom: "YouTube — « Building Our First Settlement Base & Blacksmith Home: Enshrouded 1.0 »", type: "video", fiabilite: "faible",
    url: "https://www.youtube.com/watch?v=SM5oN9wCuzc", consulte: "2026-10-21",
    note: "Première base et maison du forgeron ; vidéo non analysée."
  }
];
