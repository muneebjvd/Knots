"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const milestones = [
  {
    label: "Platform Launched",
    desc: "Knots Systems is live",
    status: "done",
  },
  {
    label: "AI Engineering Foundations",
    desc: "Available Now",
    status: "current",
    note: "Python · Problem Solving · Final Project",
  },
  {
    label: "AI Engineering",
    desc: "Coming Soon",
    status: "next",
    note: "LLMs · RAG · Agents · Deployment",
  },
  {
    label: "AI Systems Engineering",
    desc: "In Development",
    status: "planned",
    note: "Distributed Systems · Infrastructure · Observability",
  },
  {
    label: "AI Game Development",
    desc: "Planned",
    status: "future",
    note: "Game AI · NPC Behaviors · Procedural Intelligence",
  },
];

export default function RoadmapSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="roadmap"
      className="section-padding"
      ref={sectionRef}
      aria-labelledby="roadmap-title"
    >
      <div className="section-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: 96,
            alignItems: "start",
          }}
        >
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: "sticky", top: 120 }}
          >
            <p className="text-label" style={{ color: "#00E6A8", marginBottom: 14 }}>
              What's Next
            </p>
            <h2 id="roadmap-title" className="text-section-title" style={{ marginBottom: 20 }}>
              The road<br />
              <span className="text-gradient">forward.</span>
            </h2>
            <p className="text-body" style={{ marginBottom: 32 }}>
              Four engineering tracks in development. Each one expands on the last.
            </p>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 16px",
                background: "#0f0f0f",
                border: "1px solid #1a1a1a",
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#00E6A8",
                  boxShadow: "0 0 8px rgba(0,230,168,0.5)",
                  animation: "rmPulse 2.5s ease-in-out infinite",
                  flexShrink: 0,
                }}
              />
              <p style={{ fontSize: 13, color: "#666" }}>Actively building</p>
            </div>
          </motion.div>

          {/* Right: Timeline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {milestones.map((milestone, i) => {
              const isCurrent = milestone.status === "current";
              const isDone = milestone.status === "done";
              const isNext = milestone.status === "next";
              const isMuted = milestone.status === "planned" || milestone.status === "future";

              const dotColor = isCurrent
                ? "#00E6A8"
                : isDone
                ? "#00E6A8"
                : "transparent";

              const dotBorder = isCurrent || isDone
                ? "#00E6A8"
                : "#2a2a2a";

              return (
                <motion.div
                  key={milestone.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: "flex", gap: 20 }}
                >
                  {/* Dot + connector */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flexShrink: 0,
                      paddingTop: 4,
                    }}
                  >
                    <div
                      style={{
                        width: isCurrent ? 11 : 9,
                        height: isCurrent ? 11 : 9,
                        borderRadius: "50%",
                        background: dotColor,
                        border: `1.5px solid ${dotBorder}`,
                        boxShadow: isCurrent ? "0 0 12px rgba(0,230,168,0.45)" : "none",
                        transition: "all 0.4s ease",
                        flexShrink: 0,
                      }}
                    />
                    {i < milestones.length - 1 && (
                      <div
                        style={{
                          width: 1,
                          flex: 1,
                          minHeight: 48,
                          background: isDone
                            ? "rgba(0,230,168,0.3)"
                            : "#1a1a1a",
                          margin: "5px 0",
                          transition: "background 0.4s ease",
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div
                    style={{
                      flex: 1,
                      paddingBottom: 36,
                      opacity: isMuted ? 0.35 : 1,
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
                      <h3
                        style={{
                          fontSize: isCurrent ? 17 : 15,
                          fontWeight: isCurrent ? 600 : 500,
                          color: isCurrent || isDone ? "#f0f0f0" : "#666",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {milestone.label}
                      </h3>
                      {isCurrent && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: 999,
                            background: "rgba(0,230,168,0.1)",
                            border: "1px solid rgba(0,230,168,0.2)",
                            color: "#00E6A8",
                            letterSpacing: "0.04em",
                          }}
                        >
                          LIVE
                        </span>
                      )}
                    </div>

                    <p
                      style={{
                        fontSize: 12,
                        color: "#3a3a3a",
                        marginBottom: milestone.note ? 8 : 0,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {milestone.desc}
                    </p>

                    {milestone.note && (
                      <p style={{ fontSize: 12, color: "#2e2e2e", letterSpacing: "-0.01em" }}>
                        {milestone.note}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes rmPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @media (max-width: 900px) {
          #roadmap .section-container > div {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          #roadmap .section-container > div > div:first-child {
            position: static !important;
          }
        }
      `}</style>
    </section>
  );
}
