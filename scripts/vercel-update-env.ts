import { chromium } from 'playwright'
import { readFileSync } from 'fs'
import { writeFileSync } from 'fs'
import { existsSync } from 'fs'

const GOOGLE_EMAIL = process.env.GOOGLE_EMAIL || ''
const GOOGLE_PASSWORD = process.env.GOOGLE_PASSWORD || ''
const SESSION_FILE = '.vercel-session.json'

async function updateVercelEnv() {
  if (!GOOGLE_EMAIL || !GOOGLE_PASSWORD) {
    console.error('❌ Faltan credenciales de Google')
    process.exit(1)
  }

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()

  // Cargar sesión guardada si existe
  if (existsSync(SESSION_FILE)) {
    console.log('📂 Cargando sesión guardada...')
    const session = JSON.parse(readFileSync(SESSION_FILE, 'utf-8'))
    await context.addCookies(session.cookies)
  }

  const page = await context.newPage()

  try {
    console.log('🌐 Abriendo Vercel...')
    await page.goto('https://vercel.com/login')
    await page.waitForLoadState('networkidle')

    // Check si ya está loggeado
    const isLoggedIn = await page.locator('text=Dashboard').isVisible({ timeout: 3000 }).catch(() => false)

    if (!isLoggedIn) {
      console.log('🔐 Haciendo login con Google...')
      
      // Click en "Continue with Google" y capturar popup
      console.log('👆 Click en Continue with Google...')
      const [googlePage] = await Promise.all([
        context.waitForEvent('page', { timeout: 10000 }),
        page.click('button:has-text("Continue with Google")')
      ])
      
      console.log('✅ Popup de Google abierto')
      await googlePage.waitForLoadState('networkidle')
      await googlePage.waitForTimeout(1000)

      // Ingresar email en el popup de Google
      console.log('📧 Ingresando email...')
      await googlePage.waitForSelector('input[type="email"]:not([disabled])', { state: 'visible', timeout: 10000 })
      await googlePage.fill('input[type="email"]', GOOGLE_EMAIL)
      await googlePage.press('input[type="email"]', 'Enter')
      await googlePage.waitForLoadState('networkidle')
      await googlePage.waitForTimeout(2000)

      // Ingresar password
      console.log('🔑 Ingresando contraseña...')
      await googlePage.waitForSelector('input[type="password"]', { state: 'visible', timeout: 10000 })
      await googlePage.fill('input[type="password"]', GOOGLE_PASSWORD)
      await googlePage.press('input[type="password"]', 'Enter')
      await googlePage.waitForTimeout(5000)
      
      // El popup se cierra automáticamente después del login
      console.log('⏳ Esperando cierre de popup...')
      await googlePage.waitForEvent('close', { timeout: 10000 }).catch(() => console.log('Popup no se cerró, continuando...'))
      await page.waitForTimeout(3000)

      // Guardar sesión
      console.log('💾 Guardando sesión...')
      const cookies = await context.cookies()
      writeFileSync(SESSION_FILE, JSON.stringify({ cookies }, null, 2))
      console.log('✅ Sesión guardada\n')
    } else {
      console.log('✅ Ya estaba loggeado\n')
    }

    // Navegar al proyecto
    console.log('📂 Navegando a elnortedelpais...')
    await page.goto('https://vercel.com/marcelos-projects-3499b825/elnortedelpais.com/settings/environment-variables')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // Actualizar variables
    const envVars = [
      {
        key: 'NEXT_PUBLIC_SUPABASE_URL',
        value: 'https://hundvoktbytghabtnquh.supabase.co'
      },
      {
        key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bmR2b2t0Ynl0Z2hhYnRucXVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2OTY2MTIsImV4cCI6MjA4NzI3MjYxMn0.pV66RbpPMxcUqMYz6E-yx9lxzj79TI3jBsTE6cMKWOo'
      },
      {
        key: 'SUPABASE_SERVICE_ROLE_KEY',
        value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bmR2b2t0Ynl0Z2hhYnRucXVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY5NjYxMiwiZXhwIjoyMDg3MjcyNjEyfQ.wo8bjRFD5-3ddYawdrIBFTZWavMo1G4HikH39qByAhw'
      }
    ]

    for (const envVar of envVars) {
      console.log(`🔄 Actualizando ${envVar.key}...`)
      
      // Buscar la variable existente por nombre
      const varRow = page.locator(`tr:has-text("${envVar.key}")`).first()
      const exists = await varRow.isVisible({ timeout: 2000 }).catch(() => false)

      if (exists) {
        // Editar existente
        await varRow.locator('button:has-text("Edit"), button[aria-label="Edit"]').first().click()
        await page.waitForTimeout(1000)
        await page.fill('input[type="text"], textarea', envVar.value)
        await page.click('button:has-text("Save")')
        await page.waitForTimeout(1500)
      } else {
        // Crear nueva
        await page.click('button:has-text("Add New")')
        await page.waitForTimeout(1000)
        await page.fill('input[placeholder="Key"]', envVar.key)
        await page.fill('input[placeholder="Value"], textarea', envVar.value)
        await page.click('button:has-text("Save")')
        await page.waitForTimeout(1500)
      }
      
      console.log(`✅ ${envVar.key} actualizada`)
    }

    console.log('\n🎉 Variables de entorno actualizadas exitosamente')
    console.log('📝 Recuerda hacer redeploy o espera al próximo push')

  } catch (error: any) {
    console.error('❌ Error:', error.message)
    
    // Screenshot para debug
    await page.screenshot({ path: 'vercel-error.png', fullPage: true })
    console.log('📸 Screenshot guardado en vercel-error.png')
    
    throw error
  } finally {
    await browser.close()
  }
}

updateVercelEnv()
