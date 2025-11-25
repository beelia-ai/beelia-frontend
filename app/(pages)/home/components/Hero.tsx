"use client";
import React from "react";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { Button } from "@/components/ui";
import { motion } from "framer-motion";

export function Hero() {
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
      </div>
    </div>
  );
}
