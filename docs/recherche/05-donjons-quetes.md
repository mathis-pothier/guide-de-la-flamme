# Donjons, salles, énigmes et quêtes

Le site prévoit des guides « comment résoudre telle salle ». Voici les types de lieux à couvrir et ce qu'on sait de chacun.
Les solutions détaillées pièce par pièce sont **à refaire en jeu** (avec nos propres captures) : on ne reprend pas les
captures et textes des sites tiers.

## Ancient Vaults (caveaux des survivants)

- Un caveau par artisan dans Springlands / Low Meadows (voir [02-mecaniques.md](02-mecaniques.md)). On réveille le
  survivant à son caisson, puis on l'invoque à la base.
- Chaque caveau a souvent une **porte verrouillée annexe** ouverte par des **symboles cachés** à activer, avec un coffre
  aléatoire derrière `[bisect-hunter]`.
- Exemple — **caveau de la Chasseuse** (est de Braelyn Bridge) : pièges électriques, passage au **grappin** sur une barre
  au plafond ; la porte verrouillée s'ouvre avec 3 symboles : un sur un pilier en face (à **tirer à l'arc**), un dans une
  petite salle sur le mur de droite, un sur une corniche au-dessus de l'entrée (planeur depuis un brasero → grappin → mur
  d'escalade). Une vidéo 1.0 confirme que l'énigme existe toujours `[yt-hunter-vault]`.
- Les autres caveaux sont décrits comme plus difficiles. À documenter un par un : Forgeron (Cinder Vault, tutoriel),
  Alchimiste, Fermière, Charpentier.

## Elixir Wells (puits d'élixir)

- Donjons dans le Shroud, souvent gardés par un **mini-boss** (Fell Thunderbrute, Critter Queen…), avec une **Shroud Root**
  au fond. Récompenses : **3 points de compétence** la première fois [pré-1.0], **Shroud Cores** `[xgs-skills]` `[techraptor-poi]`.
- Nombre par région : 3 / 3 / 3 / 4 / 2 / 3 / 0 (Springlands → Cinder's Cradle) `[pd-progression]`.
- Astuce : planer directement jusqu'à l'entrée, nettoyer, couper la racine `[prima-xp]`.

## Ancient Spires (tours anciennes)

- Grandes tours à escalader : débloquent le **voyage rapide** et révèlent les points d'intérêt (racines…) autour.
- Leur ascension est souvent un petit **parcours / énigme** (grappin, planeur, plateformes). Des vidéos 1.0 couvrent « chaque
  tour et coffre d'or » et des énigmes de tours (`liste-videos-enshrouded.csv`, thème Puzzles/salles).
- Les **pots** autour des tours se cassent et contiennent des matériaux (dont des Copper Bars), ils se régénèrent `[gamerguides-tips]`.
- Idée : une fiche par tour (emplacement, route d'ascension, coffres).

## Hollow Halls

- Grands donjons de morts-vivants (Hollow), **à finir en une session** (en partir réinitialise). Durée 1 à 3 h `[techraptor-hollow]`.
- Débloqués par la quête de l'alchimiste *Explore the Hollow Halls* ; ordre : Springlands → Revelwood → Nomad Highlands →
  Kindlewastes ; **+ Albaneve Summits et Veilwater Basin en 1.0** (quête *The Veilwater Basin Hollow Halls*).
- Les portes sont bloquées par des **barrières turquoise** levées en ramassant des **runes** (flottantes ou portées par des
  ennemis) : regarder en hauteur.
- **Clés** fabriquées chez le Collectionneur (Aiden Crowley) avec des **Ectoplasm** et **Giant Bones** du donjon précédent
  (ex. Revelwood : 50 Ectoplasm Fragments + 20 Bones) [pré-1.0].
- Boss : Hollow Cyclops (contondant 150 %, feu 120 %), et en 1.0 Hollow Titan / Hollow Wispwyvern `[pd-bosses]` `[ens-tools-10]`.
- Récompenses : armes spécialisées contre les Hollow, nourritures du Collectionneur, blocs de construction (Red Marble…).
- Conseils : beaucoup de nourriture, potions, plusieurs feux de camp, garder la clé suivante sur soi, s'entraîner au planeur.

## Donjons-balises (Beacon Dungeons) [1.0]

- **6 donjons**, un par région ancienne (Springlands, Revelwood, Nomad Highlands, Kindlewastes, Albaneve Summits, Veilwater
  Basin), avec leurs entrées dans Cinder's Cradle ; **obligatoires** pour la quête principale avant Vorgoth `[ens-tools-10]` `[whisper-vorgoth]`.
- Contenu détaillé (énigmes, boss) non documenté dans les sources lues : **gros chantier de guides** pour le site.

## Autres lieux à énigmes

- **Trapped Night Sanctum** : contient l'outil Sparkworks `[games-gg-sparkworks]`.
- **Drak'Dal Temple** (Veilwater Basin) : énigme de **montée des eaux**, coffre d'or au bout `[games-gg-chests]`.
- **Telescope puzzle** (1.0) : vidéo dédiée, probablement lié à *Star Signs* / *Activating The Gate To The Stars* (à vérifier).
- **Sun Temples** (sud-est), **Black Tombs** et **White Tombs** : lieux rares à explorer `[techraptor-poi]`.
- **Sunken Ancient City** (Blackmire) : tombe de la barde Melody.

## Boss final : Vorgoth [1.0]

- **Accès** : finir les 6 donjons-balises → plateforme de téléportation de **Cinder's Ascent** → îles flottantes →
  **Ancient Citadel**. Devant l'arène, une **barrière à deux verrous** : activer les interrupteurs violets, y compris ceux
  en hauteur (plateformes, murs), jusqu'au message *BARRIER UNLOCKED* `[whisper-vorgoth]`.
- **Phase 1 — Champion of the Shroud** : épéiste en armure, fentes rapides ; esquiver tôt, ne pas vider son endurance ; peut
  être frappé dans le dos. PV = 15× un ennemi de son niveau, 9 attaques `[pd-final-boss]`.
- **Phase 2 — The Wanderer's Vessel** : créature géante avec un bras-tentacule ; triple frappe, balayage en fonçant,
  tentacule qui attire, projectiles de Shroud, invocations. PV = 25×, 18 attaques. Des **organes** (kystes, yeux, fleurs,
  tentacules) apparaissent : les frapper **transmet les dégâts** à Vorgoth.
- **Faiblesse feu (120 %)**, **immunité Shroud**. Niveau 50, équipement 55 conseillé. En coop : +70 % PV par joueur en plus.
- **Récompenses** : Vorgoth's Eye + Bound Essence (Flamme 11), runes légendaires, Shroud Vessel's Greatsword, pièces du set
  Soulbound (couronne et gants par la quête). Puis communier avec la Flamme → fin, succès *A new North Star*.

## Quêtes ajoutées en 1.0 (22)

`[ens-tools-10]` — à détailler en guides :
A Gem Forge Of Our Own · Activating The Gate To The Stars · Cinders Of The End · Climbing The Kindlewastes Spire ·
Contraptions And Mechanisms · Crafting An Infusion Altar · Crops Of Cinder's Cradle · Crown Of Sorrow · Gathering Celestium ·
Hand Drum For The Bard · Hearing Voices · Know Your Crops · Land Of The Sky Islands · Logistics Management ·
Magically Empowered Equipment (niv. 40, chasseuse) · Red Marble Decoration · Star Signs · Staves And Spells ·
The Good Old Days · The Veilwater Basin Hollow Halls · Use Fast Travel · Vorgoth's Ruminations.

Quêtes de Cinder's Cradle : 11 d'entre elles `[ens-tools-cc]`. La presse note que les quêtes sont **colorées par difficulté**
`[pcgames-review]`, et Hack The Minotaur rappelle que les **quêtes annexes** débloquent des éléments clés (dont le planeur) :
ne pas foncer sur la quête principale `[htm-mistakes]`.
