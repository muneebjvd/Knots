import React from "react";
import type { Metadata } from "next";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "AI Engineering Foundations — Knots Systems",
  description: "The most structured AI curriculum. 15 days. Real implementation.",
};

export default function AIEFLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomCursor />
      {children}
    </>
  );
}
