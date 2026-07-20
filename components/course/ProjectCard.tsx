"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectCardProps {
  title: string;
  description: string;
  skills: string[];
}

export function ProjectCard({ title, description, skills }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#0c0c0c",
        border: hovered
          ? "1px solid rgba(255,255,255,0.15)"
          : "1px solid rgba(255,255,255,0.06)",
        borderRadius: 20,
        padding: "36px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          background: "#161616",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f0f0f0"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </div>

      <h3
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: "-0.01em",
          marginBottom: 12,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: 15,
          color: "#A1A1AA",
          lineHeight: 1.6,
          marginBottom: 24,
          flexGrow: 1,
        }}
      >
        {description}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {skills.map((skill) => (
          <span
            key={skill}
            style={{
              background: "#161616",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "#A1A1AA",
              fontFamily: "monospace",
              fontSize: 12.5,
              padding: "4px 10px",
              borderRadius: 6,
              letterSpacing: "0.02em",
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
