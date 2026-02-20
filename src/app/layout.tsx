import type { Metadata } from "next";
import { Playfair_Display, Merriweather, Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "El Norte del País — Inteligencia del Mercado Industrial",
    template: "%s | El Norte del País",
  },
  description:
    "Noticias, análisis e inteligencia del mercado de bienes raíces industriales en el norte de México. Datos del mercado, propiedades y guías de inversión.",
  keywords: [
    "bienes raíces industriales",
    "parques industriales",
    "Monterrey",
    "Nuevo León",
    "nearshoring",
    "inversión industrial",
    "lotes industriales",
  ],
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "El Norte del País",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${playfair.variable} ${merriweather.variable} ${inter.variable} font-serif antialiased`}
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
