"use client";

import { useState, useEffect } from "react";
import { NewHero } from "./components/NewHero";
import { AboutProduct } from "./components/AboutProduct";
import { FAQ } from "./components/FAQ";
import { ParticleSpritesBackground } from "@/components/ui";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Glossy white and silver colors in HSL format (normalized 0-1)
  const beeliaColors = [
    [0, 0, 1], // Pure white - glossy white
    [0, 0, 0.9], // Off-white - bright silver
    [0, 0, 0.75], // Silver - medium silver
    [0, 0, 0.85], // Light silver - bright silver
    [0, 0, 0.95], // Near white - glossy white
  ];

  return (
    <div className="relative w-full bg-transparent">
      {/* Particle Sprites Background - reduced particles on mobile */}
      <ParticleSpritesBackground
        className="fixed inset-0 z-0"
        particleCount={isMobile ? 75 : 150}
        followMouse={true}
        mouseSensitivity={0.05}
        colors={beeliaColors}
        cycleColors={false}
        sizes={[5, 5, 5, 5, 5]}
        speed={0.3}
      />

      {/* Page content */}
      <div className="relative z-10">
        <NewHero
          title={
            <>
              <span className="text-white">AI</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C32] to-[#FF6B00]">
                for Everyone,
              </span>{" "}
              <span className="text-white">by Everyone</span>
            </>
          }
          description="A curated AI marketplace where anyone can discover, trust, and use the right tools instantly, no technical skills required"
        />
        <AboutProduct />
        <FAQ />
        <Footer />
      </div>
    </div>
  );
}
