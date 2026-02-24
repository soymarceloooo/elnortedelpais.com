import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Use Nominatim (OpenStreetMap) geocoding - free, good for businesses
async function geocodeNominatim(name: string, municipio: string): Promise<{lat: number, lng: number} | null> {
  const queries = [
    `${name}, ${municipio}, Nuevo León, México`,
    `${name}, ${municipio}, Nuevo Leon, Mexico`,
    `${name}, Nuevo León, México`,
  ]
  
  for (const q of queries) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&bounded=1&viewbox=-100.8,25.4,-99.7,26.2`
      const res = await fetch(url, {
        headers: { 'User-Agent': 'ElNorteDelPais-MapProject/1.0' }
      })
      const data = await res.json()
      if (data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
      }
    } catch {}
    await new Promise(r => setTimeout(r, 1100)) // Nominatim rate limit: 1 req/sec
  }
  return null
}

// Google Maps search URL - extract coords from redirect
async function geocodeGoogleMaps(name: string, municipio: string): Promise<{lat: number, lng: number} | null> {
  const query = `${name} ${municipio} Nuevo León México parque industrial`
  const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`
  
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    })
    const finalUrl = res.url
    // Extract @lat,lng from URL
    const match = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (match) {
      return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) }
    }
    
    // Try extracting from body
    const body = await res.text()
    const bodyMatch = body.match(/center=(-?\d+\.\d+)%2C(-?\d+\.\d+)/) ||
                     body.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ||
                     body.match(/\[null,null,(-?\d+\.\d+),(-?\d+\.\d+)\]/)
    if (bodyMatch) {
      return { lat: parseFloat(bodyMatch[1]), lng: parseFloat(bodyMatch[2]) }
    }
  } catch (err) {
    // console.error(`Google Maps error for ${name}:`, err)
  }
  return null
}

// Overpass API - search OSM for industrial areas
async function geocodeOverpass(name: string, municipio: string): Promise<{lat: number, lng: number} | null> {
  // Search for landuse=industrial with matching name in the municipality area
  const bbox = getBbox(municipio)
  if (!bbox) return null
  
  const simpleName = name
    .replace(/Industrial Park|Parque Industrial/gi, '')
    .replace(/Industrial/gi, '')
    .trim()
  
  const query = `[out:json][timeout:10];
    (
      way["landuse"="industrial"]["name"~"${simpleName}",i](${bbox});
      relation["landuse"="industrial"]["name"~"${simpleName}",i](${bbox});
      node["industrial"]["name"~"${simpleName}",i](${bbox});
    );
    out center 1;`
  
  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`
    })
    const data = await res.json()
    if (data.elements?.length > 0) {
      const el = data.elements[0]
      const lat = el.center?.lat || el.lat
      const lng = el.center?.lon || el.lon
      if (lat && lng) return { lat, lng }
    }
  } catch {}
  return null
}

function getBbox(municipio: string): string | null {
  const bboxes: Record<string, string> = {
    'Apodaca': '25.70,-100.30,25.85,-100.10',
    'Monterrey': '25.58,-100.42,25.80,-100.20',
    'Santa Catarina': '25.60,-100.55,25.75,-100.38',
    'García': '25.70,-100.65,25.90,-100.42',
    'General Escobedo': '25.75,-100.42,25.88,-100.28',
    'Ciénega de Flores': '25.88,-100.25,26.02,-100.10',
    'Guadalupe': '25.62,-100.28,25.72,-100.15',
    'San Nicolás de los Garza': '25.70,-100.32,25.78,-100.22',
    'Salinas Victoria': '25.90,-100.38,26.05,-100.20',
    'Pesquería': '25.70,-100.10,25.90,-99.85',
    'El Carmen': '25.80,-100.45,25.92,-100.25',
    'San Pedro Garza García': '25.60,-100.42,25.68,-100.32',
    'Juárez': '25.60,-100.15,25.72,-99.95',
  }
  return bboxes[municipio] || null
}

async function main() {
  // Get all parks from Supabase (excluding García which is already verified)
  const { data: parks, error } = await supabase
    .from('parques_industriales')
    .select('*')
    .neq('municipio', 'García')
    .order('municipio')
  
  if (error || !parks) {
    console.error('Error fetching parks:', error)
    return
  }
  
  console.log(`\n🔍 Fixing coordinates for ${parks.length} parks (excluding García)\n`)
  
  let fixed = 0
  let failed = 0
  
  for (const park of parks) {
    process.stdout.write(`📍 ${park.nombre} (${park.municipio})... `)
    
    // Try Nominatim first
    let coords = await geocodeNominatim(park.nombre, park.municipio)
    let source = 'Nominatim'
    
    // If not found, try Overpass
    if (!coords) {
      coords = await geocodeOverpass(park.nombre, park.municipio)
      source = 'Overpass'
    }
    
    // If found and significantly different from current, update
    if (coords) {
      const dist = Math.sqrt(
        Math.pow(coords.lat - park.lat, 2) + Math.pow(coords.lng - park.lng, 2)
      )
      
      if (dist > 0.005) { // More than ~500m difference
        const { error: updateError } = await supabase
          .from('parques_industriales')
          .update({ lat: coords.lat, lng: coords.lng })
          .eq('id', park.id)
        
        if (!updateError) {
          console.log(`✅ Updated via ${source} (moved ${(dist * 111).toFixed(1)}km)`)
          fixed++
        } else {
          console.log(`❌ Update failed: ${updateError.message}`)
          failed++
        }
      } else {
        console.log(`⏭️ Already close enough`)
      }
    } else {
      console.log(`⚠️ Not found in OSM`)
      failed++
    }
  }
  
  console.log(`\n📊 Results: ${fixed} updated, ${failed} still need manual verification`)
  console.log(`\n🔄 Remaining parks that need manual Google Maps lookup:`)
  
  // List parks that likely have bad coords (duplicate coords within same municipality)
  const { data: allParks } = await supabase
    .from('parques_industriales')
    .select('id, nombre, municipio, lat, lng')
    .neq('municipio', 'García')
    .order('municipio')
  
  if (allParks) {
    const coordMap = new Map<string, typeof allParks>()
    for (const p of allParks) {
      const key = `${p.lat.toFixed(3)},${p.lng.toFixed(3)}`
      if (!coordMap.has(key)) coordMap.set(key, [])
      coordMap.get(key)!.push(p)
    }
    
    let dupeCount = 0
    for (const [coord, parks] of coordMap) {
      if (parks.length > 1) {
        console.log(`\n  📌 ${coord} (${parks.length} parks stacked):`)
        for (const p of parks) {
          console.log(`     - [${p.id}] ${p.nombre} (${p.municipio})`)
          dupeCount++
        }
      }
    }
    console.log(`\n⚠️ ${dupeCount} parks with duplicate coordinates need manual fix`)
  }
}

main().catch(console.error)
