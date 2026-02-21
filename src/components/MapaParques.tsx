'use client'

import { useState, useEffect } from 'react'
import Map, { Marker, Popup } from 'react-map-gl/mapbox'
import { Parque } from '@/types/parque'
import { supabase } from '@/lib/supabase'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

export default function MapaParques() {
  const [parques, setParques] = useState<Parque[]>([])
  const [selectedParque, setSelectedParque] = useState<Parque | null>(null)
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroDesarrolladora, setFiltroDesarrolladora] = useState<string>('todos')
  const [filtroPrecioMax, setFiltroPrecioMax] = useState<number>(10000)
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
    
    // Filtro de precio (venta en MXN)
    const precioVenta = p.venta_mxn_m2_min || 0
    const matchPrecio = precioVenta === 0 || precioVenta <= filtroPrecioMax
    
    return matchTipo && matchDev && matchPrecio
  })

  // Calcular stats
  const parquesConPrecioVenta = parques.filter(p => p.venta_mxn_m2_min || p.venta_mxn_m2_max)
  const parquesConPrecioRenta = parques.filter(p => p.renta_usd_m2_min || p.renta_usd_m2_max)
  
  const precioVentaPromedio = parquesConPrecioVenta.length > 0
    ? Math.round(parquesConPrecioVenta.reduce((sum, p) => {
        const avg = ((p.venta_mxn_m2_min || 0) + (p.venta_mxn_m2_max || 0)) / 2
        return sum + avg
      }, 0) / parquesConPrecioVenta.length)
    : null

  const precioRentaPromedio = parquesConPrecioRenta.length > 0
    ? (parquesConPrecioRenta.reduce((sum, p) => {
        const avg = ((p.renta_usd_m2_min || 0) + (p.renta_usd_m2_max || 0)) / 2
        return sum + avg
      }, 0) / parquesConPrecioRenta.length).toFixed(2)
    : null

  const ocupacionPromedio = parques.filter(p => p.ocupacion_pct).length > 0
    ? Math.round(parques.reduce((sum, p) => sum + (p.ocupacion_pct || 0), 0) / parques.filter(p => p.ocupacion_pct).length)
    : null

  const parquesConEspacio = parques.filter(p => (p.ocupacion_pct || 100) < 95).length

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
            <h2 className="font-semibold text-lg mb-3">Estadísticas García, NL</h2>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-2xl font-bold text-[#002D63]">{parques.length}</div>
                <div className="text-xs text-gray-600">Parques totales</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-2xl font-bold text-green-600">{parquesConEspacio}/{parques.length}</div>
                <div className="text-xs text-gray-600">Con espacio</div>
              </div>
            </div>
            
            {/* Precios promedio */}
            <div className="space-y-2 mb-3">
              {precioRentaPromedio && (
                <div className="bg-blue-50 p-3 rounded border border-blue-100">
                  <div className="text-sm font-semibold text-blue-900">Renta promedio</div>
                  <div className="text-xl font-bold text-blue-700">${precioRentaPromedio} USD/m²</div>
                  <div className="text-xs text-blue-600">por mes</div>
                </div>
              )}
              
              {precioVentaPromedio && (
                <div className="bg-green-50 p-3 rounded border border-green-100">
                  <div className="text-sm font-semibold text-green-900">Venta promedio</div>
                  <div className="text-xl font-bold text-green-700">${precioVentaPromedio.toLocaleString()} MXN/m²</div>
                  <div className="text-xs text-green-600">lotes industriales</div>
                </div>
              )}

              {ocupacionPromedio && (
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm font-semibold text-gray-700">Ocupación promedio</div>
                  <div className="text-xl font-bold text-[#002D63]">{ocupacionPromedio}%</div>
                </div>
              )}
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

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Precio venta máximo: ${filtroPrecioMax.toLocaleString()} MXN/m²
              </label>
              <input
                type="range"
                min="1000"
                max="10000"
                step="500"
                value={filtroPrecioMax}
                onChange={(e) => setFiltroPrecioMax(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$1,000</span>
                <span>$10,000</span>
              </div>
            </div>
          </div>

          {/* Lista de parques */}
          <div>
            <h2 className="font-semibold text-lg mb-3">Parques ({parquesFiltrados.length})</h2>
            <div className="space-y-2">
              {parquesFiltrados.map(parque => {
                const disponibilidad = (parque.ocupacion_pct || 100) < 95 ? 'alta' : 
                                      (parque.ocupacion_pct || 100) < 98 ? 'media' : 'baja'
                const colorDisponibilidad = disponibilidad === 'alta' ? 'bg-green-100 text-green-700' :
                                           disponibilidad === 'media' ? 'bg-yellow-100 text-yellow-700' :
                                           'bg-red-100 text-red-700'
                
                return (
                  <button
                    key={parque.id}
                    onClick={() => setSelectedParque(parque)}
                    className="w-full text-left p-3 rounded border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-medium text-sm flex-1">{parque.nombre}</div>
                      {parque.ocupacion_pct !== null && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${colorDisponibilidad}`}>
                          {disponibilidad === 'alta' ? '🟢' : disponibilidad === 'media' ? '🟡' : '🔴'}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-1">
                      {parque.desarrolladora || 'Independiente'}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getColorByTipo(parque.tipo) }}
                      />
                      <span className="text-xs text-gray-600">{parque.tipo}</span>
                    </div>

                    {/* Precios resumidos */}
                    <div className="mt-2 text-xs space-y-0.5">
                      {parque.renta_usd_m2_min && (
                        <div className="text-blue-600">
                          💵 ${parque.renta_usd_m2_min}-${parque.renta_usd_m2_max} USD/m²/mes
                        </div>
                      )}
                      {parque.venta_mxn_m2_min && (
                        <div className="text-green-600">
                          🏷️ ${parque.venta_mxn_m2_min.toLocaleString()}-${(parque.venta_mxn_m2_max || 0).toLocaleString()} MXN/m²
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

        {/* Mapa */}
        <div className="flex-1 relative">
          <Map
            initialViewState={{
              longitude: -100.5800,
              latitude: 25.8000,
              zoom: 12
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            mapboxAccessToken={MAPBOX_TOKEN}
          >
            {/* Markers */}
            {parquesFiltrados.map(parque => (
              <Marker
                key={parque.id}
                longitude={parque.lng}
                latitude={parque.lat}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation()
                  setSelectedParque(parque)
                }}
              >
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: getColorByTipo(parque.tipo) }}
                >
                  P
                </div>
              </Marker>
            ))}

            {/* Popup */}
            {selectedParque && (
              <Popup
                longitude={selectedParque.lng}
                latitude={selectedParque.lat}
                anchor="top"
                onClose={() => setSelectedParque(null)}
                closeOnClick={false}
                className="max-w-sm"
              >
                <div className="p-3 max-w-xs">
                  <h3 className="font-semibold text-base mb-2">{selectedParque.nombre}</h3>
                  
                  <div className="text-xs text-gray-600 space-y-1.5 mb-3">
                    <div>📍 {selectedParque.municipio}</div>
                    {selectedParque.desarrolladora && (
                      <div>🏢 {selectedParque.desarrolladora}</div>
                    )}
                    <div>🏭 {selectedParque.tipo}</div>
                    {selectedParque.año_fundacion && (
                      <div>📅 Fundado: {selectedParque.año_fundacion}</div>
                    )}
                  </div>

                  {/* Sección de precios */}
                  {(selectedParque.renta_usd_m2_min || selectedParque.venta_mxn_m2_min) && (
                    <div className="border-t pt-3 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">💰 Precios</h4>
                        {selectedParque.precio_confianza && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            selectedParque.precio_confianza === 'verificado' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {selectedParque.precio_confianza === 'verificado' ? '🟢 Verificado' : '🟡 Estimado'}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        {selectedParque.renta_usd_m2_min && (
                          <div className="bg-blue-50 p-2 rounded">
                            <div className="text-xs text-blue-600 font-medium">Renta</div>
                            <div className="text-sm font-bold text-blue-900">
                              ${selectedParque.renta_usd_m2_min} - ${selectedParque.renta_usd_m2_max} USD/m²
                            </div>
                            <div className="text-xs text-blue-600">por mes</div>
                          </div>
                        )}
                        
                        {selectedParque.venta_mxn_m2_min && (
                          <div className="bg-green-50 p-2 rounded">
                            <div className="text-xs text-green-600 font-medium">Venta</div>
                            <div className="text-sm font-bold text-green-900">
                              ${selectedParque.venta_mxn_m2_min.toLocaleString()} - ${(selectedParque.venta_mxn_m2_max || 0).toLocaleString()} MXN/m²
                            </div>
                            <div className="text-xs text-green-600">lotes industriales</div>
                          </div>
                        )}
                      </div>
                      
                      {selectedParque.precio_fuente && (
                        <div className="text-xs text-gray-500 mt-2">
                          📊 Fuente: {selectedParque.precio_fuente}
                        </div>
                      )}
                      {selectedParque.precio_actualizado_at && (
                        <div className="text-xs text-gray-400 mt-1">
                          Actualizado: {new Date(selectedParque.precio_actualizado_at).toLocaleDateString('es-MX')}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Disponibilidad */}
                  {selectedParque.ocupacion_pct !== null && (
                    <div className="border-t pt-3 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Ocupación</span>
                        <span className="text-sm font-bold text-[#002D63]">{selectedParque.ocupacion_pct}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-[#002D63] h-2 rounded-full transition-all"
                          style={{ width: `${selectedParque.ocupacion_pct}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {100 - (selectedParque.ocupacion_pct || 0)}% disponible
                      </div>
                    </div>
                  )}

                  {selectedParque.descripcion && (
                    <div className="border-t pt-3">
                      <p className="text-xs text-gray-600 leading-relaxed">{selectedParque.descripcion}</p>
                    </div>
                  )}
                </div>
              </Popup>
            )}
          </Map>
        </div>
      </div>
    </div>
  )
}
