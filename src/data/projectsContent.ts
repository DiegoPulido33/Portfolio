export const projectsContent = {
    id: "projects",
    navLabel: "Proyectos",
    zoneName: "Orbital Hangar",
    title: "Proyectos",
    eyebrow: "Trabajo seleccionado",
    intro:
        "Estos proyectos reflejan cómo pienso y construyo: producto, arquitectura, experiencia, despliegue y atención al detalle. No son solo demos visuales; son muestras de criterio técnico y ejecución.",

    featuredProjects: [
        {
            slug: "portfolio",
            title: "Immersive Space Portfolio",
            category: "Personal Brand / Creative Engineering",
            status: "In Progress",
            summary:
                "Portfolio inmersivo construido con Astro y Three.js, diseñado como una experiencia espacial cinematográfica para convertir visitas de recruiters en una lectura memorable del perfil profesional.",
            problem:
                "Crear un portfolio diferencial que no fuera una página estática más, sino una pieza con narrativa, identidad técnica y una experiencia premium.",
            solution:
                "Diseño de un universo interactivo con hub central, transición narrativa entre secciones, lenguaje visual sci-fi premium y foco en recruiter conversion.",
            impact: [
                "Une identidad personal, diseño de producto y ejecución técnica.",
                "Demuestra sensibilidad visual, criterio UX y capacidad de construir experiencias no convencionales.",
                "Sirve como pieza central de posicionamiento profesional.",
            ],
            stack: ["Astro", "Three.js", "TypeScript", "CSS", "Motion Design"],
            links: {
                live: "#",
                repo: "#",
            },
        },
        {
            slug: "ffhs",
            title: "FFHS Free File Host System",
            category: "Backend / Product / Deployment",
            status: "Completed",
            summary:
                "Sistema de file hosting desplegable en minutos, diseñado para funcionar con Coolify o cualquier infraestructura de servidor.",
            problem:
                "Simplificar la puesta en marcha de una solución de almacenamiento y compartición de archivos ligera, autohospedada y fácil de desplegar.",
            solution:
                "Construcción de una solución open source, enfocada en simplicidad, despliegue rápido y compatibilidad con entornos reales de infraestructura.",
            impact: [
                "Demuestra capacidad para diseñar producto más allá del frontend.",
                "Refuerza perfil orientado a software útil y despliegue real.",
                "Conecta desarrollo, infraestructura y experiencia de uso.",
            ],
            stack: ["Backend", "Docker", "Coolify", "Server Infrastructure"],
            links: {
                live: "#",
                repo: "#",
            },
        },
        {
            slug: "short-url",
            title: "Short URL Platform",
            category: "Full Stack",
            status: "Completed",
            summary:
                "Servicio de acortamiento de URLs compuesto por backend en Spring Boot y frontend independiente orientado a una experiencia clara y rápida.",
            problem:
                "Construir un producto web completo, sencillo en apariencia pero bien resuelto a nivel funcional y estructural.",
            solution:
                "Separación clara entre backend y frontend, arquitectura modular y despliegue sobre contenedores.",
            impact: [
                "Muestra dominio de arquitectura full-stack.",
                "Permite enseñar backend, frontend y despliegue en un mismo caso.",
                "Es un proyecto fácil de entender para recruiters y técnicos.",
            ],
            stack: ["Spring Boot", "Java", "Angular", "Tailwind CSS", "Docker"],
            links: {
                live: "#",
                repo: "#",
            },
        },
    ],

    sectionNote:
        "Cada proyecto debe poder entenderse en menos de un minuto, pero dejar claro que detrás hay criterio, decisiones y capacidad real de entrega.",
};