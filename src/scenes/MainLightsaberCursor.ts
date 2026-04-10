// src/scenes/MainLightsaberCursor.ts
import { ensureAudioReady } from "./LightsaberAudio";

const TRAIL_COUNT = 8;

function initLightsaberCursor() {
  const saberEl = document.querySelector<HTMLImageElement>("#lightsaber-cursor");
  const portals = document.querySelectorAll<HTMLElement>(".portal");

  if (!saberEl) {
    console.warn("Lightsaber cursor no encontrado");
    return;
  }

  const saber = saberEl;

  const isTouchLike =
    window.matchMedia("(pointer: coarse)").matches ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

  let targetX = window.innerWidth * 0.5;
  let targetY = window.innerHeight * 0.5;
  let currentX = targetX;
  let currentY = targetY;

  let rafId = 0;
  let isTouchActive = false;

  // Historial ligero para trail
  const trailElements: HTMLImageElement[] = [];
  const trailPositions = Array.from({ length: TRAIL_COUNT }, () => ({
    x: targetX,
    y: targetY,
  }));

  if (!isTouchLike) {
    document.body.style.cursor = "none";
    saber.style.display = "block";
    saber.style.opacity = "1";
  } else {
    document.body.style.cursor = "";
    saber.style.display = "none";
    saber.style.opacity = "0";
  }

  createTrailElements();

  function createTrailElements() {
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const trail = document.createElement("img");
      trail.src = saber.src;
      trail.alt = "";
      trail.className = "lightsaber-trail";
      trail.setAttribute("aria-hidden", "true");

      const opacity = Math.max(0.2, 0.8 - i * 0.08);
      const scale = 1 - i * 0.035;
      const blur = 1 + i * 0.7;

      trail.style.opacity = "0";
      trail.style.display = isTouchLike ? "none" : "block";
      trail.style.transform = `translate(-50%, -50%) rotate(-12deg) scale(${scale})`;
      trail.style.filter = `
        blur(${blur}px)
        drop-shadow(0 0 4px rgba(0, 255, 255, ${opacity + 0.2}))
        drop-shadow(0 0 10px rgba(0, 255, 255, ${opacity}))
      `;

      document.body.appendChild(trail);
      trailElements.push(trail);
    }
  }

  function setSaberPosition(x: number, y: number) {
    targetX = x;
    targetY = y;
  }

  function updatePortalHover() {
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
  }

  function clearPortalHover() {
    portals.forEach((portal) => {
      portal.classList.remove("portal--active");
    });
  }

  function showTrail() {
    for (const trail of trailElements) {
      trail.style.display = "block";
    }
  }

  function hideTrail() {
    for (const trail of trailElements) {
      trail.style.display = "none";
    }
  }

  function updateTrail() {
    trailPositions[0].x += (currentX - trailPositions[0].x) * 0.42;
    trailPositions[0].y += (currentY - trailPositions[0].y) * 0.42;

    for (let i = 1; i < trailPositions.length; i++) {
      trailPositions[i].x += (trailPositions[i - 1].x - trailPositions[i].x) * 0.34;
      trailPositions[i].y += (trailPositions[i - 1].y - trailPositions[i].y) * 0.34;
    }

    for (let i = 0; i < trailElements.length; i++) {
      const trail = trailElements[i];
      const pos = trailPositions[i];

      trail.style.left = `${pos.x}px`;
      trail.style.top = `${pos.y}px`;

      if (!isTouchLike || isTouchActive) {
        trail.style.opacity = `${Math.max(0.04, 0.22 - i * 0.022)}`;
      } else {
        trail.style.opacity = "0";
      }
    }
  }

  function animate() {
    const follow = isTouchLike ? 0.42 : 0.35;

    currentX += (targetX - currentX) * follow;
    currentY += (targetY - currentY) * follow;

    saber.style.left = `${currentX}px`;
    saber.style.top = `${currentY}px`;

    updateTrail();

    if (!isTouchLike || isTouchActive) {
      updatePortalHover();
    } else {
      clearPortalHover();
    }

    rafId = requestAnimationFrame(animate);
  }

  function handleMouseMove(e: MouseEvent) {
    if (isTouchLike) return;
    setSaberPosition(e.clientX, e.clientY);
  }

  function handlePointerDown(e: PointerEvent) {
    void ensureAudioReady();

    if (!isTouchLike) return;
    if (e.pointerType !== "touch" && e.pointerType !== "pen") return;

    isTouchActive = true;
    currentX = e.clientX;
    currentY = e.clientY;
    setSaberPosition(e.clientX, e.clientY);

    saber.style.display = "block";
    saber.style.opacity = "1";
    showTrail();
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isTouchLike) return;
    if (!isTouchActive) return;
    if (e.pointerType !== "touch" && e.pointerType !== "pen") return;

    setSaberPosition(e.clientX, e.clientY);
  }

  function handlePointerEnd() {
    if (!isTouchLike) return;

    isTouchActive = false;
    saber.style.opacity = "0";
    saber.style.display = "none";
    hideTrail();
    clearPortalHover();
  }

  window.addEventListener("mousemove", handleMouseMove, { passive: true });

  window.addEventListener("pointerdown", handlePointerDown, { passive: true });
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  window.addEventListener("pointerup", handlePointerEnd, { passive: true });
  window.addEventListener("pointercancel", handlePointerEnd, { passive: true });

  if (!isTouchLike) {
    showTrail();
  }

  animate();
}

window.addEventListener("DOMContentLoaded", initLightsaberCursor);