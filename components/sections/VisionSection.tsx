"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const timelineStages = [
  { stage: "Watch", desc: "Curated world-class content" },
  { stage: "Understand", desc: "Grasp concepts at depth" },
  { stage: "Implement", desc: "Knowledge into working code" },
  { stage: "Build", desc: "Complete systems from scratch" },
  { stage: "Review", desc: "Analyze your implementation" },
  { stage: "Improve", desc: "Iterate and refine" },
  { stage: "Final Project", desc: "Demonstrate full mastery" },
  { stage: "Competency", desc: "Certificate earned" },
];

export default function VisionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });
  const [activeStage, setActiveStage] = useState(-1);

  useEffect(() => {
    if (isInView) {
      timelineStages.forEach((_, i) => {
        setTimeout(() => setActiveStage(i), i * 180);
      });
    } else {
      setActiveStage(-1);
    }
  }, [isInView]);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <section id="vision" className="section-padding" ref={sectionRef} aria-labelledby="vision-title">
      <div className="section-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "start",
          }}
        >
          {/* Left */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.p className="text-label" variants={itemVariants} style={{ color: "#00E6A8", marginBottom: 14 }}>
              Why We Exist
            </motion.p>

            <motion.h2 id="vision-title" className="text-section-title" variants={itemVariants} style={{ marginBottom: 36 }}>
              Why Knots<br />
              <span className="text-gradient">Exists</span>
            </motion.h2>

            <motion.div variants={itemVariants} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { text: "The internet has endless videos.", dim: true },
                { text: "Universities teach theory.", dim: true },
                { text: "Bootcamps teach tools.", dim: true },
                { text: "Companies need engineers.", dim: false },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: "18px 0",
                    borderBottom: i < 3 ? "1px solid #141414" : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: i === 3 ? "#00E6A8" : "#2a2a2a",
                      flexShrink: 0,
                      boxShadow: i === 3 ? "0 0 6px rgba(0,230,168,0.4)" : "none",
                    }}
                  />
                  <p
                    style={{
                      fontSize: i === 3 ? 17 : 15,
                      fontWeight: i === 3 ? 500 : 400,
                      color: i === 3 ? "#f0f0f0" : "#555",
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} style={{ marginTop: 28 }}>
              <div
                style={{
                  padding: "18px 22px",
                  background: "#0d0d0d",
                  border: "1px solid #1a1a1a",
                  borderLeft: "2px solid rgba(0, 230, 168, 0.35)",
                  borderRadius: "0 12px 12px 0",
                }}
              >
                <p style={{ fontSize: 15, color: "#888", lineHeight: 1.75 }}>
                  Students don't just consume information.{" "}
                  <strong style={{ color: "#d0d0d0", fontWeight: 500 }}>
                    They transform knowledge into engineering capability.
                  </strong>
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 28 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              style={{
                background: "#0a0a0a",
                border: "1px solid #1a1a1a",
                borderRadius: 20,
                padding: "36px 32px",
              }}
            >
              <p className="text-label" style={{ marginBottom: 28 }}>
                The Knots Learning Path
              </p>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {timelineStages.map((item, i) => (
                  <div key={item.stage} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    {/* Node + line */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div
                        className={`timeline-node${activeStage >= i ? " active" : ""}`}
                        style={{ marginTop: 5 }}
                      />
                      {i < timelineStages.length - 1 && (
                        <div
                          style={{
                            width: 1,
                            height: 36,
                            background: activeStage > i
                              ? "rgba(0, 230, 168, 0.25)"
                              : "#161616",
                            transition: "background 0.4s ease",
                            margin: "4px 0",
                          }}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div
                      style={{
                        paddingBottom: i < timelineStages.length - 1 ? 0 : 0,
                        opacity: activeStage >= i ? 1 : 0.3,
                        transition: "opacity 0.4s ease",
                        paddingTop: 2,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 13.5,
                          fontWeight: 500,
                          color: activeStage >= i ? "#d0d0d0" : "#666",
                          letterSpacing: "-0.01em",
                          transition: "color 0.4s ease",
                          marginBottom: 1,
                        }}
                      >
                        {item.stage}
                        {i === timelineStages.length - 1 && (
                          <span
                            style={{
                              marginLeft: 8,
                              fontSize: 10,
                              padding: "1px 7px",
                              borderRadius: 999,
                              background: "rgba(0,230,168,0.08)",
                              border: "1px solid rgba(0,230,168,0.18)",
                              color: "#00E6A8",
                              display: "inline-flex",
                              letterSpacing: "0.04em",
                            }}
                          >
                            Earned
                          </span>
                        )}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#3a3a3a",
                          marginBottom: i < timelineStages.length - 1 ? 8 : 0,
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #vision .section-container > div {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  );
}
