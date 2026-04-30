"use client";

import React, { useState } from "react";

type HudCard3DProps = {
  href: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

export default function HudCard3D({
  href,
  title,
  description,
  image,
  alt,
}: HudCard3DProps) {
  const [cardTransform, setCardTransform] = useState(
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
  );

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = (x / rect.width - 0.5) * 24;
    const rotateX = (y / rect.height - 0.5) * -24;

    setCardTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.045,1.045,1.045)`,
    );
  }

  function handleMouseLeave() {
    setCardTransform(
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
    );
  }

  return (
    <a
      href={href}
      aria-label={title}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="hub-card-3d relative z-50 block h-[360px] w-[225px] cursor-none"
      style={{ perspective: "1000px" }}
    >
      <div
        className="
          group/card relative h-full w-full cursor-none
          overflow-hidden
          border border-[rgba(var(--kyber-rgb),0.25)]
          bg-[#020817]/92
          px-7 py-8
          shadow-[inset_0_0_34px_rgba(var(--kyber-rgb),0.08),0_0_24px_rgba(var(--kyber-rgb),0.10)]

          transition-all duration-300 ease-out
          hover:border-[rgba(var(--kyber-rgb),0.95)]
          hover:shadow-[inset_0_0_52px_rgba(var(--kyber-rgb),0.22),0_0_42px_rgba(var(--kyber-rgb),0.38),0_0_90px_rgba(var(--kyber-rgb),0.20)]
          [clip-path:polygon(16px_0,calc(100%-16px)_0,100%_16px,100%_calc(100%-16px),calc(100%-16px)_100%,16px_100%,0_calc(100%-16px),0_16px)]
        "
        style={{
          transform: cardTransform,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="
            pointer-events-none absolute inset-[5px]
            border border-[rgba(var(--kyber-rgb),0.10)]
            opacity-70
            transition-all duration-300
            group-hover/card:border-[rgba(var(--kyber-rgb),0.65)]
            group-hover/card:opacity-100
            [clip-path:inherit]
          "
          style={{ transform: "translateZ(95px)" }}
        />

        <div
          className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.035)_0,rgba(255,255,255,0.035)_1px,transparent_1px,transparent_8px)] opacity-40"
          style={{ transform: "translateZ(12px)" }}
        />

        <div
          className="pointer-events-none absolute left-1/2 top-[34%] h-[160px] w-[160px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(var(--kyber-rgb),0.06)]
          blur-xlg transition-all duration-300 group-hover/card:bg-[rgba(var(--kyber-rgb),0.10)]"
          style={{
            transform: "translateX(-50%) translateY(-50%) translateZ(10px)",
          }}
        />

        <div
          className="
            relative z-10 mx-auto mb-9 flex h-[138px] w-[138px]
            items-center justify-center rounded-full
            transition-transform duration-300
            group-hover/card:scale-110
          "
          style={{
            transform: "translateZ(160px)",
            transformStyle: "preserve-3d",
            // willChange: "transform",
          }}
        >
          <img
            src={image}
            alt={alt}
            className="
    h-full w-full object-contain
    select-none pointer-events-none
    will-change-transform
    transform-gpu
    backface-visibility-hidden
    drop-shadow-[0_0_6px_rgba(var(--kyber-rgb),0.35)]
    transition-all duration-300
    group-hover/card:drop-shadow-[0_0_12px_rgba(var(--kyber-rgb),0.6)]
  "
            style={{
              imageRendering: "auto",
            }}
            draggable={false}
          />
        </div>

        <h3
          className="
            relative z-10 mb-7 text-center
            text-[20px] font-black tracking-[0.06em]
            text-white
            drop-shadow-[0_0_12px_rgba(var(--kyber-rgb),0.75)]
          "
          style={{ transform: "translateZ(78px)" }}
        >
          {title}
        </h3>

        <p
          className="
            relative z-10 text-center
            text-[11px] font-bold leading-relaxed tracking-[0.04em]
            text-[rgba(var(--kyber-rgb),0.90)]
          "
          style={{ transform: "translateZ(58px)" }}
        >
          {description.split("\n").map((line) => (
            <React.Fragment key={line}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>

        <span
          className="
            absolute bottom-8 left-1/2 z-20 block
            h-[4px] w-[64px] rounded-full
            bg-[rgb(var(--kyber-rgb))]
            shadow-[0_0_14px_rgba(var(--kyber-rgb),1),0_0_32px_rgba(var(--kyber-rgb),0.65)]
            transition-all duration-300
            group-hover/card:w-[90px]
          "
          style={{ transform: "translate3d(-50%, 0, 85px)" }}
        />
      </div>
    </a>
  );
}
