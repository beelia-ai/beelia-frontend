"use client";

import Image from "next/image";

// Intersection dot component - always glowing
function IntersectionDot({
  position,
  dotId,
}: {
  position: "left" | "center" | "right";
  dotId: string;
}) {
  const positionClasses = {
    left: "left-0 -translate-x-1/2",
    center: "left-1/2 -translate-x-1/2",
    right: "right-0 translate-x-1/2",
  };

  return (
    <div
      data-dot-id={dotId}
      className={`absolute bottom-0 translate-y-1/2 z-10 transition-all duration-200 ${positionClasses[position]}`}
    >
      <div
        className="w-2 h-2 rounded-full transition-all duration-200"
        style={{
          background: "#FEDA24",
          boxShadow: "0 0 10px #FEDA24, 0 0 20px #FEDA24, 0 0 30px #FEDA24",
        }}
      />
    </div>
  );
}

// Reusable Feature Card Component
function FeatureCard({
  title,
  description,
  showPlaceholder = false,
  imageSrc,
}: {
  title: string;
  description: string;
  showPlaceholder?: boolean;
  imageSrc?: string;
}) {
  return (
    <div className="p-4 sm:p-6 md:p-8 relative">
      <div className="text-white">
        <h3
          className="md:whitespace-nowrap"
          style={{
            width: "100%",
            maxWidth: "305px",
            minHeight: "29px",
            fontFamily: "var(--font-outfit), Outfit, sans-serif",
            fontWeight: 600,
            fontStyle: "normal",
            fontSize: "clamp(20px, 4vw, 24px)",
            lineHeight: "122%",
            letterSpacing: "-2%",
            textAlign: "left",
            color: "#FFFFFF",
            paddingLeft: "10px",
            paddingRight: "10px",
            marginBottom: "8px",
          }}
        >
          {title}
        </h3>
        <p
          className={showPlaceholder || imageSrc ? "mb-6 text-white/50" : "text-white/50"}
          style={{
            width: "100%",
            maxWidth: "400px",
            height: "auto",
            minHeight: "66px",
            fontFamily: "var(--font-outfit), Outfit, sans-serif",
            fontWeight: 300,
            fontStyle: "normal",
            fontSize: "clamp(13px, 3vw, 15px)",
            lineHeight: "140%",
            letterSpacing: "2%",
            color: "rgba(255, 255, 255, 0.5)",
            paddingLeft: "10px",
            paddingRight: "10px",
          }}
        >
          {description}
        </p>
        {showPlaceholder && (
          <div
            className="w-full overflow-hidden"
            style={{
              height: "clamp(150px, 30vw, 200px)",
              backgroundColor: "rgba(60, 60, 60, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "32px",
            }}
          />
        )}
        {imageSrc && (
          <div className="w-full overflow-hidden mt-4" style={{ borderRadius: "32px" }}>
            <Image
              src={imageSrc}
              alt={title}
              width={400}
              height={200}
              className="w-full h-auto object-contain"
              style={{ borderRadius: "32px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export interface FeatureData {
  title: string;
  description: string;
  imageSrc?: string;
}

interface FeaturesGridProps {
  features?: FeatureData[];
}

import { useTranslations } from "next-intl";

export function FeaturesGrid({ features }: FeaturesGridProps = {}) {
  const t = useTranslations('UsersPage.features');
  
  const defaultFeatures: FeatureData[] = [
    {
      title: t('unifiedBilling.title'),
      description: t('unifiedBilling.description'),
      imageSrc: "/images/unified-billing.png",
    },
    {
      title: t('centralizedAccess.title'),
      description: t('centralizedAccess.description'),
      imageSrc: "/images/centralized-access.png",
    },
    {
      title: t('historyLesson.title'),
      description: t('historyLesson.description'),
    },
    {
      title: t('onePlace.title'),
      description: t('onePlace.description'),
    },
  ];

  const displayFeatures = features || defaultFeatures;

  // Split features into two rows: first 2 with images, last 2 without
  const firstRowFeatures = displayFeatures.slice(0, 2);
  const secondRowFeatures = displayFeatures.slice(2, 4);

  return (
    <div
      className="max-w-4xl mx-auto relative rounded-lg px-4 md:px-0 overflow-hidden"
      style={{ background: "transparent" }}
    >
      {/* Left vertical line - hidden on mobile */}
      <div
        className="hidden md:block absolute left-0 pointer-events-none"
        style={{
          width: "0.5px",
          top: "-40px",
          bottom: "-40px",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(254, 218, 36, 0.4) 15%, rgba(239, 148, 31, 0.4) 50%, rgba(254, 218, 36, 0.4) 85%, transparent 100%)",
        }}
      />

      {/* Center vertical line - hidden on mobile */}
      <div
        className="hidden md:block absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "0.5px",
          top: "-40px",
          bottom: "-40px",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(254, 218, 36, 0.4) 15%, rgba(239, 148, 31, 0.4) 50%, rgba(254, 218, 36, 0.4) 85%, transparent 100%)",
        }}
      />

      {/* Right vertical line - hidden on mobile */}
      <div
        className="hidden md:block absolute right-0 pointer-events-none"
        style={{
          width: "0.5px",
          top: "-40px",
          bottom: "-40px",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(254, 218, 36, 0.4) 15%, rgba(239, 148, 31, 0.4) 50%, rgba(254, 218, 36, 0.4) 85%, transparent 100%)",
        }}
      />

      {/* First Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-0 gap-y-8 md:gap-y-0 relative">
        {firstRowFeatures.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            imageSrc={feature.imageSrc}
          />
        ))}

        {/* Horizontal divider - adjusted for mobile */}
        <div
          className="absolute bottom-0 pointer-events-none hidden md:block"
          style={{
            height: "0.5px",
            left: "-200px",
            right: "-200px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(254, 218, 36, 0.4) 10%, rgba(239, 148, 31, 0.4) 50%, rgba(254, 218, 36, 0.4) 90%, transparent 100%)",
          }}
        />
        {/* Intersection dots - hidden on mobile */}
        <div className="hidden md:block">
          <IntersectionDot position="left" dotId="r1-c0" />
          <IntersectionDot position="center" dotId="r1-c1" />
          <IntersectionDot position="right" dotId="r1-c2" />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-0 gap-y-8 md:gap-y-0 relative mt-8 md:mt-0">
        {secondRowFeatures.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            imageSrc={feature.imageSrc}
          />
        ))}
      </div>
    </div>
  );
}
