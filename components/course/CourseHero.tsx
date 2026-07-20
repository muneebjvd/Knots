"use client";

import React, { useEffect, useState } from "react";

interface HeroProps {
  day: number;
  totalDays: number;
  title: string;
  subtitle: string;
  duration: string;
  course: string;
  focus: string;
  difficulty: string;
}

export function CourseHero({ day, totalDays, title, subtitle, duration, course, focus, difficulty }: HeroProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const progress = (day / totalDays) * 100;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  // Animate from 0 to actual progress
  const strokeDashoffset = mounted ? circumference - (progress / 100) * circumference : circumference;

  return (
    <div
      style={{
        paddingTop: 96,
        paddingBottom: 80,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 64,
        flexWrap: "wrap",
      }}
    >
      <div style={{ flex: "1 1 500px" }}>
        <h1
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            marginBottom: 8,
            margin: 0,
          }}
        >
          Day {day}
        </h1>
        
        <p
          style={{
            fontSize: 24,
            color: "#A1A1AA",
            fontWeight: 600,
            marginBottom: 48,
            letterSpacing: "-0.02em",
            marginTop: 8,
          }}
        >
          {focus}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 48 }}>
          <span
            style={{
              backgroundColor: "#DFFF00",
              color: "#000000",
              fontWeight: 800,
              padding: "10px 16px",
              borderRadius: 8,
              letterSpacing: "0.04em",
              fontSize: 12,
              textTransform: "uppercase",
            }}
          >
            {course}
          </span>
          <span
            style={{
              backgroundColor: "#161616",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "#ffffff",
              fontWeight: 700,
              padding: "9px 16px",
              borderRadius: 8,
              letterSpacing: "0.04em",
              fontSize: 12,
              textTransform: "uppercase",
            }}
          >
            {duration}
          </span>
          <span
            style={{
              backgroundColor: "#161616",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "#ffffff",
              fontWeight: 700,
              padding: "9px 16px",
              borderRadius: 8,
              letterSpacing: "0.04em",
              fontSize: 12,
              textTransform: "uppercase",
            }}
          >
            {difficulty}
          </span>
          <span
            style={{
              backgroundColor: "#161616",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "#ffffff",
              fontWeight: 700,
              padding: "9px 16px",
              borderRadius: 8,
              letterSpacing: "0.04em",
              fontSize: 12,
              textTransform: "uppercase",
            }}
          >
            Practical Implementation
          </span>
          <span
            style={{
              backgroundColor: "#161616",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "#ffffff",
              fontWeight: 700,
              padding: "9px 16px",
              borderRadius: 8,
              letterSpacing: "0.04em",
              fontSize: 12,
              textTransform: "uppercase",
            }}
          >
            Project Included
          </span>
        </div>

        <p
          style={{
            fontSize: 20,
            color: "#e4e4e7",
            lineHeight: 1.6,
            maxWidth: 700,
            fontWeight: 500,
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Circular Progress Indicator */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          width: 160,
          height: 160,
          flexShrink: 0,
        }}
      >
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#10B981"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              transition: "stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "scale(1)" : "scale(0.95)",
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 2 }}>Day</span>
          <span style={{ fontSize: 44, fontWeight: 800, color: "#ffffff", lineHeight: 1, marginBottom: 2, letterSpacing: "-0.04em" }}>{day}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.15em" }}>of {totalDays}</span>
        </div>
      </div>
    </div>
  );
}
