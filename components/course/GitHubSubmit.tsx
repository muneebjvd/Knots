"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export function GitHubSubmit({ format, example }: { format: string; example: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div id="submit" style={{ scrollMarginTop: 128 }}>
      <h2
        style={{
          fontSize: 30,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: "-0.02em",
          marginBottom: 32,
        }}
      >
        GitHub Submission
      </h2>
      
      <div
        style={{
          background: "#0c0c0c",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20,
          padding: 48,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#f0f0f0" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
            <path d="M9 18c-4.51 2-5-2-7-2"/>
          </svg>
        </div>

        <h3
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 12,
          }}
        >
          Upload Your Project
        </h3>
        <p
          style={{
            color: "#A1A1AA",
            fontSize: 17,
            marginBottom: 40,
            maxWidth: 500,
            fontWeight: 500,
            lineHeight: 1.6,
          }}
        >
          Create a public GitHub repository for today's assignment using the standard naming convention.
        </p>

        <div
          style={{
            width: "100%",
            maxWidth: 480,
            background: "#121212",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 32,
            marginBottom: 40,
            textAlign: "left",
          }}
        >
          <p
            style={{
              color: "#52525B",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 8,
            }}
          >
            Format
          </p>
          <p
            style={{
              color: "#DFFF00",
              fontFamily: "monospace",
              fontSize: 16,
              fontWeight: 600,
              background: "rgba(223, 255, 0, 0.08)",
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid rgba(223, 255, 0, 0.2)",
              display: "inline-block",
              marginBottom: 32,
            }}
          >
            {format}
          </p>
          
          <p
            style={{
              color: "#52525B",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 8,
            }}
          >
            Example
          </p>
          <p
            style={{
              color: "#ffffff",
              fontFamily: "monospace",
              fontSize: 16,
              fontWeight: 600,
              background: "rgba(255,255,255,0.04)",
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.08)",
              display: "inline-block",
            }}
          >
            {example}
          </p>
        </div>

        <a
          href="https://github.com/new"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            height: 52,
            padding: "0 32px",
            background: hovered ? "#c8e600" : "#DFFF00",
            color: "#000000",
            fontWeight: 600,
            fontSize: 16,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            transition: "all 0.15s ease",
            transform: hovered ? "translateY(-2px)" : "translateY(0)",
          }}
        >
          Upload My Project
        </a>
      </div>
    </div>
  );
}
