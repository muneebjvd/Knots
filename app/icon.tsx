import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/x-icon"; // Explicitly set to x-icon to mimic .ico

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M 50,50 C 75,25 90,25 90,40 C 90,55 75,65 50,50" stroke="#f0f0f0" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M 50,50 C 65,75 55,90 40,90 C 25,90 25,75 50,50" stroke="#f0f0f0" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M 50,50 C 25,25 10,25 10,40 C 10,55 25,65 50,50" stroke="#f0f0f0" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="50" cy="50" r="10" fill="#00E6A8" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
