// Fiches et étapes. Version fictive inspirée du récit de John Titor
// (document fictif, non vérifié). Aucune machine réelle de ce type
// n'a été démontrée. Le guide d'assemblage n'est pas un vrai plan.

export const VERSION = '0.1.1';

export const FRAME =
  'Version fictive inspirée du récit de John Titor (document fictif, non vérifié). Aucune machine réelle de ce type n\'a été démontrée.';

export const ROOTS = {
  unit: 'c204_2026_root',
  car: 'lexus_lc_root',
  mount: 'c204_2026_unit',
};

export const UNIT_SIZE = { l: 0.72, w: 0.32, h: 0.26 };
export const CAR_SIZE = { l: 4.77, w: 1.92, h: 1.35, wb: 2.87 };
export const MOUNT_POS = { x: -0.38, y: 0.30, z: -0.92 };

export const PARTS = {
  housing: {
    fr: 'Boîtier principal', en: 'Main housing',
    body: 'Coffre compact qui contient toute l\'unité 2026. Même forme générale que la C204 d\'origine, en plus petit (environ 0,72 × 0,32 × 0,26 m).',
    note: 'Dans cette version fictive, le boîtier est prévu pour tenir à l\'arrière côté passager d\'un cabriolet.',
  },
  lid: {
    fr: 'Couvercle', en: 'Lid',
    body: 'Couvercle à charnière arrière. Il ferme le dessus du boîtier une fois les pièces en place.',
    note: 'Dans le guide fictif, on le pose en dernier.',
  },
  touchscreen: {
    fr: 'Écran tactile', en: 'Touchscreen',
    body: 'Panneau tactile en façade, ajout de cette version fictive 2026. Il remplace l\'écran d\'urgence et la télécommande de 2001.',
    note: 'Affichage simulé uniquement : aucun vrai logiciel de commande.',
  },
  led_status: {
    fr: 'Barrette LED d\'état', en: 'Status LED bar',
    body: 'Bande lumineuse sur le chant avant du boîtier, ajout de cette version fictive 2026.',
    note: 'Voyants décoratifs dans la simulation.',
  },
  singularity_main_housing: {
    fr: 'Logement de singularité principale', en: 'Main singularity housing',
    body: 'Selon le récit de Titor, un logement magnétique contient une micro-singularité qui produirait le champ de distorsion. Ici : un boîtier compact, vide de tout contenu réel.',
    note: 'Aucune singularité n\'a jamais été produite ni manipulée en laboratoire.',
  },
  singularity_steering_housing: {
    fr: 'Logement de singularité de pilotage', en: 'Steering singularity housing',
    body: 'Second logement, à côté du principal. Dans le récit, il servirait à orienter le champ.',
    note: 'Pièce fictive, inspirée du schéma de 2001.',
  },
  field_coil_main: {
    fr: 'Bobines de champ principales', en: 'Main field coils',
    body: 'Trois anneaux autour du logement principal. Dans le récit, un champ magnétique confinait la singularité.',
    note: 'Objet de décor dans cette simulation.',
  },
  field_coil_steering: {
    fr: 'Bobines de champ de pilotage', en: 'Steering field coils',
    body: 'Trois anneaux autour du logement de pilotage.',
    note: 'Objet de décor dans cette simulation.',
  },
  mag_field_generator_main: {
    fr: 'Générateur de champ principal', en: 'Main magnetic field generator',
    body: 'Bloc sous le logement principal. Dans le récit, il alimentait les bobines.',
    note: 'Aucun schéma électrique n\'est fourni, volontairement.',
  },
  mag_field_generator_steering: {
    fr: 'Générateur de champ de pilotage', en: 'Steering magnetic field generator',
    body: 'Bloc sous le logement de pilotage.',
    note: 'Aucun schéma électrique n\'est fourni, volontairement.',
  },
  electron_injector_manifold: {
    fr: 'Collecteur d\'injection', en: 'Electron injector manifold',
    body: 'Conduit visuel entre les deux logements. Dans le récit, il « injectait » des électrons pour modifier le champ.',
    note: 'Description reprise du récit, pas une instruction à suivre.',
  },
  electron_regulator: {
    fr: 'Régulateur d\'électrons', en: 'Electron regulator',
    body: 'Petit bloc central, inspiré de la pièce n°5 du manuel de 2001.',
    note: 'Pièce fictive.',
  },
  electron_generator: {
    fr: 'Générateur d\'électrons', en: 'Electron generator',
    body: 'Bloc compact inspiré de la pièce n°6 du manuel de 2001.',
    note: 'Pièce fictive.',
  },
  radius_sensor_main: {
    fr: 'Capteur de rayon principal', en: 'Main radius sensor',
    body: 'Petit capteur sur le logement principal, inspiré des capteurs de statut du récit.',
    note: 'Ne mesure rien dans cette simulation.',
  },
  radius_sensor_steering: {
    fr: 'Capteur de rayon de pilotage', en: 'Steering radius sensor',
    body: 'Petit capteur sur le logement de pilotage.',
    note: 'Ne mesure rien dans cette simulation.',
  },
  cooling_housing_main: {
    fr: 'Logement de refroidissement principal', en: 'Main cooling housing',
    body: 'Enveloppe autour du côté principal, inspirée des boîtiers de refroidissement de 2001.',
    note: 'Aucun liquide réel, aucun circuit à monter.',
  },
  cooling_housing_steering: {
    fr: 'Logement de refroidissement de pilotage', en: 'Steering cooling housing',
    body: 'Enveloppe autour du côté pilotage.',
    note: 'Aucun liquide réel, aucun circuit à monter.',
  },
  cooling_pump: {
    fr: 'Pompe de refroidissement', en: 'Cooling pump',
    body: 'Petite pompe compacte, inspirée de la pièce n°9 du manuel.',
    note: 'Objet de décor : ne pas y voir un vrai montage hydraulique.',
  },
  cooling_tank: {
    fr: 'Réserve de refroidissement', en: 'Cooling supply',
    body: 'Réservoir compact à l\'arrière du boîtier.',
    note: 'Objet de décor.',
  },
  gravity_sensor_unit: {
    fr: 'Capteur de gravité / VGL', en: 'Gravity sensor / Variable Gravity Lock',
    body: 'Dans le récit, le « Variable Gravity Lock » aidait à tracer la route. Ici : un bloc compact nommé d\'après cette idée.',
    note: 'Fonction non démontrée.',
  },
  cesium_clock_1: {
    fr: 'Horloge au césium 1', en: 'Cesium clock 1',
    body: 'Première des deux horloges de cette version compacte (le récit de 2001 en citait quatre).',
    note: 'Boîtier visuel, pas une vraie horloge atomique.',
  },
  cesium_clock_2: {
    fr: 'Horloge au césium 2', en: 'Cesium clock 2',
    body: 'Seconde horloge, à côté de la première.',
    note: 'Boîtier visuel, pas une vraie horloge atomique.',
  },
  control_computer: {
    fr: 'Ordinateur de contrôle', en: 'Control computer',
    body: 'Un seul ordinateur compact, à la place des trois cités en 2001. Dans le récit, ils calculaient le trajet.',
    note: 'Boîtier visuel, sans électronique réelle.',
  },
  battery_pack: {
    fr: 'Batterie', en: 'Battery pack',
    body: 'Bloc d\'alimentation de secours, inspiré de la pièce n°15 du récit.',
    note: 'Ne pas ouvrir, ne pas brancher : objet de décor uniquement.',
  },
};

export const BOM = [
  { n: 1,  id: 'housing',                      fr: 'Boîtier principal',                 en: 'Main housing',                      qty: '1', nodes: ['housing'] },
  { n: 2,  id: 'cooling_housing_main',         fr: 'Logement de refroidissement princ.', en: 'Main cooling housing',              qty: '1', nodes: ['cooling_housing_main'] },
  { n: 3,  id: 'cooling_housing_steering',     fr: 'Logement de refroidissement pilote', en: 'Steering cooling housing',          qty: '1', nodes: ['cooling_housing_steering'] },
  { n: 4,  id: 'cooling_tank',                 fr: 'Réserve de refroidissement',         en: 'Cooling supply',                    qty: '1', nodes: ['cooling_tank'] },
  { n: 5,  id: 'cooling_pump',                 fr: 'Pompe de refroidissement',           en: 'Cooling pump',                      qty: '1', nodes: ['cooling_pump'] },
  { n: 6,  id: 'mag_field_generator_main',     fr: 'Générateur de champ principal',      en: 'Main magnetic field generator',     qty: '1', nodes: ['mag_field_generator_main'] },
  { n: 7,  id: 'mag_field_generator_steering', fr: 'Générateur de champ de pilotage',    en: 'Steering magnetic field generator', qty: '1', nodes: ['mag_field_generator_steering'] },
  { n: 8,  id: 'singularity_main_housing',     fr: 'Logement de singularité principale', en: 'Main singularity housing',          qty: '1', nodes: ['singularity_main_housing'] },
  { n: 9,  id: 'singularity_steering_housing', fr: 'Logement de singularité de pilotage',en: 'Steering singularity housing',      qty: '1', nodes: ['singularity_steering_housing'] },
  { n: 10, id: 'field_coil_main',              fr: 'Bobines de champ principales',       en: 'Main field coils',                  qty: '3', nodes: ['field_coil_main_1', 'field_coil_main_2', 'field_coil_main_3'] },
  { n: 11, id: 'field_coil_steering',          fr: 'Bobines de champ de pilotage',       en: 'Steering field coils',              qty: '3', nodes: ['field_coil_steering_1', 'field_coil_steering_2', 'field_coil_steering_3'] },
  { n: 12, id: 'electron_generator',           fr: 'Générateur d\'électrons',            en: 'Electron generator',                qty: '1', nodes: ['electron_generator'] },
  { n: 13, id: 'electron_regulator',           fr: 'Régulateur d\'électrons',            en: 'Electron regulator',                qty: '1', nodes: ['electron_regulator'] },
  { n: 14, id: 'electron_injector_manifold',   fr: 'Collecteur d\'injection',            en: 'Electron injector manifold',        qty: '1', nodes: ['electron_injector_manifold'] },
  { n: 15, id: 'gravity_sensor_unit',          fr: 'Capteur de gravité / VGL',           en: 'Gravity sensor / VGL',              qty: '1', nodes: ['gravity_sensor_unit'] },
  { n: 16, id: 'radius_sensor_main',           fr: 'Capteur de rayon principal',         en: 'Main radius sensor',                qty: '1', nodes: ['radius_sensor_main'] },
  { n: 17, id: 'radius_sensor_steering',       fr: 'Capteur de rayon de pilotage',       en: 'Steering radius sensor',            qty: '1', nodes: ['radius_sensor_steering'] },
  { n: 18, id: 'cesium_clock_1',               fr: 'Horloge au césium 1',                en: 'Cesium clock 1',                    qty: '1', nodes: ['cesium_clock_1'] },
  { n: 19, id: 'cesium_clock_2',               fr: 'Horloge au césium 2',                en: 'Cesium clock 2',                    qty: '1', nodes: ['cesium_clock_2'] },
  { n: 20, id: 'control_computer',             fr: 'Ordinateur de contrôle',             en: 'Control computer',                  qty: '1', nodes: ['control_computer'] },
  { n: 21, id: 'battery_pack',                 fr: 'Batterie',                           en: 'Battery pack',                      qty: '1', nodes: ['battery_pack'] },
  { n: 22, id: 'touchscreen',                  fr: 'Écran tactile',                      en: 'Touchscreen',                       qty: '1', nodes: ['touchscreen'] },
  { n: 23, id: 'led_status',                   fr: 'Barrette LED d\'état',               en: 'Status LED bar',                    qty: '1', nodes: ['led_status'] },
  { n: 24, id: 'lid',                          fr: 'Couvercle',                          en: 'Lid',                               qty: '1', nodes: ['lid'] },
];

// 25 étapes : 24 pièces + vue d'ensemble dans le véhicule.
export const ASSEMBLY = [
  { step: 1,  id: 'housing',                      title: 'Poser le boîtier',                         text: 'Dans ce guide fictif, on pose le boîtier compact sur son support, à l\'arrière côté passager. Rien à visser pour de vrai.' },
  { step: 2,  id: 'cooling_housing_main',         title: 'Logement de refroidissement principal',    text: 'On glisse le premier logement de refroidissement dans le rail visuel du boîtier. Aucun liquide, aucun circuit.' },
  { step: 3,  id: 'cooling_housing_steering',     title: 'Logement de refroidissement de pilotage',  text: 'Même geste, de l\'autre côté. Guide fictif uniquement.' },
  { step: 4,  id: 'cooling_tank',                 title: 'Réserve de refroidissement',               text: 'On pose le petit réservoir à l\'arrière du boîtier. Objet de décor : il est vide et le reste.' },
  { step: 5,  id: 'cooling_pump',                 title: 'Pompe de refroidissement',                 text: 'On place la pompe à côté du réservoir. Pas de tuyau à brancher, ce n\'est pas un vrai montage.' },
  { step: 6,  id: 'mag_field_generator_main',     title: 'Générateur de champ principal',            text: 'On pose le premier générateur sous son logement. Aucun schéma électrique n\'est donné, volontairement.' },
  { step: 7,  id: 'mag_field_generator_steering', title: 'Générateur de champ de pilotage',          text: 'On pose le second générateur, en vis-à-vis. Toujours un guide fictif.' },
  { step: 8,  id: 'singularity_main_housing',     title: 'Logement de singularité principale',       text: 'On installe le logement principal. Dans cette fiction, il est vide : aucune « singularité » n\'existe en laboratoire.' },
  { step: 9,  id: 'singularity_steering_housing', title: 'Logement de singularité de pilotage',      text: 'On installe le second logement, à côté du premier.' },
  { step: 10, id: 'field_coil_main',              title: 'Bobines de champ principales',             text: 'Les trois anneaux se placent autour du logement principal. Décor uniquement.' },
  { step: 11, id: 'field_coil_steering',          title: 'Bobines de champ de pilotage',             text: 'Les trois anneaux du côté pilotage viennent à leur tour.' },
  { step: 12, id: 'electron_generator',           title: 'Générateur d\'électrons',                  text: 'On pose ce bloc compact à l\'avant-droit. Pas de câblage à réaliser.' },
  { step: 13, id: 'electron_regulator',           title: 'Régulateur d\'électrons',                  text: 'Le petit régulateur se glisse au centre, entre les deux logements.' },
  { step: 14, id: 'electron_injector_manifold',   title: 'Collecteur d\'injection',                  text: 'Le conduit visuel relie les deux côtés. Description inspirée du récit, pas une instruction technique.' },
  { step: 15, id: 'gravity_sensor_unit',          title: 'Capteur de gravité',                       text: 'On pose le bloc « VGL », nommé d\'après une idée du récit. Il ne mesure rien ici.' },
  { step: 16, id: 'radius_sensor_main',           title: 'Capteur de rayon principal',               text: 'Un petit capteur se pose sur le logement principal.' },
  { step: 17, id: 'radius_sensor_steering',       title: 'Capteur de rayon de pilotage',             text: 'Le capteur jumeau se pose de l\'autre côté.' },
  { step: 18, id: 'cesium_clock_1',               title: 'Première horloge au césium',               text: 'On pose la première des deux horloges compactes. Boîtier visuel, pas une vraie horloge atomique.' },
  { step: 19, id: 'cesium_clock_2',               title: 'Seconde horloge au césium',                text: 'La seconde horloge vient à côté de la première.' },
  { step: 20, id: 'control_computer',             title: 'Ordinateur de contrôle',                   text: 'Un seul ordinateur compact, à la place des trois cités en 2001. Aucun logiciel à installer.' },
  { step: 21, id: 'battery_pack',                 title: 'Batterie',                                 text: 'On pose le bloc batterie. Ne pas l\'ouvrir ni le brancher : objet de décor uniquement.' },
  { step: 22, id: 'touchscreen',                  title: 'Écran tactile',                            text: 'L\'écran tactile 2026 se clipse en façade. Affichage simulé, sans vraie commande.' },
  { step: 23, id: 'led_status',                   title: 'Barrette LED',                             text: 'La bande lumineuse se pose sur le chant avant. Voyants décoratifs.' },
  { step: 24, id: 'lid',                          title: 'Fermer le couvercle',                      text: 'On rabat le couvercle. L\'unité fictive est assemblée, toujours sans aucun plan réel.' },
  { step: 25, id: null,                           title: 'Placer l\'unité dans le véhicule',         text: 'L\'unité est déjà à sa place : à l\'arrière, côté passager, sur le point d\'ancrage prévu. Fin du guide fictif.' },
];

// Préfixe le plus long d'abord, pour le branchement des GLB.
export const NAME2ID = {
  housing: 'housing',
  lid: 'lid',
  touchscreen: 'touchscreen',
  led_status: 'led_status',
  singularity_main_housing: 'singularity_main_housing',
  singularity_steering_housing: 'singularity_steering_housing',
  field_coil_main: 'field_coil_main',
  field_coil_steering: 'field_coil_steering',
  mag_field_generator_main: 'mag_field_generator_main',
  mag_field_generator_steering: 'mag_field_generator_steering',
  electron_injector_manifold: 'electron_injector_manifold',
  electron_regulator: 'electron_regulator',
  electron_generator: 'electron_generator',
  radius_sensor_main: 'radius_sensor_main',
  radius_sensor_steering: 'radius_sensor_steering',
  cooling_housing_main: 'cooling_housing_main',
  cooling_housing_steering: 'cooling_housing_steering',
  cooling_pump: 'cooling_pump',
  cooling_tank: 'cooling_tank',
  gravity_sensor_unit: 'gravity_sensor_unit',
  cesium_clock_1: 'cesium_clock_1',
  cesium_clock_2: 'cesium_clock_2',
  control_computer: 'control_computer',
  battery_pack: 'battery_pack',
};

export function idFor(name) {
  const n = (name || '').toLowerCase();
  const keys = Object.keys(NAME2ID).sort((a, b) => b.length - a.length);
  const k = keys.find(k => n === k || n.startsWith(k + '_'));
  return k ? NAME2ID[k] : null;
}
