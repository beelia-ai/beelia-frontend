"use client";
import React, { useState, useEffect } from "react";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { Button } from "@/components/ui";
import { motion } from "framer-motion";
import Image from "next/image";

export function Hero() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 640);
    
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 640);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-start justify-start overflow-hidden bg-black">
      {/* Background Ripple Effect */}
      <BackgroundRippleEffect />
      
      {/* Content Container */}
      <div className="relative z-10 w-full mt-60">
        <div className="text-center space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8">
          {/* Main heading with stagger animation */}
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            Discover & Deploy <span className="text-white">AI Tools</span> Instantly
          </motion.h1>
          
          {/* Subheading with delay */}
          <motion.p 
            className="text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-[#FEDA24] via-[#EF941F] to-[#FEDA24] bg-clip-text text-transparent animate-gradient max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            The ultimate marketplace for AI-powered tools and models. 
            Find, purchase, and integrate cutting-edge AI solutions into your workflow.
          </motion.p>

          {/* CTA Button */}
          <motion.div 
            className="pt-4 sm:pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            <Button 
              size="lg" 
              variant="secondary"
              className="w-full sm:w-auto min-w-[200px]"
            >
              Join Waitlist
            </Button>
          </motion.div>
        </div>

        {/* Product Preview */}
        <motion.div 
          className="mt-12 sm:mt-16 md:mt-20 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
        >
          <div className="relative rounded-none sm:rounded-t-[44px] overflow-visible border-x-0 sm:border-2 border-[#FEDA24] border-b-0 shadow-2xl max-w-full sm:max-w-[1800px] mx-auto"
            style={{
              boxShadow: '0 0 30px rgba(254, 218, 36, 0.5), 0 0 60px rgba(254, 218, 36, 0.3), 0 0 90px rgba(239, 148, 31, 0.2)',
            }}
          >
            <Image
              src="/images/dashboard.png"
              alt="Beelia.ai Dashboard Preview"
              width={1920}
              height={1080}
              className="w-full h-auto relative z-10 rounded-none sm:rounded-t-[44px]"
              priority
            />
            {/* Animated shadow overlay */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-20"
              animate={{
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
