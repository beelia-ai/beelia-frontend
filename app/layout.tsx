import type { Metadata } from "next";
import { Inter, Inria_Sans, Instrument_Serif, Outfit } from "next/font/google";
import "./globals.css";
import { Preloader } from "@/components/Preloader";
import NavbarClient from "@/components/layout/NavbarClient";

const inter = Inter({ subsets: ["latin"] });
const inriaSans = Inria_Sans({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-inria-sans",
});
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
        className={`${inter.className} ${inriaSans.variable} ${instrumentSerif.variable} ${outfit.variable} bg-black`}
        suppressHydrationWarning
      >
        <Preloader />
        <NavbarClient />
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
