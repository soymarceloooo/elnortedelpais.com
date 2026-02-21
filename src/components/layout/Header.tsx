"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Navigation from "./Navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-zinc-200 bg-white">
      {/* Brand signature bar */}
      <div className="bg-[#002D63] h-1" />
      
      <div className="mx-auto max-w-6xl px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-zinc-100 py-3 text-sm font-sans">
          <span className="text-zinc-600">Monterrey, Nuevo León, México</span>
          <Link
            href="/nosotros"
            className="text-zinc-600 hover:text-[#002D63] transition-colors font-medium"
          >
            Nosotros
          </Link>
        </div>

        {/* Logo */}
        <div className="py-6 text-center border-b border-zinc-100">
          <Link href="/" className="inline-block">
            <Image
              src="/logos/svg/logo-horizontal.svg"
              alt="El Norte del País - Inteligencia del Mercado Industrial"
              width={500}
              height={80}
              priority
              className="h-auto w-full max-w-md mx-auto"
            />
          </Link>
        </div>

        {/* Navigation */}
        <div className="relative">
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
          <Navigation mobileOpen={mobileMenuOpen} />
        </div>
      </div>
    </header>
  );
}
