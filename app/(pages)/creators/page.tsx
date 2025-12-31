"use client";

import { NewHero } from "../users/components/NewHero";
import { AboutProduct } from "../users/components/AboutProduct";
import { FAQ } from "../users/components/FAQ";
import { ParticleSpritesBackground } from "@/components/ui";
import { Footer } from "@/components/layout/Footer";
import { FeatureData } from "../users/components/FeaturesGrid";

export default function CreatorsPage() {
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
      title: "Payments handled for you",
      description:
        "Beelia handles subscriptions, billing, and payments automatically, so you can focus on improving your AI while we take care of the money flow.",
      imageSrc: "/images/unified-billing.png", // You can replace this with a creator-specific image
    },
    {
      title: "Your creator dashboard",
      description:
        "Manage your listings, pricing, and subscriptions from one place. Update your tool, track active users, and control your monetization without extra infrastructure.",
      imageSrc: "/images/centralized-access.png", // You can replace this with a creator-specific image
    },
    {
      title: "Selling AI shouldn’t require a startup",
      description:
        "Today, great AI tools get lost on directories, GitHub, and random landing pages. Beelia is built to give creators a proper marketplace, where AI can be sold like software, not services.",
    },
    {
      title: "Focus on building, not selling",
      description:
        "You build the intelligence. Beelia handles distribution, payments, and access, so your work can reach users without turning you into a marketer or salesperson.",
    },
  ];

  return (
    <div className="relative w-full bg-transparent">
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
      <div className="relative z-10">
        <NewHero
          title={
            <>
              <span className="text-white">AI for Everyone,</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C32] to-[#FF6B00]">
                by Everyone
              </span>
            </>
          }
          description="An open marketplace where AI creators turn their tools into real products, and real revenue."
        />
        <AboutProduct
          boxData={[
            { video: "/videos/upload.webm", title: "PUBLISH", x: 15.055 },
            { video: "/videos/dollar.webm", title: "MONETIZE", x: 391.754 },
            { video: "/videos/graph.webm", title: "DISTRIBUTE", x: 767.027 },
          ]}
          cardData={[
            {
              title: "PUBLISH",
              subtitle: "",
              description:
                "Verified listings help users understand what’s legit, what performs, and what’s safe, increasing confidence and conversion for your tool.",
              iconPath: "",
            },
            {
              title: "MONETIZE",
              subtitle: "",
              description:
                "List your AI tool as a standalone product, set your price, and start earning recurring revenue without building a full SaaS or handling payments yourself.",
              iconPath: "",
            },
            {
              title: "DISTRIBUTE",
              subtitle: "",
              description:
                "Reach builders, businesses, and creators actively looking for AI solutions, without spending time on marketing, SEO, or cold outreach.",
              iconPath: "",
            },
          ]}
          features={creatorFeatures}
        />
        <FAQ />
        <Footer />
      </div>
    </div>
  );
}
