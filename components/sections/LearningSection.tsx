"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const processSteps = [
  { label: "Learn", desc: "Absorb curated content" },
  { label: "Code", desc: "Write implementations" },
  { label: "Experiment", desc: "Test assumptions" },
  { label: "Debug", desc: "Solve real problems" },
  { label: "Build", desc: "Assemble systems" },
  { label: "Review", desc: "Analyze and critique" },
  { label: "Deploy", desc: "Ship to production" },
  { label: "Submit", desc: "Deliver final project" },
  { label: "Certify", desc: "Earn your credential" },
];

export default function LearningSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <section
      id="learning"
      className="section-padding"
      ref={sectionRef}
      aria-labelledby="learning-title"
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 72 }}
        >
          <p className="text-label" style={{ color: "#00E6A8", marginBottom: 14 }}>
            The Process
          </p>
          <h2 id="learning-title" className="text-section-title" style={{ marginBottom: 14 }}>
            How mastery<br />
            <span className="text-gradient">actually happens.</span>
          </h2>
          <p className="text-body" style={{ maxWidth: 400 }}>
            A complete engineering cycle from exposure to certified competency.
          </p>
        </motion.div>

        {/* Process chain */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 0,
            overflowX: "auto",
            paddingBottom: 8,
            scrollbarWidth: "none",
          }}
        >
          {processSteps.map((step, i) => (
            <React.Fragment key={step.label}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  flexShrink: 0,
                  minWidth: 88,
                  cursor: "none",
                }}
                onMouseEnter={() => setHoveredStep(i)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Dot */}
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: hoveredStep === i ? "#111" : "#0d0d0d",
                    border: "1px solid #1e1e1e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                  }}
                >
                  {i === processSteps.length - 1 ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d0d0d0" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <circle cx="12" cy="8" r="6" />
                      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                    </svg>
                  ) : (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: hoveredStep === i ? "#d0d0d0" : "#555",
                        transition: "color 0.3s",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  )}
                </div>

                {/* Label */}
                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      fontSize: 12.5,
                      fontWeight: 500,
                      color: hoveredStep === i ? "#d0d0d0" : "#666",
                      letterSpacing: "-0.01em",
                      marginBottom: 2,
                      transition: "color 0.3s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {step.label}
                  </p>
                  <p style={{ fontSize: 11, color: "#333", textAlign: "center" }}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>

              {/* Connector */}
              {i < processSteps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.35, delay: i * 0.06 + 0.15, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    flex: 1,
                    minWidth: 16,
                    height: 1,
                    marginTop: 19,
                    background: "#1a1a1a",
                    transformOrigin: "left",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{ marginTop: 52, display: "flex", alignItems: "center", gap: 10 }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#00E6A8",
              boxShadow: "0 0 8px rgba(0,230,168,0.4)",
              animation: "llPulse 2.5s ease-in-out infinite",
              flexShrink: 0,
            }}
          />
          <p style={{ fontSize: 13, color: "#444" }}>
            Each step is guided, assessed, and verified on completion
          </p>
        </motion.div>
      </div>

      <style>{`
        @keyframes llPulse { 0%,100%{opacity:.5} 50%{opacity:1} }
      `}</style>
    </section>
  );
}
