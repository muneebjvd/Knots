"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="about"
      className="section-padding"
      ref={sectionRef}
      aria-labelledby="about-title"
    >
      <div className="section-container" style={{ maxWidth: 800, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <p className="text-label" style={{ color: "#00E6A8", marginBottom: 14 }}>
            Our Philosophy
          </p>
          <h2 id="about-title" className="text-section-title">
            Built for engineers<br />
            <span className="text-gradient">who build.</span>
          </h2>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            {
              title: "Craftsmanship over credentials",
              body: "A certificate from an institution tells you what someone studied. A working system tells you what someone can do. Knots Systems exists to bridge that gap—permanently.",
            },
            {
              title: "Open learning, always",
              body: (
                <span key="desc-2">
                  The best educational content in the world is already free.{" "}
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#aaa" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Harvard CS50
                  </span>
                  .{" "}
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#aaa" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
                    </svg>
                    Microsoft Learn
                  </span>
                  . Khan Academy. Knots doesn't compete with them—we build on top of them. Structure, community, and accountability are what transform exposure into competency.
                </span>
              ),
            },
            {
              title: "Engineering is a practice",
              body: "Every great engineer built their skill through building. Not through watching. Not through reading. Through the act of taking something that doesn't exist and making it real. Knots exists to create that experience—repeatedly, systematically, and measurably.",
            },
            {
              title: "Trust through implementation",
              body: "When you complete a Knots track, you don't walk away with a piece of paper—you walk away with working software. Your portfolio speaks before you do. Companies don't hire certificates. They hire engineers who ship.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                padding: "28px 32px",
                background: i === 0 ? "#0a0a0a" : "#080808",
                border: "1px solid #161616",
                borderLeft: i === 0 ? "2px solid rgba(0,230,168,0.35)" : "1px solid #161616",
                borderRadius: i === 0 ? "0 16px 16px 0" : 16,
                borderTopLeftRadius: i === 0 ? 0 : 16,
                borderBottomLeftRadius: i === 0 ? 0 : 16,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: i === 0 ? "#f0f0f0" : "#d0d0d0",
                  marginBottom: 10,
                  letterSpacing: "-0.01em",
                }}
              >
                {item.title}
              </h3>
              <p style={{ fontSize: 14.5, color: "#888", lineHeight: 1.75 }}>
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
