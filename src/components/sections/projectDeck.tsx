"use client";

import React, { useState } from "react";

type Project = {
  slug: string;
  title: string;
  category: string;
  preview?: string;
  status: string;
  summary: string;
  problem: string;
  solution: string;
  impact: string[];
  stack: string[];
  confidential?: boolean;
  links?: {
    live?: string;
    repo?: string;
  };
};

type ProjectDeckProps = {
  projects: Project[];
  label?: string;
};

export default function ProjectDeck({ projects, label }: ProjectDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [drag, setDrag] = useState({ x: 0, y: 0, isDragging: false });

  const activeProject = projects[activeIndex];

  function goNext() {
    setDrag({ x: 0, y: 0, isDragging: false });
    setActiveIndex((current) => (current + 1) % projects.length);
  }

  function goPrev() {
    setDrag({ x: 0, y: 0, isDragging: false });
    setActiveIndex((current) =>
      current === 0 ? projects.length - 1 : current - 1,
    );
  }

  function handlePointerDown(event: React.PointerEvent<HTMLElement>) {
    const target = event.target as HTMLElement;
    const isInteractive = target.closest("a") || target.closest("button");

    if (isInteractive) return;

    event.currentTarget.setPointerCapture(event.pointerId);

    setDrag((current) => ({
      ...current,
      isDragging: true,
    }));
  }

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    if (!drag.isDragging) return;

    setDrag((current) => ({
      ...current,
      x: current.x + event.movementX,
      y: current.y + event.movementY,
    }));
  }

  function handlePointerUp() {
    if (!drag.isDragging) return;

    const shouldChange = Math.abs(drag.x) > 120;

    if (shouldChange) {
      if (drag.x > 0) {
        goPrev();
      } else {
        goNext();
      }
      return;
    }

    setDrag({ x: 0, y: 0, isDragging: false });
  }

  return (
    <div className="project-deck">
      <div className="project-deck__left">
        <div className="project-deck__status">
          <span>{label ?? "ACTIVE FILE"}</span>{" "}
          <strong>
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(projects.length).padStart(2, "0")}
          </strong>
        </div>

        <h2>{activeProject.title}</h2>
        <p>{activeProject.summary}</p>

        <div className="project-deck__actions">
          <button type="button" onClick={goPrev}>
            PREV
          </button>
          <button type="button" onClick={goNext}>
            NEXT
          </button>
        </div>
      </div>

      <div className="project-deck__stage">
        {projects.map((project, index) => {
          const relativeIndex =
            (index - activeIndex + projects.length) % projects.length;

          const isActive = relativeIndex === 0;
          const isBehind = relativeIndex > 0 && relativeIndex < 4;

          if (!isActive && !isBehind) return null;

          const depth = relativeIndex;
          const rotate = isActive ? drag.x * 0.035 : 4 + depth * 3.5;
          const translateX = isActive ? drag.x : 52 + depth * 42;
          const translateY = isActive ? drag.y : depth * 10;
          const scale = isActive ? 1 : 1 - depth * 0.06;
          const opacity = isActive ? 1 : 1 - depth * 0.14;

          return (
            <article
              key={project.slug}
              className={`project-card ${
                isActive ? "project-card--active" : ""
              }`}
              style={{
                zIndex: 20 - depth,
                opacity,
                transform: `translate3d(${translateX}px, ${translateY}px, ${
                  -depth * 70
                }px) rotateY(${-depth * 8}deg) rotate(${rotate}deg) scale(${scale})`,
              }}
              onPointerDown={isActive ? handlePointerDown : undefined}
              onPointerMove={isActive ? handlePointerMove : undefined}
              onPointerUp={isActive ? handlePointerUp : undefined}
              onPointerCancel={isActive ? handlePointerUp : undefined}
            >
              <div className="project-card__preview">
                {project.preview ? (
                  <a
                    className="project-card__preview-link"
                    href={project.links?.live}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Abrir web de ${project.title}`}
                    onPointerDown={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <img
                      src={project.preview}
                      alt={`Preview de ${project.title}`}
                      className="project-card__image"
                      draggable={false}
                    />

                    <div
                      className="project-card__hover-open"
                      aria-hidden="true"
                    >
                      <span>↗</span>
                    </div>
                  </a>
                ) : (
                  <div className="project-card__orb" />
                )}

                <div className="project-card__grid" />
                <div className="project-card__preview-glow" />
                <span className="project-card__status">{project.status}</span>
              </div>

              <div className="project-card__body">
                <p className="project-card__category">{project.category}</p>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>

                <div className="project-card__stack">
                  {project.stack.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>

                <div className="project-card__links">
                  {project.links?.live && (
                    <a href={project.links.live} target="_blank" rel="noreferrer">
                      VIEW LIVE
                    </a>
                  )}
                  {project.links?.repo && (
                    <a href={project.links.repo} target="_blank" rel="noreferrer">
                      GITHUB
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
