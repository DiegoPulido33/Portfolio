// src/scenes/LightsaberAudio.ts
declare global {
  interface Window {
    __portfolioAudioLocked?: boolean;
  }
}

function isAudioLocked() {
  return window.__portfolioAudioLocked === true;
}

let ctx: AudioContext | null = null;

let humAudio: HTMLAudioElement | null = null;
let humGain: GainNode | null = null;
let masterGain: GainNode | null = null;

let lastTime = performance.now();
let lastX = 0;
let lastY = 0;

let initialized = false;
let pendingInit = false;
let audioEnabled = true;

let lastSwingTime = 0;
const SWING_COOLDOWN = 180;
const SWING_SPEED_THRESHOLD = 0.75;

function setMasterVolume(enabled: boolean) {
  audioEnabled = enabled;

  if (!ctx || !masterGain) return;

  masterGain.gain.setTargetAtTime(
    enabled ? 1 : 0,
    ctx.currentTime,
    0.08
  );
}

export function setAudioEnabled(enabled: boolean) {
  setMasterVolume(enabled);
}

export function getAudioEnabled() {
  return audioEnabled;
}

export async function ensureAudioReady() {
  if (isAudioLocked()) {
    pendingInit = true;
    return;
  }

  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") await ctx.resume();

  if (initialized) {
    setMasterVolume(audioEnabled);
    return;
  }

  humAudio = new Audio("/audio/lightsaber/lightsaber-hum.mp3");
  humAudio.loop = true;

  masterGain = ctx.createGain();
  masterGain.gain.value = audioEnabled ? 1 : 0;
  masterGain.connect(ctx.destination);

  const humSource = ctx.createMediaElementSource(humAudio);
  humGain = ctx.createGain();
  humGain.gain.value = 0.22;

  humSource.connect(humGain).connect(masterGain);
  await humAudio.play();

  window.addEventListener("mousemove", handleMouseMove, { passive: true });
  initialized = true;
  pendingInit = false;
}

export function playIgnition() {
  if (!ctx || !audioEnabled) return;
  playOneShot("/audio/lightsaber/lightsaber-ignition.mp3", 0.95);
}

function handleMouseMove(e: MouseEvent) {
  if (!ctx || !humGain || !audioEnabled) return;

  const now = performance.now();
  const dt = Math.max(8, now - lastTime);

  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  const speed = Math.sqrt(dx * dx + dy * dy) / dt;

  lastTime = now;
  lastX = e.clientX;
  lastY = e.clientY;

  const intensity = Math.min(speed * 1.3, 1);

  humGain.gain.setTargetAtTime(
    0.22 + intensity * 0.25,
    ctx.currentTime,
    0.12
  );

  if (
    speed > SWING_SPEED_THRESHOLD &&
    now - lastSwingTime > SWING_COOLDOWN
  ) {
    lastSwingTime = now;
    playOneShot("/audio/lightsaber/lightsaber-swing.mp3", intensity);
  }
}

function playOneShot(src: string, volume = 1) {
  if (!ctx || !audioEnabled || !masterGain) return;

  const audio = new Audio(src);
  const source = ctx.createMediaElementSource(audio);
  const gain = ctx.createGain();

  gain.gain.value = volume;
  source.connect(gain).connect(masterGain);
  audio.play().catch(() => {});
}

window.addEventListener("cockpit:intro-finished", () => {
  if (!pendingInit || initialized) return;
  ensureAudioReady().catch(() => {});
});

window.addEventListener("portfolio:audio-toggle", ((event: CustomEvent) => {
  const enabled = event.detail?.enabled !== false;
  setAudioEnabled(enabled);
}) as EventListener);