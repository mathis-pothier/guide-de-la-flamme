// Noms ajoutés par la collecte du wiki du 29/10/2026 : anglais → français (traductions du site, non officielles).
// Mêmes règles que objets-fr.mjs : PIECES2 et SETS2 complètent PIECES et SETS (« Blood Rose Boots » → « Bottes de rose de sang »).

export const PIECES2 = {
  Garb: "Tenue", Coat: "Manteau", Robe: "Robe", Mittens: "Moufles", Dress: "Robe", Diadem: "Diadème", Doublet: "Pourpoint", Overalls: "Salopette",
  Cloak: "Cape", Sandals: "Sandales", Headband: "Bandeau", Bangles: "Bracelets", "Cropped Top": "Haut court", "Mail Coif": "Camail", Chestplate: "Plastron"
};

export const SETS2 = {
  "Blood Rose": "de rose de sang", "Hollow's Eve": "de la veille des Creux", "Siren Seeker": "de chercheur de sirènes", "Fluffy": "en duvet",
  "Winterly": "d'hiver", "Lumberer": "de bûcheron", "Venerable Hollow": "du Creux vénérable", "Exclusive Hollow": "du Creux exclusif", "Artificer's": "d'artificier",
  "Summer Games": "des jeux d'été", "Scholar of the Young Flame": "d'érudit de la jeune Flamme", "Scholar Of The Empyrean": "d'érudit de l'Empyrée",
  "Noble": "de noble", "Sunny Loungewear": "de détente ensoleillée", "Flame Pact": "du pacte de la Flamme", "Mothling": "de phalène", "Farmer": "de fermier",
  "Maid": "de servante", "Blacksmith": "de forgeron", "Trader": "de marchand", "Milkmaid": "de laitière", "Fae Deer Farmer": "d'éleveur de cerfs féeriques",
  "Minstrel": "de ménestrel", "Gravedigger": "de fossoyeur", "Efflorescent Hope": "de l'espoir efflorescent", "Wanderer's": "de vagabond", "Hunter": "de chasseur"
};

// Objets (armes, outils, objets de confort, trophées…)
export const NOMS2 = {
  // Armes
  "Amber Bow": "Arc d'ambre", "Androme's Wand": "Baguette d'Androme", "Ascendant Daggers": "Dagues ascendantes", "Ashwood Wand": "Baguette en bois de frêne",
  "Astral Daggers": "Dagues astrales", "Beastmaster Shaman Staff": "Bâton de chaman maître des bêtes", "Bow Of The Twin Moons": "Arc des lunes jumelles",
  "Breaching Bow": "Arc de brèche", "Bright Hope Sword": "Épée de l'espoir radieux", "Calescent Axe": "Hache incandescente", "Cracklewood Wand": "Baguette de bois crépitant",
  "Daggers Of Liquid Light": "Dagues de lumière liquide", "Darya's Remorse": "Remords de Darya", "Dragoncore Staff": "Bâton à cœur de dragon",
  "Drak'Dal Chieftain Axe": "Hache du chef Drak'Dal", "Eldermere's Staff": "Bâton d'Eldermere", "Electric Initialiser": "Initialiseur électrique",
  "Elm's Eye Wand": "Baguette de l'Œil d'orme", "Ezramin's Courage": "Courage d'Ezramin", "Fell Black Knight Greatsword": "Espadon du chevalier noir funeste",
  "Fell Marksman Bow": "Arc de tireur d'élite funeste", "Fell Scout Bow": "Arc d'éclaireur funeste", "Fell Striker Greatsword": "Espadon de frappeur funeste",
  "Firefeather Bow": "Arc à plumes de feu", "Greatsword Of Embers": "Espadon des braises", "Greatsword Of The Motherflame": "Espadon de la Flamme mère",
  "Icefang Blade": "Lame croc-de-glace", "Lightning Shaman Staff": "Bâton de chaman de la foudre", "Lorekeeper's Greatsword": "Espadon du gardien du savoir",
  "Lucent Axe": "Hache translucide", "Luminary Staff": "Bâton du luminaire", "Lunar Tides Bow": "Arc des marées lunaires", "Manathor's Greatsword": "Espadon de Manathor",
  "Molten Axe": "Hache en fusion", "Nocturnal Axe": "Hache nocturne", "Ony's Staff": "Bâton d'Ony", "Phoenix Bow": "Arc du phénix", "Proto Matter-Bender": "Proto-plieur de matière",
  "Pyreheart Blade": "Lame cœur-de-bûcher", "Scrap Daggers": "Dagues de récupération", "Shroud Vessel's Greatsword": "Espadon du réceptacle du Voile",
  "Silver Haze": "Brume d'argent", "Soldier's Broadsword": "Large épée de soldat", "Spearfisher Bow": "Arc de pêcheur au harpon", "Starborn Sword": "Épée née des étoiles",
  "Stellar Wand": "Baguette stellaire",
  // Pièces dont l'adjectif s'accorde
  "Royal Pants": "Jambières royales", "Royal Boots": "Bottes royales", "Royal Doublet": "Pourpoint royal", "Royal Crown": "Couronne royale", "Royal Gloves": "Gants royaux",
  "Drakian Boots": "Bottes drakiennes",
  // Équipement et objets ramassés
  "Golden Ball": "Balle dorée", "Lucky Fishing Rod": "Canne à pêche porte-bonheur", "Ghost Glider": "Planeur fantôme", "Gem of Bleeding": "Gemme de saignement",
  "Cathedral": "Cathédrale", "Gem of Puncturing": "Gemme de perforation", "Cursed Fishing Rod": "Canne à pêche maudite", "Circular Sawblades": "Lames de scie circulaire",
  "Gem of Retaliation": "Gemme de représailles", "Draped In Envy": "Drapé d'envie", "Key to The Pike": "Clé de la Pique", "Drak Scales": "Écailles de drak",
  "Underwater Grappling Hook": "Grappin sous-marin", "Gem of Lycanthropy": "Gemme de lycanthropie", "Archaic Core": "Noyau archaïque", "Drak Soulward Flask": "Fiole de garde-âme drak",
  "Bandage": "Bandage", "Archaic Essence I": "Essence archaïque I", "Honey": "Miel", "Drak Teeth": "Dents de drak", "Bones": "Os", "Amethyst": "Améthyste",
  "Diving Helmet": "Casque de plongée", "Jester Hat": "Chapeau de bouffon", "Captain's Coat": "Manteau de capitaine", "Tricorn": "Tricorne", "Headscarf": "Foulard",
  "Swimfins": "Palmes", "Ragged Shirt": "Chemise en lambeaux", "Hunter Headband": "Bandeau de chasseur",
  "Explosive Powder Ball": "Boule de poudre explosive", "Torch": "Torche", "Paper Lantern I": "Lanterne en papier I",
  "Broken Guard Of The North Crown": "Couronne brisée de la garde du Nord", "Almanac of Plants and Seedlings": "Almanach des plantes et des semis",
  "\"Slick Fade\" Wig Head": "Tête à perruque « dégradé lissé »", "\"Afro\" Wig Head": "Tête à perruque « afro »", "\"Cowlick\" Wig Head": "Tête à perruque « épi »",
  "\"Hanfu Ponytail\" Wig Head": "Tête à perruque « queue de cheval hanfu »", "\"Braid\" Wig Head": "Tête à perruque « tresse »",
  "Keen Games Banner": "Bannière Keen Games", "Desert Shingle Roof Block": "Bloc de toit en bardeaux du désert", "Shovel Garden Gnome": "Nain de jardin à la pelle",
  "Fern": "Fougère", "Pink Lily Flower": "Lys rose", "Yellow Cymbidum Flower": "Cymbidium jaune", "Masonry Tools": "Outils de maçon", "Smithing Tools": "Outils de forgeron",
  "Sparkworks Tool": "Outil d'étincelage", "Crucible": "Creuset", "Hand Spindle": "Fuseau", "Cauldron": "Chaudron", "Beehive Smoker": "Enfumoir", "Kettle": "Bouilloire",
  "Baby Capybara": "Bébé capybara", "Big Hollow's Eve Pumpkin I": "Grande citrouille de la veille des Creux I", "Medium Hollow's Eve Pumpkin I": "Citrouille moyenne de la veille des Creux I",
  "Small Hollow's Eve Pumpkin I": "Petite citrouille de la veille des Creux I", "Drak Temple Roof Block": "Bloc de toit de temple drak", "Temple Stones": "Pierres de temple",
  "Bellows": "Soufflet", "Shell Limestone Shingles": "Bardeaux de calcaire coquillier",
  // Instruments
  "Exceptional Handpan": "Handpan exceptionnel", "Ornate Flute": "Flûte ornée", "Exceptional Lute": "Luth exceptionnel", "Ornate Harp": "Harpe ornée",
  "Exceptional Flute": "Flûte exceptionnelle", "Ornate Lute": "Luth orné", "Exceptional Hand Drum": "Tambour à main exceptionnel", "Exceptional Harp": "Harpe exceptionnelle",
  "Ornate Hand Drum": "Tambour à main orné", "Ornate Handpan": "Handpan orné", "Hand Drum": "Tambour à main",
  // Collections
  "Albaneve Summits Miniature Piece": "Pièce de maquette des Sommets de l'Albaneve", "Veilwater Basin Miniature Piece": "Pièce de maquette du Bassin des eaux voilées",
  "Cinder's Cradle Miniature Piece": "Pièce de maquette du Berceau des Cendres", "Springlands Miniature Piece": "Pièce de maquette des Hautes pâtures",
  "Nomad Highlands Miniature Piece": "Pièce de maquette des Plateaux nomades", "Kindlewastes Miniature Piece": "Pièce de maquette des Regs exaltés",
  "Revelwood Miniature Piece": "Pièce de maquette des Bois envoûtés", "Blackmire Miniature Piece": "Pièce de maquette de Noirmarais",
  "Above The Vermin, The Cowards, The Liars": "Au-dessus de la vermine, des lâches et des menteurs", "Initiation": "Initiation", "The Last Spark": "La dernière étincelle",
  "Servant Of Chaos": "Serviteur du chaos", "Beginning Of The End": "Le début de la fin", "A Spiral Down, Down, Down": "Une spirale vers le bas, le bas, le bas",
  "The Horde Unleashed": "La horde déchaînée", "Ashes Of Pikemead's Reach": "Cendres du Domaine de Pikemead", "Jezmina's Journey Begins": "Le voyage de Jezmina commence",
  "Mesosiderite": "Mésosidérite", "Iron Meteorite": "Météorite de fer", "Pallasite": "Pallasite", "Large Chondrite": "Grande chondrite", "Achondrite": "Achondrite",
  "Chondrite": "Chondrite", "Large Mesosiderite": "Grande mésosidérite", "Sparkling Dark Crystal": "Cristal sombre scintillant", "Dark Crystal Cluster": "Amas de cristaux sombres",
  "Large Dark Crystal": "Grand cristal sombre", "Bound Tome": "Tome relié", "Mysterious Tome": "Tome mystérieux", "Tome of Agony": "Tome de l'agonie",
  "Inscribed Golden Urn": "Urne dorée gravée", "Bejeweled Golden Urn": "Urne dorée sertie de joyaux", "Foreboding Golden Urn": "Urne dorée de mauvais augure",
  "Outer Orrery Rings": "Anneaux extérieurs du planétaire", "Inner Orrery Rings": "Anneaux intérieurs du planétaire", "Middle Orrery Rings": "Anneaux médians du planétaire",
  "Flame Mosaic Piece I": "Fragment de mosaïque de la Flamme I", "Flame Mosaic Piece II": "Fragment de mosaïque de la Flamme II", "Flame Mosaic Piece III": "Fragment de mosaïque de la Flamme III",
  "Flame Mosaic Piece IV": "Fragment de mosaïque de la Flamme IV", "Flame Mosaic Piece V": "Fragment de mosaïque de la Flamme V", "Flame Mosaic Piece VI": "Fragment de mosaïque de la Flamme VI",
  "Flame Mosaic Piece VII": "Fragment de mosaïque de la Flamme VII", "Flame Mosaic Piece VIII": "Fragment de mosaïque de la Flamme VIII",
  // Atouts
  "Blazing": "Flamboyant", "Nebulous": "Nébuleux", "Blunt Armor": "Armure contondante", "All Blunt Damage": "Tous dégâts contondants", "Thundery": "Orageux",
  "Glacial": "Glacial", "All Cut Damage": "Tous dégâts tranchants", "Ophidian": "Ophidien",
  // Compétences citées par les améliorations
  "Mage Apprentice": "Apprenti mage", "Barbarian's Path": "La voie du barbare",
  // Types de lieux de la carte
  "Named Areas": "Lieux nommés", "Cinder's Cradle Fast Travel": "Voyage rapide du Berceau des Cendres", "Other Fixed Item Sources": "Autres objets à emplacement fixe",
  "Fixed Equipment Sources": "Équipements à emplacement fixe", "Fixed Weapon Sources": "Armes à emplacement fixe", "Fixed Building and Unlock Sources": "Constructions et déblocages à emplacement fixe",
  "Fixed Instrument Sources": "Instruments à emplacement fixe", "Embervale Miniature Model": "Maquette d'Embervale", "Paintings": "Tableaux", "Meteorites": "Météorites",
  "Hollow Artifacts": "Artefacts creux", "Orrery": "Planétaire", "Flame Mosaic": "Mosaïque de la Flamme"
};

// Lieux de la carte
export const LIEUX2 = {
  "Library": "Bibliothèque", "Library Foyer": "Hall de la bibliothèque", "Grand Planetarium": "Grand planétarium", "Engine Chambers": "Salles des machines",
  "Lost Ancient Temple": "Temple ancien perdu", "Frontier Research Lab": "Laboratoire de recherche de la frontière",
  "Revelwood Dungeon Entrance": "Entrée du donjon des Bois envoûtés", "Kindlewastes Dungeon Entrance": "Entrée du donjon des Regs exaltés",
  "Nomad Highlands Dungeon Entrance": "Entrée du donjon des Plateaux nomades", "Springlands Dungeon Entrance": "Entrée du donjon des Hautes pâtures",
  "Albaneve Summits Dungeon Entrance": "Entrée du donjon des Sommets de l'Albaneve", "Veilwater Basin Dungeon Entrance": "Entrée du donjon du Bassin des eaux voilées",
  "Embervale Museum": "Musée d'Embervale", "Halls of Founders": "Salles des fondateurs", "Hydropower Plant": "Centrale hydraulique", "Mother Flame's Domicile": "Demeure de la Flamme mère",
  "Albaneve Summits Sky Port": "Port céleste des Sommets de l'Albaneve", "Springlands Sky Port": "Port céleste des Hautes pâtures", "Island Ruin": "Ruine de l'île",
  "Manathor's Plaza": "Place de Manathor", "The Ancient Citadel": "La Citadelle ancienne", "Ancient Ruin": "Ruine ancienne", "Andromeda's Eye": "Œil d'Andromède",
  "Council Chamber": "Salle du conseil", "Lift Ruins": "Ruines de l'ascenseur", "Hidden Treasure": "Trésor caché", "Lonely Grave": "Tombe solitaire",
  "Small Cave Camp": "Petit camp troglodyte", "Darya's Daycamp": "Campement de Darya", "Ruin": "Ruine", "Hero's Grave": "Tombe du héros",
  "Cloverbrook Farm": "Ferme de Cloverbrook", "Yearfall's Brew Farm": "Ferme du breuvage de Yearfall", "Abandoned Windmill": "Moulin abandonné", "Abandoned Farm": "Ferme abandonnée",
  "Fae Deer Grove": "Bosquet des cerfs féeriques", "Little Fairytale Farm": "Petite ferme de conte de fées", "Gardens Of Earthly Delights": "Jardins des délices terrestres",
  "Underground Dwelling": "Habitation souterraine", "Worker's Ward": "Quartier des ouvriers", "Celestium Mining Site": "Site d'extraction de célestium", "Mineshafts": "Puits de mine",
  "Vukah Cave Pillar": "Pilier de la grotte vukah", "Blue Glowing Ancient Ruins": "Ruines anciennes à lueur bleue", "Pink Glowing Ancient Ruins": "Ruines anciennes à lueur rose",
  "Construct Ruin": "Ruine de l'automate", "Battlegrounds": "Champs de bataille", "Proto Vessel Bay": "Baie du proto-réceptacle", "Small Drak'Dal Cave": "Petite grotte Drak'Dal",
  "Drak'Dal Outpost": "Avant-poste Drak'Dal", "Old Outpost": "Vieil avant-poste", "Shroud Heartlands": "Cœur du Voile", "Cinder's Ascent": "Ascension des Cendres",
  "Small Ancient Dungeon": "Petit donjon ancien", "Pike's Port": "Port de la Pique", "Shanty Shacks": "Baraques", "Huckster Square": "Place des colporteurs",
  "Imperial Gardens": "Jardins impériaux", "Alchemist Tower": "Tour de l'alchimiste", "Umber Hollow": "Creux d'ombre", "Pillars of Creation": "Piliers de la création",
  "Strange Structure": "Structure étrange", "Inner Sanctum": "Sanctuaire intérieur", "Passage to the Blackmire": "Passage vers Noirmarais", "Bittermelt Lake": "Lac de Fonte-amère",
  "Howling Peak": "Pic hurlant", "Wildwater Basin": "Bassin des eaux sauvages", "Lake Luma": "Lac Luma", "Event Honor Hall": "Salle d'honneur des événements",
  "Braelyn Bridge": "Pont de Braelyn", "Oasis": "Oasis", "Cromville Hot Spring": "Source chaude de Cromville", "Lake Heartblood": "Lac Cœur-de-sang",
  "Dragondream Lake": "Lac du Rêve de dragon", "Little Lagoon": "Petite lagune", "Lacemaker Pond": "Étang de la dentellière", "Starfish Shores": "Rivages des étoiles de mer",
  "Ancient Gate": "Porte ancienne", "Passage to the Albaneve Summits": "Passage vers les Sommets de l'Albaneve", "Cinder's Cradle — Sky Islands": "Berceau des Cendres — îles célestes",
  "Cinder's Cradle — Citadel": "Berceau des Cendres — citadelle", "Polaris": "Polaris", "Big Ammonite": "Grande ammonite", "Market On A Yearfall's Day": "Marché un jour de Yearfall"
};

// Noms propres gardés tels quels (villes, villages…)
export const PROPRES2 = ["Longkeep", "Rookmore", "Woodgard", "Ferndale", "Westcott", "Morwenna", "Netherton", "Fort Kelvin", "Midhollow", "Diadwyn", "Thornhold",
  "Glennwood's End", "Rattlebleak", "Pondsworth", "Brightwich", "Brittlebush", "Zephyr", "Wickmouth", "Rothstep", "Orville", "Cromville", "Roostnook"];
