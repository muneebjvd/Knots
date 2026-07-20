import React from "react";

interface VideoEmbedProps {
  embedSrc: string;
  title?: string;
}

export function VideoEmbed({ embedSrc, title = "Course Video" }: VideoEmbedProps) {
  return (
    <div id="video" style={{ scrollMarginTop: 120 }}>
      <h2
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: "-0.03em",
          marginBottom: 32,
        }}
      >
        Watch Today's Lecture
      </h2>
      
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%", // 16:9 aspect ratio
          borderRadius: 20,
          overflow: "hidden",
          backgroundColor: "#0f0f0f",
          border: "1px solid rgba(255,255,255,0.08)",
          marginBottom: 24,
        }}
      >
        <iframe
          src={embedSrc}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          fontSize: 15,
          fontWeight: 500,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#52525B" }}>Source</span>
          <span style={{ color: "#ffffff" }}>Harvard CS50 AI</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#52525B" }}>Duration</span>
          <span style={{ color: "#ffffff" }}>2 Hours</span>
        </div>
      </div>
    </div>
  );
}
