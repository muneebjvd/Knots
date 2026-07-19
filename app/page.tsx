"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

import LoadingScreen from "@/components/LoadingScreen";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/sections/HeroSection";
import VisionSection from "@/components/sections/VisionSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import CoursesSection from "@/components/sections/CoursesSection";
import LearningSection from "@/components/sections/LearningSection";
import CertificationSection from "@/components/sections/CertificationSection";
import RoadmapSection from "@/components/sections/RoadmapSection";
import AboutSection from "@/components/sections/AboutSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/Footer";

// Dynamic import for cursor (client-only)
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* Custom cursor — desktop only */}
      <CustomCursor />

      {/* Loading screen */}
      <AnimatePresence mode="wait">
        {loading && (
          <LoadingScreen key="loading" onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {/* Main content — fades in after loading */}
      {!loading && (
        <>
          <Navigation />

          <main id="main-content" role="main">
            {/* Hero — full viewport 3D scene */}
            <HeroSection />

            {/* Section divider */}
            <div
              style={{
                width: "100%",
                height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
              }}
            />

            {/* Vision */}
            <VisionSection />

            <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)" }} />

            {/* Features: Learn / Build / Prove */}
            <FeaturesSection />

            <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)" }} />

            {/* Engineering Tracks */}
            <CoursesSection />

            <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)" }} />

            {/* Learning process */}
            <LearningSection />

            <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)" }} />

            {/* Certification */}
            <CertificationSection />

            <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)" }} />

            {/* Roadmap */}
            <RoadmapSection />

            <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)" }} />

            {/* About */}
            <AboutSection />

            <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(0,230,168,0.06), transparent)" }} />

            {/* Final CTA */}
            <CTASection />
          </main>

          <Footer />
        </>
      )}

      {/* Skip to content for accessibility */}
      <a
        href="#main-content"
        style={{
          position: "fixed",
          top: -100,
          left: 16,
          zIndex: 99999,
          background: "#00E6A8",
          color: "#000",
          padding: "8px 16px",
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
          transition: "top 0.3s",
        }}
        onFocus={(e) => { (e.target as HTMLElement).style.top = "16px"; }}
        onBlur={(e) => { (e.target as HTMLElement).style.top = "-100px"; }}
      >
        Skip to content
      </a>
    </>
  );
}
