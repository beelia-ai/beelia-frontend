import type { Metadata } from "next";
import { Inter, Instrument_Serif, Outfit } from "next/font/google";
import "./globals.css";
import { Preloader } from "@/components/Preloader";
import NavbarClient from "@/components/layout/NavbarClient";
import { ScrollPositionIndicator } from "@/components/ScrollPositionIndicator";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} ${instrumentSerif.variable} ${outfit.variable} bg-black`}
        suppressHydrationWarning
      >
        <Preloader />
        <NavbarClient />
        <ScrollPositionIndicator />
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
