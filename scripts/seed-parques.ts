import { createClient } from '@supabase/supabase-js'
import parquesData from '../data/parques-industriales.json'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno de Supabase')
  console.log('Asegúrate de tener en .env.local:')
  console.log('  NEXT_PUBLIC_SUPABASE_URL')
  console.log('  SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
  console.log('🌱 Seeding parques industriales...')
  console.log(`📊 Total a importar: ${parquesData.length} parques`)
  
  // Limpiar tabla primero
  const { error: deleteError } = await supabase
    .from('parques_industriales')
    .delete()
    .neq('id', 0)
  
  if (deleteError) {
    console.error('❌ Error limpiando tabla:', deleteError)
  } else {
    console.log('✅ Tabla limpiada')
  }
  
  // Insertar datos
  const { data, error } = await supabase
    .from('parques_industriales')
    .insert(parquesData)
    .select()
  
  if (error) {
    console.error('❌ Error insertando datos:', error)
    process.exit(1)
  }
  
  console.log(`✅ ${data?.length || 0} parques importados exitosamente`)
  console.log('')
  console.log('Parques por tipo:')
  const tipos = data?.reduce((acc: any, p: any) => {
    acc[p.tipo] = (acc[p.tipo] || 0) + 1
    return acc
  }, {})
  console.log(tipos)
  
  console.log('')
  console.log('Parques por desarrolladora:')
  const devs = data?.reduce((acc: any, p: any) => {
    const dev = p.desarrolladora || 'Independiente'
    acc[dev] = (acc[dev] || 0) + 1
    return acc
  }, {})
  console.log(devs)
}

seed()
  .then(() => {
    console.log('')
    console.log('🎉 Seed completado!')
    process.exit(0)
  })
  .catch(err => {
    console.error('❌ Error:', err)
    process.exit(1)
  })
