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
  "Understand the End-to-End RAG Pipeline",
  "Implement Document Loading and Text Chunking",
  "Generate Embeddings using Sentence Transformers",
  "Build and Query a FAISS Vector Database",
  "Execute Similarity Search to Retrieve Relevant Context",
  "Augment Prompts and Integrate with the Gemini API",
];

const tocItems = [
  { id: "objectives", title: "Objectives" },
  { id: "videos", title: "Course Videos" },
  { id: "notes", title: "Implementation Notes" },
  { id: "projects", title: "Projects" },
  { id: "submit", title: "Submit" },
];

const courseVideos = [
  { id: 1, title: "RAG Crash Course", src: "https://www.youtube-nocookie.com/embed/o126p1QN_RI?si=Fz9XUgThnQcW0USh" },
];

const implementationNotes = `
# Day 12 — RAG Crash Course

Today is another implementation-heavy day. You will watch a comprehensive **RAG (Retrieval-Augmented Generation) crash course** by *Krish Naik* that bridges the gap between theory and practical, modular Python implementation for enterprise use cases.

Because the video itself is an exhaustive teaching guide, the notes here are minimal. 

### What You Will Learn:
- **The "Fine-Tuning" Problem**: Why fine-tuning is often computationally expensive and impractical for businesses that update data frequently, and why RAG is the preferred solution.
- **Data Ingestion Pipeline**: Parsing documents, chunking text with \`RecursiveCharacterTextSplitter\`, generating embeddings with \`Sentence Transformers\`, and storing them in **FAISS**.
- **Retrieval Pipeline**: Querying the vector database, performing similarity search, augmenting the prompt with the retrieved context, and finally passing it to the LLM.
- **Modular Development**: Transitioning from a single script to a professional, scalable RAG architecture with separate files for data loading, embedding, and vector storage.

Follow along with the video to deeply understand the mechanics of RAG!
`;

const projectDetails = `
## The Project: AI FAQ Assistant

Build a Retrieval-Augmented Generation (RAG) application that answers user questions using information from a custom TXT or PDF knowledge base. 

The chatbot must answer **only** from the provided documents and gracefully respond when the required information is unavailable.

\`\`\`plaintext
ai-faq-assistant/
│
├── app.py              # Main execution logic
├── knowledge.txt       # Your custom knowledge base
├── embeddings.py       # Embedding generation module
├── vectorstore.py      # FAISS database operations
├── rag.py              # Prompt augmentation and LLM integration
├── requirements.txt
└── README.md
\`\`\`

---

### Project Requirements
You must implement the complete RAG pipeline across these modules:
1. **Document Loading**: Read the text from \`knowledge.txt\`.
2. **Text Chunking**: Split the text into semantic chunks.
3. **Embeddings & Vector Store**: Convert chunks to embeddings and store them using FAISS.
4. **Similarity Search**: When a user asks a question, retrieve the most relevant chunks.
5. **Prompt Augmentation**: Inject the chunks into the prompt context.
6. **Gemini API Integration**: Generate the final answer using the Gemini API.
`;

const example1 = `
## Architecture & Setup Guide

Here is the architectural blueprint for the AI FAQ Assistant project and a sample knowledge base to get you started.

---

### 1. The RAG Workflow

When a user asks a question, data flows through the pipeline in this specific order:

\`\`\`mermaid
graph TD
    A[User Question] --> B(knowledge.txt)
    B --> C[Text Chunking]
    C --> D[Embeddings]
    D --> E[(FAISS Vector Database)]
    E --> F[Similarity Search]
    F --> G[Relevant Context Retrieved]
    G --> H[Gemini API Prompt Augmentation]
    H --> I([Final Answer Generated])
    
    style A fill:#10B981,stroke:#000,stroke-width:2px,color:#000
    style I fill:#10B981,stroke:#000,stroke-width:2px,color:#000
\`\`\`

---

### 2. Example Knowledge Base

Create a simple \`knowledge.txt\` file in your project directory containing the following facts:

\`\`\`text
Knots Systems is an AI education platform.
Our AI Engineering Foundations course is 15 days long.
Students complete one project every day.
Certificates are awarded after successful project submission.
Office Hours are every Saturday.
Support Email: support@knots.systems
\`\`\`

---

### 3. Testing Your Pipeline

Once your RAG pipeline is built, test it with these queries to ensure it is successfully retrieving context from FAISS:

- *How long is the course?*
- *When are office hours?*
- *How do I get my certificate?*
- *What projects will I build?*
- *What is the support email?*

**Constraint Check**: The chatbot should **only** answer using the information in \`knowledge.txt\`. If you ask it who won the 2022 World Cup, it should respond that it does not know based on the provided context.
`;

export default function Day12Page() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes"|"project"|"example1">("notes");
  const [activeVideo, setActiveVideo] = useState<number>(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const unlocked = sessionStorage.getItem("aief_unlocked_day12");
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
            {/* EVEN DAY = Green */}
            <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:4, background:"#10B981", color:"#000" }}>DAY 12</span>
          </div>
        </div>
      </nav>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px", display:"flex", gap:64, alignItems:"flex-start" }}>
        <StickyTOC items={tocItems} />
        <main style={{ flex:1, minWidth:0, paddingBottom:120 }}>
          <CourseHero day={12} totalDays={15} title="Welcome to Day 12" subtitle="RAG Crash Course. Learn the end-to-end pipeline of Retrieval-Augmented Generation, from document chunking to FAISS vector databases." duration="≈2.5 Hours" course="Krish Naik" focus="RAG & FAISS" difficulty="Intermediate" />
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
              <VideoEmbed embedSrc={courseVideos[activeVideo].src} title={courseVideos[activeVideo].title} source="Krish Naik" />
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
            <h2 style={{ fontSize:20, fontWeight:700, color:"#fff", letterSpacing:"-0.02em", marginBottom:6 }}>Day 12 Project</h2>
            <p style={{ fontSize:13.5, color:"#52525b", marginBottom:28 }}>Your sole focus for today.</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:16 }}>
              <ProjectCard title="AI FAQ Assistant" description="Build a Retrieval-Augmented Generation application that answers user questions exclusively using information extracted from a text knowledge base, using FAISS and the Gemini API." skills={["RAG Pipeline", "FAISS", "Text Chunking"]} />
            </div>
          </div>

          <div style={{ marginTop:80 }}>
            <PremiumWarning title="Modularity is Key">
              <p>Do not write your entire RAG pipeline in one massive \`app.py\` file.</p>
              <p>In a real enterprise environment, the code that chunks documents and updates the vector database will run on a different schedule than the retrieval logic. Modularize your code into \`embeddings.py\`, \`vectorstore.py\`, and \`rag.py\` as demonstrated.</p>
            </PremiumWarning>
          </div>
          
          <div id="submit" style={{ marginTop:80, scrollMarginTop:72 }}>
            <GitHubSubmit format="DAY12_{ROLLNUM}" example="DAY12_KAIEF2601" />
          </div>

          <div style={{ marginTop:100, paddingTop:80, borderTop:"1px solid rgba(255,255,255,0.05)", textAlign:"center" }}>
            <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
              <h2 style={{ fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:700, color:"#fff", letterSpacing:"-0.04em", marginBottom:16 }}>Great Work!</h2>
              <p style={{ fontSize:16, color:"#52525b", maxWidth:500, margin:"0 auto 48px", lineHeight:1.75 }}>You&apos;ve completed Day 12 and successfully mastered the RAG pipeline.</p>
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
