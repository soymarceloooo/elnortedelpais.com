# Deployment - El Norte del País

**Fecha de deploy:** 2026-02-20  
**Status:** ✅ En producción

---

## 🌐 URLs

### Producción
- **URL principal:** https://elnortedelpaiscom.vercel.app
- **Dashboard Vercel:** https://vercel.com/marcelos-projects-3499b825/elnortedelpais.com

### Repositorio
- **GitHub:** https://github.com/soymarceloooo/elnortedelpais.com
- **Branch:** `main`

### Local
- **Dev server:** `npm run dev` → http://localhost:3000
- **Ubicación:** `~/Documents/elnortedelpais.com`

---

## 🚀 Deploy Automático

Vercel está conectado al repo de GitHub:
- ✅ Auto-deploy en push a `main`
- ✅ Preview deploys en PRs
- ✅ Build logs disponibles en dashboard

**Para deployar manualmente:**
```bash
cd ~/Documents/elnortedelpais.com
git add .
git commit -m "tu mensaje"
git push
# Vercel deployará automáticamente
```

**Deploy manual con CLI:**
```bash
vercel --prod --yes
```

---

## 📦 Commits Realizados

### 1. feat: Redesign completo estilo The Economist
- 48 archivos modificados
- Design system completo
- Todos los componentes actualizados
- Documentación (DESIGN_SYSTEM.md, README.md)
- **Commit:** `30274fd`

### 2. chore: Update next-mdx-remote to fix security vulnerability
- Actualización de dependencias
- Fix CVE-2026-0969
- **Commit:** `39b1213`

---

## 📚 Documentación

| Archivo | Descripción |
|---------|-------------|
| `DESIGN_SYSTEM.md` | Sistema de diseño completo (14KB) |
| `REDESIGN-ECONOMIST.md` | Documentación del redesign |
| `README.md` | Guía principal del proyecto |
| `.claude/DESIGN_SYSTEM.md` | Quick reference |
| `DEPLOYMENT.md` | Este archivo |

---

## 🔧 Próximos Pasos

### Opcional - Dominio Custom
Si quieres usar un dominio custom (ej: `elnortedelpais.com`):

1. Comprar dominio en Namecheap/GoDaddy/Cloudflare
2. En Vercel dashboard → Settings → Domains
3. Agregar dominio custom
4. Configurar DNS según instrucciones de Vercel

### Features Pendientes
- [ ] Páginas internas completas (noticias, mercado, propiedades)
- [ ] Sistema de búsqueda
- [ ] Filtros por categoría
- [ ] API de newsletter (integración con Mailchimp/ConvertKit)
- [ ] Analytics (Google Analytics / Vercel Analytics)
- [ ] RSS feed
- [ ] Sitemap XML dinámico

### Content
- [ ] Agregar más artículos en `content/noticias/`
- [ ] Agregar más propiedades en `content/propiedades/`
- [ ] Crear sección "Mercado" con datos actualizados
- [ ] Página "Nosotros" con info del equipo

---

## 🛠️ Comandos Útiles

### Desarrollo
```bash
npm run dev        # Dev server
npm run build      # Build producción
npm start          # Correr build localmente
npm run lint       # Linter
```

### Git
```bash
git status         # Ver cambios
git add .          # Agregar todos
git commit -m ""   # Commit
git push           # Push a GitHub
```

### Vercel
```bash
vercel             # Deploy preview
vercel --prod      # Deploy producción
vercel ls          # Listar deployments
vercel logs        # Ver logs
```

---

## ⚠️ Notas Importantes

### Git Config
Usuario correcto configurado:
```bash
git config user.name "soymarceloooo"
git config user.email "soymarceloooo@gmail.com"
```

### Build Times
- **Build completo:** ~27 segundos
- **Install deps:** ~12 segundos
- **Compile Next.js:** ~7 segundos

### Vulnerabilidades
- ✅ Resuelto: next-mdx-remote actualizado de v5.0.0 a v6.x
- ⚠️ 15 vulnerabilidades restantes en dependencias (no críticas)
  - Para resolver: `npm audit fix`

---

## 📊 Stats

**Páginas generadas:**
- Static: 6 páginas (homepage, nosotros, mercado, etc.)
- SSG: 6 artículos + 1 propiedad
- Dynamic: 2 API routes

**Bundle size:** Ver Vercel dashboard para métricas exactas

---

## 🔗 Enlaces Útiles

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MDX Docs](https://mdxjs.com/)

---

**Última actualización:** 2026-02-20
