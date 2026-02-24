import { Metadata } from 'next'
import Link from 'next/link'
import { supabaseServer } from '@/lib/supabase-server'
import { MUNICIPIOS } from '@/lib/municipio-utils'
import { Parque } from '@/types/parque'
import MapaParquesLoader from '@/components/MapaParquesLoader'

export const metadata: Metadata = {
  title: 'Mapa de Parques Industriales — Área Metropolitana de Monterrey',
  description: 'Mapa interactivo con 84 parques industriales en 13 municipios del AMM. Precios de renta y venta, disponibilidad, ocupación y puntos estratégicos.',
  keywords: [
    'parques industriales Monterrey',
    'mapa parques industriales Nuevo León',
    'naves industriales Monterrey',
    'nearshoring Monterrey',
    'terrenos industriales AMM',
    'renta nave industrial Monterrey',
  ],
  openGraph: {
    title: 'Mapa de Parques Industriales — AMM',
    description: '84 parques industriales en 13 municipios del Área Metropolitana de Monterrey. Precios, disponibilidad y mapa interactivo.',
    type: 'website',
    locale: 'es_MX',
  },
  alternates: {
    canonical: 'https://elnortedelpais.com/mapa-parques',
  },
}

export default async function MapaParquesPage() {
  const { data } = await supabaseServer
    .from('parques_industriales')
    .select('*')

  const parques = (data || []) as Parque[]

  // Build municipality stats
  const muniStats = MUNICIPIOS.map(m => {
    const parks = parques.filter(p => p.municipio === m.nombre)
    const conRenta = parks.filter(p => p.renta_usd_m2_min)
    const rentaAvg = conRenta.length > 0
      ? (conRenta.reduce((s, p) => s + ((p.renta_usd_m2_min || 0) + (p.renta_usd_m2_max || 0)) / 2, 0) / conRenta.length).toFixed(2)
      : null
    return { ...m, count: parks.length, rentaAvg }
  }).filter(m => m.count > 0).sort((a, b) => b.count - a.count)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Mapa de Parques Industriales — Área Metropolitana de Monterrey',
    description: `Directorio de ${parques.length} parques industriales en 13 municipios del AMM`,
    url: 'https://elnortedelpais.com/mapa-parques',
    publisher: {
      '@type': 'Organization',
      name: 'El Norte del País',
      url: 'https://elnortedelpais.com',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <MapaParquesLoader />

      {/* SEO Content */}
      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-16">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">
          Parques Industriales del Área Metropolitana de Monterrey
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-3xl">
          El Área Metropolitana de Monterrey concentra <strong>{parques.length} parques industriales</strong> distribuidos
          en <strong>{muniStats.length} municipios</strong>, consolidándose como el principal polo industrial del noreste
          de México y uno de los destinos más atractivos para nearshoring en Norteamérica.
        </p>

        <h3 className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-4">
          Parques por municipio
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {muniStats.map(m => (
            <Link
              key={m.slug}
              href={`/mapa-parques/${m.slug}`}
              className="border border-gray-100 rounded-lg p-5 hover:border-[#002D63] hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 group-hover:text-[#002D63] transition-colors">{m.nombre}</h4>
                <span className="text-2xl font-bold text-[#002D63]">{m.count}</span>
              </div>
              <div className="text-xs text-gray-500">
                {m.count === 1 ? '1 parque industrial' : `${m.count} parques industriales`}
                {m.rentaAvg && <span className="ml-2 text-[#002D63]">· ${m.rentaAvg} USD/m²</span>}
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 sm:p-8">
          <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">Acerca de este directorio</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Este mapa incluye parques industriales registrados ante la AMPIP (Asociación Mexicana de Parques Industriales Privados)
            y otras fuentes verificadas. Los datos de precios y ocupación se actualizan periódicamente. Para información actualizada
            sobre un parque específico, recomendamos contactar directamente al desarrollador o escribir a{' '}
            <a href="mailto:contacto@elnortedelpais.com" className="text-[#002D63] underline">contacto@elnortedelpais.com</a>.
          </p>
        </div>
      </div>
    </>
  )
}
