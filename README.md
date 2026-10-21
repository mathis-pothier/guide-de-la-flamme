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
| `data/map-config.js` | Carte : catégories, précisions, raretés, statuts, dépôt de stockage, validation d'un point (partagée site + `validate.mjs`) | configuration |
| `data/map-points.json` | Points ajoutés par les administrateurs depuis l'onglet Carte (vide au départ, aucune donnée de démonstration) | **données** |
| `admin.js` | Connexion administrateur et enregistrement des points par l'API GitHub | — |
| `scripts/mock-github.mjs` | Faux serveur de l'API GitHub pour tester l'administration en local (jetons fictifs, données en mémoire) | outil de test |
| `.github/workflows/verification.yml` | Lance `validate.mjs` à chaque push et pull request (bloque un `map-points.json` mal formé) | CI |

Chaque objet et chaque compétence porte un **statut** (vérifié 1.0, pré-1.0, conflit, cité par un guide…), ses **sources**
et sa **date de vérification**. Les builds référencent les objets et compétences par identifiant : les fiches de builds
affichent donc toujours la fiabilité des données sous-jacentes.

## Fonctions

- **Builds** : filtre par style, fiche détaillée (attributs, équipement par emplacement et par étape, compétences, synergies,
  contextes, conseils), lien de partage, planificateur personnel enregistré dans le navigateur et partageable par lien.
- **Équipements** : recherche (nom, atout, lieu), filtres catégorie / style / rareté / fiabilité / niveau, tri, fiche détaillée.
- **Compétences** : recommandations générales, coop et par build ; liste filtrable avec coûts, conflits et sources.
- **Construction** : 8 idées de bâtiments pas à pas (base en croix, maison 3×5, ferme, coffres, atelier, confort…), les 61 blocs du wiki avec recette et lieu de déblocage, les emplacements de base conseillés, l'autel et le confort, les artisans à sauver et des tutoriels vidéo (`data/construction.js`).
- **Carte** : carte dynamique unique (Leaflet) : lieux du wiki, objets, blocs, survivants, emplacements de base et ajouts des
  administrateurs ; filtres par catégorie et rareté, recherche, regroupement des marqueurs, légende, fiche par point (nom,
  catégorie, description, rareté, source, fiabilité de la position, date de vérification). Voir [Carte dynamique](#carte-dynamique).
- **Comparateur** : jusqu'à 4 objets côte à côte, meilleure valeur surlignée.
- **Mises à jour & sources** : version, couverture des données, historique des patchs, registre des sources.

## Carte dynamique

### Sources cartographiques

| Source | Usage ici | Pourquoi |
|---|---|---|
| Carte du wiki (DataMaps de enshrouded.wiki.gg, `Map:Embervale`) | Fond (64 tuiles) + 570 marqueurs de lieux | Seul fond vierge téléchargeable ; rendu © Keen Games, marqueurs sous la licence du wiki (CC BY-SA 4.0 annoncée, **page Copyrights à revérifier** : le wiki était en maintenance lors du relevé du 20/10/2026) |
| Pages d'objets, de blocs et de survivants du wiki, guides cités | Placement des objets « dans ce lieu » | Lieu cité par la source, rattaché au marqueur du lieu |
| The Hidden Gaming Lair (th.gl), Map Genie, AllThings.How | **Liens seulement** | Cartes 1.0 complètes, mais sans licence de réutilisation (données et tuiles propriétaires) : ni intégration ni copie |

### Limites de précision

- Le fond date d'avant la 1.0 (rendu de nov. 2025) : **Cinder's Cradle n'y figure pas**. Aucune carte 1.0 vierge sous licence
  réutilisable n'a été trouvée ; le fond pourra être remplacé dans `data/map.js` (`tuiles`, `taille`) quand le wiki la publiera.
- Chaque point indique sa fiabilité : **Position exacte** (coordonnée publiée), **Dans ce lieu** (l'objet est dans le lieu, pas
  forcément au point exact), **Approximative** (estimation, à vérifier en jeu), **Zone seulement** (seule la région est connue).
- Les objets, blocs et survivants dont la source ne cite aucun lieu présent sur la carte n'y figurent pas (ils restent dans leurs onglets).

### Ajouter, modifier, valider, masquer ou supprimer un élément (administrateurs)

La protection est faite **côté serveur par GitHub** : les ajouts sont enregistrés dans `data/map-points.json` par l'API GitHub,
qui n'accepte l'écriture que d'un compte ayant le **droit d'écriture sur le dépôt**. Masquer le bouton ne suffirait pas ; ici
le bouton est visible de tous mais toute écriture sans ce droit est refusée par GitHub (401/403). Le code ne contient aucun secret.

1. **Donner le droit** : être propriétaire du dépôt, ou être ajouté comme collaborateur (*Settings → Collaborators*, rôle Write).
2. **Créer son jeton** (chaque administrateur le sien) : GitHub → *Settings → Developer settings → Personal access tokens →
   Fine-grained tokens → Generate new token* ; *Repository access* : **Only select repositories** → `guide-de-la-flamme` ;
   *Permissions → Repository permissions → Contents* : **Read and write** ; durée courte (30 à 90 jours).
3. Sur le site, onglet **Carte** → **Ajouter un élément** → coller le jeton. Il reste dans le navigateur (onglet en cours, ou
   l'appareil si « Rester connecté » est coché) et n'est envoyé qu'à api.github.com. **Se déconnecter** l'efface.
4. Remplir la fiche : nom, catégorie, description, rareté, position (cliquer sur la carte ou saisir x/y entre 0 et 10240),
   zone, précision, source (texte + lien https). L'auteur et la date sont ajoutés automatiquement.
5. Le point est créé **En attente** (visible des administrateurs seulement, case « Voir aussi les ajouts en attente et masqués »).
   Un administrateur le **Valide** (visible de tous), le **Masque** (conservé, invisible) ou le **Supprime** (avec confirmation).
6. Chaque action est un commit sur `main` (« Carte : … — Par <compte> ») : historique et retour arrière dans Git.
   Les visiteurs voient le changement après la republication de GitHub Pages (1 à 2 minutes).

Règles : n'ajouter que des éléments vérifiés en jeu ou sourcés ; tout exemple de test doit être nommé « [TEST FICTIF] … » et
supprimé ensuite. Les champs sont contrôlés avant l'envoi (`window.ENS.validateMapPoint`) et à chaque push par la CI
`verification.yml`. Ajouter une catégorie : une entrée dans `categories` de `data/map-config.js`.

**Si une écriture échoue** : « Jeton refusé » → jeton expiré ou mal copié ; « pas le droit d'écriture » → le compte n'est pas
collaborateur ou le jeton ne cible pas ce dépôt avec Contents en écriture ; « modifié en même temps » → réessayer.

**Tester sans toucher au dépôt** : `node scripts/serve.mjs 8090` et `node scripts/mock-github.mjs 8099`, ouvrir
http://localhost:8090, puis dans la console du navigateur `localStorage.setItem("ens.devApi", "http://localhost:8099")`
(adresse acceptée uniquement sur localhost). Jetons fictifs : `test_admin_token_0123456789abcd` (écriture) et
`test_reader_token_0123456789abcd` (refusé). Les données restent en mémoire. Ensuite : `localStorage.removeItem("ens.devApi")`.

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
- **Carte** : [Leaflet](https://leafletjs.com) (BSD-2-Clause) et [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) (MIT), chargés depuis cdnjs.
