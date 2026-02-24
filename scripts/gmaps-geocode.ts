import { createClient } from '@supabase/supabase-js'
import { chromium } from 'playwright'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || ''
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const PARKS_TO_FIX = [
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
  { id: 26, nombre: 'Parque Industrial Mezquital', municipio: 'Apodaca' },
  { id: 30, nombre: 'Parque Industrial Avante Aeropuerto', municipio: 'Apodaca' },
  { id: 32, nombre: 'Parque Industrial Davisa Apodaca', municipio: 'Apodaca' },
  { id: 34, nombre: 'Parque Industrial Kronos', municipio: 'Apodaca' },
  { id: 50, nombre: 'Parque Industrial Nexxus Apodaca I', municipio: 'Monterrey' },
  { id: 38, nombre: 'VYNMSA Aeropuerto Apodaca', municipio: 'Apodaca' },
  { id: 39, nombre: 'VYNMSA Apodaca Industrial Park', municipio: 'Apodaca' },
  { id: 68, nombre: 'CPA Logistics Center ADN', municipio: 'Ciénega de Flores' },
  { id: 72, nombre: 'Terra Park ADN', municipio: 'Ciénega de Flores' },
  { id: 71, nombre: 'Pocket Park Norte', municipio: 'Ciénega de Flores' },
  { id: 85, nombre: 'CIP El Carmen', municipio: 'El Carmen' },
  { id: 86, nombre: 'GTP El Carmen Industrial Park', municipio: 'El Carmen' },
  { id: 63, nombre: 'GP Escobedo Industrial Park', municipio: 'General Escobedo' },
  { id: 67, nombre: 'VYNMSA Escobedo Park II', municipio: 'General Escobedo' },
  { id: 65, nombre: 'Pocket Park Escobedo', municipio: 'General Escobedo' },
  { id: 62, nombre: 'CPA Logistics Center Escobedo', municipio: 'General Escobedo' },
  { id: 64, nombre: 'Parque Industrial Tecnocentro', municipio: 'General Escobedo' },
  { id: 89, nombre: 'Parque Industrial Juárez I', municipio: 'Juárez' },
  { id: 90, nombre: 'Parque Industrial Juárez II', municipio: 'Juárez' },
  { id: 45, nombre: 'Parque Industrial Regio', municipio: 'Monterrey' },
  { id: 74, nombre: 'Parque Industrial Guadalupe', municipio: 'Guadalupe' },
  { id: 73, nombre: 'FINSA Guadalupe Industrial Park', municipio: 'Guadalupe' },
  { id: 75, nombre: 'Vesta Park Guadalupe', municipio: 'Guadalupe' },
  { id: 76, nombre: 'VYNMSA Acueducto Industrial Park', municipio: 'Guadalupe' },
  { id: 53, nombre: 'CIESA Asia Pacific Park', municipio: 'Monterrey' },
  { id: 52, nombre: 'Global Park', municipio: 'Monterrey' },
  { id: 51, nombre: 'Airport Technology Park', municipio: 'Monterrey' },
  { id: 48, nombre: 'ProximityParks Monterrey Centro', municipio: 'Monterrey' },
  { id: 47, nombre: 'Prologis Park Agua Fría', municipio: 'Monterrey' },
  { id: 42, nombre: 'Parque Industrial Avante Monterrey', municipio: 'Monterrey' },
  { id: 80, nombre: 'Interpuerto Monterrey', municipio: 'Salinas Victoria' },
  { id: 82, nombre: 'Stiva Barragán Industrial Park', municipio: 'Pesquería' },
  { id: 84, nombre: 'Parque Industrial Hofusan', municipio: 'Pesquería' },
  { id: 83, nombre: 'VYNMSA Miguel Alemán Industrial Park', municipio: 'Pesquería' },
  { id: 60, nombre: 'Terra Park Santa Catarina', municipio: 'Santa Catarina' },
  { id: 58, nombre: 'FINSA Santa Catarina II', municipio: 'Santa Catarina' },
  { id: 57, nombre: 'FINSA Santa Catarina', municipio: 'Santa Catarina' },
  { id: 56, nombre: 'Martel Industrial Park', municipio: 'Santa Catarina' },
  { id: 59, nombre: 'Stiva Santa Catarina Industrial Park', municipio: 'Santa Catarina' },
  { id: 61, nombre: 'VYNMSA Santa Catarina Industrial Park', municipio: 'Santa Catarina' },
]

async function main() {
  console.log(`🌍 Launching browser to geocode ${PARKS_TO_FIX.length} parks via Google Maps...\n`)
  
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  })
  const page = await context.newPage()
  
  let updated = 0
  let failed = 0
  
  for (const park of PARKS_TO_FIX) {
    const searchQuery = `${park.nombre} ${park.municipio} Nuevo León parque industrial`
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`
    
    process.stdout.write(`📍 [${park.id}] ${park.nombre}... `)
    
    try {
      await page.goto(mapsUrl, { waitUntil: 'domcontentloaded', timeout: 15000 })
      
      // Wait for URL to update with coordinates
      await page.waitForTimeout(3000)
      
      const currentUrl = page.url()
      
      // Try to extract @lat,lng from URL
      const match = currentUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
      
      if (match) {
        const lat = parseFloat(match[1])
        const lng = parseFloat(match[2])
        
        // Verify coordinates are in Nuevo León area
        if (lat > 25.0 && lat < 27.0 && lng > -101.0 && lng < -99.5) {
          const { error } = await supabase
            .from('parques_industriales')
            .update({ lat, lng })
            .eq('id', park.id)
          
          if (!error) {
            console.log(`✅ ${lat.toFixed(5)}, ${lng.toFixed(5)}`)
            updated++
          } else {
            console.log(`❌ DB error: ${error.message}`)
            failed++
          }
        } else {
          console.log(`⚠️ Coords outside NL: ${lat}, ${lng}`)
          failed++
        }
      } else {
        // Try getting coords from page content
        const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 5000))
        const coordMatch = bodyText.match(/(-?\d+\.\d{4,}),\s*(-?\d+\.\d{4,})/)
        if (coordMatch) {
          const lat = parseFloat(coordMatch[1])
          const lng = parseFloat(coordMatch[2])
          if (lat > 25.0 && lat < 27.0 && lng > -101.0 && lng < -99.5) {
            await supabase.from('parques_industriales').update({ lat, lng }).eq('id', park.id)
            console.log(`✅ ${lat.toFixed(5)}, ${lng.toFixed(5)} (from page)`)
            updated++
          } else {
            console.log(`⚠️ No valid coords in URL: ${currentUrl.substring(0, 100)}`)
            failed++
          }
        } else {
          console.log(`⚠️ No coords found`)
          failed++
        }
      }
    } catch (err: any) {
      console.log(`❌ Error: ${err.message?.substring(0, 60)}`)
      failed++
    }
  }
  
  await browser.close()
  
  console.log(`\n📊 Results: ${updated} updated, ${failed} failed`)
  
  // Show remaining duplicates
  const { data: allParks } = await supabase
    .from('parques_industriales')
    .select('id, nombre, municipio, lat, lng')
    .neq('municipio', 'García')
  
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
    console.log(`\n⚠️ Remaining parks with duplicate coords: ${dupes}`)
  }
}

main().catch(console.error)
