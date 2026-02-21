// Geocodificar parques usando Nominatim (OpenStreetMap)
async function geocode(query: string) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'ElNorteDelPais/1.0'
    }
  })
  
  const data = await response.json()
  
  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      display_name: data[0].display_name
    }
  }
  
  return null
}

const parques = [
  { id: 12, nombre: "La Sierra Industrial Park", query: "Av Abraham Lincoln García Nuevo León Mexico" },
  { id: 4, nombre: "Terra Park Dominio", query: "Terra Park Dominio Cumbres García Nuevo León Mexico" },
  { id: 5, nombre: "Terra Park García", query: "Terra Park García Libramiento Noreste Nuevo León Mexico" },
  { id: 3, nombre: "Terra Park ADN", query: "Terra Park ADN García Nuevo León Mexico" },
  { id: 9, nombre: "FINSA Monterrey García", query: "FINSA García Nuevo León Mexico" },
  { id: 6, nombre: "Stiva García Industrial Park", query: "Stiva García Industrial Park Nuevo León Mexico" },
  { id: 8, nombre: "Pocket Park Poniente", query: "Pocket Park Poniente García GP Desarrollos Nuevo León" },
  { id: 7, nombre: "Pocket Park Norte", query: "Ciénega de Flores Nuevo León Mexico industrial park" },
  { id: 1, nombre: "Las Americas Industrial Park", query: "Parque Industrial Las Americas Apodaca Nuevo León Mexico" },
  { id: 2, nombre: "Monterrey Technology Park", query: "Monterrey Technology Park Ciénega de Flores Nuevo León" },
  { id: 10, nombre: "CPA Logistics Center ADN", query: "CPA Americas García Nuevo León Mexico" },
  { id: 11, nombre: "Pocket Park Norte 2", query: "Ciénega de Flores Volvo Nuevo León Mexico" }
]

async function main() {
  console.log('Geocodificando parques...\n')
  
  for (const parque of parques) {
    console.log(`${parque.nombre}:`)
    console.log(`  Búsqueda: ${parque.query}`)
    
    const result = await geocode(parque.query)
    
    if (result) {
      console.log(`  ✅ Encontrado: ${result.lat}, ${result.lng}`)
      console.log(`     ${result.display_name}`)
    } else {
      console.log(`  ❌ No encontrado`)
    }
    
    console.log()
    
    // Esperar 1 segundo entre requests (política de Nominatim)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

main()
