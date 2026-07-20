"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const VALID_KEYS: Record<string, string> = {
  "KDc0niZOUP9d4Vtb": "/AIEF/DAY1",
};

export default function AccessGatePage() {
  const [accessKey, setAccessKey] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
    // Reset unlock state when visiting the gate page
    sessionStorage.removeItem("aief_unlocked_day1");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetRoute = VALID_KEYS[accessKey.trim()];

    if (targetRoute) {
      setError(false);
      setLoading(true);
      // Save unlock state
      sessionStorage.setItem("aief_unlocked_day1", "1");
      router.push(targetRoute);
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#090909",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', -apple-system, sans-serif",
        WebkitFontSmoothing: "antialiased",
        position: "relative",
      }}
    >
      {/* Back Link - Absolutely positioned with guaranteed inline styles */}
      <div style={{ position: "absolute", top: 40, left: 48 }}>
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#A1A1AA",
            textDecoration: "none",
            fontSize: 15,
            fontWeight: 500,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#A1A1AA")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Knots Systems
        </Link>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "100%",
          maxWidth: 480,
          padding: "0 24px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              marginBottom: 12,
            }}
          >
            AI Engineering Foundations
          </h1>
          <p style={{ color: "#A1A1AA", fontSize: 17, fontWeight: 500 }}>
            Each lesson is unlocked using a daily access key.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#0f0f0f",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: 36,
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <input
              ref={inputRef}
              type="text"
              value={accessKey}
              onChange={(e) => {
                setAccessKey(e.target.value);
                setError(false);
              }}
              placeholder="Enter Access Key"
              autoComplete="off"
              spellCheck="false"
              style={{
                width: "100%",
                height: 56,
                backgroundColor: "#141414",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#ffffff",
                padding: "0 20px",
                borderRadius: 12,
                outline: "none",
                textAlign: "center",
                letterSpacing: "0.2em",
                fontFamily: "monospace",
                fontSize: 17,
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#10B981")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
            />

            <button
              type="submit"
              disabled={loading || !accessKey.trim()}
              style={{
                width: "100%",
                height: 52,
                backgroundColor: "#10B981",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: 16,
                borderRadius: 12,
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                cursor: loading || !accessKey.trim() ? "not-allowed" : "pointer",
                opacity: loading || !accessKey.trim() ? 0.6 : 1,
                transition: "transform 0.15s, background-color 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!loading && accessKey.trim()) {
                  e.currentTarget.style.backgroundColor = "#0e9f6e";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && accessKey.trim()) {
                  e.currentTarget.style.backgroundColor = "#10B981";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
              onMouseDown={(e) => {
                if (!loading && accessKey.trim()) {
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {loading ? (
                <>
                  <svg
                    style={{ animation: "spin 1s linear infinite", height: 20, width: 20, color: "#ffffff" }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Unlocking...
                  <style>
                    {`
                      @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                      }
                    `}
                  </style>
                </>
              ) : (
                "Unlock Today's Lesson"
              )}
            </button>
          </form>

          <div style={{ height: 24, marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  style={{
                    color: "#EF4444",
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  Invalid Access Key
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
