import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t-2 border-[#E3120B] bg-[#1a1a1a] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="font-display text-xl font-bold text-white">
              El Norte del País
            </h3>
            <p className="mt-3 font-serif text-sm text-zinc-300 leading-relaxed">
              Noticias, análisis e inteligencia del mercado de bienes raíces
              industriales en el norte de México.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-zinc-400">
              Secciones
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/noticias"
                  className="font-serif text-sm text-zinc-300 hover:text-[#E3120B] transition-colors"
                >
                  Noticias
                </Link>
              </li>
              <li>
                <Link
                  href="/propiedades"
                  className="font-serif text-sm text-zinc-300 hover:text-[#E3120B] transition-colors"
                >
                  Propiedades
                </Link>
              </li>
              <li>
                <Link
                  href="/mercado"
                  className="font-serif text-sm text-zinc-300 hover:text-[#E3120B] transition-colors"
                >
                  Mercado
                </Link>
              </li>
              <li>
                <Link
                  href="/nosotros"
                  className="font-serif text-sm text-zinc-300 hover:text-[#E3120B] transition-colors"
                >
                  Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-zinc-400">
              Contacto
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="mailto:contacto@elnortedelpais.com"
                  className="font-serif text-sm text-zinc-300 hover:text-[#E3120B] transition-colors"
                >
                  contacto@elnortedelpais.com
                </a>
              </li>
              <li>
                <span className="font-serif text-sm text-zinc-300">
                  Monterrey, Nuevo León, México
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center font-sans text-xs text-zinc-400">
          &copy; {new Date().getFullYear()} El Norte del País. Todos los
          derechos reservados.
        </div>
      </div>
    </footer>
  );
}
