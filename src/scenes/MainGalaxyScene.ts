import * as THREE from "three";

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;

// === STARFIELDS ===
let deepStars: THREE.Points;
let mainStars: THREE.Points;
let brightStars: THREE.Points;

// === STREAKS (estrellas fugaces / basura) ===
let streaks: { mesh: THREE.Mesh; speed: number }[] = [];

// Movimiento híbrido de cámara
let targetCameraX = 0;
let targetCameraY = 0;
let currentCameraX = 0;
let currentCameraY = 0;

let mouse = new THREE.Vector2();

// Crucero espacial (diagonal derecha + hacia adelante)
const CRUISE_X = -0.8; // nave va hacia la derecha → estrellas hacia la izquierda
const CRUISE_Z = 0.8; // nave va hacia delante → estrellas vienen hacia ti

export function initGalaxyScene() {
  const canvas = document.getElementById("galaxy-canvas") as HTMLCanvasElement;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  setupLights();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 0, 50);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // === ESTRELLAS POR CAPAS ===
  deepStars = createStarLayer(3000, 1, 0xffffff); // fondo super lejano
  mainStars = createStarLayer(1500, 2, 0xdcecff); // capa principal
  brightStars = createStarLayer(80, 4, 0xbfdcff); // estrellas grandes y brillantes

  scene.add(deepStars);
  scene.add(mainStars);
  scene.add(brightStars);

  animate();

  window.addEventListener("resize", onResize);

  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;

    targetCameraX = x * 2.5;
    targetCameraY = y * 1.5;

    mouse.x = x;
    mouse.y = y;
  });

  // Estrellas fugaces
  setInterval(() => {
    // A veces 1, a veces 2 fugaces seguidas
    const amount = Math.random() < 0.7 ? 1 : 2;
    for (let i = 0; i < amount; i++) {
      spawnStreak();
    }
  }, 900); // cada 0.9s aproximadamente
}

// ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐
// ⭐      STAR TEXTURE (CÍRCULOS) ⭐
// ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐

function createStarTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

// ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐
// ⭐      GENERADOR DE CAPAS      ⭐
// ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐

function createStarLayer(count: number, size: number, color: number) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    positions[i3] = (Math.random() - 0.5) * 600;
    positions[i3 + 1] = (Math.random() - 0.5) * 300;
    positions[i3 + 2] = (Math.random() - 0.5) * 600;

    // Variación en tamaño
    sizes[i] = size + Math.random() * size * 0.3;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: size,
    map: createStarTexture(),
    transparent: true,
    color: color,
    opacity: 0.9,
    sizeAttenuation: true,
  });

  return new THREE.Points(geometry, material);
}

// ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐
// ⭐       ESTRELLAS FUGACES       ⭐
// ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐

function spawnStreak() {
  const geometry = new THREE.PlaneGeometry(4, 0.25);
  const material = new THREE.MeshBasicMaterial({
    color: 0xdcecff,
    transparent: true,
    opacity: 0.85,
  });

  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(
    -160,
    (Math.random() - 0.5) * 120,
    -60 - Math.random() * 60
  );

  const speed = 2 + Math.random() * 3;

  scene.add(mesh);
  streaks.push({ mesh, speed });
}

// ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐
// ⭐            ANIMATE            ⭐
// ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐

function animate() {
  requestAnimationFrame(animate);

  moveStarLayer(deepStars, 0.025, 0.06);
  moveStarLayer(mainStars, 0.055, 0.12);
  moveStarLayer(brightStars, 0.085, 0.18);

  // FUGACES / BASURA
  for (const s of streaks) {
    s.mesh.position.x += s.speed;
    if (s.mesh.position.x > 180) scene.remove(s.mesh);
  }

  // MOVIMIENTO DE CÁMARA (inclinación suave)
  currentCameraX += (targetCameraX - currentCameraX) * 0.05;
  currentCameraY += (targetCameraY - currentCameraY) * 0.05;

  camera.position.x = currentCameraX;
  camera.position.y = currentCameraY;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

// ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐
// ⭐       MOVER CADA CAPA        ⭐
// ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐

function moveStarLayer(points: THREE.Points, speedX: number, speedZ: number) {
  const positions = points.geometry.attributes
    .position as THREE.BufferAttribute;

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i) + CRUISE_X * speedX * 3;
    const y = positions.getY(i);
    const z = positions.getZ(i) + CRUISE_Z * speedZ * 3;

    positions.setXYZ(i, x, y, z);

    // Reciclado natural
    if (z > 250 || z < -300 || x < -300 || x > 300) {
      positions.setXYZ(
        i,
        (Math.random() - 0.5) * 600,
        (Math.random() - 0.5) * 300,
        -200 - Math.random() * 300
      );
    }
  }

  positions.needsUpdate = true;
}

// ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function setupLights() {
  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xdcecff, 0.6);
  keyLight.position.set(40, 40, 30);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xbfdcff, 0.4);
  rimLight.position.set(-30, -25, -20);
  scene.add(rimLight);
}
