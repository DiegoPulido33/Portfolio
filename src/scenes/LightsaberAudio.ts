// src/scenes/LightsaberAudio.ts
let ctx: AudioContext | null = null;

let humAudio: HTMLAudioElement | null = null;
let humGain: GainNode | null = null;

let lastTime = performance.now();
let lastX = 0;
let lastY = 0;

let initialized = false;

let lastSwingTime = 0;
const SWING_COOLDOWN = 180;
const SWING_SPEED_THRESHOLD = 0.75;

export async function ensureAudioReady() {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") await ctx.resume();

  if (initialized) return;

  humAudio = new Audio("/audio/lightsaber/lightsaber-hum.mp3");
  humAudio.loop = true;

  const humSource = ctx.createMediaElementSource(humAudio);
  humGain = ctx.createGain();
  humGain.gain.value = 0.22;

  humSource.connect(humGain).connect(ctx.destination);
  await humAudio.play();

  window.addEventListener("mousemove", handleMouseMove, { passive: true });
  initialized = true;
}

export function playIgnition() {
  if (!ctx) return;
  playOneShot("/audio/lightsaber/lightsaber-ignition.mp3", 0.95);
}

function handleMouseMove(e: MouseEvent) {
  if (!ctx || !humGain) return;

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
  if (!ctx) return;

  const audio = new Audio(src);
  const source = ctx.createMediaElementSource(audio);
  const gain = ctx.createGain();

  gain.gain.value = volume;
  source.connect(gain).connect(ctx.destination);
  audio.play();
}
