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
  "Build a Full-Stack RAG Chatbot using Next.js and LangChain.js",
  "Implement Data Loading and Chunking for Web and PDF/TXT documents",
  "Generate Vector Embeddings using OpenAI models",
  "Store and query embeddings using Astra DB (DataStax)",
  "Develop a Modern UI with Chat Bubbles, Loading States, and Markdown",
  "Execute the Capstone Project: Knots AI (Intelligent Knowledge Assistant)",
];

const tocItems = [
  { id: "objectives", title: "Objectives" },
  { id: "videos", title: "Course Videos" },
  { id: "notes", title: "Implementation Notes" },
  { id: "capstone", title: "Capstone Project" },
  { id: "submit", title: "Submit" },
];

const courseVideos = [
  { id: 1, title: "Full-Stack RAG Chatbot", src: "https://www.youtube-nocookie.com/embed/d-VKYF4Zow0?si=AP7qObJ6W-g__4SD" },
  { id: 2, title: "Optional Next.js RAG Extension", src: "https://www.youtube.com/embed/JiwTGGGIhDs?si=Z6WupeXg46DniI2K" },
];

const implementationNotes = `
# Day 14 — Capstone: Production RAG

Welcome to the final day of the AI Engineering Foundations course! Today you transition from building scripts to building a fully-fledged, production-ready full-stack application.

You will follow a comprehensive tutorial by *Ania Kubow* on building a **Retrieval-Augmented Generation (RAG) chatbot** using *JavaScript*, *LangChain.js*, *Next.js*, *Vercel*, *OpenAI*, and *Astra DB*.

### Core Concepts Covered:
- **Vector Embeddings & Storage**: Converting text into numerical vectors to capture semantic meaning and storing them efficiently in Astra DB.
- **Data Loading Scripts**: Writing a standalone script (\`load_db.ts\`) to scrape web data, chunk it with \`RecursiveCharacterTextSplitter\`, and push it to the database.
- **Frontend Development**: Building a responsive UI in Next.js with custom chat bubbles, loading animations, and prompt suggestions.
- **Backend API Routes**: Constructing the \`/api/chat/route.ts\` endpoint to perform vector similarity search, inject context into the system prompt, and stream the response back from GPT-4.
`;

const projectDetails = `
## Final Capstone: Knots AI (Intelligent Knowledge Assistant)

**Duration**: 7 Days (Day 14 → Day 20)  
**Difficulty**: Advanced  

### Project Overview
Build **Knots AI**, a production-ready RAG application that enables users to upload PDF and TXT documents, create a searchable knowledge base, and interact with it using natural language. 

This project represents a real-world AI application used by companies for internal documentation, research assistants, and organizational knowledge management.

---

### Core Features

**1. Authentication & Documents**
- User Authentication and Secure Sessions
- Upload PDF & TXT Documents with Automatic Parsing
- Multi-file Support

**2. The AI Pipeline**
- Document Loading & Recursive Text Chunking
- Embedding Generation & Storage in AstraDB
- Semantic Similarity Search & Context Injection
- Retrieval-Augmented Generation (RAG) via LLMs

**3. Chat Experience & UI**
- Modern Chat Interface with Streaming Responses
- Markdown Rendering & Code Syntax Highlighting
- Source Citations & Chat History
- Responsive Dark Mode Dashboard

---

### Tech Stack
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **AI**: OpenAI / Gemini, LangChain
- **Database**: AstraDB (Vector Database)
- **Deployment**: Vercel

---

### Deliverables
Students must submit the following items via the GitHub Submit portal below:
1. Public GitHub Repository (Named: \`KNOTSAI_{ROLLNUMBER}\` e.g., \`KNOTSAI_KAIEF2601\`)
2. Live Deployment URL (Vercel)
3. Professional README Documentation
4. 2–5 Minute Demo Video showcasing the working application
5. UI Screenshots
`;

const example1 = `
## Capstone Architecture

Below is the required folder structure and the data workflow for your Knots AI application.

---

### Folder Structure

\`\`\`plaintext
knots-ai/
├── app/                  # Next.js App Router (Pages & Layouts)
├── components/           # Reusable React UI Components (Chat UI, Modals)
├── lib/                  # Shared utilities (Database connections, LLM setup)
├── api/                  # API Routes (Chat endpoints, Document upload)
├── utils/                # Helper functions (Chunking, Parsing)
├── public/               # Static assets
├── documents/            # Temporary storage for uploaded files before parsing
├── scripts/              # Independent scripts (e.g., test DB connection)
├── styles/               # Global CSS / Tailwind configurations
├── package.json
└── README.md
\`\`\`

---

### RAG Workflow

\`\`\`mermaid
graph TD
    A[Upload PDF/TXT] --> B[Document Loader]
    B --> C[Chunk Documents]
    C --> D[Generate Embeddings]
    D --> E[(Store in AstraDB)]
    
    F[User Question] --> G[Similarity Search]
    E -.-> G
    G --> H[Retrieve Relevant Chunks]
    H --> I[Prompt Augmentation]
    I --> J[LLM - OpenAI/Gemini]
    J --> K([Final Answer + Sources])
    
    style A fill:#3b82f6,stroke:#000,stroke-width:2px,color:#fff
    style F fill:#10B981,stroke:#000,stroke-width:2px,color:#000
    style K fill:#10B981,stroke:#000,stroke-width:2px,color:#000
\`\`\`

---

### Example Questions
Once your platform is live, it should be able to handle queries like:
- *"Summarize this document."*
- *"What is the leave policy?"*
- *"Compare Sections 2 and 5."*
- *"Generate interview questions from these notes."*
`;

export default function Day14Page() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes"|"project"|"example1">("notes");
  const [activeVideo, setActiveVideo] = useState<number>(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const unlocked = sessionStorage.getItem("aief_unlocked_day14");
    if (unlocked !== "1") { router.push("/AIEF"); } else { setIsAuthorized(true); }
  }, [router]);

  if (!isAuthorized) return <div style={{ minHeight: "100vh", backgroundColor: "#090909" }} />;

  const tabs = [{ key:"notes" as const, label:"NOTES" },{ key:"project" as const, label:"CAPSTONE" },{ key:"example1" as const, label:"ARCHITECTURE" }];
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
            {/* EVEN DAY = Green */}
            <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:4, background:"#10B981", color:"#000" }}>DAY 14</span>
          </div>
        </div>
      </nav>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px", display:"flex", gap:64, alignItems:"flex-start" }}>
        <StickyTOC items={tocItems} />
        <main style={{ flex:1, minWidth:0, paddingBottom:120 }}>
          <CourseHero day={14} totalDays={15} title="Welcome to Day 14" subtitle="The Final Capstone. Learn to build and deploy a production-ready Full-Stack RAG application with Next.js, LangChain, and Astra DB." duration="≈2.5 Hours + 7 Days Capstone" course="Ania Kubow" focus="Full-Stack Production AI" difficulty="Advanced" />
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
              <VideoEmbed embedSrc={courseVideos[activeVideo].src} title={courseVideos[activeVideo].title} source="FreeCodeCamp" />
            </div>
          </div>

          <div id="notes" style={{ marginTop:80, scrollMarginTop:72 }}>
            <h2 style={{ fontSize:20, fontWeight:700, color:"#fff", letterSpacing:"-0.02em", marginBottom:6 }}>Implementation & Capstone</h2>
            <p style={{ fontSize:13.5, color:"#52525b", marginBottom:28 }}>Your final challenge.</p>
            <div style={{ display:"flex", gap:4, marginBottom:24, background:"#0c0c0c", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:4, width:"fit-content" }}>
              {tabs.map(tab=><button key={tab.key} onClick={()=>setActiveTab(tab.key)} style={{ padding:"8px 20px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"monospace", letterSpacing:"0.08em", transition:"all 0.15s", background:activeTab===tab.key?"#10B981":"transparent", color:activeTab===tab.key?"#000":"#52525b" }}>{tab.label}</button>)}
            </div>
            <div style={{ background:"#0c0c0c", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"36px 40px" }}>
              {/* @ts-ignore */}
              <MarkdownViewer content={content[activeTab]} />
            </div>
          </div>

          <div id="capstone" style={{ marginTop:100, scrollMarginTop:72 }}>
            <h2 style={{ fontSize:20, fontWeight:700, color:"#fff", letterSpacing:"-0.02em", marginBottom:6 }}>Final Capstone Project</h2>
            <p style={{ fontSize:13.5, color:"#52525b", marginBottom:28 }}>You have 7 days to complete this final assessment.</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:16 }}>
              <ProjectCard title="Knots AI: Intelligent Knowledge Assistant" description="Build a production-ready RAG platform enabling users to upload PDF/TXT files and interact with them via semantic search and streaming LLM responses. Requires Authentication, Astra DB, and a Vercel deployment." skills={["Next.js", "LangChain", "Astra DB", "Production RAG"]} />
            </div>
          </div>

          <div style={{ marginTop:80 }}>
            <PremiumWarning title="Production Grade">
              <p>This is your portfolio centerpiece. Treat it like a real SaaS product.</p>
              <p>Implement proper error handling, loading skeletons, responsive design, and markdown rendering for responses. Your codebase should be clean, modular, and deployed publicly on Vercel.</p>
            </PremiumWarning>
          </div>
          
          <div id="submit" style={{ marginTop:80, scrollMarginTop:72 }}>
            <GitHubSubmit format="KNOTSAI_{ROLLNUM}" example="KNOTSAI_KAIEF2601" />
          </div>

          <div style={{ marginTop:100, paddingTop:80, borderTop:"1px solid rgba(255,255,255,0.05)", textAlign:"center" }}>
            <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
              <h2 style={{ fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:700, color:"#fff", letterSpacing:"-0.04em", marginBottom:16 }}>Congratulations.</h2>
              <p style={{ fontSize:16, color:"#52525b", maxWidth:500, margin:"0 auto 48px", lineHeight:1.75 }}>You have reached the end of the AI Engineering Foundations curriculum. All that remains is the Capstone.</p>
              <div style={{ display:"inline-flex", alignItems:"center", gap:28, fontFamily:"monospace", fontSize:13, letterSpacing:"0.15em", textTransform:"uppercase" }}>
                <span style={{ color:"#10B981", fontWeight:700 }}>Learn. Build. Prove.</span>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
