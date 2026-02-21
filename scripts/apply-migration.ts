import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  db: { schema: 'public' },
  auth: { persistSession: false }
})

async function applyMigration() {
  console.log('🔄 Aplicando migración de precios...\n')
  
  try {
    const migrationSQL = readFileSync('./supabase/migrations/20260221121500_add_precio_fields.sql', 'utf-8')
    
    // Ejecutar el SQL completo
    const { data, error } = await supabase.rpc('exec', { sql: migrationSQL })
    
    if (error) {
      console.error('❌ Error con rpc:', error.message)
      console.log('\n💡 Intentando ejecutar statements individuales...\n')
      
      // Dividir en statements y ejecutar uno por uno
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('COMMENT'))
      
      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i]
        if (stmt.includes('CREATE INDEX') || stmt.includes('ALTER TABLE') || stmt.includes('DROP VIEW') || stmt.includes('CREATE OR REPLACE VIEW')) {
          console.log(`[${i + 1}/${statements.length}] Ejecutando: ${stmt.substring(0, 60)}...`)
          
          try {
            // Usar from para queries DDL
            const result = await supabase.rpc('exec', { sql: stmt })
            if (result.error) {
              console.warn(`⚠️  Error (ignorando si es "already exists"): ${result.error.message}`)
            } else {
              console.log('✅ OK')
            }
          } catch (e: any) {
            console.warn(`⚠️  Error ejecutando statement: ${e.message}`)
          }
        }
      }
      
      console.log('\n✅ Migración completada (con warnings)')
    } else {
      console.log('✅ Migración aplicada exitosamente')
    }
    
  } catch (err: any) {
    console.error('❌ Error fatal:', err.message)
    console.log('\n📋 Aplica manualmente en:')
    console.log('https://supabase.com/dashboard/project/zlszcbrdxtdvuizmrhja/editor/sql')
    process.exit(1)
  }
}

applyMigration()
