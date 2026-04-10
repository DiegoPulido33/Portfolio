import * as THREE from "three";

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let canvas: HTMLCanvasElement | null = null;

let holoGroup: THREE.Group;
let planet: THREE.Mesh;
let outerGlow: THREE.Mesh;
let orbitRing: THREE.Mesh;

const nodeMeshes: THREE.Mesh[] = [];
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(-10, -10);

let currentRotationY = 0;
let targetRotationY = 0;
let currentFloatTime = 0;

let hoveredNode: THREE.Mesh | null = null;

const NODE_DATA = [
  { id: "about", label: "Sobre mí", angle: 0 },
  { id: "projects", label: "Proyectos", angle: Math.PI / 2 },
  { id: "future", label: "Ideas Futuras", angle: Math.PI },
  { id: "contact", label: "Contacto", angle: (Math.PI * 3) / 2 },
];

export function initHoloPlanetNav() {
  canvas = document.getElementById(
    "holo-planet-canvas",
  ) as HTMLCanvasElement | null;
  if (!canvas) return;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100,
  );
  camera.position.set(0, 0, 8);

  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  setupLights();
  createHoloCore();
  createOrbitNodes();

  window.addEventListener("resize", onResize);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerleave", onPointerLeave);

  animate();
}

function setupLights() {
  const ambient = new THREE.AmbientLight(0x99eeff, 1.2);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xb8f4ff, 1.5);
  key.position.set(3, 4, 6);
  scene.add(key);

  const rim = new THREE.PointLight(0x00eeff, 2.2, 20, 2);
  rim.position.set(0, 0, 4);
  scene.add(rim);
}

function createHoloCore() {
  holoGroup = new THREE.Group();
  scene.add(holoGroup);

  const planetGeometry = new THREE.SphereGeometry(0.82, 48, 48);
  const planetMaterial = new THREE.MeshPhongMaterial({
    color: 0x7eefff,
    emissive: 0x12b7c9,
    emissiveIntensity: 0.38,
    transparent: true,
    opacity: 0.34,
    shininess: 120,
    specular: 0xe8ffff,
  });

  planet = new THREE.Mesh(planetGeometry, planetMaterial);
  holoGroup.add(planet);

  const glowGeometry = new THREE.SphereGeometry(1.2, 40, 40);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x66f4ff,
    transparent: true,
    opacity: 0.12,
    side: THREE.DoubleSide,
  });

  outerGlow = new THREE.Mesh(glowGeometry, glowMaterial);
  holoGroup.add(outerGlow);

  const ringGeometry = new THREE.TorusGeometry(1.7, 0.012, 16, 120);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x4bdfff,
    transparent: true,
    opacity: 0.28,
  });

  orbitRing = new THREE.Mesh(ringGeometry, ringMaterial);
  orbitRing.rotation.x = Math.PI / 2;
  holoGroup.add(orbitRing);

  const innerRingGeometry = new THREE.TorusGeometry(1.2, 0.008, 16, 100);
  const innerRingMaterial = new THREE.MeshBasicMaterial({
    color: 0xb8ffff,
    transparent: true,
    opacity: 0.14,
  });

  const innerRing = new THREE.Mesh(innerRingGeometry, innerRingMaterial);
  innerRing.rotation.x = Math.PI / 2;
  innerRing.rotation.z = 0.45;
  holoGroup.add(innerRing);
}

function createOrbitNodes() {
  const nodeGeometry = new THREE.SphereGeometry(0.12, 24, 24);

  for (const node of NODE_DATA) {
    const material = new THREE.MeshBasicMaterial({
      color: 0xd8fcff,
      transparent: true,
      opacity: 0.95,
    });

    const mesh = new THREE.Mesh(nodeGeometry, material);

    const radius = 1.7;
    const x = Math.cos(node.angle) * radius;
    const z = Math.sin(node.angle) * radius;

    mesh.position.set(x, 0, z);
    mesh.userData = {
      nodeId: node.id,
      label: node.label,
      baseScale: 1,
      targetScale: 1,
    };

    nodeMeshes.push(mesh);
    holoGroup.add(mesh);
  }
}

function onPointerMove(event: PointerEvent) {
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();

  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function onPointerLeave() {
  pointer.x = -10;
  pointer.y = -10;
  hoveredNode = null;
}

function updateHover() {
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(nodeMeshes, false);

  hoveredNode =
    intersects.length > 0 ? (intersects[0].object as THREE.Mesh) : null;

  for (const mesh of nodeMeshes) {
    const material = mesh.material as THREE.MeshBasicMaterial;
    const isHovered = mesh === hoveredNode;

    mesh.userData.targetScale = isHovered ? 1.8 : 1;

    material.opacity = isHovered ? 1 : 0.88;
    material.color.setHex(isHovered ? 0xffffff : 0xd8fcff);

    if (isHovered) {
      const angle = Math.atan2(mesh.position.x, mesh.position.z);
      targetRotationY = -angle;
    }
  }
}

function animate() {
  requestAnimationFrame(animate);

  currentFloatTime += 0.01;
  updateHover();

  currentRotationY += (targetRotationY - currentRotationY) * 0.06;
  holoGroup.rotation.y = currentRotationY;

  holoGroup.position.y = Math.sin(currentFloatTime) * 0.08;

  planet.rotation.y += 0.004;
  planet.rotation.x += 0.0015;

  orbitRing.rotation.z += 0.003;
  outerGlow.scale.setScalar(1 + Math.sin(currentFloatTime * 1.4) * 0.02);

  for (const mesh of nodeMeshes) {
    const targetScale = mesh.userData.targetScale ?? 1;
    mesh.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.12,
    );
  }

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
