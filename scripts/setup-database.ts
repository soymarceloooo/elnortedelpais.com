import { Client } from 'pg'
import { readFileSync } from 'fs'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD || ''

const projectRef = SUPABASE_URL.match(/https:\/\/(.+?)\.supabase\.co/)?.[1]

if (!projectRef || !DB_PASSWORD) {
  console.error('❌ Faltan credenciales')
  process.exit(1)
}

// Usar direct connection (puerto 5432) en lugar de pooler para DDL
const connectionString = `postgresql://postgres:${DB_PASSWORD}@db.${projectRef}.supabase.co:5432/postgres`

async function setupDatabase() {
  const client = new Client({ connectionString })
  
  try {
    console.log('🔌 Conectando a Supabase...')
    await client.connect()
    console.log('✅ Conectado a:', projectRef, '\n')
    
    // Migración 1: Crear tabla base
    console.log('📖 [1/2] Aplicando migración base...')
    const migration1 = readFileSync('./supabase/migrations/20260221035828_create_parques_industriales.sql', 'utf-8')
    await client.query(migration1)
    console.log('✅ Tabla parques_industriales creada\n')
    
    // Migración 2: Agregar campos de precios
    console.log('📖 [2/2] Aplicando migración de precios...')
    const migration2 = readFileSync('./supabase/migrations/20260221121500_add_precio_fields.sql', 'utf-8')
    await client.query(migration2)
    console.log('✅ Campos de precios agregados\n')
    
    console.log('🎉 Base de datos configurada exitosamente\n')
    console.log('Siguiente paso: npm run seed:parques')
    
  } catch (err: any) {
    if (err.message.includes('already exists')) {
      console.log('⚠️  La tabla ya existe, continuando...')
      
      // Intentar solo la migración de precios
      console.log('\n📖 Aplicando solo migración de precios...')
      try {
        const migration2 = readFileSync('./supabase/migrations/20260221121500_add_precio_fields.sql', 'utf-8')
        await client.query(migration2)
        console.log('✅ Campos de precios agregados\n')
      } catch (e: any) {
        if (e.message.includes('already exists') || e.message.includes('duplicate')) {
          console.log('✅ Los campos ya existen, todo listo\n')
        } else {
          throw e
        }
      }
    } else {
      console.error('❌ Error:', err.message)
      process.exit(1)
    }
  } finally {
    await client.end()
  }
}

setupDatabase()
