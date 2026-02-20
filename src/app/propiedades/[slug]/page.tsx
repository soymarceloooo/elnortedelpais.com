import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProperties, getPropertyBySlug } from "@/lib/content";
import ContactForm from "@/components/lead/ContactForm";
import WhatsAppButton from "@/components/lead/WhatsAppButton";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return getAllProperties().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) return {};

  return {
    title: property.title,
    description: property.description,
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-12 lg:grid-cols-3">
        {/* Property Info */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>
              {property.city}, {property.state}
            </span>
            <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium capitalize">
              {property.type}
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-bold text-zinc-900 sm:text-4xl">
            {property.title}
          </h1>

          <p className="mt-3 text-lg text-zinc-600">
            {property.description}
          </p>

          {/* Key Info */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {property.price_range && (
              <div className="rounded-lg bg-emerald-50 p-4">
                <p className="text-sm text-emerald-600">Rango de precios</p>
                <p className="text-lg font-bold text-emerald-800">
                  {property.price_range}
                </p>
              </div>
            )}
            {property.area_range && (
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-600">Superficie disponible</p>
                <p className="text-lg font-bold text-blue-800">
                  {property.area_range}
                </p>
              </div>
            )}
          </div>

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-bold text-zinc-900">
                Características
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {property.features.map((f) => (
                  <span
                    key={f}
                    className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          <hr className="my-8 border-zinc-200" />

          {/* MDX Content */}
          <div className="prose max-w-none">
            <MDXRemote
              source={property.content}
              options={{
                mdxOptions: { remarkPlugins: [remarkGfm] },
              }}
            />
          </div>
        </div>

        {/* Sidebar - Contact */}
        <aside className="space-y-6">
          <div className="rounded-lg border border-zinc-200 p-5">
            <h3 className="text-lg font-bold text-zinc-900">
              Solicitar información
            </h3>
            <p className="mt-1 text-sm text-zinc-600">
              Completa el formulario y nos pondremos en contacto contigo.
            </p>
            <div className="mt-4">
              <ContactForm />
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-zinc-500">¿Prefieres WhatsApp?</p>
            <div className="mt-2">
              <WhatsAppButton
                message={`Hola, me interesa la propiedad: ${property.title}. Me gustaría más información.`}
              />
            </div>
          </div>

          {property.external_link && (
            <a
              href={property.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-zinc-200 p-4 text-center text-sm font-medium text-blue-700 hover:bg-zinc-50"
            >
              Ver en sitio del desarrollador →
            </a>
          )}
        </aside>
      </div>
    </div>
  );
}
