"use client";

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
}: {
  title: string;
  description: string;
  showPlaceholder?: boolean;
}) {
  return (
    <div className="p-8 relative">
      <div className="text-white">
        <h3
          className="mb-1 whitespace-nowrap"
          style={{
            width: "305px",
            height: "29px",
            fontFamily: "var(--font-outfit), Outfit, sans-serif",
            fontWeight: 600,
            fontStyle: "normal",
            fontSize: "24px",
            lineHeight: "122%",
            letterSpacing: "-2%",
            textAlign: "left",
            color: "#FFFFFF",
          }}
        >
          {title}
        </h3>
        <p
          className={showPlaceholder ? "mb-6 text-white/50" : "text-white/50"}
          style={{
            width: "400px",
            height: "66px",
            fontFamily: "var(--font-outfit), Outfit, sans-serif",
            fontWeight: 400,
            fontStyle: "normal",
            fontSize: "16px",
            lineHeight: "140%",
            letterSpacing: "2%",
            color: "rgba(255, 255, 255, 0.5)",
          }}
        >
          {description}
        </p>
        {showPlaceholder && (
          <div
            className="w-full rounded-lg"
            style={{
              height: "200px",
              backgroundColor: "rgba(60, 60, 60, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          />
        )}
      </div>
    </div>
  );
}

export function FeaturesGrid() {
  return (
    <div
      className="max-w-4xl mx-auto relative rounded-lg"
      style={{ background: "transparent" }}
    >
      {/* Left vertical line */}
      <div
        className="absolute left-0 pointer-events-none"
        style={{
          width: "0.5px",
          top: "-40px",
          bottom: "-40px",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(254, 218, 36, 0.4) 15%, rgba(239, 148, 31, 0.4) 50%, rgba(254, 218, 36, 0.4) 85%, transparent 100%)",
        }}
      />

      {/* Center vertical line */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "0.5px",
          top: "-40px",
          bottom: "-40px",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(254, 218, 36, 0.4) 15%, rgba(239, 148, 31, 0.4) 50%, rgba(254, 218, 36, 0.4) 85%, transparent 100%)",
        }}
      />

      {/* Right vertical line */}
      <div
        className="absolute right-0 pointer-events-none"
        style={{
          width: "0.5px",
          top: "-40px",
          bottom: "-40px",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(254, 218, 36, 0.4) 15%, rgba(239, 148, 31, 0.4) 50%, rgba(254, 218, 36, 0.4) 85%, transparent 100%)",
        }}
      />

      {/* First Row */}
      <div className="grid grid-cols-2 gap-0 relative">
        <FeatureCard
          title="Subscribe & Track your Usage"
          description="Monitor realtime usage of tokens used in accessing all your AI tools. You can also monitor your spends on all your subscribed AI Tools."
          showPlaceholder
        />
        <FeatureCard
          title="Don't miss out on trends"
          description="Categorically view which kind of tools are trending in the market. We smartly monitor market trends on all the different platforms."
          showPlaceholder
        />

        {/* Horizontal divider */}
        <div
          className="absolute bottom-0 pointer-events-none"
          style={{
            height: "0.5px",
            left: "-200px",
            right: "-200px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(254, 218, 36, 0.4) 10%, rgba(239, 148, 31, 0.4) 50%, rgba(254, 218, 36, 0.4) 90%, transparent 100%)",
          }}
        />
        {/* Intersection dots */}
        <IntersectionDot position="left" dotId="r1-c0" />
        <IntersectionDot position="center" dotId="r1-c1" />
        <IntersectionDot position="right" dotId="r1-c2" />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-2 gap-0 relative">
        <FeatureCard
          title="Trusted by Beelia Community"
          description="Our Community test & reviews all the relevant information of any AI Tool listed on our platform."
        />
        <FeatureCard
          title="Pattern Analysis"
          description="Identify trends and optimize token usage."
        />
      </div>
    </div>
  );
}
