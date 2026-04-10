import * as THREE from "three";

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;

// === STARFIELDS ===
let deepStars: THREE.Points;
let mainStars: THREE.Points;
let brightStars: THREE.Points;
let sharedStarTexture: THREE.CanvasTexture | null = null;

// === STREAKS ===
type StreakItem = {
  mesh: THREE.Mesh;
  speed: number;
  active: boolean;
};

let streakPool: StreakItem[] = [];

// === LOOP / LIFECYCLE ===
let animationFrameId: number | null = null;
let isInitialized = false;
let isPaused = false;
let isPageVisible = true;
let lastFrameTime = 0;

// === STREAK CONTROL ===
let streakSpawnTimer = 0;
let offlineStreakCredit = 0;
let returnVisibilityCooldown = 0;

// === CAMERA MOTION ===
let targetCameraX = 0;
let targetCameraY = 0;
let currentCameraX = 0;
let currentCameraY = 0;

const mouse = new THREE.Vector2();

// Crucero espacial
const CRUISE_X = -0.8;
const CRUISE_Z = 0.8;

// === CONFIG ===
const MAX_PIXEL_RATIO = 1.25;

// Delta / simulation
const MAX_DELTA_SECONDS = 1 / 30;
const HIDDEN_SIMULATION_SCALE = 0.05;
const CAMERA_LERP_VISIBLE = 0.05;
const CAMERA_LERP_HIDDEN = 0.02;

// Streaks
const STREAK_POOL_SIZE = 6;
const MAX_ACTIVE_STREAKS = 4;
const MAX_OFFLINE_STREAK_CREDIT = 1.25;
const STREAK_SPAWN_INTERVAL = 0.95;
const MAX_SPAWNS_PER_TICK = 1;
const RETURN_VISIBILITY_COOLDOWN_SECONDS = 0.35;

// Starfield ranges
const STARFIELD_X_RANGE = 600;
const STARFIELD_Y_RANGE = 300;
const STARFIELD_Z_RANGE = 600;
const STARFIELD_RECYCLE_Z_BASE = -200;
const STARFIELD_RECYCLE_Z_EXTRA = 300;

// Resize cache
let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;

// Listeners refs
let handleResizeRef: (() => void) | null = null;
let handleMouseMoveRef: ((e: MouseEvent) => void) | null = null;
let handleVisibilityChangeRef: (() => void) | null = null;
let handleMotionToggleRef: ((event: Event) => void) | null = null;

export function initGalaxyScene() {
  if (isInitialized) return;

  const canvas = document.getElementById(
    "galaxy-canvas",
  ) as HTMLCanvasElement | null;
  if (!canvas) {
    console.warn("MainGalaxyScene: no se encontró #galaxy-canvas");
    return;
  }

  isInitialized = true;
  isPaused = false;
  isPageVisible = document.visibilityState !== "hidden";
  lastFrameTime = performance.now();
  streakSpawnTimer = 0;
  offlineStreakCredit = 0;
  returnVisibilityCooldown = 0;
  targetCameraX = 0;
  targetCameraY = 0;
  currentCameraX = 0;
  currentCameraY = 0;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  setupLights();

  camera = new THREE.PerspectiveCamera(
    60,
    viewportWidth / viewportHeight,
    0.1,
    2000,
  );
  camera.position.set(0, 0, 50);

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setSize(viewportWidth, viewportHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));

  sharedStarTexture = createStarTexture();

  deepStars = createStarLayer(3000, 1, 0xffffff, sharedStarTexture);
  mainStars = createStarLayer(1500, 2, 0xdcecff, sharedStarTexture);
  brightStars = createStarLayer(80, 4, 0xbfdcff, sharedStarTexture);

  scene.add(deepStars);
  scene.add(mainStars);
  scene.add(brightStars);

  createStreakPool();

  handleResizeRef = onResize;
  window.addEventListener("resize", handleResizeRef, { passive: true });

  handleMouseMoveRef = (e: MouseEvent) => {
    const x = (e.clientX / viewportWidth) * 2 - 1;
    const y = -(e.clientY / viewportHeight) * 2 + 1;

    targetCameraX = x * 2.5;
    targetCameraY = y * 1.5;

    mouse.x = x;
    mouse.y = y;
  };
  window.addEventListener("mousemove", handleMouseMoveRef, { passive: true });

  handleVisibilityChangeRef = () => {
    const nowVisible = document.visibilityState !== "hidden";
    isPageVisible = nowVisible;

    // Evita delta gigante al volver
    lastFrameTime = performance.now();

    if (nowVisible) {
      returnVisibilityCooldown = RETURN_VISIBILITY_COOLDOWN_SECONDS;
    } else {
      // Pequeña memoria visual, nunca avalancha real
      offlineStreakCredit = Math.min(
        offlineStreakCredit + 0.75,
        MAX_OFFLINE_STREAK_CREDIT,
      );
    }
  };
  document.addEventListener("visibilitychange", handleVisibilityChangeRef);

  handleMotionToggleRef = (event: Event) => {
    const customEvent = event as CustomEvent<{ enabled?: boolean }>;
    const enabled = customEvent.detail?.enabled !== false;

    if (enabled) {
      resumeGalaxyScene();
    } else {
      pauseGalaxyScene();
    }
  };

  window.addEventListener("portfolio:motion-toggle", handleMotionToggleRef);

  startRenderLoop();
}

export function pauseGalaxyScene() {
  isPaused = true;
}

export function resumeGalaxyScene() {
  isPaused = false;
  lastFrameTime = performance.now();
}

export function destroyGalaxyScene() {
  if (!isInitialized) return;

  isInitialized = false;
  isPaused = true;

  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  if (handleResizeRef) {
    window.removeEventListener("resize", handleResizeRef);
    handleResizeRef = null;
  }

  if (handleMouseMoveRef) {
    window.removeEventListener("mousemove", handleMouseMoveRef);
    handleMouseMoveRef = null;
  }

  if (handleVisibilityChangeRef) {
    document.removeEventListener("visibilitychange", handleVisibilityChangeRef);
    handleVisibilityChangeRef = null;
  }

  disposePoints(deepStars);
  disposePoints(mainStars);
  disposePoints(brightStars);

  for (const streak of streakPool) {
    scene.remove(streak.mesh);
    streak.mesh.geometry.dispose();

    const material = streak.mesh.material;
    if (Array.isArray(material)) {
      material.forEach((m) => m.dispose());
    } else {
      material.dispose();
    }
  }
  streakPool = [];

  if (sharedStarTexture) {
    sharedStarTexture.dispose();
    sharedStarTexture = null;
  }

  if (handleMotionToggleRef) {
    window.removeEventListener(
      "portfolio:motion-toggle",
      handleMotionToggleRef,
    );
    handleMotionToggleRef = null;
  }
  
  renderer.dispose();

  // Limpieza defensiva
  // @ts-expect-error reset intencional de referencias
  scene = undefined;
  // @ts-expect-error reset intencional de referencias
  camera = undefined;
  // @ts-expect-error reset intencional de referencias
  renderer = undefined;
}

function startRenderLoop() {
  const loop = (now: number) => {
    animationFrameId = requestAnimationFrame(loop);

    if (!isInitialized || isPaused) return;

    let deltaSeconds = (now - lastFrameTime) / 1000;
    lastFrameTime = now;

    if (!Number.isFinite(deltaSeconds) || deltaSeconds < 0) {
      deltaSeconds = 0;
    }

    deltaSeconds = Math.min(deltaSeconds, MAX_DELTA_SECONDS);

    const simulationScale = isPageVisible ? 1 : HIDDEN_SIMULATION_SCALE;
    const effectiveDelta = deltaSeconds * simulationScale;

    updateScene(effectiveDelta);
    renderer.render(scene, camera);
  };

  animationFrameId = requestAnimationFrame(loop);
}

function updateScene(deltaSeconds: number) {
  updateStarfields(deltaSeconds);
  updateStreakSystem(deltaSeconds);
  updateCamera(deltaSeconds);
}

function updateStarfields(deltaSeconds: number) {
  moveStarLayer(deepStars, 0.025, 0.06, deltaSeconds);
  moveStarLayer(mainStars, 0.055, 0.12, deltaSeconds);
  moveStarLayer(brightStars, 0.085, 0.18, deltaSeconds);
}

function updateStreakSystem(deltaSeconds: number) {
  for (const streak of streakPool) {
    if (!streak.active) continue;

    streak.mesh.position.x += streak.speed * deltaSeconds * 60;

    if (streak.mesh.position.x > 180) {
      deactivateStreak(streak);
    }
  }

  if (returnVisibilityCooldown > 0) {
    returnVisibilityCooldown -= deltaSeconds;
    if (returnVisibilityCooldown < 0) {
      returnVisibilityCooldown = 0;
    }
  }

  if (!isPageVisible) {
    offlineStreakCredit = Math.min(
      offlineStreakCredit + deltaSeconds * 0.15,
      MAX_OFFLINE_STREAK_CREDIT,
    );
    return;
  }

  streakSpawnTimer += deltaSeconds;

  if (getActiveStreakCount() >= MAX_ACTIVE_STREAKS) return;
  if (returnVisibilityCooldown > 0) return;

  let spawnsThisTick = 0;

  while (
    streakSpawnTimer >= STREAK_SPAWN_INTERVAL &&
    spawnsThisTick < MAX_SPAWNS_PER_TICK &&
    getActiveStreakCount() < MAX_ACTIVE_STREAKS
  ) {
    streakSpawnTimer -= STREAK_SPAWN_INTERVAL;

    spawnStreakFromPool();
    spawnsThisTick++;

    if (Math.random() < 0.25) {
      offlineStreakCredit = Math.min(
        offlineStreakCredit + 0.25,
        MAX_OFFLINE_STREAK_CREDIT,
      );
    }
  }

  if (
    offlineStreakCredit >= 1 &&
    spawnsThisTick < MAX_SPAWNS_PER_TICK &&
    getActiveStreakCount() < MAX_ACTIVE_STREAKS
  ) {
    spawnStreakFromPool();
    offlineStreakCredit -= 1;
  }
}

function updateCamera(deltaSeconds: number) {
  const lerpFactor = isPageVisible ? CAMERA_LERP_VISIBLE : CAMERA_LERP_HIDDEN;
  const normalizedLerp = 1 - Math.pow(1 - lerpFactor, deltaSeconds * 60);

  currentCameraX += (targetCameraX - currentCameraX) * normalizedLerp;
  currentCameraY += (targetCameraY - currentCameraY) * normalizedLerp;

  camera.position.x = currentCameraX;
  camera.position.y = currentCameraY;
  camera.lookAt(0, 0, 0);
}

function createStarTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error(
      "MainGalaxyScene: no se pudo crear contexto 2D para textura de estrella",
    );
  }

  ctx.clearRect(0, 0, size, size);
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createStarLayer(
  count: number,
  size: number,
  color: number,
  texture: THREE.CanvasTexture,
) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    positions[i3] = (Math.random() - 0.5) * STARFIELD_X_RANGE;
    positions[i3 + 1] = (Math.random() - 0.5) * STARFIELD_Y_RANGE;
    positions[i3 + 2] = (Math.random() - 0.5) * STARFIELD_Z_RANGE;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size,
    map: texture,
    transparent: true,
    color,
    opacity: 0.9,
    sizeAttenuation: true,
    depthWrite: false,
  });

  return new THREE.Points(geometry, material);
}

function createStreakPool() {
  streakPool = [];

  for (let i = 0; i < STREAK_POOL_SIZE; i++) {
    const geometry = new THREE.PlaneGeometry(4, 0.25);
    const material = new THREE.MeshBasicMaterial({
      color: 0xdcecff,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.visible = false;
    mesh.frustumCulled = true;
    scene.add(mesh);

    streakPool.push({
      mesh,
      speed: 0,
      active: false,
    });
  }
}

function spawnStreakFromPool() {
  const streak = streakPool.find((item) => !item.active);
  if (!streak) return;

  streak.active = true;
  streak.speed = 2 + Math.random() * 3;

  streak.mesh.visible = true;
  streak.mesh.position.set(
    -160,
    (Math.random() - 0.5) * 120,
    -60 - Math.random() * 60,
  );

  streak.mesh.rotation.z = THREE.MathUtils.degToRad(-12 + Math.random() * 8);
}

function deactivateStreak(streak: StreakItem) {
  streak.active = false;
  streak.speed = 0;
  streak.mesh.visible = false;
  streak.mesh.position.set(9999, 9999, 9999);
}

function getActiveStreakCount() {
  let count = 0;
  for (const streak of streakPool) {
    if (streak.active) count++;
  }
  return count;
}

function moveStarLayer(
  points: THREE.Points,
  speedX: number,
  speedZ: number,
  deltaSeconds: number,
) {
  const positions = points.geometry.attributes
    .position as THREE.BufferAttribute;
  const array = positions.array as Float32Array;
  const frameFactor = deltaSeconds * 60;

  const moveX = CRUISE_X * speedX * 3 * frameFactor;
  const moveZ = CRUISE_Z * speedZ * 3 * frameFactor;

  for (let i = 0; i < array.length; i += 3) {
    const x = array[i] + moveX;
    const y = array[i + 1];
    const z = array[i + 2] + moveZ;

    if (z > 250 || z < -300 || x < -300 || x > 300) {
      array[i] = (Math.random() - 0.5) * STARFIELD_X_RANGE;
      array[i + 1] = (Math.random() - 0.5) * STARFIELD_Y_RANGE;
      array[i + 2] =
        STARFIELD_RECYCLE_Z_BASE - Math.random() * STARFIELD_RECYCLE_Z_EXTRA;
    } else {
      array[i] = x;
      array[i + 1] = y;
      array[i + 2] = z;
    }
  }

  positions.needsUpdate = true;
}

function onResize() {
  if (!camera || !renderer) return;

  viewportWidth = window.innerWidth;
  viewportHeight = window.innerHeight;

  camera.aspect = viewportWidth / viewportHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(viewportWidth, viewportHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
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

function disposePoints(points: THREE.Points) {
  if (!points) return;

  scene.remove(points);
  points.geometry.dispose();

  const material = points.material;
  if (Array.isArray(material)) {
    material.forEach((m) => m.dispose());
  } else {
    material.dispose();
  }
}
