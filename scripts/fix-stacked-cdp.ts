import { createClient } from '@supabase/supabase-js'
import { chromium } from 'playwright'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || ''
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Parks that are stacked (duplicate coords) - need individual Google Maps lookup
const STACKED = [
  // Apodaca stacks
  { id: 34, q: 'Parque Industrial Kronos Apodaca Nuevo Leon' },
  { id: 19, q: 'American Industries Apodaca Industrial Park Nuevo Leon' },
  { id: 25, q: 'Intermex Industrial Campus Apodaca Nuevo Leon' },
  { id: 28, q: 'OMA VYNMSA AERO Industrial Park Apodaca Nuevo Leon aeropuerto' },
  { id: 36, q: 'Pocket Park Aeropuerto GP Desarrollos Apodaca Nuevo Leon' },
  { id: 38, q: 'VYNMSA Aeropuerto Apodaca Industrial Park Nuevo Leon' },
  { id: 39, q: 'VYNMSA Apodaca Industrial Park Nuevo Leon' },
  { id: 76, q: 'VYNMSA Acueducto Industrial Park Guadalupe Nuevo Leon' },
  { id: 30, q: 'Parque Industrial Avante Aeropuerto Apodaca Nuevo Leon' },
  { id: 31, q: 'Parque Industrial Avante Apodaca Nuevo Leon' },
  { id: 41, q: 'Prologis Park Apodaca Nuevo Leon' },
  { id: 22, q: 'Apodaca Technology Park PIIT Nuevo Leon' },
  { id: 18, q: 'Northwest Logistic Center Apodaca Nuevo Leon' },
  { id: 23, q: 'CPA Business Center Apodaca Nuevo Leon' },
  { id: 27, q: 'Monterrey Business Park Apodaca Nuevo Leon' },
  { id: 32, q: 'Parque Industrial Davisa Apodaca Nuevo Leon' },
  // Escobedo stacks
  { id: 62, q: 'CPA Logistics Center Escobedo Nuevo Leon' },
  { id: 66, q: 'VYNMSA Escobedo Park Nuevo Leon' },
  { id: 67, q: 'VYNMSA Escobedo Park II Nuevo Leon' },
  // Juárez stacks
  { id: 89, q: 'Parque Industrial Juárez Nuevo Leon' },
  { id: 90, q: 'Parque Industrial Juárez II Nuevo Leon Garcia' },
  // Santa Catarina stacks
  { id: 57, q: 'Parque Industrial FINSA Santa Catarina Nuevo Leon' },
  { id: 58, q: 'Parque Industrial FINSA Santa Catarina II Nuevo Leon' },
]

async function main() {
  console.log(`\n🔍 Fixing ${STACKED.length} stacked parks via Chrome CDP...\n`)
  
  // Connect to existing OpenClaw browser via CDP
  const browser = await chromium.connectOverCDP('http://127.0.0.1:18800')
  const contexts = browser.contexts()
  const context = contexts[0]
  const pages = context.pages()
  const page = pages[0] || await context.newPage()
  
  let updated = 0
  let failed = 0
  
  for (const park of STACKED) {
    process.stdout.write(`📍 [${park.id}] ${park.q.substring(0, 50)}... `)
    
    try {
      const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(park.q)}`
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 })
      await page.waitForTimeout(3000)
      
      // Extract coords from page URL or links
      const result = await page.evaluate(() => {
        // First check URL
        const urlMatch = window.location.href.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
        if (urlMatch) {
          return { lat: parseFloat(urlMatch[1]), lng: parseFloat(urlMatch[2]) }
        }
        
        // Check links for !3d...!4d... pattern
        const links = document.querySelectorAll('a[href]') as NodeListOf<HTMLAnchorElement>
        for (const l of links) {
          const m = l.href.match(/3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/)
          if (m) {
            const lat = parseFloat(m[1])
            const lng = parseFloat(m[2])
            if (lat > 25.0 && lat < 27.0 && lng > -101.0 && lng < -99.5) {
              return { lat, lng }
            }
          }
        }
        
        // Check data-url attributes
        const elements = document.querySelectorAll('[data-url]') as NodeListOf<HTMLElement>
        for (const el of elements) {
          const dataUrl = el.getAttribute('data-url') || ''
          const m = dataUrl.match(/3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/)
          if (m) {
            return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) }
          }
        }
        
        return null
      })
      
      if (result && result.lat > 25.0 && result.lat < 27.0) {
        const { error } = await supabase
          .from('parques_industriales')
          .update({ lat: result.lat, lng: result.lng })
          .eq('id', park.id)
        
        if (!error) {
          console.log(`✅ ${result.lat.toFixed(5)}, ${result.lng.toFixed(5)}`)
          updated++
        } else {
          console.log(`❌ DB error`)
          failed++
        }
      } else {
        console.log(`⚠️ No valid coords found`)
        failed++
      }
    } catch (err: any) {
      console.log(`❌ ${err.message?.substring(0, 50)}`)
      failed++
    }
  }
  
  await browser.close()
  
  console.log(`\n📊 Results: ${updated} updated, ${failed} failed`)
  
  // Final check
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
      if (parks.length > 1) {
        dupes += parks.length
      }
    }
    console.log(`\n📍 Total stacked remaining: ${dupes}`)
    if (dupes > 0) {
      for (const [coord, parks] of coordMap) {
        if (parks.length > 1) {
          console.log(`  ${coord}: ${parks.map((p: any) => `[${p.id}] ${p.nombre}`).join(', ')}`)
        }
      }
    }
  }
}

main().catch(console.error)
