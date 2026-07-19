"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function LenisWrapper({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Fast, responsive, tight smooth scrolling
    lenisRef.current = new Lenis({
      duration: 0.6, // Fast scroll duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Clean easing
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.2, // Slightly faster wheel speed
      touchMultiplier: 2,
    });

    const raf = (time: number) => {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  return <>{children}</>;
}
