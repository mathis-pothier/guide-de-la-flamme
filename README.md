# Guide de la Flamme — équipements, compétences et builds pour Enshrouded

Guide de fan, non officiel, en français. Site statique, sans dépendance ni compilation.

## Lancer le site

- **Le plus simple** : double-cliquer sur `index.html` (fonctionne hors ligne, sauf les polices Google).
- **Avec un serveur local** (recommandé pour les liens de partage) :

  ```bash
  node scripts/serve.mjs
  ```

  puis ouvrir http://localhost:8080. Requiert Node.js 18+.
- **En ligne** : déposer le dossier tel quel sur n'importe quel hébergeur statique (GitHub Pages, Netlify…).

## Organisation

| Fichier | Contenu | Nature |
|---|---|---|
| `data/sources.js` | Registre des sources consultées (lien, date, fiabilité, limites) | référence |
| `data/items.js` | Armes, sorts, boucliers, armures, anneaux + statut de vérification | **données** |
| `data/skills.js` | Compétences de l'arbre (coût, rangs, effet, prérequis) | **données** |
| `data/builds.js` | Styles de jeu, builds, recommandations de compétences | **éditorial** |
| `data/versions.js` | Version du jeu prise en compte, couverture, historique des patchs | suivi |
| `app.js`, `styles.css`, `index.html` | Interface | — |
| `scripts/validate.mjs` | Contrôle de cohérence des données | outil |
| `scripts/check-updates.mjs` | Détection des nouvelles annonces Steam | outil |
| `data/catalog.js`, `data/map.js` | Catalogue de 833 objets et carte, générés depuis le wiki | **données générées** |
| `data/builds-1.0.js` | Équipement 1.0 pièce par pièce par build (guides KeenGamer, AoEAH, PinDrop…) | **éditorial** |
| `data/construction.js` | Onglet Construction : blocs (wiki), bâtiments et emplacements (guides), autel, confort, artisans, vidéos | **données + éditorial** |
| `data/merge.js` | Fusion objets vérifiés + catalogue du wiki | — |
| `scripts/collect.html` | Collecte du wiki depuis le navigateur (avec `node scripts/serve.mjs 8081 --collect`) | outil |
| `scripts/build-data.mjs` | Transforme la collecte en catalogue et carte | outil |
| `recherche.html`, `docs/recherche/*.md` | Notes de recherche Enshrouded 1.0 (page à part, non liée au menu) ; `node scripts/build-recherche.mjs` régénère `docs/recherche/contenu.js` après modification | **recherche** |
| `scripts/fetch-block-images.mjs` | Images des blocs : icône du wiki officiel, sinon capture de l'établi (wiki Fandom) recadrée → `images/blocs/` + `data/blocs-images.js` | outil |
| `scripts/fetch-images.mjs` | Copie locale des images, tuiles et icônes de carte → `images/` + `data/images.js` | outil |

Chaque objet et chaque compétence porte un **statut** (vérifié 1.0, pré-1.0, conflit, cité par un guide…), ses **sources**
et sa **date de vérification**. Les builds référencent les objets et compétences par identifiant : les fiches de builds
affichent donc toujours la fiabilité des données sous-jacentes.

## Fonctions

- **Builds** : filtre par style, fiche détaillée (attributs, équipement par emplacement et par étape, compétences, synergies,
  contextes, conseils), lien de partage, planificateur personnel enregistré dans le navigateur et partageable par lien.
- **Équipements** : recherche (nom, atout, lieu), filtres catégorie / style / rareté / fiabilité / niveau, tri, fiche détaillée.
- **Compétences** : recommandations générales, coop et par build ; liste filtrable avec coûts, conflits et sources.
- **Construction** : 8 idées de bâtiments pas à pas (base en croix, maison 3×5, ferme, coffres, atelier, confort…), les 61 blocs du wiki avec recette et lieu de déblocage, les emplacements de base conseillés, l'autel et le confort, les artisans à sauver et des tutoriels vidéo (`data/construction.js`).
- **Carte** : carte du wiki (rendu du jeu) avec les objets épinglés à leur emplacement précis, recherche, calques de lieux (Ancient Spire, Elixir Well, Shroud Root…), objets par région ; carte 1.0 complète intégrée (AllThings.How) et liens vers th.gl / Map Genie. Leaflet est chargé depuis cdnjs (connexion nécessaire pour la carte).
- **Comparateur** : jusqu'à 4 objets côte à côte, meilleure valeur surlignée.
- **Mises à jour & sources** : version, couverture des données, historique des patchs, registre des sources.

## Publier une modification

Avant chaque commit qui change le site, lancez `node scripts/stamp-version.mjs` : il ajoute un numéro de version aux
fichiers de `index.html` pour que les navigateurs ne mélangent pas l'ancienne et la nouvelle version (GitHub Pages les
garde 10 minutes en cache). La collecte automatique du wiki le fait toute seule.

## Mise à jour des données

Voir [MISE-A-JOUR.md](MISE-A-JOUR.md). En résumé : `node scripts/check-updates.mjs` → lire la note officielle →
modifier `data/` → `node scripts/validate.mjs` → `node scripts/check-updates.mjs --save`.

## Images

Le dossier `images/` (~130 Mo, dont ~60 Mo de captures de sets en 1920×1080 et 29 Mo de tuiles de carte) contient des images
copiées depuis enshrouded.wiki.gg. Les objets sans image sur le wiki reçoivent une icône dessinée : forme selon le type,
couleur selon l'élément, initiales du nom.

## Rafraîchir le catalogue depuis le wiki

**Automatique :** la GitHub Action `.github/workflows/collecte-wiki.yml` relance la collecte **le lundi et le jeudi** (5 h UTC).
Si le catalogue a changé, elle ouvre une pull request « Collecte du wiki — date (N changements) » qui liste les objets ajoutés,
retirés et modifiés. Il suffit de la relire puis de la fusionner : GitHub Pages republie le site tout seul. Si le wiki est
en panne, la collecte échoue sans rien modifier et la suivante prend le relais. Lancement manuel : onglet **Actions** →
**Collecte du wiki** → **Run workflow**.

**À la main :**

1. `node scripts/collect.mjs` (ou, si Node n'a pas accès au réseau : `node scripts/serve.mjs 8081 --collect` puis ouvrir
   http://localhost:8081/scripts/collect.html et attendre « TERMINÉ ») ;
2. `node scripts/build-data.mjs` ;
3. `node scripts/fetch-images.mjs` (ne télécharge que les nouvelles images) ;
4. `node scripts/validate.mjs`.

## Crédits et droits

- **Projet de fan, non affilié à Keen Games.** *Enshrouded*, ses noms, images d'objets et rendus de carte sont © Keen Games.
  Les images sont reprises du wiki communautaire à titre d'illustration ; elles seront retirées sur simple demande des ayants droit.
- **Données du wiki** (catalogue d'objets, marqueurs de carte, niveaux de zones) : [enshrouded.wiki.gg](https://enshrouded.wiki.gg),
  contenu sous licence Creative Commons BY-SA 4.0 (licence par défaut des wikis wiki.gg — vérifier la page *Copyrights* du wiki).
  Les fichiers `data/catalog.js`, `data/map.js` et `.collect/` en dérivent et restent sous cette licence.
- **Autres sources** (PinDrop, KeenGamer, AoEAH, Hack The Minotaur…) : citées et liées objet par objet dans le site (onglet *Sources*).
- **Icônes de secours** : dessinées pour ce site, en partie d'après [Lucide](https://lucide.dev) (licence ISC).
- **Carte** : [Leaflet](https://leafletjs.com) (BSD-2-Clause), chargé depuis cdnjs.
