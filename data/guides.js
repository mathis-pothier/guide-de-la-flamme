// Onglet « Guides » : CONTENU ÉDITORIAL rédigé pour ce site à partir des notes de recherche
// (docs/recherche/*.md et docs/recherche/videos/*.md). Aucun texte de source n'est recopié.
// Blocs d'une section : { p } paragraphe, { ul } liste, { ol } étapes, { table: { tete, lignes } },
// { astuce }, { attention }, { verifier } (info à confirmer en jeu). **gras** et [lien](#vue) sont permis dans les textes.
// Visuels : { carte: { fond, points: [[id du marqueur de data/map.js, légende]], groupes, regions, legende } },
// { objets: { ids: [objets du catalogue], legende } }, { figure: { src, alt, legende, cls } }. `vignette` = objet affiché sur la carte du guide.
// Images uniquement reprises du jeu via le wiki (crédit affiché) ; fonds de carte fabriqués par scripts/guide-images.py.
// `sources` = identifiants de window.ENS.guides.sources ou de data/sources.js.
window.ENS = window.ENS || {};
window.ENS.guides = {
  maj: "2026-10-21",

  categories: [
    { id: "debuter", nom: "Bien débuter", icone: "star", cls: "c-base", desc: "Les premières heures, les erreurs à éviter, les bons réglages." },
    { id: "flamme", nom: "Progression et Flamme", icone: "flame", cls: "c-hyb", desc: "Paliers de la Flamme, ordre des régions, Shroud et points de compétence." },
    { id: "boss", nom: "Boss", icone: "skull", cls: "c-war", desc: "Faiblesses, préparation et déroulé des combats importants." },
    { id: "builds", nom: "Builds et compétences", icone: "tree", cls: "c-mag", desc: "Comprendre l'arbre, choisir ses premiers points, démarrer un style." },
    { id: "equipement", nom: "Équipement et butin", icone: "sword", cls: "c-rng", desc: "Coffres, runes, farm et équipement de fin de partie." },
    { id: "donjons", nom: "Donjons et énigmes", icone: "compass", cls: "c-hyb", desc: "Caveaux des survivants, salles à boutons, Hollow Halls, donjons-balises." },
    { id: "construction", nom: "Construction et base", icone: "home", cls: "c-base", desc: "Installer sa base, confort, ferme, Sparkworks." }
  ],

  // Sources propres aux guides (les autres viennent de data/sources.js).
  sources: {
    "guided-changelog": { nom: "Guided News — changelog 1.0", url: "https://guided.news/en/news/enshrouded-1-0-changelog-cinders-cradle-system-changes/" },
    "ens-tools-10": { nom: "enshrouded.tools — contenu 1.0", url: "https://www.enshrouded.tools/1-0" },
    "ens-tools-cc": { nom: "enshrouded.tools — Cinder's Cradle", url: "https://www.enshrouded.tools/regions/cinders-cradle" },
    "pd-progression": { nom: "PinDrop — ordre des régions 1.0", url: "https://pindrop.gg/enshrouded/guides/biome-progression-order" },
    "pd-bosses": { nom: "PinDrop — boss", url: "https://pindrop.gg/enshrouded/bosses" },
    "pd-final-boss": { nom: "PinDrop — Vorgoth", url: "https://pindrop.gg/enshrouded/guides/best-build-vs-final-boss" },
    "allthings-flame": { nom: "AllThings.How — paliers de Flamme 1–11", url: "https://allthings.how/enshrouded-1-0-every-flame-altar-upgrade-requirement-flame-levels-1-11/" },
    "allthings-center": { nom: "AllThings.How — centre de l'arbre", url: "https://allthings.how/enshrouded-1-0-every-skill-at-the-center-of-the-skill-tree/" },
    "allthings-ending": { nom: "AllThings.How — la fin expliquée", url: "https://allthings.how/enshrouded-ending-explained-beating-vorgoth-and-what-comes-next/" },
    "whisper-vorgoth": { nom: "Whisper of the House — Vorgoth", url: "https://www.whisperofthehouse.com/enshrouded/vorgoth-final-boss" },
    "companion-10": { nom: "Enshrouded Companion — 1.0", url: "https://www.enshroudedcompanion.com/enshrouded-1-0" },
    "redreactions": { nom: "RedReactions — sauvegardes et PS5", url: "https://redreactions.com/articles/enshrouded-1-0-launch-cinders-cradle-saves-ps5/" },
    "games-gg-sparkworks": { nom: "games.gg — Sparkworks", url: "https://games.gg/enshrouded/guides/enshrouded-sparkworks-guide-build-interactive-logic-systems/" },
    "games-gg-progression": { nom: "games.gg — progression", url: "https://games.gg/enshrouded/guides/enshrouded-progression-guide/" },
    "games-gg-chests": { nom: "games.gg — farm de coffres", url: "https://games.gg/enshrouded/guides/enshrouded-legendary-chest-farming/" },
    "xgs-shroud": { nom: "XGamingServer — Shroud et Flamme", url: "https://xgamingserver.com/blog/enshrouded-shroud-flame-progression/" },
    "xgs-skills": { nom: "XGamingServer — arbre de compétences", url: "https://xgamingserver.com/blog/enshrouded-skill-tree-guide/" },
    "xgs-base": { nom: "XGamingServer — construction", url: "https://xgamingserver.com/blog/?p=21839" },
    "gamerguides-tips": { nom: "GamerGuides — astuces", url: "https://www.gamerguides.com/enshrouded/guide/gameplay/basics/best-tips-and-tricks-enshrouded" },
    "htm-mistakes": { nom: "Hack The Minotaur — erreurs de débutant", url: "https://hacktheminotaur.com/enshrouded/beginner-mistakes-to-avoid-in-enshrouded/" },
    "sk-survivors": { nom: "Sportskeeda — survivants", url: "https://www.sportskeeda.com/esports/enshrouded-survivor-locations-blacksmith-hunter-alchemist-farmer-carpenter" },
    "techraptor-hollow": { nom: "TechRaptor — Hollow Halls", url: "https://techraptor.net/gaming/guides/enshrouded-hollow-halls-guide-how-to-survive" },
    "techraptor-water": { nom: "TechRaptor — eau", url: "https://techraptor.net/gaming/guides/how-to-get-water-in-enshrouded" },
    "bisect-hunter": { nom: "BisectHosting — caveau de la Chasseuse", url: "https://www.bisecthosting.com/fr-fr/blog/enshrouded-hunter-vault-guide-location-walkthrough-puzzle-solution-chests" },
    "holy-taming": { nom: "holy.gg — élevage", url: "https://www.holy.gg/de/post/enshrouded-animal-taming-guide-bait-farms-breeding-and-pets" },
    "prima-xp": { nom: "Prima Games — XP et points", url: "https://primagames.com/gaming/how-to-level-up-and-gain-skill-points-fast-in-enshrouded" },
    "cgm-review": { nom: "CGMagazine — test 1.0", url: "https://www.cgmagonline.com/review/game/enshrouded-1-0-pc-review/" },
    "pcgames-review": { nom: "PC Games — test 1.0", url: "https://www.pcgames.de/Enshrouded-Spiel-74267/Tests/Release-Minecraft-Test-Review-PS5-Update-1556659/" },
    "v-chiselchip-50h": { nom: "Vidéo — Chiselchip, 50 h en 1.0", url: "https://www.youtube.com/watch?v=5KiHgHLPjcQ" },
    "v-chiselchip-mage": { nom: "Vidéo — Chiselchip, mage 1.0", url: "https://www.youtube.com/watch?v=9ypwxnxQDXE" },
    "v-chiselchip-spdr": { nom: "Vidéo — Chiselchip, S.P.D.R.", url: "https://www.youtube.com/watch?v=AU0DcXteGZE" },
    "v-chiselchip-blocs": { nom: "Vidéo — Chiselchip, nouveaux blocs 1.0", url: "https://www.youtube.com/watch?v=zmgmb7POQh8" },
    "v-jade-cradle": { nom: "Vidéo — Jade PG, accès à Cinder's Cradle", url: "https://www.youtube.com/watch?v=tfKzkYzhA-A" },
    "v-seigneur-10": { nom: "Vidéo — SeigneurDuGaming, la 1.0", url: "https://www.youtube.com/watch?v=XMlGeUVT_tI" },
    "v-davynox": { nom: "Vidéo — Davy Nox, progression", url: "https://www.youtube.com/watch?v=Y3h3K1-KHt4" },
    "v-smartceltic": { nom: "Vidéo — SmartCeltic, débuter en 1.0", url: "https://www.youtube.com/watch?v=6oGeJFcgqv8" },
    "v-luckyghost": { nom: "Vidéo — Lucky Ghost, astuces", url: "https://www.youtube.com/watch?v=xwAtD5UUv0Q" },
    "v-p4wny-debut": { nom: "Vidéo — P4wnyhof, premiers pas", url: "https://www.youtube.com/watch?v=joXu-mdew1g" },
    "v-p4wny-potions": { nom: "Vidéo — P4wnyhof, potions et alchimiste", url: "https://www.youtube.com/watch?v=FQUBaYLLMK8" },
    "v-p4wny-ferme": { nom: "Vidéo — P4wnyhof, ferme", url: "https://www.youtube.com/watch?v=7ktAx0wB4bg" },
    "v-p4wny-base": { nom: "Vidéo — P4wnyhof, base modulaire", url: "https://www.youtube.com/watch?v=eRhxZc5jPms" },
    "v-p4wny-mage": { nom: "Vidéo — P4wnyhof, mage baguette", url: "https://www.youtube.com/watch?v=LAwCD2b634A" },
    "v-fervor-start": { nom: "Vidéo — Fervor, meilleur départ", url: "https://www.youtube.com/watch?v=JZsWe66A3ZM" },
    "v-fervor-paladin": { nom: "Vidéo — Fervor, paladin radiant", url: "https://www.youtube.com/watch?v=K69phuB4uFg" },
    "v-sirjay": { nom: "Vidéo — SirJayWalker, conseils", url: "https://www.youtube.com/watch?v=B5IOtk7dIu8" },
    "v-annarf": { nom: "Vidéo — Annarf, repos et réglages", url: "https://www.youtube.com/watch?v=nJHBzw3YNzM" },
    "v-spyro-runes": { nom: "Vidéo — Spyro ZA, équipement et runes", url: "https://www.youtube.com/watch?v=Q2Y72TcJMTE" },
    "v-kontreck": { nom: "Vidéo — Kontreck, racines et obélisques", url: "https://www.youtube.com/watch?v=PdTHNBUbRdM" },
    "v-legacy": { nom: "Vidéo — Legacy Gaming, compétences", url: "https://www.youtube.com/watch?v=BU46ythcxZM" },
    "v-kitsune": { nom: "Vidéo — kitsunegurei, ordre des branches", url: "https://www.youtube.com/watch?v=iByKPN40_Uk" },
    "v-htm-arc": { nom: "Vidéo — Hack The Minotaur, archer", url: "https://www.youtube.com/watch?v=HXCNL4-TRBU" },
    "v-04am-sets": { nom: "Vidéo — 04AM, équipement de fin 1.0", url: "https://www.youtube.com/watch?v=5bIcnFdiik4" },
    "v-04am-artificer": { nom: "Vidéo — 04AM, set de l'Artificier", url: "https://www.youtube.com/watch?v=zC5uYMCoztU" },
    "v-total-route": { nom: "Vidéo — Total Survives, route de la Citadelle", url: "https://www.youtube.com/watch?v=gWjai7JoTsA" },
    "v-hishers-route": { nom: "Vidéo — His & Hers, route de coffres", url: "https://www.youtube.com/watch?v=7EUennu6uOs" },
    "v-unyphi": { nom: "Vidéo — UnyPhi, coffres de Veilwater", url: "https://www.youtube.com/watch?v=87IES8uf2xA" },
    "v-uniques": { nom: "Vidéo — armes uniques à emplacement fixe", url: "https://www.youtube.com/watch?v=Qnoyn77Q1OU" },
    "v-heather-dragon": { nom: "Vidéo — Heather Marie Gaming, Wispwyvern", url: "https://www.youtube.com/watch?v=n4AhI1K32_I" },
    "v-wokes-dragon": { nom: "Vidéo — Wokes Gaming, dragon à l'arc", url: "https://www.youtube.com/watch?v=lKzjZE_zLLk" },
    "v-justsoup": { nom: "Vidéo — JustSoup, Vukah Brawler", url: "https://www.youtube.com/watch?v=YALZx5f8Ggs" },
    "v-mistbury": { nom: "Vidéo — Gamer Guides, Mistbury Catacombs", url: "https://www.youtube.com/watch?v=j361WCIYEfA" },
    "v-suntemple": { nom: "Vidéo — Scatterbone Sun Temple", url: "https://www.youtube.com/watch?v=Eec4Hva3ljA" },
    "v-farmervault": { nom: "Vidéo — Bawzi, caveau de la Fermière", url: "https://www.youtube.com/watch?v=YLeLUgr-lgQ" },
    "v-veilspire": { nom: "Vidéo — Acure8, Spire de Veilwater", url: "https://www.youtube.com/watch?v=8_LviJoIVgE" },
    "v-port": { nom: "Vidéo — FreeTree0815, énigme du port", url: "https://www.youtube.com/watch?v=kjegsnbgPPI" },
    "v-spires": { nom: "Vidéo — Viktor Vox, quête des Spires", url: "https://www.youtube.com/watch?v=r-Kjc-TUj0U" },
    "v-survivant": { nom: "Vidéo — Viktor Vox, placer un survivant", url: "https://www.youtube.com/watch?v=fMtaEgf49BU" },
    "v-apprentis": { nom: "Vidéo — Dizzy Plays, assistants", url: "https://www.youtube.com/watch?v=Wb0zjQzehHE" },
    "v-chaosbear-astuces": { nom: "Vidéo — Chaos Bear, astuces de construction", url: "https://www.youtube.com/watch?v=4rjqhW33RQ0" },
    "v-chaosbear-lieux": { nom: "Vidéo — Chaos Bear, où s'installer", url: "https://www.youtube.com/watch?v=N6s-IfMClWg" },
    "v-hishers-build": { nom: "Vidéo — His & Hers, astuces de construction", url: "https://www.youtube.com/watch?v=3cgH_TBZrnU" },
    "v-caffeinated-style": { nom: "Vidéo — Caffeinated Replays, style de construction", url: "https://www.youtube.com/watch?v=uvCvTd2eLas" }
  },

  // Fonds de carte (scripts/guide-images.py) : bornes en coordonnées de la carte du wiki, y vers le haut.
  cartes: {
    monde: { fichier: "images/guides/carte-monde.webp", bornes: [0, 0, 10240, 10240] },
    springlands: { fichier: "images/guides/carte-springlands.webp", bornes: [2300, 900, 5100, 3100] }
  },

  liste: [
    // ═══════════════ BIEN DÉBUTER ═══════════════
    {
      id: "premieres-heures", cat: "debuter", icone: "star", titre: "Vos premières heures, étape par étape",
      resume: "Ce qu'il faut faire, dans l'ordre, entre la sortie du caveau de départ et la première région suivante.",
      niveau: "Niveaux 1 à 10", version: "1.0",
      sections: [
        { titre: "Avant de bouger : deux réglages", blocs: [
          { ul: [
            "Dans les options, activez le **ramassage automatique du butin dispersé** : il est coupé par défaut et fait gagner un temps fou.",
            "Réglez les éléments de l'interface en « contextuel » si l'écran vous paraît chargé. Le journal permet d'épingler une recette à l'écran : pratique pour savoir ce qu'il vous manque."
          ] }
        ] },
        { titre: "Ne ratez pas les coffres du caveau de départ", blocs: [
          { p: "Le caveau où l'on se réveille (Cinder Vault) cache deux coffres faciles à manquer : l'un derrière un éboulement qu'il faut faire sauter, l'autre sous l'eau, sur la gauche, à atteindre en plongeant torche en main. Ils donnent un anneau et une pièce d'armure utiles pour les premières heures." },
          { verifier: "Contenu et emplacement exacts signalés par une seule vidéo : à confirmer en 1.0." }
        ] },
        { titre: "Le parcours conseillé", blocs: [
          { ol: [
            "**Posez votre autel** là où le jeu le suggère, près du village de départ : un toit, un lit, un feu suffisent pour l'instant.",
            "**Réveillez les artisans** dans les caveaux autour de la grande tour de Springlands : forgeron d'abord, puis alchimiste, charpentier, chasseuse et fermière. Donnez-leur un lit à l'abri, sinon ils ne proposent pas leurs quêtes.",
            "**Fabriquez le planeur et le grappin** à l'établi (catégorie Survie) dès que possible : ils changent complètement la façon d'explorer.",
            "**Grimpez les Ancient Spires** (les grandes tours) : chacune débloque un point de voyage rapide et sert de tremplin pour planer loin.",
            "**Faites votre premier Elixir Well** (puits d'élixir) : points de compétence et Shroud Cores pour agrandir la zone de l'autel.",
            "**Renforcez la Flamme** dès que vous avez les matériaux : c'est elle qui ouvre les régions suivantes. Voir [La Flamme pas à pas](#guides/flamme-paliers).",
            "**Gardez toujours un autel de rechange** dans votre sac pour avancer par relais."
          ] },
          { carte: { fond: "springlands", alt: "Carte du sud de Springlands avec le caveau de départ, la Spire et les caveaux des artisans",
            legende: "Le coin de départ : la Spire au centre, les caveaux des artisans tout autour, et deux bonnes maisons pour une première base.",
            points: [
              ["CinderVault", "Cinder Vault, le caveau du réveil"],
              ["AncientSpire-Springlands", "Ancient Spire de Springlands"],
              ["AncientVault-Blacksmith", "Caveau du forgeron"],
              ["AncientVault-Alchemist", "Caveau de l'alchimiste"],
              ["AncientVault-Hunter", "Caveau de la chasseuse"],
              ["AncientVault-Carpenter", "Caveau du charpentier"],
              ["AncientVault-Farmer", "Caveau de la fermière"],
              ["HarvestHomestead", "Harvest Homestead (base toute faite)"],
              ["Longkeep", "Longkeep (maison ouverte)"]
            ] } },
          { verifier: "Emplacements du wiki relevés avant la 1.0, qui a remanié le début de partie (le forgeron se réveille désormais au Cinder Vault)." }
        ] },
        { titre: "Les réflexes à prendre tout de suite", blocs: [
          { ul: [
            "**Tout ramasser** : un objet ou une plante ramassés pour la première fois débloquent souvent une recette.",
            "**Tout fabriquer au moins une fois** : un objet marqué d'un point d'exclamation orange débloque d'autres recettes (par exemple la poussière d'insecte, qui mène à la colle demandée par la Flamme).",
            "**Manger trois plats différents** avant chaque sortie : la nourriture ne soigne pas, elle donne des bonus durables.",
            "**Lire les notes surlignées** : elles donnent de l'expérience et des indices de quêtes.",
            "**Ne pas voyager mouillé** : on perd beaucoup d'endurance. Une torche ou un feu vous sèchent.",
            "Une **baguette** se fabrique très tôt avec des os : même sans jouer mage, elle permet d'attaquer à distance."
          ] },
          { astuce: "Une pierre tombale isolée ou un tas de gravats cache souvent un coffre enterré : la pioche est votre meilleur outil d'exploration. Elle permet aussi de grimper presque n'importe quelle paroi en visant légèrement vers le haut." }
        ] },
        { titre: "Ressources du début : où chercher", blocs: [
          { table: { tete: ["Ressource", "Où la trouver"], lignes: [
            ["Tissu déchiré", "Caisses et boîtes à casser dans les villages"],
            ["Ferraille", "Lits métalliques, camps de pillards"],
            ["Fibres", "Bottes de paille des villages"],
            ["Résine", "Arbres à feuilles rouges ou à moitié morts"],
            ["Silex", "Petites ruines juste à l'ouest de la première base"],
            ["Ambre", "Roches orangées à motif de toile, dans le Shroud"]
          ] } }
        ] }
      ],
      liens: [["Builds conseillés", "#builds"], ["Emplacements de base", "#construction/emplacements"], ["Carte", "#carte"]],
      sources: ["gamerguides-tips", "htm-mistakes", "v-p4wny-debut", "v-fervor-start", "v-smartceltic", "v-luckyghost", "v-sirjay"]
    },
    {
      id: "erreurs", cat: "debuter", icone: "alert", titre: "Les erreurs de débutant à éviter",
      resume: "Les pièges dans lesquels tombent presque tous les nouveaux joueurs, et comment les contourner.",
      niveau: "Tous niveaux", version: "1.0",
      sections: [
        { titre: "Progression", blocs: [
          { ul: [
            "**Foncer sur la quête principale.** Les quêtes annexes des artisans débloquent des éléments essentiels (planeur amélioré, stations…). Le journal distingue les quêtes du monde (à prioriser) et les quêtes personnelles.",
            "**Oublier la Flamme.** Elle fixe le temps de survie dans le Shroud et l'accès aux régions. Épinglez la liste « Renforcer la Flamme » et utilisez-la comme liste de courses.",
            "**Laisser l'artisanat consommer les objets de la Flamme.** Rangez-les dans un coffre ordinaire, pas dans un coffre magique relié aux stations.",
            "**Ignorer la mobilité.** Double saut, Updraft et Airborne font gagner des heures."
          ] }
        ] },
        { titre: "Base", blocs: [
          { ul: [
            "**Construire une base géante dans la zone de départ.** Une maison simple suffit au début ; la base principale se fera plus tard près des ressources avancées.",
            "**Repousser les coffres magiques.** Le stockage partagé simplifie tout l'artisanat : débloquez-le tôt.",
            "**Utiliser l'échafaudage par défaut** pour monter : un escalier de blocs de pierre se démonte ensuite et ne coûte presque rien.",
            "**Négliger le confort.** Le bonus Reposé dure plus longtemps avec une base confortable. Voir [Confort, repos et nourriture](#guides/confort)."
          ] }
        ] },
        { titre: "Équipement", blocs: [
          { ul: [
            "**Améliorer chaque arme trouvée.** Une arme de bas niveau est vite dépassée : gardez les runes pour une arme de fin de palier ou un boss bloquant.",
            "**Dépenser ses runes avant le niveau max.** Elles servent aussi à réinitialiser l'arbre de compétences.",
            "**Viser à tout prix le set complet.** Beaucoup de sets n'ont pas de bonus d'ensemble : les meilleures pièces une à une valent souvent mieux.",
            "**Fabriquer des runes légendaires.** Mieux vaut les trouver dans les coffres."
          ] }
        ] },
        { titre: "Combat", blocs: [
          { ul: [
            "Un ennemi **2 ou 3 niveaux au-dessus** de vous est très dangereux, tout comme les meutes de loups : reculez et revenez plus tard.",
            "En 1.0, un ennemi **regagne sa vie** quand on quitte le combat : impossible d'user un boss en plusieurs allers-retours.",
            "Les barils rouges explosent : utilisez-les contre les ennemis, pas contre vous."
          ] }
        ] }
      ],
      sources: ["htm-mistakes", "v-davynox", "v-spyro-runes", "cgm-review", "guided-changelog"]
    },
    {
      id: "sauvegarde-reglages", cat: "debuter", icone: "sliders", titre: "Ancienne sauvegarde, nouveau monde et réglages",
      resume: "Ce que la 1.0 change pour une partie commencée en accès anticipé, et comment régler la difficulté de son monde.",
      niveau: "Avant de lancer la partie", version: "1.0",
      sections: [
        { titre: "Reprendre une partie de l'accès anticipé", blocs: [
          { ul: [
            "Les mondes existants sont **convertis** au nouveau format ; une sauvegarde automatique est faite avant.",
            "L'**arbre de compétences est réinitialisé** pour tous les personnages : faites une capture de votre arbre avant de lancer la 1.0 pour pouvoir le reconstruire.",
            "Recommencer un monde n'est **pas obligatoire**, mais conseillé si vous voulez profiter du début revu (plus de coffres, routes et camps modifiés).",
            "Les joueurs de l'accès anticipé peuvent récupérer trois objets de décoration via « Redeem Add-Ons »."
          ] }
        ] },
        { titre: "Régler son monde", blocs: [
          { p: "Le jeu propose quatre préréglages (Détendu, Défaut, Difficile, Survie), puis chaque paramètre se modifie à la main, même en cours de partie : vie et dégâts des ennemis, faim, usure de l'équipement, perte du butin à la mort, vitesse d'XP, d'artisanat et de pousse, durée des nuits, ennemis passifs…" },
          { ul: [
            "Pour une première partie, le préréglage **Défaut** est le plus souvent conseillé.",
            "Si la progression est trop lente, on peut **baisser le niveau de Flamme requis** pour traverser le Shroud.",
            "Pour moins farmer, la **quantité de butin** peut monter à 150 % ou 200 %.",
            "Les donjons en solo et les nuits sont jugés durs par la presse : n'hésitez pas à baisser les dégâts des ennemis plutôt que d'abandonner."
          ] }
        ] },
        { titre: "Jouer à plusieurs", blocs: [
          { ul: [
            "Jusqu'à **16 joueurs sur PC** et **8 sur PS5** (PS Plus requis). Pas de cross-play au lancement.",
            "Le monde et la Flamme sont partagés ; personnage et inventaire restent propres à chacun.",
            "Les boss deviennent plus résistants en groupe : Vorgoth prend environ 70 % de vie en plus par joueur supplémentaire."
          ] }
        ] }
      ],
      sources: ["companion-10", "redreactions", "v-seigneur-10", "v-annarf", "v-sirjay", "pcgames-review", "pd-final-boss"]
    },

    // ═══════════════ PROGRESSION ET FLAMME ═══════════════
    {
      id: "flamme-paliers", cat: "flamme", icone: "flame", titre: "La Flamme pas à pas : paliers 1 à 11",
      resume: "Le coût de chaque palier de Flamme en 1.0 : survivants à loger, trophée de boss et matériaux.",
      niveau: "Toute la partie", version: "1.0",
      sections: [
        { titre: "À quoi sert la Flamme", blocs: [
          { p: "Renforcer la Flamme, c'est monter le niveau de tout le monde : elle allonge le temps de survie dans le Shroud, rend le Shroud rouge franchissable, ajoute des points d'attribut, augmente le nombre d'autels et, en 1.0, débloque les armures du palier d'artisanat suivant. Ni l'équipement ni les compétences ne remplacent la Flamme pour passer le Shroud mortel." },
          { p: "À ne pas confondre avec l'**agrandissement de l'autel**, qui étend seulement la zone de construction et se paie en Shroud Cores." }
        ] },
        { titre: "Coût de chaque palier", blocs: [
          { table: { tete: ["Palier", "Survivants logés", "Trophée", "Matériaux"], lignes: [
            ["1 → 2", "—", "aucun", "1 Spark, 5 Resin, 5 Penny Bun, 5 Bones, 5 Shroud Liquid, 5 Animal Fur"],
            ["2 → 3", "2", "casque de la Scavenger Matron", "5 Spark, 10 Wax, 10 Salt, 10 Shroud Wood, 10 Flintstone, 25 Mycelium"],
            ["3 → 4", "4", "tête du Fell Wispwyvern", "10 Spark, 15 Goo, 15 Corrupted Boar Tusk, 15 Indigo Plant, 15 Amber, 15 Copper Ore"],
            ["4 → 5", "6", "tête du Fell Monstrosity", "20 Spark, 20 Mint Mushroom Meat, 20 Fossilized Bone, 20 Ammonia Gland, 20 Tin Ore, 20 Rooibos"],
            ["5 → 6", "8", "tête du Fell Sicklescythe", "30 Spark, 30 Enshrouded Vulture Talon, 30 Saffron, 30 Iron Ore, 30 Lapislazuli, 30 Brittle Shroud Flakes"],
            ["6 → 7", "10", "tête du Fell Cyclops", "30 Spark, 30 Wool, 30 Gentian, 30 Ice, 30 Granite, 30 Flammable Goo"],
            ["7 → 8", "12", "tête du Fell Dragon Youngling", "40 Spark, 40 Obsidian, 40 Silver Bars, 40 Mauveine, 40 Wolfsbane, 40 Amethyst"],
            ["8 → 9", "14", "tête de Hydrak'Dal", "50 Spark, 50 Gold Ore, 30 Green Vitriol Dust, 30 Passionflower, 50 Aquamarine, 30 Pearl"],
            ["9 → 10", "16", "Broken Guard of the North Crown", "60 Spark, 15 Gleam Root Dust, 10 Piscine Ivory Dust, 30 Drak Blood, 10 Shroud Sludge, 30 Daylily"],
            ["10 → 11", "18", "Vorgoth's Bound Essence + Vorgoth's Eye", "20 Spark, 10 Celestium Bars, 15 Moonstone, 20 Diamond Dust, 15 Ember Carapace"]
          ] } },
          { p: "« Survivants logés » = nombre de survivants qui doivent dormir dans un lit à l'abri, dans vos bases." },
          { verifier: "Palier 9 → 10 : d'après une vidéo, la garde brisée de la couronne se ramasse sur le bras d'une statue, dans la salle du trône du château de Cromville (nord de Veilwater), et non sur un boss. Une autre source la rattache à Vorgoth. À confirmer en jeu." },
          { verifier: "Palier 1 → 2 : avant la 1.0, il fallait la tête du Fell Thunderbrute ; les sources 1.0 n'en mentionnent plus. À confirmer." }
        ] },
        { titre: "Les Sparks (étincelles)", blocs: [
          { p: "Chaque palier demande des Sparks, récoltées aux Flame Shrines et Flame Sanctums (sanctuaires de la Flamme), qui se rechargent avec le temps. Les sanctuaires du début n'en donnent qu'une, ceux de Revelwood deux ou trois, ceux des régions avancées cinq ou six : allez les chercher dans la région la plus avancée que vous pouvez atteindre." },
          { astuce: "Les obélisques révèlent les sanctuaires des alentours sur la carte." }
        ] },
        { titre: "Méthode", blocs: [
          { ol: [
            "Épinglez la liste du palier suivant dès que vous venez d'en franchir un.",
            "Récoltez les matériaux de la région en cours pendant votre exploration.",
            "Gardez le combat de boss pour la fin, avec le meilleur équipement, de la nourriture et des potions.",
            "Logez assez de survivants : il faut des lits à l'abri (les villageois comptent aussi)."
          ] },
          { verifier: "Temps de Shroud et nombre d'autels par palier : seules des valeurs d'avant la 1.0 sont publiées (environ 5 min au palier 1, +1 min par palier). En 1.0 : 15 autels à la Flamme 10, 16 à la Flamme 11." }
        ] }
      ],
      liens: [["Boss et faiblesses", "#guides/boss-faiblesses"], ["Ordre des régions", "#guides/regions"]],
      sources: ["allthings-flame", "games-gg-progression", "xgs-shroud", "v-davynox", "v-luckyghost", "v-jade-cradle", "guided-changelog"]
    },
    {
      id: "regions", cat: "flamme", icone: "map", titre: "Ordre des régions et niveaux",
      resume: "Les sept régions d'Embervale dans l'ordre, avec le niveau des ennemis, la Flamme qui les ouvre et leurs boss.",
      niveau: "Toute la partie", version: "1.0",
      sections: [
        { titre: "Le tableau", blocs: [
          { p: "L'ordre est imposé par la Flamme : chaque palier coûte des ressources de la région en cours et ouvre le Shroud de la suivante. Dans une zone ouverte, l'exploration est libre." },
          { table: { tete: ["#", "Région", "Ennemis", "Ouverte à la Flamme", "Boss notables", "Racines / Puits"], lignes: [
            ["1", "Springlands (+ Low Meadows, Blackmire)", "3–9", "départ ; 2 ouvre le reste", "Vukah Brawler, Scavenger Matron, Fell Thunderbrute, Direwolf", "5 / 3"],
            ["2", "Revelwood", "11–15", "3", "Fell Wispwyvern, Fell Critter Queen", "7 / 3"],
            ["3", "Nomad Highlands", "16–20", "4", "Fell Monstrosity", "7 / 3"],
            ["4", "Kindlewastes", "21–27", "5", "Fell Sicklescythe", "8 / 4"],
            ["5", "Albaneve Summits", "28–35", "6 (7 ouvre le reste)", "Cyclops, Fell Cyclops, Fell Dragon Youngling, Scavenger Tyrant, Ancient S.P.D.R.", "11 / 2"],
            ["6", "Veilwater Basin", "37–45", "8 (9 ouvre le reste)", "Hydrak'Dal", "6 / 3"],
            ["7", "Cinder's Cradle (1.0)", "46–50", "10 (11 ouvre le reste)", "Vorgoth (final), constructs", "9 ou 12 / 0"]
          ] } },
          { verifier: "Racines de Cinder's Cradle : 9 selon PinDrop, 12 selon le résumé du changelog officiel. À compter en jeu." },
          { carte: { fond: "monde", alt: "Carte d'Embervale avec le nom et le niveau de chaque région", regions: true, regionsHaut: ["Blackmire", "Low Meadows"], groupes: ["Ancient_Spire"],
            legende: "Les régions et leur niveau d'ennemis, avec les Ancient Spires (voyage rapide). Cinder's Cradle, au nord, n'apparaît pas encore sur ce fond de carte." } }
        ] },
        { titre: "Conseils de passage", blocs: [
          { ul: [
            "Préparez le palier de Flamme suivant **avant** d'entrer dans la nouvelle région.",
            "Visez un niveau proche du bas de la fourchette avant de vous aventurer loin : au-delà de 2 ou 3 niveaux d'écart, les ennemis deviennent très durs.",
            "**Albaneve** demande de la résistance au froid, **Veilwater** de quoi respirer et nager (casque de plongée, palmes).",
            "**Cinder's Cradle** se trouve au nord, entre Albaneve et Veilwater. Ses îles flottantes, tout en haut, sont du niveau 50 et plus."
          ] }
        ] }
      ],
      liens: [["Carte", "#carte"], ["Niveau des zones (Sources)", "#maj"]],
      sources: ["pd-progression", "guided-changelog", "v-chiselchip-50h"]
    },
    {
      id: "shroud", cat: "flamme", icone: "clock", titre: "Survivre dans le Shroud",
      resume: "Comment marche le minuteur de la brume, comment l'allonger, et ce qu'on y gagne.",
      niveau: "Tous niveaux", version: "1.0",
      sections: [
        { titre: "Le principe", blocs: [
          { ul: [
            "Entrer dans le Shroud lance un **minuteur** : à zéro, vous mourez. Il se recharge dès qu'on sort de la brume.",
            "Le **Shroud rouge** (mortel) vide la jauge beaucoup plus vite tant que votre niveau de Flamme est insuffisant.",
            "On **ne peut pas se téléporter** depuis le Shroud : prévoyez la sortie."
          ] }
        ] },
        { titre: "Allonger son temps", blocs: [
          { ul: [
            "**Monter la Flamme** : c'est le levier principal.",
            "Compétence centrale **Inner Fires** : +60 s par rang (3 rangs).",
            "**Shroud Survival Flask** : jusqu'à +2 min (+4 min pour la version améliorée) pendant 45 min. À boire **avant** d'entrer : elle n'agit pas sur un minuteur déjà entamé.",
            "**Réceptacles de Shroud** (sabliers, fontaines) dans la brume : ils remettent le minuteur à zéro. Plus nombreux en 1.0, et les gros Fell en lâchent aussi.",
            "Pour les archers et les porteurs de dague : **Survival Instinct** rend du temps quand on tue un ennemi infesté."
          ] }
        ] },
        { titre: "Pourquoi y aller", blocs: [
          { ul: [
            "Meilleur butin et ennemis Fell.",
            "**Shroud Roots** (racines) et **Elixir Wells** (puits) : points de compétence. Voir [Points de compétence](#guides/points-competence).",
            "**Shroud Cores**, lâchés par les mini-boss des puits : ils agrandissent la zone de l'autel."
          ] },
          { astuce: "Une torche éloigne certaines créatures du Shroud. En 1.0, à la Flamme 11, les autels repoussent la brume autour d'eux : on peut construire dans le Shroud." }
        ] }
      ],
      sources: ["xgs-shroud", "allthings-center", "gamerguides-tips", "guided-changelog", "v-chiselchip-50h"]
    },
    {
      id: "points-competence", cat: "flamme", icone: "target", titre: "XP et points de compétence",
      resume: "D'où viennent les points de compétence, comment trouver les racines et gagner de l'expérience vite.",
      niveau: "Tous niveaux", version: "1.0",
      sections: [
        { titre: "Les trois sources de points", blocs: [
          { table: { tete: ["Source", "Points", "Remarque"], lignes: [
            ["Chaque niveau de personnage", "2", "Niveau max 50 en 1.0"],
            ["Shroud Root (racine) détruite", "1", "La première fois seulement, par sauvegarde"],
            ["Elixir Well (puits) purifié", "3", "La première fois seulement"]
          ] } },
          { verifier: "Total au niveau 50 en 1.0 : deux vidéos annoncent 212 points avec toutes les racines, mais aucun calculateur à jour ne le confirme. Valeurs 1 et 3 points à reconfirmer en 1.0." }
        ] },
        { titre: "Trouver les racines", blocs: [
          { ul: [
            "Les **Ancient Spires** et les **obélisques** (rayon rouge vers le ciel) révèlent les racines et les lieux des environs sur la carte.",
            "Une racine se coupe à la hache après avoir éliminé ses gardes ; une racine faite porte une coche sur la carte.",
            "Astuce de puits : planer directement jusqu'à l'entrée, nettoyer, puis couper la racine du fond.",
            "En 1.0, de nouvelles racines ont été ajoutées en bordure de Springlands, Blackmire et Kindlewastes, et un obélisque de fin de jeu révèle celles qu'on a manquées."
          ] },
          { carte: { fond: "monde", alt: "Carte des Shroud Roots et des Elixir Wells", groupes: ["Shroud_Root", "Elixir_Well"],
            legende: "Racines et puits connus du wiki avant la 1.0 : les racines ajoutées en 1.0 et celles de Cinder's Cradle n'y sont pas encore. Les puits sont cerclés d'orange ; survolez une icône pour son nom." } }
        ] },
        { titre: "Gagner de l'XP vite", blocs: [
          { ul: [
            "**Miner** : chaque coup de pioche rapporte de l'XP. Videz les filons en entier et emportez plusieurs pioches.",
            "Découvrir des lieux, finir des quêtes, lire les notes surlignées.",
            "Couper du bois et construire ne rapportent pas d'XP."
          ] }
        ] }
      ],
      liens: [["Comprendre l'arbre", "#guides/arbre"], ["Compétences", "#competences"]],
      sources: ["xgs-skills", "prima-xp", "v-kontreck", "v-chiselchip-mage", "v-chiselchip-50h", "companion-10"]
    },

    // ═══════════════ BOSS ═══════════════
    {
      id: "boss-faiblesses", cat: "boss", icone: "skull", titre: "Boss : où, quel niveau, quelles faiblesses",
      resume: "Tableau des boss importants avec leurs faiblesses connues et les trophées qu'ils donnent pour la Flamme.",
      niveau: "Toute la partie", version: "1.0 partiel",
      sections: [
        { titre: "Le tableau", blocs: [
          { table: { tete: ["Boss", "Région", "Niveau", "Faiblesses", "Rôle"], lignes: [
            ["Scavenger Matron", "Springlands", "3–9", "?", "Trophée Flamme 3"],
            ["Vukah Brawler", "plusieurs", "3–9", "poison 120 %, Shroud 120 %", "—"],
            ["Fell Thunderbrute", "Springlands → Kindlewastes", "3–9", "?", "Garde puits et racines"],
            ["Fell Wispwyvern", "Revelwood (The Pike)", "11–15", "?", "Trophée Flamme 4"],
            ["Fell Critter Queen", "Revelwood et après", "11–15", "feu 140 %, poison 120 %", "—"],
            ["Hollow Cyclops", "Hollow Halls", "11–15", "contondant 150 %, feu 120 %", "Boss des Hollow Halls"],
            ["Fell Monstrosity", "Nomad Highlands", "16–20", "feu 120 %", "Trophée Flamme 5"],
            ["Fell Sicklescythe", "Kindlewastes", "21–27", "?", "Trophée Flamme 6"],
            ["Fell Cyclops", "Albaneve", "28–35", "poison 140 %, feu 140 %", "Trophée Flamme 7"],
            ["Fell Dragon Youngling", "Albaneve (Howling Peak)", "28–35", "feu 120 %", "Trophée Flamme 8"],
            ["Scavenger Tyrant (1.0)", "Albaneve", "28–35", "perforant 130 %, glace 130 %", "—"],
            ["Ancient S.P.D.R. (1.0)", "Albaneve", "≈ 30", "glace, contondant", "Constructs"],
            ["Hydrak'Dal (1.0)", "Veilwater Basin", "37–45", "perforant 140 %, glace 120 %", "Trophée Flamme 9"],
            ["Vorgoth (1.0)", "Cinder's Cradle", "50", "feu 120 %, immunisé au Shroud", "Boss final, trophées Flamme 11"]
          ] } },
          { p: "Retenez surtout que **le feu fonctionne contre la plupart des Fell**, et que les **constructs** des Anciens craignent la glace et les coups contondants." },
          { verifier: "Les « ? » ne sont pas encore publiés pour la 1.0. Faiblesses des constructs d'après les vidéos, pas d'après les fichiers du jeu." }
        ] },
        { titre: "Préparer n'importe quel boss", blocs: [
          { ol: [
            "Posez un **autel à proximité** pour revenir vite en cas d'échec.",
            "Trois plats actifs, potions de soin, et la **faiblesse élémentaire** du boss sur votre arme.",
            "Caressez votre chat ou votre chien avant de partir : petit bonus de vie.",
            "Emportez une arme à distance **et** une de mêlée : beaucoup de boss volent ou se mettent hors de portée.",
            "En 1.0, un boss ne retrouve plus toute sa vie si vous mourez, mais il se régénère quand vous quittez le combat : ne traînez pas."
          ] }
        ] },
        { titre: "Bien parer", blocs: [
          { p: "La parade se déclenche juste avant l'impact ; le bon moment varie d'un ennemi à l'autre. Une fois l'endurance de l'ennemi vidée, il est sans défense : c'est le moment d'une **Merciless Attack** (500 % de dégâts sur un ennemi étourdi). Une parade parfaite au bouclier étourdit directement." }
        ] },
        { titre: "Fiches rapides", blocs: [
          { ul: [
            "**Scavenger Matron** (colline des Scavengers, nord-est de la Spire de Springlands) : une entrée discrète passe par un puits de mine sur le flanc gauche.",
            "**Vukah Brawler** (colline cérémonielle Vukah, Low Meadows) : tuez d'abord les soigneurs, évitez la boue, esquivez sur le côté quand il se frappe la poitrine. Niveau 10 à 15 conseillé.",
            "**Fell Thunderbrute** (Ancient Bridge, nord-est de la Spire de Revelwood) : donne l'arc légendaire Fell Commander.",
            "**Ancient S.P.D.R.** : agrippez-vous à sa tête pendant ses salves de missiles, traversez son laser avec Blink et cassez sa bulle avec des attaques spéciales."
          ] }
        ] }
      ],
      liens: [["Fell Wispwyvern", "#guides/wispwyvern"], ["Vorgoth", "#guides/vorgoth"]],
      sources: ["pd-bosses", "v-justsoup", "v-uniques", "v-chiselchip-spdr", "v-heather-dragon", "guided-changelog"]
    },
    {
      id: "wispwyvern", vignette: "commanders-ring", cat: "boss", icone: "bolt", titre: "Fell Wispwyvern, le dragon de Revelwood",
      resume: "Le premier vrai mur de la partie : préparation, cycle d'attaques et méthode à l'arc pour obtenir le trophée de la Flamme 4.",
      niveau: "Niveaux 11 à 15", version: "pré-1.0, revu en 1.0",
      sections: [
        { titre: "Préparation", blocs: [
          { ul: [
            "Posez un autel sur la colline à l'est du château, après avoir traversé Pike's Mead : vous pourrez revenir vous ravitailler.",
            "Emportez un **arc** et une **arme de mêlée**, des potions de soin à effet immédiat, de la viande pour la vie, et de quoi gérer les insectes invoqués.",
            "Ouvrez les portes à l'explosif puis entrez en planant."
          ] }
        ] },
        { titre: "Son cycle", blocs: [
          { ol: [
            "Boules de feu bleues, puis souffle.",
            "Grand saut à travers l'arène : l'attaque la plus dangereuse, elle vous étourdit. Trottiner de côté suffit à l'éviter.",
            "Nouvelles boules de feu.",
            "Il inspire une dizaine de secondes et invoque des insectes : **c'est votre fenêtre**. Étourdissez-le à l'arc, puis frappez 3 ou 4 fois en mêlée."
          ] },
          { astuce: "Les flèches de cuivre (ou d'acier empoisonné) l'étourdissent, pas les flèches explosives : avec ces dernières, le combat peut durer plus de vingt minutes." }
        ] },
        { titre: "Variante prudente", blocs: [
          { p: "Certains joueurs tirent depuis une hauteur éloignée de l'arène avec des flèches éternelles de glace et des anneaux de régénération de mana, puis finissent à l'explosif quand il se pose. Attention : il se réinitialise si vous restez caché trop longtemps." },
          { p: "Les builds de paladin à aura de feu le rendent nettement plus simple. Voir le [build Paladin](#builds)." }
        ] },
        { titre: "Récompenses", blocs: [
          { ul: [
            "Sa tête : trophée du palier de Flamme 3 → 4.",
            "Le **Commander's Ring**, et un tableau décoratif (bon pour le confort) à récupérer près de la Pike après le combat."
          ] },
          { objets: { ids: ["commanders-ring"] } },
          { verifier: "Méthodes décrites avant la 1.0 ; le Fell Dragon Youngling d'Albaneve a été retravaillé en 1.0 (point faible dans le dos, phase au sol), le Wispwyvern peut-être aussi." }
        ] }
      ],
      sources: ["v-heather-dragon", "v-wokes-dragon", "v-uniques", "v-fervor-paladin", "allthings-flame"]
    },
    {
      id: "vorgoth", cat: "boss", icone: "trophy", titre: "Vorgoth, le boss final", spoiler: true,
      resume: "Le chemin vers la Citadelle, les deux phases du combat et ce qui se passe après. Contient des révélations sur la fin.",
      niveau: "Niveau 50", version: "1.0",
      sections: [
        { titre: "Y arriver", blocs: [
          { ol: [
            "Secourir **Loraine Crim** à Cinder's Ascent (Cinder's Cradle).",
            "Finir les **six donjons-balises**, un par ancienne région. Voir [Les donjons-balises](#guides/donjons-balises).",
            "Prendre le téléporteur de Cinder's Ascent vers les **îles flottantes**, puis grimper jusqu'à l'**Ancient Citadel**.",
            "Devant l'arène, une **barrière à deux verrous** : activez tous les interrupteurs violets, y compris ceux perchés sur des plateformes et des murs, jusqu'au message de déverrouillage."
          ] },
          { astuce: "Les îles flottantes sont toutes de niveau 50 et plus : emportez deux autels pour avancer par étapes, et suivez les repères orange. Une épaisse couche de Shroud précède le combat." }
        ] },
        { titre: "Phase 1 — Champion of the Shroud", blocs: [
          { ul: [
            "Un épéiste en armure aux fentes rapides.",
            "Esquivez tôt et ne videz jamais votre endurance.",
            "On peut le frapper dans le dos."
          ] }
        ] },
        { titre: "Phase 2 — The Wanderer's Vessel", blocs: [
          { ul: [
            "Une créature géante avec un bras-tentacule : triple frappe, balayage en chargeant, tentacule qui vous attire, projectiles de Shroud et invocations.",
            "Des **organes** apparaissent sur l'arène (kystes, yeux, fleurs, tentacules) : les frapper **transmet les dégâts** au boss. Concentrez-vous sur eux."
          ] }
        ] },
        { titre: "Build et équipement", blocs: [
          { ul: [
            "**Faiblesse au feu (120 %)**, **immunité au Shroud** : n'importe quel build de feu fonctionne, les armes de Shroud sont inutiles.",
            "Niveau 50 et équipement amélioré au niveau 55 conseillés, même si plusieurs joueurs l'ont battu sans équipement au maximum.",
            "En coop, il gagne environ 70 % de vie et 5 % de dégâts par joueur supplémentaire."
          ] }
        ] },
        { titre: "Récompenses et suite", blocs: [
          { ul: [
            "**Vorgoth's Eye** et **Vorgoth's Bound Essence** pour le dernier palier de Flamme, des runes légendaires, l'épée **Shroud Vessel's Greatsword** et des pièces du set **Soulbound** (à fabriquer chez Loraine Crim : il faut le battre plusieurs fois).",
            "Communier avec la Flamme au cœur de la Citadelle lance la séquence de fin.",
            "Après la fin, tout reste : personnage, base, quêtes. La **Flamme 11** permet aux autels de repousser le Shroud et porte la limite à 16 autels."
          ] }
        ] }
      ],
      sources: ["whisper-vorgoth", "pd-final-boss", "allthings-ending", "v-chiselchip-50h", "ens-tools-10"]
    },

    // ═══════════════ BUILDS ET COMPÉTENCES ═══════════════
    {
      id: "arbre", cat: "builds", icone: "tree", titre: "Comprendre l'arbre de compétences",
      resume: "Pas de classe, douze archétypes, des attributs et une réinitialisation bon marché : comment tout s'organise.",
      niveau: "Tous niveaux", version: "1.0",
      sections: [
        { titre: "Un seul arbre, pas de classe", blocs: [
          { p: "Enshrouded n'impose aucune classe. Un arbre unique part d'un anneau central vers trois grandes zones, et l'on prend ce que l'on veut tant que les nœuds se touchent. La plupart des builds piochent dans deux ou trois archétypes." },
          { table: { tete: ["Zone", "Archétypes"], lignes: [
            ["Guerrier (mêlée)", "Warrior (une main), Tank (bouclier, parade), Barbarian (deux mains), Athlete (endurance, mobilité)"],
            ["Mage (magie)", "Wizard (bâtons), Battlemage (baguettes), Healer (soins), Trickster"],
            ["Rôdeur (distance)", "Ranger (arc), Assassin (critiques et dagues en 1.0), Beastmaster, Survivor (récolte, construction)"]
          ] } }
        ] },
        { titre: "Les attributs", blocs: [
          { table: { tete: ["Attribut", "Effet par point", "Pour qui"], lignes: [
            ["Constitution", "+50 PV", "Tank, mêlée"],
            ["Strength", "+5 % dégâts de mêlée", "Warrior, Barbarian"],
            ["Dexterity", "+5 % dégâts arc et dagues", "Ranger, Assassin"],
            ["Endurance", "+10 endurance", "Mobilité, mêlée"],
            ["Spirit", "+20 mana", "Mages"],
            ["Intelligence", "+5 % dégâts magiques", "Wizard, Battlemage"]
          ] } },
          { verifier: "Valeurs d'avant la 1.0, d'après le wiki." }
        ] },
        { titre: "Le centre de l'arbre", blocs: [
          { p: "Le centre regroupe 19 compétences utiles à tous (environ 50 points pour tout prendre) : Inner Fires (temps de Shroud), Well Rested (durée du bonus Reposé), Double Jump, Merciless Attack, Lumberjack, Mason, Prospector, Miner, Airborne Architect (construction en vol), etc." }
        ] },
        { titre: "Réinitialiser", blocs: [
          { ul: [
            "À n'importe quel autel de la Flamme, pour **une rune par point** dépensé : on peut essayer sans risque.",
            "La 1.0 a réinitialisé l'arbre de tout le monde : coûts baissés, nœuds déplacés.",
            "Certaines pièces d'équipement ajoutent **+1 à des nœuds** (on voit par exemple « 5/3 » dans l'arbre). Les versions légendaires ont cinq bonus au lieu de trois."
          ] }
        ] }
      ],
      liens: [["Compétences détaillées", "#competences"], ["Builds", "#builds"]],
      sources: ["xgs-skills", "allthings-center", "ens-tools-10", "v-chiselchip-mage"]
    },
    {
      id: "premiers-points", cat: "builds", icone: "star", titre: "Où mettre ses premiers points",
      resume: "Les nœuds que tout le monde prend en premier, puis l'ordre conseillé selon votre style.",
      niveau: "Niveaux 1 à 15", version: "1.0",
      sections: [
        { titre: "Les incontournables", blocs: [
          { ol: [
            "**Double Jump** (2 points) : tous les créateurs le placent en premier.",
            "**Updraft** : relance le planeur une fois par vol. En 1.0, on choisit entre l'ancienne version instantanée et une version à charger (réglable côté serveur).",
            "**Airborne** : le planeur consomme moins d'endurance."
          ] }
        ] },
        { titre: "Ensuite, au choix", blocs: [
          { ul: [
            "**Desert Stomach** : un emplacement de nourriture en plus.",
            "**Last Meal** : on garde ses bonus de nourriture en mourant (durée réduite de moitié).",
            "**Water Aura** : soin passif quand on prend des coups, très conseillé en solo.",
            "**Blink** : l'esquive devient une courte téléportation.",
            "Un bonus plat de +10 % de dégâts selon votre style : Warrior's Path (mêlée), Marksman (distance), This is the Way (magie)."
          ] }
        ] },
        { titre: "Par quelle branche commencer", blocs: [
          { table: { tete: ["Vous jouez…", "Commencez par"], lignes: [
            ["Arme à deux mains", "Barbarian"],
            ["Épée et bouclier", "Warrior"],
            ["Vous mourez trop souvent", "Tank, jusqu'à Earth Aura"],
            ["Arc", "Ranger (tirs à la tête, flèches explosives)"],
            ["Magie", "Battlemage à la baguette, puis Wizard quand l'alchimiste est là"]
          ] } },
          { astuce: "Partir mage avant d'avoir réveillé l'alchimiste est déconseillé : on a très peu de sorts au début. La baguette reste une excellente arme d'appoint pour tout le monde." }
        ] }
      ],
      liens: [["Builds complets", "#builds"]],
      sources: ["v-sirjay", "v-legacy", "v-kitsune", "htm-mistakes", "v-chiselchip-mage"]
    },
    {
      id: "debuter-mage", vignette: "wand", cat: "builds", icone: "wand", titre: "Bien démarrer en mage",
      resume: "Baguette ou bâton, premier chemin dans l'arbre et pièges à éviter quand on joue la magie.",
      niveau: "Niveaux 5 à 30", version: "1.0",
      sections: [
        { titre: "Baguette ou bâton ?", blocs: [
          { table: { tete: ["", "Baguette", "Bâton"], lignes: [
            ["Ressource", "Pas de mana, seulement de l'usure", "Mana (ou charges de sort)"],
            ["Points forts", "Tir chargé perçant qui fait chanceler, attaque aérienne de zone, esquive offensive (1.0)", "Vrais sorts, plus de portée, sorts éternels améliorables en 1.0"],
            ["Quand", "Dès le début", "Après avoir réveillé l'alchimiste"]
          ] } },
          { objets: { ids: ["wand", "apprentice-wand"], legende: "La baguette de base se fabrique avec des os dès les premières minutes." } }
        ] },
        { titre: "Un premier chemin à la baguette", blocs: [
          { ol: [
            "Quelques nœuds d'**Intelligence**.",
            "**Eternal Spark** (rend de la durabilité), puis **Arcane Deflection** (parade au bouclier magique).",
            "**Unity** (chance de rendre du mana).",
            "**Wand Specialization** : une attaque spéciale qui regroupe les ennemis.",
            "**Arcane Proliferation** (chance de doubler les projectiles), puis **Blink**."
          ] },
          { p: "Avec une baguette à tirs multiples, ce chemin permet de faire un Hollow Hall en solo très tôt d'après son auteur." }
        ] },
        { titre: "Survivre en mage", blocs: [
          { ul: [
            "Deux nœuds de Constitution en bas de l'arbre donnent +100 PV pour 2 points : à prendre tôt.",
            "**Water Aura** au maximum, puis les nœuds qui convertissent l'intelligence en vie.",
            "**Blink**, puis ses variantes défensives et offensives.",
            "Prenez tous les nœuds d'Intelligence que vous croisez."
          ] },
          { astuce: "La presse trouve la magie « faible en ressenti » alors qu'elle est efficace en chiffres : ne jugez pas un sort à son effet visuel." },
          { figure: { src: "images/guides/set-mage.webp", cls: "portrait", alt: "Personnage vu de face et de dos portant le set Mage : chapeau pointu, tunique verte, gants et bottes de cuir",
            legende: "Le **Mage Set** (niveau 13), son rendu en jeu d'après le wiki. Le détail des pièces est dans le [catalogue](#equipements)." } }
        ] },
        { titre: "Plus loin", blocs: [
          { p: "Pour les versions complètes (Mage de bataille, Sorcier, Invocateur, Soigneur) avec l'équipement de chaque étape, voir l'onglet [Builds](#builds)." }
        ] }
      ],
      sources: ["v-p4wny-mage", "v-chiselchip-mage", "pcgames-review", "ens-tools-10"]
    },

    // ═══════════════ ÉQUIPEMENT ET BUTIN ═══════════════
    {
      id: "coffres-runes", cat: "equipement", icone: "trophy", titre: "Coffres, runes et farm",
      resume: "Comment marche le butin, que faire de ses runes, et quelles routes de coffres valent le détour.",
      niveau: "Milieu et fin de partie", version: "1.0 (routes pré-1.0)",
      sections: [
        { titre: "Les règles du butin", blocs: [
          { ul: [
            "**Coffre d'or > coffre d'argent > coffre en bois.** Le butin est aléatoire et prend le niveau de la zone ; un coffre d'or peut donner deux légendaires.",
            "Les coffres se remplissent à nouveau après un **minuteur** (de l'ordre de 30 minutes à 2 heures selon les sources), plus en relançant simplement la partie. **Videz entièrement** un coffre pour qu'il compte comme ouvert.",
            "En 1.0, un objet trouvé va jusqu'au niveau 50 et s'améliore jusqu'au niveau 55."
          ] },
          { verifier: "Durée exacte de réapparition des coffres en 1.0 : les sources se contredisent." }
        ] },
        { titre: "Toujours dans le sac", blocs: [
          { ul: [
            "Une **pioche** : on creuse jusqu'aux coffres enterrés, sous les tombes et parfois à travers les portes.",
            "Des **crochets** (lockpicks), et en fin de partie des crochets archaïques.",
            "Un **autel de la Flamme** : posé à côté d'une porte verrouillée, il permet de la démonter."
          ] }
        ] },
        { titre: "Les runes", blocs: [
          { ul: [
            "On les obtient en **recyclant** l'équipement inutile.",
            "Elles servent à améliorer les objets et à réinitialiser l'arbre de compétences.",
            "Gardez-les pour l'équipement final ou un boss bloquant, et cherchez les runes légendaires dans les coffres plutôt que de les fabriquer."
          ] }
        ] },
        { titre: "Routes de coffres connues", blocs: [
          { ul: [
            "**Château de Cromville** (nord de Veilwater) : un coffre d'or secret derrière le trône, l'épée Guard of the North au bout d'un couloir, d'autres coffres dans la cathédrale et les tours.",
            "**Gateway Outpost** (Veilwater) : coffre d'or au fond de la tour principale ; un autre dans le village minier au sud, et un dans le **temple Drak'Dal** à l'ouest (salles qui se remplissent d'eau).",
            "**Route de la Citadelle** (Cinder's Cradle, 1.0) : Sparks au sol, coffres d'argent et d'or, une porte à 10 Sparks que l'on peut aussi casser à la pioche dorée.",
            "Avec deux autels bien placés près de Cromville, une boucle de cinq coffres d'or et deux d'argent se refait toutes les 35 minutes environ."
          ] },
          { verifier: "Routes de Cromville et Veilwater décrites avant la 1.0 (Flamme 9, niveau 40+) : les lieux existent toujours, mais le contenu a pu changer." },
          { astuce: "Dans les réglages du monde, la quantité de butin peut monter à 150 % ou 200 % si vous ne voulez pas farmer." }
        ] }
      ],
      sources: ["games-gg-chests", "htm-mistakes", "v-spyro-runes", "v-unyphi", "v-hishers-route", "v-total-route"]
    },
    {
      id: "equipement-fin", vignette: "set-flame-arcanist", cat: "equipement", icone: "armor", titre: "L'équipement de fin de partie (1.0)",
      resume: "Les nouveaux sets de la 1.0, qui les fabrique, l'autel d'infusion et le set de Vorgoth.",
      niveau: "Niveaux 45 à 50", version: "1.0",
      sections: [
        { titre: "Ce qu'il faut savoir", blocs: [
          { ul: [
            "En 1.0, **chaque palier de Flamme débloque les armures du palier d'artisanat suivant**.",
            "Un nouvel atelier, l'**autel d'infusion**, combine les ressources de Cinder's Cradle en infusion archaïque, nécessaire au meilleur équipement. Les Anciens ont aussi leur propre forge à gemmes.",
            "Matériaux à prévoir : Celestium, Moonstone, Diamond Dust, Ember Carapace, Magma Gel, Archaic Shards, Archaic Core."
          ] }
        ] },
        { titre: "Nouveaux sets par artisan", blocs: [
          { table: { tete: ["Artisan", "Sets", "Pour qui"], lignes: [
            ["Alchimiste", "Life Lock, Flame Arcanist", "Soutien ; mage « canon de verre »"],
            ["Forgeron", "Crest Flame, Ember Guard (+ boucliers)", "Tank et mêlée"],
            ["Chasseuse", "Ashwind Strider, Sky Specter", "Archer, assassin"],
            ["Loraine Crim", "Soulbound (Vorgoth)", "Tous, matériaux du boss final"]
          ] } },
          { objets: { ids: ["set-lifelock", "set-flame-arcanist", "set-crestflame", "set-emerguard", "set-ashwind-strider", "set-sky-specter", "set-vorgoths-soulbound"], legende: "Les sets de la 1.0 tels qu'ils figurent dans notre catalogue." } },
          { verifier: "Noms de sets et répartition d'après une seule vidéo ; orthographe à confirmer en jeu." }
        ] },
        { titre: "À trouver dans le monde", blocs: [
          { ul: [
            "**Set de l'Artificier** (mage) : pièces cachées dans les îles flottantes, par exemple dans une maison des Gardens of Earthly Delights.",
            "Les **salles à Sparks** (10 Sparks pour ouvrir, ou un autel posé pour démonter la porte) donnent souvent deux légendaires.",
            "**Shroud Vessel's Greatsword** : légendaire, moitié dégâts de Shroud, récompense de Vorgoth."
          ] },
          { astuce: "Fabriquez d'abord la version rare d'une pièce, puis cherchez la légendaire : elle porte cinq bonus d'arbre au lieu de trois." }
        ] }
      ],
      liens: [["Équipement par build", "#builds"], ["Catalogue", "#equipements"]],
      sources: ["v-04am-sets", "v-04am-artificer", "ens-tools-10", "allthings-ending"]
    },
    {
      id: "objets-tot", vignette: "gemini-ring", cat: "equipement", icone: "ring", titre: "Objets forts à récupérer tôt",
      resume: "Anneaux, armes et boucliers à emplacement fixe qui changent le début de partie.",
      niveau: "Niveaux 1 à 25", version: "pré-1.0, à revérifier",
      sections: [
        { titre: "Springlands", blocs: [
          { ul: [
            "**Sigil Ring of the Elder Guard** (régénération et vie) : lâché par un ennemi du Shroud agenouillé dans le camp sous le pont de Braelyn.",
            "**Gemini Ring** (vol de vie) : ennemi volant du Shroud à Mossy Grove, au nord de la Spire de Springlands.",
            "**Wanderer's Boots** : sur un squelette près de l'obélisque au sud-ouest de la Spire.",
            "**Pike's Mead Bulwark** : bouclier toujours légendaire, au fond des Mistbury Catacombs. Voir [l'énigme](#guides/enigmes).",
            "Un coffre caché sous le troisième pilier du pont de Braelyn (grappin + pioche)."
          ] },
          { objets: { ids: ["sigil-ring-of-the-elder-guard", "gemini-ring", "pikemeads-bulwark"] } }
        ] },
        { titre: "Revelwood", blocs: [
          { ul: [
            "**Fell Commander** : arc légendaire lâché par le Fell Thunderbrute de l'Ancient Bridge.",
            "**Commander's Ring** : récompense du Fell Wispwyvern.",
            "**Ring of Rapacity** sous des gravats à Willow Crush, et le bouclier **Riptide** dans un coffre de Grindteeth Grotto (sud-ouest de la Spire).",
            "Un anneau qui ajoute du temps de Shroud, dans le secteur d'une cabane de chasseur au sud-est de la Spire."
          ] },
          { objets: { ids: ["fell-commander-bow", "commanders-ring", "ring-of-rapacity", "riptide"] } }
        ] },
        { titre: "Plus loin", blocs: [
          { ul: [
            "**Ghost Glider** (planeur légendaire) : coffre d'or en haut du Scatterbone Sun Temple, au sud de la Spire de Kindlewastes.",
            "**Guard of the North** : épée du château de Cromville (Veilwater)."
          ] },
          { objets: { ids: ["guard-of-the-north-sword"] } },
          { verifier: "Liste issue de vidéos d'avant la 1.0 : les emplacements et la rareté ont pu changer avec la refonte du début de partie." }
        ] }
      ],
      liens: [["Carte des objets", "#carte"]],
      sources: ["v-uniques", "v-spyro-runes", "v-suntemple", "v-unyphi"]
    },

    // ═══════════════ DONJONS ET ÉNIGMES ═══════════════
    {
      id: "survivants", cat: "donjons", icone: "users", titre: "Retrouver les survivants et leurs assistants",
      resume: "Où réveiller chaque artisan, comment l'installer à la base et où trouver les assistants qui améliorent leurs stations.",
      niveau: "Niveaux 1 à 15", version: "pré-1.0 + 1.0",
      sections: [
        { titre: "Les artisans", blocs: [
          { table: { tete: ["Rôle", "Nom", "Où le réveiller"], lignes: [
            ["Forgeron", "Oswald Anders", "Cinder Vault, au départ"],
            ["Alchimiste", "Balthazar", "Caveau à l'ouest de la Spire de Springlands"],
            ["Fermière", "Emily Fray", "Caveau au nord de la Spire de Springlands"],
            ["Chasseuse", "Athalan Skree", "Caveau à l'est de la Spire, près du pont de Braelyn"],
            ["Charpentier", "Cade Hawthorn", "Caveau au sud-ouest de la Spire de Low Meadows"],
            ["Barde", "Melody", "Cité engloutie au nord de la Spire de Blackmire (après Revelwood, niveau 12)"],
            ["Collectionneur", "Aiden Crowley", "Hollow Halls, par une quête de l'alchimiste"],
            ["Nouveau 1.0", "Loraine Crim", "Cinder's Ascent, Cinder's Cradle"]
          ] } },
          { p: "Chacun débloque une station et des recettes. Le charpentier est indispensable pour le planeur et le grappin améliorés." },
          { carte: { fond: "springlands", alt: "Carte des caveaux des cinq premiers artisans autour de la Spire de Springlands",
            legende: "Les caveaux des cinq premiers artisans, autour de la Spire de Springlands.",
            points: [
              ["CinderVault", "Cinder Vault (forgeron en 1.0)"],
              ["AncientVault-Alchemist", "Alchimiste"],
              ["AncientVault-Farmer", "Fermière"],
              ["AncientVault-Hunter", "Chasseuse"],
              ["AncientVault-Carpenter", "Charpentier"],
              ["AncientVault-Blacksmith", "Ancien caveau du forgeron (avant 1.0)"],
              ["AncientSpire-Springlands", "Spire de Springlands"]
            ] } }
        ] },
        { titre: "Installer un survivant", blocs: [
          { ol: [
            "Fabriquez le **bâton d'invocation** (fabrication manuelle).",
            "Choisissez le survivant, visez un **lit libre à l'abri** et posez-le : le lit lui est attribué.",
            "Réglez son **rayon de déplacement** (0, 10, 30 ou 50 m) : à 0 m, il reste à côté de sa station.",
            "Sans abri ni lit accessible, il ne donne pas ses quêtes (et dort par terre)."
          ] }
        ] },
        { titre: "Les assistants", blocs: [
          { table: { tete: ["Assistant", "Artisan", "Où"], lignes: [
            ["Rochelle (Relle) Anders", "Forgeron", "Fanning Ranch ; une vidéo la place dans une ferme au sud-est de la Spire des Nomad Highlands (tirer sur les explosifs depuis le toit)"],
            ["Lady Leclair", "Alchimiste", "Glenwood's End, maison à l'ouest du village, passage caché vers une cave"],
            ["Fenrig Mills Jr.", "Fermière", "Lire la note à l'étage de la ferme, puis grotte aux loups au sud"],
            ["Galen Yager", "Chasseuse", "Nid de vautours, Nomad Highlands"],
            ["Aunt Braelyn", "Charpentier", "Temple caché de Blackmire, près de l'icône d'arbre blanc"]
          ] } },
          { verifier: "Emplacements relevés avant la 1.0 ; la 1.0 a remanié des zones du début. Plusieurs sources se contredisent sur l'emplacement de Rochelle Anders." }
        ] }
      ],
      liens: [["Artisans sur la carte", "#construction/artisans"]],
      sources: ["sk-survivors", "v-survivant", "v-apprentis", "v-smartceltic", "ens-tools-10"]
    },
    {
      id: "enigmes", cat: "donjons", icone: "compass", titre: "Énigmes : caveaux, catacombes et temples",
      resume: "Solutions résumées des salles à boutons les plus demandées : Mistbury Catacombs, Sun Temple, caveaux, Spire de Veilwater, port.",
      niveau: "Niveaux 5 à 40", version: "pré-1.0, à revérifier",
      sections: [
        { titre: "La règle générale", blocs: [
          { p: "La plupart des portes scellées s'ouvrent avec plusieurs **boutons ou symboles cachés** : certains se tirent à l'arc, d'autres s'activent à la main après un passage au grappin. Regardez en hauteur et derrière les meubles. Et en dernier recours, la pioche ou un autel posé permettent souvent de contourner l'énigme." }
        ] },
        { titre: "Mistbury Catacombs (tombeau de la Reine)", blocs: [
          { p: "Nord-est de la Spire de Springlands. Quatre boutons ouvrent le tombeau qui garde le bouclier **Pike's Mead Bulwark**. Prévoyez au moins **un crochet**." },
          { ol: [
            "Dans la zone de Shroud au nord : détruire un blason à la hache, grimper, tirer sur un tonneau rouge.",
            "Grappin vers la plateforme, puis tirer sur le bouton du mur d'en face.",
            "Dans le Shroud des profondeurs (attention à la lave sous le pont cassé) : tirer sur le bouton.",
            "Après la grille ouverte au crochet, à gauche : un bouton à activer **à la main**."
          ] },
          { astuce: "On peut aussi entrer par le toit." }
        ] },
        { titre: "Où sont ces salles", blocs: [
          { carte: { fond: "monde", alt: "Carte des catacombes, caveaux, temples et Spire décrits dans ce guide",
            legende: "Les lieux de ce guide. Le wiki ne distingue pas le Scatterbone Sun Temple des autres : c'est celui au sud de la Spire de Kindlewastes.",
            groupes: ["Sun_Temple"],
            points: [
              ["MistburyCatacombs", "Mistbury Catacombs"],
              ["AncientVault-Hunter", "Caveau de la Chasseuse"],
              ["AncientVault-Farmer", "Caveau de la Fermière"],
              ["AncientSpire-Kindlewastes", "Spire de Kindlewastes (repère pour Scatterbone)"],
              ["AncientSpire-VeilwaterBasin", "Spire de Veilwater Basin"]
            ] } }
        ] },
        { titre: "Scatterbone Sun Temple", blocs: [
          { p: "Coin sud-est de la carte, au sud de la Spire de Kindlewastes." },
          { ul: [
            "**Entrée** : trois boutons, à gauche, à droite et au-dessus de l'arche. Une tombe d'argent se cache derrière des gravats à gauche de l'entrée.",
            "**Étage** : quatre boutons, au-dessus d'une ouverture à droite, derrière une **bibliothèque à pousser** à gauche de la porte, un à viser par une fente du mur, et un sur le balcon.",
            "**Sommet** : coffre d'or avec le planeur **Ghost Glider** et deux coffres d'argent. Attention aux gros oiseaux."
          ] }
        ] },
        { titre: "Caveaux des survivants", blocs: [
          { ul: [
            "**Caveau de la Chasseuse** (est du pont de Braelyn) : pièges électriques et barre au plafond pour le grappin. La salle bonus s'ouvre avec trois symboles : un sur un pilier en face (à l'arc), un sur le mur d'une petite salle à droite, un sur une corniche au-dessus de l'entrée (planeur depuis un brasero, grappin, mur d'escalade).",
            "**Caveau de la Fermière** : trois boutons. Traverser la lave, se méfier du piège électrique (deux contacts peuvent tuer), deux grappins, un trou dans le mur, la cour extérieure puis une porte ouverte de l'autre côté du bâtiment."
          ] }
        ] },
        { titre: "Spire de Veilwater Basin", blocs: [
          { ul: [
            "Accès par l'échafaudage sur le côté ou par un portail à la base.",
            "**Salle des leviers** : activez ceux dont le conduit est en **cuivre**, désactivez ceux en **brique** (trois et trois).",
            "Plus haut, une plaque fait monter des pièges, puis un bassin profond cache une poche d'air et un bouton au fond."
          ] }
        ] },
        { titre: "Ville portuaire du phare (bloc « tapis rouge »)", blocs: [
          { ul: [
            "Posez un autel au phare.",
            "Quatre boutons dans la ville ; le dernier se repère depuis le phare, il brille en contrebas.",
            "Récompenses : une tenue de capitaine, un coffre derrière le phare et un coffre d'or à creuser dans la salle finale. L'entrée peut aussi se casser à la pioche."
          ] }
        ] },
        { titre: "Les Ancient Spires", blocs: [
          { p: "La quête des Spires (donnée par le forgeron après le premier puits, grappin requis) fait monter chaque tour : un bouton par étage ouvre un coffre d'argent, et au troisième étage deux boutons (pics puis fosse de lave) ouvrent une porte à double verrou avec un coffre d'or. Cassez tous les pots : ils contiennent des matériaux et se régénèrent." }
        ] },
        { titre: "À vérifier", blocs: [
          { verifier: "Solutions tirées de vidéos d'avant la 1.0 (sauf la confirmation du caveau de la Chasseuse). Le chemin vers le premier bouton de Mistbury a déjà changé une fois. Nous referons ces salles en jeu avec nos propres captures." }
        ] }
      ],
      sources: ["v-mistbury", "v-suntemple", "bisect-hunter", "v-farmervault", "v-veilspire", "v-port", "v-spires", "gamerguides-tips"]
    },
    {
      id: "hollow-halls", cat: "donjons", icone: "skull", titre: "Hollow Halls",
      resume: "Les grands donjons de morts-vivants : ordre, clés, barrières et préparation.",
      niveau: "Niveaux 10 à 45", version: "pré-1.0 + 1.0",
      sections: [
        { titre: "L'essentiel", blocs: [
          { ul: [
            "Grands donjons de morts-vivants (Hollow), **à finir en une seule session** : les quitter les réinitialise. Comptez 1 à 3 heures.",
            "Débloqués par la quête de l'alchimiste ; ordre : Springlands → Revelwood → Nomad Highlands → Kindlewastes, **puis Albaneve Summits et Veilwater Basin en 1.0**.",
            "La **clé** de chaque Hall se fabrique chez le Collectionneur (Aiden Crowley) avec l'Ectoplasm et les Giant Bones du Hall précédent."
          ] },
          { carte: { fond: "monde", alt: "Carte des six Hollow Halls, numérotés dans l'ordre conseillé",
            legende: "Les six Hollow Halls, dans l'ordre où on les fait.",
            points: [
              ["HollowHalls-Springlands", "Springlands"],
              ["HollowHalls-Revelwood", "Revelwood"],
              ["HollowHalls-NomadHighlands", "Nomad Highlands"],
              ["HollowHalls-Kindlewastes", "Kindlewastes"],
              ["HollowHalls-AlbaneveSummits", "Albaneve Summits (1.0)"],
              ["HollowHalls-VeilwaterBasin", "Veilwater Basin (1.0)"]
            ] } }
        ] },
        { titre: "Les barrières turquoise", blocs: [
          { p: "Les portes sont fermées par des barrières qui tombent quand on ramasse des **runes**, soit flottantes, soit portées par des ennemis. Si vous êtes bloqué : regardez en hauteur." }
        ] },
        { titre: "Préparation", blocs: [
          { ul: [
            "Beaucoup de nourriture et de potions, plusieurs feux de camp à poser.",
            "Gardez la clé du Hall suivant sur vous.",
            "Entraînez-vous au planeur : beaucoup de passages se font en vol.",
            "Contre le **Hollow Cyclops** : armes contondantes (150 %) ou feu (120 %).",
            "Pour celui de Veilwater, prévoyez de quoi respirer sous l'eau."
          ] },
          { p: "Récompenses : armes spécialisées contre les Hollow, recettes de nourriture du Collectionneur, blocs de construction." }
        ] }
      ],
      sources: ["techraptor-hollow", "pd-bosses", "guided-changelog", "v-chiselchip-50h"]
    },
    {
      id: "donjons-balises", cat: "donjons", icone: "layers", titre: "Cinder's Cradle et les six donjons-balises",
      resume: "Comment entrer dans la région de la 1.0 et à quoi s'attendre dans chacun des six donjons obligatoires.",
      niveau: "Niveaux 45 à 50", version: "1.0",
      sections: [
        { titre: "Entrer dans Cinder's Cradle", blocs: [
          { ul: [
            "Région volcanique au nord, entre Albaneve et Veilwater, environ 7,5 km² d'ennemis de niveau 46 à 50, sans pluie.",
            "Elle s'ouvre avec le **palier de Flamme 10**. Voir [La Flamme pas à pas](#guides/flamme-paliers).",
            "Sur place, **Loraine Crim** (Cinder's Ascent) lance la suite : finir six donjons, un par ancienne région."
          ] }
        ] },
        { titre: "Les six donjons", blocs: [
          { table: { tete: ["Région d'origine", "Ce qui vous attend"], lignes: [
            ["Springlands", "Un musée gardé par des lasers violets et une alarme, à réinitialiser avec des Sparks"],
            ["Revelwood", "Un planétarium : orienter des télescopes d'après une note"],
            ["Nomad Highlands", "Une usine, du parkour et un mini-boss araignée"],
            ["Kindlewastes", "Beaucoup de Shroud, plus d'énigmes que de combats"],
            ["Albaneve", "Le plus dur : résistance au froid et seconde araignée"],
            ["Veilwater", "De la nage et trois salles à boutons : casque de plongée et palmes"]
          ] } },
          { p: "Chaque donjon ouvre aussi des portes scellées dans les anciennes régions et un raccourci de voyage rapide. Une fois les six faits, un téléporteur mène aux îles flottantes et à Vorgoth." },
          { attention: "**Emportez beaucoup de Sparks** : elles ouvrent des sections et réinitialisent les alarmes." },
          { verifier: "Détail des donjons d'après une seule vidéo longue ; ordre conseillé, boss et énigmes précises à documenter en jeu." }
        ] },
        { titre: "Les constructs des Anciens", blocs: [
          { ul: [
            "Nouvelle faction de robots : araignées en essaim, lance-flammes, foreuses, lance-missiles et versions à bouclier.",
            "**Faibles à la glace et aux coups contondants.** Les boucliers cèdent aux attaques spéciales et aux sorts de zone.",
            "Ils lâchent de la Moonstone, utile à l'équipement et aux nouveaux blocs."
          ] }
        ] },
        { titre: "Ressources de la région", blocs: [
          { p: "Exclusifs : Magma Gel, Aurora Beans, Prickle Pearl, Bloomheart Fruit. On y trouve aussi le Celestium (site minier dédié), de l'or et du fer, et des plantes de nuit." }
        ] }
      ],
      liens: [["Vorgoth", "#guides/vorgoth"]],
      sources: ["v-chiselchip-50h", "v-seigneur-10", "ens-tools-cc", "ens-tools-10", "whisper-vorgoth"]
    },

    // ═══════════════ CONSTRUCTION ET BASE ═══════════════
    {
      id: "base", cat: "construction", icone: "home", titre: "Choisir et monter sa base",
      resume: "Où s'installer, comment récupérer les blocs des villages, et les astuces de terrain que les bâtisseurs utilisent.",
      niveau: "Tous niveaux", version: "1.0",
      sections: [
        { titre: "Les règles de l'autel", blocs: [
          { ul: [
            "Tout part de l'**autel de la Flamme** : il fixe la zone constructible, sert de point de voyage rapide et de réapparition.",
            "Dans la zone, tout est permanent ; en dehors, le terrain se reforme avec le temps.",
            "La zone s'agrandit avec des Shroud Cores (voir l'onglet [Construction](#construction/autel))."
          ] }
        ] },
        { titre: "Où s'installer", blocs: [
          { ul: [
            "Critères : de l'eau proche, du terrain plat, des ressources et un retour rapide.",
            "**Harvest Homestead** (nord-ouest du départ) est cité partout : maison de trois étages avec cave déjà construite, beaucoup de confort sans rien poser, champs fertiles, puits, abeilles et point de pêche.",
            "Sans envie de construire : la maison ouverte de **Longkeep** a déjà cuisine, feu, lit abrité et puits.",
            "Ne sur-investissez pas la première base : la principale se fera près des ressources avancées, avec des autels relais ailleurs."
          ] }
        ] },
        { titre: "Astuces de bâtisseur", blocs: [
          { ul: [
            "**Récupérer un village** : nettoyez le camp, posez un autel, puis posez et retirez des fondations qui empiètent sur les bâtiments : vous récupérez tous les blocs et débloquez leurs recettes.",
            "**Creuser ou aplanir sans pioche** : posez le grand bloc de fondation de 4 m (aimantation coupée), puis retirez-le : il emporte le terrain et laisse un trou carré. Répétez pour une cave.",
            "**Surélever l'autel** : posez une fondation à la hauteur voulue, ramassez l'autel puis reposez-le dessus. Vous avez une trentaine de minutes avant que la zone ne disparaisse.",
            "**Plafonds de 4 m** plutôt que fondations pour les sols : bien moins chers.",
            "Le bouton **Annuler** reprend les 4 dernières actions.",
            "**Airborne Architect** (centre de l'arbre, 1.0) permet de voler librement pour construire dans sa base."
          ] },
          { astuce: "Pour un beau rendu : fondation sur deux niveaux en retrait, double mur avec un vide d'un bloc (fenêtres profondes, éclairage caché), pierre pour la structure et bois pour les murs." }
        ] },
        { titre: "Nouveaux blocs de la 1.0", blocs: [
          { table: { tete: ["Bloc", "Comment l'obtenir"], lignes: [
            ["Ancient Stone", "Établi : Moonstone (lâchée par les constructs) + basalte"],
            ["Weathered Ancient Stone", "Coffre du Lost Ancient Temple derrière le grand arbre de Blackmire"],
            ["Ancient Circles", "Coffre du site minier de Celestium (Cinder's Cradle)"],
            ["Ancient Dungeon", "En minant du basalte"],
            ["Ancient Beacon", "Coffre de l'Island Ruin, îles flottantes"],
            ["Ancient Gold", "Dans la Citadelle, sur la plus haute île"]
          ] } }
        ] }
      ],
      liens: [["Idées de bâtiments pas à pas", "#construction/batiments"], ["Blocs", "#construction/blocs"], ["Emplacements", "#construction/emplacements"]],
      sources: ["xgs-base", "htm-mistakes", "v-fervor-start", "v-chaosbear-lieux", "v-chaosbear-astuces", "v-hishers-build", "v-caffeinated-style", "v-p4wny-base", "v-chiselchip-blocs"]
    },
    {
      id: "confort", cat: "construction", icone: "heart", titre: "Confort, repos et nourriture",
      resume: "Le bonus Reposé, comment monter son confort, et quoi manger avant de partir.",
      niveau: "Tous niveaux", version: "1.0",
      sections: [
        { titre: "Le bonus Reposé", blocs: [
          { p: "Il augmente l'endurance maximale et sa récupération. Pour l'obtenir : être à l'abri (toit et murs), près d'une source de chaleur, sans ennemi proche, assis ou couché, dans une pièce avec des objets de confort." },
          { ul: [
            "Chaque point de confort ajoute environ **une minute** de bonus.",
            "**Seul le meilleur objet de chaque catégorie compte** : deux chaises valent une chaise. Variez les meubles plutôt que de les multiplier.",
            "Compétence centrale **Well Rested** : +2 min par rang. Jouer d'un instrument avant de partir en ajoute aussi.",
            "Hors de la base, s'asseoir près d'un feu en redonne un peu."
          ] },
          { astuce: "Dans le menu de construction, une touche affiche le bonus de confort d'un objet. Certains gardent une pièce « réserve de confort » où ils regroupent un exemplaire de chaque catégorie." }
        ] },
        { titre: "Manger", blocs: [
          { ul: [
            "La nourriture **ne soigne pas** : elle donne des bonus durables. Trois emplacements au départ, un plat de chaque type actif à la fois.",
            "Repères : viande → vie, légumes → dextérité, céréales → force, champignons → magie. L'eau de puits augmente l'endurance.",
            "Prenez toujours **trois types différents** avant une sortie difficile.",
            "**Desert Stomach** ajoute un emplacement, **Last Meal** garde les bonus à la mort."
          ] },
          { verifier: "Correspondances type de plat → bonus d'après les vidéos ; à confirmer sur les fiches en jeu." }
        ] },
        { titre: "Petits bonus faciles", blocs: [
          { ul: [
            "Caresser son chat ou son chien : +25 PV pendant 30 minutes.",
            "Visiter un sanctuaire de runes : petit bonus.",
            "Ne pas rester mouillé : gros malus d'endurance."
          ] }
        ] }
      ],
      liens: [["Autel et confort (valeurs)", "#construction/autel"]],
      sources: ["xgs-base", "htm-mistakes", "allthings-center", "v-annarf", "v-sirjay", "holy-taming"]
    },
    {
      id: "ferme", cat: "construction", icone: "leaf", titre: "Ferme, eau et animaux",
      resume: "Terre fertile infinie, lits de semis, potions à volonté, puits et élevage.",
      niveau: "Niveaux 5 à 30", version: "1.0 (élevage pré-1.0)",
      sections: [
        { titre: "Terre fertile", blocs: [
          { ul: [
            "Inutile de la fabriquer : creusez-la à la pioche dans les champs de **Harvest Homestead** ou de **Woodguard**.",
            "**Un seul bloc suffit** : le râteau l'étale sans limite. Gardez un carré de côté pour en reprendre.",
            "Si elle ne s'étale pas, posez des fondations plutôt que des plafonds en dessous.",
            "Terre fertile = pousse deux fois plus rapide ; la terre fertilisée (nitrates) va encore plus vite."
          ] }
        ] },
        { titre: "Planter", blocs: [
          { ul: [
            "Ramasser une plante sauvage pour la première fois débloque sa graine.",
            "Le **lit de semis** transforme une plante, de l'eau et de la farine d'os en plusieurs plants.",
            "Maintenez le bouton pour planter en marchant. La durée de pousse se règle dans les paramètres du monde."
          ] },
          { astuce: "Potions à volonté : plantez des Penny Bun et des baies près de l'alchimiste, réglé à 0 m de déplacement à côté du champ." }
        ] },
        { titre: "L'eau", blocs: [
          { ul: [
            "Les puits des villages (Longkeep, Rookmore…) se rechargent seuls.",
            "Le **puits** du charpentier donne de l'eau illimitée à la base ; sa version améliorée demande du grès des Kindlewastes et des barres de fer.",
            "L'eau sert en cuisine et en alchimie."
          ] },
          { verifier: "Recettes des puits relevées avant la 1.0." }
        ] },
        { titre: "Animaux", blocs: [
          { ol: [
            "Quête de la fermière sur l'élevage, puis appâts à fabriquer chez elle.",
            "Il faut un toit, une mangeoire, des coussins et de la nourriture.",
            "Approchez accroupi, posez l'appât, attendez, puis caressez l'animal pendant qu'il mange. Un « ? » veut dire stop, un « ! » qu'il s'enfuit.",
            "Pour la reproduction : deux animaux de la même espèce et un lit chacun, plus un pour le petit."
          ] },
          { p: "Le chat et le chien s'obtiennent par des quêtes de l'alchimiste et de la chasseuse." }
        ] }
      ],
      sources: ["v-p4wny-ferme", "v-p4wny-potions", "v-smartceltic", "techraptor-water", "holy-taming"]
    },
    {
      id: "sparkworks", cat: "construction", icone: "bolt", titre: "Sparkworks : premiers pas",
      resume: "Le système de mécanismes de la 1.0 : comment le débloquer et avec quelles pièces construire portes, pièges et énigmes.",
      niveau: "Dès Revelwood", version: "1.0",
      sections: [
        { titre: "Le débloquer", blocs: [
          { ol: [
            "Avoir le **charpentier** installé à l'abri.",
            "Suivre sa quête **Contraptions and Mechanisms**.",
            "Récupérer le **Sparkworks Tool** dans un coffre du **Trapped Night Sanctum** (Revelwood).",
            "Fabriquer le **Sparkworks Workbench**."
          ] },
          { p: "L'outil ne sert qu'à modifier les circuits : les mécanismes fonctionnent sans." },
          { verifier: "Certaines vidéos parlent d'un « Knight's Sanctum » à Revelwood : sans doute le même lieu. Emplacement exact à confirmer." }
        ] },
        { titre: "Les pièces", blocs: [
          { table: { tete: ["Type", "Exemples"], lignes: [
            ["Entrées", "Leviers, boutons, plaques de pression, zones de déclenchement"],
            ["Sorties", "Portes, trappes, pièges, apparition d'ennemis, feux d'artifice"],
            ["Logique", "Portes NOT et OR, minuteries"]
          ] } },
          { p: "Les liaisons se font dans un éditeur en graphe 2D ; les boîtiers de jonction se renomment pour s'y retrouver." }
        ] },
        { titre: "Idées pour commencer", blocs: [
          { ul: [
            "Une porte de base qui s'ouvre avec une plaque de pression.",
            "Un couloir piégé déclenché par une zone.",
            "Une énigme à deux leviers reliés par une porte OR, puis par une porte NOT pour corser le tout.",
            "Partagez ensuite votre monde avec **Adventure Sharing** pour faire jouer vos donjons."
          ] }
        ] }
      ],
      sources: ["games-gg-sparkworks", "v-chiselchip-50h", "pcgames-review"]
    }
  ]
};
