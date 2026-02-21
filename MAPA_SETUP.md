# Setup del Mapa de Parques Industriales

**Status:** Preparado para implementación con Claude Code  
**Tiempo estimado:** 2-3 horas  
**Fecha creación:** 2026-02-20

---

## ✅ Ya creado (hoy)

1. **Datos iniciales** - `data/parques-industriales.json`
   - **9 parques industriales de García, NL (100% de cobertura)** ⭐
   - Incluye: Terra Regia (3), FINSA, Stiva, Las Americas, Pocket Parks
   - Coordenadas lat/lng precisas
   - Descripción de cada uno
   
**Estrategia:** Mejor tener 100% de García que muestras dispersas de todo NL.  
Expansión futura: Apodaca, Santa Catarina, Ciénega de Flores...

2. **Schema de Supabase** - `supabase/schema.sql`
   - Tabla parques_industriales
   - Índices optimizados
   - RLS policies
   - Vista agregada por municipio

---

## 🚀 Próximos pasos (con Claude Code)

### 1. Configurar Supabase

```bash
# Crear proyecto en Supabase
# Nombre: elnortedelpais-prod
# Region: US East (o la más cercana)

# Obtener credenciales:
# - Project URL
# - anon/public key
# - service_role key (para admin)

# Ejecutar schema
supabase db push

# Importar datos iniciales
# Usar SQL Editor en Supabase Dashboard o script de seed
```

### 2. Instalar dependencias

```bash
cd ~/Documents/elnortedelpais.com
npm install @supabase/supabase-js mapbox-gl @types/mapbox-gl
```

### 3. Variables de entorno

Crear `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-key]
```

### 4. Crear componente del mapa

**Archivo:** `app/mapa-parques/page.tsx`

**Título:** "Mapa de Parques Industriales - García, NL"  
**Cobertura:** 100% de García (9 parques), expansión futura a otros municipios

**Features necesarias:**
- Mapa interactivo con Mapbox GL (zoom inicial en García)
- 9 pins (uno por cada parque)
- Popup al hacer click con info completa
- Filtros:
  - Por tipo (Industrial, Logístico, Tecnológico)
  - Por desarrolladora (Terra Regia, FINSA, Stiva)
- Sidebar con lista de parques
- Búsqueda por nombre
- Heatmap toggle (concentración de parques)
- Stats resumen de García:
  - Total: 9 parques
  - Por tipo (Industrial, Tecnológico, Logístico)
  - Por desarrolladora (Terra Regia: 3, otros)
  - Expansión prevista: +XX hectáreas (FINSA)
- Responsive (mobile + desktop)

**Componentes a crear:**
```
app/mapa-parques/
├── page.tsx                    # Página principal
├── components/
│   ├── MapView.tsx            # Mapa interactivo
│   ├── ParquesList.tsx        # Lista lateral
│   ├── Filters.tsx            # Filtros
│   ├── ParquePopup.tsx        # Info popup
│   └── StatsPanel.tsx         # Panel de estadísticas
├── lib/
│   └── supabase.ts            # Cliente de Supabase
└── types/
    └── parque.ts              # TypeScript types
```

### 5. Diseño UI/UX

**Layout:**
```
┌─────────────────────────────────────┐
│  Header: El Norte del País         │
├────────────┬────────────────────────┤
│            │                        │
│  Filters   │      Mapa              │
│  & List    │      (Mapbox)          │
│  (sidebar) │                        │
│            │                        │
│  Stats     │                        │
│            │                        │
└────────────┴────────────────────────┘
```

**Colores (del BRAND):**
- Primario: #002D63
- Secundario: #666666
- Acento: #FF6B35
- Pins del mapa: gradiente basado en tipo

### 6. Seed de datos a Supabase

**Script:** `scripts/seed-parques.ts`

```typescript
import { createClient } from '@supabase/supabase-js'
import parques from '../data/parques-industriales.json'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seed() {
  const { data, error } = await supabase
    .from('parques_industriales')
    .insert(parques)
  
  if (error) console.error(error)
  else console.log('Seeded:', data)
}

seed()
```

### 7. Features avanzadas (post-MVP)

- [ ] Exportar a PDF/CSV
- [ ] Comparar múltiples parques
- [ ] Rutas entre parques
- [ ] Street view integration
- [ ] Admin panel para actualizar datos
- [ ] API pública (opcional)

---

## 📦 Dependencias completas

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x",
    "mapbox-gl": "^3.x",
    "react-map-gl": "^7.x"
  },
  "devDependencies": {
    "@types/mapbox-gl": "^3.x"
  }
}
```

---

## 📱 Post de lanzamiento (IG + FB)

```
📍 Lanzamos el mapa completo de parques industriales
de García, Nuevo León

✓ 9 parques georreferenciados (100% de cobertura)
✓ Terra Regia, FINSA, Stiva y más
✓ Info detallada de cada desarrollo
✓ 100% gratis

García es el municipio con mayor crecimiento industrial en NL.
Ahora puedes explorar TODOS sus parques en un solo lugar.

→ elnortedelpais.com/mapa-parques

[Carrusel: screenshot mapa + stats + info de un parque]

#García #NuevoLeon #RealEstate #ParquesIndustriales #Nearshoring
```

---

## 🎨 Prompt para Claude Code

```
Necesito crear un mapa interactivo de parques industriales de García, NL para elnortedelpais.com.

CONTEXTO:
- Ya tengo: datos en data/parques-industriales.json (9 parques de García, NL)
- Ya tengo: schema de Supabase en supabase/schema.sql
- Proyecto: Next.js 15 + TypeScript + Tailwind + shadcn/ui
- Enfoque: 100% de cobertura de García (zona clave de crecimiento industrial)

REQUISITOS:
1. Página en app/mapa-parques/page.tsx
2. Título: "Mapa de Parques Industriales - García, NL"
3. Mapa interactivo con Mapbox GL JS (zoom inicial en García)
4. 9 pins con popup de info completa
5. Filtros por tipo y desarrolladora (NO por municipio, es solo García)
6. Sidebar con lista de los 9 parques
7. Stats de García (9 parques, por tipo, por desarrolladora)
8. Responsive design
9. Usar colores del brand (#002D63, #666666, #FF6B35)

ARCHIVOS:
- Componentes en app/mapa-parques/components/
- Supabase client en lib/supabase.ts
- Types en types/parque.ts
- Script de seed en scripts/seed-parques.ts

POR FAVOR:
1. Configura Supabase client
2. Crea los componentes del mapa
3. Implementa filtros y búsqueda
4. Haz el seed de datos
5. Asegúrate que sea responsive

ESTILO:
- Clean, profesional
- Inspirado en Google Maps pero más minimalista
- Foco en usabilidad
```

---

## 📝 Checklist de implementación

**Setup (15 min):**
- [ ] Crear proyecto Supabase
- [ ] Obtener credenciales
- [ ] Crear .env.local
- [ ] Instalar dependencias

**Base (45 min):**
- [ ] Cliente Supabase
- [ ] Types de TypeScript
- [ ] Seed de datos

**Mapa (60 min):**
- [ ] Componente MapView
- [ ] Pins y popups
- [ ] Integración con Supabase

**UI/Features (30 min):**
- [ ] Filtros
- [ ] Lista sidebar
- [ ] Stats panel
- [ ] Búsqueda

**Polish (15 min):**
- [ ] Responsive
- [ ] Loading states
- [ ] Error handling
- [ ] SEO metadata

**Deploy (5 min):**
- [ ] Commit a GitHub
- [ ] Deploy automático a Vercel
- [ ] Verificar que funcione

---

## 🔗 Referencias

- Mapbox GL: https://docs.mapbox.com/mapbox-gl-js/
- Supabase Docs: https://supabase.com/docs
- React Map GL: https://visgl.github.io/react-map-gl/

---

## ⚡ Quick Start (mañana)

```bash
# 1. Abrir proyecto
cd ~/Documents/elnortedelpais.com

# 2. Lanzar Claude Code
claude "Implementa el mapa de parques industriales según MAPA_SETUP.md"

# 3. Esperar ~2 horas

# 4. Probar localmente
npm run dev

# 5. Deploy
git add .
git commit -m "feat: mapa interactivo de parques industriales"
git push
```

---

**Creado:** 2026-02-20 19:50 CST  
**Por:** Andrés (OpenClaw)  
**Para:** Claude Code (mañana)
