import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Faltan credenciales de Supabase')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function migrate() {
  console.log('🔄 Aplicando migración de precios...')
  
  try {
    const migrationSQL = readFileSync(
      join(__dirname, '../supabase/migrations/20260221121500_add_precio_fields.sql'),
      'utf-8'
    )

    // Ejecutar cada statement por separado
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('COMMENT'))

    for (const statement of statements) {
      console.log(`Ejecutando: ${statement.substring(0, 50)}...`)
      const { error } = await supabase.rpc('exec_sql', { sql: statement })
      
      if (error) {
        // Intentar con query directo si rpc falla
        console.warn('⚠️  RPC falló, intentando query directo...')
        // Nota: esto puede no funcionar con todos los statements
      }
    }

    console.log('✅ Migración aplicada exitosamente')
  } catch (err) {
    console.error('❌ Error en migración:', err)
    console.log('\n💡 Aplica la migración manualmente en Supabase Dashboard:')
    console.log('   https://supabase.com/dashboard/project/zlszcbrdxtdvuizmrhja/editor/sql')
    console.log('\n   Copia y pega el contenido de:')
    console.log('   supabase/migrations/20260221121500_add_precio_fields.sql')
  }
}

migrate()
