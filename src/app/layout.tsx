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
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "El Norte del País",
    title: "El Norte del País — Inteligencia del Mercado Industrial",
    description: "Noticias, análisis e inteligencia del mercado de bienes raíces industriales en el norte de México.",
    images: [
      {
        url: "/logos/og-image.png",
        width: 1200,
        height: 630,
        alt: "El Norte del País - Inteligencia del Mercado Industrial",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "El Norte del País — Inteligencia del Mercado Industrial",
    description: "Noticias, análisis e inteligencia del mercado de bienes raíces industriales en el norte de México.",
    images: ["/logos/og-image.png"],
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
