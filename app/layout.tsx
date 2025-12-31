import type { Metadata } from "next";
import { Inter, Instrument_Serif, Outfit } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Preloader } from "@/components/Preloader";
import NavbarClient from "@/components/layout/NavbarClient";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";

const inter = Inter({ subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});
const outfit = Outfit({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-outfit",
});

const editorsNoteItalic = localFont({
  src: "./fonts/EditorsNote-Italic.otf",
  variable: "--font-editors-note-italic",
  display: "swap",
});

const editorsNoteMediumItalic = localFont({
  src: "./fonts/EditorsNote-MediumItalic.otf",
  variable: "--font-editors-note-medium-italic",
  display: "swap",
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
        <Preloader />
        <NavbarClient />
        <PerformanceMonitor />
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
