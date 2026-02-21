# Logos - El Norte del País

Este directorio contiene todos los formatos de logo para diferentes usos.

---

## 📦 Archivos Disponibles

### SVG (Vectorial - Escalable)
- **`logo.svg`** (400x400) - Logo cuadrado completo
- **`logo-horizontal.svg`** (800x200) - Logo horizontal para headers
- **`logo-icon.svg`** (512x512) - Ícono "NP" sobre fondo rojo

### PNG (Rasterizado)

#### Logos Principales
- **`logo-400x400.png`** - Logo cuadrado para redes sociales (perfil)
- **`logo-horizontal.png`** - Logo horizontal para headers/banners
- **`og-image.png`** (1200x630) - Open Graph para Facebook/Twitter/LinkedIn

#### Íconos/Favicon
- **`icon-512x512.png`** - Ícono grande (PWA, Android)
- **`favicon-16x16.png`** - Favicon pequeño
- **`favicon-32x32.png`** - Favicon estándar
- **`apple-touch-icon.png`** (180x180) - Ícono para iOS/Safari

---

## 🎨 Diseño

**Estilo:** The Economist Editorial

**Colores:**
- Rojo signature: `#E3120B`
- Negro: `#1a1a1a`
- Gris: `#6b6b6b`
- Blanco: `#FFFFFF`

**Tipografía:**
- Headlines: Playfair Display (serif)
- Tagline: Inter (sans-serif)

---

## 📱 Uso por Plataforma

### Facebook
**Foto de perfil:** `logo-400x400.png`
- Tamaño: 400x400 (se verá como círculo)
- Formato: PNG
- Asegúrate que el contenido importante esté en el centro

**Foto de portada:** `logo-horizontal.png` (editar dimensiones a 820x312)
- Tamaño recomendado: 820x312
- Formato: PNG o JPG

**Posts con link (Open Graph):** `og-image.png`
- Tamaño: 1200x630
- Se muestra automáticamente al compartir enlaces
- Configurado en metadata del sitio

### Instagram
**Foto de perfil:** `logo-400x400.png`
- Se verá como círculo
- Asegúrate que "NP" sea visible en el centro

**Posts:** `logo-400x400.png` o `logo-horizontal.png` (recortar a 1:1 o 4:5)

### Twitter/X
**Foto de perfil:** `logo-400x400.png`
- Tamaño: 400x400 (mínimo 200x200)
- Se verá como círculo

**Header:** `logo-horizontal.png` (redimensionar a 1500x500)
- Tamaño recomendado: 1500x500
- Ten en cuenta que en mobile se recorta

**Twitter Card:** `og-image.png`
- 1200x630 configurado automáticamente

### LinkedIn
**Logo de empresa:** `logo-400x400.png`
- Tamaño: 300x300 (recomendado 400x400)

**Banner:** `logo-horizontal.png` (editar a 1128x191)

**Posts con link:** `og-image.png`

### Sitio Web
**Header:** `logo-horizontal.svg` (SVG escalable)
- Usa SVG para mejor calidad en pantallas retina

**Favicon:** Configurado automáticamente en `layout.tsx`
- 16x16, 32x32: navegadores
- 180x180: Apple touch icon

**Open Graph:** `og-image.png`
- Se muestra al compartir en redes sociales

### Email/Newsletter
**Header de email:** `logo-horizontal.png`
- 600-800px de ancho máximo
- PNG para compatibilidad

### Documentos/Print
**Logo vectorial:** `logo.svg` o `logo-horizontal.svg`
- Usa SVG para mejor calidad en impresión
- Se puede convertir a PDF si es necesario

---

## 🔧 Editar Logos

Los archivos SVG son editables. Puedes abrirlos en:
- **Figma** (importar SVG)
- **Adobe Illustrator**
- **Inkscape** (gratis)
- **Editor de texto** (para cambios simples)

### Cambiar colores
Abre el SVG en un editor de texto y busca:
- `#E3120B` - Rojo signature
- `#1a1a1a` - Negro
- `#6b6b6b` - Gris

### Exportar nuevos tamaños
Usa el archivo `logo-export.html` en la raíz del proyecto:
```bash
npx playwright screenshot "file://$(pwd)/logo-export.html?type=square" output.png --viewport-size=WIDTHxHEIGHT
```

---

## 📐 Dimensiones Recomendadas por Plataforma

| Plataforma | Tipo | Tamaño | Archivo |
|------------|------|--------|---------|
| Facebook | Perfil | 400x400 | logo-400x400.png |
| Facebook | Portada | 820x312 | Editar logo-horizontal.png |
| Instagram | Perfil | 400x400 | logo-400x400.png |
| Twitter | Perfil | 400x400 | logo-400x400.png |
| Twitter | Header | 1500x500 | Editar logo-horizontal.png |
| LinkedIn | Logo | 400x400 | logo-400x400.png |
| LinkedIn | Banner | 1128x191 | Editar logo-horizontal.png |
| Web | Header | Escalable | logo-horizontal.svg |
| Web | Favicon | 32x32 | favicon-32x32.png |
| Open Graph | Preview | 1200x630 | og-image.png |

---

## ✅ Checklist de Deploy

- [x] SVG creados (vectoriales)
- [x] PNG generados (todos los tamaños)
- [x] Favicon configurado en `layout.tsx`
- [x] Open Graph configurado
- [x] Twitter Card configurado
- [ ] Subir logo-400x400.png a Facebook (perfil)
- [ ] Subir logo-400x400.png a Instagram (perfil)
- [ ] Subir logo-400x400.png a Twitter (perfil)
- [ ] Subir logo-400x400.png a LinkedIn (perfil)
- [ ] Crear portadas custom para cada red (dimensiones específicas)

---

**Última actualización:** 2026-02-20
