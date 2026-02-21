import Link from "next/link";
import type { PropertyFrontmatter } from "@/lib/types";

export default function PropertyCard({
  property,
}: {
  property: PropertyFrontmatter;
}) {
  return (
    <article className="group overflow-hidden border-2 border-zinc-200 bg-white transition-all hover:border-[#FF6B35]">
      <div className="bg-[#f5f5f5] px-6 py-8 text-center border-b-2 border-zinc-200">
        <span className="text-4xl">
          {property.type === "industrial" ? "🏭" : "🏢"}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 font-sans text-xs text-[#6b6b6b] uppercase tracking-wide">
          <span>
            {property.city}, {property.state}
          </span>
          <span className="border border-[#002D63] px-2 py-0.5 text-[#002D63] font-semibold">
            {property.type}
          </span>
        </div>
        <Link href={`/propiedades/${property.slug}`}>
          <h3 className="mt-3 font-display text-lg font-bold text-[#1a1a1a] group-hover:text-[#FF6B35] transition-colors leading-tight">
            {property.title}
          </h3>
        </Link>
        <p className="mt-2 font-serif text-sm text-[#1a1a1a] line-clamp-2 leading-relaxed">
          {property.description}
        </p>
        {property.price_range && (
          <p className="mt-3 font-display text-sm font-bold text-[#002D63]">
            {property.price_range}
          </p>
        )}
        {property.features && property.features.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {property.features.slice(0, 3).map((f) => (
              <span
                key={f}
                className="font-sans bg-[#f5f5f5] px-2 py-1 text-xs text-[#1a1a1a]"
              >
                {f}
              </span>
            ))}
          </div>
        )}
        <Link
          href={`/propiedades/${property.slug}`}
          className="mt-4 inline-block font-sans text-sm font-semibold text-[#FF6B35] hover:text-[#002D63] uppercase tracking-wide"
        >
          Ver detalles →
        </Link>
      </div>
    </article>
  );
}
