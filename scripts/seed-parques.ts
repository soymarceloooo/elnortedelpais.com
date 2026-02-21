import { createClient } from '@supabase/supabase-js'
import parques from '../data/parques-industriales.json'

// Necesitas obtener estas credenciales de Supabase
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Faltan credenciales de Supabase en .env.local')
  console.log('\n📋 Obtén tus credenciales en:')
  console.log('   https://supabase.com/dashboard/project/zlszcbrdxtdvuizmrhja/settings/api')
  console.log('\n📝 Agrégalas a .env.local:')
  console.log('   NEXT_PUBLIC_SUPABASE_URL=https://...')
  console.log('   SUPABASE_SERVICE_ROLE_KEY=eyJ...')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function seedParques() {
  console.log('🌱 Importando parques industriales...')
  
  // Primero limpia la tabla
  const { error: deleteError } = await supabase
    .from('parques_industriales')
    .delete()
    .neq('id', 0) // Borra todo

  if (deleteError) {
    console.error('⚠️  Error limpiando tabla:', deleteError.message)
  } else {
    console.log('✅ Tabla limpiada')
  }

  // Inserta los parques
  const { data, error } = await supabase
    .from('parques_industriales')
    .insert(parques.map(p => ({
      nombre: p.nombre,
      municipio: p.municipio,
      desarrolladora: p.desarrolladora,
      lat: p.lat,
      lng: p.lng,
      hectareas: p.hectareas,
      ocupacion_pct: p.ocupacion_pct,
      tipo: p.tipo,
      año_fundacion: p.año_fundacion,
      descripcion: p.descripcion
    })))
    .select()

  if (error) {
    console.error('❌ Error importando:', error.message)
    process.exit(1)
  }

  console.log(`✅ ${data?.length || 0} parques importados exitosamente!`)
  console.log('\n📍 Parques en la base de datos:')
  data?.forEach(p => {
    console.log(`   • ${p.nombre} (${p.desarrolladora || 'Sin desarrolladora'})`)
  })
}

seedParques()
