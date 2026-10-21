# Le jeu, l'histoire, la 1.0 et l'actu

## Enshrouded en bref

- **Genre** : survie / action-RPG en monde ouvert, construction en voxels (terrain creusable et modelable), coop.
- **Développeur / éditeur** : Keen Games (studio allemand).
- **Accès anticipé** : 24/01/2024 → **1.0 le 15/10/2026**, après presque 3 ans d'accès anticipé `[explosion-10]`.
- **Plateformes** : PC (Steam) et PS5 (+ PS5 Pro) à la sortie. **Xbox Series prévue au printemps 2027**, sans date
  `[redreactions]`. Steam Deck Verified depuis la 1.0 `[gol-10]`.
- **Prix Steam** : passé à **39,99 €** (+10 €) le 08/09/2026 ; les possesseurs de l'accès anticipé ne repaient pas
  `[companion-10]`.
- **Multijoueur** : jusqu'à **16 joueurs sur PC**, **8 sur PS5** (PS Plus requis). **Pas de cross-play** au lancement,
  annoncé « en développement », sans date `[redreactions]`.
- **Durée de vie** : Keen annonce environ **100 heures** pour l'aventure complète avec les quêtes annexes `[cgm-review]`.

## Le but du jeu

On incarne un **Flameborn** (« Né de la Flamme »), un guerrier réveillé dans un caveau (la Cinder Vault) dans le royaume
d'**Embervale**, ravagé par le **Shroud** : un brouillard corrompu, né d'un usage abusif de la magie (l'Élixir), qui tue
ceux qui y restent trop longtemps et transforme les créatures.

Concrètement, la boucle de jeu est :

1. explorer et récupérer des ressources ;
2. bâtir une base autour d'un **autel de la Flamme** et y installer des **survivants** (artisans) retrouvés dans des caveaux ;
3. renforcer la **Flamme** (montée de niveau de l'autel) avec des ressources et des **trophées de boss**, ce qui allonge le
   temps de survie dans le Shroud et ouvre les régions suivantes ;
4. détruire les **Shroud Roots** (racines) et nettoyer les **Elixir Wells** (puits) pour gagner des points de compétence ;
5. progresser région par région jusqu'à **Cinder's Cradle** et au boss final.

La survie est **légère** : la nourriture donne des bonus (pas de faim mortelle), pas de soif. La vraie pression vient de la
jauge de Shroud `[cgm-review]`. Pas de raids sur la base : les ennemis n'attaquent pas les constructions `[xgs-base]`.

## L'histoire et la fin (spoilers)

- La 1.0 **conclut l'histoire d'Embervale** « pour l'instant » `[allthings-ending]`.
- Dans **Cinder's Cradle** (région volcanique au nord, îles flottantes), on secourt la survivante **Loraine Crim** à
  Cinder's Ascent, une rescapée qui connaît les **Anciens** (civilisation passée, constructions mécaniques « Ancient Constructs ») `[guided-changelog]` `[ens-tools-cc]`.
- Le chemin du boss final passe par les **six donjons-balises** (Beacon Dungeons, un par ancienne région), puis la
  plateforme de téléportation de Cinder's Ascent, les îles volantes et **l'Ancient Citadel** `[whisper-vorgoth]`.
- **Boss final : Vorgoth**, en deux phases : *Champion of the Shroud* (épéiste en armure) puis *The Wanderer's Vessel*
  (créature géante corrompue) `[ens-tools-10]` `[pd-vorgoth]`.
- Après la victoire, la quête *Cinders Of The End* devient *Rescue The Mother Flame* : on communie avec la Flamme au cœur
  de la Citadelle, ce qui lance une séquence illustrée et narrée. Les habitants d'Embervale, rongés par l'Élixir et le Shroud,
  renaissent grâce au sacrifice des Flameborn ; Embervale est libérée de l'emprise du **Wanderer** (« le Vagabond »), avec
  un sous-entendu que tout n'est pas fini `[allthings-ending]`.
- Succès associé : *A new North Star* `[whisper-vorgoth]`.
- **Après la fin** : personnage, base et quêtes restent ; la **Flamme 11** permet aux autels de **repousser le Shroud**
  autour d'eux et porte la limite à 16 autels. Des zones de Shroud mortel (rouge) restent sur la carte. Les intro/outro sont
  revisionnables dans le journal `[allthings-ending]`.

## Ce qu'apporte la 1.0 (15/10/2026)

Sources : `[guided-changelog]` (résumé des ~400 points du changelog officiel), `[ens-tools-10]` (diff des fichiers du jeu),
`[companion-10]`, `[gol-10]`. Le détail équipement/compétences est déjà dans `data/versions.js` du site.

**Monde**
- Nouvelle région **Cinder's Cradle** : environ 7,5 km², ennemis niv. 46–48, 29 lieux nommés, 11 quêtes, jamais de pluie
  `[ens-tools-10]` `[ens-tools-cc]`.
- **Toute la carte est ouverte**, y compris des zones de bordure jusque-là fermées. **2 Hollow Halls** de plus (Albaneve
  Summits et Veilwater Basin). Une grande partie des zones interdites à la construction devient constructible.
- **Shroud Roots** : 12 dans Cinder's Cradle + 6 dans les marges de Springlands, Blackmire et Kindlewastes
  `[guided-changelog]`. ⚠ Divergence : PinDrop compte **9** racines dans Cinder's Cradle `[pd-progression]`.
- **14 nouveaux types d'ennemis** (37 avec variantes), dont une faction de **Constructs anciens** (robots aux noms en
  sigles : S.P.D.R., G.U.N.R., M.I.N.R.…), de nouveaux Fell, Scavengers, Vukah, Hollow ; nouveaux boss : Ancient S.P.D.R.
  Construct, Direwolf, Fell Striker, Hollow Titan, Hollow Wispwyvern, Scavenger Tyrant, Hydrak'Dal, Vorgoth
  `[ens-tools-10]` `[pd-bosses]`.
- Boss des Albaneve Summits retravaillé (phase d'épuisement, point faible dans le dos).
- Les ennemis **regagnent leur vie** quand on quitte le combat : impossible de « grignoter » un boss en plusieurs allers-retours.

**Progression**
- Niveau max **50** (au lieu de 45), équipement amélioré jusqu'au **niveau 55**, **Flamme niveau 11**, jusqu'à **16 autels**.
- **Arbre de compétences réinitialisé** pour tous les personnages (points à redistribuer).
- Recettes d'armures et progression de la Flamme refondues : chaque palier de Flamme débloque l'armure du palier d'artisanat suivant.
- Nouvelle monnaie : **pièces d'or**, échangeables contre des objets cosmétiques.

**Combat** : 9 nouveaux sorts, sorts et flèches **éternels** (sans charges, améliorables), nouvelles compétences, dagues
passées dans l'Assassin, attaques lourdes de baguette perforantes, nécromancie plafonnée. Voir `data/versions.js`.

**Construction / confort de jeu**
- **Sparkworks** : système logique (leviers, plaques, portes, pièges…) — voir [02-mecaniques.md](02-mecaniques.md).
- Compétence **Airborne Architect** : construire en vol libre dans sa base.
- Coffres renommables et améliorables sur place (conversion en coffres magiques), ramassage automatique du butin en zone,
  plus de blocs et de plantes en pot, limite d'usines par monde.
- **Pêche** refondue : tous les poissons partout, l'appât fixe le palier du poisson, la canne fixe ce qu'on peut attraper.
- Lore et survivants **doublés** en anglais, allemand et mandarin (pas en français). Proportions du corps chez le barbier.
- Technique : HDR, nouveau rendu lointain (« brick renderer »), nouveau format de sauvegarde, meilleures perfs Steam Deck.

**Sauvegardes** : les mondes de l'accès anticipé sont convertis (sauvegarde automatique avant). Recommencer un monde est
facultatif mais conseillé pour profiter du début revu. Les joueurs de l'accès anticipé peuvent récupérer 3 objets de
décoration via « Redeem Add-Ons » `[companion-10]` `[redreactions]`.

**Correctifs depuis** (voir `data/versions.js`) : 1.0.0.1 (15/10, Fire Wisp fixé au niv. 27) et 1.0.0.2 (16/10, plantages,
migration, traductions de compétences). Keen annonce d'autres corrections de descriptions de compétences.

## Chiffres de lancement et accueil

- **102 491 joueurs simultanés** sur Steam (pic sur 24 h, 17/10/2026), contre 17 002 en septembre. Record historique non
  battu : **160 405** le 28/01/2024. 7e meilleure vente Steam ce week-end-là `[guided-players]`.
- **Presse** :
  - CGMagazine **8,5/10** : exploration (planeur, grappin, tours) et combat salués, construction et colonie de survivants
    plaisantes ; reproches : difficulté mal calibrée (ennemis 2–3 niveaux au-dessus très durs), inventaire étroit, pas de
    cross-play, peu d'originalité, histoire surtout racontée par des notes `[cgm-review]`.
  - PC Games (DE) **9/10** : immense bac à sable, voxels, difficulté réglable, mort peu punitive, quêtes colorées par
    difficulté ; reproches : combat simple, magie qui « sonne » faible, donjons en solo et nuits très durs, IA qui se coince `[pcgames-review]`.
- **Avenir** : Xbox au printemps 2027, cross-play en développement, Keen annonce un soutien sur le long terme ; **pas de
  feuille de route publique détaillée** à ce jour.

## Idées d'actus pour le site (à date du 21/10/2026)

- « La 1.0 est sortie : ce qui change pour votre ancienne sauvegarde » (reset de l'arbre, conversion, nouveau monde ou pas).
- « 100 000 joueurs : Enshrouded retrouve la hype » (chiffres SteamDB).
- Suivi des correctifs (le script `scripts/check-updates.mjs` les détecte déjà).
- Xbox 2027 / cross-play : à surveiller.
