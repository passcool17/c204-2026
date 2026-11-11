import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import {
  VERSION, FRAME, ROOTS, UNIT_SIZE, CAR_SIZE, MOUNT_POS,
  PARTS, BOM, ASSEMBLY, idFor,
} from './data.js?v=0.31';

const $ = (s, r = document) => r.querySelector(s);
const canvas = $('#c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.45;
renderer.shadowMap.enabled = false;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1c2833);
scene.fog = new THREE.Fog(0x1c2833, 14, 36);

const camera = new THREE.PerspectiveCamera(50, 1, 0.08, 80);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 0.5;
controls.maxDistance = 16;
controls.maxPolarAngle = Math.PI * 0.49;
controls.target.set(0.05, 0.45, 0.05);
camera.position.set(4.05, 3.15, -3.55);

scene.add(new THREE.HemisphereLight(0xd0e4f6, 0x3a3228, 1.15));
const sun = new THREE.DirectionalLight(0xfff2dc, 2.35);
sun.position.set(3.5, 7, 2.5);
sun.castShadow = false;
scene.add(sun);
const fill = new THREE.DirectionalLight(0xb8d0ff, 0.7);
fill.position.set(5, 3, -4);
fill.castShadow = false;
scene.add(fill);

const ground = new THREE.Mesh(
  new THREE.CircleGeometry(12, 64),
  new THREE.MeshStandardMaterial({ color: 0x2a3540, roughness: 0.92, metalness: 0.05 }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
ground.receiveShadow = false;
scene.add(ground);
const grid = new THREE.GridHelper(16, 32, 0x4a6a7a, 0x2a3a44);
grid.position.y = 0.002;
scene.add(grid);

const clock = new THREE.Clock();
const ray = new THREE.Raycaster();
const ptr = new THREE.Vector2();
const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _q2 = new THREE.Quaternion();

let unitRoot = null, carRoot = null, mountNode = null;
let source = { unit: 'procedural', car: 'procedural' };
let mixer = null, clipMap = {}, currentAction = null, currentClipName = null;
let carMixer = null, carClipMap = {}, currentCarAction = null, currentCarClipName = null;
const restPoses = [];
const carRestPoses = [];
let mode = 'view';
let explodeT = 0, explodeTarget = 0;
let assembleStep = 1, assembleLerp = 1, animMs = 450;
let labelsOn = false, selectedBom = null, labelOverlap = 0;
let ready = false;
const entries = []; // { id, objs: Object3D[], bases: Vector3[], rots: Quaternion[], explode: Vector3[], kit: Vector3[], lid?: true }
const pickables = [];
const ledMats = [];
const spiners = [];
let screenMat = null;

function mat(color, extras = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.35, ...extras });
}

function box(w, h, d, m, x = 0, y = 0, z = 0, name = '') {
  const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  o.position.set(x, y, z);
  if (name) o.name = name;
  return o;
}
function cyl(rTop, rBot, h, seg, m, x, y, z, name, rx = 0, rz = 0) {
  const o = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, seg), m);
  o.position.set(x, y, z);
  o.rotation.x = rx; o.rotation.z = rz;
  if (name) o.name = name;
  return o;
}

function screenTex() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 160;
  const g = c.getContext('2d');
  g.fillStyle = '#061410';
  g.fillRect(0, 0, 256, 160);
  g.strokeStyle = '#1e4a40';
  g.strokeRect(4, 4, 248, 152);
  g.fillStyle = '#3affc8';
  g.font = 'bold 26px system-ui,sans-serif';
  g.fillText('C204  ·  2026', 16, 40);
  g.font = '13px system-ui,sans-serif';
  g.fillStyle = '#8ad4c0';
  g.fillText('STANDBY   ·   FICTIF', 16, 64);
  g.fillStyle = '#1a3a32';
  g.fillRect(16, 86, 224, 8);
  g.fillStyle = '#3affc8';
  g.fillRect(16, 86, 132, 8);
  g.fillStyle = '#1a3a32';
  g.fillRect(16, 104, 224, 8);
  g.fillStyle = '#7fd3ff';
  g.fillRect(16, 104, 80, 8);
  g.fillStyle = '#4a6060';
  g.font = '11px system-ui,sans-serif';
  g.fillText('simulation  ·  pas un vrai plan', 16, 140);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/* ---------- Unité provisoire ---------- */
function buildUnit() {
  const U = new THREE.Group();
  U.name = ROOTS.unit;
  const L = UNIT_SIZE.l, W = UNIT_SIZE.w, H = UNIT_SIZE.h;
  const wall = 0.012;
  const M = {
    shell: mat(0x2c343e, { roughness: 0.38, metalness: 0.65 }),
    inner: mat(0x0d1116, { roughness: 0.7, metalness: 0.2 }),
    lid: mat(0x3a4450, { roughness: 0.32, metalness: 0.7 }),
    stripe: mat(0xc9a227, { roughness: 0.4, metalness: 0.5 }),
    sing: mat(0x2a3a44, { roughness: 0.3, metalness: 0.75, transparent: true, opacity: 0.45, depthWrite: false }),
    core: new THREE.MeshStandardMaterial({ color: 0x7fdcff, emissive: 0x3aa0ff, emissiveIntensity: 1.4, roughness: 0.2, metalness: 0.2 }),
    coil: mat(0xb08a2a, { roughness: 0.35, metalness: 0.8 }),
    gen: mat(0x2c333c, { roughness: 0.45, metalness: 0.55 }),
    cool: mat(0x1e3a48, { roughness: 0.5, metalness: 0.4 }),
    pump: mat(0x3a4650, { roughness: 0.4, metalness: 0.6 }),
    tank: mat(0x244048, { roughness: 0.45, metalness: 0.35 }),
    inj: mat(0x4a5560, { roughness: 0.4, metalness: 0.7 }),
    sensor: mat(0xc0c6cc, { roughness: 0.3, metalness: 0.8 }),
    clock: mat(0x1a2420, { roughness: 0.35, metalness: 0.5, emissive: 0x0a3028, emissiveIntensity: 0.4 }),
    computer: mat(0x1c2228, { roughness: 0.5, metalness: 0.4 }),
    batt: mat(0x2a2418, { roughness: 0.55, metalness: 0.35 }),
    vgl: mat(0x243040, { roughness: 0.4, metalness: 0.55 }),
    led: new THREE.MeshStandardMaterial({ color: 0x3affc8, emissive: 0x3affc8, emissiveIntensity: 1.6, roughness: 0.3, metalness: 0.2 }),
  };
  screenMat = new THREE.MeshStandardMaterial({
    map: screenTex(), emissive: 0x3affc8, emissiveIntensity: 0.25,
    roughness: 0.25, metalness: 0.15,
  });

  // Boîtier : coque ouverte sur le dessus.
  const housing = new THREE.Group();
  housing.name = 'housing';
  housing.add(box(W, wall, L, M.inner, 0, wall / 2, 0));
  housing.add(box(W, H - wall, wall, M.shell, 0, wall + (H - wall) / 2, -L / 2 + wall / 2));
  housing.add(box(W, H - wall, wall, M.shell, 0, wall + (H - wall) / 2, L / 2 - wall / 2));
  housing.add(box(wall, H - wall, L - 2 * wall, M.shell, -W / 2 + wall / 2, wall + (H - wall) / 2, 0));
  housing.add(box(wall, H - wall, L - 2 * wall, M.shell, W / 2 - wall / 2, wall + (H - wall) / 2, 0));
  // Bandes d'avertissement sur les flancs (pas un logo).
  housing.add(box(0.004, 0.03, L * 0.7, M.stripe, W / 2 + 0.001, H * 0.55, 0));
  housing.add(box(0.004, 0.03, L * 0.7, M.stripe, -W / 2 - 0.001, H * 0.55, 0));
  U.add(housing);

  const lid = new THREE.Group();
  lid.name = 'lid';
  const lidY = H + 0.006;
  const lidMesh = box(W + 0.004, 0.012, L + 0.004, M.lid, 0, 0, 0);
  lid.add(lidMesh);
  lid.add(box(W * 0.92, 0.004, 0.035, M.stripe, 0, 0.008, 0.08));
  lid.add(box(W * 0.92, 0.004, 0.035, M.stripe, 0, 0.008, -0.08));
  // Pivot à la charnière arrière : le groupe est au bord -Z, le panneau décalé.
  lid.position.set(0, lidY, -L / 2);
  lidMesh.position.z = L / 2;
  lid.children[1].position.z = L / 2 + 0.08;
  lid.children[2].position.z = L / 2 - 0.08;
  U.add(lid);

  // Écran et LED sur le dessus, visibles capote baissée et couvercle fermé.
  const ts = box(W * 0.70, 0.008, L * 0.42, screenMat, 0, H + 0.018, 0.06, 'touchscreen');
  ts.rotation.x = -0.08;
  U.add(ts);

  const led = box(W * 0.86, 0.006, 0.016, M.led, 0, H + 0.019, L / 2 - 0.05, 'led_status');
  ledMats.push(M.led);
  U.add(led);

  function singularity(name, coilId, x) {
    const g = new THREE.Group();
    g.name = name;
    const house = cyl(0.055, 0.055, 0.11, 20, M.sing, 0, 0, 0);
    g.add(house);
    const core = cyl(0.02, 0.02, 0.08, 16, M.core, 0, 0, 0);
    core.name = name + '_core';
    g.add(core);
    spiners.push({ obj: core, dir: name.includes('steering') ? -1 : 1 });
    g.position.set(x, 0.12, 0.02);
    U.add(g);
    for (let i = 0; i < 3; i++) {
      const c = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.007, 8, 20), M.coil);
      c.name = `${coilId}_${i + 1}`;
      c.rotation.x = Math.PI / 2;
      c.position.set(x, 0.085 + i * 0.032, 0.02);
      U.add(c);
    }
  }
  singularity('singularity_main_housing', 'field_coil_main', -0.075);
  singularity('singularity_steering_housing', 'field_coil_steering', 0.075);

  U.add(box(0.07, 0.04, 0.08, M.gen, -0.075, 0.04, -0.12, 'mag_field_generator_main'));
  U.add(box(0.07, 0.04, 0.08, M.gen, 0.075, 0.04, -0.12, 'mag_field_generator_steering'));

  U.add(box(0.06, 0.08, 0.10, M.cool, -0.135, 0.10, 0.02, 'cooling_housing_main'));
  U.add(box(0.06, 0.08, 0.10, M.cool, 0.135, 0.10, 0.02, 'cooling_housing_steering'));
  U.add(box(0.10, 0.08, 0.08, M.tank, 0.0, 0.07, -0.26, 'cooling_tank'));
  const pump = cyl(0.025, 0.025, 0.05, 12, M.pump, -0.11, 0.06, -0.26, 'cooling_pump');
  U.add(pump);

  U.add(box(0.09, 0.06, 0.08, M.gen, 0.10, 0.07, 0.22, 'electron_generator'));
  U.add(box(0.05, 0.04, 0.05, M.inj, 0, 0.08, 0.14, 'electron_regulator'));
  U.add(box(0.20, 0.02, 0.025, M.inj, 0, 0.15, 0.02, 'electron_injector_manifold'));

  U.add(box(0.07, 0.04, 0.06, M.vgl, -0.10, 0.07, 0.22, 'gravity_sensor_unit'));
  U.add(box(0.025, 0.018, 0.03, M.sensor, -0.075, 0.185, 0.06, 'radius_sensor_main'));
  U.add(box(0.025, 0.018, 0.03, M.sensor, 0.075, 0.185, 0.06, 'radius_sensor_steering'));

  U.add(box(0.055, 0.04, 0.05, M.clock, -0.12, 0.07, -0.18, 'cesium_clock_1'));
  U.add(box(0.055, 0.04, 0.05, M.clock, -0.055, 0.07, -0.18, 'cesium_clock_2'));
  U.add(box(0.10, 0.05, 0.07, M.computer, 0.10, 0.07, -0.20, 'control_computer'));
  U.add(box(0.10, 0.055, 0.08, M.batt, 0.0, 0.055, 0.28, 'battery_pack'));

  return U;
}

/* ---------- Voiture provisoire (silhouette générique) ---------- */
function buildCar() {
  const C = new THREE.Group();
  C.name = ROOTS.car;
  const L = CAR_SIZE.l, W = CAR_SIZE.w, H = CAR_SIZE.h, WB = CAR_SIZE.wb;
  const frontOH = 0.90;
  const rearOH = L - WB - frontOH; // 1.00
  const zF = WB / 2 + frontOH;     // 2.335
  const zR = -(WB / 2 + rearOH);   // -2.435
  const bodyW = 1.78;
  const M = {
    paint: mat(0x6a7582, { roughness: 0.32, metalness: 0.72 }),
    paintDark: mat(0x3a444e, { roughness: 0.36, metalness: 0.65 }),
    glass: mat(0x0a1218, { roughness: 0.08, metalness: 0.6, transparent: true, opacity: 0.48, depthWrite: false }),
    trim: mat(0x0d0f12, { roughness: 0.4, metalness: 0.5 }),
    rubber: mat(0x111114, { roughness: 0.85, metalness: 0.1 }),
    rim: mat(0x8a929a, { roughness: 0.3, metalness: 0.85 }),
    leather: mat(0x1a1410, { roughness: 0.7, metalness: 0.08 }),
    leather2: mat(0x241c16, { roughness: 0.65, metalness: 0.08 }),
    light: new THREE.MeshStandardMaterial({ color: 0xf2e6b8, emissive: 0xdcc880, emissiveIntensity: 0.55, roughness: 0.25, metalness: 0.3 }),
    tail: new THREE.MeshStandardMaterial({ color: 0xaa2030, emissive: 0x880818, emissiveIntensity: 0.5, roughness: 0.3, metalness: 0.3 }),
    cabin: mat(0x16181c, { roughness: 0.8, metalness: 0.1 }),
    top: mat(0x1a1c20, { roughness: 0.75, metalness: 0.15 }),
    grille: mat(0x121416, { roughness: 0.45, metalness: 0.6 }),
  };

  // Caisse : châssis bas + sections avant/arrière. L'habitacle est creux
  // pour que l'unité, au plancher, reste visible.
  const body = new THREE.Group();
  body.name = 'body';
  body.add(box(bodyW, 0.20, L - 0.16, M.paint, 0, 0.16, (zF + zR) / 2)); // plancher / châssis, dessous du cabin y=0.30
  body.add(box(bodyW - 0.06, 0.28, 1.85, M.paint, 0, 0.46, 1.42)); // volume avant, sous le capot
  body.add(box(bodyW - 0.08, 0.30, 0.95, M.paint, 0, 0.47, -1.90)); // volume arrière, derrière l'unité
  body.add(box(0.07, 0.30, 1.85, M.paint, -bodyW / 2 + 0.04, 0.47, -0.12));
  body.add(box(0.07, 0.30, 1.85, M.paint, bodyW / 2 - 0.04, 0.47, -0.12));
  body.add(box(bodyW - 0.08, 0.14, L - 0.5, M.paintDark, 0, 0.10, 0));
  C.add(body);

  const hood = box(bodyW - 0.08, 0.08, 1.72, M.paint, 0, 0.72, 1.38, 'hood');
  hood.rotation.x = 0.07;
  C.add(hood);

  const deck = box(bodyW - 0.1, 0.07, 1.05, M.paint, 0, 0.78, -1.72, 'rear_deck');
  deck.rotation.x = -0.08;
  C.add(deck);

  C.add(box(bodyW - 0.12, 0.18, 0.08, M.paintDark, 0, 0.48, zF - 0.04, 'bumper_front'));
  C.add(box(bodyW - 0.1, 0.16, 0.08, M.paintDark, 0, 0.42, zR + 0.04, 'bumper_rear'));

  // Calandre générique : ouverture rectangulaire + lames horizontales (pas de spindle).
  const grille = new THREE.Group();
  grille.name = 'grille';
  grille.position.set(0, 0.42, zF - 0.01);
  grille.add(box(0.86, 0.22, 0.04, M.grille, 0, 0, 0));
  for (let i = 0; i < 5; i++) {
    grille.add(box(0.80, 0.014, 0.03, M.trim, 0, -0.08 + i * 0.04, 0.02));
  }
  C.add(grille);

  C.add(box(0.28, 0.08, 0.08, M.light, 0.68, 0.50, zF - 0.03, 'headlight_l'));
  C.add(box(0.28, 0.08, 0.08, M.light, -0.68, 0.50, zF - 0.03, 'headlight_r'));
  C.add(box(0.38, 0.07, 0.06, M.tail, 0.62, 0.58, zR + 0.04, 'taillight_l'));
  C.add(box(0.38, 0.07, 0.06, M.tail, -0.62, 0.58, zR + 0.04, 'taillight_r'));

  const windshield = box(bodyW - 0.22, 0.62, 0.04, M.glass, 0, 1.05, 0.58, 'windshield');
  windshield.rotation.x = -0.55;
  C.add(windshield);

  const wL = box(0.04, 0.42, 0.95, M.glass, -bodyW / 2 + 0.08, 0.98, -0.15, 'window_left');
  wL.rotation.z = 0.18;
  C.add(wL);
  const wR = box(0.04, 0.42, 0.95, M.glass, bodyW / 2 - 0.08, 0.98, -0.15, 'window_right');
  wR.rotation.z = -0.18;
  C.add(wR);

  // Habitacle ouvert (capote baissée) pour voir l'unité.
  const cabin = new THREE.Group();
  cabin.name = 'cabin';
  cabin.add(box(bodyW - 0.22, 0.04, 1.85, M.cabin, 0, 0.30, -0.15));
  cabin.add(box(0.05, 0.38, 1.7, M.paint, -bodyW / 2 + 0.12, 0.62, -0.15));
  cabin.add(box(0.05, 0.38, 1.7, M.paint, bodyW / 2 - 0.12, 0.62, -0.15));
  C.add(cabin);

  C.add(box(bodyW - 0.3, 0.12, 0.55, M.trim, 0, 0.62, 0.55, 'dashboard'));
  C.add(cyl(0.16, 0.16, 0.03, 20, M.trim, 0.32, 0.78, 0.42, 'steering_wheel', Math.PI / 2));

  function seat(name, x, z, matl) {
    const s = new THREE.Group();
    s.name = name;
    s.add(box(0.46, 0.10, 0.48, matl, 0, 0, 0));
    s.add(box(0.46, 0.46, 0.09, matl, 0, 0.24, -0.22));
    s.position.set(x, 0.42, z);
    C.add(s);
  }
  seat('seat_driver', 0.38, 0.12, M.leather);
  seat('seat_passenger', -0.38, 0.12, M.leather);
  seat('seat_rear_driver', 0.38, -0.85, M.leather2);
  // Pas de siège arrière passager : la place est prise par l'unité.

  const top = new THREE.Group();
  top.name = 'convertible_top';
  top.add(box(bodyW - 0.28, 0.16, 0.38, M.top, 0, 0, 0));
  top.add(box(bodyW - 0.36, 0.10, 0.28, M.top, 0, 0.12, -0.05));
  top.position.set(0, 0.82, -1.58);
  C.add(top);

  function wheel(name, x, z) {
    const g = new THREE.Group();
    g.name = name;
    const tire = cyl(0.35, 0.35, 0.22, 24, M.rubber, 0, 0, 0, '', 0, Math.PI / 2);
    const rim = cyl(0.22, 0.22, 0.16, 16, M.rim, 0, 0, 0, '', 0, Math.PI / 2);
    g.add(tire); g.add(rim);
    g.position.set(x, 0.35, z);
    C.add(g);
  }
  const track = 0.78;
  wheel('wheel_fl', -track, WB / 2);
  wheel('wheel_fr', track, WB / 2);
  wheel('wheel_rl', -track, -WB / 2);
  wheel('wheel_rr', track, -WB / 2);

  const mirL = box(0.12, 0.08, 0.18, M.paint, W / 2 - 0.06, 0.92, 0.52, 'mirror_l');
  const mirR = box(0.12, 0.08, 0.18, M.paint, -W / 2 + 0.06, 0.92, 0.52, 'mirror_r');
  C.add(mirL); C.add(mirR);

  const mount = new THREE.Group();
  mount.name = ROOTS.mount;
  mount.position.set(MOUNT_POS.x, MOUNT_POS.y, MOUNT_POS.z);
  C.add(mount);

  return C;
}

/* ---------- Enregistrement des pièces (explosée / kit) ---------- */
function clearEntries() {
  entries.length = 0;
  pickables.length = 0;
}

function worldCenter(obj) {
  obj.updateWorldMatrix(true, true);
  return new THREE.Box3().setFromObject(obj).getCenter(new THREE.Vector3());
}

function registerParts(root) {
  clearEntries();
  root.updateWorldMatrix(true, true);
  const unitBox = new THREE.Box3().setFromObject(root);
  const ctr = unitBox.getCenter(new THREE.Vector3());

  const byId = {};
  const seen = new Set();
  const assign = (o, id) => {
    if (!o || o === root || seen.has(o) || !id) return;
    seen.add(o);
    o.userData.partId = id;
    (byId[id] ||= []).push(o);
    pickables.push(o);
  };
  // Nœuds canoniques par nom (getObjectByName), indépendamment de la hiérarchie.
  for (const b of BOM) {
    for (const n of b.nodes) assign(root.getObjectByName(n), b.id);
  }
  // Extras (câbles, voyants, cadres…) y compris enfants imbriqués, via idFor.
  root.traverse(o => {
    if (o === root || seen.has(o) || !o.name) return;
    assign(o, idFor(o.name));
  });

  const ids = Object.keys(byId);
  ids.forEach((id, i) => {
    const objs = byId[id];
    const bases = objs.map(o => o.position.clone());
    const rots = objs.map(o => o.quaternion.clone());
    const explode = objs.map(o => {
      const c = worldCenter(o);
      const d = c.sub(ctr);
      if (id === 'housing') return new THREE.Vector3(0, 0, 0);
      if (id === 'lid') return new THREE.Vector3(0, 0.38, -0.12);
      d.y = Math.max(0.12, Math.abs(d.y) + 0.14);
      return new THREE.Vector3(d.x * 1.35, d.y, d.z * 1.45);
    });
    const kit = objs.map((o, k) => {
      const ang = (i / Math.max(1, ids.length - 1)) * Math.PI - Math.PI / 2;
      const off = explode[k].clone().multiplyScalar(1.15);
      off.x += Math.cos(ang) * 0.22;
      off.y += 0.18 + Math.abs(Math.sin(ang)) * 0.08;
      off.z += Math.sin(ang) * 0.10;
      return off;
    });
    const e = { id, objs, bases, rots, explode, kit, lid: id === 'lid' };
    if (id === 'lid') e.openQx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -105 * Math.PI / 180);
    entries.push(e);
  });
}

function partObjs(id) {
  const e = entries.find(x => x.id === id);
  return e ? e.objs : [];
}

function applyPoses() {
  const useClips = source.unit === 'glb' && mixer;
  if (!useClips) {
    const lidOpen = (mode === 'explode' && explodeT > 0.15) || (mode === 'assemble' && assembleStep < 24);
    for (const e of entries) {
      for (let k = 0; k < e.objs.length; k++) {
        const o = e.objs[k];
        const base = e.bases[k];
        let tx = base.x, ty = base.y, tz = base.z;
        let tq = e.rots[k];
        if (mode === 'explode') {
          tx = base.x + e.explode[k].x * explodeT;
          ty = base.y + e.explode[k].y * explodeT;
          tz = base.z + e.explode[k].z * explodeT;
          if (e.lid) tq = e.rots[k].clone().slerp(e.openQx, explodeT);
        } else if (mode === 'assemble') {
          const stepOf = ASSEMBLY.find(a => a.id === e.id);
          const s = stepOf ? stepOf.step : 99;
          if (assembleStep === 25 || s < assembleStep) {
            tx = base.x; ty = base.y; tz = base.z;
            if (e.lid) tq = e.rots[k];
          } else if (s === assembleStep) {
            const t = assembleLerp;
            const kitP = e.kit[k];
            tx = base.x + kitP.x * (1 - t);
            ty = base.y + kitP.y * (1 - t);
            tz = base.z + kitP.z * (1 - t);
            if (e.lid) tq = e.openQx.clone().slerp(e.rots[k], t);
          } else {
            const kitP = e.kit[k];
            tx = base.x + kitP.x;
            ty = base.y + kitP.y;
            tz = base.z + kitP.z;
            if (e.lid) tq = e.openQx;
          }
        } else if (e.lid) {
          tq = e.rots[k];
        }
        o.position.set(tx, ty, tz);
        if (e.lid) o.quaternion.copy(tq);
      }
    }
  }
  // Surlignage assemblage.
  const curId = mode === 'assemble' ? ASSEMBLY[assembleStep - 1]?.id : null;
  for (const e of entries) {
    const on = (curId && e.id === curId) || (selectedBom && BOM[selectedBom - 1]?.id === e.id);
    for (const o of e.objs) highlight(o, on, curId && e.id === curId ? 0x3affc8 : 0xffd75a);
  }
}

function highlight(obj, on, color) {
  obj.traverse(o => {
    if (!o.isMesh || !o.material) return;
    if (!o.userData._matCloned) {
      o.material = Array.isArray(o.material) ? o.material.map(m => m.clone()) : o.material.clone();
      o.userData._matCloned = true;
    }
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    mats.forEach(m => {
      if (!m.emissive) return;
      if (m.userData._ei0 == null) {
        m.userData._e0 = m.emissive.clone();
        m.userData._ei0 = m.emissiveIntensity;
      }
      if (on) {
        m.emissive.setHex(color);
        m.emissiveIntensity = 0.9;
      } else {
        m.emissive.copy(m.userData._e0);
        m.emissiveIntensity = m.userData._ei0;
      }
    });
  });
}

/* ---------- Chargeurs GLB (repli primitives) ---------- */
let draco, ktx2;
function makeLoader() {
  draco ||= new DRACOLoader().setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/draco/gltf/');
  ktx2 ||= new KTX2Loader().setTranscoderPath('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/basis/').detectSupport(renderer);
  return new GLTFLoader().setDRACOLoader(draco).setKTX2Loader(ktx2).setMeshoptDecoder(MeshoptDecoder);
}

async function loadConfig() {
  try {
    return await (await fetch('assets/model.json', { cache: 'no-store' })).json();
  } catch {
    return { unit: { url: null, root: ROOTS.unit }, car: { url: null, root: ROOTS.car, mount: ROOTS.mount } };
  }
}

async function tryGLB(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    return await makeLoader().loadAsync(url);
  } catch {
    return null;
  }
}

function disposeTree(obj) {
  if (!obj) return;
  obj.removeFromParent();
  obj.traverse(o => {
    if (o.geometry) o.geometry.dispose();
    const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
    mats.forEach(m => {
      if (!m) return;
      for (const v of Object.values(m)) if (v && v.isTexture) v.dispose();
      m.dispose();
    });
  });
}

function snapshotRest(root) {
  restPoses.length = 0;
  root.traverse(o => {
    if (o === root) return;
    restPoses.push({
      obj: o,
      pos: o.position.clone(),
      quat: o.quaternion.clone(),
      scale: o.scale.clone(),
    });
  });
}

function restoreRest() {
  for (const r of restPoses) {
    r.obj.position.copy(r.pos);
    r.obj.quaternion.copy(r.quat);
    r.obj.scale.copy(r.scale);
  }
}

function setupMixer(root, animations) {
  mixer = new THREE.AnimationMixer(root);
  clipMap = {};
  for (const c of animations || []) if (c?.name) clipMap[c.name] = c;
  currentAction = null;
  currentClipName = null;
}

function playClip(name, { loop = false, instant = false } = {}) {
  if (!mixer || !clipMap[name]) return false;
  mixer.stopAllAction();
  const clip = clipMap[name];
  const action = mixer.clipAction(clip);
  action.enabled = true;
  action.weight = 1;
  if (loop) {
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.clampWhenFinished = false;
  } else {
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
  }
  action.paused = false;
  action.timeScale = (!loop && animMs < 200 && clip.duration > 0) ? clip.duration / (animMs / 1000) : 1;
  action.reset();
  if (instant && !loop) {
    action.time = clip.duration;
    action.play();
    action.paused = true;
    mixer.update(0);
  } else {
    action.play();
  }
  currentAction = action;
  currentClipName = name;
  return true;
}

function playAssembleClip(step, instant = false) {
  if (step >= 25) {
    restoreRest();
    playClip('idle', { loop: true });
    assembleLerp = 1;
    return true;
  }
  const name = 'assemble_' + String(step).padStart(2, '0');
  const ok = playClip(name, { instant });
  assembleLerp = instant || !ok ? 1 : 0;
  return ok;
}

function openLid(instant = false) {
  restoreRest();
  return playClip('lid_open', { instant });
}

function hasClips() {
  return source.unit === 'glb' && !!mixer && Object.keys(clipMap).length > 0;
}

function snapshotCarRest(root) {
  carRestPoses.length = 0;
  if (!root) return;
  root.traverse(o => {
    if (o === root) return;
    carRestPoses.push({
      obj: o,
      pos: o.position.clone(),
      quat: o.quaternion.clone(),
      scale: o.scale.clone(),
    });
  });
}

function restoreCarRest() {
  for (const r of carRestPoses) {
    r.obj.position.copy(r.pos);
    r.obj.quaternion.copy(r.quat);
    r.obj.scale.copy(r.scale);
  }
}

function setupCarMixer(root, animations) {
  carMixer = new THREE.AnimationMixer(root);
  carClipMap = {};
  for (const c of animations || []) if (c?.name) carClipMap[c.name] = c;
  currentCarAction = null;
  currentCarClipName = null;
}

function playCarClip(name, { loop = false, instant = false } = {}) {
  if (!carMixer || !carClipMap[name]) return false;
  restoreCarRest();
  carMixer.stopAllAction();
  const clip = carClipMap[name];
  const action = carMixer.clipAction(clip);
  action.enabled = true;
  action.weight = 1;
  if (loop) {
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.clampWhenFinished = false;
  } else {
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
  }
  action.paused = false;
  action.timeScale = 1;
  action.reset();
  if (instant && !loop) {
    action.time = clip.duration;
    action.play();
    action.paused = true;
    carMixer.update(0);
  } else {
    action.play();
  }
  currentCarAction = action;
  currentCarClipName = name;
  return true;
}

function hasCarClips() {
  return source.car === 'glb' && !!carMixer && Object.keys(carClipMap).length > 0;
}

function syncCarClip() {
  if (!hasCarClips()) return;
  if (mode === 'view') playCarClip('wheels_roll', { loop: false });
  else playCarClip('doors_open', { loop: false });
}

function fitUnit(root, target) {
  root.updateWorldMatrix(true, true);
  const size = new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3());
  if (size.x < 1e-4 || size.y < 1e-4 || size.z < 1e-4) return;
  const sx = target.x / size.x, sy = target.y / size.y, sz = target.z / size.z;
  const s = (sx + sy + sz) / 3;
  if (!isFinite(s) || s <= 0) return;
  // Ne corrige que si l'écart est net (> 20 %). Sinon on garde l'échelle 1 du GLB.
  if (s < 0.8 || s > 1.25) root.scale.multiplyScalar(s);
}

/* ---------- Optimisations Lexus au chargement (pas de ré-export) ---------- */
const CAR_CLIP_ROOTS = ['door_L', 'door_R', 'wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr'];
// capote basculée en Éclatée / Assemblage ; capote fermée déjà masquée.
const CAR_KEEP_SEPARATE = new Set(['c204_2026_unit', 'convertible_top', 'soft_top_closed', ...CAR_CLIP_ROOTS]);

function isTransmissionMat(m) {
  return !!(m && (m.transmission > 0 || (m.isMeshPhysicalMaterial && m.transmission > 0)));
}

function cheapGlassFrom(mat) {
  const color = mat.color ? mat.color.clone() : new THREE.Color(0x000000);
  return new THREE.MeshStandardMaterial({
    color,
    roughness: mat.roughness != null ? mat.roughness : 0.08,
    metalness: 0,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
    side: THREE.FrontSide,
  });
}

function replaceTransmissionMaterials(root) {
  const cache = new Map();
  root.traverse(o => {
    if (!o.isMesh || !o.material) return;
    const multi = Array.isArray(o.material);
    const mats = multi ? o.material : [o.material];
    let changed = false;
    const next = mats.map(m => {
      if (!isTransmissionMat(m)) return m;
      if (!cache.has(m)) cache.set(m, cheapGlassFrom(m));
      changed = true;
      return cache.get(m);
    });
    if (changed) o.material = multi ? next : next[0];
  });
}

function setOpaqueFrontSide(root, doubleSideNames = new Set()) {
  root.traverse(o => {
    if (!o.isMesh || !o.material) return;
    const multi = Array.isArray(o.material);
    const mats = multi ? o.material : [o.material];
    const next = mats.map(m => {
      if (!m || m.transparent || isTransmissionMat(m)) return m;
      if (doubleSideNames.has(o.name)) {
        if (m.side === THREE.DoubleSide) return m;
        const clone = m.clone();
        clone.side = THREE.DoubleSide;
        return clone;
      }
      m.side = THREE.FrontSide;
      return m;
    });
    if (next.some((m, i) => m !== mats[i])) o.material = multi ? next : next[0];
  });
}

function collectProtected(carRoot) {
  const set = new Set();
  for (const name of CAR_KEEP_SEPARATE) {
    const o = carRoot.getObjectByName(name);
    if (!o) continue;
    o.traverse(c => set.add(c));
  }
  return set;
}

function mergeStaticAtlasMeshes(carRoot) {
  const protectedSet = collectProtected(carRoot);
  carRoot.updateWorldMatrix(true, true);
  const rootInv = new THREE.Matrix4().copy(carRoot.matrixWorld).invert();
  const bake = new THREE.Matrix4();
  const groups = new Map();
  carRoot.traverse(o => {
    if (!o.isMesh || !o.geometry || !o.visible) return;
    if (protectedSet.has(o)) return;
    const mat = o.material;
    if (!mat || Array.isArray(mat)) return;
    if (mat.transparent || isTransmissionMat(mat)) return;
    let g = groups.get(mat.uuid);
    if (!g) { g = { mat, meshes: [] }; groups.set(mat.uuid, g); }
    g.meshes.push(o);
  });
  for (const { mat, meshes } of groups.values()) {
    if (meshes.length < 2) continue;
    const geos = [];
    for (const mesh of meshes) {
      const geo = mesh.geometry.clone();
      bake.multiplyMatrices(rootInv, mesh.matrixWorld);
      geo.applyMatrix4(bake);
      geos.push(geo);
    }
    let merged = null;
    try { merged = mergeGeometries(geos, false); }
    catch { merged = null; }
    geos.forEach(g => g.dispose());
    if (!merged) continue;
    const out = new THREE.Mesh(merged, mat);
    out.name = 'lexus_atlas_merged';
    out.castShadow = false;
    out.receiveShadow = false;
    carRoot.add(out);
    for (const mesh of meshes) {
      mesh.visible = false;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
    }
  }
}

function optimizeCarModel(carRoot) {
  if (!carRoot) return;
  replaceTransmissionMaterials(carRoot);
  setOpaqueFrontSide(carRoot);
  mergeStaticAtlasMeshes(carRoot);
}

function sceneHasTransmission() {
  let found = false;
  scene.traverse(o => {
    if (found || !o.isMesh || !o.material) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    if (mats.some(isTransmissionMat)) found = true;
  });
  return found;
}

async function boot() {
  const cfg = await loadConfig();
  carRoot = buildCar();
  const proceduralUnit = buildUnit();
  unitRoot = proceduralUnit;
  source = { unit: 'procedural', car: 'procedural' };

  const procSize = (() => {
    proceduralUnit.updateWorldMatrix(true, true);
    return new THREE.Box3().setFromObject(proceduralUnit).getSize(new THREE.Vector3());
  })();

  const [gUnit, gCar] = await Promise.all([tryGLB(cfg.unit?.url), tryGLB(cfg.car?.url)]);

  if (gCar) {
    scene.remove(carRoot);
    disposeTree(carRoot);
    const found = gCar.scene.getObjectByName(ROOTS.car) || gCar.scene.getObjectByName(cfg.car?.root || ROOTS.car) || gCar.scene;
    carRoot = found;
    source.car = 'glb';
    setupCarMixer(carRoot, gCar.animations);
    snapshotCarRest(carRoot);
    const hiddenTop = carRoot.getObjectByName('soft_top_closed');
    if (hiddenTop) hiddenTop.visible = false;
  }
  scene.add(carRoot);
  if (source.car === 'glb') optimizeCarModel(carRoot);
  mountNode = carRoot.getObjectByName(ROOTS.mount) || carRoot.getObjectByName(cfg.car?.mount || ROOTS.mount);
  if (!mountNode) {
    mountNode = new THREE.Group();
    mountNode.name = ROOTS.mount;
    mountNode.position.set(MOUNT_POS.x, MOUNT_POS.y, MOUNT_POS.z);
    carRoot.add(mountNode);
  }

  if (gUnit) {
    const found = gUnit.scene.getObjectByName(ROOTS.unit) || gUnit.scene.getObjectByName(cfg.unit?.root || ROOTS.unit) || gUnit.scene;
    spiners.length = 0;
    ledMats.length = 0;
    screenMat = null;
    disposeTree(proceduralUnit);
    unitRoot = found;
    source.unit = 'glb';
    fitUnit(unitRoot, procSize);
    snapshotRest(unitRoot);
    setupMixer(unitRoot, gUnit.animations);
  }

  const already = mountNode.getObjectByName(ROOTS.unit);
  if (already && already !== unitRoot) mountNode.remove(already);
  if (unitRoot.parent !== mountNode) mountNode.add(unitRoot);
  // Ancre = nœud c204_2026_unit (pas MOUNT_POS, sauf repli procédural plus haut).
  unitRoot.position.set(0, 0, 0);
  unitRoot.quaternion.identity();

  registerParts(unitRoot);
  if (hasClips()) playClip('idle', { loop: true });
  if (hasCarClips()) syncCarClip();
  applyPoses();
  // Petite lumière sur l'unité, pour la voir dans l'habitacle (S20 : une seule, pas d'ombre).
  const unitLit = new THREE.PointLight(0x8affe0, 0.28, 1.5, 2);
  unitLit.name = 'unit_light';
  unitLit.position.set(0, 0.35, 0.1);
  unitLit.castShadow = false;
  unitRoot.add(unitLit);
  buildPartsPanel();
  buildLabels();
  frameCamera('view', true);
  ready = true;
  $('#loading').classList.add('hidden');
  const demo = new URLSearchParams(location.search).get('demo');
  if (demo === 'explode') setMode('explode');
  if (demo === 'assemble') setMode('assemble');
  if (demo === 'labels') setLabels(true);
  if (demo === 'lid') openLid();
}

/* ---------- Caméra ---------- */
function frameCamera(kind, instant = false) {
  const goalPos = new THREE.Vector3();
  const goalTgt = new THREE.Vector3();
  if (kind === 'view' || kind === 'wide') {
    // Trois-quarts arrière droit, assez haut pour voir l'habitacle et l'unité.
    goalTgt.set(0.05, 0.45, 0.05);
    goalPos.set(4.05, 3.15, -3.55);
    if (innerWidth > innerHeight) goalPos.set(5.15, 2.45, -2.15);
  } else {
    // Gros plan de haut, côté passager, capote masquée.
    mountNode.getWorldPosition(_v);
    goalTgt.copy(_v).add(new THREE.Vector3(0, 0.10, 0.02));
    goalPos.copy(_v).add(new THREE.Vector3(0.85, 1.45, 0.95));
    if (innerWidth > innerHeight) goalPos.copy(_v).add(new THREE.Vector3(1.25, 1.05, 0.35));
  }
  if (instant) {
    camera.position.copy(goalPos);
    controls.target.copy(goalTgt);
    controls.update();
    camAnim = null;
  } else {
    camAnim = { t: 0, p0: camera.position.clone(), t0: controls.target.clone(), p1: goalPos, t1: goalTgt };
  }
}
let camAnim = null;

/* ---------- Modes ---------- */
function setCarObstruction(hide) {
  // En gros plan, on cache capote et vitres pour voir l'unité (repli provisoire).
  ['convertible_top', 'window_right', 'window_left'].forEach(n => {
    const o = carRoot && carRoot.getObjectByName(n);
    if (o) o.visible = !hide;
  });
}

function setMode(m) {
  if (m !== 'view' && m !== 'explode' && m !== 'assemble') return;
  mode = m;
  explodeTarget = m === 'explode' ? 1 : 0;
  setCarObstruction(m !== 'view');
  $('#bView').classList.toggle('on', m === 'view');
  $('#bExplode').classList.toggle('on', m === 'explode');
  $('#bAssemble').classList.toggle('on', m === 'assemble');
  $('#bView').setAttribute('aria-pressed', m === 'view');
  $('#bExplode').setAttribute('aria-pressed', m === 'explode');
  $('#bAssemble').setAttribute('aria-pressed', m === 'assemble');
  $('#assemble').classList.toggle('hidden', m !== 'assemble');
  $('#hint').style.visibility = m === 'assemble' ? 'hidden' : '';
  if (m === 'assemble') {
    assembleStep = 1;
    assembleLerp = 0;
    updateAssembleUI();
    frameCamera('unit');
    if (hasClips()) playAssembleClip(1, false);
  } else if (m === 'explode') {
    frameCamera('unit');
    if (hasClips()) {
      restoreRest();
      playClip('explode');
    }
  } else {
    frameCamera('view');
    explodeT = 0;
    if (hasClips()) {
      restoreRest();
      playClip('idle', { loop: true });
    }
  }
  if (hasCarClips()) syncCarClip();
  applyPoses();
}

function setAssembleStep(n, instant = false) {
  assembleStep = Math.max(1, Math.min(ASSEMBLY.length, n | 0));
  assembleLerp = instant ? 1 : 0;
  if (assembleStep === 25) frameCamera('wide');
  else frameCamera('unit');
  if (hasClips()) playAssembleClip(assembleStep, instant);
  updateAssembleUI();
  applyPoses();
}
function nextStep() {
  if (mode !== 'assemble') return;
  if (assembleLerp < 0.98 && assembleStep < 25) {
    if (hasClips()) playAssembleClip(assembleStep, true);
    assembleLerp = 1;
    applyPoses();
    updateAssembleUI();
    return;
  }
  if (assembleStep < ASSEMBLY.length) setAssembleStep(assembleStep + 1);
}
function prevStep() {
  if (mode !== 'assemble') return;
  if (assembleStep > 1) setAssembleStep(assembleStep - 1, true);
}

function updateAssembleUI() {
  const a = ASSEMBLY[assembleStep - 1];
  if (!a) return;
  $('#asmTitle').textContent = a.title;
  $('#asmBody').textContent = a.text;
  $('#asmPos').textContent = `${assembleStep} / ${ASSEMBLY.length}`;
  $('#bPrev').disabled = assembleStep <= 1;
  $('#bNext').disabled = assembleStep >= ASSEMBLY.length && assembleLerp >= 1;
  $('#asmBanner').textContent = 'Guide fictif — pas un vrai plan';
}

/* ---------- Fiches et panneau ---------- */
function openSheet(id) {
  const p = PARTS[id];
  if (!p) return;
  const bom = BOM.find(b => b.id === id);
  selectedBom = bom ? bom.n : null;
  $('#shRef').textContent = bom ? `Pièce n°${bom.n}` : '';
  $('#shTitle').textContent = p.fr;
  $('#shEn').textContent = p.en;
  $('#shBody').textContent = p.body;
  $('#shNote').textContent = p.note || '';
  $('#shFrame').textContent = FRAME;
  $('#sheet').classList.remove('hidden');
  applyPoses();
  updateLabels();
}
function closeSheet() {
  $('#sheet').classList.add('hidden');
  selectedBom = null;
  applyPoses();
  updateLabels();
}
function buildPartsPanel() {
  const el = $('#partsContent');
  el.innerHTML = `<h2>Pièces de l'unité C204 · 2026</h2>
    <p class="lead">${FRAME} Guide d'assemblage fictif — pas un vrai plan.</p>`;
  BOM.forEach(b => {
    const btn = document.createElement('button');
    btn.className = 'row';
    btn.dataset.bom = String(b.n);
    btn.innerHTML = `<span class="num">${b.n}</span><span><span class="fr">${b.fr}</span><div class="en">${b.en} · qté ${b.qty}</div></span>`;
    btn.onclick = () => { closeParts(); openSheet(b.id); };
    el.appendChild(btn);
  });
}
function openParts() { $('#parts').classList.remove('hidden'); closeSheet(); }
function closeParts() { $('#parts').classList.add('hidden'); }

/* ---------- Étiquettes sans chevauchement ---------- */
const LAB = 44, LAB_GAP = 2, LAB_HIT = LAB + LAB_GAP;
const labelEls = [];

function buildLabels() {
  const box = $('#labels');
  box.innerHTML = '';
  labelEls.length = 0;
  BOM.forEach(b => {
    const el = document.createElement('button');
    el.className = 'lab off';
    el.type = 'button';
    el.innerHTML = `<span>${b.n}</span>`;
    el.setAttribute('aria-label', `Pièce ${b.n} : ${b.fr}`);
    el.onclick = ev => { ev.stopPropagation(); openSheet(b.id); };
    box.appendChild(el);
    labelEls.push({ n: b.n, id: b.id, el, x: 0, y: 0 });
  });
}

function setLabels(on) {
  labelsOn = !!on;
  $('#bLabels').classList.toggle('on', labelsOn);
  $('#bLabels').setAttribute('aria-pressed', labelsOn ? 'true' : 'false');
  $('#labels').hidden = !labelsOn && !selectedBom;
  updateLabels();
}

function safeRect() {
  const top = $('#top').getBoundingClientRect();
  const bar = $('#bar').getBoundingClientRect();
  const hint = $('#hint').getBoundingClientRect();
  let y0 = Math.max(top.bottom, hint.bottom || 0) + 6;
  let y1 = bar.top - 6;
  const asm = $('#assemble');
  if (mode === 'assemble' && !asm.classList.contains('hidden')) {
    const r = asm.getBoundingClientRect();
    if (r.width > innerWidth * 0.6) y1 = Math.min(y1, r.top - 6);
    // en paysage le panneau est à droite : on réduit x1 plus bas
  }
  let x0 = 6, x1 = innerWidth - 6;
  if (mode === 'assemble' && !asm.classList.contains('hidden')) {
    const r = asm.getBoundingClientRect();
    if (r.height > innerHeight * 0.5 && r.left > innerWidth * 0.4) x1 = Math.min(x1, r.left - 6);
  }
  const sheet = $('#sheet');
  if (!sheet.classList.contains('hidden')) {
    const r = sheet.getBoundingClientRect();
    if (r.width > innerWidth * 0.6) y1 = Math.min(y1, r.top - 6);
    else if (r.left > innerWidth * 0.4) x1 = Math.min(x1, r.left - 6);
  }
  return { x0, x1, y0, y1 };
}

function updateLabels() {
  const box = $('#labels');
  const show = labelsOn || selectedBom;
  box.hidden = !show;
  if (!show) { labelOverlap = 0; return; }

  const safe = safeRect();
  const placed = [];
  const overlaps = (x, y) => placed.some(P => Math.abs(P.x - x) < LAB_HIT && Math.abs(P.y - y) < LAB_HIT);
  const inSafe = (x, y) => x >= safe.x0 + LAB / 2 && x <= safe.x1 - LAB / 2 && y >= safe.y0 + LAB / 2 && y <= safe.y1 - LAB / 2;

  // Grille de secours.
  const cells = [];
  const cols = Math.max(2, Math.floor((safe.x1 - safe.x0) / LAB_HIT));
  const rows = Math.max(2, Math.floor((safe.y1 - safe.y0) / LAB_HIT));
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      // Colonnes depuis les bords, pour laisser le centre au modèle.
      const fromLeft = c < cols / 2;
      const cc = fromLeft ? c : (cols - 1 - (c - Math.floor(cols / 2)));
      const x = safe.x0 + LAB / 2 + cc * LAB_HIT + (LAB_HIT / 2 - LAB / 2);
      const y = safe.y0 + LAB / 2 + r * LAB_HIT;
      if (inSafe(x, y)) cells.push({ x, y, used: false });
    }
  }

  unitRoot.updateWorldMatrix(true, true);
  for (const L of labelEls) {
    const want = labelsOn || L.n === selectedBom;
    L.el.classList.toggle('off', !want);
    L.el.classList.toggle('sel', L.n === selectedBom);
    if (!want) continue;
    const objs = partObjs(L.id);
    let sx = innerWidth / 2, sy = innerHeight / 2;
    if (objs.length) {
      const c = worldCenter(objs[0]).project(camera);
      sx = (c.x * 0.5 + 0.5) * innerWidth;
      sy = (-c.y * 0.5 + 0.5) * innerHeight;
    }
    let found = false, px = sx, py = sy;
    if (inSafe(sx, sy) && !overlaps(sx, sy)) { px = sx; py = sy; found = true; }
    if (!found) {
      for (let rad = 1; rad <= 16 && !found; rad++) {
        for (let a = 0; a < 12; a++) {
          const ang = a * (Math.PI * 2 / 12) + rad * 0.15;
          const x = sx + Math.cos(ang) * rad * (LAB_HIT * 0.7);
          const y = sy + Math.sin(ang) * rad * (LAB_HIT * 0.7);
          if (inSafe(x, y) && !overlaps(x, y)) { px = x; py = y; found = true; break; }
        }
      }
    }
    if (!found) {
      let best = null, bestD = 1e9;
      for (const cell of cells) {
        if (cell.used) continue;
        const d = (cell.x - sx) ** 2 + (cell.y - sy) ** 2;
        if (d < bestD && !overlaps(cell.x, cell.y)) { bestD = d; best = cell; }
      }
      if (best) { px = best.x; py = best.y; best.used = true; found = true; }
    }
    L.x = px; L.y = py;
    L.el.style.transform = `translate(${px - LAB / 2}px, ${py - LAB / 2}px)`;
    // On n'utilise plus translate(-50%,-50%) : le CSS le met, on le remplace ici par un pixel exact.
    L.el.style.left = '0px';
    L.el.style.top = '0px';
    placed.push(L);
  }
  // Mesure réelle.
  const vis = labelEls.filter(L => !L.el.classList.contains('off'));
  let ov = 0;
  const rs = vis.map(L => L.el.getBoundingClientRect());
  for (let i = 0; i < rs.length; i++) {
    for (let j = i + 1; j < rs.length; j++) {
      const a = rs[i], b = rs[j];
      if (!(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top)) ov++;
    }
  }
  labelOverlap = ov;
}

/* CSS uses translate(-50%,-50%) which conflicts. I'll set labels via left/top in CSS override — actually I set transform which ADDS to the CSS transform? No, el.style.transform overrides the stylesheet transform for that element. Good. I used translate(px-22, py-22) with left 0 top 0, so the 44x44 box's top-left is at (px-22, py-22), center at (px,py). The stylesheet says transform:translate(-50%,-50%) but inline style wins. Good. */

/* ---------- Picking ---------- */
function pickAt(cx, cy) {
  ptr.set((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1);
  ray.setFromCamera(ptr, camera);
  const hits = ray.intersectObjects(pickables, true);
  for (const h of hits) {
    let o = h.object;
    while (o && !o.userData.partId) o = o.parent;
    if (o?.userData.partId) return o.userData.partId;
  }
  return null;
}

canvas.addEventListener('pointerup', ev => {
  if (ev.detail === 0) return;
  // Ignore if it was a drag (OrbitControls).
  if (controls._state !== undefined && controls._state !== -1) return;
}, { passive: true });

let down = null;
canvas.addEventListener('pointerdown', ev => { down = { x: ev.clientX, y: ev.clientY, t: performance.now() }; });
canvas.addEventListener('pointerup', ev => {
  if (!down) return;
  const dx = ev.clientX - down.x, dy = ev.clientY - down.y;
  const dt = performance.now() - down.t;
  down = null;
  if (dx * dx + dy * dy > 64 || dt > 700) return;
  const id = pickAt(ev.clientX, ev.clientY);
  if (id) openSheet(id);
});

/* ---------- UI events ---------- */
$('#bView').onclick = () => setMode('view');
$('#bExplode').onclick = () => setMode(mode === 'explode' ? 'view' : 'explode');
$('#bAssemble').onclick = () => setMode(mode === 'assemble' ? 'view' : 'assemble');
$('#bPrev').onclick = prevStep;
$('#bNext').onclick = nextStep;
$('#bParts').onclick = () => { if ($('#parts').classList.contains('hidden')) openParts(); else closeParts(); };
$('#bLabels').onclick = () => setLabels(!labelsOn);
$('#bFull').onclick = async () => {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch { /* plein écran refusé : on ignore */ }
};
document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => {
  const id = b.getAttribute('data-close');
  if (id === 'sheet') closeSheet();
  if (id === 'parts') closeParts();
});

addEventListener('keydown', ev => {
  if (ev.key === 'Escape') { closeSheet(); closeParts(); return; }
  if (ev.target && /input|textarea/i.test(ev.target.tagName)) return;
  const k = ev.key.toLowerCase();
  if (k === 'v') setMode('view');
  else if (k === 'e') setMode(mode === 'explode' ? 'view' : 'explode');
  else if (k === 'a') setMode(mode === 'assemble' ? 'view' : 'assemble');
  else if (k === 'l') setLabels(!labelsOn);
  else if (k === 'p') { if ($('#parts').classList.contains('hidden')) openParts(); else closeParts(); }
  else if (k === 'arrowright' || k === ' ') { if (mode === 'assemble') { ev.preventDefault(); nextStep(); } }
  else if (k === 'arrowleft') { if (mode === 'assemble') { ev.preventDefault(); prevStep(); } }
  else if (k === 'f' || ev.key === 'F11') { ev.preventDefault(); $('#bFull').click(); }
});

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.fov = w < h ? 58 : 46;
  camera.updateProjectionMatrix();
  if (ready) updateLabels();
}
addEventListener('resize', resize);
resize();

/* ---------- Boucle ---------- */
function tick() {
  requestAnimationFrame(tick);
  const dt = Math.min(0.05, clock.getDelta());
  const t = clock.elapsedTime;

  if (mixer) mixer.update(dt);
  if (carMixer) carMixer.update(dt);

  if (hasClips()) {
    if (mode === 'explode' && currentAction && currentClipName === 'explode') {
      const d = currentAction.getClip().duration;
      explodeT = d ? Math.min(1, currentAction.time / d) : 1;
      if (currentAction.paused || !currentAction.isRunning()) explodeT = 1;
    } else if (mode !== 'explode') {
      explodeT = 0;
    }
    if (mode === 'assemble' && assembleStep < 25 && currentAction && currentClipName && currentClipName.startsWith('assemble_')) {
      const d = currentAction.getClip().duration;
      assembleLerp = d ? Math.min(1, currentAction.time / d) : 1;
      if (currentAction.paused || !currentAction.isRunning()) assembleLerp = 1;
      if (assembleLerp >= 1) updateAssembleUI();
    } else if (mode === 'assemble' && assembleStep >= 25) {
      assembleLerp = 1;
    }
  } else {
    if (mode === 'explode') {
      const spd = 1.6;
      explodeT += (explodeTarget - explodeT) * Math.min(1, dt * spd * 3);
      if (Math.abs(explodeTarget - explodeT) < 0.003) explodeT = explodeTarget;
    } else {
      explodeT += (0 - explodeT) * Math.min(1, dt * 5);
      if (explodeT < 0.003) explodeT = 0;
    }
    if (mode === 'assemble' && assembleLerp < 1) {
      assembleLerp = Math.min(1, assembleLerp + dt * (1000 / animMs));
      if (assembleLerp >= 1) updateAssembleUI();
    }
  }

  applyPoses();
  for (const s of spiners) s.obj.rotation.y += dt * 1.4 * s.dir;
  for (const m of ledMats) m.emissiveIntensity = 1.15 + Math.sin(t * 3.2) * 0.45;
  if (screenMat) screenMat.emissiveIntensity = 0.22 + Math.sin(t * 1.6) * 0.06;

  if (camAnim) {
    camAnim.t = Math.min(1, camAnim.t + dt * 1.8);
    const k = camAnim.t * camAnim.t * (3 - 2 * camAnim.t);
    camera.position.lerpVectors(camAnim.p0, camAnim.p1, k);
    controls.target.lerpVectors(camAnim.t0, camAnim.t1, k);
    if (camAnim.t >= 1) camAnim = null;
  }
  controls.update();
  renderer.render(scene, camera);
  if (ready && (labelsOn || selectedBom)) updateLabels();
}
tick();
boot();

/* ---------- API de test ---------- */
function posOf(n) {
  const o = (carRoot && carRoot.getObjectByName(n)) || (unitRoot && unitRoot.getObjectByName(n)) || scene.getObjectByName(n);
  if (!o) return null;
  const v = o.getWorldPosition(new THREE.Vector3());
  return { name: o.name, x: +v.x.toFixed(4), y: +v.y.toFixed(4), z: +v.z.toFixed(4) };
}
function screenOf(n) {
  const o = (carRoot && carRoot.getObjectByName(n)) || (unitRoot && unitRoot.getObjectByName(n));
  if (!o) return null;
  const v = new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3()).project(camera);
  return [Math.round((v.x + 1) / 2 * innerWidth), Math.round((1 - v.y) / 2 * innerHeight)];
}
function sizes() {
  const unit = new THREE.Box3().setFromObject(unitRoot);
  const car = new THREE.Box3().setFromObject(carRoot);
  const us = unit.getSize(new THREE.Vector3());
  const cs = car.getSize(new THREE.Vector3());
  if (mountNode) mountNode.updateWorldMatrix(true, true);
  if (unitRoot) unitRoot.updateWorldMatrix(true, true);
  const mw = mountNode ? mountNode.getWorldPosition(new THREE.Vector3()) : null;
  const uw = unitRoot ? unitRoot.getWorldPosition(new THREE.Vector3()) : null;
  return {
    unit: { x: +us.x.toFixed(3), y: +us.y.toFixed(3), z: +us.z.toFixed(3) },
    car: { x: +cs.x.toFixed(3), y: +cs.y.toFixed(3), z: +cs.z.toFixed(3) },
    mount: mountNode ? { x: +mountNode.position.x.toFixed(4), y: +mountNode.position.y.toFixed(4), z: +mountNode.position.z.toFixed(4) } : null,
    mountWorld: mw ? { x: +mw.x.toFixed(4), y: +mw.y.toFixed(4), z: +mw.z.toFixed(4) } : null,
    unitWorld: uw ? { x: +uw.x.toFixed(4), y: +uw.y.toFixed(4), z: +uw.z.toFixed(4) } : null,
  };
}

window.__c204 = {
  version: VERSION,
  get ready() { return ready; },
  get source() { return { ...source }; },
  roots: ROOTS,
  get mode() { return mode; },
  setMode,
  get explode() { return { lerp: +explodeT.toFixed(3), target: explodeTarget, clip: !!clipMap['explode'], current: currentClipName }; },
  get clips() {
    const names = Object.keys(clipMap).sort();
    return { names, count: names.length, current: currentClipName, loop: !!(currentAction && currentAction.loop === THREE.LoopRepeat) };
  },
  playClip, openLid, restoreRest,
  get carClips() {
    const names = Object.keys(carClipMap).sort();
    return { names, count: names.length, current: currentCarClipName, loop: !!(currentCarAction && currentCarAction.loop === THREE.LoopRepeat) };
  },
  playCarClip,
  get missingParts() {
    if (!unitRoot) return BOM.map(b => b.id);
    return BOM.filter(b => !b.nodes.some(n => unitRoot.getObjectByName(n))).map(b => ({ id: b.id, nodes: b.nodes }));
  },
  get assemble() {
    const a = ASSEMBLY[assembleStep - 1];
    return { step: assembleStep, total: ASSEMBLY.length, id: a?.id ?? null, title: a?.title ?? '', lerp: +assembleLerp.toFixed(3), banner: $('#asmBanner')?.textContent || '', hidden: $('#assemble').classList.contains('hidden') };
  },
  setAssembleStep,
  nextStep, prevStep,
  get animMs() { return animMs; },
  set animMs(v) { animMs = Math.max(16, +v || 450); },
  setLabels,
  get labelsOn() { return labelsOn; },
  get selectedBom() { return selectedBom; },
  openSheet, closeSheet, openParts, closeParts,
  PARTS, BOM, ASSEMBLY, FRAME,
  posOf, screenOf, sizes,
  get nodes() {
    const names = [];
    if (unitRoot) unitRoot.traverse(o => { if (o.name) names.push(o.name); });
    if (carRoot) carRoot.traverse(o => { if (o.name) names.push(o.name); });
    return names;
  },
  labels() {
    return labelEls.map(L => {
      const r = L.el.getBoundingClientRect();
      return { n: L.n, id: L.id, hidden: L.el.classList.contains('off') || $('#labels').hidden, sel: L.el.classList.contains('sel'), x: r.x, y: r.y, w: r.width, h: r.height };
    });
  },
  labelStats() {
    const vis = labelEls.filter(L => !L.el.classList.contains('off') && !$('#labels').hidden);
    const hits = vis.map(L => {
      const r = L.el.getBoundingClientRect();
      return { n: L.n, w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y) };
    });
    return { hit: LAB, created: labelEls.length, vis: vis.length, nums: vis.map(L => L.n).sort((a, b) => a - b), overlap: labelOverlap, hits };
  },
  header() {
    const t = $('#ttlMain'), s = $('#ttlSub');
    const br = b => b.getBoundingClientRect();
    const overlap = (a, b) => !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
    const btns = [...document.querySelectorAll('#topBtns button, #topBtns a')].filter(b => b.offsetParent);
    const tr = br(t), sr = br(s);
    return {
      title: t.textContent, sub: s.textContent,
      titleCut: t.scrollWidth > t.clientWidth + 1,
      subCut: s.scrollWidth > s.clientWidth + 1,
      overlapBtns: btns.some(b => overlap(tr, br(b)) || overlap(sr, br(b))),
      w: innerWidth, h: innerHeight,
    };
  },
  get render() {
    const i = renderer.info;
    return { calls: i.render.calls, triangles: i.render.triangles, geometries: i.memory.geometries, textures: i.memory.textures, heapMB: performance.memory ? +(performance.memory.usedJSHeapSize / 1048576).toFixed(1) : null };
  },
  get hasTransmission() { return sceneHasTransmission(); },
  camera, controls, renderer, scene,
  get unit() { return unitRoot; },
  get car() { return carRoot; },
  pickAt,
};

// Hauteur réelle de la barre des modes + indice « suite plus bas »
(() => {
  const bar = document.getElementById('bar');
  const root = document.documentElement;
  const setH = () => { if (bar) root.style.setProperty('--barH', Math.ceil(bar.getBoundingClientRect().height) + 'px'); };
  setH();
  if (bar && 'ResizeObserver' in window) new ResizeObserver(setH).observe(bar);
  addEventListener('resize', setH);
  const hint = document.createElement('div');
  hint.id = 'moreHint'; hint.className = 'hidden'; hint.textContent = '▼ suite plus bas';
  document.body.appendChild(hint);
  const panels = ['sheet', 'parts'].map(id => document.getElementById(id)).filter(Boolean);
  const check = () => {
    let shown = null;
    for (const el of panels) {
      const visible = !el.classList.contains('hidden') && getComputedStyle(el).display !== 'none';
      const more = visible && el.scrollHeight - el.clientHeight - el.scrollTop > 8;
      el.classList.toggle('more', more);
      if (more) shown = el;
    }
    if (shown) {
      const r = shown.getBoundingClientRect();
      hint.style.left = (r.left + r.width / 2 - 60) + 'px';
      hint.style.top = (r.bottom - 26) + 'px';
      hint.classList.remove('hidden');
    } else hint.classList.add('hidden');
  };
  panels.forEach(el => el.addEventListener('scroll', check, { passive: true }));
  if ('MutationObserver' in window) panels.forEach(el => new MutationObserver(check).observe(el, { attributes: true, childList: true, subtree: true }));
  addEventListener('resize', check);
  setInterval(check, 500);
})();
