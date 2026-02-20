import type { Series } from "@/lib/types";
import { SERIES_CONFIG } from "@/lib/types";

export default function SeriesBadge({ series }: { series: Series }) {
  const config = SERIES_CONFIG[series];
  if (!config) return null;

  return (
    <span
      className={`inline-block font-sans px-3 py-1 text-xs font-bold uppercase tracking-wider text-white ${config.color}`}
    >
      {config.label}
    </span>
  );
}
