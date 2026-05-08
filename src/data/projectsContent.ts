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
            preview: "/projects/luxury-motors.jpg",
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
                live: "https://luxurymotors.vercel.app/",
                repo: "https://github.com/DiegoPulido33/TFG-Luxury",
            },
        },
        {
            slug: "cinesdpr",

            title: "CinesDPR",

            category: "Frontend Web App / Angular",

            status: "Completed",

            preview: "/projects/cinesdpr.jpg",

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
                live: "https://cinesdpr.vercel.app/",
                repo: "https://github.com/DiegoPulido33/cine",
            },
        }
    ],

    sectionNote:
        "Cada proyecto debe poder entenderse en menos de un minuto, pero dejar claro que detrás hay criterio, decisiones y capacidad real de entrega.",
};