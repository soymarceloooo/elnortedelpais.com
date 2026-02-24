'use client'

import { useState, useEffect, useMemo } from 'react'
import Map, { Marker, Popup } from 'react-map-gl/mapbox'
import { Parque } from '@/types/parque'
import { supabase } from '@/lib/supabase'
import 'mapbox-gl/dist/mapbox-gl.css'

/* Override Mapbox popup close button — more breathing room */
const popupStyles = `
.mapboxgl-popup-close-button {
  font-size: 18px;
  padding: 4px 8px;
  right: 4px;
  top: 4px;
  color: #9ca3af;
  line-height: 1;
}
.mapboxgl-popup-close-button:hover {
  color: #374151;
  background: #f3f4f6;
  border-radius: 4px;
}
.mapboxgl-popup-content {
  border-radius: 8px !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12) !important;
  padding: 0 !important;
}
`

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

/* ── SVG Icon Components ────────────────────────────────────── */

const IconPlane = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
  </svg>
)

const IconTrain = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><path d="M8 15h0"/><path d="M16 15h0"/>
  </svg>
)

const IconBorder = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h3l1.8-1.8a4 4 0 0 0-5.7-5.6L2 18z"/><circle cx="16.5" cy="7.5" r="2.5"/>
  </svg>
)

const IconFactory = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/>
  </svg>
)

const IconBuilding = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>
  </svg>
)

const IconGraduation = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/>
  </svg>
)

const IconLab = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16.5h10"/>
  </svg>
)

const IconSatellite = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13"/><path d="m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17"/><path d="m14 10 2-2"/><path d="m5 21 3-3"/><path d="m12 19 2.5-2.5"/><path d="m19 12-2.5 2.5"/>
  </svg>
)

const IconMap = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
  </svg>
)

const IconLayers = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>
)

const IconPin = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)

const IconChevron = ({ className = 'w-3 h-3', down = false }: { className?: string; down?: boolean }) => (
  <svg className={`${className} transition-transform ${down ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

/* ── POI Data ────────────────────────────────────────────────── */

type POICategory = 'logistica' | 'plantas' | 'talento'

interface StrategicPOI {
  nombre: string
  categoria: POICategory
  lat: number
  lng: number
  descripcion: string
}

const STRATEGIC_POIS: StrategicPOI[] = [
  { nombre: 'Aeropuerto Internacional de Monterrey (OMA)', categoria: 'logistica', lat: 25.7785, lng: -100.1069, descripcion: 'Principal hub aéreo del noreste de México. Conecta con EE.UU., Europa y Asia.' },
  { nombre: 'Interpuerto Monterrey', categoria: 'logistica', lat: 25.9290, lng: -100.2867, descripcion: 'Plataforma logística intermodal. Terminal de carga ferroviaria y aduanera.' },
  { nombre: 'Terminal Intermodal KCS Monterrey', categoria: 'logistica', lat: 25.7050, lng: -100.2300, descripcion: 'Terminal ferroviaria de Kansas City Southern. Conexión directa a Laredo, TX.' },
  { nombre: 'Cruce Fronterizo Colombia-Solidarity', categoria: 'logistica', lat: 27.1600, lng: -99.8700, descripcion: 'Cruce comercial internacional NL-Texas. Ruta directa a I-35.' },
  { nombre: 'KIA Motors México', categoria: 'plantas', lat: 25.7427, lng: -99.9819, descripcion: 'Planta automotriz. Capacidad: 400,000 vehículos/año. +7,000 empleos directos.' },
  { nombre: 'Carrier - Santa Catarina', categoria: 'plantas', lat: 25.6688, lng: -100.4496, descripcion: 'Planta de sistemas HVAC. Uno de los mayores empleadores de la zona poniente.' },
  { nombre: 'Ternium México', categoria: 'plantas', lat: 25.7280, lng: -100.3029, descripcion: 'Planta siderúrgica. Mayor productor de acero plano en México.' },
  { nombre: 'CEMEX - Centro de Operaciones', categoria: 'plantas', lat: 25.6520, lng: -100.3360, descripcion: 'Sede global de CEMEX. Multinacional cementera mexicana.' },
  { nombre: 'John Deere Monterrey', categoria: 'plantas', lat: 25.7180, lng: -100.2150, descripcion: 'Planta de manufactura de maquinaria agrícola e industrial.' },
  { nombre: 'Caterpillar Monterrey', categoria: 'plantas', lat: 25.7810, lng: -100.1720, descripcion: 'Planta de manufactura de maquinaria pesada y componentes.' },
  { nombre: 'Whirlpool Monterrey', categoria: 'plantas', lat: 25.7550, lng: -100.2480, descripcion: 'Planta de manufactura de electrodomésticos.' },
  { nombre: 'BMW San Luis Potosí (referencia)', categoria: 'plantas', lat: 25.8200, lng: -100.0300, descripcion: 'Corredor automotriz que conecta con la planta BMW vía carretera 57.' },
  { nombre: 'PIIT - Parque de Investigación e Innovación Tecnológica', categoria: 'talento', lat: 25.7652, lng: -100.1252, descripcion: '38 centros de investigación. Nanotecnología, biotecnología, TI y más.' },
  { nombre: 'Tecnológico de Monterrey - Campus MTY', categoria: 'talento', lat: 25.6514, lng: -100.2895, descripcion: 'Universidad privada #1 de México. +36,000 estudiantes. Hub de emprendimiento.' },
  { nombre: 'UANL - Ciudad Universitaria', categoria: 'talento', lat: 25.7270, lng: -100.3115, descripcion: 'Universidad pública más grande del noreste. +215,000 estudiantes. Ingeniería y ciencias.' },
  { nombre: 'UDEM - Universidad de Monterrey', categoria: 'talento', lat: 25.6610, lng: -100.3580, descripcion: 'Universidad privada. Programas de ingeniería y negocios.' },
]

const POI_CATEGORY_CONFIG: Record<POICategory, { label: string; color: string; icon: typeof IconFactory }> = {
  logistica: { label: 'Logística', color: '#D35400', icon: IconTrain },
  plantas: { label: 'Plantas Ancla', color: '#922B21', icon: IconFactory },
  talento: { label: 'Talento & I+D', color: '#1A5276', icon: IconGraduation },
}

const POI_ICON_MAP: Record<string, typeof IconFactory> = {
  'Aeropuerto Internacional de Monterrey (OMA)': IconPlane,
  'Cruce Fronterizo Colombia-Solidarity': IconBorder,
  'CEMEX - Centro de Operaciones': IconBuilding,
  'PIIT - Parque de Investigación e Innovación Tecnológica': IconLab,
}

function getPOIIcon(poi: StrategicPOI) {
  return POI_ICON_MAP[poi.nombre] || POI_CATEGORY_CONFIG[poi.categoria].icon
}

/* ── Component ───────────────────────────────────────────────── */

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

  const municipios = useMemo(() => 
    Array.from(new Set(parques.map(p => p.municipio))).sort()
  , [parques])
  
  const desarrolladoras = useMemo(() => 
    Array.from(new Set(parques.map(p => p.desarrolladora).filter(Boolean))).sort() as string[]
  , [parques])
  
  const tipos = useMemo(() => 
    Array.from(new Set(parques.map(p => p.tipo))).sort()
  , [parques])

  const parquesFiltrados = useMemo(() => parques.filter(p => {
    const matchTipo = filtroTipo === 'todos' || p.tipo === filtroTipo
    const matchDev = filtroDesarrolladora === 'todos' || p.desarrolladora === filtroDesarrolladora
    const matchMunicipio = filtroMunicipio === 'todos' || p.municipio === filtroMunicipio
    const precioVenta = p.venta_mxn_m2_min || 0
    const matchPrecio = precioVenta === 0 || precioVenta <= filtroPrecioMax
    return matchTipo && matchDev && matchMunicipio && matchPrecio
  }), [parques, filtroTipo, filtroDesarrolladora, filtroMunicipio, filtroPrecioMax])

  const stats = useMemo(() => {
    const filtered = parquesFiltrados
    const conPrecioVenta = filtered.filter(p => p.venta_mxn_m2_min || p.venta_mxn_m2_max)
    const conPrecioRenta = filtered.filter(p => p.renta_usd_m2_min || p.renta_usd_m2_max)
    
    const precioVentaPromedio = conPrecioVenta.length > 0
      ? Math.round(conPrecioVenta.reduce((sum, p) => sum + ((p.venta_mxn_m2_min || 0) + (p.venta_mxn_m2_max || 0)) / 2, 0) / conPrecioVenta.length)
      : null

    const precioRentaPromedio = conPrecioRenta.length > 0
      ? (conPrecioRenta.reduce((sum, p) => sum + ((p.renta_usd_m2_min || 0) + (p.renta_usd_m2_max || 0)) / 2, 0) / conPrecioRenta.length).toFixed(2)
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
      'Apodaca': '#002D63', 'Monterrey': '#1a5276', 'Santa Catarina': '#6c3483',
      'García': '#117a65', 'General Escobedo': '#b9770e', 'Ciénega de Flores': '#922b21',
      'Guadalupe': '#1f618d', 'San Nicolás de los Garza': '#239b56', 'Salinas Victoria': '#d35400',
      'Pesquería': '#7d3c98', 'El Carmen': '#2e86c1', 'San Pedro Garza García': '#17a589',
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
          <p className="text-gray-600 text-sm">Cargando parques industriales...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh] bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error al cargar datos</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  const StatsContent = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 p-3 rounded border border-gray-100">
          <div className="text-2xl font-bold text-[#002D63]">{parquesFiltrados.length}</div>
          <div className="text-[11px] text-gray-500 uppercase tracking-wide">Parques</div>
        </div>
        <div className="bg-gray-50 p-3 rounded border border-gray-100">
          <div className="text-2xl font-bold text-green-700">{stats.conEspacio}/{parquesFiltrados.length}</div>
          <div className="text-[11px] text-gray-500 uppercase tracking-wide">Con espacio</div>
        </div>
      </div>
      {filtroMunicipio === 'todos' && (
        <div className="bg-gray-50 p-3 rounded border border-gray-100">
          <div className="text-2xl font-bold text-[#002D63]">{stats.totalMunicipios}</div>
          <div className="text-[11px] text-gray-500 uppercase tracking-wide">Municipios</div>
        </div>
      )}
      {stats.precioRentaPromedio && (
        <div className="bg-[#002D63]/5 p-3 rounded border border-[#002D63]/10">
          <div className="text-[11px] text-[#002D63] uppercase tracking-wide font-medium">Renta promedio</div>
          <div className="text-xl font-bold text-[#002D63]">${stats.precioRentaPromedio} USD/m²</div>
          <div className="text-[11px] text-gray-500">por mes</div>
        </div>
      )}
      {stats.precioVentaPromedio && (
        <div className="bg-[#D35400]/5 p-3 rounded border border-[#D35400]/10">
          <div className="text-[11px] text-[#D35400] uppercase tracking-wide font-medium">Venta promedio</div>
          <div className="text-xl font-bold text-[#D35400]">${stats.precioVentaPromedio.toLocaleString()} MXN/m²</div>
          <div className="text-[11px] text-gray-500">lotes industriales</div>
        </div>
      )}
      {stats.ocupacionPromedio && (
        <div className="bg-gray-50 p-3 rounded border border-gray-100">
          <div className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">Ocupación promedio</div>
          <div className="text-xl font-bold text-[#002D63]">{stats.ocupacionPromedio}%</div>
        </div>
      )}
      
      {filtroMunicipio === 'todos' && (
        <div className="border-t pt-3 mt-3">
          <h3 className="text-[11px] uppercase tracking-wide text-gray-500 font-medium mb-2">Por municipio</h3>
          <div className="space-y-1">
            {municipios.map(m => {
              const count = parquesFiltrados.filter(p => p.municipio === m).length
              if (count === 0) return null
              return (
                <button key={m} onClick={() => setFiltroMunicipio(m)}
                  className="w-full flex items-center justify-between text-xs hover:bg-gray-50 rounded px-2 py-1.5 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getColorByMunicipio(m) }} />
                    <span className="text-gray-700">{m}</span>
                  </div>
                  <span className="font-semibold text-gray-500 tabular-nums">{count}</span>
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
        <label className="block text-[11px] uppercase tracking-wide text-gray-500 font-medium mb-1.5">Municipio</label>
        <select value={filtroMunicipio} onChange={(e) => setFiltroMunicipio(e.target.value)}
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white">
          <option value="todos">Todos ({parques.length})</option>
          {municipios.map(m => <option key={m} value={m}>{m} ({parques.filter(p => p.municipio === m).length})</option>)}
        </select>
      </div>
      <div>
        <label className="block text-[11px] uppercase tracking-wide text-gray-500 font-medium mb-1.5">Tipo</label>
        <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white">
          <option value="todos">Todos</option>
          {tipos.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-[11px] uppercase tracking-wide text-gray-500 font-medium mb-1.5">Desarrolladora</label>
        <select value={filtroDesarrolladora} onChange={(e) => setFiltroDesarrolladora(e.target.value)}
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white">
          <option value="todos">Todas</option>
          {desarrolladoras.map(dev => <option key={dev} value={dev}>{dev}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-[11px] uppercase tracking-wide text-gray-500 font-medium mb-1.5">
          Precio venta máximo: ${filtroPrecioMax.toLocaleString()} MXN/m²
        </label>
        <input type="range" min="1000" max="10000" step="500" value={filtroPrecioMax}
          onChange={(e) => setFiltroPrecioMax(Number(e.target.value))} className="w-full accent-[#002D63]" />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>$1,000</span><span>$10,000</span>
        </div>
      </div>
      {(filtroMunicipio !== 'todos' || filtroTipo !== 'todos' || filtroDesarrolladora !== 'todos') && (
        <button onClick={() => { setFiltroMunicipio('todos'); setFiltroTipo('todos'); setFiltroDesarrolladora('todos'); setFiltroPrecioMax(10000); }}
          className="w-full text-xs text-[#002D63] font-medium py-2 border border-[#002D63] rounded hover:bg-[#002D63] hover:text-white transition-colors">
          Limpiar filtros
        </button>
      )}
    </div>
  )

  const ListaContent = () => (
    <div className="space-y-1.5">
      {parquesFiltrados.map(parque => (
        <button key={parque.id}
          onClick={() => { setSelectedParque(parque); setPanelOpen(false); }}
          className="w-full text-left p-3 rounded border border-gray-100 hover:border-gray-300 hover:bg-gray-50/50 transition-colors">
          <div className="font-medium text-sm text-gray-900">{parque.nombre}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: getColorByMunicipio(parque.municipio) }} />
            <span className="text-[11px] text-gray-500">{parque.municipio}</span>
            {parque.desarrolladora && (
              <><span className="text-[11px] text-gray-300">·</span>
              <span className="text-[11px] text-gray-500">{parque.desarrolladora}</span></>
            )}
          </div>
          {(parque.renta_usd_m2_min || parque.venta_mxn_m2_min) && (
            <div className="mt-1.5 flex gap-3 text-[11px]">
              {parque.renta_usd_m2_min && <span className="text-[#002D63]">${parque.renta_usd_m2_min}–${parque.renta_usd_m2_max} USD/m²</span>}
              {parque.venta_mxn_m2_min && <span className="text-[#D35400]">${parque.venta_mxn_m2_min.toLocaleString()} MXN/m²</span>}
            </div>
          )}
        </button>
      ))}
    </div>
  )

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
      <style dangerouslySetInnerHTML={{ __html: popupStyles }} />
      {/* Header */}
      <div className="bg-[#002D63] text-white px-4 py-3 sm:py-4">
        <h1 className="text-base sm:text-2xl font-bold leading-tight">{headerTitle}</h1>
        <p className="text-xs sm:text-sm opacity-80 mt-0.5">{headerSubtitle}</p>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 bg-white border-r overflow-y-auto p-4 shrink-0">
          <div className="mb-6">
            <h2 className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-3">
              Estadísticas {filtroMunicipio === 'todos' ? 'AMM' : filtroMunicipio}
            </h2>
            <StatsContent />
          </div>
          <div className="mb-6">
            <h2 className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-3">Filtros</h2>
            <FiltrosContent />
          </div>
          <div>
            <h2 className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-3">
              Parques ({parquesFiltrados.length})
            </h2>
            <ListaContent />
          </div>
        </aside>

        {/* Map */}
        <div className="flex-1 relative">
          <Map
            initialViewState={{ longitude: -100.30, latitude: 25.75, zoom: 10 }}
            style={{ width: '100%', height: '100%' }}
            mapStyle={mapStyle === 'streets' ? 'mapbox://styles/mapbox/light-v11' : 'mapbox://styles/mapbox/satellite-streets-v12'}
            mapboxAccessToken={MAPBOX_TOKEN}
          >
            {/* Park markers */}
            {parquesFiltrados.map(parque => (
              <Marker key={parque.id} longitude={parque.lng} latitude={parque.lat} anchor="center"
                onClick={(e) => { e.originalEvent.stopPropagation(); setSelectedParque(parque); setSelectedPOI(null); setPanelOpen(false); }}>
                <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-[1.5px] border-white shadow-md cursor-pointer hover:scale-150 transition-transform"
                  style={{ backgroundColor: getColorByMunicipio(parque.municipio) }} title={parque.nombre} />
              </Marker>
            ))}

            {/* Strategic POIs */}
            {showPOIs && STRATEGIC_POIS.filter(poi => poiCategories[poi.categoria]).map((poi, i) => {
              const config = POI_CATEGORY_CONFIG[poi.categoria]
              const Icon = getPOIIcon(poi)
              return (
                <Marker key={`poi-${i}`} longitude={poi.lng} latitude={poi.lat} anchor="center"
                  onClick={(e) => { e.originalEvent.stopPropagation(); setSelectedPOI(poi); setSelectedParque(null); }}>
                  <div className="w-7 h-7 rounded border-[1.5px] border-white shadow-md cursor-pointer hover:scale-125 transition-transform flex items-center justify-center"
                    style={{ backgroundColor: config.color }} title={poi.nombre}>
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                </Marker>
              )
            })}

            {/* POI Popup */}
            {selectedPOI && (
              <Popup longitude={selectedPOI.lng} latitude={selectedPOI.lat} anchor="top"
                onClose={() => setSelectedPOI(null)} closeOnClick={false} maxWidth="300px">
                <div className="p-3 max-w-[260px]">
                  <div className="flex items-start gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded flex items-center justify-center shrink-0"
                      style={{ backgroundColor: POI_CATEGORY_CONFIG[selectedPOI.categoria].color }}>
                      {(() => { const Icon = getPOIIcon(selectedPOI); return <Icon className="w-4 h-4 text-white" /> })()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm leading-tight text-gray-900">{selectedPOI.nombre}</h3>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                        {POI_CATEGORY_CONFIG[selectedPOI.categoria].label}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{selectedPOI.descripcion}</p>
                </div>
              </Popup>
            )}

            {/* Park Popup */}
            {selectedParque && (
              <Popup longitude={selectedParque.lng} latitude={selectedParque.lat} anchor="top"
                onClose={() => setSelectedParque(null)} closeOnClick={false} maxWidth="320px">
                <div className="p-3 max-w-[280px]">
                  <h3 className="font-semibold text-sm mb-2 text-gray-900">{selectedParque.nombre}</h3>
                  
                  <div className="text-xs text-gray-500 space-y-0.5 mb-2">
                    <div className="flex items-center gap-1.5">
                      <IconPin className="w-3 h-3 text-gray-400" />
                      <span>{selectedParque.municipio}, NL</span>
                    </div>
                    {selectedParque.desarrolladora && (
                      <div className="flex items-center gap-1.5">
                        <IconBuilding className="w-3 h-3 text-gray-400" />
                        <span>{selectedParque.desarrolladora}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <IconFactory className="w-3 h-3 text-gray-400" />
                      <span>{selectedParque.tipo}</span>
                    </div>
                  </div>

                  {(selectedParque.renta_usd_m2_min || selectedParque.venta_mxn_m2_min) && (
                    <div className="border-t pt-2 mb-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">Precios</h4>
                        {selectedParque.precio_confianza && selectedParque.precio_confianza !== 'sin_dato' && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                            selectedParque.precio_confianza === 'verificado' 
                              ? 'bg-green-50 text-green-700 border border-green-100' 
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {selectedParque.precio_confianza === 'verificado' ? 'Verificado' : 'Estimado'}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        {selectedParque.renta_usd_m2_min && (
                          <div className="bg-[#002D63]/5 p-1.5 rounded text-xs border border-[#002D63]/10">
                            <span className="text-[#002D63]/70 text-[11px]">Renta </span>
                            <span className="font-semibold text-[#002D63]">
                              ${selectedParque.renta_usd_m2_min}–${selectedParque.renta_usd_m2_max} USD/m²/mes
                            </span>
                          </div>
                        )}
                        {selectedParque.venta_mxn_m2_min && (
                          <div className="bg-[#D35400]/5 p-1.5 rounded text-xs border border-[#D35400]/10">
                            <span className="text-[#D35400]/70 text-[11px]">Venta </span>
                            <span className="font-semibold text-[#D35400]">
                              ${selectedParque.venta_mxn_m2_min.toLocaleString()}–${(selectedParque.venta_mxn_m2_max || 0).toLocaleString()} MXN/m²
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedParque.ocupacion_pct !== null && (
                    <div className="border-t pt-2 mb-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">Ocupación</span>
                        <span className="font-bold text-[#002D63]">{selectedParque.ocupacion_pct}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1 mt-1.5">
                        <div className="bg-[#002D63] h-1 rounded-full" style={{ width: `${selectedParque.ocupacion_pct}%` }} />
                      </div>
                    </div>
                  )}

                  {selectedParque.descripcion && (
                    <div className="border-t pt-2">
                      <p className="text-[11px] text-gray-500 leading-relaxed">{selectedParque.descripcion}</p>
                    </div>
                  )}
                </div>
              </Popup>
            )}
          </Map>

          {/* Map controls — top right */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
            {/* Map style */}
            <button
              className="bg-white text-gray-700 px-3 py-2 rounded shadow-sm text-[11px] font-medium flex items-center gap-2 hover:bg-gray-50 border border-gray-200 uppercase tracking-wide"
              onClick={() => setMapStyle(s => s === 'streets' ? 'satellite' : 'streets')}
            >
              {mapStyle === 'streets' ? <><IconSatellite className="w-3.5 h-3.5 text-gray-500" /> Satélite</> : <><IconMap className="w-3.5 h-3.5 text-gray-500" /> Mapa</>}
            </button>
            
            {/* POI layer control */}
            <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
              <button
                className={`w-full px-3 py-2 text-[11px] font-medium flex items-center gap-2 transition-colors uppercase tracking-wide ${showPOIs ? 'text-[#002D63]' : 'text-gray-400'}`}
                onClick={() => setShowPOIs(v => !v)}
              >
                <IconLayers className={`w-3.5 h-3.5 ${showPOIs ? 'text-[#002D63]' : 'text-gray-400'}`} />
                <span className="flex-1 text-left">Capas</span>
                <IconChevron down={showPOIs} className="w-3 h-3" />
              </button>
              {showPOIs && (
                <div className="border-t border-gray-100 px-2.5 py-2 space-y-1.5">
                  {(Object.entries(POI_CATEGORY_CONFIG) as [POICategory, typeof POI_CATEGORY_CONFIG.logistica][]).map(([key, config]) => {
                    const Icon = config.icon
                    return (
                      <label key={key} className="flex items-center gap-2 text-[11px] cursor-pointer hover:bg-gray-50 rounded px-1 py-1 transition-colors">
                        <input type="checkbox" checked={poiCategories[key as POICategory]}
                          onChange={() => setPOICategories(prev => ({ ...prev, [key]: !prev[key as POICategory] }))}
                          className="rounded border-gray-300 text-[#002D63] w-3 h-3 accent-[#002D63]" />
                        <span className="w-4 h-4 rounded flex items-center justify-center" style={{ backgroundColor: config.color }}>
                          <Icon className="w-2.5 h-2.5 text-white" />
                        </span>
                        <span className="text-gray-600">{config.label}</span>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Municipality quick filter chip */}
          <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 max-w-[60%]">
            {filtroMunicipio !== 'todos' && (
              <button onClick={() => setFiltroMunicipio('todos')}
                className="bg-white text-gray-700 px-2.5 py-1.5 rounded shadow-sm text-[11px] font-medium border border-gray-200 hover:bg-gray-50 flex items-center gap-1">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6 6 18M6 6l12 12"/></svg>
                {filtroMunicipio}
              </button>
            )}
          </div>

          {/* Mobile floating button */}
          <button className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#002D63] text-white px-5 py-2.5 rounded-full shadow-lg text-xs font-medium z-10 flex items-center gap-2 uppercase tracking-wide"
            onClick={() => setPanelOpen(true)}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            {parquesFiltrados.length} Parques
          </button>
        </div>

        {/* Mobile Bottom Sheet */}
        {panelOpen && (
          <>
            <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setPanelOpen(false)} />
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[80vh] flex flex-col shadow-2xl">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-gray-200 rounded-full" />
              </div>
              <button className="absolute top-3 right-4 p-1 text-gray-400" onClick={() => setPanelOpen(false)}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex border-b px-4 pt-1">
                {(['lista', 'filtros', 'stats'] as const).map(tab => (
                  <button key={tab}
                    className={`flex-1 py-2.5 text-[11px] uppercase tracking-wider font-medium text-center border-b-2 transition-colors ${
                      activeTab === tab ? 'border-[#002D63] text-[#002D63]' : 'border-transparent text-gray-400'
                    }`}
                    onClick={() => setActiveTab(tab)}>
                    {tab === 'lista' ? `Parques (${parquesFiltrados.length})` : tab === 'filtros' ? 'Filtros' : 'Datos'}
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
