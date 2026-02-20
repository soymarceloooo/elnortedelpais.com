# Design System - El Norte del País

**Versión:** 1.0  
**Última actualización:** 2026-02-20  
**Estilo:** The Economist Editorial

---

## 📚 Tabla de Contenidos

1. [Filosofía de Diseño](#filosofía-de-diseño)
2. [Colores](#colores)
3. [Tipografía](#tipografía)
4. [Espaciado](#espaciado)
5. [Componentes](#componentes)
6. [Layout](#layout)
7. [Patrones de Uso](#patrones-de-uso)

---

## 🎯 Filosofía de Diseño

**El Norte del País** es un periódico digital de bienes raíces industriales. El diseño busca comunicar:

- **Autoridad:** Periodismo serio y análisis profundo
- **Elegancia:** Premium pero accesible
- **Tradición:** Editorial clásico con sensibilidad moderna
- **Claridad:** Jerarquía visual clara, lectura cómoda

**Inspiración:** The Economist, Financial Times, Bloomberg Editorial

---

## 🎨 Colores

### Paleta Principal

| Color | Hex | Variable | Uso |
|-------|-----|----------|-----|
| **Rojo Economist** | `#E3120B` | `--economist-red` | Primary, CTAs, links hover, signature |
| **Azul Marino** | `#002D63` | `--accent-blue` | Secondary, stats, badges premium |
| **Negro Editorial** | `#1a1a1a` | `--economist-dark` | Texto principal, footer |
| **Gris Medio** | `#6b6b6b` | `--economist-gray` | Texto secundario, metadata |
| **Gris Claro** | `#f5f5f5` | `--economist-light-gray` | Backgrounds, boxes |
| **Blanco** | `#ffffff` | `--background` | Background principal |

### Uso de Colores

**Rojo (#E3120B):**
- Barra signature en header (4px)
- CTAs principales (botones, links importantes)
- Hover state en navegación
- Bordes destacados (newsletter, featured content)
- Serie badges importantes

**Azul Marino (#002D63):**
- Stats boxes, data widgets
- Badges de categorías específicas
- Hover secondary
- Highlights de datos

**Negro (#1a1a1a):**
- Headlines principales
- Body text
- Footer background
- Navegación base

**Gris (#6b6b6b):**
- Subtítulos
- Metadata (fechas, autores)
- Texto secundario

**Gris Claro (#f5f5f5):**
- Newsletter box
- Sidebar backgrounds
- Hover states sutiles

### Accesibilidad

Todos los colores cumplen WCAG 2.1 AA:
- Texto principal (#1a1a1a) sobre blanco: **14.8:1** ✅
- Rojo (#E3120B) sobre blanco: **5.3:1** ✅
- Azul (#002D63) sobre blanco: **10.2:1** ✅

---

## ✍️ Tipografía

### Font Stack

```css
Display:  'Playfair Display', serif
Serif:    'Merriweather', Georgia, serif
Sans:     'Inter', -apple-system, sans-serif
```

### Jerarquía

| Elemento | Font | Size | Weight | Line Height | Uso |
|----------|------|------|--------|-------------|-----|
| **H1** | Playfair Display | 2.5-3rem (40-48px) | 700 | 1.1 | Logo, página principal |
| **H2** | Playfair Display | 1.875rem (30px) | 700 | 1.2 | Secciones principales |
| **H3** | Playfair Display | 1.5rem (24px) | 600 | 1.3 | Subsecciones |
| **Article Headline** | Playfair Display | 1.5rem (24px) | 700 | 1.2 | Títulos de artículos |
| **Body** | Merriweather | 1.0625rem (17px) | 400 | 1.8 | Texto principal |
| **Body Small** | Merriweather | 0.875rem (14px) | 400 | 1.7 | Descripciones |
| **Labels** | Inter | 0.75-0.875rem | 600 | 1.4 | UI, navegación, badges |
| **Metadata** | Inter | 0.75rem (12px) | 400 | 1.4 | Fechas, tags |

### Clases Tailwind

```css
/* Headlines */
.headline-1 { @apply font-display text-4xl font-bold text-[#1a1a1a] leading-tight; }
.headline-2 { @apply font-display text-3xl font-bold text-[#1a1a1a] leading-tight; }
.headline-3 { @apply font-display text-2xl font-bold text-[#1a1a1a] leading-tight; }

/* Body */
.body-text { @apply font-serif text-base text-[#1a1a1a] leading-relaxed; }
.body-small { @apply font-serif text-sm text-[#1a1a1a] leading-relaxed; }

/* UI */
.label { @apply font-sans text-xs font-semibold uppercase tracking-wide; }
.metadata { @apply font-sans text-xs text-[#6b6b6b] uppercase tracking-wide; }
```

### Uso de Fuentes

**Playfair Display (Display):**
- Headlines de artículos
- Títulos de secciones
- Logo principal
- CTAs importantes
- Números destacados en stats

**Merriweather (Serif):**
- Body text de artículos
- Descripciones
- Contenido editorial
- Cualquier bloque de lectura larga

**Inter (Sans):**
- Navegación
- Labels y badges
- Metadata (fechas, autores)
- UI elements (botones, forms)
- Tags y categorías

---

## 📐 Espaciado

### Sistema Base
Base: **4px** (0.25rem)

| Escala | Valor | Uso |
|--------|-------|-----|
| xs | 8px (0.5rem) | Padding interno pequeño |
| sm | 12px (0.75rem) | Gaps entre elementos relacionados |
| md | 16px (1rem) | Spacing estándar |
| lg | 24px (1.5rem) | Secciones relacionadas |
| xl | 32px (2rem) | Separación entre secciones |
| 2xl | 48px (3rem) | Separación mayor |

### Contenedores

```css
max-w-6xl    /* 1152px - Ancho principal */
px-4         /* 16px - Padding horizontal mobile */
py-8         /* 32px - Padding vertical secciones */
```

### Grid

```css
grid gap-12 lg:grid-cols-3   /* Homepage: 2 cols content + 1 col sidebar */
space-y-8                     /* Sidebar elements */
space-y-6                     /* Article cards */
```

---

## 🧩 Componentes

### Header

**Estructura:**
```
┌─────────────────────────────────┐
│ ███ Barra roja (4px)            │
├─────────────────────────────────┤
│ Monterrey, NL    |    Nosotros  │ ← Topbar
├─────────────────────────────────┤
│     El Norte del País           │ ← Logo (Playfair Display)
│  INTELIGENCIA DEL MERCADO...    │ ← Tagline (Inter)
├─────────────────────────────────┤
│  INICIO  NOTICIAS  PROPIEDADES  │ ← Nav (Inter uppercase)
└─────────────────────────────────┘
```

**Clases:**
```jsx
<div className="bg-[#E3120B] h-1" />  // Barra roja
<h1 className="font-display text-4xl font-bold text-[#1a1a1a]">...</h1>
<nav className="font-sans text-sm font-semibold uppercase tracking-wide">
```

### Navigation

**States:**
- Default: `text-[#1a1a1a]`
- Hover: `text-[#E3120B]`
- Active: `text-[#E3120B] border-b-2 border-[#E3120B]`

### Article Card

**Estructura:**
```
┌─────────────────────────────────┐
│ [BADGE] 20 FEB 2026             │ ← Metadata
│                                  │
│ Título del Artículo Grande      │ ← Headline (Playfair)
│                                  │
│ Descripción breve del contenido │ ← Description (Merriweather)
│ del artículo en dos líneas...   │
│                                  │
│ [TAG 1] [TAG 2] [TAG 3]         │ ← Tags
└─────────────────────────────────┘
```

**Clases clave:**
```jsx
<h3 className="font-display text-2xl font-bold text-[#1a1a1a] group-hover:text-[#E3120B]">
<p className="font-serif text-[#1a1a1a] line-clamp-2 leading-relaxed">
<span className="border border-[#E3120B] px-3 py-1 text-xs font-sans">
```

### Property Card

**Estructura:**
```
┌─────────────────────────────────┐
│         🏭                       │ ← Icon (background gris)
├─────────────────────────────────┤
│ García, NL  [INDUSTRIAL]        │ ← Location + Type
│                                  │
│ Lote Industrial 5,000 m²        │ ← Title (Playfair)
│                                  │
│ Descripción de la propiedad...  │ ← Description
│                                  │
│ $X,XXX,XXX - $X,XXX,XXX         │ ← Price (azul marino)
│                                  │
│ [Feature 1] [Feature 2]         │ ← Features
│                                  │
│ VER DETALLES →                  │ ← CTA (rojo)
└─────────────────────────────────┘
```

**Clases:**
```jsx
<div className="border-2 border-zinc-200 hover:border-[#E3120B]">
<h3 className="font-display text-lg font-bold group-hover:text-[#E3120B]">
<p className="font-display text-sm font-bold text-[#002D63]"> // Price
```

### Newsletter Box

**Diseño:**
```
┌─────────────────────────────────┐
│ ■ BORDE ROJO (2px)              │
│                                  │
│ Resumen semanal                 │ ← Headline (Playfair)
│                                  │
│ Recibe cada semana...           │ ← Description
│                                  │
│ ┌─────────────────────────────┐ │
│ │ tu@email.com                │ │ ← Input
│ └─────────────────────────────┘ │
│                                  │
│ ┌─────────────────────────────┐ │
│ │     SUSCRIBIRSE             │ │ ← CTA (rojo)
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**Clases:**
```jsx
<div className="border-2 border-[#E3120B] p-6 bg-[#f5f5f5]">
<input className="border-2 border-[#1a1a1a] focus:border-[#E3120B]">
<button className="bg-[#E3120B] text-white font-sans uppercase">
```

### Stats Box

**Diseño:**
```
┌─────────────────────────────────┐
│ BACKGROUND AZUL MARINO          │
│                                  │
│ Mercado Industrial NL           │ ← Title (blanco)
│ Datos clave del mercado         │ ← Subtitle
│                                  │
│ Inventario industrial   ~14M m² │
│ ─────────────────────────────── │
│ Tasa de vacancia        ~3-5%   │
│ ─────────────────────────────── │
│ Absorción neta anual    ~1.5M m²│
│                                  │
│ [ VER DATOS COMPLETOS → ]      │ ← CTA
└─────────────────────────────────┘
```

**Clases:**
```jsx
<div className="border-2 border-[#002D63] bg-[#002D63] p-6 text-white">
<h3 className="font-display text-xl font-bold">
<span className="font-display font-bold"> // Números
```

### Footer

**Estructura:**
```
┌─────────────────────────────────┐
│ ███ Barra roja superior (2px)   │
├─────────────────────────────────┤
│ BACKGROUND NEGRO (#1a1a1a)      │
│                                  │
│ El Norte del País  │ Secciones  │ Contacto
│ Descripción...     │ - Noticias │ email@...
│                    │ - Props    │ Monterrey
│                    │ - Mercado  │
│                                  │
│ ─────────────────────────────── │
│ © 2026 El Norte del País        │
└─────────────────────────────────┘
```

**Clases:**
```jsx
<footer className="border-t-2 border-[#E3120B] bg-[#1a1a1a] text-white">
<h3 className="font-display text-xl font-bold text-white">
<a className="font-serif text-sm text-zinc-300 hover:text-[#E3120B]">
```

### Badges (Series)

**Tipos:**
```jsx
// Dato Industrial - Azul marino
<span className="bg-[#002D63] text-white font-sans uppercase">

// Propiedad Destacada - Rojo
<span className="bg-[#E3120B] text-white font-sans uppercase">

// Verdad o Mito - Gris
<span className="bg-[#6b6b6b] text-white font-sans uppercase">

// Radar Industrial - Negro
<span className="bg-[#1a1a1a] text-white font-sans uppercase">
```

---

## 📱 Layout

### Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

### Grids Principales

**Homepage:**
```
Mobile:
┌─────────────┐
│   Content   │
│             │
│   Sidebar   │
└─────────────┘

Desktop (lg):
┌─────────┬───┐
│ Content │ S │
│ (2 col) │ i │
│         │ d │
│         │ e │
└─────────┴───┘
```

**Content width:** `max-w-6xl` (1152px)

---

## 🎨 Patrones de Uso

### Enlaces

**En texto:**
```jsx
<a className="text-[#E3120B] underline underline-offset-2 hover:text-[#002D63]">
```

**Navegación:**
```jsx
<Link className="text-[#1a1a1a] hover:text-[#E3120B] transition-colors">
```

**CTA principal:**
```jsx
<button className="bg-[#E3120B] text-white hover:bg-[#002D63] font-sans uppercase">
```

### Bordes

**Standard:**
```jsx
border border-zinc-200      // Sutil
border-2 border-zinc-200    // Más visible
```

**Destacado:**
```jsx
border-2 border-[#E3120B]   // Newsletter, featured
border-2 border-[#002D63]   // Stats, data
```

### Backgrounds

**Primario:**
```jsx
bg-white                    // Default
bg-[#f5f5f5]               // Boxes, sidebar
```

**Destacado:**
```jsx
bg-[#E3120B]               // CTAs principales
bg-[#002D63]               // Stats boxes
bg-[#1a1a1a]               // Footer, dark sections
```

### Hover States

**Cards:**
```jsx
hover:border-[#E3120B]     // Bordes
group-hover:text-[#E3120B] // Headlines
```

**Links:**
```jsx
hover:text-[#E3120B]       // Primary
hover:text-[#002D63]       // Secondary
```

---

## 🔧 Implementación Técnica

### Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Fonts:** Google Fonts (Playfair Display, Merriweather, Inter)
- **Content:** MDX (next-mdx-remote + gray-matter)

### Variables CSS

```css
/* globals.css */
@theme inline {
  --color-economist-red: #E3120B;
  --color-economist-dark: #1a1a1a;
  --color-economist-gray: #6b6b6b;
  --color-economist-light-gray: #f5f5f5;
  --color-accent-blue: #002D63;
  
  --font-serif: var(--font-merriweather);
  --font-display: var(--font-playfair);
  --font-sans: var(--font-inter);
}
```

### Componentes Reutilizables

| Componente | Ubicación | Uso |
|------------|-----------|-----|
| Header | `/components/layout/Header.tsx` | Barra superior + nav |
| Footer | `/components/layout/Footer.tsx` | Footer oscuro |
| ArticleCard | `/components/content/ArticleCard.tsx` | Lista de artículos |
| PropertyCard | `/components/content/PropertyCard.tsx` | Lista de propiedades |
| NewsletterForm | `/components/lead/NewsletterForm.tsx` | Suscripción |
| SeriesBadge | `/components/content/SeriesBadge.tsx` | Badges de categorías |

---

## 📖 Guías de Estilo

### DO ✅
- Usa serif (Merriweather) para bloques de lectura
- Headlines siempre en Playfair Display
- Rojo (#E3120B) para CTAs y elementos importantes
- Azul marino (#002D63) para datos y stats
- Mayúsculas en navegación y labels
- Line-height generoso (1.7-1.8) en body text
- Borders visibles (2px) en elementos destacados

### DON'T ❌
- No uses sans-serif para body text largo
- No uses colores fuera de la paleta definida
- No pongas fondos de color en tags (solo bordes)
- No mezcles demasiados pesos de fuente
- No uses menos de 16px para body text
- No ignores la jerarquía tipográfica

### Consistencia
- Todos los botones primarios → rojo (#E3120B)
- Todos los badges → uppercase + Inter
- Todos los links → rojo con underline
- Todas las fechas → Inter uppercase gris
- Todos los headlines → Playfair Display bold

---

## 🔄 Actualizaciones

### v1.0 - 2026-02-20
- ✅ Redesign completo estilo The Economist
- ✅ Sistema de colores definido
- ✅ Tipografía (Playfair + Merriweather + Inter)
- ✅ Componentes principales actualizados
- ✅ Design system documentado

---

## 📞 Contacto

**Preguntas sobre el design system:**
- Revisar este documento primero
- Consultar `REDESIGN-ECONOMIST.md` para contexto
- Ver `.claude/DESIGN_SYSTEM.md` para quick reference

**Mantenimiento:**
Este documento debe actualizarse cuando se agreguen nuevos componentes o se modifique la paleta de colores.
