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
            slug: "immersive-portfolio",
            title: "Portfoliodpr",
            category: "Creative Engineering / Interactive Systems",
            status: "In Progress",
            preview: "/projects/immersive-portfolio.webp",
            summary:
                "Portfolio inmersivo construido como una experiencia espacial interactiva, diseñado para transformar un portfolio técnico tradicional en un sistema visual narrativo con identidad propia.",
            problem:
                "La mayoría de portfolios técnicos son visualmente olvidables y no reflejan realmente el nivel de ingeniería, creatividad o criterio del desarrollador.",
            solution:
                "Diseño e implementación de un HUB holográfico inspirado en interfaces sci-fi, utilizando rendering 3D, motion systems, UI cinematográfica y navegación inmersiva entre secciones.",
            impact: [
                "Combina frontend avanzado, motion design y arquitectura visual.",
                "Diferencia el perfil profesional desde el primer impacto.",
                "Demuestra capacidad para construir experiencias interactivas complejas.",
                "Une diseño, UX, sistemas visuales y desarrollo real.",
            ],
            stack: [
                "Astro",
                "React",
                "Three.js",
                "TypeScript",
                "Tailwind CSS",
                "Motion Design",
                "Creative UI",
            ],
            links: {
                live: "/",
                repo: "https://github.com/DiegoPulido33/Portfolio",
            },
        },
        {
            slug: "luxury-motors",
            title: "Luxury Motors",
            category: "Full-Stack Web App / Automotive E-commerce",
            status: "Completed",
            preview: "/projects/luxury-motors.webp",
            summary:
                "Aplicación web full-stack desarrollada como TFG, enfocada en un concesionario premium de vehículos de lujo con inventario dinámico, fichas detalladas y formularios de compra, alquiler y reserva.",
            problem:
                "Un concesionario premium necesita una plataforma digital que transmita exclusividad, permita consultar vehículos en detalle y facilite solicitudes comerciales sin depender de procesos manuales.",
            solution:
                "Diseño e implementación de una aplicación en Next.js con inventario conectado a MongoDB, páginas individuales por vehículo, formularios personalizados, integración de emails mediante Brevo y soporte de modo oscuro.",
            impact: [
                "Centraliza el inventario de vehículos en una base de datos dinámica.",
                "Permite mostrar precios, características y detalles específicos de cada coche.",
                "Automatiza solicitudes de compra, alquiler y reserva mediante formularios conectados a Brevo.",
                "Refuerza la identidad premium con una interfaz oscura, visual y orientada a conversión.",
                "Demuestra capacidad full-stack desde frontend, base de datos e integraciones externas.",
            ],
            stack: [
                "Next.js",
                "React",
                "MongoDB",
                "Brevo",
                "JavaScript",
                "CSS",
                "Dark Mode",
                "Forms",
            ],
            links: {
                live: "https://luxury-motors.puvero.es/",
                repo: "https://github.com/DiegoPulido33/TFG-Luxury",
            },
        },
        {
            slug: "cinesdpr",

            title: "CinesDPR",

            category: "Frontend Web App / Angular",

            status: "Completed",

            preview: "/projects/cinesdpr.webp",

            summary:
                "Aplicación frontend desarrollada en Angular para consultar una cartelera de cine, evolucionada desde un ejercicio académico hasta convertirse en una experiencia web más completa, visual y estructurada.",

            problem:
                "El proyecto inicial planteaba una cartelera básica, pero necesitaba una arquitectura frontend más sólida, soporte multiidioma y una experiencia visual más cuidada para convertirse en una aplicación realmente presentable.",

            solution:
                "Rediseño y desarrollo de una aplicación de cartelera en Angular incorporando estructura modular, navegación mejorada, internacionalización con i18n y una interfaz más moderna orientada a experiencia de usuario.",

            impact: [
                "Transforma un ejercicio académico en una aplicación frontend profesional.",
                "Implementa soporte multiidioma en español e inglés mediante i18n.",
                "Refuerza dominio de Angular, routing y arquitectura de componentes.",
                "Demuestra capacidad de iteración y mejora continua sobre proyectos existentes.",
            ],

            stack: [
                "Angular",
                "TypeScript",
                "HTML",
                "CSS",
                "i18n",
                "Frontend Architecture",
            ],

            links: {
                live: "https://cine.puvero.es/",
                repo: "https://github.com/DiegoPulido33/cine",
            },
        }
    ],
    enterpriseProjects: [
        {
            slug: "ticket-analytics-platform",
            title: "Ticket Analytics Platform",
            category: "Enterprise Internal System / Operations",
            status: "Internal",
            summary:
                "Panel interno para consulta histórica, análisis y seguimiento operativo de tickets, orientado a mejorar la visibilidad de incidencias, estados, agentes y flujos de soporte.",
            problem:
                "Los equipos necesitaban consultar información histórica de tickets de forma más rápida y estructurada, evitando búsquedas manuales y dispersión de datos.",
            solution:
                "Desarrollo de una interfaz interna conectada a datos operativos, con filtros, vistas históricas y consultas SQL optimizadas para análisis y seguimiento.",
            impact: [
                "Mejora la consulta y trazabilidad de tickets.",
                "Reduce dependencia de procesos manuales.",
                "Facilita análisis operativo sobre histórico de soporte.",
                "Demuestra experiencia real con herramientas internas de empresa.",
            ],
            stack: ["SQL", "JavaScript", "Backend", "Dashboards", "Internal Tools"],
            confidential: true,
        },
        {
            slug: "inventory-management-portal",
            title: "Inventory Management Portal",
            category: "Enterprise Internal System / Inventory",
            status: "Internal",
            summary:
                "Portal interno de inventario para gestión, consulta y organización de activos, diseñado para centralizar información operativa y facilitar el trabajo de equipos internos.",
            problem:
                "La gestión de inventario necesitaba una interfaz más clara, centralizada y consultable para evitar pérdida de tiempo y duplicidad de información.",
            solution:
                "Construcción de un portal interno con vistas estructuradas, filtros y componentes reutilizables para consultar y gestionar información de inventario.",
            impact: [
                "Centraliza información interna crítica.",
                "Mejora la velocidad de consulta.",
                "Reduce fricción en procesos operativos.",
                "Refuerza experiencia en software empresarial real.",
            ],
            stack: ["Frontend", "Backend", "SQL", "Internal Systems", "UX"],
            confidential: true,
        },
        {
            slug: "internal-support-chatbot",
            title: "Internal Support Chatbot",
            category: "AI Assistant / Internal Automation",
            status: "Internal",
            summary:
                "Chatbot interno orientado a soporte y consulta de información operativa, pensado para acelerar respuestas, reducir carga manual y mejorar acceso al conocimiento interno.",
            problem:
                "Parte del conocimiento operativo estaba disperso, haciendo que determinadas consultas internas dependieran de búsquedas manuales o de otras personas.",
            solution:
                "Implementación de un asistente conversacional conectado a flujos internos y documentación operativa para responder consultas frecuentes y apoyar procesos.",
            impact: [
                "Acelera el acceso a información interna.",
                "Reduce tareas repetitivas.",
                "Introduce automatización con IA en procesos reales.",
                "Demuestra capacidad para integrar soluciones AI en entorno empresarial.",
            ],
            stack: ["AI", "Chatbot", "Automation", "APIs", "Internal Tools"],
            confidential: true,
        },
    ],

    sectionNote:
        "Cada proyecto debe poder entenderse en menos de un minuto, pero dejar claro que detrás hay criterio, decisiones y capacidad real de entrega.",
};
