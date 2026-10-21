// Lieux, régions, blocs, atouts, quêtes, matériaux : anglais → français (traductions du site, non officielles).
// Les noms propres sans sens descriptif (Woodgard, Netherton, Cromville…) restent tels quels.
// Les noms composés du wiki « Type - Lieu » sont traduits morceau par morceau (i18n.js).

export const LIEUX = {
  // Régions et zones
  "Blackmire": "Noirmarais", "Cinder's Cradle": "Berceau des Cendres", "Embervale": "Embervale",
  // Types de lieux (légende de la carte)
  "Flame Shrine": "Sanctuaire de la Flamme", "Sun Temple": "Temple du Soleil", "Night Sanctum": "Sanctuaire nocturne", "Ancient Vault": "Caveau ancien",
  "Elixir Well": "Puits d'élixir", "Elixir Well.": "Puits d'élixir", "Shroud Root": "Racine du Voile", "Balefire": "Feu de Bale", "Gem Forge": "Forge à gemmes",
  "Village": "Village", "Camp": "Camp", "Farm": "Ferme", "Mine": "Mine", "Enemy Camp": "Camp ennemi", "Shroud Lair": "Repaire du Voile",
  "Misc. Dungeon": "Autre donjon", "Hidden Tomb": "Tombe cachée", "Cave Passage": "Passage souterrain", "Fossil": "Fossile", "Music Sheet": "Partition",
  "Queen Pikemead Statue Piece": "Fragment de statue de la reine Pikemead", "Alchemist's Wall Hanging": "Tenture de l'alchimiste", "Cyclops Skeleton": "Squelette de cyclope",
  "Wall Tapestry": "Tapisserie murale", "Dragon's Map Piece": "Fragment de carte du dragon", "Drak Relief": "Relief drak",
  // Lieux nommés (parties des noms de marqueurs)
  "Flame Sanctum": "Sanctuaire de la Flamme", "Flame Shrine of Manathor": "Sanctuaire de la Flamme de Manathor", "Haunted Sun Temple": "Temple du Soleil hanté",
  "Haunted Sun Temple Entrance": "Entrée du Temple du Soleil hanté", "Elder's Night Sanctum": "Sanctuaire nocturne de l'Ancien", "Cinder Vault": "Caveau des Cendres",
  "Blacksmith": "Forgeron", "Alchemist": "Alchimiste", "Hunter": "Chasseuse", "Carpenter": "Menuisier", "Farmer": "Fermière",
  "Sunken Ancient City": "Cité ancienne engloutie", "Spooky Grave": "Tombe sinistre", "Forgotten Tomb": "Tombe oubliée", "Forgotten Temple": "Temple oublié",
  "Snapjaw Tar Pits": "Fosses de goudron des Claque-mâchoires", "Ring of Rot": "Cercle de pourriture", "Sleeping Sands": "Sables endormis", "Shrouded Camp": "Camp voilé",
  "Low Tide": "Marée basse", "The Grim": "Le Sinistre", "Jasper Isles": "Îles de Jaspe", "Smothering Pit": "Fosse étouffante", "Fox Chase": "Chasse au renard",
  "Ridgeback Mine": "Mine de la Crête", "Gateway Outpost \"Celeste\"": "Avant-poste « Céleste »", "Balefire Garrison \"Silkfrost\"": "Garnison de Bale « Givre-de-soie »",
  "Balefire Garrison \"Rimerock\"": "Garnison de Bale « Roche-givre »", "Balefire Stronghold \"Lance Point\"": "Bastion de Bale « Pointe de lance »",
  "Balefire Stronghold \"Iron Heart\"": "Bastion de Bale « Cœur de fer »", "Balefire Garrison \"Wind Ward\"": "Garnison de Bale « Garde-vent »",
  "Balefire Tower \"1000 Miles\"": "Tour de Bale « 1000 lieues »", "Balefire Garrison \"White Pine\"": "Garnison de Bale « Pin blanc »", "Everfrore Keep": "Donjon d'Everfrore",
  "Springlands Hollow Halls": "Salles creuses des Hautes pâtures", "Revelwood Hollow Halls": "Salles creuses des Bois envoûtés",
  "Nomad Highlands Hollow Halls": "Salles creuses des Plateaux nomades", "Kindlewastes Hollow Halls": "Salles creuses des Regs exaltés",
  "Albaneve Summits Hollow Halls": "Salles creuses des Sommets de l'Albaneve", "Veilwater Basin Hollow Halls": "Salles creuses du Bassin des eaux voilées",
  "Saline Springs": "Sources salines", "Moth's Grove": "Bosquet des Phalènes", "Hillock": "Butte", "Lone Thistle": "Chardon solitaire", "Willow Crush": "Saule broyé",
  "\"Blue Goblet\" Tavern": "Taverne « Au Gobelet bleu »", "Glenwood's End": "Fin de Glenwood", "Gloomsbury Keep": "Donjon de Gloomsbury", "Tower Ruin": "Tour en ruine",
  "Hermit Camp": "Camp de l'ermite", "White Wind": "Vent blanc", "Pikemead's Reach": "Domaine de Pikemead", "Ancient Passage": "Passage ancien", "Fish Farm": "Pisciculture",
  "Surat's Rest": "Repos de Surat", "East Lapis": "Lapis Est", "Sapphire Strand": "Grève de saphir", "Shorewatch": "Guet-du-rivage", "Polaris Falls": "Chutes de Polaris",
  "New Cromville": "Nouvelle Cromville", "Riverreach": "Bord-de-rivière", "Driftwood Wake": "Sillage de bois flotté", "Tavern \"Ol' Salt 'N Pepper\"": "Taverne « Au Vieux Sel et Poivre »",
  "Cargo Lift": "Monte-charge", "Miner's House": "Maison du mineur", "Goldrock Saddle": "Col de Roche-d'or", "Cromville Throneroom": "Salle du trône de Cromville",
  "Stillwater Bay": "Baie des Eaux calmes", "Lighthouse": "Phare", "Small Tollhouse": "Petit poste de péage", "Queen Jezmina's Camp": "Camp de la reine Jezmina",
  "Carpentry Camp": "Camp de menuiserie", "Southern Caravan Camp": "Camp de caravane du Sud", "Abandoned Hunter Camp": "Camp de chasseurs abandonné",
  "Northern Caravan Camp": "Camp de caravane du Nord", "Research Camp": "Camp de recherche", "Conway Camp": "Camp Conway", "Lover's Hideaway": "Refuge des amants",
  "Eldermere Dam Excavation Camp": "Camp de fouilles du barrage d'Eldermere", "Hunting Party Camp": "Camp de la partie de chasse", "Caravan Camp": "Camp de caravane",
  "\"Far Away Fray\" Tavern": "Taverne « Fray le Lointain »", "Obelisk Excavation Camp": "Camp de fouilles de l'obélisque", "Boneshard Excavation Camp": "Camp de fouilles d'Éclat-d'os",
  "Weaver's Cottage": "Chaumière du tisserand", "Skeleton Excavation Camp \"Ony\"": "Camp de fouilles du squelette « Ony »", "Skeleton Excavation Camp \"Mae\"": "Camp de fouilles du squelette « Mae »",
  "Giant Skeleton \"Polaris\"": "Squelette géant « Polaris »", "Giant Skeleton \"Orpheus\"": "Squelette géant « Orphée »", "Hermit Lodgings": "Logis de l'ermite",
  "Ol' Captain's Rest": "Repos du vieux capitaine", "Old Hag's Hut": "Hutte de la vieille sorcière", "Shipwrecks": "Épaves", "Soldier Encampment": "Campement de soldats",
  "Veilwater Basin Outlook": "Belvédère du Bassin des eaux voilées", "Peaceful Acres": "Arpents paisibles", "Harvest Homestead": "Ferme des moissons", "Fenrig's Farm": "Ferme de Fenrig",
  "Wistful Fields": "Champs mélancoliques", "Gloomberry Fields": "Champs de baies sombres", "Lush Pasture": "Pâturage luxuriant", "Cloverbrooke Farm": "Ferme de Cloverbrooke",
  "Mayfair Lot": "Terrain de Mayfair", "Fanning Ranch": "Ranch Fanning", "Bounty Barn": "Grange de l'abondance", "Sunsimmer Souterrain": "Souterrain de Sunsimmer",
  "Rose Shell Burrow": "Terrier de la coquille rose", "Wickmouth Goat Farm": "Chèvrerie de Wickmouth", "Fairfield Goat Farm": "Chèvrerie de Fairfield", "Vinebrook Farm": "Ferme de Vinebrook",
  "Pretty Patty's Pumpkin Farm": "Ferme à citrouilles de la jolie Patty", "Pumpkin Patch": "Champ de citrouilles", "Little Rock Goat Farm": "Chèvrerie du Petit Rocher",
  "Enshrouded Goat Farm": "Chèvrerie voilée", "Grassy Pasture Goat Farm": "Chèvrerie des Prés verts", "Winter's Brew Farm": "Ferme du Breuvage d'hiver", "Dewdrop Farm": "Ferme de la Rosée",
  "Fishing Island": "Île de pêche", "Capybara Oasis": "Oasis des capybaras", "Saline Quarry": "Carrière saline", "Small Flint Mine": "Petite mine de silex",
  "Egerton Salt Mines": "Mines de sel d'Egerton", "Mark of Sameth": "Marque de Sameth", "Glimmer Rock Mine": "Mine de Roche-lueur", "Mining Rift": "Faille minière",
  "Ternion Mine": "Mine de Ternion", "Camellia Lake Marble Quarry": "Carrière de marbre du lac Camélia", "Fletcher Marble Quarry": "Carrière de marbre de Fletcher",
  "Obsidian Mine": "Mine d'obsidienne", "Aquamarine Mine": "Mine d'aigue-marine", "Scavenger Camp with Mine Shaft": "Camp de pillards avec puits de mine",
  "Scavenger Stash": "Cache des pillards", "Critter Nest": "Nid de bestioles", "Hill of Scavengers": "Colline des pillards", "Withered Encampment": "Campement flétri",
  "Vukah Ceremony Hill": "Colline cérémonielle vukah", "Sacrificial Vukah Pit": "Fosse sacrificielle vukah", "Fawnsong Frontier": "Frontière du Chant-des-faons",
  "Trade Outpost \"Old Rye\"": "Comptoir « Vieux Seigle »", "Treetop Vukah Settlement": "Village vukah des cimes", "Ancient Bridge": "Pont ancien",
  "\"Maelstrom\" Construction Site": "Chantier « Maelström »", "Traveller's Watch": "Guet du voyageur", "The Pike": "La Pique", "Scavenger Ruins": "Ruines des pillards",
  "Myrtle Tombs": "Tombes de Myrtle", "Vukah Arena": "Arène vukah", "Trade Outpost \"Blazing Rock\"": "Comptoir « Roche ardente »", "Rat Infested Outpost": "Avant-poste infesté de rats",
  "Vukah Camp": "Camp vukah", "Vukah Outpost": "Avant-poste vukah", "Abandoned Watchtower": "Tour de guet abandonnée", "Cradle of Dusk": "Berceau du crépuscule",
  "Scavenger Outpost": "Avant-poste des pillards", "Abandoned Outpost": "Avant-poste abandonné", "Lupa's Lair": "Repaire de Lupa", "Ruined Bridge": "Pont en ruine",
  "Trade Outpost \"Nomad's Drop\"": "Comptoir « Halte du nomade »", "Smuggler Camp": "Camp de contrebandiers", "Deepcut": "Entaille profonde", "Draconian Vulture Nest": "Nid de vautours draconiques",
  "Vukah Sacrifice Hill": "Colline sacrificielle vukah", "Vukah Canyon": "Canyon vukah", "Ocean's Heart": "Cœur de l'océan", "Scatterbone": "Os-épars",
  "Forsaken Lighthouse": "Phare abandonné", "Small Watchtower": "Petite tour de guet", "Elixir Production Site": "Site de production d'élixir",
  "Gateway Outpost \"Drifa\"": "Avant-poste « Drifa »", "Gateway Outpost \"Bora\"": "Avant-poste « Bora »", "Forge Of Obsidia": "Forge d'Obsidia", "Gateway Outpost \"Alba\"": "Avant-poste « Alba »",
  "Quiet Caves": "Grottes silencieuses", "Cyclops Cave": "Grotte du cyclope", "Cyclops Cave Passage": "Passage de la grotte du cyclope", "Gateway Outpost \"Darkwater\"": "Avant-poste « Eaux-sombres »",
  "Historic Battleground": "Champ de bataille historique", "Drak'Dal Ruin": "Ruine Drak'Dal", "Scavenger Camp": "Camp de pillards", "Snapjaw Ruin": "Ruine des Claque-mâchoires",
  "Drak'Dal Camp": "Camp Drak'Dal", "Small Drak'Dal Outpost": "Petit avant-poste Drak'Dal", "Capybara Hunting Drak'Dal Camp": "Camp drak'dal de chasse aux capybaras",
  "Suspicious Drak'Dal Ruin": "Ruine drak'dal suspecte", "Enshrouded Drak'Dal Outpost": "Avant-poste drak'dal voilé", "Gateway Outpost \"Endflame\"": "Avant-poste « Fin-de-flamme »",
  "Smuggler's Hideout": "Planque des contrebandiers", "Mistbury Catacombs": "Catacombes de Mistbury", "Temple Ruin": "Temple en ruine", "Necropolis": "Nécropole",
  "Bramblespine Boneyard": "Ossuaire d'Échine-de-ronce", "Catacombs": "Catacombes", "Obscura Catacombs": "Catacombes d'Obscura", "Gate to the Pillars of Creation": "Porte des Piliers de la Création",
  "Raven's Keep": "Donjon du Corbeau", "Ouroboros Temple": "Temple d'Ouroboros", "Hidden Temple": "Temple caché", "Drak'Dal Temple": "Temple Drak'Dal", "Hidden Tomb Entry": "Entrée de la tombe cachée",
  "Hidden Hollow Tomb": "Tombe creuse cachée", "Wolf Cave": "Grotte du loup", "Grind Teeth Grotto": "Grotte des Grince-dents", "Cave": "Grotte", "Lumenlight Cave": "Grotte de Lumenlight",
  "Vukah Cave Passage": "Passage de la grotte vukah", "Skimmer's Cove": "Crique des écumeurs", "Dragon Cave": "Grotte du dragon", "The Pit": "La Fosse",
  "Passage to the Veilwater Basin": "Passage vers le Bassin des eaux voilées", "I Can't Stay Here": "Je ne peux pas rester ici",
  "Ammonite Imprint": "Empreinte d'ammonite", "Big Ammonite Fossil": "Grand fossile d'ammonite", "Elevated Sea Urchin": "Oursin surélevé", "Round Sea Urchin": "Oursin rond",
  "Sea Urchin Cluster": "Amas d'oursins", "Gastropods": "Gastéropodes", "Single Gastropod": "Gastéropode isolé", "Trilobite Imprint": "Empreinte de trilobite", "Trilobites": "Trilobites",
  "Dull Shark Tooth": "Dent de requin émoussée", "Larger Sea Lily Fossil": "Grand fossile de lys de mer", "Sharp Shark Tooth": "Dent de requin acérée", "Smaller Sea Lily Fossil": "Petit fossile de lys de mer",
  "Crab Fossil": "Fossile de crabe", "Fish Fossil": "Fossile de poisson", "Prawn Fossil": "Fossile de crevette",
  "Fleeting Memory": "Souvenir fugace", "Cup Runneth Over": "La coupe déborde", "Of Daggers And Wine": "De dagues et de vin", "Moon Over The Well": "Lune sur le puits",
  "By The Riverside": "Au bord de la rivière", "Satin Strings": "Cordes de satin", "Blood In The Snow": "Du sang dans la neige", "Silent Echo": "Écho silencieux",
  "Market On Winter's Day": "Marché d'un jour d'hiver", "Lonely At The Top": "Seul au sommet", "Mirage": "Mirage",
  "Queen Pikemead Statue Piece (Arm)": "Fragment de statue de la reine Pikemead (bras)", "Queen Pikemead Statue Piece (Base)": "Fragment de statue de la reine Pikemead (socle)",
  "Queen Pikemead Statue Piece (Torso)": "Fragment de statue de la reine Pikemead (torse)", "Ripped Alchemist's Wall Hanging (Left)": "Tenture déchirée de l'alchimiste (gauche)",
  "Ripped Alchemist's Wall Hanging (Right)": "Tenture déchirée de l'alchimiste (droite)", "Cyclops Skull": "Crâne de cyclope", "Cyclops Torso": "Torse de cyclope",
  "Cyclops Pelvis": "Bassin de cyclope", "Left Cyclops Arm": "Bras gauche de cyclope", "Right Cyclops Arm": "Bras droit de cyclope", "Left Cyclops Leg": "Jambe gauche de cyclope",
  "Right Cyclops Leg": "Jambe droite de cyclope", "Wall Tapestry (Left)": "Tapisserie murale (gauche)", "Wall Tapestry (Right)": "Tapisserie murale (droite)",
  "Mae's Map Piece": "Fragment de carte de Mae", "Ony's Map Piece": "Fragment de carte d'Ony", "Orpheus' Map Piece": "Fragment de carte d'Orphée", "Polaris' Map Piece": "Fragment de carte de Polaris",
  "Drak Relief I": "Relief drak I", "Drak Relief II": "Relief drak II", "Drak Relief III": "Relief drak III", "Drak Relief IV": "Relief drak IV", "Drak Relief V": "Relief drak V",
  "Drak Relief VI": "Relief drak VI", "Drak Relief VII": "Relief drak VII",
  // Noms cités dans les guides
  "Forge of Obsidia": "Forge d'Obsidia", "Broken Guard of the North Crown": "Couronne brisée de la garde du Nord", "Champion of the Shroud": "Champion du Voile",
  "Guard of the North": "Garde du Nord", "Contraptions and Mechanisms": "Engins et mécanismes", "This is the Way": "C'est la voie"
};

export const COMPETENCES = {
  "Airborne Architect": "Architecte aérien", "One-Handed Specialization": "Spécialisation à une main", "Puncture": "Perforation", "Barrage": "Barrage",
  "Survival Instinct": "Instinct de survie", "Fatal Precision": "Précision fatale", "Advanced Necromancy": "Nécromancie avancée", "Totem Mastery": "Maîtrise des totems",
  "Mana Currents": "Courants de mana", "Spellslinger": "Lanceur de sorts", "Aerial Wand Attack": "Attaque aérienne à la baguette", "Wand Evasion Attack": "Attaque d'évasion à la baguette",
  "Blast and Cast": "Explosion et incantation", "Wand Specialization": "Spécialisation baguette", "Arcane Proliferation": "Prolifération arcanique"
};

export const BLOCS = {
  "Rough Wood Block": "Bloc de bois brut", "Shroud Wood Block": "Bloc de bois du Voile", "Tarred Wood Block": "Bloc de bois goudronné", "Refined Wood Block": "Bloc de bois raffiné",
  "Ornate Wood Block": "Bloc de bois orné", "Palm Wood Block": "Bloc de bois de palmier", "Conifer Wood Block": "Bloc de bois de conifère", "Bamboo Wood Block": "Bloc de bambou",
  "Half-Timbered Block": "Bloc à colombages", "Brick-Timbered Block": "Bloc à colombages de briques", "Plaited Block": "Bloc tressé",
  "Half-timbered Shell Limestone Block": "Bloc à colombages en calcaire coquillier", "Rough Stone Block": "Bloc de pierre brute", "Rough Flintstone Block": "Bloc de silex brut",
  "Mycelium Overgrown Block": "Bloc envahi de mycélium", "Roughly Cut Stone Block": "Bloc de pierre grossièrement taillée", "Hollow Halls Block": "Bloc des Salles creuses",
  "Fired Bricks Block": "Bloc de briques cuites", "Weathered Stone Block": "Bloc de pierre patinée", "Citywall Block": "Bloc de rempart", "Temple Stones (Vukah Temple Stone)": "Pierres de temple (pierre de temple vukah)",
  "Castle Wall Stone Block": "Bloc de pierre de muraille", "Fancy Stone Block": "Bloc de pierre décorative", "Limestone Block": "Bloc de calcaire", "Mixed Sandstone Block": "Bloc de grès mélangé",
  "Regular Stone Block": "Bloc de pierre ordinaire", "Refined Stone Block": "Bloc de pierre raffinée", "Rough Sandstone Block": "Bloc de grès brut", "Regular Sandstone Block": "Bloc de grès ordinaire",
  "Refined Sandstone Block": "Bloc de grès raffiné", "Highly Polished Stone Block": "Bloc de pierre très polie", "Desert City Wall": "Rempart de cité du désert", "Desert Temple Block": "Bloc de temple du désert",
  "Well Block": "Bloc de puits", "Granite Block": "Bloc de granite", "Polished Granite Block": "Bloc de granite poli", "Castle Block": "Bloc de château", "Shell Limestone Block": "Bloc de calcaire coquillier",
  "Drak Temple Block": "Bloc de temple drak", "Ancient Stone Block": "Bloc de pierre ancienne", "Ancient Circles Block": "Bloc des cercles anciens", "Ancient Dungeon Block": "Bloc de donjon ancien",
  "Weathered Ancient Stone Block": "Bloc de pierre ancienne patinée", "Blue Luminescent Block": "Bloc luminescent bleu", "White Luminescent Block": "Bloc luminescent blanc",
  "Green Luminescent Block": "Bloc luminescent vert", "Yellow Luminescent Block": "Bloc luminescent jaune", "Ancient Beacon Block": "Bloc de balise ancienne", "Metal Block": "Bloc de métal",
  "Copper Block": "Bloc de cuivre", "Bronze Block": "Bloc de bronze", "Iron Block": "Bloc de fer", "Bone Block": "Bloc d'os", "Red Marble Block": "Bloc de marbre rouge",
  "Ectoplasm Block": "Bloc d'ectoplasme", "Midnight Tomb Block": "Bloc de tombe de minuit", "Obsidian Block": "Bloc d'obsidienne", "Starlight Block": "Bloc de lumière stellaire",
  "Red Carpet Block": "Bloc de tapis rouge", "Moonstone Block": "Bloc de pierre de lune", "Ancient Gold Block": "Bloc d'or ancien", "Plant Fiber Roof Block": "Bloc de toit en fibres végétales"
};

// Atouts d'objets (« Brutal ×2 » : le multiplicateur est ajouté à l'affichage)
export const ATOUTS = {
  "Blunt Damage": "Dégâts contondants", "Magic Ice Damage": "Dégâts magiques de glace", "Brutal": "Brutal", "Piercing Damage": "Dégâts perforants", "Renewal": "Renouveau",
  "Cutting Damage": "Dégâts tranchants", "Magic Fire Damage": "Dégâts magiques de feu", "Magic Shroud Damage": "Dégâts magiques du Voile", "Magic Shock Damage": "Dégâts magiques de foudre",
  "Vicious": "Vicieux", "Precise": "Précis", "Ruthless": "Impitoyable", "Poison Damage": "Dégâts de poison", "Health Leech": "Vol de vie", "Retaliation": "Représailles",
  "Stamina Leech": "Vol d'endurance", "Sacred": "Sacré", "Venomous Blades": "Lames venimeuses", "Opportunistic": "Opportuniste", "Merciless": "Sans pitié", "Stalking": "Traque",
  "Sneaky": "Sournois", "Mana Leech": "Vol de mana", "Reaping": "Moisson", "Headseeker": "Chercheur de tête", "Spiritual": "Spirituel", "Primal": "Primordial", "Vital": "Vital",
  "Dragon's Strength": "Force du dragon", "Scrounging": "Récupération", "Cleansing": "Purification"
};

export const QUETES = {
  "Diadwyn and its Building Blocks": "Diadwyn et ses blocs de construction", "Ruined Netherton": "Netherton en ruine", "A Rumble in the Catacombs": "Grondement dans les catacombes",
  "A Tower to the Stars": "Une tour vers les étoiles", "Fortification": "Fortification", "In Need of a Tanning Station": "Besoin d'un poste de tannage", "Caravan Raid": "Raid sur la caravane",
  "Mixed Stones": "Pierres mêlées", "Finding Masonry Tools": "À la recherche des outils de maçon", "Loom for the Hunter": "Un métier à tisser pour la chasseuse",
  "Emily Fray's Tavern": "La taverne d'Emily Fray", "Derelict Kindlewastes": "Regs exaltés à l'abandon", "Searching for Hidden Tombs": "À la recherche des tombes cachées"
};

// Objets de confort et éléments de construction cités par les guides
export const DIVERS = {
  "Gold Scavenger Matron Trophy": "Trophée de matrone pillarde dorée", "Ancient Bed / Chair / Stool / Bench / Small Ancient Table": "Lit / chaise / tabouret / banc / petite table anciens",
  "Granite Throne": "Trône de granite", "Maritime Shower / Bathtub / Toilet / Sink": "Douche / baignoire / toilettes / lavabo maritimes",
  "Ancient Temple Floor Brazier I / Ancient Wall Lamp": "Brasero de sol de temple ancien I / lampe murale ancienne", "Heart Pillow": "Coussin en cœur", "Carpet": "Tapis",
  "Small Chest": "Petit coffre", "Farm Soil": "Terre agricole", "4M Stone Shingle Roof": "Toit en bardeaux de pierre 4 m", "Seedbed": "Semis",
  "Water Dispenser (1 Metal Scraps + 3 Tin Bars)": "Distributeur d'eau (1 débris de métal + 3 lingots d'étain)", "Irrigation Gate": "Vanne d'irrigation",
  "Medium Chest (8 Nails, 10 Wood Planks, 2 Metal Sheets)": "Coffre moyen (8 clous, 10 planches, 2 plaques de métal)",
  "Huge Chest (16 Nails, 20 Wood Planks, 2 Iron Bars)": "Énorme coffre (16 clous, 20 planches, 2 lingots de fer)", "Shroud Core": "Noyau du Voile", "Goo": "Gelée",
  "Workbench": "Établi", "Kiln": "Four", "Forge": "Forge", "Alchemy Station": "Poste d'alchimie", "Meubles du Carpenter": "Meubles du menuisier",
  "Fireplace (pierre + bois, à l'établi)": "Cheminée (pierre + bois, à l'établi)", "Candle (éclairage 2)": "Bougie (éclairage 2)",
  "Throne Room Floor Lamp (éclairage 6)": "Lampadaire de salle du trône (éclairage 6)", "Fireplace": "Cheminée", "Standing Torch": "Torche sur pied",
  "Charcoal Kiln": "Four à charbon", "Tanning Station": "Poste de tannage", "Loom": "Métier à tisser", "Spinning Wheel": "Rouet"
};

// Matériaux des recettes de blocs (« 2 Wood Logs + 2 Tar » est traduit élément par élément)
export const MATERIAUX = {
  "Wood Logs": "bûches", "Shroud Wood": "bois du Voile", "Tar": "goudron", "Wood Planks": "planches", "Palm Wood Logs": "bûches de palmier", "Conifer Logs": "bûches de conifère",
  "Bamboo Logs": "tiges de bambou", "Lump of Clay": "motte d'argile", "Fired Bricks Block": "bloc de briques cuites", "Twigs": "brindilles", "Tropical Wood": "bois tropical",
  "Shell Limestone": "calcaire coquillier", "Stone": "pierre", "Flintstone": "silex", "Mycelium": "mycélium", "Rubble": "gravats", "Fired Brick": "briques cuites",
  "Revelwood Stone": "pierre des Bois envoûtés", "Revelwood Dirt": "terre des Bois envoûtés", "Blackmire Stone": "pierre de Noirmarais", "Blackmire Dirt": "terre de Noirmarais",
  "Nomad Highlands Dirt": "terre des Plateaux nomades", "Limestone": "calcaire", "Springlands Dirt": "terre des Hautes pâtures", "Sandstone": "grès", "Sand": "sable",
  "Indigo Plant": "indigotier", "Shroud Liquid": "liquide du Voile", "Granite": "granite", "Gold Bars": "lingots d'or", "Moonstone": "pierre de lune", "Basalt": "basalte",
  "Ancient Stone Block": "blocs de pierre ancienne", "Luminous Growth": "excroissance lumineuse", "White Glowing Substance": "substance blanche luminescente",
  "Purified Slime": "bave purifiée", "Glass": "verre", "Saffron": "safran", "Celestium Ore": "minerai de célestium", "Magma Gel": "gel de magma", "Cinder Rock": "roche de cendre",
  "Metal Sheets": "plaque de métal", "Copper Bar": "lingot de cuivre", "Bronze Bars": "lingot de bronze", "Iron Bars": "lingot de fer", "Bones": "os",
  "Red Marble Fragment": "fragments de marbre rouge", "Ectoplasm Shard": "éclats d'ectoplasme", "Obsidian": "obsidienne", "Silver Bars": "lingot d'argent", "Lapislazuli": "lapis-lazuli",
  "Red Fabric": "tissu rouge", "Paper Reed": "papyrus", "Sparkling Dust": "poussière scintillante", "bois": "bois"
};
