// Script para verificar ubicaciones de parques usando búsquedas web
// y extrayendo coordenadas de resultados

const parques = [
  { nombre: "La Sierra Industrial Park", busqueda: "La Sierra Industrial Park García Nuevo León" },
  { nombre: "Terra Park Dominio", busqueda: "Terra Park Dominio García Nuevo León Dominio Cumbres" },
  { nombre: "Terra Park García", busqueda: "Terra Park García Libramiento Noreste" },
  { nombre: "Terra Park ADN", busqueda: "Terra Park ADN García" },
  { nombre: "FINSA Monterrey García", busqueda: "FINSA García Nuevo León parque industrial" },
  { nombre: "Stiva García Industrial Park", busqueda: "Stiva García Industrial Park" },
  { nombre: "Pocket Park Poniente", busqueda: "Pocket Park Poniente García GP Desarrollos" },
  { nombre: "Pocket Park Norte", busqueda: "Pocket Park Norte García GP Desarrollos" },
  { nombre: "Las Americas Industrial Park", busqueda: "Las Americas Industrial Park García" },
  { nombre: "Monterrey Technology Park", busqueda: "Monterrey Technology Park García VYNMSA" },
  { nombre: "CPA Logistics Center ADN", busqueda: "CPA Logistics García CPA Americas" },
  { nombre: "Pocket Park Norte 2", busqueda: "Pocket Park Norte 2 García Volvo" }
]

console.log("Parques a verificar:")
parques.forEach((p, i) => {
  console.log(`${i + 1}. ${p.nombre}`)
  console.log(`   Búsqueda: ${p.busqueda}`)
  console.log(`   Google: https://www.google.com/maps/search/${encodeURIComponent(p.busqueda)}`)
  console.log()
})
