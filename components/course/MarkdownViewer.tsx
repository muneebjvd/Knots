"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css";
import { Copy, Check } from "lucide-react";

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy code"
      style={{
        background: "transparent",
        border: "none",
        color: copied ? "#DFFF00" : "#8b949e",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        borderRadius: 6,
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!copied) e.currentTarget.style.color = "#c9d1d9";
      }}
      onMouseLeave={(e) => {
        if (!copied) e.currentTarget.style.color = "#8b949e";
      }}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
};

export function MarkdownViewer({ content }: { content: string }) {
  return (
    <div
      style={{
        color: "#c9d1d9",
        fontSize: 16,
        lineHeight: 1.6,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight, rehypeSlug]}
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children, id }) => (
            <h1 id={id} style={{ fontSize: 32, fontWeight: 700, color: "#ffffff", marginTop: 48, marginBottom: 24, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.08)", letterSpacing: "-0.02em" }}>
              {children}
            </h1>
          ),
          h2: ({ children, id }) => (
            <h2 id={id} style={{ fontSize: 24, fontWeight: 700, color: "#ffffff", marginTop: 40, marginBottom: 20, letterSpacing: "-0.01em" }}>
              {children}
            </h2>
          ),
          h3: ({ children, id }) => (
            <h3 id={id} style={{ fontSize: 20, fontWeight: 600, color: "#ffffff", marginTop: 32, marginBottom: 16 }}>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p style={{ marginBottom: 16, color: "#A1A1AA", fontSize: 16, lineHeight: 1.7 }}>
              {children}
            </p>
          ),
          a: ({ href, children }) => (
            <a href={href} style={{ color: "#DFFF00", textDecoration: "none", fontWeight: 500 }} onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"} onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}>
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul style={{ paddingLeft: 24, marginBottom: 16, color: "#A1A1AA" }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol style={{ paddingLeft: 24, marginBottom: 16, color: "#A1A1AA" }}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li style={{ marginBottom: 8, paddingLeft: 4 }}>
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote
              style={{
                margin: "24px 0",
                padding: "4px 0",
                color: "#DFFF00",
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: "-0.01em",
              }}
            >
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div style={{ overflowX: "auto", marginBottom: 24, marginTop: 16, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 14 }}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead style={{ backgroundColor: "#161616", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th style={{ padding: "12px 16px", color: "#ffffff", fontWeight: 600, borderRight: "1px solid rgba(255,255,255,0.04)" }}>
              {children}
            </th>
          ),
          tbody: ({ children }) => (
            <tbody className="markdown-tbody">
              {children}
            </tbody>
          ),
          td: ({ children }) => (
            <td style={{ padding: "12px 16px", color: "#A1A1AA", borderRight: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              {children}
            </td>
          ),
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const isCodeBlock = !inline && match;

            if (!inline && isCodeBlock) {
              const codeContent = String(children).replace(/\n$/, "");
              return (
                <div style={{ marginBottom: 24, marginTop: 16, borderRadius: 12, overflow: "hidden", backgroundColor: "#0d1117", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", backgroundColor: "#161b22", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ fontSize: 12, color: "#8b949e", fontFamily: "monospace", textTransform: "uppercase" }}>
                      {language}
                    </span>
                    <CopyButton text={codeContent} />
                  </div>
                  <div style={{ padding: "16px", overflowX: "auto", fontSize: 14, lineHeight: 1.6 }}>
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </div>
                </div>
              );
            }

            // Inline code
            return (
              <code
                style={{
                  backgroundColor: "rgba(223, 255, 0, 0.08)",
                  color: "#DFFF00",
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontSize: "0.9em",
                  fontFamily: "monospace",
                }}
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
