import type { Metadata } from "next";
import Link from "next/link";
import NewsletterForm from "@/components/lead/NewsletterForm";

export const metadata: Metadata = {
  title: "Mercado Industrial",
  description:
    "Datos y análisis del mercado de bienes raíces industriales en Nuevo León y el norte de México.",
};

export default function MercadoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-zinc-900">Mercado Industrial</h1>
      <p className="mt-2 text-zinc-600">
        Panorama del mercado de bienes raíces industriales en Nuevo León y el
        norte de México.
      </p>

      {/* Key Metrics */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Inventario total",
            value: "~14M m²",
            note: "Nuevo León",
          },
          {
            label: "Tasa de vacancia",
            value: "~3-5%",
            note: "Histórico bajo",
          },
          {
            label: "Absorción neta",
            value: "~1.5M m²/año",
            note: "Tendencia al alza",
          },
          {
            label: "Precio promedio",
            value: "$5-8 USD/m²/mes",
            note: "Clase A",
          },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-lg border border-zinc-200 p-5"
          >
            <p className="text-sm text-zinc-500">{metric.label}</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">
              {metric.value}
            </p>
            <p className="mt-1 text-xs text-zinc-400">{metric.note}</p>
          </div>
        ))}
      </div>

      {/* Market Overview */}
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">
            ¿Por qué Nuevo León?
          </h2>
          <div className="mt-4 space-y-4 text-zinc-600">
            <p>
              Nuevo León se ha consolidado como el principal polo industrial del
              norte de México, impulsado por el nearshoring y la relocalización
              de cadenas de suministro globales.
            </p>
            <p>
              Con más de 40 parques industriales activos, infraestructura de
              clase mundial y conectividad logística con Estados Unidos, el
              estado ofrece condiciones ideales para la inversión industrial.
            </p>
            <p>
              Municipios como Apodaca, Ciénega de Flores, Pesquería, Salinas
              Victoria y García concentran el mayor dinamismo de nuevos
              desarrollos.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-zinc-900">
            Tendencias clave
          </h2>
          <div className="mt-4 space-y-3">
            {[
              {
                title: "Nearshoring acelerado",
                desc: "Empresas asiáticas y europeas relocalizando manufactura a México.",
              },
              {
                title: "Vacancia histórica baja",
                desc: "La demanda supera la oferta en zonas prime, impulsando nuevos desarrollos.",
              },
              {
                title: "Expansión del corredor norte",
                desc: "García, Ciénega de Flores y Salinas Victoria lideran la nueva oferta.",
              },
              {
                title: "Inversión en infraestructura",
                desc: "Nuevas vialidades, parques industriales y servicios mejoran la conectividad.",
              },
              {
                title: "Sustentabilidad industrial",
                desc: "Mayor demanda de certificaciones verdes y eficiencia energética.",
              },
            ].map((trend) => (
              <div
                key={trend.title}
                className="rounded-lg bg-zinc-50 p-4"
              >
                <h3 className="font-semibold text-zinc-900">{trend.title}</h3>
                <p className="mt-1 text-sm text-zinc-600">{trend.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Municipalities */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-zinc-900">
          Municipios industriales clave
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "Apodaca",
              desc: "Corredor industrial consolidado. Sede de Kia, Samsung y cientos de PyMEs.",
            },
            {
              name: "García",
              desc: "Explosión de nuevos parques industriales. Precios competitivos y terrenos amplios.",
            },
            {
              name: "Pesquería",
              desc: "Zona de alto crecimiento con nueva infraestructura vial y parques modernos.",
            },
            {
              name: "Ciénega de Flores",
              desc: "Corredor norte emergente con ubicación estratégica hacia la frontera.",
            },
            {
              name: "Salinas Victoria",
              desc: "Hub logístico con Interpuerto Monterrey y conectividad ferroviaria.",
            },
            {
              name: "Santa Catarina",
              desc: "Zona industrial madura con buena conectividad al área metropolitana.",
            },
          ].map((muni) => (
            <div
              key={muni.name}
              className="rounded-lg border border-zinc-200 p-4"
            >
              <h3 className="font-semibold text-zinc-900">{muni.name}</h3>
              <p className="mt-1 text-sm text-zinc-600">{muni.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="mt-12 rounded-lg bg-zinc-900 p-8 text-white">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold">
            Datos del mercado en tu inbox
          </h2>
          <p className="mt-2 text-zinc-400">
            Suscríbete para recibir nuestro reporte semanal con los datos más
            relevantes del mercado industrial.
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </div>
      </div>

      <p className="mt-8 text-xs text-zinc-400">
        Nota: Los datos presentados son estimaciones basadas en fuentes públicas
        y análisis de mercado. Para datos específicos y actualizados,{" "}
        <Link href="/propiedades" className="underline">
          contáctanos
        </Link>
        .
      </p>
    </div>
  );
}
