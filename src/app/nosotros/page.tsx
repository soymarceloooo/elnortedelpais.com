import type { Metadata } from "next";
import Link from "next/link";
import NewsletterForm from "@/components/lead/NewsletterForm";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce El Norte del País: tu fuente de inteligencia del mercado de bienes raíces industriales en el norte de México.",
};

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold text-zinc-900">Nosotros</h1>

      <div className="mt-6 space-y-4 text-zinc-600">
        <p className="text-lg">
          <strong className="text-zinc-900">El Norte del País</strong> es un
          medio digital dedicado a cubrir el mercado de bienes raíces
          industriales en el norte de México.
        </p>
        <p>
          Nuestro objetivo es simple: hacer que la información del mercado
          industrial sea accesible, útil y accionable para inversionistas,
          empresarios y cualquier persona interesada en el desarrollo industrial
          de la región.
        </p>
        <p>
          Publicamos noticias, análisis de mercado, guías de inversión y datos
          que te ayudan a tomar mejores decisiones. Desde datos de vacancia
          industrial hasta análisis de zonas emergentes, cubrimos lo que importa.
        </p>
      </div>

      <hr className="my-8 border-zinc-200" />

      <h2 className="text-xl font-bold text-zinc-900">Nuestras series</h2>
      <div className="mt-4 space-y-3">
        {[
          {
            name: "Dato Industrial",
            color: "bg-blue-600",
            desc: "Estadísticas y datos duros del mercado industrial.",
          },
          {
            name: "Propiedad Destacada",
            color: "bg-amber-600",
            desc: "Análisis a fondo de propiedades y zonas industriales.",
          },
          {
            name: "Verdad o Mito",
            color: "bg-purple-600",
            desc: "Desmintiendo mitos sobre inversión en bienes raíces industriales.",
          },
          {
            name: "Radar Industrial",
            color: "bg-emerald-600",
            desc: "Noticias del sector traducidas a impacto real.",
          },
          {
            name: "Guía del Inversionista",
            color: "bg-red-600",
            desc: "Contenido educativo para tomar mejores decisiones de inversión.",
          },
        ].map((serie) => (
          <div key={serie.name} className="flex items-start gap-3">
            <span
              className={`mt-1 inline-block rounded px-2 py-0.5 text-xs font-semibold text-white ${serie.color}`}
            >
              {serie.name}
            </span>
            <p className="text-sm text-zinc-600">{serie.desc}</p>
          </div>
        ))}
      </div>

      <hr className="my-8 border-zinc-200" />

      <h2 className="text-xl font-bold text-zinc-900">Contacto</h2>
      <div className="mt-4 space-y-2 text-zinc-600">
        <p>
          Email:{" "}
          <a
            href="mailto:contacto@elnortedelpais.com"
            className="text-blue-700 hover:underline"
          >
            contacto@elnortedelpais.com
          </a>
        </p>
        <p>Monterrey, Nuevo León, México</p>
      </div>

      {/* Newsletter */}
      <div className="mt-8 rounded-lg bg-zinc-50 p-6">
        <h3 className="text-lg font-bold text-zinc-900">
          Suscríbete al resumen semanal
        </h3>
        <p className="mt-1 text-sm text-zinc-600">
          Recibe los datos más relevantes del mercado industrial cada semana.
        </p>
        <div className="mt-4">
          <NewsletterForm />
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/noticias"
          className="text-sm font-medium text-blue-700 hover:text-blue-800"
        >
          ← Ver noticias
        </Link>
      </div>
    </div>
  );
}
