'use client'

import dynamic from 'next/dynamic'

const MapaParques = dynamic(() => import('@/components/MapaParques'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[50vh] bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002D63]"></div>
    </div>
  ),
})

export default function MapaParquesLoader({ initialMunicipio }: { initialMunicipio?: string }) {
  return <MapaParques initialMunicipio={initialMunicipio} />
}
