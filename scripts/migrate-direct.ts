import { Client } from 'pg'
import { readFileSync } from 'fs'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD || ''

// Extraer el project ref de la URL
const projectRef = SUPABASE_URL.match(/https:\/\/(.+?)\.supabase\.co/)?.[1]

if (!projectRef || !DB_PASSWORD) {
  console.error('❌ Faltan credenciales')
  console.error('Project ref:', projectRef)
  console.error('DB Password:', DB_PASSWORD ? '✓' : '✗')
  process.exit(1)
}

// Connection string para Supabase (usando el pooler en modo transaction)
const connectionString = `postgresql://postgres.${projectRef}:${DB_PASSWORD}@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true`

async function migrate() {
  const client = new Client({ connectionString })
  
  try {
    console.log('🔌 Conectando a Supabase...')
    await client.connect()
    console.log('✅ Conectado\n')
    
    console.log('📖 Leyendo migración...')
    const migrationSQL = readFileSync('./supabase/migrations/20260221121500_add_precio_fields.sql', 'utf-8')
    
    console.log('🔄 Aplicando migración...\n')
    
    // Ejecutar el SQL
    const result = await client.query(migrationSQL)
    
    console.log('✅ Migración aplicada exitosamente\n')
    console.log(result)
    
  } catch (err: any) {
    console.error('❌ Error:', err.message)
    
    if (err.message.includes('already exists') || err.message.includes('duplicate')) {
      console.log('\n⚠️  Algunos campos ya existen (esto es normal)')
      console.log('✅ Continuando...\n')
    } else {
      console.log('\n📋 Si falla, aplica manualmente en:')
      console.log('https://supabase.com/dashboard/project/zlszcbrdxtdvuizmrhja/editor/sql')
      process.exit(1)
    }
  } finally {
    await client.end()
  }
}

migrate()
