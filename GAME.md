# C204 · 2026 — unité fictive modernisée (simulation 3D)

- Lien jouable (version en ligne, **v0.6.0**) : https://passcool17.github.io/c204-2026/?v=LIVE_SHA
- Dépôt : https://github.com/passcool17/c204-2026 (bot Arcade 3D)
- État : **v0.6.0** — Lexus GLB v6.1 (cuivre, cabriolet ouvert seulement, KTX2 + meshopt), crédit Ddiaz Design CC BY-NC-SA 4.0, usage non commercial. Le lien « Jeu : Mission Titor » de la v0.5.1 est inchangé.
- Lien vers l'app d'origine : [C204 originale (titor-c204)](https://passcool17.github.io/titor-c204/). Lien vers le jeu : [Jeu : Mission Titor](https://passcool17.github.io/titor-c204-jeu/) (dans l'en-tête). Le même lien est aussi dans titor-c204 (scènes Machine et Corvette).
- Cadre : version fictive inspirée du récit de John Titor (document fictif, non vérifié). Aucune machine réelle de ce type n'a été démontrée. Le mode Assemblage est un **guide fictif — pas un vrai plan**.

## Contrôles

- Glisser pour tourner, pincer pour zoomer, toucher une pièce = fiche.
- Boutons (44 px minimum) : **Vue**, **Éclatée**, **Assemblage** (Précédent / Suivant), **Pièces**, **Étiquettes**, **C204 2001** (lien), plein écran. Lien discret sous le titre : **Jeu : Mission Titor**.
- Clavier : `V` vue, `E` éclatée, `A` assemblage, `←` / `→` étape précédente / suivante, `L` étiquettes, `P` pièces, `F` ou `F11` plein écran, `Échap` ferme les panneaux.
- Tests : `?demo=explode|assemble|labels`.

## Ressources

- Three.js r170 (licence MIT) via jsDelivr, modules ES + importmap. Chargeurs : GLTFLoader, DRACOLoader (unité, décodeur jsDelivr), KTX2Loader avec transcodeur Basis **local** (`vendor/basis/`, three@0.170.0, pas de CDN), MeshoptDecoder.
- Service worker manuel : une seule constante `VERSION` (`data.js`) sert à `sw.js?v=` + VERSION (`updateViaCache: 'none'`). HTML et `data.js` en réseau d'abord. Les fichiers Basis sont précachés. Les GLB ne sont pas précachés (noms versionnés + cache à la demande). Anciens caches supprimés à l'activation.
- Modèles : unité (chaîne 3D de Pascal, propre au projet) et voiture Lexus v6.1. Repli primitives si un GLB manque.
- GLB unité : `assets/c204-2026.glb` (1,15 Mo, Draco + WebP, 3 060 triangles, 70 nœuds, 28 clips).
- GLB voiture : `assets/lexus-lc-v61.glb` (v6.1, 623,3 Ko, 638 224 o, md5 `a376b2d2992faa590681377e89d39f72`). Extensions : KHR_mesh_quantization, EXT_meshopt_compression, KHR_texture_basisu, KHR_materials_clearcoat, KHR_materials_emissive_strength, KHR_texture_transform. Pas de KHR_materials_transmission. 33 909 triangles livrés (31 029 après inspect du fichier), 16 appels voiture (12 `Lexus_Atlas_v6` + 4 `Lexus_Glass_v6` alpha 0,28 BLEND), gpuSize 3,50 Mo. 3 clips, mêmes noms qu'en v5 : `idle` 3,0 s, `doors_open` 1,2 s (`door_L`, `door_R` ; `window_left` / `window_right` suivent), `wheels_roll` 3,0 s. Nœuds : `lexus_lc_root`, `c204_2026_unit` (−0,33, 0,2981, −0,88), `body`, `door_L`, `door_R`, `wheel_fl`, `wheel_fr`, `wheel_rl`, `wheel_rr`, `window_left` (enfant de `door_L`), `window_right` (enfant de `door_R`), `windshield`, `convertible_top` (capote pliée, visible), `interior`, `grille`, `steering_wheel`, `brakes` (nouveau, statique, 355 triangles). **Le nœud `soft_top_closed` a disparu** : le modèle est un cabriolet ouvert seulement. L'app garde un test nul sur ce nom, pas de bascule capote fermée. Peinture cuivre. Crédit : **2021 Lexus LC 500 Convertible by Ddiaz Design (https://sketchfab.com/ddiaz-design), CC BY-NC-SA 4.0**. Usage non commercial. Le même texte est dans le panneau Pièces du jeu. Source chaîne : Modélisation → Rig → Rendu, fichier Rendu `/workspace/assets3d/c204-2026/glb/lexus-lc.glb`. Repli v5 : `/workspace/assets3d/c204-2026/glb/backup/lexus-lc.v5.glb`. Détails : `/workspace/assets3d/c204-2026/MANIFEST.md`.
- Textes : inspirés du récit publié par John Titor (2000-2001) et du manuel associé (document fictif, non vérifié) ; modernisation 2026 clairement présentée comme fictive. Aucun schéma électronique réel, aucune instruction dangereuse.

## Noms de nœuds attendus (GLB finaux)

Échelle : 1 unité = 1 mètre. Transformations appliquées. Face avant vers −Y dans Blender (+Z dans Three.js). Origine de l'unité aux pieds (dessous du boîtier). Noms en anglais, stables : ne pas renommer, ne pas retirer.

### Unité — racine `c204_2026_root`

Même forme générale que la C204 d'origine, plus compacte : **0,72 × 0,32 × 0,26 m** (L × l × H, axes Z, X, Y). Écran tactile et LED. Pièces en nœuds séparés, enfants de `c204_2026_root` (groupes admis, le nom utile est sur le nœud listé).

| Nœud | Rôle |
|---|---|
| `c204_2026_root` | Racine de l'unité |
| `housing` | Boîtier principal (coque, dessus ouvert sous le couvercle) |
| `lid` | Couvercle (charnière à l'arrière, −Z) |
| `touchscreen` | Écran tactile 2026 (face avant-haute, visible couvercle fermé) |
| `led_status` | Barrette LED d'état (chant avant du boîtier) |
| `singularity_main_housing` | Logement de singularité principale |
| `singularity_steering_housing` | Logement de singularité de pilotage |
| `field_coil_main_1` `field_coil_main_2` `field_coil_main_3` | Bobines de champ, principale |
| `field_coil_steering_1` `field_coil_steering_2` `field_coil_steering_3` | Bobines de champ, pilotage |
| `mag_field_generator_main` | Générateur / régulateur de champ, principal |
| `mag_field_generator_steering` | Générateur / régulateur de champ, pilotage |
| `electron_injector_manifold` | Collecteur d'injection |
| `electron_regulator` | Régulateur d'électrons |
| `electron_generator` | Générateur d'électrons |
| `radius_sensor_main` | Capteur de rayon, principal |
| `radius_sensor_steering` | Capteur de rayon, pilotage |
| `cooling_housing_main` | Logement de refroidissement, principal |
| `cooling_housing_steering` | Logement de refroidissement, pilotage |
| `cooling_pump` | Pompe de refroidissement |
| `cooling_tank` | Réserve de refroidissement |
| `gravity_sensor_unit` | Capteur de gravité / VGL |
| `cesium_clock_1` `cesium_clock_2` | Horloges au césium (2, plus compactes qu'en 2001) |
| `control_computer` | Ordinateur de contrôle |
| `battery_pack` | Batterie |

Actions GLB branchées (28 clips, un seul `AnimationMixer`) : `idle` (4 s, boucle, au repos), `lid_open` (1 s, ouvrir le couvercle), `explode` (2 s, vue éclatée), `assemble_01`…`assemble_24` (1,5 s, étapes 1–24), `assemble_all` (8 s). LoopOnce + clampWhenFinished pour tout sauf `idle`. L'étape 25 (vue d'ensemble) revient à la pose finale + `idle`. Si un clip manque, repli sur l'interpolation. Les nœuds sont trouvés par `getObjectByName`, sans supposer qu'ils sont tous enfants directs de la racine (l'écran est enfant du couvercle).

### Voiture — racine `lexus_lc_root`

Silhouette de cabriolet générique, **sans aucun logo ni marque** (pas d'emblème, pas de calandre « spindle »). Dimensions extérieures : **4,77 × 1,92 × 1,35 m** (L × l × H). Origine au sol, au milieu de l'empattement (2,87 m). Avant vers +Z (Three.js).

| Nœud | Rôle |
|---|---|
| `lexus_lc_root` | Racine de la voiture |
| `body` | Caisse |
| `hood` | Capot |
| `rear_deck` | Coffre / plage arrière |
| `grille` | Calandre générique à lames horizontales (pas de forme déposée) |
| `bumper_front` `bumper_rear` | Pare-chocs |
| `windshield` | Pare-brise |
| `window_left` `window_right` | Vitres latérales |
| `convertible_top` | Capote repliée (à l'arrière) |
| `dashboard` | Tableau de bord (générique, sans marque) |
| `steering_wheel` | Volant (à gauche, conduite Canada) |
| `seat_driver` | Siège conducteur (gauche, +X) |
| `seat_passenger` | Siège passager (droite, −X) |
| `seat_rear_driver` | Banquette arrière côté conducteur |
| `wheel_fl` `wheel_fr` `wheel_rl` `wheel_rr` | Roues (avant gauche, avant droite, arrière gauche, arrière droite) |
| `headlight_l` `headlight_r` | Projecteurs |
| `taillight_l` `taillight_r` | Feux arrière |
| `mirror_l` `mirror_r` | Rétroviseurs (comptent dans la largeur 1,92 m) |
| **`c204_2026_unit`** | **Point d'ancrage** : groupe vide à l'arrière côté passager (−X, −Z). L'unité (`c204_2026_root`) est enfant de ce nœud. |

Position de `c204_2026_unit` (Lexus GLB, espace `lexus_lc_root`) : **x = −0,33 m, y = 0,2981 m, z = −0,88 m** (avant en +Z, côté passager = −X, conducteur à gauche = +X), rotation 0. L'app parent l'unité sur ce nœud (`getObjectByName`), sans hardcoder la position — `MOUNT_POS` (−0,38 ; 0,30 ; −0,92) ne sert que de repli pour la voiture procédurale. L'unité ne traverse ni la caisse ni le coffre. Pas de siège arrière côté passager (la place est prise par l'unité).

Hors-tout visible de la Lexus v6.1 (bbox du GLB) : **4,763 × 2,20 × 1,253 m** (L × l avec rétros × H). Dans le jeu, la bbox avec l'unité monte à **1,403 m** de haut. Largeur de caisse 1,92 m hors rétros. Plus de nœud `soft_top_closed` : cabriolet ouvert seulement, capote pliée (`convertible_top`) visible. Il n'y a pas de commande capote fermée.

Dans l'app : si les deux GLB sont présents, on charge la voiture, on cherche `c204_2026_unit`, et on y place `c204_2026_root` (sauf si l'unité est déjà enfant de ce nœud). Si un GLB est absent (`url` null ou fichier manquant), repli sur les primitives du même nom.

## Ordre d'assemblage (mode « Assemblage à la maison »)

Guide fictif, étape par étape, pièce par pièce. Boutons Précédent / Suivant. La pièce de l'étape est surlignée et vient se placer. Bannière visible : **« Guide fictif — pas un vrai plan »**.

| Étape | Nœuds qui se placent | Titre court |
|---:|---|---|
| 1 | `housing` | Poser le boîtier |
| 2 | `cooling_housing_main` | Logement de refroidissement principal |
| 3 | `cooling_housing_steering` | Logement de refroidissement de pilotage |
| 4 | `cooling_tank` | Réserve de refroidissement |
| 5 | `cooling_pump` | Pompe de refroidissement |
| 6 | `mag_field_generator_main` | Générateur de champ principal |
| 7 | `mag_field_generator_steering` | Générateur de champ de pilotage |
| 8 | `singularity_main_housing` | Logement de singularité principale |
| 9 | `singularity_steering_housing` | Logement de singularité de pilotage |
| 10 | `field_coil_main_1` `field_coil_main_2` `field_coil_main_3` | Bobines de champ principales |
| 11 | `field_coil_steering_1` `field_coil_steering_2` `field_coil_steering_3` | Bobines de champ de pilotage |
| 12 | `electron_generator` | Générateur d'électrons |
| 13 | `electron_regulator` | Régulateur d'électrons |
| 14 | `electron_injector_manifold` | Collecteur d'injection |
| 15 | `gravity_sensor_unit` | Capteur de gravité |
| 16 | `radius_sensor_main` | Capteur de rayon principal |
| 17 | `radius_sensor_steering` | Capteur de rayon de pilotage |
| 18 | `cesium_clock_1` | Première horloge au césium |
| 19 | `cesium_clock_2` | Seconde horloge au césium |
| 20 | `control_computer` | Ordinateur de contrôle |
| 21 | `battery_pack` | Batterie |
| 22 | `touchscreen` | Écran tactile |
| 23 | `led_status` | Barrette LED |
| 24 | `lid` | Fermer le couvercle |
| 25 | _(aucun, vue d'ensemble)_ | Placer l'unité dans le véhicule |

## `assets/model.json`

```json
{
  "unit": { "url": "assets/c204-2026.glb", "path": "assets/c204-2026.glb", "root": "c204_2026_root" },
  "car":  { "url": "assets/lexus-lc-v61.glb", "path": "assets/lexus-lc-v61.glb", "root": "lexus_lc_root", "mount": "c204_2026_unit" }
}
```

Les deux GLB sont branchés (`url` égal à `path`). Laisser `url` à `null` évite un 404 et déclenche le repli primitives.


## v0.1 — 11 nov. 2026 (provisoire)

- App Three.js r170, dépôt `passcool17/c204-2026`, modèles en primitives (aucun GLB encore : `assets/model.json` a `url: null`).
- Trois modes : Vue (unité dans le cabriolet, à l'arrière côté passager), Éclatée (interpolation des positions), Assemblage à la maison (25 étapes, dont 24 pièces + vue d'ensemble). Bannière « Guide fictif — pas un vrai plan ».
- Lien vers https://passcool17.github.io/titor-c204/. Le lien retour dans titor-c204 est à ajouter plus tard (dépôt en pause, non modifié).
- Dimensions mesurées (primitives) : unité 0,33 × 0,29 × 0,72 m (cible 0,32 × 0,26 × 0,72 ; un peu plus haute à cause de l'écran sur le dessus) ; voiture 1,92 × 1,33 × 4,80 m (cible 1,92 × 1,35 × 4,77). Point d'ancrage `c204_2026_unit` à (−0,38 ; 0,30 ; −0,92).
- Tests Playwright : `/workspace/games3d/c204-2026-tests/t01.js`, 412×915 et 915×412, 54 assertions, 0 échec, 0 erreur console, 0 réponse 404. Captures : `/workspace/games3d/c204-2026-v01.png` (vue) et `c204-2026-v01-assemblage.png` (étape 10).
- Fps réel du S20 et Safari non mesurés (la box rend en logiciel).

## v0.2.0 — 11 nov. 2026

- Unité GLB branchée : `assets/c204-2026.glb` (chaîne 3D de Pascal, propre au projet). `assets/model.json` a `unit.url = "assets/c204-2026.glb"`. Voiture toujours provisoire. Repli primitives si le chargement échoue.
- 28 clips du GLB remplacent l'interpolation : `idle` au repos, `lid_open`, `explode`, `assemble_NN` pour les étapes 1–24, pose finale + `idle` à l'étape 25. Un seul mixer, arrêt/reprise propres, LoopOnce + clampWhenFinished sauf `idle`.
- Ancrage actuel (voiture provisoire) : (−0,38 ; 0,30 ; −0,92), côté passager −X. Échelle du GLB déjà conforme (≈ 0,36 × 0,27 × 0,73 m, avant +Z) — pas de correction. L'ancre exacte de la Lexus finale sera (−0,33 ; 0,2981 ; −0,88).
- Tests Playwright locaux : t01.js 60/60, t02.js 24 fiches en 915×412 et 412×915, 0 erreur console, 0 fiche sans nœud, 0 fiche sous la barre. Captures : `/workspace/games3d/c204-2026-v02.png` (vue, portrait 412×915) et `c204-2026-v02-eclate.png` (vue éclatée).
- Fps réel du S20 et Safari non mesurés (la box rend en logiciel).

## v0.3.0 — 11 nov. 2026

- Voiture GLB branchée : `assets/lexus-lc.glb` v3.2 (chaîne 3D de Pascal, propre au projet ; portes corrigées, plus de clip). `assets/model.json` a `car.url = "assets/lexus-lc.glb"`. Unité inchangée. Repli primitives si le chargement échoue.
- Ancrage par le nœud `c204_2026_unit` du GLB : **(−0,33 ; 0,2981 ; −0,88)**. Position monde de l'unité = position monde du nœud. `MOUNT_POS` conservé seulement pour le repli procédural.
- 3 clips voiture, mixer séparé (les 28 clips de l'unité restent identiques à la v0.2.0) : `idle` en boucle (pose fixe, clés constantes), `doors_open` et `wheels_roll` en LoopOnce + clampWhenFinished. `wheels_roll` en mode Vue, `doors_open` en Éclatée et en Assemblage. `soft_top_closed` reste caché.
- Hors-tout visible : 4,771 × 2,10 × 1,341 m (rétros compris dans la largeur). verify-glb : 0 erreur de validation, 0 erreur console, `doors_open` et `wheels_roll` bougent ; `idle` ne déplace rien (pose fixe acceptée, seul motif du FAIL).
- Tests Playwright locaux : t01.js 70/70, t02.js 24 fiches en 915×412 et 412×915, 0 erreur console, 0 fiche sans nœud, 0 fiche sous la barre. Captures : `/workspace/games3d/c204-2026-v03.png` (vue, portrait 412×915) et `c204-2026-v03-eclate.png` (vue éclatée).
- Fps indicatifs (SwiftShader, pas le S20) : portrait 412×915 Vue 4,8 / Éclatée 4,9 ; paysage 915×412 Vue 6,2 / Éclatée 4,8. Plus bas qu'en v0.2.0 (beaucoup plus d'appels de rendu avec la Lexus). Fps réel du S20 et Safari non mesurés.

## v0.3.1 — 11 nov. 2026

- Pas de ré-export du GLB. Au chargement de la Lexus : le verre `KHR_materials_transmission` + IOR est remplacé par un `MeshStandardMaterial` transparent (opacité 0,35, `depthWrite` false, FrontSide, même teinte) ; les matériaux opaques passent en FrontSide (aucun trou visible, pas besoin de DoubleSide) ; les meshes opaques statiques qui partagent l'atlas sont fusionnés (`mergeGeometries`, transforms cuites dans `lexus_lc_root`). Portes, roues et leurs enfants, `c204_2026_unit` et `convertible_top` restent séparés (clips et masquage). `shadowMap` reste désactivé, `pixelRatio` plafonné à 2.
- Différence visuelle avec la v0.3.0 : le pare-brise et les vitres sont un peu plus « plats » (plus de réfraction ni de second passage de transmission). Peinture, habitacle, unité et ancrage inchangés. Pas de trou.
- Perf SwiftShader (indicatif, pas le S20), avant (v0.3.0 / QA) → après (v0.3.1) :

| Vue | 412×915 | 915×412 | 1280×800 |
|---|---|---|---|
| Vue v0.3.0 | 5,1 · 221 appels · 31 130 tri | 6,4 · 231 appels · 32 218 tri | 2,8 · 231 appels · 32 218 tri |
| Vue v0.3.1 | **22,3** · **86 appels** · **16 177 tri** | **27,8** · 86 appels · 16 177 tri | **14,1** · 86 appels · 16 177 tri |
| Éclatée v0.3.0 | 4,2 · 157 appels | 3,8 · 181 appels | 2,0 · 185 appels |
| Éclatée v0.3.1 | **13,9** · ~83 appels · 16 001 tri | **14,9** | **7,1** |
| Vue v0.2.0 (réf.) | 33,1 · 116 appels · 5 424 tri | 50,4 | 21,1 |

  Les appels de rendu sont sous le niveau v0.2.0 (86 < 116). Les fps remontent d'environ 4 à 5 fois par rapport à la v0.3.0, mais restent sous la v0.2.0 (22 vs 33 en Vue 412) : la Lexus a toujours plus de triangles (≈ 16 k soumis vs 5 424) et trois atlas WebP 1024. Fps réel du S20 non mesuré.
- Tests Playwright : t01.js 81/81 (dont appels ≤ 140 et aucun matériau transmission), t02.js 24 fiches en 915×412 et 412×915, 0 erreur console. Captures : `/workspace/games3d/c204-2026-v031.png` (vue, 412×915) et `c204-2026-v031-eclate.png`.

## v0.3.2 — 11 nov. 2026

- Voiture GLB remplacée par la Lexus v3.3 (`assets/lexus-lc.glb`, 123 584 o), exportée par la chaîne 3D de Pascal (Modélisation, Rig, Rendu), modèle original propre au projet. Unité inchangée (`assets/c204-2026.glb`). `assets/model.json` inchangé (`car.url` = `assets/lexus-lc.glb`).
- Dans le GLB : meshes opaques statiques déjà fusionnés par matériau sous `lexus_lc_root` (13 meshes, 13 appels voiture). Nœuds animés inchangés : `body`, `door_L`, `door_R`, `wheel_fl`, `wheel_fr`, `wheel_rl`, `wheel_rr`. Ancre `c204_2026_unit` identique (−0,33 ; 0,2981 ; −0,88). Plus de `KHR_materials_transmission` ; le verre est en alpha BLEND 0,45. Les noms de pièces statiques (`convertible_top`, `hood`, sièges, etc.) sont des nœuds vides, sans mesh.
- Optimisations au chargement conservées en repli inoffensif : remplacement du verre transmission s'il réapparaît ; FrontSide sur les opaques ; `mergeGeometries` seulement s'il reste au moins 2 meshes opaques non protégés (saute donc sur ce GLB déjà fusionné). `body` est protégé (cible du clip `idle`). On ne bascule plus `visible` ni les matériaux sur un nœud statique devenu vide. Les vitres latérales, encore des meshes enfants des portes, restent masquées en Éclatée / Assemblage. `wheels_roll` en Vue, `doors_open` en Éclatée et Assemblage, comme avant.
- verify-glb : 0 erreur de validation, 0 erreur console, bbox 2,10 × 1,58 × 4,77 m, capture non vide. `doors_open` et `wheels_roll` bougent ; `idle` ne déplace rien (pose fixe volontaire, seul motif du FAIL, comme en v0.3.0).
- Différence visuelle avec la v0.3.1 : le verre reprend l'opacité 0,45 du GLB (un peu moins plat que le substitut 0,35 de la v0.3.1). En gros plan Éclatée / Assemblage, la capote repliée ne peut plus être masquée à part (sa géométrie est fondue dans `body`) ; l'unité reste lisible. Portes, roues, habitacle et ancrage inchangés.
- Perf SwiftShader (indicatif, pas le S20), v0.3.1 → v0.3.2 :

| Vue | 412×915 | 915×412 | 1280×800 |
|---|---|---|---|
| Vue v0.3.1 | 22,3 · 86 appels · 16 177 tri | 27,8 · 86 appels · 16 177 tri | 14,1 · 86 appels · 16 177 tri |
| Vue v0.3.2 | **20,1** · **89 appels** · **16 261 tri** | **30,4** · 89 appels · 16 261 tri | **13,4** · 89 appels · 16 261 tri |
| Éclatée v0.3.1 | 13,9 · ~83 appels · 16 001 tri | 14,9 | 7,1 |
| Éclatée v0.3.2 | **10,7** · **70 appels** · **13 257 tri** | **12,9** | **7,5** · 85 appels |

  Budget respecté : 89 appels en Vue (< 100). Les 89 viennent de 13 meshes Lexus + 69 meshes unité + 1 sol, plus quelques appels (verre, sur-dessin). Un peu plus d'appels et de triangles qu'en v0.3.1 (plus de fusion `body` + pare-chocs au chargement, volontaire pour garder `body` animable). Fps du même ordre. Fps réel du S20 non mesuré.
- Tests Playwright locaux : t01.js 81/81 (appels < 100 en Vue, aucun matériau transmission), t02.js 24 fiches en 915×412 et 412×915, 0 erreur console, 0 fiche sans nœud, 0 fiche sous la barre. Captures : `/workspace/games3d/c204-2026-v032.png` (vue, portrait 412×915) et `c204-2026-v032-eclate.png` (vue éclatée).

## v0.4.0 — 11 nov. 2026

- Voiture GLB remplacée par la Lexus v4.5 (`assets/lexus-lc.glb`, 195 188 o), exportée par la chaîne 3D de Pascal (Modélisation, Rig, Rendu), modèle original propre au projet. Unité inchangée (`assets/c204-2026.glb`). `assets/model.json` inchangé (`car.url` = `assets/lexus-lc.glb`).
- Dans le GLB : 9 meshes, 17 nœuds, un seul matériau `Lexus_LC_2026_v4_Atlas` (`MeshPhysicalMaterial`, `KHR_materials_clearcoat` 0,65 / rugosité 0,06, DoubleSide à l'export). Pas de `KHR_materials_transmission`, pas de matériau verre (aucun alpha BLEND). Nœuds animés inchangés : `body`, `door_L`, `door_R`, `wheel_fl`, `wheel_fr`, `wheel_rl`, `wheel_rr`. Ancre `c204_2026_unit` identique (−0,33 ; 0,2981 ; −0,88). `soft_top_closed` est de nouveau un mesh séparé, masqué au chargement par nom. Nouveau nœud `interior` (vide, sans mesh : sièges et habitacle sont fondus dans `body`). Les anciens noms statiques (`bumper_front`, `hood`, `windshield`, `window_left`, `window_right`, `mirror_l`, etc.) n'existent plus, fondus dans `body` ou `door_*`.
- Optimisations au chargement conservées en repli inoffensif (pas de transmission à remplacer ; `mergeGeometries` saute, déjà fusionné ; FrontSide sur les opaques). `setCarObstruction` ne bascule que les nœuds qui ont encore un mesh : en v4.5, plus rien n'est masqué de cette façon (`window_left` / `window_right` / `windshield` absents, `convertible_top` nœud vide). `wheels_roll` en Vue, `doors_open` en Éclatée et Assemblage, comme avant.
- verify-glb : 0 erreur de validation, 0 erreur console, bbox 2,06 × 1,50 × 4,77 m, capture non vide. `doors_open` et `wheels_roll` bougent ; `idle` ne déplace rien (pose fixe volontaire, seul motif du FAIL).
- Verre et visibilité de l'unité : il n'y a plus de vitre transparente. Pare-brise et glaces latérales sont opaques, peints dans l'atlas et fondus dans `body` / `door_*`. On ne peut plus voir l'unité à travers les glaces, ni les cacher en gros plan. L'habitacle reste ouvert (capote fermée masquée). L'unité est bien à l'ancre, derrière le siège passager ; en Vue par défaut (trois-quarts arrière), elle est surtout cachée par le bas de caisse et la capote pliée fondue dans `body`. Elle redevient bien visible dès qu'on monte un peu la caméra, et en Éclatée (portes ouvertes, gros plan). Clearcoat conservé : le budget tient et les fps restent du même ordre, au prix d'un shader `MeshPhysicalMaterial` plus cher.
- Perf SwiftShader (indicatif, pas le S20), v0.3.2 → v0.4.0 :

| Vue | 412×915 | 915×412 | 1280×800 |
|---|---|---|---|
| Vue v0.3.2 | 20,1 · 89 appels · 16 261 tri | 30,4 · 89 appels · 16 261 tri | 13,4 · 89 appels · 16 261 tri |
| Vue v0.4.0 | **17,7** · **81 appels** · **32 851 tri** | **25,1** · 81 appels · 32 851 tri | **12,6** · 81 appels · 32 851 tri |
| Éclatée v0.3.2 | 10,7 · 70 appels · 13 257 tri | 12,9 | 7,5 · 85 appels |
| Éclatée v0.4.0 | **11,7** · **68 appels** · **25 817 tri** | **12,1** · 78 appels | **6,0** · 80 appels |

  Budget respecté : 81 appels en Vue (< 100), un peu sous la v0.3.2 (89). Les 81 viennent de 8 meshes Lexus visibles (`soft_top_closed` déjà masqué) + 69 meshes unité + 1 sol, plus quelques appels. Environ deux fois plus de triangles (28 615 dans le GLB voiture, contre 11 925). Fps un peu plus bas en Vue (17,7 vs 20,1 à 412), malgré moins d'appels : plus de géométrie et le clearcoat. Écart acceptable, clearcoat gardé (meilleure peinture). Fps réel du S20 non mesuré.
- Tests Playwright locaux : t01.js 81/81 (appels < 100 en Vue, aucun matériau transmission), t02.js 24 fiches en 915×412 et 412×915, 0 erreur console, 0 fiche sans nœud, 0 fiche sous la barre. Captures : `/workspace/games3d/c204-2026-v040.png` (vue, portrait 412×915) et `c204-2026-v040-eclate.png` (vue éclatée).

## v0.4.1 — 11 nov. 2026

- Voiture GLB remplacée par la Lexus v4.6 (`assets/lexus-lc.glb`, 198 024 o), même chaîne 3D, modèle original. Unité inchangée. C'est la v4.5 plus le verre : 3 meshes `Lexus_Glass` (alpha BLEND 0,4, DoubleSide, pas de transmission) sur `windshield` (enfant de `lexus_lc_root`), `window_left` (enfant de `door_L`) et `window_right` (enfant de `door_R`). Ancre `c204_2026_unit` et `soft_top_closed` inchangés. 12 meshes au total (9 atlas + 3 verres).
- Au chargement : `prepareCarGlass` met le verre en transparent, `depthWrite` false, `renderOrder` 1, pour qu'il s'affiche après les opaques et laisse voir l'unité. Le côté DoubleSide livré est conservé. `setCarObstruction` cache de nouveau `windshield`, `window_left` et `window_right` en Éclatée et en Assemblage (les nœuds ont un mesh). `soft_top_closed` reste masqué dès le chargement.
- Caméra Vue un peu plus haute (portrait 3,7 / 3,55 / −3,2, cible 0 / 0,52 / −0,2 ; paysage 4,8 / 3,15 / −2,2). Sur la v4, à l'ancienne hauteur, la capote pliée et le bas de caisse masquaient l'unité derrière la tôle, même avec le verre. En Vue 412×915, l'unité (écran allumé) se lit clairement dans l'habitacle ; le pare-brise est transparent, sans artefact de tri visible. Correctif du bogue QA n°1 (unité illisible en Vue).
- verify-glb : 0 erreur de validation, 0 erreur console, bbox 2,06 × 1,50 × 4,77 m, 28 663 triangles. `doors_open` et `wheels_roll` bougent ; `idle` reste une pose fixe (seul motif du FAIL).
- Perf SwiftShader (indicatif, pas le S20), v0.4.0 → v0.4.1 :

| Vue | 412×915 | 915×412 | 1280×800 |
|---|---|---|---|
| Vue v0.4.0 | 17,7 · 81 appels · 32 851 tri | 25,1 · 81 appels · 32 851 tri | 12,6 · 81 appels · 32 851 tri |
| Vue v0.4.1 | **19,6** · **87 appels** · **33 043 tri** | **24,7** · 87 appels · 33 043 tri | **12,4** · 87 appels · 33 043 tri |
| Éclatée v0.4.0 | 11,7 · 68 appels · 25 817 tri | 12,1 · 78 appels | 6,0 · 80 appels |
| Éclatée v0.4.1 | **12,9** · **68 appels** · **25 721 tri** | **13,3** · 78 appels · 28 883 tri | **5,6** · 78 appels |
| Assemblage v0.4.1 | **12,8** · **68 appels** · **25 721 tri** | **12,4** · 78 appels · 28 883 tri | **5,9** · 78 appels |

  Budget respecté : 87 appels en Vue (< 100). Les 6 appels de plus qu'en v0.4.0 sont le verre (3 meshes, pass transparent). En Éclatée / Assemblage les vitres sont cachées, donc le même nombre d'appels qu'en v0.4.0 à 412. Fps du même ordre, un peu mieux en Vue 412 (caméra un peu plus haute, variance SwiftShader). Clearcoat conservé. Fps réel du S20 non mesuré.
- Tests Playwright locaux : t01.js 81/81 (appels < 100 dans toutes les vues, aucun matériau transmission, 3 nœuds verre présents), t02.js 24 fiches en 915×412 et 412×915, 0 erreur console. Captures : `/workspace/games3d/c204-2026-v041.png` (vue, portrait 412×915) et `c204-2026-v041-eclate.png` (vue éclatée).


## v0.5.0 — 12 nov. 2026

- Voiture GLB remplacée par la Lexus v5 (`assets/lexus-lc.glb`, 364 260 o), même chaîne 3D, modèle original, peinture **Structural Blue**. Unité inchangée. Compression : meshopt + quantification des maillages + textures WebP 1024 (plus de Draco sur ce fichier). 30 679 triangles, 16 appels voiture (10 `Lexus_Atlas_v5`, 1 `Shut_Occluder_Black`, 2 `Lexus_SoftTop_v5`, 3 `Lexus_Glass` alpha BLEND 0,4 DoubleSide, pas de transmission). `soft_top_closed` masqué au chargement (15 appels voiture visibles en Vue).
- Les meshes sont des enfants sans nom des nœuds nommés (offset de quantification). `prepareCarGlass`, `setCarObstruction` et le masquage de `soft_top_closed` passent encore par le nœud nommé + parcours des descendants : le verre est transparent, `depthWrite` false, `renderOrder` 1 ; en Éclatée et Assemblage, `windshield`, `window_left`, `window_right` et `convertible_top` sont cachés. `grille` et `steering_wheel` sont dans `CAR_KEEP_SEPARATE` pour ne pas fusionner leurs meshes. Ancre `c204_2026_unit` identique (−0,33 ; 0,2981 ; −0,88) ; l'unité y est bien montée.
- Peinture métallique + clearcoat : sans carte d'environnement, la caisse restait noire sous les seules lumières de la scène. Au chargement, un `RoomEnvironment` est cuit une fois (PMREM) et appliqué seulement aux matériaux de la voiture (`envMapIntensity` 0,55). Ce n'est pas un second passage de rendu par image. Ombres toujours désactivées.
- verify-glb : 0 erreur de validation, 0 erreur console, bbox 2,16 × 1,35 × 4,76 m, 30 679 triangles. `doors_open` et `wheels_roll` bougent ; `idle` reste une pose fixe (seul motif du FAIL, accepté comme en v4.6).
- Perf locale, `measure.mjs --gl angle-gl` (backend ANGLE/llvmpipe sur la box — les fps ne valent pas ceux du S20), portrait 412×915, 10 s par vue :

| Vue | Appels | Triangles | Temps JS médian / p95 | Fps box (indicatif) |
|---|---|---|---|---|
| Vue | **91** | **33 031** | 0,6 / 1,1 ms | 36,3 |
| Éclatée | **69** | **21 253** | 0,5 / 0,8 ms | 39,6 |
| Assemblage | **69** | **21 253** | 0,5 / 1,8 ms | 27,0 |

  Budget respecté : 91 appels en Vue (< 100), conforme à l'estimation de Rendu (87 − 12 + 16 = 91). 0 erreur console, pas de transmission. En Éclatée / Assemblage les vitres et la capote pliée visible sont cachées, d'où moins d'appels et de triangles. Fps réel du S20 non mesuré pour cette version (v0.4.1 : 59 fps sur Galaxy S20 FE).
- Tests Playwright locaux : t01.js 81/81 (appels < 100 dans toutes les vues, aucun matériau transmission, nœuds verre et ancre OK), t02.js 24 fiches en 915×412 et 412×915, 0 erreur console. Cette version n'a pas été poussée : le lien GitHub Pages reste la v0.4.1. Captures : `/workspace/games3d/c204-2026-v050.png` (vue, portrait 412×915), `c204-2026-v050-eclate.png` (vue éclatée), `c204-2026-v050-compare.png` (montage 3/4 avant, profil, 3/4 arrière vs photos dans `/workspace/assets3d/c204-2026/references/lc500/`).

## v0.5.1 — lien vers le jeu Mission Titor (12 nov. 2026)
Demande de Pascal (relais Chef de cabinet : « link both ways to all 3 ») : ajouter un lien discret vers le jeu 3D, sans changer le rendu, les GLB ni le fonctionnement.
- Un seul lien « Jeu : Mission Titor » dans l'en-tête (`#top`, sous le sous-titre). Cible : https://passcool17.github.io/titor-c204-jeu/ (nouvel onglet). Le bouton « C204 2001 » est inchangé.
- L'en-tête gagne une ligne ; le texte d'aide est un peu plus bas. Ni les appels de dessin, ni les GLB, ni les modes Vue / Éclatée / Assemblage ne changent.
- **Draw calls** (`measure.mjs --gl angle-gl`, 412×915, inchangés par rapport à la v0.5.0) : Vue **91** / 33 031 ; Éclatée **69** / 21 253 ; Assemblage **69** / 21 253. 0 erreur console, pas de transmission.
- Tests : t01.js 81/81, t02.js 24 fiches en 412×915 et 915×412, 0 erreur console. Captures : `/workspace/games3d/c204-2026-v051.png`.

## v0.6.0 — Lexus v6.1 cuivre, cabriolet ouvert (13 nov. 2026)

Livraison Rendu (GLB v6.1, après Rig de la v6.1 approuvée par Pascal) : remplacement de la Lexus v5 (Structural Blue, `soft_top_closed` masqué) par le modèle cuivre, capote ouverte seulement.

- Fichier jeu : `assets/lexus-lc-v61.glb` (638 224 o, md5 `a376b2d2992faa590681377e89d39f72`). Ancien `assets/lexus-lc.glb` (v5) retiré du dépôt ; repli : `/workspace/assets3d/c204-2026/glb/backup/lexus-lc.v5.glb`. `assets/model.json` pointe vers le nom versionné. `VERSION` = 0.6.0, cache-bust `?v=0.6.0`.
- KTX2 : transcodeur Basis local (`vendor/basis/`, même révision que three@0.170.0), `detectSupport(renderer)`, MeshoptDecoder déjà en place. Géométrie quantifiée décodée en Float32 avant un éventuel merge.
- Service worker manuel ajouté (`sw.js?v=` + VERSION). Basis précaché, GLB non précachés.
- `soft_top_closed` absent : tous les `getObjectByName('soft_top_closed')` sont protégés (pas de crash). Pas de commande capote fermée à masquer. Crédit Ddiaz Design CC BY-NC-SA 4.0 dans GAME.md et en bas du panneau Pièces. Usage non commercial. Aucune recoloration de la peinture par nom de matériau (la teinte cuivre du GLB est conservée). Unité, ancre `c204_2026_unit` (−0,33 ; 0,2981 ; −0,88) et clips inchangés.
- **Draw calls** (`measure.mjs --gl angle-gl`, backend ANGLE/llvmpipe sur la box — les fps ne valent pas ceux du S20), 10 s par vue :

| Vue | 412×915 appels / tris | 915×412 appels / tris | v5 412×915 (réf.) |
|---|---:|---:|---:|
| Vue | **93** / **39 143** | **93** / **39 143** | 91 / 33 031 |
| Éclatée | **72** / **28 823** | **82** / **32 156** | 69 / 21 253 |
| Assemblage | **72** / **28 823** | **82** / **32 156** | 69 / 21 253 |

  Budget respecté : tous les modes < 100 appels (max 93). +2 appels et +6 112 triangles en Vue par rapport à la v5 (capote pliée visible, freins, plus de géométrie). 0 erreur console, pas de transmission. En Éclatée / Assemblage les vitres et la capote pliée sont cachées (moins d'appels) ; en paysage la caméra plus large laisse plus de caisse dans le frustum (82 appels). `measure.mjs` surestime la VRAM textures (115 Mo, largeur×hauteur×4) ; `gltf-transform inspect` donne gpuSize 3,50 Mo.
- Tests Playwright locaux : t01.js 81/81, t02.js 24 fiches en 412×915 et 915×412, 0 erreur console. Les 3 clips voiture se jouent (`idle`, `doors_open`, `wheels_roll`). Portes ouvertes et roues vérifiées à l'écran.
- Captures 412×915 : `/workspace/games3d/c204-2026-v61.png` (vue), `c204-2026-v61-eclate.png`, `c204-2026-v61-portes.png`, `c204-2026-v61-paysage.png` (915×412), `c204-2026-v61-34-avant.png`, `c204-2026-v61-profil.png`, `c204-2026-v61-arriere.png`, `c204-2026-v61-34-arriere.png`. Montage vs photos de `/workspace/assets3d/c204-2026/references/lc500/` : `/workspace/games3d/c204-2026-v61-vs-refs.jpg`.
- Contrôle visuel (vue, 3/4 avant, profil, 3/4 arrière) : échelle et orientation correctes, silhouette de LC 500 convertible reconnaissable, bien mieux que la v5 très basique. Peinture cuivre lisible, pas de textures noires (KTX2 OK). Limites visibles : intérieur très blanc / peu ombré ; joints de porte et d'aile un peu marqués ; feux arrière peu lumineux par rapport aux photos ; prise d'air avant un peu creuse ; le profil de référence a la capote fermée, le jeu est ouvert seulement. Fps réel du S20 non mesuré pour cette version (v0.4.1 : 59 fps sur Galaxy S20 FE).

## Prochaines étapes

- Test QA à la taille mobile et mesure fps réelle sur S20 FE (`?fps=1`).
- Safari, PWA hors ligne sur téléphone, et verrouillage d'orientation non testés.
- Capote fermée : absente du GLB v6.1. Si le jeu en a besoin, le demander à Modélisation (via Chef de cabinet), pas un correctif local.
