"use client";

import React, { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);

  useEffect(() => {
    // Zero lag tracking. 1:1 speed. Native feeling.
    const onMove = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${e.clientX}px`;
        ringRef.current.style.top = `${e.clientY}px`;
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        !!target.closest("button") ||
        !!target.closest("a") ||
        target.getAttribute("role") === "button";

      if (interactive && !isHovering.current) {
        isHovering.current = true;
        if (dotRef.current) {
          dotRef.current.style.transform = "translate(-50%, -50%) scale(1.5)";
          dotRef.current.style.opacity = "0.4";
        }
        if (ringRef.current) {
          ringRef.current.style.width = "40px";
          ringRef.current.style.height = "40px";
          ringRef.current.style.borderColor = "rgba(255, 255, 255, 0.15)";
          ringRef.current.style.background = "rgba(255, 255, 255, 0.05)";
        }
      } else if (!interactive && isHovering.current) {
        isHovering.current = false;
        if (dotRef.current) {
          dotRef.current.style.transform = "translate(-50%, -50%) scale(1)";
          dotRef.current.style.opacity = "1";
        }
        if (ringRef.current) {
          ringRef.current.style.width = "24px";
          ringRef.current.style.height = "24px";
          ringRef.current.style.borderColor = "rgba(255, 255, 255, 0.1)";
          ringRef.current.style.background = "transparent";
        }
      }
    };

    const onMouseLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };
    const onMouseEnter = () => {
      if (dotRef.current) dotRef.current.style.opacity = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";
    };

    // Use capturing phase and passive for maximum performance
    document.addEventListener("mousemove", onMove, { passive: true, capture: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Initial position offscreen
    if (dotRef.current) {
      dotRef.current.style.left = "-100px";
      dotRef.current.style.top = "-100px";
    }
    if (ringRef.current) {
      ringRef.current.style.left = "-100px";
      ringRef.current.style.top = "-100px";
    }

    return () => {
      document.removeEventListener("mousemove", onMove, { capture: true });
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 5,
          height: 5,
          background: "#fff",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 10000,
          transform: "translate(-50%, -50%)",
          transition: "transform 0.1s ease, opacity 0.15s ease",
          willChange: "left, top",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 24,
          height: 24,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
          transition: "width 0.15s ease, height 0.15s ease, border-color 0.15s ease, background 0.15s ease, opacity 0.15s ease",
          willChange: "left, top",
        }}
      />
    </>
  );
}
