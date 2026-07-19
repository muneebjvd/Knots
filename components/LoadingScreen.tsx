"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { KnotsLogo } from "@/components/KnotsLogo";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      aria-label="Loading Knots Systems"
      role="status"
    >
      {/* Glowing thread from top */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: 1,
          height: 36,
          background: "linear-gradient(to bottom, transparent, #00E6A8)",
          marginBottom: -4,
          transformOrigin: "top",
          boxShadow: "0 0 8px rgba(0, 230, 168, 0.7)",
        }}
      />

      {/* Knot logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ filter: "drop-shadow(0 0 20px rgba(0, 230, 168, 0.35))" }}
      >
        <KnotsLogo size={72} instanceId="loading" />
      </motion.div>

      {/* Glowing thread below */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: 1,
          height: 24,
          background: "linear-gradient(to bottom, #00E6A8, transparent)",
          marginTop: -4,
          transformOrigin: "bottom",
          boxShadow: "0 0 8px rgba(0, 230, 168, 0.5)",
        }}
      />

      {/* Brand name */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#F8F8F8",
          marginTop: 8,
        }}
      >
        KNOTS SYSTEMS
      </motion.p>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        style={{
          fontSize: 12,
          fontWeight: 400,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "#555",
        }}
      >
        Learn · Build · Prove
      </motion.p>
    </motion.div>
  );
}
