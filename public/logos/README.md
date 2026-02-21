# Brand Kit - El Norte del País

**Fuente de verdad:** Este directorio (`~/.openclaw/workspace/elnortedelpais/assets/logos/`)

## 📦 Estructura

```
logos/
├── svg/                    # Vectoriales (fuente original)
│   ├── logo-full.svg       # Logo completo (400x120)
│   ├── logo-horizontal.svg # Versión apaisada para headers (500x80)
│   ├── logo-icon.svg       # Solo barras de datos (100x100)
│   ├── logo-full-white.svg # Para fondos oscuros
│   └── logo-full-mono.svg  # Monocromático para impresión B&N
├── png/                    # Rasterizados retina-ready
│   ├── logo-full@1x.png    # 400x120
│   ├── logo-full@2x.png    # 800x240 (retina)
│   ├── logo-full@3x.png    # 1200x360 (super retina)
│   ├── logo-icon-*.png     # 256x256, 512x512, 1024x1024
│   ├── favicon-*.png       # 16x16, 32x32
│   └── apple-touch-icon.png # 180x180
├── social/                 # Optimizado para redes
│   ├── instagram-profile.png   # 1080x1080
│   ├── facebook-profile.png    # 1080x1080
│   ├── facebook-cover.png      # 1702x630
│   └── og-image.png            # 1200x630 (links en redes)
└── print/                  # Alta resolución
    └── logo-300dpi.png     # 3000x900 (10" a 300 DPI)
```

---

## 🎨 Identidad Visual

### Colores (de BRAND.md)
- **Primario:** `#002D63` (azul institucional)
- **Secundario:** `#666666` (gris neutral)
- **Acento:** `#FF6B35` (naranja para CTAs)

### Tipografía
- **Headings:** Manrope
- **Body:** Inter

### Concepto del Logo
**Barras de datos ascendentes:**
- Gris (#666) → Azul (#002D63) → Azul (#002D63) → Naranja (#FF6B35)
- Representa crecimiento, análisis de datos, progresión
- Minimalista, profesional, moderno

---

## 📱 Guía de Uso por Plataforma

### Website (elnortedelpais.com)
**Header:** `svg/logo-horizontal.svg`  
**Favicon:** `png/favicon-32x32.png`, `png/favicon-16x16.png`  
**Apple Touch Icon:** `png/apple-touch-icon.png`  
**Open Graph:** `social/og-image.png`

### Instagram
**Perfil:** `social/instagram-profile.png` (1080x1080)  
**Story templates:** Usar `svg/logo-icon.svg` como watermark

### Facebook
**Perfil:** `social/facebook-profile.png` (1080x1080)  
**Portada:** `social/facebook-cover.png` (1702x630)  
**Links (OG):** `social/og-image.png` (automático)

### Twitter/X
**Perfil:** `social/instagram-profile.png` (reutilizar)  
**Header:** Crear custom 1500x500 si es necesario  
**Cards:** `social/og-image.png`

### LinkedIn
**Logo empresa:** `social/facebook-profile.png`  
**Banner:** Crear custom 1128x191 si es necesario

### Email/Newsletter
**Header:** `png/logo-full@2x.png` (800x240)  
Reducir a 400-600px de ancho en el email

### Impresión
**Vectorial:** `svg/logo-full.svg` (importar en diseño)  
**Rasterizado:** `print/logo-300dpi.png` (3000x900 a 300 DPI)

---

## 🔄 Workflow: Workspace → Producción

**1. Editar siempre en workspace:**
```bash
~/.openclaw/workspace/elnortedelpais/assets/logos/svg/
```

**2. Regenerar PNG si cambias SVG:**
```bash
cd ~/.openclaw/workspace/elnortedelpais/assets/logos
./regenerate-png.sh  # (crear este script si hacemos cambios frecuentes)
```

**3. Copiar a proyecto web:**
```bash
cp -r ~/.openclaw/workspace/elnortedelpais/assets/logos/* \
      ~/Documents/elnortedelpais.com/public/logos/
```

**4. Deploy a Vercel:**
```bash
cd ~/Documents/elnortedelpais.com
git add public/logos
git commit -m "Update brand kit"
git push
```

---

## ✅ Checklist de Implementación

### Website
- [ ] Actualizar header con nuevo logo
- [ ] Actualizar favicon
- [ ] Actualizar Open Graph metadata
- [ ] Verificar en mobile y desktop

### Redes Sociales
- [ ] Instagram: perfil
- [ ] Facebook: perfil + portada
- [ ] Twitter/X: perfil + header
- [ ] LinkedIn: logo empresa

### Documentación
- [ ] Actualizar README.md del proyecto web
- [ ] Actualizar BRAND.md si hay cambios
- [ ] Archivar logos viejos (ya hecho: `logos-OLD-20260221`)

---

## 🎯 Quick Reference

| Necesitas... | Usa este archivo |
|--------------|------------------|
| Logo para web header | `svg/logo-horizontal.svg` |
| Favicon | `png/favicon-32x32.png` |
| Perfil Instagram/Facebook | `social/instagram-profile.png` |
| Compartir link en redes | `social/og-image.png` |
| Impresión tarjetas/flyers | `print/logo-300dpi.png` o `svg/logo-full.svg` |
| Email signature | `png/logo-full@2x.png` |
| App icon | `png/logo-icon-512x512.png` |

---

**Última actualización:** 2026-02-21  
**Brand kit generado por:** Andrés (OpenClaw)  
**Aprobado por:** Marcelo Torres
