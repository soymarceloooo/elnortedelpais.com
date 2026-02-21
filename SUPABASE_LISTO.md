# ✅ Supabase Configurado - Resumen Completo

**Fecha:** 2026-02-20  
**Status:** ✅ FUNCIONANDO

---

## 🎯 Lo que se hizo

### 1. Linkeo del proyecto
```bash
supabase link --project-ref zlszcbrdxtdvuizmrhja
```
✅ Proyecto "marcelo-ooo" conectado

### 2. Schema y migración
```bash
supabase migration new create_parques_industriales
supabase db push
```
✅ Tabla `parques_industriales` creada con:
- Campos completos (nombre, lat/lng, desarrolladora, tipo, etc.)
- Row Level Security (RLS) habilitado
- Política de lectura pública
- Índices para búsqueda rápida
- Trigger para updated_at automático
- Vista agregada por municipio

### 3. Importación de datos
```bash
npm run seed:parques
```
✅ 9 parques importados:
1. Las Americas Industrial Park
2. Monterrey Technology Park
3. Terra Park ADN (Terra Regia)
4. Terra Park Dominio (Terra Regia)
5. Terra Park García (Terra Regia)
6. Stiva García Industrial Park
7. Pocket Park Norte
8. Pocket Park Poniente
9. FINSA Monterrey García

### 4. Código del mapa actualizado
✅ `app/mapa-parques/page.tsx` ahora lee desde Supabase
✅ Loading states implementados
✅ Error handling agregado

---

## 🔑 Credenciales configuradas

Archivo: `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://zlszcbrdxtdvuizmrhja.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... (solo para scripts de seed)
```

⚠️ **IMPORTANTE:** Estas credenciales están en `.env.local` pero NO las subas a git (`.gitignore` las protege).

---

## 🚀 Para Deploy en Vercel

1. **Agregar variables de entorno en Vercel:**
   - Ve a: https://vercel.com/dashboard → Settings → Environment Variables
   - Agrega:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://zlszcbrdxtdvuizmrhja.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```
   - **NO agregues** `SUPABASE_SERVICE_ROLE_KEY` en Vercel (solo es para local)

2. **Commit y push:**
   ```bash
   git add .
   git commit -m "feat: integrar Supabase para mapa de parques"
   git push
   ```

3. **Deploy automático** ✅

---

## 🧪 Verificar que funciona

### Localmente
```bash
cd ~/Documents/elnortedelpais.com
npm run dev
```
→ Abre http://localhost:3000/mapa-parques

### En producción (después del deploy)
→ https://elnortedelpaiscom.vercel.app/mapa-parques

**Deberías ver:**
- ✅ Mapa cargado (necesitas token de Mapbox todavía)
- ✅ 9 pins en García
- ✅ Sidebar con stats y filtros
- ✅ Datos cargando desde Supabase

---

## 📊 Schema de la base de datos

```sql
CREATE TABLE parques_industriales (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  municipio TEXT NOT NULL,
  desarrolladora TEXT,
  lat DECIMAL(10, 6) NOT NULL,
  lng DECIMAL(10, 6) NOT NULL,
  hectareas DECIMAL(10, 2),
  ocupacion_pct DECIMAL(5, 2),
  tipo TEXT CHECK (tipo IN ('Industrial', 'Logístico', 'Tecnológico', 'Mixto')),
  año_fundacion INTEGER,
  descripcion TEXT,
  servicios TEXT[],
  precio_m2_usd DECIMAL(10, 2),
  disponibilidad BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Vista agregada:**
```sql
CREATE VIEW parques_por_municipio AS
SELECT 
  municipio,
  COUNT(*) as total_parques,
  AVG(ocupacion_pct) as ocupacion_promedio,
  AVG(precio_m2_usd) as precio_promedio_m2,
  SUM(hectareas) as hectareas_totales
FROM parques_industriales
GROUP BY municipio;
```

---

## 🔒 Seguridad (RLS)

**Políticas activas:**
1. ✅ Lectura pública → Cualquiera puede ver los parques
2. ✅ Escritura autenticada → Solo admins pueden modificar

**Para agregar/editar parques en el futuro:**
- Crear dashboard admin en Next.js
- Login con Supabase Auth
- CRUD completo protegido por RLS

---

## 🛠️ Comandos útiles

### Ver datos en Supabase
```bash
# Todos los parques
curl -s "https://zlszcbrdxtdvuizmrhja.supabase.co/rest/v1/parques_industriales?select=*" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" | python3 -m json.tool

# Solo Terra Regia
curl -s "https://zlszcbrdxtdvuizmrhja.supabase.co/rest/v1/parques_industriales?desarrolladora=eq.Terra%20Regia&select=*" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" | python3 -m json.tool
```

### Re-importar datos (si cambias el JSON)
```bash
cd ~/Documents/elnortedelpais.com
export $(cat .env.local | grep -v '^#' | xargs)
npx tsx scripts/seed-parques.ts
```

### Crear nueva migration
```bash
supabase migration new nombre_de_la_migracion
# Edita supabase/migrations/TIMESTAMP_nombre.sql
supabase db push
```

---

## ⏭️ Próximos pasos

### Crítico (para que el mapa funcione 100%)
- [ ] **Obtener token de Mapbox** (gratis, 5 min)
  - Ve a https://www.mapbox.com/
  - Crea cuenta
  - Copia token y agrégalo a `.env.local` y Vercel

### Features futuras (opcionales)
- [ ] Dashboard admin para agregar/editar parques
- [ ] Filtro por rango de precio
- [ ] Búsqueda por nombre
- [ ] Clustering de pins cuando hay zoom out
- [ ] Street view integration
- [ ] Comparador de parques
- [ ] Cálculo de distancias
- [ ] Exportar a PDF/Excel

---

## 🐛 Troubleshooting

### Error: "Cannot find project ref"
```bash
cd ~/Documents/elnortedelpais.com
supabase link --project-ref zlszcbrdxtdvuizmrhja
```

### Error: "new row violates row-level security"
→ Usa `SUPABASE_SERVICE_ROLE_KEY` para scripts de seed (no el anon key)

### Mapa no carga datos
1. Verifica que `.env.local` tenga las credenciales
2. Reinicia dev server: `npm run dev`
3. Abre consola del navegador y busca errores
4. Prueba el endpoint REST directamente (ver comandos útiles arriba)

### Datos duplicados en Supabase
```bash
# Limpia la tabla
cd ~/Documents/elnortedelpais.com
export $(cat .env.local | grep -v '^#' | xargs)
npx tsx scripts/seed-parques.ts
# El script limpia automáticamente antes de insertar
```

---

## 📚 Referencias

- **Supabase Dashboard:** https://supabase.com/dashboard/project/zlszcbrdxtdvuizmrhja
- **API Docs:** https://supabase.com/docs/reference/javascript/select
- **Next.js + Supabase:** https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- **Mapbox GL:** https://docs.mapbox.com/mapbox-gl-js/

---

**Creado:** 2026-02-20 21:59 CST  
**Por:** Andrés (OpenClaw)  
**Status:** ✅ LISTO PARA PRODUCCIÓN (solo falta token de Mapbox)
