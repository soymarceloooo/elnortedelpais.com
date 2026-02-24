import type { MetadataRoute } from "next";
import { getAllArticles, getAllProperties } from "@/lib/content";
import { supabaseServer } from "@/lib/supabase-server";
import { MUNICIPIOS, slugifyParque } from "@/lib/municipio-utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://elnortedelpais.com";

  const articles = getAllArticles().map((article) => ({
    url: `${baseUrl}/noticias/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const properties = getAllProperties().map((property) => ({
    url: `${baseUrl}/propiedades/${property.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  // Municipality pages
  const municipioPages = MUNICIPIOS.map((m) => ({
    url: `${baseUrl}/mapa-parques/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // Individual park pages
  const { data: parquesData } = await supabaseServer
    .from("parques_industriales")
    .select("*");

  const parquePages = ((parquesData || []) as { nombre: string }[]).map((p) => ({
    url: `${baseUrl}/parques/${slugifyParque(p.nombre)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/noticias`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/propiedades`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mapa-parques`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/mercado`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...municipioPages,
    ...parquePages,
    ...articles,
    ...properties,
  ];
}
