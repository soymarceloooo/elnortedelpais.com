import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug } from "@/lib/content";
import { formatDate, getReadingTime } from "@/lib/utils";
import SeriesBadge from "@/components/content/SeriesBadge";
import NewsletterForm from "@/components/lead/NewsletterForm";
import WhatsAppButton from "@/components/lead/WhatsAppButton";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const readingTime = getReadingTime(article.content);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-12 lg:grid-cols-3">
        {/* Article */}
        <article className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <SeriesBadge series={article.series} />
            <time className="text-sm text-zinc-500">
              {formatDate(article.date)}
            </time>
            <span className="text-sm text-zinc-400">
              {readingTime} min de lectura
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold text-zinc-900 sm:text-4xl">
            {article.title}
          </h1>

          <p className="mt-3 text-lg text-zinc-600">{article.description}</p>

          {article.tags && article.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <hr className="my-8 border-zinc-200" />

          {/* MDX Content */}
          <div className="prose max-w-none">
            <MDXRemote
              source={article.content}
              options={{
                mdxOptions: { remarkPlugins: [remarkGfm] },
              }}
            />
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 rounded-lg bg-zinc-50 p-6">
            <h3 className="text-lg font-bold text-zinc-900">
              ¿Te interesa invertir en bienes raíces industriales?
            </h3>
            <p className="mt-1 text-sm text-zinc-600">
              Contáctanos para conocer las oportunidades disponibles en el norte
              de México.
            </p>
            <div className="mt-4">
              <WhatsAppButton
                message={`Hola, leí el artículo "${article.title}" y me gustaría más información.`}
              />
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="rounded-lg border border-zinc-200 p-5">
            <h3 className="text-lg font-bold text-zinc-900">
              Resumen semanal
            </h3>
            <p className="mt-1 text-sm text-zinc-600">
              Los datos más relevantes del mercado industrial, cada semana.
            </p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
