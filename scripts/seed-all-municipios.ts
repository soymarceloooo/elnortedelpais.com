import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || ''
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim() || ''

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// All industrial parks by municipality (source: AMPIP 2023 via Líder Empresarial + research)
const parquesData = [
  // === APODACA (24) ===
  { nombre: 'Northwest Logistic Center', municipio: 'Apodaca', desarrolladora: 'Independiente', tipo: 'Logístico' },
  { nombre: 'American Industries Apodaca', municipio: 'Apodaca', desarrolladora: 'American Industries', tipo: 'Industrial' },
  { nombre: 'American Industries Huinala', municipio: 'Apodaca', desarrolladora: 'American Industries', tipo: 'Industrial' },
  { nombre: 'Apodaca Industrial Park', municipio: 'Apodaca', desarrolladora: 'Independiente', tipo: 'Industrial' },
  { nombre: 'Apodaca Technology Park', municipio: 'Apodaca', desarrolladora: 'Independiente', tipo: 'Tecnológico' },
  { nombre: 'CPA Business Center Apodaca', municipio: 'Apodaca', desarrolladora: 'CPA Group', tipo: 'Industrial' },
  { nombre: 'HubsPark Apodaca', municipio: 'Apodaca', desarrolladora: 'Independiente', tipo: 'Industrial' },
  { nombre: 'Intermex Industrial Campus Apodaca', municipio: 'Apodaca', desarrolladora: 'Intermex', tipo: 'Industrial' },
  { nombre: 'Parque Industrial Mezquital', municipio: 'Apodaca', desarrolladora: 'Independiente', tipo: 'Industrial' },
  { nombre: 'Monterrey Business Park', municipio: 'Apodaca', desarrolladora: 'Independiente', tipo: 'Industrial' },
  { nombre: 'OMA VYNMSA AERO Industrial Park', municipio: 'Apodaca', desarrolladora: 'VYNMSA', tipo: 'Industrial' },
  { nombre: 'Parque Industrial Apodaca', municipio: 'Apodaca', desarrolladora: 'Independiente', tipo: 'Industrial' },
  { nombre: 'Parque Industrial Avante Aeropuerto', municipio: 'Apodaca', desarrolladora: 'Avante', tipo: 'Industrial' },
  { nombre: 'Parque Industrial Avante Apodaca', municipio: 'Apodaca', desarrolladora: 'Avante', tipo: 'Industrial' },
  { nombre: 'Parque Industrial Davisa Apodaca', municipio: 'Apodaca', desarrolladora: 'Davisa', tipo: 'Industrial' },
  { nombre: 'FINSA Monterrey Industrial Park', municipio: 'Apodaca', desarrolladora: 'FINSA', tipo: 'Industrial' },
  { nombre: 'Parque Industrial Kronos', municipio: 'Apodaca', desarrolladora: 'Independiente', tipo: 'Industrial' },
  { nombre: 'Parque Industrial Monterrey', municipio: 'Apodaca', desarrolladora: 'Independiente', tipo: 'Industrial' },
  { nombre: 'Pocket Park Aeropuerto', municipio: 'Apodaca', desarrolladora: 'GP Desarrollos', tipo: 'Industrial' },
  { nombre: 'Stiva Aeropuerto Industrial Park', municipio: 'Apodaca', desarrolladora: 'Grupo Stiva', tipo: 'Industrial' },
  { nombre: 'VYNMSA Aeropuerto Apodaca', municipio: 'Apodaca', desarrolladora: 'VYNMSA', tipo: 'Industrial' },
  { nombre: 'VYNMSA Apodaca Industrial Park', municipio: 'Apodaca', desarrolladora: 'VYNMSA', tipo: 'Industrial' },
  { nombre: 'Centro Industrial Millennium Apodaca', municipio: 'Apodaca', desarrolladora: 'Independiente', tipo: 'Industrial' },
  { nombre: 'Prologis Park Apodaca', municipio: 'Apodaca', desarrolladora: 'Prologis', tipo: 'Logístico' },
  
  // === MONTERREY (13) ===
  { nombre: 'Parque Industrial Avante Monterrey', municipio: 'Monterrey', desarrolladora: 'Avante', tipo: 'Industrial' },
  { nombre: 'Parque Industrial La Silla', municipio: 'Monterrey', desarrolladora: 'Independiente', tipo: 'Industrial' },
  { nombre: 'Parque Industrial Millenium', municipio: 'Monterrey', desarrolladora: 'Independiente', tipo: 'Industrial' },
  { nombre: 'Parque Industrial Regio', municipio: 'Monterrey', desarrolladora: 'Independiente', tipo: 'Industrial' },
  { nombre: 'Parque Tecnológico Monterrey', municipio: 'Monterrey', desarrolladora: 'Independiente', tipo: 'Tecnológico' },
  { nombre: 'Prologis Park Agua Fría', municipio: 'Monterrey', desarrolladora: 'Prologis', tipo: 'Logístico' },
  { nombre: 'ProximityParks Monterrey Centro', municipio: 'Monterrey', desarrolladora: 'ProximityParks', tipo: 'Industrial' },
  { nombre: 'Matamoros Oriente', municipio: 'Monterrey', desarrolladora: 'Independiente', tipo: 'Industrial' },
  { nombre: 'Parque Industrial Nexxus Apodaca I', municipio: 'Monterrey', desarrolladora: 'Nexxus', tipo: 'Industrial' },
  { nombre: 'Airport Technology Park', municipio: 'Monterrey', desarrolladora: 'Independiente', tipo: 'Tecnológico' },
  { nombre: 'Global Park', municipio: 'Monterrey', desarrolladora: 'Independiente', tipo: 'Industrial' },
  { nombre: 'CIESA Asia Pacific Park', municipio: 'Monterrey', desarrolladora: 'CIESA', tipo: 'Industrial' },
  { nombre: 'Salvic', municipio: 'Monterrey', desarrolladora: 'Independiente', tipo: 'Industrial' },

  // === SANTA CATARINA (7) ===
  { nombre: 'Dominio Huasteca', municipio: 'Santa Catarina', desarrolladora: 'Terra Regia', tipo: 'Industrial' },
  { nombre: 'Martel Industrial Park', municipio: 'Santa Catarina', desarrolladora: 'Martel', tipo: 'Industrial' },
  { nombre: 'FINSA Santa Catarina', municipio: 'Santa Catarina', desarrolladora: 'FINSA', tipo: 'Industrial' },
  { nombre: 'FINSA Santa Catarina II', municipio: 'Santa Catarina', desarrolladora: 'FINSA', tipo: 'Industrial' },
  { nombre: 'Stiva Santa Catarina Industrial Park', municipio: 'Santa Catarina', desarrolladora: 'Grupo Stiva', tipo: 'Industrial' },
  { nombre: 'Terra Park Santa Catarina', municipio: 'Santa Catarina', desarrolladora: 'Terra Regia', tipo: 'Industrial' },
  { nombre: 'VYNMSA Santa Catarina Industrial Park', municipio: 'Santa Catarina', desarrolladora: 'VYNMSA', tipo: 'Industrial' },

  // === ESCOBEDO (6) ===
  { nombre: 'CPA Logistics Center Escobedo', municipio: 'General Escobedo', desarrolladora: 'CPA Group', tipo: 'Logístico' },
  { nombre: 'GP Escobedo Industrial Park', municipio: 'General Escobedo', desarrolladora: 'GP Desarrollos', tipo: 'Industrial' },
  { nombre: 'Parque Industrial Tecnocentro', municipio: 'General Escobedo', desarrolladora: 'Independiente', tipo: 'Industrial' },
  { nombre: 'Pocket Park Escobedo', municipio: 'General Escobedo', desarrolladora: 'GP Desarrollos', tipo: 'Industrial' },
  { nombre: 'VYNMSA Escobedo Park', municipio: 'General Escobedo', desarrolladora: 'VYNMSA', tipo: 'Industrial' },
  { nombre: 'VYNMSA Escobedo Park II', municipio: 'General Escobedo', desarrolladora: 'VYNMSA', tipo: 'Industrial' },

  // === CIÉNEGA DE FLORES (5) ===
  { nombre: 'CPA Logistics Center ADN', municipio: 'Ciénega de Flores', desarrolladora: 'CPA Group', tipo: 'Logístico' },
  { nombre: 'Las Americas Industrial Park', municipio: 'Ciénega de Flores', desarrolladora: 'Independiente', tipo: 'Industrial' },
  { nombre: 'Monterrey Technology Park', municipio: 'Ciénega de Flores', desarrolladora: 'Independiente', tipo: 'Tecnológico' },
  { nombre: 'Pocket Park Norte', municipio: 'Ciénega de Flores', desarrolladora: 'GP Desarrollos', tipo: 'Industrial' },
  { nombre: 'Terra Park ADN', municipio: 'Ciénega de Flores', desarrolladora: 'Terra Regia', tipo: 'Industrial' },

  // === GUADALUPE (4) ===
  { nombre: 'FINSA Guadalupe Industrial Park', municipio: 'Guadalupe', desarrolladora: 'FINSA', tipo: 'Industrial' },
  { nombre: 'Parque Industrial Guadalupe', municipio: 'Guadalupe', desarrolladora: 'Independiente', tipo: 'Industrial' },
  { nombre: 'Vesta Park Guadalupe', municipio: 'Guadalupe', desarrolladora: 'Vesta', tipo: 'Industrial' },
  { nombre: 'VYNMSA Acueducto Industrial Park', municipio: 'Guadalupe', desarrolladora: 'VYNMSA', tipo: 'Industrial' },

  // === SAN NICOLÁS (3) ===
  { nombre: 'Pocket Park Oriente', municipio: 'San Nicolás de los Garza', desarrolladora: 'GP Desarrollos', tipo: 'Industrial' },
  { nombre: 'Terra Park Condesa', municipio: 'San Nicolás de los Garza', desarrolladora: 'Terra Regia', tipo: 'Industrial' },
  { nombre: 'Parque Industrial Nexxus Escobedo', municipio: 'San Nicolás de los Garza', desarrolladora: 'Nexxus', tipo: 'Industrial' },

  // === SALINAS VICTORIA (2) ===
  { nombre: 'Interpuerto Monterrey', municipio: 'Salinas Victoria', desarrolladora: 'Independiente', tipo: 'Logístico' },
  { nombre: 'Ecocentro', municipio: 'Salinas Victoria', desarrolladora: 'Independiente', tipo: 'Industrial' },

  // === PESQUERÍA (3) ===
  { nombre: 'Stiva Barragán Industrial Park', municipio: 'Pesquería', desarrolladora: 'Grupo Stiva', tipo: 'Industrial' },
  { nombre: 'VYNMSA Miguel Alemán Industrial Park', municipio: 'Pesquería', desarrolladora: 'VYNMSA', tipo: 'Industrial' },
  { nombre: 'Parque Industrial Hofusan', municipio: 'Pesquería', desarrolladora: 'Hofusan', tipo: 'Industrial' },

  // === EL CARMEN (3) ===
  { nombre: 'CIP El Carmen', municipio: 'El Carmen', desarrolladora: 'Independiente', tipo: 'Industrial' },
  { nombre: 'GTP El Carmen Industrial Park', municipio: 'El Carmen', desarrolladora: 'GTP', tipo: 'Industrial' },
  { nombre: 'Stiva El Jaral Industrial Park', municipio: 'El Carmen', desarrolladora: 'Grupo Stiva', tipo: 'Industrial' },

  // === SAN PEDRO (1) ===
  { nombre: 'ProximityParks San Pedro', municipio: 'San Pedro Garza García', desarrolladora: 'ProximityParks', tipo: 'Industrial' },

  // === JUÁREZ (2) ===
  { nombre: 'Parque Industrial Juárez I', municipio: 'Juárez', desarrolladora: 'Independiente', tipo: 'Industrial' },
  { nombre: 'Parque Industrial Juárez II', municipio: 'Juárez', desarrolladora: 'Independiente', tipo: 'Industrial' },
]

// Geocode using Mapbox
async function geocode(name: string, municipio: string): Promise<{lat: number, lng: number} | null> {
  const query = encodeURIComponent(`${name}, ${municipio}, Nuevo León, México`)
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAPBOX_TOKEN}&limit=1&bbox=-100.8,25.4,-99.8,26.2`
  
  try {
    const res = await fetch(url)
    const data = await res.json()
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center
      return { lat, lng }
    }
    
    // Fallback: search with just "parque industrial" + municipio
    const fallbackQuery = encodeURIComponent(`parque industrial ${municipio}, Nuevo León, México`)
    const fallbackUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${fallbackQuery}.json?access_token=${MAPBOX_TOKEN}&limit=1&bbox=-100.8,25.4,-99.8,26.2`
    const fallbackRes = await fetch(fallbackUrl)
    const fallbackData = await fallbackRes.json()
    if (fallbackData.features && fallbackData.features.length > 0) {
      const [lng, lat] = fallbackData.features[0].center
      // Add small random offset to avoid stacking
      return { 
        lat: lat + (Math.random() - 0.5) * 0.01, 
        lng: lng + (Math.random() - 0.5) * 0.01 
      }
    }
    
    return null
  } catch (err) {
    console.error(`Geocode error for ${name}:`, err)
    return null
  }
}

// Municipal center fallbacks
const municipioCenters: Record<string, {lat: number, lng: number}> = {
  'Apodaca': { lat: 25.7818, lng: -100.1884 },
  'Monterrey': { lat: 25.6714, lng: -100.3090 },
  'Santa Catarina': { lat: 25.6734, lng: -100.4581 },
  'General Escobedo': { lat: 25.7983, lng: -100.3354 },
  'Ciénega de Flores': { lat: 25.9533, lng: -100.1641 },
  'Guadalupe': { lat: 25.6772, lng: -100.2304 },
  'San Nicolás de los Garza': { lat: 25.7417, lng: -100.2838 },
  'Salinas Victoria': { lat: 25.9600, lng: -100.2950 },
  'Pesquería': { lat: 25.7744, lng: -100.0450 },
  'El Carmen': { lat: 25.6833, lng: -100.0167 },
  'San Pedro Garza García': { lat: 25.6510, lng: -100.4020 },
  'Juárez': { lat: 25.6488, lng: -100.0953 },
  'García': { lat: 25.8147, lng: -100.5920 },
}

async function main() {
  console.log(`\n🏭 Seeding ${parquesData.length} industrial parks across ${new Set(parquesData.map(p => p.municipio)).size} municipalities\n`)
  
  const toInsert = []
  
  for (const parque of parquesData) {
    process.stdout.write(`📍 Geocoding: ${parque.nombre} (${parque.municipio})... `)
    
    let coords = await geocode(parque.nombre, parque.municipio)
    
    if (!coords) {
      const center = municipioCenters[parque.municipio]
      if (center) {
        coords = {
          lat: center.lat + (Math.random() - 0.5) * 0.02,
          lng: center.lng + (Math.random() - 0.5) * 0.02
        }
        console.log(`⚠️ Using municipal center fallback`)
      } else {
        console.log(`❌ No coordinates found, skipping`)
        continue
      }
    } else {
      console.log(`✅ ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`)
    }
    
    toInsert.push({
      nombre: parque.nombre,
      municipio: parque.municipio,
      desarrolladora: parque.desarrolladora === 'Independiente' ? null : parque.desarrolladora,
      lat: coords.lat,
      lng: coords.lng,
      tipo: parque.tipo,
      ocupacion_pct: null,
      descripcion: `Parque ${parque.tipo.toLowerCase()} en ${parque.municipio}, NL.${parque.desarrolladora !== 'Independiente' ? ` Desarrollado por ${parque.desarrolladora}.` : ''}`,
      disponibilidad: true,
      precio_confianza: 'sin_dato' as const,
    })
    
    // Rate limit
    await new Promise(r => setTimeout(r, 100))
  }
  
  console.log(`\n📦 Inserting ${toInsert.length} parks into Supabase...`)
  
  // Insert in batches of 20
  for (let i = 0; i < toInsert.length; i += 20) {
    const batch = toInsert.slice(i, i + 20)
    const { error } = await supabase
      .from('parques_industriales')
      .insert(batch)
    
    if (error) {
      console.error(`Error inserting batch ${i}:`, error)
      // Try individual inserts
      for (const park of batch) {
        const { error: singleError } = await supabase
          .from('parques_industriales')
          .insert(park)
        if (singleError) {
          console.error(`  ❌ Failed: ${park.nombre} - ${singleError.message}`)
        } else {
          console.log(`  ✅ ${park.nombre}`)
        }
      }
    } else {
      console.log(`  ✅ Batch ${Math.floor(i/20) + 1} inserted (${batch.length} parks)`)
    }
  }
  
  // Verify
  const { data: count } = await supabase
    .from('parques_industriales')
    .select('municipio', { count: 'exact' })
  
  console.log(`\n✅ Done! Total parks in database: ${count?.length}`)
  
  // Show breakdown by municipality
  const { data: all } = await supabase
    .from('parques_industriales')
    .select('municipio')
  
  if (all) {
    const breakdown: Record<string, number> = {}
    all.forEach((p: any) => {
      breakdown[p.municipio] = (breakdown[p.municipio] || 0) + 1
    })
    console.log('\n📊 By municipality:')
    Object.entries(breakdown).sort((a, b) => b[1] - a[1]).forEach(([m, c]) => {
      console.log(`  ${m}: ${c}`)
    })
  }
}

main().catch(console.error)
