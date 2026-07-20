"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface TOCItem { id: string; title: string; }

export function StickyTOC({ items }: { items: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const observedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let topmost: { id: string; top: number } | null = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const top = entry.boundingClientRect.top;
            if (!topmost || top < topmost.top) {
              topmost = { id: entry.target.id, top };
            }
            // Mark as completed once visited
            setCompleted((prev) => new Set([...prev, entry.target.id]));
          }
        });
        if (topmost) setActiveId((topmost as { id: string; top: number }).id);
      },
      {
        rootMargin: "-15% 0% -60% 0%",
        threshold: 0.1,
      }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el && !observedRef.current.has(id)) {
        observer.observe(el);
        observedRef.current.add(id);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <aside
      className="hidden xl:flex flex-col"
      style={{ width: 220, flexShrink: 0 }}
    >
      <div style={{ position: "sticky", top: 80 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#555",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 16,
            paddingLeft: 12,
          }}
        >
          On this page
        </p>

        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {items.map(({ id, title }) => {
            const isActive = activeId === id;
            const isDone = completed.has(id) && !isActive;

            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? "#ffffff" : isDone ? "#555" : "#6b7280",
                  background: isActive ? "rgba(16,185,129,0.08)" : "transparent",
                  borderLeft: `2px solid ${isActive ? "#10B981" : "transparent"}`,
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  lineHeight: 1.4,
                }}
              >
                <AnimatePresence mode="wait">
                  {isDone ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      style={{ flexShrink: 0 }}
                    >
                      <Check size={11} color="#10B981" strokeWidth={3} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="dot"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: isActive ? "#10B981" : "#2a2a2a",
                        flexShrink: 0,
                        transition: "background 0.15s",
                      }}
                    />
                  )}
                </AnimatePresence>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {title}
                </span>
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
