# Setup del Mapa de Parques Industriales

**Status:** ✅ Código creado, pendiente configuración de tokens

---

## ✅ Lo que ya está hecho

1. **Dependencias instaladas:**
   - @supabase/supabase-js
   - mapbox-gl
   - react-map-gl
   - @types/mapbox-gl

2. **Archivos creados:**
   - `lib/supabase.ts` - Cliente de Supabase
   - `types/parque.ts` - TypeScript interfaces
   - `types/database.ts` - Types de Supabase
   - `app/mapa-parques/page.tsx` - Página del mapa
   - `.env.local.example` - Template de variables de entorno

3. **Datos:**
   - `data/parques-industriales.json` - 9 parques de García

---

## 🚀 Para hacerlo funcionar

### Paso 1: Obtener token de Mapbox (GRATIS)

1. Ve a https://www.mapbox.com/
2. Crea cuenta (gratis hasta 50K cargas/mes)
3. Ve a Account → Tokens
4. Copia tu "Default public token"

### Paso 2: Crear .env.local

```bash
cd ~/Documents/elnortedelpais.com
cp .env.local.example .env.local
```

Edita `.env.local` y agrega tu token de Mapbox:
```
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ij...
```

### Paso 3: Probar localmente

```bash
npm run dev
```

Abre: http://localhost:3000/mapa-parques

Deberías ver:
- Mapa centrado en García, NL
- 9 pins (uno por parque)
- Sidebar con lista y filtros
- Popups al hacer click

---

## 📊 Features implementadas

### Mapa interactivo
- ✅ Mapbox GL con zoom en García
- ✅ 9 pins con colores por tipo:
  - Industrial: #002D63 (azul)
  - Tecnológico: #FF6B35 (naranja)
  - Logístico: #666666 (gris)
- ✅ Popups con info completa
- ✅ Responsive design

### Sidebar
- ✅ Stats (total parques, cobertura)
- ✅ Filtros por tipo
- ✅ Filtros por desarrolladora
- ✅ Lista de parques
- ✅ Click en lista → selecciona en mapa

### Datos
- ✅ Lee de JSON local (no requiere Supabase aún)
- ✅ 9 parques de García con coordenadas reales

---

## 🗄️ Supabase (opcional, para después)

### Para migrar de JSON a Supabase:

1. **Crear proyecto en Supabase:**
   - Ve a https://supabase.com
   - Create new project
   - Nombre: "elnortedelpais-prod"

2. **Ejecutar schema:**
   ```bash
   # Copia el contenido de supabase/schema.sql
   # Pégalo en SQL Editor de Supabase
   # Ejecuta
   ```

3. **Importar datos:**
   ```bash
   # En Supabase Table Editor
   # Tabla: parques_industriales
   # Import data from JSON
   # Selecciona data/parques-industriales.json
   ```

4. **Obtener credenciales:**
   - Settings → API
   - Copia URL y anon key
   - Agrégalas a `.env.local`

5. **Actualizar código:**
   Edita `app/mapa-parques/page.tsx`:
   ```typescript
   // Reemplaza:
   useEffect(() => {
     setParques(parquesData as Parque[])
   }, [])
   
   // Con:
   useEffect(() => {
     async function loadParques() {
       const { data } = await supabase
         .from('parques_industriales')
         .select('*')
       if (data) setParques(data)
     }
     loadParques()
   }, [])
   ```

---

## 🚢 Deploy a Vercel

1. **Commit cambios:**
   ```bash
   git add .
   git commit -m "feat: mapa interactivo de parques García"
   git push
   ```

2. **Agregar variables en Vercel:**
   - Dashboard de Vercel → Settings → Environment Variables
   - Agrega `NEXT_PUBLIC_MAPBOX_TOKEN`
   - (Opcional) Agrega las de Supabase

3. **Deploy automático** ✅

---

## 🐛 Troubleshooting

### Mapa no aparece
- Verifica que `NEXT_PUBLIC_MAPBOX_TOKEN` esté en `.env.local`
- Reinicia dev server (`npm run dev`)
- Revisa consola del navegador

### Pins no aparecen
- Verifica que `data/parques-industriales.json` exista
- Checa coordenadas lat/lng en JSON

### Error de Mapbox
- Token inválido o expirado
- Genera nuevo token en mapbox.com

---

## 📱 Post de lanzamiento

Cuando esté deployado:

```
📍 Lanzamos el mapa COMPLETO de parques industriales
de García, Nuevo León

✓ 9 parques georreferenciados (100% de cobertura)
✓ Terra Regia, FINSA, Stiva y más
✓ Filtros interactivos por tipo y desarrolladora
✓ 100% gratis

García es el municipio con mayor crecimiento industrial en NL.
Explora TODOS sus parques en un solo lugar.

→ elnortedelpais.com/mapa-parques

[Screenshot del mapa]

#García #NuevoLeon #RealEstate #ParquesIndustriales
```

---

**Creado:** 2026-02-20  
**Status:** Listo para configurar tokens y deploy  
**Tiempo para setup:** 5-10 minutos
