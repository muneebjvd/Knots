"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";
import { CourseHero } from "@/components/course/CourseHero";
import { Checklist } from "@/components/course/Checklist";
import { VideoEmbed } from "@/components/course/VideoEmbed";
import { MarkdownViewer } from "@/components/course/MarkdownViewer";
import { ProjectCard } from "@/components/course/ProjectCard";
import { PremiumWarning } from "@/components/course/PremiumWarning";
import { GitHubSubmit } from "@/components/course/GitHubSubmit";
import { StickyTOC } from "@/components/course/StickyTOC";

const objectives = [
  "Understand the OpenAI Agents SDK and its capabilities",
  "Build a Single AI Agent with Custom Tools",
  "Implement Multi-Agent Architectures (Hand-off vs. Manager Patterns)",
  "Secure Agent outputs using Guardrails",
  "Maintain context and state using Sessions",
];

const tocItems = [
  { id: "objectives", title: "Objectives" },
  { id: "videos", title: "Course Videos" },
  { id: "notes", title: "Implementation Notes" },
  { id: "projects", title: "Projects" },
  { id: "submit", title: "Submit" },
];

const courseVideos = [
  { id: 1, title: "OpenAI Agents SDK", src: "https://www.youtube-nocookie.com/embed/rFA34gbynmg?si=-7UJ4qjFE_pS30xs" },
];

const implementationNotes = `
# Day 13 — OpenAI Agents SDK

Today you will dive into building autonomous agents using the **OpenAI Agents SDK**, guided by *CW Aarohi*. This framework simplifies orchestrating tool-use, multi-agent communication, and conversational memory.

### What You Will Learn:
- **Agent Basics**: How to define an agent, attach tools, and trigger execution.
- **Multi-Agent Systems**:
  - **Hand-off Pattern (Decentralized)**: Agent A finishes a task and directly transfers control to Agent B.
  - **Manager Pattern (Centralized)**: A primary Manager Agent delegates specific tasks to specialized worker agents and compiles the final result.
- **Guardrails**: Ensuring your agent stays on-topic and refuses dangerous or out-of-scope requests (e.g., an HR bot refusing to answer coding questions).
- **Context & Sessions**: Using the SDK's built-in session management so users can ask follow-up questions without losing the history of the interaction.

Watch the video to see these concepts implemented step-by-step!
`;

const projectDetails = `
## The Project: AI Travel Planning Agent

Build an AI Agent using the OpenAI Agents SDK that helps users plan a highly personalized trip based on their destination, budget, and travel duration.

\`\`\`plaintext
ai-travel-agent/
│
├── agent.py            # Main agent logic and configuration
├── tools.py            # Custom Python tools (e.g., fetch_hotels)
├── .env                # Your OpenAI API key
├── requirements.txt
└── README.md
\`\`\`

---

### Project Requirements
You must implement a conversational agent that:
1. **Accepts Parameters**: Gathers the destination, budget, and number of days from the user.
2. **Generates Itineraries**: Uses the LLM to output a structured day-by-day travel plan.
3. **Session Memory**: If a user replies with *"Make it cheaper"*, the agent must **update the existing itinerary** using context, rather than generating a completely new one from scratch.
4. **Custom Tools**: Write at least one custom Python tool (e.g., a dummy function that returns hotel prices) and attach it to the Agent.
5. **Guardrails**: If a user asks *"How do I bake a cake?"*, the agent must firmly refuse and steer the conversation back to travel planning.
`;

const example1 = `
## Architecture & Conversation Flow

Here is the architectural blueprint for handling session state and the expected conversation flow for your AI Travel Planning Agent.

---

### 1. State Management Architecture

To modify an existing itinerary instead of creating a new one, the SDK must maintain a **Session ID**. 

\`\`\`mermaid
graph TD
    A[User Prompt 1: Plan Dubai trip] --> B[Session Initialized]
    B --> C[Agent Generates Itinerary]
    C --> D[User Prompt 2: Make it cheaper]
    D --> E{Same Session ID?}
    E -- Yes --> F[Agent Reads History]
    F --> G[Agent Modifies Itinerary]
    E -- No --> H[Agent Asks for Destination again]
    
    style B fill:#CCFF00,stroke:#000,stroke-width:2px,color:#000
    style F fill:#10B981,stroke:#000,stroke-width:2px,color:#000
\`\`\`

---

### 2. Expected Output Flow

Your final terminal application should look exactly like this:

**User**: 
> Plan a 3-day trip to Dubai with a budget of $800.

**Agent**: 
> *Generates a complete 3-day itinerary focusing on budget-friendly options.*

**User**: 
> Reduce the budget to $600.

**Agent**: 
> *Reads previous context. Removes a premium dining option from Day 2 and replaces it with street food to meet the $600 constraint. The rest of the itinerary remains unchanged.*

**User**: 
> Write me a Python script to scrape flights.

**Agent**: 
> *Triggering Guardrails: "I am a travel planning assistant. I cannot write code. Let's focus on your Dubai trip!"*
`;

export default function Day13Page() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes"|"project"|"example1">("notes");
  const [activeVideo, setActiveVideo] = useState<number>(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const unlocked = sessionStorage.getItem("aief_unlocked_day13");
    if (unlocked !== "1") { router.push("/AIEF"); } else { setIsAuthorized(true); }
  }, [router]);

  if (!isAuthorized) return <div style={{ minHeight: "100vh", backgroundColor: "#090909" }} />;

  const tabs = [{ key:"notes" as const, label:"NOTES" },{ key:"project" as const, label:"PROJECT" },{ key:"example1" as const, label:"ARCHITECTURE" }];
  const content = { notes: implementationNotes, project: projectDetails, example1 };

  return (
    <div style={{ minHeight:"100vh", background:"#090909", color:"#f0f0f0", fontFamily:"'Inter',-apple-system,sans-serif", WebkitFontSmoothing:"antialiased" }}>
      <motion.div style={{ position:"fixed", top:0, left:0, right:0, height:2, background:"#10B981", transformOrigin:"left", scaleX, zIndex:100 }} />
      <nav style={{ position:"sticky", top:0, zIndex:50, background:"rgba(9,9,9,0.92)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <Link href="/AIEF" style={{ display:"flex", alignItems:"center", gap:8, color:"#71717a", textDecoration:"none", fontSize:13, fontWeight:500 }} onMouseEnter={e=>e.currentTarget.style.color="#f0f0f0"} onMouseLeave={e=>e.currentTarget.style.color="#71717a"}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>Back to Curriculum
          </Link>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:12, color:"#3f3f46", fontFamily:"monospace", letterSpacing:"0.06em" }}>AI Engineering Foundations</span>
            {/* ODD DAY = Acidic Yellow */}
            <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:4, background:"#CCFF00", color:"#000" }}>DAY 13</span>
          </div>
        </div>
      </nav>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px", display:"flex", gap:64, alignItems:"flex-start" }}>
        <StickyTOC items={tocItems} />
        <main style={{ flex:1, minWidth:0, paddingBottom:120 }}>
          <CourseHero day={13} totalDays={15} title="Welcome to Day 13" subtitle="OpenAI Agents SDK. Learn to build autonomous single and multi-agent systems with persistent memory, tool-use, and strict guardrails." duration="≈2.5 Hours" course="CW Aarohi" focus="Agents & Tool Use" difficulty="Advanced" />
          <div style={{ marginTop:80 }}><Checklist items={objectives} /></div>
          
          <div id="videos" style={{ marginTop:100, scrollMarginTop:72 }}>
            <h2 style={{ fontSize:20, fontWeight:700, color:"#fff", letterSpacing:"-0.02em", marginBottom:16 }}>Course Videos</h2>
            
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:24 }}>
              {courseVideos.map((vid, idx) => (
                <button 
                  key={vid.id}
                  onClick={() => setActiveVideo(idx)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    background: activeVideo === idx ? "#10B981" : "#111",
                    color: activeVideo === idx ? "#000" : "#a1a1aa",
                    border: activeVideo === idx ? "1px solid #10B981" : "1px solid rgba(255,255,255,0.1)",
                    transition: "all 0.2s"
                  }}
                >
                  {vid.title}
                </button>
              ))}
            </div>
            
            <div style={{ background: "#000", padding: 8, borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)" }}>
              <VideoEmbed embedSrc={courseVideos[activeVideo].src} title={courseVideos[activeVideo].title} source="CW Aarohi" />
            </div>
          </div>

          <div id="notes" style={{ marginTop:80, scrollMarginTop:72 }}>
            <h2 style={{ fontSize:20, fontWeight:700, color:"#fff", letterSpacing:"-0.02em", marginBottom:6 }}>Practical Implementation Notes</h2>
            <p style={{ fontSize:13.5, color:"#52525b", marginBottom:28 }}>No theory. Just how to build it.</p>
            <div style={{ display:"flex", gap:4, marginBottom:24, background:"#0c0c0c", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:4, width:"fit-content" }}>
              {tabs.map(tab=><button key={tab.key} onClick={()=>setActiveTab(tab.key)} style={{ padding:"8px 20px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"monospace", letterSpacing:"0.08em", transition:"all 0.15s", background:activeTab===tab.key?"#10B981":"transparent", color:activeTab===tab.key?"#000":"#52525b" }}>{tab.label}</button>)}
            </div>
            <div style={{ background:"#0c0c0c", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"36px 40px" }}>
              {/* @ts-ignore */}
              <MarkdownViewer content={content[activeTab]} />
            </div>
          </div>

          <div id="projects" style={{ marginTop:100, scrollMarginTop:72 }}>
            <h2 style={{ fontSize:20, fontWeight:700, color:"#fff", letterSpacing:"-0.02em", marginBottom:6 }}>Day 13 Project</h2>
            <p style={{ fontSize:13.5, color:"#52525b", marginBottom:28 }}>Your sole focus for today.</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:16 }}>
              <ProjectCard title="AI Travel Planning Agent" description="Build a conversational travel agent using the OpenAI Agents SDK that remembers past context to dynamically update itineraries while refusing out-of-scope requests using Guardrails." skills={["OpenAI Agents SDK", "Context & Sessions", "Guardrails"]} />
            </div>
          </div>

          <div style={{ marginTop:80 }}>
            <PremiumWarning title="State is Everything">
              <p>The difference between a basic LLM script and an <strong>Agent</strong> is state and tools.</p>
              <p>If your user asks to reduce the budget and the agent hallucinates a brand new itinerary instead of editing the existing one, your session management has failed. Pay close attention to how the SDK handles the \`Session ID\`.</p>
            </PremiumWarning>
          </div>
          
          <div id="submit" style={{ marginTop:80, scrollMarginTop:72 }}>
            <GitHubSubmit format="DAY13_{ROLLNUM}" example="DAY13_KAIEF2601" />
          </div>

          <div style={{ marginTop:100, paddingTop:80, borderTop:"1px solid rgba(255,255,255,0.05)", textAlign:"center" }}>
            <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
              <h2 style={{ fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:700, color:"#fff", letterSpacing:"-0.04em", marginBottom:16 }}>Great Work!</h2>
              <p style={{ fontSize:16, color:"#52525b", maxWidth:500, margin:"0 auto 48px", lineHeight:1.75 }}>You&apos;ve completed Day 13 and mastered autonomous agents.</p>
              <div style={{ display:"inline-flex", alignItems:"center", gap:28, fontFamily:"monospace", fontSize:13, letterSpacing:"0.15em", textTransform:"uppercase" }}>
                <span style={{ color:"#f0f0f0" }}>Learn.</span><span style={{ color:"#10B981", fontWeight:700 }}>Build.</span><span style={{ color:"#f0f0f0" }}>Prove.</span>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
