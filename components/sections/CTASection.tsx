"use client";

import React, { useRef, Suspense, lazy } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

const RibbonCanvas = lazy(() => import("@/components/RibbonCanvas"));

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="cta"
      ref={sectionRef}
      aria-label="Call to action"
      style={{
        position: "relative",
        padding: "160px 0 120px",
        overflow: "hidden",
      }}
    >
      {/* Background ribbon — slightly visible but very subtle */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.25, // Reduced opacity to reduce visual noise
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <Suspense fallback={null}>
          <RibbonCanvas />
        </Suspense>
      </div>

      {/* Heavy vignette to keep text readable without blur */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.95) 100%)",
          pointerEvents: "none",
        }}
      />

      <div className="section-container" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", maxWidth: 800, margin: "0 auto" }}
        >
          <p className="text-label" style={{ color: "#00E6A8", marginBottom: 20 }}>
            Ready to Build?
          </p>

          <h2
            style={{
              fontSize: "clamp(36px, 4.5vw, 64px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              color: "#f0f0f0",
              marginBottom: 24,
            }}
          >
            The future belongs to<br />
            <span className="text-gradient">engineers who build.</span>
          </h2>

          <p className="text-body" style={{ maxWidth: 440, margin: "0 auto 48px", fontSize: 16 }}>
            Join the platform where engineers prove their competency by doing—not by
            watching, but by building systems that work.
          </p>

          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 64,
            }}
          >
            <a
              href="#courses"
              onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}
              className="btn-primary"
              id="cta-start-btn"
              aria-label="Start Learning"
              style={{ padding: "14px 32px", fontSize: 15 }}
            >
              Start Building
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Minimal Stats */}
          <div
            style={{
              display: "flex",
              gap: 48,
              justifyContent: "center",
              flexWrap: "wrap",
              borderTop: "1px solid #1a1a1a",
              paddingTop: 48,
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            {[
              { value: "4", label: "Engineering Tracks" },
              { value: "15", label: "Days Per Track" },
              { value: "Free", label: "Platform Access" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    color: "#f0f0f0",
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  {stat.value}
                </p>
                <p style={{ fontSize: 12, color: "#666", letterSpacing: "0.01em" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
