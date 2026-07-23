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
  "Initialize a React environment and organize project assets",
  "Build responsive UI components (Sidebar, Main Dashboard, Chat Input)",
  "Manage application state using React Context API and useState",
  "Integrate the Gemini API via Google AI Studio",
  "Implement advanced UI features (Typing effects, Pre-loaders)",
  "Build a functional Chat History system",
];

const tocItems = [
  { id: "objectives", title: "Objectives" },
  { id: "videos", title: "Course Videos" },
  { id: "notes", title: "Implementation Notes" },
  { id: "projects", title: "Projects" },
  { id: "submit", title: "Submit" },
];

const courseVideos = [
  { id: 1, title: "Build a Gemini Clone", src: "https://www.youtube-nocookie.com/embed/0yboGn8errU?si=7VOjrhTcKmugyJPa&start=180" },
];

const implementationNotes = `
# Day 11 — Building a Full-Stack AI Clone

Today is a purely implementation-focused day. Instead of diving into abstract concepts, you will watch a comprehensive end-to-end tutorial by GreatStack and build a fully functional clone of **Google Gemini 2.0** using React.js and the Gemini API.

Because the video itself is an exhaustive step-by-step guide, the notes here are minimal. 

### What You Will Build:
- **Responsive UI**: A modern interface featuring a collapsible sidebar, interactive dashboard, and a sleek chat input box.
- **State Management**: Using React's \`Context API\` and \`useState\` to handle prompts, chat history, and UI states.
- **API Integration**: Hooking up the official Gemini SDK to send prompts and receive generative responses.
- **UX Polish**: Implementing a CSS-based pre-loader, a typing effect for AI responses, and HTML formatting via \`dangerouslySetInnerHTML\`.

Grab a coffee, open your code editor, and follow along with the video to build your clone!
`;

const projectDetails = `
## The Project: Build an AI Clone

\`\`\`plaintext
gemini-clone/
├── src/
│   ├── assets/         # Icons, images, and fonts
│   ├── components/
│   │   ├── Sidebar/    # Collapsible history menu
│   │   └── Main/       # Chat interface & input box
│   ├── context/
│   │   └── Context.jsx # Global state management
│   ├── config/
│   │   └── gemini.js   # API initialization
│   └── App.jsx
\`\`\`

---

### Instructions

Your only assignment today is to follow the tutorial and complete the Gemini Clone. Ensure your final application includes:
1. **Sidebar Navigation**: A collapsible sidebar that stores the user's chat history.
2. **Main Dashboard**: The greeting screen with interactive prompt suggestion cards.
3. **Chat Input**: A fixed bottom input bar for sending queries.
4. **Gemini SDK Integration**: Successful connection to the API that returns accurate responses.
5. **Polished UX**: The typing effect animation and loading states.
`;

const example1 = `
## Architecture & Setup Guide

Since today is all about building, here is the architectural blueprint for your application and instructions on how to set up the Gemini API.

---

### 1. Getting Your Gemini API Key

You cannot talk to the model without an API key. 
1. Go to **[Google AI Studio](https://aistudio.google.com/)**.
2. Sign in with your Google account.
3. Click **"Get API key"** in the sidebar.
4. Click **"Create API key"** in a new project.
5. Copy the key and store it securely in your React project (e.g., inside a \`.env\` file as \`VITE_GEMINI_API_KEY\`).

---

### 2. The Gemini SDK Config (\`gemini.js\`)

You need to initialize the SDK with your key before you can generate content.

\`\`\`javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

async function runChat(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  return text;
}

export default runChat;
\`\`\`

---

### 3. Context API Architecture

To avoid "prop drilling" (passing data down through multiple components), we use React's **Context API** to make the chat state globally available to both the Sidebar and the Main interface.

\`\`\`javascript
import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        
        const response = await runChat(prompt);
        // ... Logic to format response and add typing effect ...
        
        setResultData(response);
        setLoading(false);
        setInput("");
    }

    const contextValue = {
        prevPrompts, setPrevPrompts,
        onSent,
        setRecentPrompt, recentPrompt,
        showResult, loading, resultData,
        input, setInput
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;
\`\`\`
`;

export default function Day11Page() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes"|"project"|"example1">("notes");
  const [activeVideo, setActiveVideo] = useState<number>(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const unlocked = sessionStorage.getItem("aief_unlocked_day11");
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
            <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:4, background:"#CCFF00", color:"#000" }}>DAY 11</span>
          </div>
        </div>
      </nav>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px", display:"flex", gap:64, alignItems:"flex-start" }}>
        <StickyTOC items={tocItems} />
        <main style={{ flex:1, minWidth:0, paddingBottom:120 }}>
          <CourseHero day={11} totalDays={15} title="Welcome to Day 11" subtitle="Implementation Day. Follow along to build a fully functional Google Gemini clone using React JS and the official Gemini API." duration="≈2 Hours" course="GreatStack" focus="React & API Integration" difficulty="Intermediate" />
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
              <VideoEmbed embedSrc={courseVideos[activeVideo].src} title={courseVideos[activeVideo].title} source="GreatStack" />
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
            <h2 style={{ fontSize:20, fontWeight:700, color:"#fff", letterSpacing:"-0.02em", marginBottom:6 }}>Day 11 Project</h2>
            <p style={{ fontSize:13.5, color:"#52525b", marginBottom:28 }}>Your sole focus for today.</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:16 }}>
              <ProjectCard title="Build an AI Clone" description="Follow the tutorial end-to-end to build a React.js clone of Google Gemini, complete with chat history, a sidebar, and typing animations." skills={["React.js", "Gemini API", "Context API"]} />
            </div>
          </div>

          <div style={{ marginTop:80 }}>
            <PremiumWarning title="Design Matters">
              <p>Generative AI is a commodity. What separates successful AI products from basic wrappers is the <strong>User Experience</strong>.</p>
              <p>Pay close attention to how this tutorial implements the typing effect, the CSS pre-loader, and chat history. These small friction-reducing features are what build user trust.</p>
            </PremiumWarning>
          </div>
          
          <div id="submit" style={{ marginTop:80, scrollMarginTop:72 }}>
            <GitHubSubmit format="DAY11_{ROLLNUM}" example="DAY11_KAIEF2601" />
          </div>

          <div style={{ marginTop:100, paddingTop:80, borderTop:"1px solid rgba(255,255,255,0.05)", textAlign:"center" }}>
            <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
              <h2 style={{ fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:700, color:"#fff", letterSpacing:"-0.04em", marginBottom:16 }}>Great Work!</h2>
              <p style={{ fontSize:16, color:"#52525b", maxWidth:500, margin:"0 auto 48px", lineHeight:1.75 }}>You&apos;ve completed Day 11 and successfully built your first full-stack AI application.</p>
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
