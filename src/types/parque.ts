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
  created_at?: string
  updated_at?: string
}

export type ParqueTipo = 'Industrial' | 'Tecnológico' | 'Logístico' | 'Mixto'

export interface MapViewport {
  latitude: number
  longitude: number
  zoom: number
}
