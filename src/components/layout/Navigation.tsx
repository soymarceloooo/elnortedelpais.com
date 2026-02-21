"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Inicio" },
  { href: "/noticias", label: "Noticias" },
  { href: "/propiedades", label: "Propiedades" },
  { href: "/mercado", label: "Mercado" },
];

export default function Navigation({ mobileOpen }: { mobileOpen: boolean }) {
  const pathname = usePathname();

  return (
    <nav
      className={`${
        mobileOpen ? "block" : "hidden"
      } sm:block`}
    >
      <ul className="flex flex-col items-center gap-0 sm:flex-row sm:justify-center sm:gap-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-5 py-3 text-sm font-sans font-semibold uppercase tracking-wide transition-colors ${
                  isActive
                    ? "text-[#FF6B35] border-b-2 border-[#FF6B35]"
                    : "text-[#1a1a1a] hover:text-[#FF6B35]"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
