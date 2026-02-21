# El Norte del País - Base de Datos Central

**Proyecto:** elnortedelpais-prod  
**Propósito:** Base de datos única para TODAS las mini-webs y herramientas

---

## 🏗️ Arquitectura

Este proyecto de Supabase será la **fuente única de datos** para:

1. ✅ **Mapa de Parques** (`parques_industriales`)
2. 🔜 **Calculadora ROI** (tabla: `calculadora_historico`)
3. 🔜 **Comparador de Zonas** (tabla: `zonas_datos`)
4. 🔜 **Precios Históricos** (tabla: `precios_m2_historico`)
5. 🔜 **Proyectos** (tabla: `proyectos`)
6. 🔜 **Leads** (tabla: `leads_contacto`)

**Ventajas:**
- Un solo proyecto → costos optimizados
- Auth compartido entre todas las herramientas
- Queries cross-table (ej: parques + precios)
- Dashboard único para gestión
- Backup centralizado

---

## 📊 Tablas Actuales

### `parques_industriales`
**Status:** ✅ Schema listo, datos listos  
**Filas:** 9 (García, NL)  
**Uso:** Mapa interactivo

**Campos:**
- id, nombre, municipio, desarrolladora
- lat, lng, hectareas, ocupacion_pct
- tipo, año_fundacion, descripcion
- created_at, updated_at

---

## 🔮 Tablas Futuras

### `calculadora_historico`
Historial de cálculos de ROI de usuarios

### `zonas_datos`
Data comparativa por zona (García, Apodaca, etc.)

### `precios_m2_historico`
Serie temporal de precios por zona

### `proyectos`
Base de datos de proyectos inmobiliarios

### `leads_contacto`
Formularios de contacto de las herramientas

---

## 🔑 Credenciales

**Ubicación:** `.env.local` (NO commitear)

```
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-key]
```

**Vercel:** Agregar las mismas variables en Settings → Environment Variables

---

## 🚀 Setup

### Crear Proyecto

1. Ve a https://supabase.com/dashboard
2. New project
   - Name: **elnortedelpais-prod**
   - Database Password: (genera uno fuerte)
   - Region: **South America (São Paulo)** (más cercana)
3. Wait ~2 min para que inicialice

### Ejecutar Schema Inicial

1. Dashboard → SQL Editor
2. New query
3. Copiar contenido de `supabase/schema.sql`
4. Run

### Importar Datos de Parques

Opción A - Script (recomendado):
```bash
npm run seed:parques
```

Opción B - Table Editor (manual):
1. Dashboard → Table Editor → parques_industriales
2. Insert → Bulk import
3. Selecciona `data/parques-industriales.json`

### Obtener Credenciales

1. Settings → API
2. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (🔒 secret) → `SUPABASE_SERVICE_ROLE_KEY`

### Configurar Local

```bash
cd ~/Documents/elnortedelpais.com
cp .env.local.example .env.local
# Edita .env.local con las 3 credenciales + Mapbox
npm run dev
```

### Configurar Vercel

Vercel Dashboard → elnortedelpais → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_MAPBOX_TOKEN`

---

## 📚 Docs

- Supabase Docs: https://supabase.com/docs
- JS Client: https://supabase.com/docs/reference/javascript
- RLS Policies: https://supabase.com/docs/guides/auth/row-level-security

---

**Creado:** 2026-02-20  
**Última actualización:** 2026-02-20
