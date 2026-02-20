import type { Metadata } from "next";
import { getAllProperties } from "@/lib/content";
import PropertyCard from "@/components/content/PropertyCard";
import WhatsAppButton from "@/components/lead/WhatsAppButton";

export const metadata: Metadata = {
  title: "Propiedades",
  description:
    "Directorio de propiedades industriales y comerciales disponibles en el norte de México.",
};

export default function PropiedadesPage() {
  const properties = getAllProperties();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-zinc-900">Propiedades</h1>
      <p className="mt-2 text-zinc-600">
        Propiedades industriales y comerciales disponibles en el norte de
        México.
      </p>

      {properties.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.slug} property={property} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-lg bg-zinc-50 p-12 text-center">
          <p className="text-lg text-zinc-500">
            Próximamente: directorio de propiedades industriales.
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            Estamos preparando un catálogo completo de oportunidades en el norte
            de México.
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 rounded-lg bg-zinc-900 p-8 text-center text-white">
        <h2 className="text-2xl font-bold">
          ¿Buscas un terreno industrial o comercial?
        </h2>
        <p className="mt-2 text-zinc-400">
          Te ayudamos a encontrar la propiedad ideal para tu proyecto en Nuevo
          León.
        </p>
        <div className="mt-6">
          <WhatsAppButton
            message="Hola, estoy buscando propiedades industriales/comerciales en Nuevo León. Me gustaría más información."
            label="Contáctanos por WhatsApp"
          />
        </div>
      </div>
    </div>
  );
}
