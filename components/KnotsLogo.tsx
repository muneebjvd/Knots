"use client";

import React from "react";

export function KnotsLogo({
  size = 32,
  className = "",
  showGlow = false, // Deprecated, kept for API compatibility
  instanceId,
}: {
  size?: number;
  className?: string;
  showGlow?: boolean;
  instanceId?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Knots Systems Logo"
      role="img"
      style={{
        transition: "all 0.3s ease",
      }}
    >
      {/* Top arc — Learn loop */}
      <path
        d="M50 18 C34 18, 20 28, 20 43 C20 54, 28 62, 40 63 C37 56, 37 46, 43 41 C46 44, 50 50, 50 56"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Right side — Build loop */}
      <path
        d="M50 56 C50 50, 54 44, 57 41 C63 46, 63 56, 60 63 C72 62, 80 54, 80 43 C80 28, 66 18, 50 18"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Bottom left — Prove loop */}
      <path
        d="M40 63 C30 66, 20 73, 20 83 C20 91, 28 96, 38 94 C34 88, 35 80, 42 77 C44 80, 46 84, 50 86"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Bottom right — continuation */}
      <path
        d="M50 86 C54 84, 56 80, 58 77 C65 80, 66 88, 62 94 C72 96, 80 91, 80 83 C80 73, 70 66, 60 63"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Center knot */}
      <circle cx="50" cy="56" r="4.5" fill="#00E6A8" />
    </svg>
  );
}

export default KnotsLogo;
