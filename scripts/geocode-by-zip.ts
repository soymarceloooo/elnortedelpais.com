// Geocodificar usando códigos postales y referencias específicas
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

const referencias = [
  { nombre: "La Sierra Industrial Park", query: "CP 66026 Valle de Lincoln García Nuevo León Mexico" },
  { nombre: "Terra Park Dominio", query: "CP 66036 Dominio Cumbres García Nuevo León Mexico" },
  { nombre: "Terra Park García (ref)", query: "Libramiento Noreste García Nuevo León Mexico" },
  { nombre: "FINSA García (ref)", query: "García industrial Nuevo León Mexico" },
  { nombre: "Stiva García (ref)", query: "García industrial park Nuevo León Mexico" },
  { nombre: "Las Americas (confirmado)", query: "Parque Industrial Las Americas Apodaca Nuevo León" },
  { nombre: "Ciénega de Flores (ref)", query: "Ciénega de Flores Nuevo León Mexico industrial" },
  { nombre: "Dominio Cumbres (punto de referencia)", query: "Dominio Cumbres García Nuevo León Mexico" },
  { nombre: "Libramiento Noreste García", query: "Libramiento Noreste García Nuevo León Mexico" },
  { nombre: "Av Lincoln García", query: "Avenida Abraham Lincoln 1000 García Nuevo León" }
]

async function main() {
  console.log('Geocodificando referencias...\n')
  
  for (const ref of referencias) {
    console.log(`${ref.nombre}:`)
    
    const result = await geocode(ref.query)
    
    if (result) {
      console.log(`  ✅ ${result.lat}, ${result.lng}`)
      console.log(`     ${result.display_name}`)
    } else {
      console.log(`  ❌ No encontrado`)
    }
    
    console.log()
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

main()
