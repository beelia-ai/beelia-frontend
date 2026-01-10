"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { NewHero } from "./components/NewHero";
import { AboutProduct } from "./components/AboutProduct";
import { FAQ } from "./components/FAQ";
import { ParticleSpritesBackground } from "@/components/ui";
import { Footer } from "@/components/layout/Footer";
import { BlackholeVideo } from "@/components/layout/BlackholeVideo";
import { PARTICLE_COUNT_MOBILE, PARTICLE_COUNT_DESKTOP } from "@/lib/constants";

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

  const t = useTranslations('UsersPage');

  return (
    <div className="relative w-full bg-transparent">
      {/* Particle Sprites Background - reduced particles on mobile - z-10 to be above blackhole (z-5) */}
      <ParticleSpritesBackground
        className="fixed inset-0 z-10"
        particleCount={
          isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP
        }
        followMouse={true}
        mouseSensitivity={0.05}
        colors={beeliaColors}
        cycleColors={false}
        sizes={[5, 5, 5, 5, 5]}
        speed={0.3}
      />

      {/* Page content - z-20 to be above particles */}
      <div className="relative z-20">
        <NewHero
          title={
            <>
              <span className="text-white">{t('heroTitleAI')}</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C32] to-[#FF6B00]">
                {t('heroTitleForEveryone')}
              </span>{" "}
              <span className="text-white">{t('heroTitleByEveryone')}</span>
            </>
          }
          description={t('heroDescription')}
        />
        <AboutProduct />
        <FAQ />
        <Footer />
      </div>

      {/* Blackhole Video - z-5 to be behind particles (z-10) but scroll with page */}
      <div
        className="relative z-[5]"
        style={{ marginTop: isMobile ? "0px" : "-300px" }}
      >
        <BlackholeVideo />
      </div>
    </div>
  );
}
