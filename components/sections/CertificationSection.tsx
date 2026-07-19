"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function CertificationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="certification"
      className="section-padding"
      ref={sectionRef}
      aria-labelledby="cert-title"
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: "#0f0f0f",
            border: "1px solid #1a1a1a",
            borderRadius: 24,
            padding: "72px 64px",
            textAlign: "center",
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          {/* Certificate icon */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#050505",
              border: "1px solid #1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 32px",
              color: "#d0d0d0",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
            </svg>
          </div>

          <p className="text-label" style={{ color: "#00E6A8", marginBottom: 16 }}>
            Certification Philosophy
          </p>

          <h2 id="cert-title" className="text-section-title" style={{ marginBottom: 20 }}>
            Backed by competency.
          </h2>

          <p className="text-body" style={{ maxWidth: 540, margin: "0 auto 48px", fontSize: 16, lineHeight: 1.7 }}>
            No multiple-choice exams. No attendance certificates. Only demonstrated capability
            through real engineering implementation.
          </p>

          {/* Three pillars */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
              marginBottom: 48,
            }}
          >
            {[
              { icon: "✗", label: "No Quizzes", sub: "Theory isn't enough", dim: true },
              { icon: "✗", label: "No Attendance", sub: "Watching isn't building", dim: true },
              { icon: "✓", label: "Project Evaluation", sub: "Code is proof", green: true },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  padding: "24px 20px",
                  background: item.green ? "#0a0a0a" : "#050505",
                  border: `1px solid ${item.green ? "#1a1a1a" : "#111"}`,
                  borderRadius: 16,
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: 20,
                    marginBottom: 10,
                    color: item.green ? "#f0f0f0" : "#444",
                    fontWeight: 600,
                  }}
                >
                  {item.icon}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: item.green ? "#f0f0f0" : "#666",
                    marginBottom: 4,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {item.label}
                </p>
                <p style={{ fontSize: 12, color: item.green ? "#888" : "#444" }}>{item.sub}</p>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "#0a0a0a",
              border: "1px solid #161616",
              borderLeft: "2px solid rgba(0,230,168,0.3)",
              borderRadius: "0 12px 12px 0",
              padding: "20px 28px",
              textAlign: "left",
            }}
          >
            <p className="text-body" style={{ color: "#888", fontSize: 14, lineHeight: 1.7 }}>
              Students receive certification only after successfully building and submitting a practical
              engineering project that demonstrates real understanding. This distinguishes
              Knots Systems from conventional learning platforms.
            </p>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #certification > div > div {
            padding: 48px 32px !important;
          }
          #certification > div > div > div:nth-of-type(2) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
