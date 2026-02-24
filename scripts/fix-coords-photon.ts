import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || ''
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Municipality centers for biasing search
const BIAS: Record<string, {lat: number, lon: number}> = {
  'Apodaca': { lat: 25.78, lon: -100.19 },
  'Monterrey': { lat: 25.67, lon: -100.31 },
  'Santa Catarina': { lat: 25.67, lon: -100.46 },
  'General Escobedo': { lat: 25.80, lon: -100.34 },
  'Ciénega de Flores': { lat: 25.95, lon: -100.17 },
  'Guadalupe': { lat: 25.68, lon: -100.23 },
  'San Nicolás de los Garza': { lat: 25.74, lon: -100.28 },
  'Salinas Victoria': { lat: 25.96, lon: -100.30 },
  'Pesquería': { lat: 25.77, lon: -100.05 },
  'El Carmen': { lat: 25.68, lon: -100.02 },
  'San Pedro Garza García': { lat: 25.65, lon: -100.40 },
  'Juárez': { lat: 25.65, lon: -100.10 },
}

const PARKS = [
  { id: 18, nombre: 'Northwest Logistic Center', municipio: 'Apodaca' },
  { id: 22, nombre: 'Apodaca Technology Park', municipio: 'Apodaca' },
  { id: 28, nombre: 'OMA VYNMSA AERO Industrial Park', municipio: 'Apodaca' },
  { id: 33, nombre: 'FINSA Monterrey Industrial Park', municipio: 'Apodaca' },
  { id: 36, nombre: 'Pocket Park Aeropuerto', municipio: 'Apodaca' },
  { id: 37, nombre: 'Stiva Aeropuerto Industrial Park', municipio: 'Apodaca' },
  { id: 40, nombre: 'Centro Industrial Millennium Apodaca', municipio: 'Apodaca' },
  { id: 19, nombre: 'American Industries Apodaca', municipio: 'Apodaca' },
  { id: 23, nombre: 'CPA Business Center Apodaca', municipio: 'Apodaca' },
  { id: 24, nombre: 'HubsPark Apodaca', municipio: 'Apodaca' },
  { id: 25, nombre: 'Intermex Industrial Campus Apodaca', municipio: 'Apodaca' },
  { id: 26, nombre: 'Parque Industrial Mezquital Apodaca', municipio: 'Apodaca' },
  { id: 30, nombre: 'Parque Industrial Avante Aeropuerto', municipio: 'Apodaca' },
  { id: 32, nombre: 'Parque Industrial Davisa Apodaca', municipio: 'Apodaca' },
  { id: 34, nombre: 'Parque Industrial Kronos Apodaca', municipio: 'Apodaca' },
  { id: 50, nombre: 'Parque Industrial Nexxus Apodaca', municipio: 'Monterrey' },
  { id: 68, nombre: 'CPA Logistics Center ADN Ciénega de Flores', municipio: 'Ciénega de Flores' },
  { id: 72, nombre: 'Terra Park ADN Ciénega de Flores', municipio: 'Ciénega de Flores' },
  { id: 71, nombre: 'Pocket Park Norte Ciénega de Flores', municipio: 'Ciénega de Flores' },
  { id: 85, nombre: 'CIP El Carmen Nuevo Leon', municipio: 'El Carmen' },
  { id: 86, nombre: 'GTP El Carmen Industrial Park', municipio: 'El Carmen' },
  { id: 63, nombre: 'GP Escobedo Industrial Park', municipio: 'General Escobedo' },
  { id: 67, nombre: 'VYNMSA Escobedo Park II', municipio: 'General Escobedo' },
  { id: 65, nombre: 'Pocket Park Escobedo Nuevo Leon', municipio: 'General Escobedo' },
  { id: 62, nombre: 'CPA Logistics Center Escobedo', municipio: 'General Escobedo' },
  { id: 64, nombre: 'Parque Industrial Tecnocentro Escobedo', municipio: 'General Escobedo' },
  { id: 89, nombre: 'Parque Industrial Juárez Nuevo Leon', municipio: 'Juárez' },
  { id: 90, nombre: 'Parque Industrial Juárez II Nuevo Leon', municipio: 'Juárez' },
  { id: 45, nombre: 'Parque Industrial Regio Monterrey', municipio: 'Monterrey' },
  { id: 74, nombre: 'Parque Industrial Guadalupe Nuevo Leon', municipio: 'Guadalupe' },
  { id: 73, nombre: 'FINSA Guadalupe Industrial Park Nuevo Leon', municipio: 'Guadalupe' },
  { id: 75, nombre: 'Vesta Park Guadalupe Nuevo Leon', municipio: 'Guadalupe' },
  { id: 76, nombre: 'VYNMSA Acueducto Industrial Park Guadalupe', municipio: 'Guadalupe' },
  { id: 53, nombre: 'CIESA Asia Pacific Park Monterrey', municipio: 'Monterrey' },
  { id: 52, nombre: 'Global Park Monterrey industrial', municipio: 'Monterrey' },
  { id: 51, nombre: 'Airport Technology Park Monterrey', municipio: 'Monterrey' },
  { id: 48, nombre: 'ProximityParks Monterrey Centro', municipio: 'Monterrey' },
  { id: 47, nombre: 'Prologis Park Agua Fría Monterrey', municipio: 'Monterrey' },
  { id: 42, nombre: 'Parque Industrial Avante Monterrey', municipio: 'Monterrey' },
  { id: 80, nombre: 'Interpuerto Monterrey Salinas Victoria', municipio: 'Salinas Victoria' },
  { id: 82, nombre: 'Stiva Barragán Industrial Park Pesquería', municipio: 'Pesquería' },
  { id: 84, nombre: 'Parque Industrial Hofusan Pesquería', municipio: 'Pesquería' },
  { id: 83, nombre: 'VYNMSA Miguel Alemán Industrial Park Pesquería', municipio: 'Pesquería' },
  { id: 60, nombre: 'Terra Park Santa Catarina Nuevo Leon', municipio: 'Santa Catarina' },
  { id: 58, nombre: 'FINSA Santa Catarina II Nuevo Leon', municipio: 'Santa Catarina' },
  { id: 57, nombre: 'FINSA Santa Catarina Nuevo Leon', municipio: 'Santa Catarina' },
  { id: 56, nombre: 'Martel Industrial Park Santa Catarina', municipio: 'Santa Catarina' },
  { id: 59, nombre: 'Stiva Santa Catarina Industrial Park', municipio: 'Santa Catarina' },
  { id: 61, nombre: 'VYNMSA Santa Catarina Industrial Park', municipio: 'Santa Catarina' },
]

async function geocodePhoton(query: string, municipio: string): Promise<{lat: number, lng: number} | null> {
  const bias = BIAS[municipio] || { lat: 25.75, lon: -100.3 }
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query + ' Nuevo Leon Mexico')}&limit=3&lat=${bias.lat}&lon=${bias.lon}`
  
  try {
    const res = await fetch(url)
    const data = await res.json()
    
    if (data.features && data.features.length > 0) {
      // Find the best result in Nuevo León area
      for (const f of data.features) {
        const [lng, lat] = f.geometry.coordinates
        if (lat > 25.0 && lat < 27.0 && lng > -101.0 && lng < -99.5) {
          return { lat, lng }
        }
      }
    }
  } catch {}
  return null
}

// Alternative: search with different query variations
async function geocodeWithVariations(nombre: string, municipio: string): Promise<{lat: number, lng: number} | null> {
  const queries = [
    nombre,
    `${nombre} parque industrial`,
    nombre.replace(/Industrial Park|Parque Industrial/gi, '').trim() + ` ${municipio}`,
    nombre.replace(/Park|Parque/gi, '').trim() + ` industrial ${municipio}`,
  ]
  
  for (const q of queries) {
    const result = await geocodePhoton(q, municipio)
    if (result) return result
    await new Promise(r => setTimeout(r, 300)) // Rate limit
  }
  
  return null
}

async function main() {
  console.log(`\n🗺️  Fixing coordinates for ${PARKS.length} parks via Photon geocoder...\n`)
  
  let updated = 0
  let failed = 0
  const failedParks: typeof PARKS = []
  
  for (const park of PARKS) {
    process.stdout.write(`📍 [${park.id}] ${park.nombre}... `)
    
    const coords = await geocodeWithVariations(park.nombre, park.municipio)
    
    if (coords) {
      const { error } = await supabase
        .from('parques_industriales')
        .update({ lat: coords.lat, lng: coords.lng })
        .eq('id', park.id)
      
      if (!error) {
        console.log(`✅ ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`)
        updated++
      } else {
        console.log(`❌ DB: ${error.message}`)
        failedParks.push(park)
        failed++
      }
    } else {
      console.log(`⚠️ Not found`)
      failedParks.push(park)
      failed++
    }
    
    await new Promise(r => setTimeout(r, 200))
  }
  
  console.log(`\n📊 Results: ${updated} updated, ${failed} failed`)
  
  if (failedParks.length > 0) {
    console.log(`\n❌ Failed parks (need manual lookup):`)
    for (const p of failedParks) {
      console.log(`  [${p.id}] ${p.nombre} (${p.municipio})`)
    }
  }
  
  // Check remaining duplicates
  const { data: allParks } = await supabase
    .from('parques_industriales')
    .select('id, nombre, municipio, lat, lng')
    .order('municipio')
  
  if (allParks) {
    const coordMap = new Map<string, any[]>()
    for (const p of allParks) {
      const key = `${p.lat.toFixed(3)},${p.lng.toFixed(3)}`
      if (!coordMap.has(key)) coordMap.set(key, [])
      coordMap.get(key)!.push(p)
    }
    
    let dupes = 0
    for (const [, parks] of coordMap) {
      if (parks.length > 1) dupes += parks.length
    }
    console.log(`\n📍 Remaining stacked parks: ${dupes}`)
    
    if (dupes > 0) {
      console.log('\nStacked groups:')
      for (const [coord, parks] of coordMap) {
        if (parks.length > 1) {
          console.log(`  ${coord}:`)
          for (const p of parks) {
            console.log(`    [${p.id}] ${p.nombre} (${p.municipio})`)
          }
        }
      }
    }
  }
}

main().catch(console.error)
