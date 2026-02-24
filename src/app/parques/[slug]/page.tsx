import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase-server'
import { slugifyParque, getMunicipioSlug } from '@/lib/municipio-utils'
import { Parque } from '@/types/parque'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

export async function generateStaticParams() {
  const { data } = await supabaseServer.from('parques_industriales').select('*')
  const parques = (data || []) as Parque[]
  return parques.map(p => ({ slug: slugifyParque(p.nombre) }))
}

async function getParque(slug: string): Promise<Parque | null> {
  const { data } = await supabaseServer.from('parques_industriales').select('*')
  const parques = (data || []) as Parque[]
  return parques.find(p => slugifyParque(p.nombre) === slug) || null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const parque = await getParque(slug)
  if (!parque) return { title: 'Parque no encontrado' }

  const precioText = parque.renta_usd_m2_min
    ? ` Renta: $${parque.renta_usd_m2_min}–$${parque.renta_usd_m2_max} USD/m²/mes.`
    : ''

  const desc = `${parque.nombre} — Parque ${parque.tipo.toLowerCase()} en ${parque.municipio}, NL.${precioText}${parque.desarrolladora ? ` Desarrollado por ${parque.desarrolladora}.` : ''} Datos, precios y ubicación.`

  return {
    title: `${parque.nombre} — ${parque.municipio}, NL`,
    description: desc,
    keywords: [
      parque.nombre,
      `${parque.nombre} precios`,
      `parque industrial ${parque.municipio}`,
      `nave industrial ${parque.municipio}`,
      parque.desarrolladora || '',
      'nearshoring Monterrey',
    ].filter(Boolean),
    openGraph: {
      title: parque.nombre,
      description: desc,
      type: 'website',
      locale: 'es_MX',
      images: [{
        url: `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-s+002D63(${parque.lng},${parque.lat})/${parque.lng},${parque.lat},13,0/1200x630@2x?access_token=${MAPBOX_TOKEN}`,
        width: 1200,
        height: 630,
        alt: `Mapa de ${parque.nombre}`,
      }],
    },
    alternates: {
      canonical: `https://elnortedelpais.com/parques/${slug}`,
    },
  }
}

export default async function ParquePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const parque = await getParque(slug)
  if (!parque) notFound()

  const muniSlug = getMunicipioSlug(parque.municipio)
  const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-s+002D63(${parque.lng},${parque.lat})/${parque.lng},${parque.lat},14,0/800x400@2x?access_token=${MAPBOX_TOKEN}`

  // Get other parks in same municipio for related links
  const { data: relatedData } = await supabaseServer
    .from('parques_industriales')
    .select('*')
    .eq('municipio', parque.municipio)
    .neq('id', parque.id)
    .order('nombre')
    .limit(6)
  const related = (relatedData || []) as Parque[]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: parque.nombre,
    description: parque.descripcion || `Parque ${parque.tipo.toLowerCase()} en ${parque.municipio}, Nuevo León`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: parque.municipio,
      addressRegion: 'Nuevo León',
      addressCountry: 'MX',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: parque.lat,
      longitude: parque.lng,
    },
    ...(parque.renta_usd_m2_min && {
      priceRange: `$${parque.renta_usd_m2_min}–$${parque.renta_usd_m2_max} USD/m²/mes`,
    }),
    url: `https://elnortedelpais.com/parques/${slug}`,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
        {/* Breadcrumb */}
        <nav className="text-[11px] uppercase tracking-wider text-gray-400 mb-6">
          <Link href="/mapa-parques" className="hover:text-[#002D63] transition-colors">Mapa de Parques</Link>
          <span className="mx-2">/</span>
          <Link href={`/mapa-parques/${muniSlug}`} className="hover:text-[#002D63] transition-colors">{parque.municipio}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{parque.nombre}</span>
        </nav>

        {/* Header */}
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          {parque.nombre}
        </h1>
        <p className="text-gray-500 text-lg mb-8">
          {parque.municipio}, Nuevo León
          {parque.desarrolladora && <> · {parque.desarrolladora}</>}
          {' · '}{parque.tipo}
        </p>

        {/* Static map */}
        <div className="rounded-lg overflow-hidden border border-gray-200 mb-8">
          <Image
            src={staticMapUrl}
            alt={`Ubicación de ${parque.nombre} en ${parque.municipio}, NL`}
            width={800}
            height={400}
            className="w-full h-auto"
            unoptimized
          />
        </div>

        {/* Key data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {/* Prices */}
          {(parque.renta_usd_m2_min || parque.venta_mxn_m2_min) && (
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-5">
              <h2 className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-4">Precios</h2>
              {parque.renta_usd_m2_min && (
                <div className="mb-3">
                  <div className="text-sm text-gray-500 mb-0.5">Renta</div>
                  <div className="text-xl font-bold text-[#002D63]">
                    ${parque.renta_usd_m2_min}–${parque.renta_usd_m2_max} USD/m²/mes
                  </div>
                </div>
              )}
              {parque.venta_mxn_m2_min && (
                <div>
                  <div className="text-sm text-gray-500 mb-0.5">Venta de lotes</div>
                  <div className="text-xl font-bold text-[#D35400]">
                    ${parque.venta_mxn_m2_min.toLocaleString()}–${(parque.venta_mxn_m2_max || 0).toLocaleString()} MXN/m²
                  </div>
                </div>
              )}
              {parque.precio_confianza && parque.precio_confianza !== 'sin_dato' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className={`text-xs px-2 py-1 rounded ${
                    parque.precio_confianza === 'verificado'
                      ? 'bg-green-50 text-green-700 border border-green-100'
                      : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {parque.precio_confianza === 'verificado' ? 'Precio verificado' : 'Precio estimado'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Details */}
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-5">
            <h2 className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-4">Datos del parque</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Tipo</dt>
                <dd className="font-medium text-gray-900">{parque.tipo}</dd>
              </div>
              {parque.ocupacion_pct !== null && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Ocupación</dt>
                  <dd className="font-medium text-gray-900">{parque.ocupacion_pct}%</dd>
                </div>
              )}
              {parque.hectareas && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Superficie</dt>
                  <dd className="font-medium text-gray-900">{parque.hectareas} ha</dd>
                </div>
              )}
              {parque.año_fundacion && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Año de fundación</dt>
                  <dd className="font-medium text-gray-900">{parque.año_fundacion}</dd>
                </div>
              )}
              {parque.desarrolladora && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Desarrolladora</dt>
                  <dd className="font-medium text-gray-900">{parque.desarrolladora}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-500">Coordenadas</dt>
                <dd className="font-medium text-gray-900 text-xs tabular-nums">{parque.lat.toFixed(4)}, {parque.lng.toFixed(4)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Description */}
        {parque.descripcion && (
          <div className="mb-10">
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-3">Acerca de {parque.nombre}</h2>
            <p className="text-gray-600 leading-relaxed">{parque.descripcion}</p>
          </div>
        )}

        {/* Occupancy bar */}
        {parque.ocupacion_pct !== null && (
          <div className="mb-10 bg-gray-50 border border-gray-100 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Nivel de ocupación</h2>
              <span className="text-lg font-bold text-[#002D63]">{parque.ocupacion_pct}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#002D63] h-2 rounded-full transition-all" style={{ width: `${parque.ocupacion_pct}%` }} />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {(parque.ocupacion_pct || 100) < 95
                ? 'Este parque tiene espacio disponible para nuevos inquilinos.'
                : 'Este parque tiene alta ocupación. Disponibilidad limitada.'}
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="bg-[#002D63] text-white rounded-lg p-6 sm:p-8 mb-10 text-center">
          <h2 className="font-serif text-xl sm:text-2xl font-bold mb-2">¿Buscas espacio en {parque.municipio}?</h2>
          <p className="text-white/80 mb-4 text-sm">Contáctanos para obtener información actualizada sobre disponibilidad y precios.</p>
          <a href="mailto:contacto@elnortedelpais.com" className="inline-block bg-white text-[#002D63] font-medium px-6 py-2.5 rounded text-sm hover:bg-gray-100 transition-colors">
            Solicitar información
          </a>
        </div>

        {/* Related parks */}
        {related && related.length > 0 && (
          <div>
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">
              Otros parques en {parque.municipio}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {related.map(r => (
                <Link
                  key={r.nombre}
                  href={`/parques/${slugifyParque(r.nombre)}`}
                  className="border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 hover:border-[#002D63] hover:text-[#002D63] transition-colors"
                >
                  {r.nombre}
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link href={`/mapa-parques/${muniSlug}`} className="text-sm text-[#002D63] font-medium hover:underline">
                Ver todos los parques en {parque.municipio} →
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
