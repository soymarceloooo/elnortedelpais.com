'use client'

import dynamic from 'next/dynamic'

// Dynamic import sin SSR - esto bypasa Turbopack en build time
const MapaParques = dynamic(
  () => import('@/components/MapaParques'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002D63] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    )
  }
)

export default function MapaParquesPage() {
  return <MapaParques />
}
