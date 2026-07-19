"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const course = {
  id: "ai-foundations",
  title: "AI Engineering Foundations",
  duration: "15 Days",
  status: "Available Now",
  description:
    "Master modern Artificial Intelligence from the ground up through a structured, project-based curriculum. Learn Python programming, computational thinking, search algorithms, knowledge representation, probability, optimization, machine learning, neural networks, natural language processing, prompt engineering, Generative AI, Large Language Models, Retrieval-Augmented Generation (RAG), vector databases, AI agents, function calling, responsible AI, and deploy real AI applications through guided implementation.",
  chips: [
    { text: "Harvard CS50 AI", icon: "harvard" },
    { text: "Microsoft Generative AI for Beginners", icon: "microsoft" },
    { text: "Daily Implementation", icon: "check" },
    { text: "Final Capstone Project", icon: "check" },
    { text: "Industry Certificate", icon: "check" },
  ],
};

export default function CoursesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="courses"
      className="section-padding"
      ref={sectionRef}
      aria-labelledby="courses-title"
    >
      <div className="section-container" style={{ maxWidth: 900 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 48, textAlign: "center" }}
        >
          <p className="text-label" style={{ color: "#555", marginBottom: 12 }}>
            Engineering Curriculum
          </p>
          <h2 id="courses-title" className="text-section-title" style={{ marginBottom: 16, fontSize: 36 }}>
            Start building.
          </h2>
        </motion.div>

        {/* Single course card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            role="button"
            tabIndex={0}
            style={{
              background: "#0c0c0c",
              border: "1px solid #1a1a1a",
              borderRadius: 16,
              padding: "48px 56px",
              cursor: "pointer",
              transition: "background 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
              textAlign: "left",
              display: "block",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = "#111";
              el.style.borderColor = "#262626";
              el.style.transform = "translateY(-2px)";
              el.style.boxShadow = "0 8px 30px rgba(0,0,0,0.6)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = "#0c0c0c";
              el.style.borderColor = "#1a1a1a";
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "none";
            }}
          >
            {/* Top row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
              <div>
                <h3
                  style={{
                    fontSize: 32,
                    fontWeight: 600,
                    color: "#f0f0f0",
                    letterSpacing: "-0.03em",
                    marginBottom: 8,
                  }}
                >
                  {course.title}
                </h3>
                <p style={{ fontSize: 14, color: "#666", letterSpacing: "-0.01em" }}>
                  {course.duration}
                </p>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  padding: "6px 14px",
                  borderRadius: 999,
                  background: "#00E6A8",
                  color: "#000",
                  letterSpacing: "-0.01em",
                }}
              >
                {course.status}
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: 15, color: "#888", lineHeight: 1.8, marginBottom: 36, maxWidth: 700 }}>
              {course.description}
            </p>

            {/* Metadata chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {course.chips.map((chip, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    background: "#050505",
                    border: "1px solid #1e1e1e",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "#555",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {chip.icon === "harvard" && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  )}
                  {chip.icon === "microsoft" && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
                    </svg>
                  )}
                  {chip.icon === "check" && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {chip.text}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          #courses > div > div > div {
            padding: 32px 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
