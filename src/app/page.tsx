import Link from "next/link";
import { getAllArticles, getFeaturedProperties } from "@/lib/content";
import ArticleCard from "@/components/content/ArticleCard";
import PropertyCard from "@/components/content/PropertyCard";
import NewsletterForm from "@/components/lead/NewsletterForm";

export default function Home() {
  const articles = getAllArticles().slice(0, 6);
  const properties = getFeaturedProperties().slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero */}
      <section className="border-b border-zinc-200 pb-8">
        <h2 className="font-display text-3xl font-bold text-[#1a1a1a] sm:text-4xl leading-tight">
          Inteligencia del mercado industrial del norte de México
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-[#6b6b6b] font-serif leading-relaxed">
          Datos, análisis y oportunidades en bienes raíces industriales.
          Información que necesitas para tomar mejores decisiones de inversión.
        </p>
      </section>

      <div className="mt-8 grid gap-12 lg:grid-cols-3">
        {/* Articles */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
            <h2 className="font-display text-xl font-bold text-[#1a1a1a]">
              Últimas noticias
            </h2>
            <Link
              href="/noticias"
              className="font-sans text-sm font-semibold text-[#E3120B] hover:text-[#002D63] uppercase tracking-wide"
            >
              Ver todas →
            </Link>
          </div>

          {articles.length > 0 ? (
            <div className="mt-4">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-lg bg-zinc-50 p-8 text-center">
              <p className="text-zinc-500">
                Próximamente: noticias y análisis del mercado industrial.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Newsletter */}
          <div className="border-2 border-[#E3120B] p-6 bg-[#f5f5f5]">
            <h3 className="font-display text-xl font-bold text-[#1a1a1a]">
              Resumen semanal
            </h3>
            <p className="mt-2 text-sm font-serif text-[#1a1a1a] leading-relaxed">
              Recibe cada semana los datos más relevantes del mercado industrial
              en tu inbox.
            </p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>

          {/* Featured Properties */}
          {properties.length > 0 && (
            <div>
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                <h3 className="font-display text-xl font-bold text-[#1a1a1a]">
                  Propiedades destacadas
                </h3>
                <Link
                  href="/propiedades"
                  className="font-sans text-sm font-semibold text-[#E3120B] hover:text-[#002D63] uppercase tracking-wide"
                >
                  Ver todas →
                </Link>
              </div>
              <div className="mt-4 space-y-4">
                {properties.map((property) => (
                  <PropertyCard key={property.slug} property={property} />
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="border-2 border-[#002D63] bg-[#002D63] p-6 text-white">
            <h3 className="font-display text-xl font-bold">Mercado Industrial NL</h3>
            <p className="mt-2 text-sm font-sans text-zinc-300">
              Datos clave del mercado
            </p>
            <div className="mt-5 space-y-4">
              <div className="flex justify-between border-b border-white/20 pb-3">
                <span className="text-sm font-sans text-zinc-300">Inventario industrial</span>
                <span className="text-base font-display font-bold">~14M m²</span>
              </div>
              <div className="flex justify-between border-b border-white/20 pb-3">
                <span className="text-sm font-sans text-zinc-300">Tasa de vacancia</span>
                <span className="text-base font-display font-bold">~3-5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-sans text-zinc-300">Absorción neta anual</span>
                <span className="text-base font-display font-bold">~1.5M m²</span>
              </div>
            </div>
            <Link
              href="/mercado"
              className="mt-5 block text-center text-sm font-sans font-semibold text-[#E3120B] hover:text-white bg-white hover:bg-[#E3120B] py-2 px-4 transition-colors uppercase tracking-wide"
            >
              Ver datos completos →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
