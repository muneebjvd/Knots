"use client";

import React from "react";
import Image from "next/image";

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
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-label="Knots Systems Logo"
    >
      <Image
        src="/knots_png_logo.png"
        alt="Knots Systems Logo"
        width={size}
        height={size}
        style={{ objectFit: "contain", width: "100%", height: "100%" }}
        priority
      />
    </div>
  );
}
