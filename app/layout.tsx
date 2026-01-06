import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, Outfit } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Preloader } from "@/components/Preloader";
import NavbarClient from "@/components/layout/NavbarClient";
import { FontPreloader } from "@/components/FontPreloader";

const inter = Inter({ subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});
const outfit = Outfit({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-outfit",
});

const editorsNoteItalic = localFont({
  src: [
    {
      path: "./fonts/EditorsNote-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/EditorsNote-Italic.otf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-editors-note-italic",
  display: "swap",
  preload: true,
  fallback: ["serif"],
  adjustFontFallback: false,
});

const editorsNoteMediumItalic = localFont({
  src: [
    {
      path: "./fonts/EditorsNote-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/EditorsNote-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
  ],
  variable: "--font-editors-note-medium-italic",
  display: "swap",
  preload: true,
  fallback: ["serif"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Beelia.ai - AI Marketplace",
  description: "Discover, purchase, and use AI-powered tools",
  keywords: ["AI", "marketplace", "tools", "machine learning"],
  authors: [{ name: "Beelia Team" }],
  openGraph: {
    title: "Beelia.ai - AI Marketplace",
    description: "Discover, purchase, and use AI-powered tools",
    type: "website",
  },
  other: {
    "font-preload": "/fonts/EditorsNote-Italic.woff2",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // Enables safe-area-inset support
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body
        className={`${inter.className} ${instrumentSerif.variable} ${outfit.variable} ${editorsNoteItalic.variable} ${editorsNoteMediumItalic.variable} bg-black overflow-x-hidden`}
        suppressHydrationWarning
      >
        <FontPreloader />
        <Preloader />
        <NavbarClient />
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
