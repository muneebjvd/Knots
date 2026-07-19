"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { KnotsLogo } from "@/components/KnotsLogo";

const navLinks = [
  { label: "Vision", href: "#vision" },
  { label: "Courses", href: "#courses" },
  { label: "Learning", href: "#learning" },
  { label: "Certification", href: "#certification" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "About", href: "#about" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) setScrolled(isScrolled);
      
      const sectionIds = ["hero", "vision", "features", "courses", "learning", "certification", "roadmap", "about"];
      for (const id of [...sectionIds].reverse()) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            if (activeSection !== id) setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="nav-wrapper" role="navigation" aria-label="Main navigation">
      <motion.nav
        className={`nav-inner${scrolled ? " scrolled" : ""}`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => scrollTo(e, "#hero")}
          className="nav-logo"
          aria-label="Knots Systems Home"
        >
          <KnotsLogo size={24} instanceId="nav" />
          <span>Knots Systems</span>
        </a>

        {/* Links */}
        <ul className="nav-links" role="list">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => scrollTo(e, link.href)}
                  className={activeSection === id ? "active" : ""}
                  aria-current={activeSection === id ? "page" : undefined}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <a
          href="#courses"
          onClick={(e) => scrollTo(e, "#courses")}
          className="nav-cta"
          id="nav-explore-btn"
          aria-label="Explore Courses"
        >
          Explore Courses
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </a>
      </motion.nav>
    </div>
  );
}
