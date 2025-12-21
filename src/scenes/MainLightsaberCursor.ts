// src/scenes/MainLightsaberCursor.ts
import { ensureAudioReady } from "./LightsaberAudio";

function initLightsaberCursor() {
  const saberEl = document.querySelector<HTMLImageElement>("#lightsaber-cursor");
  const portals = document.querySelectorAll<HTMLElement>(".portal");

  if (!saberEl) {
    console.warn("Lightsaber cursor no encontrado");
    return;
  }

  // ✅ variable asegurada (evita error TS en closures)
  const saber = saberEl;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  document.body.style.cursor = "none";

  window.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function animate() {
    currentX += (targetX - currentX) * 0.35;
    currentY += (targetY - currentY) * 0.35;

    saber.style.left = `${currentX}px`;
    saber.style.top = `${currentY}px`;

    const saberRect = saber.getBoundingClientRect();

    portals.forEach((portal) => {
      const rect = portal.getBoundingClientRect();
      const isHovering =
        saberRect.left < rect.right &&
        saberRect.right > rect.left &&
        saberRect.top < rect.bottom &&
        saberRect.bottom > rect.top;

      portal.classList.toggle("portal--active", isHovering);
    });

    requestAnimationFrame(animate);
  }

  saber.style.display = "block";
  animate();

  // Desbloquear audio en primera interacción (no hace ignition aquí)
  window.addEventListener(
    "pointerdown",
    () => {
      void ensureAudioReady();
    },
    { once: true }
  );
}

window.addEventListener("DOMContentLoaded", initLightsaberCursor);
