import * as THREE from "three";

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let canvas: HTMLCanvasElement | null = null;

let holoGroup: THREE.Group;
let crystalCore: THREE.Mesh;
let crystalShell: THREE.Mesh;
let ringPrimary: THREE.Mesh;
let ringSecondary: THREE.Mesh;
let arcRing: THREE.Mesh;
let starPoints: THREE.Points;
let starLineA: THREE.Line;
let starLineB: THREE.Line;

let animationFrameId = 0;
let currentTime = 0;

export function initHoloPlanetNav() {
  canvas = document.getElementById(
    "holo-planet-canvas",
  ) as HTMLCanvasElement | null;

  if (!canvas) return;

  disposeSceneIfNeeded();

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    42,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100,
  );
  camera.position.set(0, 0.15, 7.2);

  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  setupLights();
  createHoloSystem();

  window.addEventListener("resize", onResize);

  animate();
}

function disposeSceneIfNeeded() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = 0;
  }

  if (renderer) {
    renderer.dispose();
  }
}

function setupLights() {
  const ambient = new THREE.AmbientLight(0x9beeff, 0.88);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xd4fbff, 1.05);
  key.position.set(2.8, 3.2, 5.2);
  scene.add(key);

  const fill = new THREE.PointLight(0x5cecff, 1.1, 12, 2);
  fill.position.set(-1.6, 0.8, 3.2);
  scene.add(fill);

  const rim = new THREE.PointLight(0x9af6ff, 0.9, 14, 2);
  rim.position.set(0.6, 1.8, -2.6);
  scene.add(rim);
}

function createHoloSystem() {
  holoGroup = new THREE.Group();
  holoGroup.position.set(0, 0.12, 0);
  scene.add(holoGroup);

  const crystalGeometry = new THREE.OctahedronGeometry(0.46, 0);
  const crystalMaterial = new THREE.MeshPhongMaterial({
    color: 0xbdf8ff,
    emissive: 0x56dfff,
    emissiveIntensity: 0.38,
    transparent: true,
    opacity: 0.88,
    shininess: 120,
    specular: 0xffffff,
  });

  crystalCore = new THREE.Mesh(crystalGeometry, crystalMaterial);
  crystalCore.scale.set(0.54, 1.46, 0.54);
  holoGroup.add(crystalCore);

  const shellGeometry = new THREE.OctahedronGeometry(0.7, 0);
  const shellMaterial = new THREE.MeshBasicMaterial({
    color: 0x8ff3ff,
    transparent: true,
    opacity: 0.1,
    wireframe: true,
  });

  crystalShell = new THREE.Mesh(shellGeometry, shellMaterial);
  crystalShell.scale.set(0.66, 1.7, 0.66);
  holoGroup.add(crystalShell);

  const ringGeometryPrimary = new THREE.TorusGeometry(1.12, 0.008, 16, 180);
  const ringMaterialPrimary = new THREE.MeshBasicMaterial({
    color: 0x8cecff,
    transparent: true,
    opacity: 0.18,
  });

  ringPrimary = new THREE.Mesh(ringGeometryPrimary, ringMaterialPrimary);
  ringPrimary.rotation.x = Math.PI / 2;
  holoGroup.add(ringPrimary);

  const ringGeometrySecondary = new THREE.TorusGeometry(0.86, 0.005, 16, 160);
  const ringMaterialSecondary = new THREE.MeshBasicMaterial({
    color: 0xd4fbff,
    transparent: true,
    opacity: 0.1,
  });

  ringSecondary = new THREE.Mesh(ringGeometrySecondary, ringMaterialSecondary);
  ringSecondary.rotation.x = Math.PI / 2;
  ringSecondary.rotation.z = 0.64;
  holoGroup.add(ringSecondary);

  const arcGeometry = new THREE.TorusGeometry(
    1.42,
    0.007,
    16,
    180,
    Math.PI * 1.05,
  );
  const arcMaterial = new THREE.MeshBasicMaterial({
    color: 0x72e9ff,
    transparent: true,
    opacity: 0.12,
  });

  arcRing = new THREE.Mesh(arcGeometry, arcMaterial);
  arcRing.rotation.x = Math.PI / 2;
  arcRing.rotation.z = -0.34;
  holoGroup.add(arcRing);

  createStarMap();
}

function createStarMap() {
  const pointPositions = new Float32Array([
    -0.95, 0.22, 0,
    -0.38, 0.62, 0,
    0.0, 0.26, 0,
    0.58, 0.54, 0,
    0.96, 0.1, 0,
    -0.54, -0.48, 0,
    0.46, -0.42, 0,
  ]);

  const pointsGeometry = new THREE.BufferGeometry();
  pointsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(pointPositions, 3),
  );

  const pointsMaterial = new THREE.PointsMaterial({
    color: 0xcffcff,
    size: 0.06,
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
  });

  starPoints = new THREE.Points(pointsGeometry, pointsMaterial);
  starPoints.position.y = 0.06;
  holoGroup.add(starPoints);

  const lineGeometryA = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-0.95, 0.22, 0),
    new THREE.Vector3(-0.38, 0.62, 0),
    new THREE.Vector3(0.0, 0.26, 0),
    new THREE.Vector3(0.58, 0.54, 0),
    new THREE.Vector3(0.96, 0.1, 0),
  ]);

  const lineMaterialA = new THREE.LineBasicMaterial({
    color: 0x86ecff,
    transparent: true,
    opacity: 0.16,
  });

  starLineA = new THREE.Line(lineGeometryA, lineMaterialA);
  starLineA.position.y = 0.06;
  holoGroup.add(starLineA);

  const lineGeometryB = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-0.54, -0.48, 0),
    new THREE.Vector3(0.0, 0.26, 0),
    new THREE.Vector3(0.46, -0.42, 0),
  ]);

  const lineMaterialB = new THREE.LineBasicMaterial({
    color: 0xbef8ff,
    transparent: true,
    opacity: 0.11,
  });

  starLineB = new THREE.Line(lineGeometryB, lineMaterialB);
  starLineB.position.y = 0.06;
  holoGroup.add(starLineB);

  const lowerDiscGeometry = new THREE.RingGeometry(0.18, 0.34, 64);
  const lowerDiscMaterial = new THREE.MeshBasicMaterial({
    color: 0x98f5ff,
    transparent: true,
    opacity: 0.12,
    side: THREE.DoubleSide,
  });

  const lowerDisc = new THREE.Mesh(lowerDiscGeometry, lowerDiscMaterial);
  lowerDisc.rotation.x = Math.PI / 2;
  lowerDisc.position.y = -0.7;
  holoGroup.add(lowerDisc);
}

function animate() {
  animationFrameId = requestAnimationFrame(animate);

  currentTime += 0.01;

  holoGroup.rotation.y += 0.0018;
  holoGroup.position.y = 0.12 + Math.sin(currentTime * 1.2) * 0.014;

  crystalCore.rotation.y += 0.0024;
  crystalCore.rotation.z = Math.sin(currentTime * 0.9) * 0.04;

  crystalShell.rotation.y -= 0.002;
  crystalShell.rotation.x = Math.sin(currentTime * 0.6) * 0.045;

  ringPrimary.rotation.z += 0.0021;
  ringSecondary.rotation.z -= 0.0017;
  arcRing.rotation.z += 0.0009;

  starPoints.rotation.z = Math.sin(currentTime * 0.35) * 0.06;
  starLineA.rotation.z = Math.sin(currentTime * 0.3) * 0.03;
  starLineB.rotation.z = -Math.sin(currentTime * 0.34) * 0.028;

  const crystalMaterial = crystalCore.material as THREE.MeshPhongMaterial;
  crystalMaterial.emissiveIntensity =
    0.3 + (Math.sin(currentTime * 1.8) + 1) * 0.05;

  const shellMaterial = crystalShell.material as THREE.MeshBasicMaterial;
  shellMaterial.opacity = 0.08 + (Math.sin(currentTime * 1.4) + 1) * 0.015;

  renderer.render(scene, camera);
}

function onResize() {
  if (!canvas) return;

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  if (width === 0 || height === 0) return;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height, false);
}