export interface Parque {
  id: number
  nombre: string
  municipio: string
  desarrolladora: string | null
  lat: number
  lng: number
  hectareas: number | null
  ocupacion_pct: number | null
  tipo: 'Industrial' | 'Tecnológico' | 'Logístico' | 'Mixto'
  año_fundacion: number | null
  descripcion: string | null
  // Precios
  renta_usd_m2_min?: number | null
  renta_usd_m2_max?: number | null
  venta_mxn_m2_min?: number | null
  venta_mxn_m2_max?: number | null
  hectareas_totales?: number | null
  hectareas_disponibles?: number | null
  lote_minimo_m2?: number | null
  precio_fuente?: string | null
  precio_confianza?: 'verificado' | 'estimado' | 'sin_dato'
  precio_actualizado_at?: string | null
  created_at?: string
  updated_at?: string
}

export type ParqueTipo = 'Industrial' | 'Tecnológico' | 'Logístico' | 'Mixto'

export interface MapViewport {
  latitude: number
  longitude: number
  zoom: number
}
