-- Agregar campos detallados de precios
ALTER TABLE parques_industriales
  ADD COLUMN IF NOT EXISTS renta_usd_m2_min DECIMAL(8,2),
  ADD COLUMN IF NOT EXISTS renta_usd_m2_max DECIMAL(8,2),
  ADD COLUMN IF NOT EXISTS venta_mxn_m2_min DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS venta_mxn_m2_max DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS hectareas_totales DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS hectareas_disponibles DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS lote_minimo_m2 INTEGER,
  ADD COLUMN IF NOT EXISTS precio_fuente TEXT,
  ADD COLUMN IF NOT EXISTS precio_confianza TEXT CHECK (precio_confianza IN ('verificado', 'estimado', 'sin_dato')) DEFAULT 'sin_dato',
  ADD COLUMN IF NOT EXISTS precio_actualizado_at TIMESTAMPTZ;

-- Índice para búsquedas por rango de precio
CREATE INDEX IF NOT EXISTS idx_parques_renta_min ON parques_industriales(renta_usd_m2_min);
CREATE INDEX IF NOT EXISTS idx_parques_venta_min ON parques_industriales(venta_mxn_m2_min);

-- Actualizar vista agregada con nuevos campos
DROP VIEW IF EXISTS parques_por_municipio;
CREATE OR REPLACE VIEW parques_por_municipio AS
SELECT 
  municipio,
  COUNT(*) as total_parques,
  ROUND(AVG(ocupacion_pct), 1) as ocupacion_promedio,
  ROUND(AVG((renta_usd_m2_min + renta_usd_m2_max) / 2), 2) as renta_promedio_usd,
  ROUND(AVG((venta_mxn_m2_min + venta_mxn_m2_max) / 2), 0) as venta_promedio_mxn,
  ROUND(SUM(hectareas_totales), 2) as hectareas_totales,
  ROUND(SUM(hectareas_disponibles), 2) as hectareas_disponibles,
  COUNT(*) FILTER (WHERE hectareas_disponibles > 0) as parques_con_espacio
FROM parques_industriales
GROUP BY municipio
ORDER BY total_parques DESC;

-- Comentarios
COMMENT ON COLUMN parques_industriales.renta_usd_m2_min IS 'Precio mínimo de renta en USD por m² al mes';
COMMENT ON COLUMN parques_industriales.renta_usd_m2_max IS 'Precio máximo de renta en USD por m² al mes';
COMMENT ON COLUMN parques_industriales.venta_mxn_m2_min IS 'Precio mínimo de venta en MXN por m²';
COMMENT ON COLUMN parques_industriales.venta_mxn_m2_max IS 'Precio máximo de venta en MXN por m²';
COMMENT ON COLUMN parques_industriales.precio_confianza IS 'Nivel de confianza: verificado (datos directos), estimado (basado en mercado), sin_dato';
