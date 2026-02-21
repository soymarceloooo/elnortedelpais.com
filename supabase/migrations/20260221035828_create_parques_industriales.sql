-- Tabla de parques industriales
CREATE TABLE parques_industriales (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  municipio TEXT NOT NULL,
  desarrolladora TEXT,
  lat DECIMAL(10, 6) NOT NULL,
  lng DECIMAL(10, 6) NOT NULL,
  hectareas DECIMAL(10, 2),
  ocupacion_pct DECIMAL(5, 2),
  tipo TEXT CHECK (tipo IN ('Industrial', 'Logístico', 'Tecnológico', 'Mixto')),
  año_fundacion INTEGER,
  descripcion TEXT,
  servicios TEXT[],
  precio_m2_usd DECIMAL(10, 2),
  disponibilidad BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Índices para búsquedas rápidas
CREATE INDEX idx_parques_municipio ON parques_industriales(municipio);
CREATE INDEX idx_parques_desarrolladora ON parques_industriales(desarrolladora);
CREATE INDEX idx_parques_tipo ON parques_industriales(tipo);

-- Enable Row Level Security
ALTER TABLE parques_industriales ENABLE ROW LEVEL SECURITY;

-- Política: todos pueden leer
CREATE POLICY "Lectura pública de parques"
  ON parques_industriales
  FOR SELECT
  USING (true);

-- Política: solo autenticados pueden insertar/actualizar (para admin futuro)
CREATE POLICY "Solo admin puede modificar"
  ON parques_industriales
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
CREATE TRIGGER update_parques_updated_at
  BEFORE UPDATE ON parques_industriales
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Vista agregada por municipio (para stats)
CREATE OR REPLACE VIEW parques_por_municipio AS
SELECT 
  municipio,
  COUNT(*) as total_parques,
  AVG(ocupacion_pct) as ocupacion_promedio,
  AVG(precio_m2_usd) as precio_promedio_m2,
  SUM(hectareas) as hectareas_totales
FROM parques_industriales
GROUP BY municipio
ORDER BY total_parques DESC;
