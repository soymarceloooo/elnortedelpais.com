'use client'

import { useState, useEffect, useMemo } from 'react'
import Map, { Marker, Popup } from 'react-map-gl/mapbox'
import { Parque } from '@/types/parque'
import { supabase } from '@/lib/supabase'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

type POICategory = 'logistica' | 'plantas' | 'talento'

interface StrategicPOI {
  nombre: string
  categoria: POICategory
  lat: number
  lng: number
  descripcion: string
  emoji: string
}

const STRATEGIC_POIS: StrategicPOI[] = [
  // Infraestructura logística
  { nombre: 'Aeropuerto Internacional de Monterrey (OMA)', categoria: 'logistica', lat: 25.7785, lng: -100.1069, descripcion: 'Principal hub aéreo del noreste de México. Conecta con EE.UU., Europa y Asia.', emoji: '✈️' },
  { nombre: 'Interpuerto Monterrey', categoria: 'logistica', lat: 25.9290, lng: -100.2867, descripcion: 'Plataforma logística intermodal. Terminal de carga ferroviaria y aduanera.', emoji: '🚂' },
  { nombre: 'Terminal Intermodal KCS Monterrey', categoria: 'logistica', lat: 25.7050, lng: -100.2300, descripcion: 'Terminal ferroviaria de Kansas City Southern. Conexión directa a Laredo, TX.', emoji: '🚂' },
  { nombre: 'Cruce Fronterizo Colombia-Solidarity', categoria: 'logistica', lat: 27.1600, lng: -99.8700, descripcion: 'Cruce comercial internacional NL-Texas. Ruta directa a I-35.', emoji: '🛃' },
  
  // Plantas ancla
  { nombre: 'KIA Motors México', categoria: 'plantas', lat: 25.7427, lng: -99.9819, descripcion: 'Planta automotriz. Capacidad: 400,000 vehículos/año. +7,000 empleos directos.', emoji: '🚗' },
  { nombre: 'Carrier - Santa Catarina', categoria: 'plantas', lat: 25.6688, lng: -100.4496, descripcion: 'Planta de sistemas HVAC. Uno de los mayores empleadores de la zona poniente.', emoji: '🏭' },
  { nombre: 'Ternium México', categoria: 'plantas', lat: 25.7280, lng: -100.3029, descripcion: 'Planta siderúrgica. Mayor productor de acero plano en México.', emoji: '🏭' },
  { nombre: 'CEMEX - Centro de Operaciones', categoria: 'plantas', lat: 25.6520, lng: -100.3360, descripcion: 'Sede global de CEMEX. Multinacional cementera mexicana.', emoji: '🏢' },
  { nombre: 'John Deere Monterrey', categoria: 'plantas', lat: 25.7180, lng: -100.2150, descripcion: 'Planta de manufactura de maquinaria agrícola e industrial.', emoji: '🚜' },
  { nombre: 'Caterpillar Monterrey', categoria: 'plantas', lat: 25.7810, lng: -100.1720, descripcion: 'Planta de manufactura de maquinaria pesada y componentes.', emoji: '🏗️' },
  { nombre: 'Whirlpool Monterrey', categoria: 'plantas', lat: 25.7550, lng: -100.2480, descripcion: 'Planta de manufactura de electrodomésticos.', emoji: '🏭' },
  { nombre: 'BMW San Luis Potosí (referencia)', categoria: 'plantas', lat: 25.8200, lng: -100.0300, descripcion: 'Corredor automotriz que conecta con la planta BMW vía carretera 57.', emoji: '🚗' },
  
  // Talento e investigación
  { nombre: 'PIIT - Parque de Investigación e Innovación Tecnológica', categoria: 'talento', lat: 25.7652, lng: -100.1252, descripcion: '38 centros de investigación. Nanotecnología, biotecnología, TI y más.', emoji: '🔬' },
  { nombre: 'Tecnológico de Monterrey - Campus MTY', categoria: 'talento', lat: 25.6514, lng: -100.2895, descripcion: 'Universidad privada #1 de México. +36,000 estudiantes. Hub de emprendimiento.', emoji: '🎓' },
  { nombre: 'UANL - Ciudad Universitaria', categoria: 'talento', lat: 25.7270, lng: -100.3115, descripcion: 'Universidad pública más grande del noreste. +215,000 estudiantes. Ingeniería y ciencias.', emoji: '🎓' },
  { nombre: 'UDEM - Universidad de Monterrey', categoria: 'talento', lat: 25.6610, lng: -100.3580, descripcion: 'Universidad privada. Programas de ingeniería y negocios.', emoji: '🎓' },
]

const POI_CATEGORY_LABELS: Record<POICategory, string> = {
  logistica: '🚛 Logística',
  plantas: '🏭 Plantas Ancla',
  talento: '🎓 Talento & I+D',
}

export default function MapaParques() {
  const [parques, setParques] = useState<Parque[]>([])
  const [selectedParque, setSelectedParque] = useState<Parque | null>(null)
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroDesarrolladora, setFiltroDesarrolladora] = useState<string>('todos')
  const [filtroMunicipio, setFiltroMunicipio] = useState<string>('todos')
  const [filtroPrecioMax, setFiltroPrecioMax] = useState<number>(10000)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'stats' | 'filtros' | 'lista'>('lista')
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite'>('streets')
  const [showPOIs, setShowPOIs] = useState<boolean>(true)
  const [selectedPOI, setSelectedPOI] = useState<StrategicPOI | null>(null)
  const [poiCategories, setPOICategories] = useState<Record<POICategory, boolean>>({
    logistica: true,
    plantas: true,
    talento: true,
  })

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

  // Get unique values for filters
  const municipios = useMemo(() => 
    Array.from(new Set(parques.map(p => p.municipio))).sort()
  , [parques])
  
  const desarrolladoras = useMemo(() => 
    Array.from(new Set(parques.map(p => p.desarrolladora).filter(Boolean))).sort() as string[]
  , [parques])
  
  const tipos = useMemo(() => 
    Array.from(new Set(parques.map(p => p.tipo))).sort()
  , [parques])

  // Filter parks
  const parquesFiltrados = useMemo(() => parques.filter(p => {
    const matchTipo = filtroTipo === 'todos' || p.tipo === filtroTipo
    const matchDev = filtroDesarrolladora === 'todos' || p.desarrolladora === filtroDesarrolladora
    const matchMunicipio = filtroMunicipio === 'todos' || p.municipio === filtroMunicipio
    const precioVenta = p.venta_mxn_m2_min || 0
    const matchPrecio = precioVenta === 0 || precioVenta <= filtroPrecioMax
    return matchTipo && matchDev && matchMunicipio && matchPrecio
  }), [parques, filtroTipo, filtroDesarrolladora, filtroMunicipio, filtroPrecioMax])

  // Stats based on filtered parks
  const stats = useMemo(() => {
    const filtered = parquesFiltrados
    const conPrecioVenta = filtered.filter(p => p.venta_mxn_m2_min || p.venta_mxn_m2_max)
    const conPrecioRenta = filtered.filter(p => p.renta_usd_m2_min || p.renta_usd_m2_max)
    
    const precioVentaPromedio = conPrecioVenta.length > 0
      ? Math.round(conPrecioVenta.reduce((sum, p) => {
          const avg = ((p.venta_mxn_m2_min || 0) + (p.venta_mxn_m2_max || 0)) / 2
          return sum + avg
        }, 0) / conPrecioVenta.length)
      : null

    const precioRentaPromedio = conPrecioRenta.length > 0
      ? (conPrecioRenta.reduce((sum, p) => {
          const avg = ((p.renta_usd_m2_min || 0) + (p.renta_usd_m2_max || 0)) / 2
          return sum + avg
        }, 0) / conPrecioRenta.length).toFixed(2)
      : null

    const conOcupacion = filtered.filter(p => p.ocupacion_pct)
    const ocupacionPromedio = conOcupacion.length > 0
      ? Math.round(conOcupacion.reduce((sum, p) => sum + (p.ocupacion_pct || 0), 0) / conOcupacion.length)
      : null

    const conEspacio = filtered.filter(p => (p.ocupacion_pct || 100) < 95).length
    const totalMunicipios = new Set(filtered.map(p => p.municipio)).size

    return { precioVentaPromedio, precioRentaPromedio, ocupacionPromedio, conEspacio, totalMunicipios }
  }, [parquesFiltrados])

  const getColorByMunicipio = (municipio: string) => {
    const colors: Record<string, string> = {
      'Apodaca': '#002D63',
      'Monterrey': '#1a5276',
      'Santa Catarina': '#6c3483',
      'García': '#117a65',
      'General Escobedo': '#b9770e',
      'Ciénega de Flores': '#922b21',
      'Guadalupe': '#1f618d',
      'San Nicolás de los Garza': '#239b56',
      'Salinas Victoria': '#d35400',
      'Pesquería': '#7d3c98',
      'El Carmen': '#2e86c1',
      'San Pedro Garza García': '#17a589',
      'Juárez': '#ca6f1e',
    }
    return colors[municipio] || '#002D63'
  }

  const headerTitle = filtroMunicipio === 'todos' 
    ? 'Mapa de Parques Industriales — Área Metropolitana de Monterrey'
    : `Mapa de Parques Industriales — ${filtroMunicipio}, NL`
  
  const headerSubtitle = filtroMunicipio === 'todos'
    ? `El Norte del País · ${parques.length} parques en ${municipios.length} municipios`
    : `El Norte del País · ${parquesFiltrados.length} parques`

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002D63] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando parques industriales...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh] bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Error al cargar datos</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  const StatsContent = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-2xl font-bold text-[#002D63]">{parquesFiltrados.length}</div>
          <div className="text-xs text-gray-600">Parques totales</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-2xl font-bold text-green-600">{stats.conEspacio}/{parquesFiltrados.length}</div>
          <div className="text-xs text-gray-600">Con espacio</div>
        </div>
      </div>
      {filtroMunicipio === 'todos' && (
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-2xl font-bold text-[#002D63]">{stats.totalMunicipios}</div>
          <div className="text-xs text-gray-600">Municipios</div>
        </div>
      )}
      {stats.precioRentaPromedio && (
        <div className="bg-blue-50 p-3 rounded border border-blue-100">
          <div className="text-sm font-semibold text-blue-900">Renta promedio</div>
          <div className="text-xl font-bold text-blue-700">${stats.precioRentaPromedio} USD/m²</div>
          <div className="text-xs text-blue-600">por mes</div>
        </div>
      )}
      {stats.precioVentaPromedio && (
        <div className="bg-green-50 p-3 rounded border border-green-100">
          <div className="text-sm font-semibold text-green-900">Venta promedio</div>
          <div className="text-xl font-bold text-green-700">${stats.precioVentaPromedio.toLocaleString()} MXN/m²</div>
          <div className="text-xs text-green-600">lotes industriales</div>
        </div>
      )}
      {stats.ocupacionPromedio && (
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm font-semibold text-gray-700">Ocupación promedio</div>
          <div className="text-xl font-bold text-[#002D63]">{stats.ocupacionPromedio}%</div>
        </div>
      )}
      
      {/* Breakdown by municipality */}
      {filtroMunicipio === 'todos' && (
        <div className="border-t pt-3 mt-3">
          <h3 className="text-sm font-semibold mb-2 text-gray-700">Por municipio</h3>
          <div className="space-y-1.5">
            {municipios.map(m => {
              const count = parquesFiltrados.filter(p => p.municipio === m).length
              if (count === 0) return null
              return (
                <button
                  key={m}
                  onClick={() => setFiltroMunicipio(m)}
                  className="w-full flex items-center justify-between text-xs hover:bg-gray-50 rounded px-2 py-1 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: getColorByMunicipio(m) }} />
                    <span>{m}</span>
                  </div>
                  <span className="font-semibold text-gray-600">{count}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )

  const FiltrosContent = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Municipio</label>
        <select 
          value={filtroMunicipio}
          onChange={(e) => setFiltroMunicipio(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        >
          <option value="todos">Todos ({parques.length})</option>
          {municipios.map(m => {
            const count = parques.filter(p => p.municipio === m).length
            return <option key={m} value={m}>{m} ({count})</option>
          })}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tipo</label>
        <select 
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        >
          <option value="todos">Todos</option>
          {tipos.map(tipo => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Desarrolladora</label>
        <select
          value={filtroDesarrolladora}
          onChange={(e) => setFiltroDesarrolladora(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        >
          <option value="todos">Todas</option>
          {desarrolladoras.map(dev => (
            <option key={dev} value={dev}>{dev}</option>
          ))}
        </select>
      </div>
      <div>
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
      {(filtroMunicipio !== 'todos' || filtroTipo !== 'todos' || filtroDesarrolladora !== 'todos') && (
        <button
          onClick={() => {
            setFiltroMunicipio('todos')
            setFiltroTipo('todos')
            setFiltroDesarrolladora('todos')
            setFiltroPrecioMax(10000)
          }}
          className="w-full text-sm text-[#002D63] font-medium py-2 border border-[#002D63] rounded hover:bg-[#002D63] hover:text-white transition-colors"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  )

  const ListaContent = () => (
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
            onClick={() => {
              setSelectedParque(parque)
              setPanelOpen(false)
            }}
            className="w-full text-left p-3 rounded border hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="font-medium text-sm flex-1">{parque.nombre}</div>
              {parque.ocupacion_pct !== null && (
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${colorDisponibilidad}`}>
                  {disponibilidad === 'alta' ? '🟢' : disponibilidad === 'media' ? '🟡' : '🔴'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span 
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: getColorByMunicipio(parque.municipio) }}
              />
              <span className="text-xs text-gray-500">{parque.municipio}</span>
              {parque.desarrolladora && (
                <>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-500">{parque.desarrolladora}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">{parque.tipo}</span>
            </div>
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
  )

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
      {/* Header */}
      <div className="bg-[#002D63] text-white px-4 py-3 sm:py-4">
        <h1 className="text-base sm:text-2xl font-bold leading-tight">{headerTitle}</h1>
        <p className="text-xs sm:text-sm opacity-90 mt-0.5">{headerSubtitle}</p>
      </div>

      {/* Desktop: sidebar + map | Mobile: map full + bottom sheet */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 bg-white border-r overflow-y-auto p-4 shrink-0">
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-3">
              Estadísticas {filtroMunicipio === 'todos' ? 'AMM' : filtroMunicipio}
            </h2>
            <StatsContent />
          </div>
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-3">Filtros</h2>
            <FiltrosContent />
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-3">Parques ({parquesFiltrados.length})</h2>
            <ListaContent />
          </div>
        </aside>

        {/* Map */}
        <div className="flex-1 relative">
          <Map
            initialViewState={{
              longitude: -100.30,
              latitude: 25.75,
              zoom: 10
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle={mapStyle === 'streets' ? 'mapbox://styles/mapbox/streets-v12' : 'mapbox://styles/mapbox/satellite-streets-v12'}
            mapboxAccessToken={MAPBOX_TOKEN}
          >
            {parquesFiltrados.map(parque => (
              <Marker
                key={parque.id}
                longitude={parque.lng}
                latitude={parque.lat}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation()
                  setSelectedParque(parque)
                  setPanelOpen(false)
                }}
              >
                <div 
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform flex items-center justify-center text-white text-[10px] sm:text-xs font-bold"
                  style={{ backgroundColor: getColorByMunicipio(parque.municipio) }}
                  title={parque.nombre}
                >
                  P
                </div>
              </Marker>
            ))}

            {/* Strategic POIs */}
            {showPOIs && STRATEGIC_POIS.filter(poi => poiCategories[poi.categoria]).map((poi, i) => (
              <Marker
                key={`poi-${i}`}
                longitude={poi.lng}
                latitude={poi.lat}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation()
                  setSelectedPOI(poi)
                  setSelectedParque(null)
                }}
              >
                <div 
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform flex items-center justify-center text-sm bg-white"
                  title={poi.nombre}
                >
                  {poi.emoji}
                </div>
              </Marker>
            ))}

            {/* POI Popup */}
            {selectedPOI && (
              <Popup
                longitude={selectedPOI.lng}
                latitude={selectedPOI.lat}
                anchor="top"
                onClose={() => setSelectedPOI(null)}
                closeOnClick={false}
                maxWidth="300px"
              >
                <div className="p-2 sm:p-3 max-w-[260px]">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-xl">{selectedPOI.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-sm leading-tight">{selectedPOI.nombre}</h3>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wide">
                        {POI_CATEGORY_LABELS[selectedPOI.categoria]}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{selectedPOI.descripcion}</p>
                </div>
              </Popup>
            )}

            {selectedParque && (
              <Popup
                longitude={selectedParque.lng}
                latitude={selectedParque.lat}
                anchor="top"
                onClose={() => setSelectedParque(null)}
                closeOnClick={false}
                maxWidth="320px"
              >
                <div className="p-2 sm:p-3 max-w-[280px] sm:max-w-xs">
                  <h3 className="font-semibold text-sm sm:text-base mb-2">{selectedParque.nombre}</h3>
                  
                  <div className="text-xs text-gray-600 space-y-1 mb-2">
                    <div>📍 {selectedParque.municipio}, NL</div>
                    {selectedParque.desarrolladora && <div>🏢 {selectedParque.desarrolladora}</div>}
                    <div>🏭 {selectedParque.tipo}</div>
                    {selectedParque.año_fundacion && <div>📅 Fundado: {selectedParque.año_fundacion}</div>}
                  </div>

                  {(selectedParque.renta_usd_m2_min || selectedParque.venta_mxn_m2_min) && (
                    <div className="border-t pt-2 mb-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-semibold text-xs sm:text-sm">💰 Precios</h4>
                        {selectedParque.precio_confianza && selectedParque.precio_confianza !== 'sin_dato' && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            selectedParque.precio_confianza === 'verificado' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {selectedParque.precio_confianza === 'verificado' ? '✓ Verificado' : '~ Estimado'}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        {selectedParque.renta_usd_m2_min && (
                          <div className="bg-blue-50 p-1.5 rounded text-xs">
                            <span className="text-blue-600 font-medium">Renta: </span>
                            <span className="font-bold text-blue-900">
                              ${selectedParque.renta_usd_m2_min}-${selectedParque.renta_usd_m2_max} USD/m²/mes
                            </span>
                          </div>
                        )}
                        {selectedParque.venta_mxn_m2_min && (
                          <div className="bg-green-50 p-1.5 rounded text-xs">
                            <span className="text-green-600 font-medium">Venta: </span>
                            <span className="font-bold text-green-900">
                              ${selectedParque.venta_mxn_m2_min.toLocaleString()}-${(selectedParque.venta_mxn_m2_max || 0).toLocaleString()} MXN/m²
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedParque.ocupacion_pct !== null && (
                    <div className="border-t pt-2 mb-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">Ocupación</span>
                        <span className="font-bold text-[#002D63]">{selectedParque.ocupacion_pct}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-[#002D63] h-1.5 rounded-full"
                          style={{ width: `${selectedParque.ocupacion_pct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {selectedParque.descripcion && (
                    <div className="border-t pt-2">
                      <p className="text-[11px] text-gray-600 leading-relaxed">{selectedParque.descripcion}</p>
                    </div>
                  )}
                </div>
              </Popup>
            )}
          </Map>

          {/* Map controls - top right */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
            <button
              className="bg-white text-gray-700 px-3 py-2 rounded-lg shadow-md text-xs font-medium flex items-center gap-1.5 hover:bg-gray-50 border border-gray-200"
              onClick={() => setMapStyle(s => s === 'streets' ? 'satellite' : 'streets')}
            >
              {mapStyle === 'streets' ? '🛰️ Satélite' : '🗺️ Mapa'}
            </button>
            
            {/* POI layer toggle */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <button
                className={`w-full px-3 py-2 text-xs font-medium flex items-center gap-1.5 transition-colors ${showPOIs ? 'text-[#002D63] bg-blue-50' : 'text-gray-500'}`}
                onClick={() => setShowPOIs(v => !v)}
              >
                📍 Puntos clave {showPOIs ? '▾' : '▸'}
              </button>
              {showPOIs && (
                <div className="border-t px-2 py-1.5 space-y-1">
                  {(Object.entries(POI_CATEGORY_LABELS) as [POICategory, string][]).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-1.5 text-[11px] cursor-pointer hover:bg-gray-50 rounded px-1 py-0.5">
                      <input
                        type="checkbox"
                        checked={poiCategories[key]}
                        onChange={() => setPOICategories(prev => ({ ...prev, [key]: !prev[key] }))}
                        className="rounded text-[#002D63] w-3 h-3"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Municipality quick filter chips on map */}
          <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 max-w-[60%]">
            {filtroMunicipio !== 'todos' && (
              <button
                onClick={() => setFiltroMunicipio('todos')}
                className="bg-white text-gray-700 px-2.5 py-1.5 rounded-full shadow-md text-xs font-medium border border-gray-200 hover:bg-gray-50 flex items-center gap-1"
              >
                ✕ {filtroMunicipio}
              </button>
            )}
          </div>

          {/* Mobile: floating button */}
          <button
            className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#002D63] text-white px-5 py-2.5 rounded-full shadow-lg text-sm font-medium z-10 flex items-center gap-2"
            onClick={() => setPanelOpen(true)}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            {parquesFiltrados.length} Parques
          </button>
        </div>

        {/* Mobile Bottom Sheet */}
        {panelOpen && (
          <>
            <div 
              className="lg:hidden fixed inset-0 bg-black/40 z-40"
              onClick={() => setPanelOpen(false)}
            />
            
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[80vh] flex flex-col shadow-2xl animate-slide-up">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>
              
              <button 
                className="absolute top-3 right-4 p-1 text-gray-400"
                onClick={() => setPanelOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex border-b px-4 pt-1">
                {(['lista', 'filtros', 'stats'] as const).map(tab => (
                  <button
                    key={tab}
                    className={`flex-1 py-2.5 text-sm font-medium text-center border-b-2 transition-colors ${
                      activeTab === tab 
                        ? 'border-[#002D63] text-[#002D63]' 
                        : 'border-transparent text-gray-500'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'lista' ? `Parques (${parquesFiltrados.length})` : 
                     tab === 'filtros' ? 'Filtros' : 'Datos'}
                  </button>
                ))}
              </div>

              <div className="overflow-y-auto p-4 flex-1">
                {activeTab === 'stats' && <StatsContent />}
                {activeTab === 'filtros' && <FiltrosContent />}
                {activeTab === 'lista' && <ListaContent />}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
