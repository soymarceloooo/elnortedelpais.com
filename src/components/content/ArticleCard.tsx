import Link from "next/link";
import type { ArticleFrontmatter } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import SeriesBadge from "./SeriesBadge";

export default function ArticleCard({
  article,
}: {
  article: ArticleFrontmatter;
}) {
  return (
    <article className="group border-b border-zinc-200 py-6 first:pt-0 last:border-0">
      <Link href={`/noticias/${article.slug}`} className="block">
        <div className="flex items-center gap-3">
          <SeriesBadge series={article.series} />
          <time className="font-sans text-xs text-[#6b6b6b] uppercase tracking-wide">
            {formatDate(article.date)}
          </time>
        </div>
        <h3 className="mt-3 font-display text-2xl font-bold text-[#1a1a1a] group-hover:text-[#FF6B35] transition-colors leading-tight">
          {article.title}
        </h3>
        <p className="mt-2 font-serif text-[#1a1a1a] line-clamp-2 leading-relaxed">
          {article.description}
        </p>
        {article.tags && article.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {article.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="font-sans border border-[#FF6B35] px-3 py-1 text-xs text-[#FF6B35] font-semibold uppercase tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  );
}
