"use client";

import React, { useState, useEffect, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const RibbonCanvas = lazy(() => import("@/components/RibbonCanvas"));

const headlines = [
  ["Engineering isn't memorized.", "It's built."],
  ["Become an", "AI Engineer."],
  ["Build Real", "Systems."],
  ["Learn. Build.", "Prove."],
];

const trustBadges = [
  "Project-Based Learning",
  "Industry Focused",
  "Implementation First",
];

export default function HeroSection() {
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setHeadlineIndex((i) => (i + 1) % headlines.length);
        setIsVisible(true);
      }, 400); // Faster fade
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="hero"
      className="relative w-full"
      style={{ height: "100svh", minHeight: 720 }}
      aria-label="Hero section"
    >
      {/* 3D Ribbon Canvas */}
      <div
        style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "all" }}
        aria-hidden="true"
      >
        <Suspense fallback={null}>
          <RibbonCanvas />
        </Suspense>
      </div>

      {/* Dark vignette to keep text readable */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.92) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "35%",
          background: "linear-gradient(to bottom, transparent, #050505)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Hero content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          textAlign: "center",
          padding: "0 24px",
          paddingTop: "22vh", // Added 1-2 inches of blank space at the header
          paddingBottom: "100px",
        }}
      >
        {/* Headline */}
        <div
          style={{
            height: "clamp(120px, 15vw, 220px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
            overflow: "visible",
          }}
        >
          <AnimatePresence mode="wait">
            {isVisible && (
              <motion.h1
                key={headlineIndex}
                className="text-hero"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  maxWidth: 820,
                  textAlign: "center",
                }}
              >
                {headlines[headlineIndex][0]}
                <br />
                <span style={{ color: "#d0d0d0" }}>{headlines[headlineIndex][1]}</span>
              </motion.h1>
            )}
          </AnimatePresence>
        </div>

        {/* Description */}
        <motion.p
          className="text-body"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            maxWidth: 500,
            marginBottom: 40,
            fontSize: 16,
            lineHeight: 1.6,
            color: "#888",
          }}
        >
          Knots Systems transforms world-class engineering education into structured
          implementation. Learn from the best, build real projects, and earn competency
          through practical work—not memorization.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 56,
          }}
        >
          <a
            href="#courses"
            onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}
            className="btn-primary"
            id="hero-explore-btn"
            aria-label="Explore Courses"
          >
            Explore Courses
            <ArrowRight size={15} />
          </a>
          <a
            href="#vision"
            onClick={(e) => { e.preventDefault(); scrollTo("vision"); }}
            className="btn-secondary"
            id="hero-vision-btn"
            aria-label="Our Vision"
          >
            Our Vision
          </a>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {trustBadges.map((badge) => (
              <div key={badge} className="trust-badge">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#555"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {badge}
              </div>
            ))}
          </div>

          {/* Powered by */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <p style={{ fontSize: 11.5, color: "#444", letterSpacing: "0.02em", display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap", justifyContent: "center" }}>
              Powered by world-class learning from 
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#777", fontWeight: 500 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Harvard CS50
              </span>
              & 
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#777", fontWeight: 500 }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
                </svg>
                Microsoft Learn
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
