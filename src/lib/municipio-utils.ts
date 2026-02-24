export interface MunicipioInfo {
  nombre: string
  slug: string
}

export const MUNICIPIOS: MunicipioInfo[] = [
  { nombre: 'Apodaca', slug: 'apodaca' },
  { nombre: 'Ciénega de Flores', slug: 'cienega-de-flores' },
  { nombre: 'El Carmen', slug: 'el-carmen' },
  { nombre: 'García', slug: 'garcia' },
  { nombre: 'General Escobedo', slug: 'general-escobedo' },
  { nombre: 'Guadalupe', slug: 'guadalupe' },
  { nombre: 'Juárez', slug: 'juarez' },
  { nombre: 'Monterrey', slug: 'monterrey' },
  { nombre: 'Pesquería', slug: 'pesqueria' },
  { nombre: 'Salinas Victoria', slug: 'salinas-victoria' },
  { nombre: 'San Nicolás de los Garza', slug: 'san-nicolas-de-los-garza' },
  { nombre: 'San Pedro Garza García', slug: 'san-pedro-garza-garcia' },
  { nombre: 'Santa Catarina', slug: 'santa-catarina' },
]

export function slugify(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function slugifyParque(nombre: string): string {
  return slugify(nombre)
}

export function getMunicipioBySlug(slug: string): MunicipioInfo | undefined {
  return MUNICIPIOS.find(m => m.slug === slug)
}

export function getMunicipioSlug(nombre: string): string {
  const found = MUNICIPIOS.find(m => m.nombre === nombre)
  return found?.slug || slugify(nombre)
}
