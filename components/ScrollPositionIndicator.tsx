"use client";

import { useEffect, useState } from "react";

export function ScrollPositionIndicator() {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateScrollPosition = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    // Set initial position
    updateScrollPosition();

    // Add scroll event listener
    window.addEventListener("scroll", updateScrollPosition);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", updateScrollPosition);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        fontSize: "10px",
        zIndex: 1000000,
        color: "#ffffff",
        fontFamily: "monospace",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: "4px 8px",
        borderRadius: "4px",
      }}
    >
      X: {Math.round(scrollPosition.x)} | Y: {Math.round(scrollPosition.y)}
    </div>
  );
}

