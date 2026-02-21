export type Series =
  | "dato-industrial"
  | "propiedad-destacada"
  | "verdad-o-mito"
  | "radar-industrial"
  | "guia-inversionista";

export type CTA = "newsletter" | "whatsapp" | "contact" | "calculator";

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  description: string;
  date: string;
  author: string;
  series: Series;
  tags: string[];
  image?: string;
  featured?: boolean;
  property_link?: string;
  cta: CTA;
}

export interface Article extends ArticleFrontmatter {
  content: string;
}

export interface PropertyFrontmatter {
  title: string;
  slug: string;
  description: string;
  location: string;
  city: string;
  state: string;
  type: "industrial" | "comercial";
  price_range?: string;
  area_range?: string;
  features: string[];
  image?: string;
  featured?: boolean;
  external_link?: string;
  whatsapp_message?: string;
}

export interface Property extends PropertyFrontmatter {
  content: string;
}

export const SERIES_CONFIG: Record<
  Series,
  { label: string; color: string; description: string }
> = {
  "dato-industrial": {
    label: "Dato Industrial",
    color: "bg-[#002D63]",
    description: "Datos y estadísticas del mercado industrial",
  },
  "propiedad-destacada": {
    label: "Propiedad Destacada",
    color: "bg-[#FF6B35]",
    description: "Análisis de propiedades y zonas industriales",
  },
  "verdad-o-mito": {
    label: "Verdad o Mito",
    color: "bg-[#6b6b6b]",
    description: "Desmintiendo mitos sobre inversión industrial",
  },
  "radar-industrial": {
    label: "Radar Industrial",
    color: "bg-[#1a1a1a]",
    description: "Noticias del sector y su impacto",
  },
  "guia-inversionista": {
    label: "Guía del Inversionista",
    color: "bg-[#002D63]",
    description: "Contenido educativo para inversionistas",
  },
};
