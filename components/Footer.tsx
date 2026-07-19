"use client";

import React from "react";
import { KnotsLogo } from "@/components/KnotsLogo";

const footerLinks = [
  { label: "Vision", href: "#vision" },
  { label: "Courses", href: "#courses" },
  { label: "Learning", href: "#learning" },
  { label: "Certification", href: "#certification" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "About", href: "#about" },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/knotssystems",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/knotssystems",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:hello@knots.systems",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

export default function Footer() {
  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.replace("#", "");
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer
      style={{
        margin: "0 24px 24px",
        background: "#080808",
        border: "1px solid #141414",
        borderRadius: 24,
        padding: "48px 64px",
      }}
      role="contentinfo"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 48,
          marginBottom: 48,
        }}
      >
        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <KnotsLogo size={24} instanceId="footer" />
            <span style={{ fontSize: 15, fontWeight: 600, color: "#f0f0f0", letterSpacing: "-0.02em" }}>
              Knots Systems
            </span>
          </div>
          <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, maxWidth: 240 }}>
            Build the world's most respected engineering competency platform where people
            become engineers through implementation.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="text-label" style={{ marginBottom: 16, color: "#444" }}>
            Navigation
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                style={{
                  fontSize: 13,
                  color: "#666",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                  letterSpacing: "-0.01em",
                }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#d0d0d0"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "#666"; }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Connect */}
        <div>
          <p className="text-label" style={{ marginBottom: 16, color: "#444" }}>
            Connect
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            <a
              href="mailto:hello@knots.systems"
              style={{
                fontSize: 13,
                color: "#666",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#00E6A8"; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "#666"; }}
            >
              hello@knots.systems
            </a>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("mailto") ? undefined : "_blank"}
                rel={social.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                aria-label={social.label}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "#0d0d0d",
                  border: "1px solid #1a1a1a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#555",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = "#00E6A8";
                  el.style.borderColor = "#222";
                  el.style.background = "#111";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = "#555";
                  el.style.borderColor = "#1a1a1a";
                  el.style.background = "#0d0d0d";
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 24,
          borderTop: "1px solid #161616",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <p style={{ fontSize: 12, color: "#444" }}>
          © {new Date().getFullYear()} Knots Systems. All rights reserved.
        </p>
        <p style={{ fontSize: 12, color: "#3a3a3a", fontStyle: "italic" }}>
          Designed with precision. Built for engineers.
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div:first-child {
            grid-template-columns: 1fr !important;
          }
          footer {
            margin: 0 12px 12px !important;
            padding: 40px 24px !important;
          }
        }
      `}</style>
    </footer>
  );
}
