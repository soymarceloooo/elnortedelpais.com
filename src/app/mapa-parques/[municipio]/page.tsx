import { Metadata } from 'next'
import Link from 'next/link'
import { supabaseServer } from '@/lib/supabase-server'
import { MUNICIPIOS, getMunicipioBySlug, slugifyParque } from '@/lib/municipio-utils'
import { Parque } from '@/types/parque'
import MapaParquesLoader from '@/components/MapaParquesLoader'

export async function generateStaticParams() {
  return MUNICIPIOS.map(m => ({ municipio: m.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ municipio: string }> }): Promise<Metadata> {
  const { municipio: slug } = await params
  const muni = getMunicipioBySlug(slug)
  if (!muni) return { title: 'Municipio no encontrado' }

  const { data } = await supabaseServer
    .from('parques_industriales')
    .select('*')
    .eq('municipio', muni.nombre)

  const parques = (data || []) as Parque[]
  const count = parques.length
  const conRenta = parques.filter(p => p.renta_usd_m2_min)
  const rentaAvg = conRenta.length > 0
    ? (conRenta.reduce((s, p) => s + ((p.renta_usd_m2_min || 0) + (p.renta_usd_m2_max || 0)) / 2, 0) / conRenta.length).toFixed(2)
    : null

  const desc = rentaAvg
    ? `${count} parques industriales en ${muni.nombre}, NL. Renta promedio: $${rentaAvg} USD/m²/mes. Precios, disponibilidad y mapa interactivo.`
    : `${count} parques industriales en ${muni.nombre}, Nuevo León. Precios, disponibilidad y mapa interactivo.`

  return {
    title: `Parques Industriales en ${muni.nombre}, NL — Precios y Disponibilidad`,
    description: desc,
    keywords: [
      `parques industriales ${muni.nombre}`,
      `naves industriales ${muni.nombre}`,
      `terrenos industriales ${muni.nombre} Nuevo León`,
      `renta nave industrial ${muni.nombre}`,
      'nearshoring Monterrey',
    ],
    openGraph: {
      title: `Parques Industriales en ${muni.nombre}, NL`,
      description: desc,
      type: 'website',
      locale: 'es_MX',
    },
    alternates: {
      canonical: `https://elnortedelpais.com/mapa-parques/${slug}`,
    },
  }
}

function computeStats(parques: Parque[]) {
  const conRenta = parques.filter(p => p.renta_usd_m2_min)
  const conVenta = parques.filter(p => p.venta_mxn_m2_min)
  const conOcupacion = parques.filter(p => p.ocupacion_pct)

  return {
    total: parques.length,
    conEspacio: parques.filter(p => (p.ocupacion_pct || 100) < 95).length,
    rentaAvg: conRenta.length > 0
      ? (conRenta.reduce((s, p) => s + ((p.renta_usd_m2_min || 0) + (p.renta_usd_m2_max || 0)) / 2, 0) / conRenta.length).toFixed(2)
      : null,
    ventaAvg: conVenta.length > 0
      ? Math.round(conVenta.reduce((s, p) => s + ((p.venta_mxn_m2_min || 0) + (p.venta_mxn_m2_max || 0)) / 2, 0) / conVenta.length)
      : null,
    ocupacionAvg: conOcupacion.length > 0
      ? Math.round(conOcupacion.reduce((s, p) => s + (p.ocupacion_pct || 0), 0) / conOcupacion.length)
      : null,
  }
}

export default async function MunicipioPage({ params }: { params: Promise<{ municipio: string }> }) {
  const { municipio: slug } = await params
  const muni = getMunicipioBySlug(slug)

  if (!muni) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-serif font-bold mb-4">Municipio no encontrado</h1>
        <Link href="/mapa-parques" className="text-[#002D63] underline">Ver todos los parques</Link>
      </div>
    )
  }

  const { data: parques } = await supabaseServer
    .from('parques_industriales')
    .select('*')
    .eq('municipio', muni.nombre)
    .order('nombre')

  const parks = (parques || []) as Parque[]
  const stats = computeStats(parks)
  const otherMunicipios = MUNICIPIOS.filter(m => m.slug !== slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Parques Industriales en ${muni.nombre}, Nuevo León`,
    description: `Directorio de ${stats.total} parques industriales en ${muni.nombre}, NL`,
    numberOfItems: stats.total,
    itemListElement: parks.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        '@id': `https://elnortedelpais.com/parques/${slugifyParque(p.nombre)}`,
        name: p.nombre,
        address: {
          '@type': 'PostalAddress',
          addressLocality: muni.nombre,
          addressRegion: 'Nuevo León',
          addressCountry: 'MX',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: p.lat,
          longitude: p.lng,
        },
      },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Map */}
      <MapaParquesLoader initialMunicipio={muni.nombre} />

      {/* SEO Content */}
      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-16">
        {/* Breadcrumb */}
        <nav className="text-[11px] uppercase tracking-wider text-gray-400 mb-6">
          <Link href="/mapa-parques" className="hover:text-[#002D63] transition-colors">Mapa de Parques</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{muni.nombre}</span>
        </nav>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Parques Industriales en {muni.nombre}, Nuevo León
        </h1>

        <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-3xl">
          {muni.nombre} cuenta con <strong>{stats.total} parques industriales</strong> registrados
          {stats.conEspacio > 0 && <>, de los cuales <strong>{stats.conEspacio} tienen espacio disponible</strong></>}.
          {stats.rentaAvg && <> La renta promedio es de <strong>${stats.rentaAvg} USD/m² al mes</strong>.</>}
          {stats.ventaAvg && <> El precio de venta promedio de lotes industriales es de <strong>${stats.ventaAvg.toLocaleString()} MXN/m²</strong>.</>}
          {stats.ocupacionAvg && <> La ocupación promedio de los parques es del <strong>{stats.ocupacionAvg}%</strong>.</>}
        </p>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-[#002D63]">{stats.total}</div>
            <div className="text-[11px] uppercase tracking-wide text-gray-500">Parques</div>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">{stats.conEspacio}</div>
            <div className="text-[11px] uppercase tracking-wide text-gray-500">Con espacio</div>
          </div>
          {stats.rentaAvg && (
            <div className="bg-[#002D63]/5 border border-[#002D63]/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-[#002D63]">${stats.rentaAvg}</div>
              <div className="text-[11px] uppercase tracking-wide text-gray-500">USD/m²/mes</div>
            </div>
          )}
          {stats.ocupacionAvg && (
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
              <div className="text-2xl font-bold text-[#002D63]">{stats.ocupacionAvg}%</div>
              <div className="text-[11px] uppercase tracking-wide text-gray-500">Ocupación</div>
            </div>
          )}
        </div>

        {/* Park listing */}
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">
          Directorio de Parques en {muni.nombre}
        </h2>

        <div className="space-y-4 mb-12">
          {parks.map(p => (
            <Link
              key={p.id}
              href={`/parques/${slugifyParque(p.nombre)}`}
              className="block border border-gray-100 rounded-lg p-4 sm:p-5 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{p.nombre}</h3>
                  <div className="text-sm text-gray-500 space-y-0.5">
                    {p.desarrolladora && <div>{p.desarrolladora}</div>}
                    <div>{p.tipo}</div>
                  </div>
                </div>
                <div className="text-right text-sm shrink-0">
                  {p.renta_usd_m2_min && (
                    <div className="text-[#002D63] font-medium">${p.renta_usd_m2_min}–${p.renta_usd_m2_max} USD/m²</div>
                  )}
                  {p.venta_mxn_m2_min && (
                    <div className="text-[#D35400]">${p.venta_mxn_m2_min.toLocaleString()} MXN/m²</div>
                  )}
                  {p.ocupacion_pct !== null && (
                    <div className="text-gray-400 text-xs mt-1">{p.ocupacion_pct}% ocupado</div>
                  )}
                </div>
              </div>
              {p.descripcion && (
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{p.descripcion}</p>
              )}
            </Link>
          ))}
        </div>

        {/* Other municipalities */}
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">
          Otros municipios del Área Metropolitana
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {otherMunicipios.map(m => (
            <Link
              key={m.slug}
              href={`/mapa-parques/${m.slug}`}
              className="border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 hover:border-[#002D63] hover:text-[#002D63] transition-colors"
            >
              {m.nombre}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
