import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function updateLocations() {
  console.log('🔄 Actualizando ubicaciones corregidas...\n')
  
  const ubicaciones = JSON.parse(readFileSync('./data/ubicaciones-corregidas.json', 'utf-8'))
  
  for (const ubicacion of ubicaciones) {
    console.log(`📍 ${ubicacion.nombre}`)
    console.log(`   ${ubicacion.lat}, ${ubicacion.lng}`)
    console.log(`   Municipio: ${ubicacion.municipio}`)
    console.log(`   Ref: ${ubicacion.referencia}`)
    
    const { error } = await supabase
      .from('parques_industriales')
      .update({
        lat: ubicacion.lat,
        lng: ubicacion.lng,
        municipio: ubicacion.municipio
      })
      .eq('id', ubicacion.id)
    
    if (error) {
      console.error(`   ❌ Error: ${error.message}`)
    } else {
      console.log(`   ✅ Actualizado`)
    }
    
    console.log()
  }
  
  console.log('🎉 Ubicaciones actualizadas')
}

updateLocations()
