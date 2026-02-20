import type { Metadata } from "next";
import { getAllArticles } from "@/lib/content";
import ArticleCard from "@/components/content/ArticleCard";
import { SERIES_CONFIG } from "@/lib/types";
import type { Series } from "@/lib/types";

export const metadata: Metadata = {
  title: "Noticias",
  description:
    "Últimas noticias y análisis del mercado de bienes raíces industriales en el norte de México.",
};

export default function NoticiasPage() {
  const articles = getAllArticles();
  const series = Object.entries(SERIES_CONFIG) as [
    Series,
    (typeof SERIES_CONFIG)[Series],
  ][];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-zinc-900">Noticias</h1>
      <p className="mt-2 text-zinc-600">
        Análisis, datos y noticias del mercado industrial del norte de México.
      </p>

      {/* Series filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        {series.map(([key, config]) => (
          <span
            key={key}
            className={`rounded px-3 py-1 text-xs font-semibold text-white ${config.color}`}
          >
            {config.label}
          </span>
        ))}
      </div>

      {/* Articles */}
      <div className="mt-8">
        {articles.length > 0 ? (
          articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))
        ) : (
          <div className="rounded-lg bg-zinc-50 p-12 text-center">
            <p className="text-lg text-zinc-500">
              Próximamente: noticias y análisis del mercado industrial.
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Estamos preparando contenido de calidad sobre el mercado
              industrial del norte de México.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
