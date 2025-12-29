"use client";

import { NewHero } from "./components/NewHero";
import { AboutProduct } from "./components/AboutProduct";
import { ParticleSpritesBackground } from "@/components/ui";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  // Glossy white and silver colors in HSL format (normalized 0-1)
  const beeliaColors = [
    [0, 0, 1], // Pure white - glossy white
    [0, 0, 0.9], // Off-white - bright silver
    [0, 0, 0.75], // Silver - medium silver
    [0, 0, 0.85], // Light silver - bright silver
    [0, 0, 0.95], // Near white - glossy white
  ];

  return (
    <div className="relative min-h-screen w-full bg-transparent overflow-x-hidden">
      {/* Particle Sprites Background - covers entire page */}
      <ParticleSpritesBackground
        className="fixed inset-0 z-0"
        particleCount={150}
        followMouse={true}
        mouseSensitivity={0.05}
        colors={beeliaColors}
        cycleColors={false}
        sizes={[5, 5, 5, 5, 5]}
        speed={0.3}
      />

      {/* Page content */}
      <div className="relative z-10 overflow-x-hidden">
        <NewHero />
        <AboutProduct />
        <Footer />
      </div>
    </div>
  );
}
