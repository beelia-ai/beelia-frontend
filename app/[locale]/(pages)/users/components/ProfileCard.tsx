"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ExpandedProfileCard } from "./ExpandedProfileCard";
import { useTranslations } from "next-intl";

interface ProfileCardProps {
  name: string;
  role: string;
  image: string;
  description: string;
  background?: string;
  responsibilities?: string[];
  coreStrengths?: string[];
  socials?: {
    linkedin?: string;
  };
}

export function ProfileCard({
  name,
  role,
  image,
  description,
  background,
  responsibilities,
  coreStrengths,
  socials,
}: ProfileCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations('Team');

  // Unique ID for layout animation
  const layoutId = `profile-${name.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <>
      <motion.div
        layoutId={layoutId}
        onClick={() => setIsExpanded(true)}
        className="group w-full h-full relative overflow-hidden cursor-pointer"
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Linear Gradient Effect on Hover */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            zIndex: 0,
            background: `
              linear-gradient(to top, 
                rgba(255, 150, 0, 0.6) 0%,
                rgba(255, 100, 0, 0.4) 16%,
                rgba(255, 50, 0, 0.2) 32%,
                transparent 70%
              )
            `,
          }}
        />

        {/* Card Content */}
        <div
          className="relative h-full flex items-start gap-4 px-5 py-10 md:px-10 md:py-10"
          style={{ zIndex: 1 }}
        >
          {/* Profile Image */}
          <motion.div
            layoutId={`${layoutId}-image`}
            className="w-16 h-16 bg-gray-700 overflow-hidden flex-shrink-0"
            style={{ borderRadius: "16px" }}
          >
            <Image
              src={image}
              alt={name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </motion.div>
          {/* Profile Info */}
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2">
              <motion.h3
                layoutId={`${layoutId}-name`}
                className="text-white"
                style={{
                  fontFamily: "var(--font-outfit), Outfit, sans-serif",
                  fontWeight: 600,
                  fontSize: "22px",
                }}
              >
                {name}
              </motion.h3>
              <Image
                src="/icons/Vector.svg"
                alt="arrow"
                width={14}
                height={14}
                className="w-3.5 h-3.5 transition-opacity duration-300 opacity-[0.1] group-hover:opacity-100"
                style={{
                  filter: "brightness(0) invert(1)",
                  marginBottom: "-4px",
                  marginLeft: "4px",
                }}
              />
            </div>
            <motion.p
              layoutId={`${layoutId}-role`}
              className="mb-2"
              style={{
                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                fontWeight: 400,
                fontSize: "18px",
                background:
                  "linear-gradient(90deg, #F80 0%, #F5A83B 25.48%, #F57238 92.31%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {role}
            </motion.p>
            <motion.p
              layoutId={`${layoutId}-description`}
              className="text-white"
              style={{
                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                fontWeight: 300,
                fontSize: "16px",
                lineHeight: "160%",
                opacity: 0.7,
              }}
            >
              {description}
            </motion.p>
          </div>
        </div>
      </motion.div>

      <ExpandedProfileCard
        isOpen={isExpanded}
        onClose={() => setIsExpanded(false)}
        name={name}
        role={role}
        image={image}
        description={description}
        background={background}
        responsibilities={responsibilities}
        coreStrengths={coreStrengths}
        socials={socials}
        layoutId={layoutId} // Pass layoutId to maintain transition
      />
    </>
  );
}
