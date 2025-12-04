import type { Metadata } from "next";
import { Inter, Inria_Sans, Instrument_Serif } from "next/font/google";
import NavbarClient from "@/components/layout/NavbarClient";
import { PreloadLogo } from "@/components/PreloadLogo";
import "./globals.css";

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
        className={`${inter.className} ${inriaSans.variable} ${instrumentSerif.variable}`}
        suppressHydrationWarning
      >
        <PreloadLogo />
        <NavbarClient />
        {children}
      </body>
    </html>
  );
}
