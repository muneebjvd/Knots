import React from "react";

export function PremiumWarning({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0f0f0f] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-[36px]">
      <h3 className="text-2xl font-bold text-white tracking-tight mb-4 flex items-center gap-3">
        {title}
      </h3>
      <div className="text-[17px] text-[#A1A1AA] leading-relaxed space-y-3 font-medium">
        {children}
      </div>
    </div>
  );
}
