'use client'

import { useState, useEffect } from 'react'
import Map, { Marker, Popup } from 'react-map-gl'
import { Parque } from '@/types/parque'
import { supabase } from '@/lib/supabase'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

export default function MapaParquesPage() {
  const [parques, setParques] = useState<Parque[]>([])
  const [selectedParque, setSelectedParque] = useState<Parque | null>(null)
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroDesarrolladora, setFiltroDesarrolladora] = useState<string>('todos')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadParques() {
      try {
        const { data, error } = await supabase
          .from('parques_industriales')
          .select('*')
          .order('nombre')
        
        if (error) throw error
        if (data) setParques(data as Parque[])
      } catch (err) {
        console.error('Error cargando parques:', err)
        setError('Error al cargar los parques industriales')
      } finally {
        setLoading(false)
      }
    }
    
    loadParques()
  }, [])

  // Filtrar parques
  const parquesFiltrados = parques.filter(p => {
    const matchTipo = filtroTipo === 'todos' || p.tipo === filtroTipo
    const matchDev = filtroDesarrolladora === 'todos' || p.desarrolladora === filtroDesarrolladora
    return matchTipo && matchDev
  })

  // Obtener desarrolladoras únicas
  const desarrolladoras = Array.from(new Set(parques.map(p => p.desarrolladora).filter(Boolean)))
  const tipos = Array.from(new Set(parques.map(p => p.tipo)))

  // Color por tipo
  const getColorByTipo = (tipo: string) => {
    switch (tipo) {
      case 'Industrial': return '#002D63'
      case 'Tecnológico': return '#FF6B35'
      case 'Logístico': return '#666666'
      default: return '#002D63'
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002D63] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando parques industriales...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Error al cargar datos</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-[#002D63] text-white p-4">
        <h1 className="text-2xl font-bold">Mapa de Parques Industriales - García, NL</h1>
        <p className="text-sm opacity-90">El Norte del País · 100% de cobertura</p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r overflow-y-auto p-4">
          {/* Stats */}
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-3">Estadísticas</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-2xl font-bold text-[#002D63]">{parques.length}</div>
                <div className="text-xs text-gray-600">Parques totales</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-2xl font-bold text-[#002D63]">100%</div>
                <div className="text-xs text-gray-600">Cobertura García</div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-3">Filtros</h2>
            
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select 
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="todos">Todos</option>
                {tipos.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Desarrolladora</label>
              <select
                value={filtroDesarrolladora}
                onChange={(e) => setFiltroDesarrolladora(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="todos">Todas</option>
                {desarrolladoras.map(dev => (
                  <option key={dev} value={dev || ''}>{dev || 'Independiente'}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Lista de parques */}
          <div>
            <h2 className="font-semibold text-lg mb-3">
              Parques ({parquesFiltrados.length})
            </h2>
            <div className="space-y-2">
              {parquesFiltrados.map(parque => (
                <div
                  key={parque.id}
                  onClick={() => setSelectedParque(parque)}
                  className="p-3 border rounded cursor-pointer hover:bg-gray-50 transition"
                >
                  <div className="font-medium">{parque.nombre}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    <span className="inline-block mr-2">{parque.tipo}</span>
                    {parque.desarrolladora && (
                      <span className="inline-block">· {parque.desarrolladora}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Map */}
        <main className="flex-1">
          {MAPBOX_TOKEN ? (
            <Map
              mapboxAccessToken={MAPBOX_TOKEN}
              initialViewState={{
                longitude: -100.575,
                latitude: 25.805,
                zoom: 11
              }}
              style={{ width: '100%', height: '100%' }}
              mapStyle="mapbox://styles/mapbox/light-v11"
            >
              {parquesFiltrados.map(parque => (
                <Marker
                  key={parque.id}
                  longitude={parque.lng}
                  latitude={parque.lat}
                  anchor="bottom"
                  onClick={e => {
                    e.originalEvent.stopPropagation()
                    setSelectedParque(parque)
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full cursor-pointer border-2 border-white shadow-lg"
                    style={{ backgroundColor: getColorByTipo(parque.tipo) }}
                  />
                </Marker>
              ))}

              {selectedParque && (
                <Popup
                  longitude={selectedParque.lng}
                  latitude={selectedParque.lat}
                  anchor="top"
                  onClose={() => setSelectedParque(null)}
                  className="min-w-[250px]"
                >
                  <div className="p-2">
                    <h3 className="font-bold text-base mb-2">{selectedParque.nombre}</h3>
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="font-medium">Tipo:</span> {selectedParque.tipo}
                      </div>
                      {selectedParque.desarrolladora && (
                        <div>
                          <span className="font-medium">Desarrolladora:</span> {selectedParque.desarrolladora}
                        </div>
                      )}
                      {selectedParque.hectareas && (
                        <div>
                          <span className="font-medium">Tamaño:</span> {selectedParque.hectareas} ha
                        </div>
                      )}
                      {selectedParque.año_fundacion && (
                        <div>
                          <span className="font-medium">Fundado:</span> {selectedParque.año_fundacion}
                        </div>
                      )}
                      {selectedParque.descripcion && (
                        <div className="mt-2 text-xs text-gray-600 border-t pt-2">
                          {selectedParque.descripcion}
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              )}
            </Map>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <div className="text-center p-8">
                <h2 className="text-xl font-bold mb-2">Configuración pendiente</h2>
                <p className="text-gray-600 mb-4">
                  Agrega tu token de Mapbox en <code className="bg-gray-200 px-2 py-1 rounded">.env.local</code>
                </p>
                <pre className="text-left bg-white p-4 rounded text-xs">
                  NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
                </pre>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
