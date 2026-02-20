# El Norte del País

**Periódico digital de bienes raíces industriales en Nuevo León**

Noticias, análisis e inteligencia del mercado industrial del norte de México.

---

## 🚀 Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Content:** MDX (next-mdx-remote + gray-matter)
- **Fonts:** Google Fonts (Playfair Display, Merriweather, Inter)

---

## 🎨 Design System

**Estilo:** The Economist Editorial

Ver documentación completa: **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)**

**Quick reference:**
- **Colores:** Rojo #E3120B (primary), Azul #002D63 (secondary)
- **Tipografía:** Playfair Display (headlines), Merriweather (body), Inter (UI)
- **Filosofía:** Editorial elegante, tradicional pero moderno

---

## 🛠️ Desarrollo

### Instalar dependencias
```bash
npm install
```

### Correr en desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### Build para producción
```bash
npm run build
npm start
```

---

## 📁 Estructura

```
elnortedelpais.com/
├── src/
│   ├── app/              # App Router pages
│   │   ├── layout.tsx    # Layout principal
│   │   ├── page.tsx      # Homepage
│   │   └── globals.css   # Estilos globales + theme
│   ├── components/
│   │   ├── layout/       # Header, Footer, Navigation
│   │   ├── content/      # ArticleCard, PropertyCard, SeriesBadge
│   │   └── lead/         # NewsletterForm
│   └── lib/
│       ├── content.ts    # MDX content loader
│       ├── types.ts      # TypeScript types
│       └── utils.ts      # Utilidades
├── content/
│   ├── noticias/         # Artículos MDX
│   ├── propiedades/      # Propiedades MDX
│   └── templates/        # Templates de contenido
├── public/               # Assets estáticos
├── DESIGN_SYSTEM.md      # 📐 Design system completo
├── REDESIGN-ECONOMIST.md # Documentación del redesign
└── .claude/              # Claude Code context
```

---

## 📝 Contenido

### Crear nuevo artículo

1. Crear archivo en `content/noticias/`
2. Usar template de frontmatter:

```mdx
---
title: "Título del artículo"
slug: "titulo-del-articulo"
description: "Descripción breve"
date: "2026-02-20"
author: "Nombre Autor"
series: "dato-industrial"
tags: ["nearshoring", "García"]
cta: "newsletter"
---

Tu contenido aquí en **Markdown**.
```

### Series disponibles
- `dato-industrial` - Datos y estadísticas
- `propiedad-destacada` - Análisis de propiedades
- `verdad-o-mito` - Desmintiendo mitos
- `radar-industrial` - Noticias del sector
- `guia-inversionista` - Contenido educativo

---

## 🎯 Features

- ✅ Homepage con artículos y propiedades destacadas
- ✅ Design system The Economist
- ✅ MDX para contenido
- ✅ Newsletter form
- ✅ Responsive design
- ✅ TypeScript
- ✅ SEO optimizado (metadata)

### Por implementar
- [ ] Páginas internas (noticias, propiedades, mercado)
- [ ] Sistema de búsqueda
- [ ] Filtros por categoría/tags
- [ ] API de newsletter (backend)
- [ ] Analytics
- [ ] Sitemap XML
- [ ] RSS feed

---

## 🚢 Deploy

### Vercel (recomendado)
```bash
vercel
```

O conectar el repo en [vercel.com](https://vercel.com)

### Variables de entorno
```env
# .env.local
NEXT_PUBLIC_SITE_URL=https://elnortedelpais.com
```

---

## 📚 Documentación

- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Sistema de diseño completo
- **[REDESIGN-ECONOMIST.md](./REDESIGN-ECONOMIST.md)** - Documentación del redesign
- **[.claude/DESIGN_SYSTEM.md](./.claude/DESIGN_SYSTEM.md)** - Quick reference

---

## 📄 Licencia

© 2026 El Norte del País. Todos los derechos reservados.

---

## 🤝 Contribuir

Para mantener consistencia visual, revisar **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** antes de hacer cambios de diseño.

### Guidelines
1. Seguir la paleta de colores definida
2. Usar las fuentes correctas (Playfair/Merriweather/Inter)
3. Mantener jerarquía tipográfica
4. Respetar espaciado del sistema
5. Documentar nuevos componentes

---

**Desarrollado con ❤️ en Monterrey, Nuevo León**
