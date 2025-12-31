"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import FAQ_DATA_JSON from "./faq-data.json";

type FAQCategory = "What is Beelia?" | "For Users" | "For Creators" | "Trust, Security & Vision";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA = FAQ_DATA_JSON as Record<FAQCategory, FAQItem[]>;

export function FAQ() {
  const [selectedCategory, setSelectedCategory] =
    useState<FAQCategory>("What is Beelia?");
  const [hoveredQuestion, setHoveredQuestion] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const currentFAQs = FAQ_DATA[selectedCategory];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to viewport center (-1 to 1)
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const offsetX = (e.clientX - centerX) / centerX;
      const offsetY = (e.clientY - centerY) / centerY;

      // Map to +/-10px range
      setMousePosition({
        x: offsetX * 10,
        y: offsetY * 10,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative w-full min-h-screen pt-10 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            {/* Parallax Image Container */}
            <div
              ref={containerRef}
              className="w-full mb-8 overflow-hidden relative"
              style={{
                borderRadius: "32px",
              }}
            >
              {/* Background Image */}
              <motion.div
                className="relative"
                style={{
                  width: "120%",
                  marginLeft: "-10%",
                  marginTop: "-10%",
                  marginBottom: "-10%",
                }}
                animate={{
                  x: mousePosition.x,
                  y: mousePosition.y,
                }}
                transition={{
                  type: "tween",
                  ease: "easeOut",
                  duration: 0.1,
                }}
              >
                <img
                  src="/faq-image-background.png"
                  alt="FAQ Background"
                  className="w-full h-auto block"
                />
              </motion.div>

              {/* Question Mark Image */}
              <motion.div
                className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
                style={{
                  width: "100%",
                  height: "100%",
                  top: "0",
                  left: "0",
                }}
                animate={{
                  x: mousePosition.x * 1.5,
                  y: mousePosition.y * 1.5,
                }}
                transition={{
                  type: "tween",
                  ease: "easeOut",
                  duration: 0.1,
                }}
              >
                <img
                  src="/faq-question-mark.png"
                  alt="Question Mark"
                  className="w-full h-full object-contain"
                  style={{
                    transform: "scale(1.2)",
                  }}
                />
              </motion.div>
            </div>

            {/* Category Navigation */}
            <nav className="flex flex-col">
              {(
                [
                  "What is Beelia?",
                  "For Users",
                  "For Creators",
                  "Trust, Security & Vision",
                ] as FAQCategory[]
              ).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-left px-4 py-3transition-all duration-200 ${selectedCategory === category
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  style={{
                    fontFamily: "var(--font-outfit), Outfit, sans-serif",
                    fontWeight: 400,
                    fontSize: "20px",
                    borderRadius: "16px",
                    padding: "16px 20px",
                  }}
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Content Area */}
          <div className="flex-1">
            <div className="flex flex-col">
              {currentFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="relative faq-item rounded-lg transition-all duration-300"
                  style={{
                    backgroundColor:
                      hoveredQuestion === index
                        ? "rgba(255, 255, 255, 0.05)"
                        : "transparent",
                    padding: "16px",
                  }}
                  onMouseEnter={() => setHoveredQuestion(index)}
                  onMouseLeave={() => setHoveredQuestion(null)}
                >
                  <div className="flex items-start gap-4">
                    {/* Plus/Minus Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <div className="relative w-10 h-10">
                        {/* Plus Sign */}
                        <div
                          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${hoveredQuestion === index
                              ? "opacity-0 rotate-90 scale-75"
                              : "opacity-100 rotate-0 scale-100"
                            }`}
                        >
                          {/* Circular background for plus */}
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                            }}
                          />
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="relative z-10"
                          >
                            <line
                              x1="12"
                              y1="6"
                              x2="12"
                              y2="18"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <line
                              x1="6"
                              y1="12"
                              x2="18"
                              y2="12"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>

                        {/* Minus Sign */}
                        <div
                          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${hoveredQuestion === index
                              ? "opacity-100 rotate-0 scale-100"
                              : "opacity-0 -rotate-90 scale-75"
                            }`}
                        >
                          {/* Circular background for minus */}
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{
                              backgroundColor: "rgba(255, 174, 29, 0.1)",
                            }}
                          />
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="relative z-10"
                          >
                            <line
                              x1="6"
                              y1="12"
                              x2="18"
                              y2="12"
                              stroke="#FFAE1D"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Question and Answer */}
                    <div className="flex-1">
                      <h3
                        className="text-white mb-2"
                        style={{
                          fontFamily: "var(--font-outfit), Outfit, sans-serif",
                          fontWeight: 400,
                          fontSize: "20px",
                          lineHeight: "140%",
                          height: "44px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {faq.question}
                      </h3>

                      {/* Answer - expands on hover */}
                      <motion.div
                        initial={false}
                        animate={{
                          height: hoveredQuestion === index ? "auto" : 0,
                          opacity: hoveredQuestion === index ? 1 : 0,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: "easeInOut",
                        }}
                        style={{
                          overflow: "hidden",
                        }}
                      >
                        <p
                          className="text-white/70 pt-2"
                          style={{
                            fontFamily:
                              "var(--font-outfit), Outfit, sans-serif",
                            fontWeight: 300,
                            fontSize: "18px",
                            lineHeight: "140%",
                          }}
                        >
                          {faq.answer}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
