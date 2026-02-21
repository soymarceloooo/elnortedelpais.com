import { Parque } from './parque'

export interface Database {
  public: {
    Tables: {
      parques_industriales: {
        Row: Parque
        Insert: Omit<Parque, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Parque, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
