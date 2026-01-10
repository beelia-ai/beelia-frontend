"use client";

import { NewHero } from "../users/components/NewHero";
import { AboutProduct } from "../users/components/AboutProduct";
import { FAQ } from "../users/components/FAQ";
import { ParticleSpritesBackground } from "@/components/ui";
import { Footer } from "@/components/layout/Footer";
import { BlackholeVideo } from "@/components/layout/BlackholeVideo";
import { PARTICLE_COUNT_DESKTOP } from "@/lib/constants";
import { FeatureData } from "../users/components/FeaturesGrid";
import { useTranslations } from "next-intl";

export default function CreatorsPage() {
  const t = useTranslations('CreatorsPage');
  
  // Glossy white and silver colors in HSL format (normalized 0-1)
  const beeliaColors = [
    [0, 0, 1], // Pure white - glossy white
    [0, 0, 0.9], // Off-white - bright silver
    [0, 0, 0.75], // Silver - medium silver
    [0, 0, 0.85], // Light silver - bright silver
    [0, 0, 0.95], // Near white - glossy white
  ];

  // Creator-specific features
  const creatorFeatures: FeatureData[] = [
    {
      title: t('features.payments.title'),
      description: t('features.payments.description'),
      imageSrc: "/images/payments.png",
    },
    {
      title: t('features.dashboard.title'),
      description: t('features.dashboard.description'),
      imageSrc: "/images/creator-dashboard.png",
    },
    {
      title: t('features.marketplace.title'),
      description: t('features.marketplace.description'),
    },
    {
      title: t('features.focus.title'),
      description: t('features.focus.description'),
    },
  ];

  return (
    <div className="relative w-full bg-transparent">
      {/* Particle Sprites Background - z-10 to be above blackhole (z-5) */}
      <ParticleSpritesBackground
        className="fixed inset-0 z-10"
        particleCount={PARTICLE_COUNT_DESKTOP}
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
              <span className="text-white">{t('heroTitleAI')} {t('heroTitleForEveryone')}</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C32] to-[#FF6B00]">
                {t('heroTitleByEveryone')}
              </span>
            </>
          }
          description={t('heroDescription')}
        />
        {/* ABOUTPRODUCT - RESTORED with videos */}
        <AboutProduct
          boxData={[
            {
              video: "/videos/upload.gif",
              title: t('AboutProduct.cards.publish'),
              x: 15.055,
              stackedVideo: "/videos/upload.gif",
            },
            {
              video: "/videos/graph.gif",
              title: t('AboutProduct.cards.distribute'),
              x: 391.754,
              stackedVideo: "/videos/graph.gif",
            },
            {
              video: "/videos/dollar.gif",
              title: t('AboutProduct.cards.monetize'),
              x: 767.027,
              stackedVideo: "/videos/dollar.gif",
            },
          ]}
          cardData={[
            {
              title: t('AboutProduct.cards.publish'),
              subtitle: "",
              description: t('AboutProduct.cards.publishDesc'),
              iconPath: "",
            },
            {
              title: t('AboutProduct.cards.distribute'),
              subtitle: "",
              description: t('AboutProduct.cards.distributeDesc'),
              iconPath: "",
            },
            {
              title: t('AboutProduct.cards.monetize'),
              subtitle: "",
              description: t('AboutProduct.cards.monetizeDesc'),
              iconPath: "",
            },
          ]}
          features={creatorFeatures}
          descriptionText={t('AboutProduct.description')}
        />
        <FAQ />
        <Footer />
      </div>

      {/* Blackhole Video - z-5 to be behind particles (z-10) but scroll with page */}
      <div className="relative z-[5]">
        <BlackholeVideo />
      </div>
    </div>
  );
}
