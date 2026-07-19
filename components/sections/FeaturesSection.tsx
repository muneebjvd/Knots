"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const features = [
  {
    loop: "01",
    title: "Learn",
    tagline: "World-class knowledge, curated.",
    description:
      <span key="desc-1">
        Content sourced from{" "}
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#aaa" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Harvard CS50
        </span>{" "}
        and{" "}
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#aaa" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
          </svg>
          Microsoft Learn
        </span>
        . Every concept selected for maximum engineering relevance — nothing filler.
      </span>,
    accent: "#00E6A8",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    loop: "02",
    title: "Build",
    tagline: "Every concept becomes code.",
    description:
      "No passive learning. Every lesson requires implementation. You build real systems from scratch using real engineering practices.",
    accent: "#00B8FF",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 18l6-6-6-6" />
        <path d="M8 6l-6 6 6 6" />
        <path d="M14.5 4l-5 16" />
      </svg>
    ),
  },
  {
    loop: "03",
    title: "Prove",
    tagline: "Competency is demonstrated.",
    description:
      "No multiple-choice exams. Certificates are earned by submitting working projects that meet real engineering standards.",
    accent: "#00E6A8",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="features"
      className="section-padding"
      ref={sectionRef}
      aria-labelledby="features-title"
    >
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 64 }}
        >
          <p className="text-label" style={{ color: "#00E6A8", marginBottom: 14 }}>
            The Three Loops
          </p>
          <h2 id="features-title" className="text-section-title">
            One knot. Three principles.
          </h2>
        </motion.div>

        {/* Cards — 3 column */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {features.map((feature, i) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: "#0f0f0f",
                border: "1px solid #1a1a1a",
                borderRadius: 18,
                padding: "32px 28px",
                transition: "background 0.25s ease, border-color 0.25s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "#131313";
                el.style.borderColor = "#222";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "#0f0f0f";
                el.style.borderColor = "#1a1a1a";
              }}
            >
              {/* Loop number */}
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: "#2a2a2a",
                  marginBottom: 20,
                }}
              >
                LOOP {feature.loop}
              </p>

              {/* Icon */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#050505",
                  border: "1px solid #1a1a1a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#d0d0d0",
                  marginBottom: 20,
                }}
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#f0f0f0",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {feature.title}
              </h3>

              {/* Tagline */}
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#c0c0c0",
                  marginBottom: 12,
                  letterSpacing: "-0.01em",
                }}
              >
                {feature.tagline}
              </p>

              {/* Description */}
              <p style={{ fontSize: 13.5, color: "#666", lineHeight: 1.7 }}>
                {feature.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #features .section-container > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 640px) and (max-width: 900px) {
          #features .section-container > div:last-child {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
