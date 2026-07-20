"use client";

import React from "react";
import { Check } from "lucide-react";

export function Checklist({ items }: { items: string[] }) {
  return (
    <div id="objectives" className="scroll-mt-32">
      <h2 className="text-3xl font-bold text-white tracking-tight mb-8">
        Today's Objectives
      </h2>

      <div className="bg-[#0f0f0f] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-[36px]">
        <div className="flex flex-col gap-6">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="mt-1 shrink-0">
                <Check size={22} color="#10B981" strokeWidth={2.5} />
              </div>
              <span className="text-[17px] font-medium leading-relaxed text-[#A1A1AA]">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
