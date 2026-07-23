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
  "Secure Generative AI Apps against Data Poisoning & Prompt Injection",
  "Implement the LLMOps Lifecycle and Evaluation Metrics",
  "Build RAG Systems with Vector Databases (Cosine Similarity)",
  "Evaluate and Deploy Open Source Models (Llama, Mistral)",
  "Develop Autonomous AI Agents using LangChain and AutoGen",
  "Fine-Tune LLMs for Domain-Specific Tasks",
];

const tocItems = [
  { id: "objectives", title: "Objectives" },
  { id: "videos", title: "Course Videos" },
  { id: "notes", title: "Implementation Notes" },
  { id: "security", title: "↳ AI Security" },
  { id: "llmops", title: "↳ LLMOps Lifecycle" },
  { id: "rag", title: "↳ RAG & Vector DBs" },
  { id: "agents", title: "↳ AI Agents & Open Source" },
  { id: "projects", title: "Projects" },
  { id: "submit", title: "Submit" },
];

const courseVideos = [
  { id: 1, title: "AI Security", src: "https://www.youtube-nocookie.com/embed/m0vXwsx5DNg?si=gwcut9UtCGFYZwT0" },
  { id: 2, title: "LLMOps Lifecycle", src: "https://www.youtube-nocookie.com/embed/ewtQY_RJrzs?si=q57Dk6UYC8iC8c0O" },
  { id: 3, title: "RAG & Vector DBs", src: "https://www.youtube-nocookie.com/embed/4l8zhHUBeyI?si=xVmFsdiASRvO5xcz" },
  { id: 4, title: "Open Source Models", src: "https://www.youtube-nocookie.com/embed/CuICgfuHFSg?si=3ZC-N-hfPUqGrHNd" },
  { id: 5, title: "AI Agents", src: "https://www.youtube-nocookie.com/embed/yAXVW-lUINc?si=yVtx54juLFN2SiSc" },
  { id: 6, title: "Fine-Tuning", src: "https://www.youtube-nocookie.com/embed/6UAwhL9Q-TQ?si=CYQ6vFrrFknrMVmI" },
];

const implementationNotes = `
# Day 10 — Security, RAG, Agents & Fine-Tuning

Welcome to Day 10! Today we consolidate everything into production-grade systems. We will cover securing applications, managing the LLMOps lifecycle, building RAG systems, and creating autonomous AI Agents.

---

## 1. Securing Your Generative AI Applications

AI systems expand the traditional attack surface. Beyond standard cybersecurity, you must protect the models and the data they consume.

### Primary Threats
- **Data Poisoning**: Attackers intentionally modify training data (e.g., Label Flipping, Feature Poisoning) so the model learns incorrect associations. Because models rely on uncurated public datasets, this is a massive risk.
- **Prompt Injection (OWASP Top 10)**: Manipulating an LLM via crafted inputs to bypass guardrails and execute unintended behavior.
- **Supply Chain Vulnerabilities**: Compromised Python modules or external datasets.

### AI Red Teaming & Testing
Testing goes beyond standard unit tests. You must perform **AI Red Teaming** to probe for security vulnerabilities, fairness issues, and harmful content generation.
- **Data Sanitization**: Strip PII before training or inference.
- **Adversarial Testing**: Attack the model systematically to evaluate robustness.
- **Output Validation**: Ensure the model's responses are safe before returning them to the user.

---

## 2. LLMOps & The Generative AI Lifecycle

The paradigm has shifted from **MLOps** (focused on model training metrics) to **LLMOps** (focused on app development, integration, and prompt tuning).

### Key LLMOps Metrics
- **Quality**: Response quality and formatting.
- **Harm**: Responsible AI metrics (toxicity, bias).
- **Honesty**: Groundedness (Is it hallucinating?).
- **Cost**: Solution Budget per token.
- **Latency**: Time to first token / total response time.

Use tools like **Azure AI Studio** and **PromptFlow** to visually design, evaluate, and deploy LLM applications.

---

## 3. Retrieval Augmented Generation (RAG)

LLMs lack knowledge of your private data and have training cutoffs. **RAG** solves this by fetching your data and injecting it into the prompt.

1. **Chunking**: Split large documents into paragraphs or sentences.
2. **Embedding**: Convert chunks into high-dimensional vectors (e.g., using \`text-embedding-ada-002\`).
3. **Vector Database**: Store embeddings in databases like Azure Cosmos DB or Qdrant.
4. **Retrieval**: Convert the user's query into a vector and find the nearest neighbors using **Cosine Similarity**.
5. **Generation**: Pass the retrieved chunks to the LLM to generate a grounded answer.

---

## 4. Open Source Models vs. Proprietary

Not every task requires GPT-4. Open models offer deep customization, data privacy, and lower costs.

- **Llama 3 (Meta)**: Optimized for chat and highly aligned to human expectations via RLHF.
- **Mistral**: Highly efficient using Mixture-of-Experts (MoE).
- **Falcon (TII)**: Uses FlashAttention to reduce memory requirements.

Open source models can be run locally or in private clouds, ensuring your data never leaves your environment.

---

## 5. AI Agents (LangChain & AutoGen)

Agents allow LLMs to take actions by giving them **State** (memory) and **Tools** (functions, APIs).

### Frameworks
- **LangChain**: Uses an \`AgentExecutor\` to manage tools and chat history. Great for single-agent tasks interacting with databases or web searches.
- **AutoGen**: Focuses on multi-agent conversations. You can create multiple \`AssistantAgents\` (e.g., Coder, Reviewer) and a \`UserProxyAgent\` to collaborate on complex tasks.

\`\`\`python
# AutoGen Example
coder = autogen.AssistantAgent(name="Coder", llm_config=llm_config)
pm = autogen.AssistantAgent(
    name="Product_manager", 
    system_message="Creative in software product ideas.", 
    llm_config=llm_config
)
\`\`\`

---

## 6. Fine-Tuning LLMs

When prompt engineering and RAG aren't enough (e.g., you need the model to output a highly specific proprietary DSL format), you **Fine-Tune**.
- **Supervised Fine-Tuning (SFT)**: Updating model weights using high-quality prompt-response pairs.
- Tools like **Hugging Face AutoTrain** or **Unsloth** make local or cloud fine-tuning accessible.
`;

const projectDetails = `
## Part 2 — Mini Project: Production AI Systems

\`\`\`plaintext
day10_project/
├── secure_rag.py           # RAG with input/output filtering
├── autogen_team.py         # Multi-agent collaboration
└── fine_tune_prep.py       # Dataset preparation for Hugging Face
\`\`\`

---

### Part A — \`secure_rag.py\`

Build a production-ready RAG application that includes safety guardrails.

1. Create a Vector Database (local using \`scikit-learn NearestNeighbors\` or cloud).
2. Embed a sample HR policies text document (you can create a simple 'policies.txt' with dummy rules).
3. Before searching the database, run the user's query through a lightweight **Prompt Injection filter**.
4. Retrieve the context, generate the response, and run the output through a **Toxicity filter** before displaying it.

---

### Part B — \`autogen_team.py\`

Build a multi-agent system using Microsoft AutoGen to solve a coding problem.

1. Define a \`Coder\` agent that writes Python code.
2. Define a \`Reviewer\` agent that inspects the code for security flaws.
3. Define a \`UserProxyAgent\` that automatically executes the code in a secure Docker container.
4. Initiate a chat asking the team to build a secure web scraper. Watch them collaborate!

---

### Part C — \`fine_tune_prep.py\`

Prepare a dataset to fine-tune a small open-source model (like Llama 3 8B) for a specific tone.

1. Write a script that takes a sample CSV of standard customer support responses (create a simple one with 5-10 rows).
2. Format them into the specific JSONL structure required by Hugging Face \`SFTTrainer\` (Instruction, Context, Response).
`;

const example1 = `
## Example 1 — Basic RAG with scikit-learn

Here is a simplified local RAG implementation using Nearest Neighbors for Vector Search.

\`\`\`python
from sklearn.neighbors import NearestNeighbors
import numpy as np

# 1. Assume we have pre-computed embeddings for our document chunks
# In reality, you'd call client.embeddings.create() for each chunk
embeddings = np.array([
    [0.1, 0.2, 0.3], # Chunk 1: "Refunds take 3 days."
    [0.9, 0.1, 0.1], # Chunk 2: "Our CEO is Jane Doe."
    [0.2, 0.2, 0.2]  # Chunk 3: "To reset password, click settings."
])
chunks = ["Refunds take 3 days.", "Our CEO is Jane Doe.", "To reset password, click settings."]

# 2. Build the Search Index
nbrs = NearestNeighbors(n_neighbors=1, algorithm='brute', metric='cosine').fit(embeddings)

# 3. Search based on User Query
# Assume query "How long do refunds take?" embeds to [0.15, 0.25, 0.35]
query_vector = np.array([[0.15, 0.25, 0.35]])
distances, indices = nbrs.kneighbors(query_vector)

# 4. Retrieve Context
retrieved_chunk = chunks[indices[0][0]]
print(f"Retrieved Context: {retrieved_chunk}")

# 5. Augment and Generate (Pseudo-code)
# prompt = f"Answer using this context: {retrieved_chunk}. Question: How long do refunds take?"
# response = llm.generate(prompt)
\`\`\`
`;

const example2 = `
## Example 2 — AutoGen Multi-Agent Collaboration

This script demonstrates how two AI agents can talk to each other to solve a task, without human intervention.

\`\`\`python
import autogen

config_list = [{"model": "gpt-4", "api_key": "YOUR_API_KEY"}]
llm_config = {"config_list": config_list, "seed": 42}

# The Assistant Agent writes the code
coder = autogen.AssistantAgent(
    name="Coder",
    llm_config=llm_config,
    system_message="You write Python code to solve problems. Return ONLY the code block."
)

# The User Proxy acts as the human/executor
# It will automatically execute the code the Coder writes
user_proxy = autogen.UserProxyAgent(
    name="Executor",
    human_input_mode="NEVER", # Fully autonomous
    max_consecutive_auto_reply=3,
    is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("TERMINATE"),
    code_execution_config={"work_dir": "coding", "use_docker": False}
)

# Start the conversation
user_proxy.initiate_chat(
    coder,
    message="Write a python script that calculates the 10th Fibonacci number and prints it."
)
\`\`\`
`;

export default function Day10Page() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes"|"project"|"example1"|"example2">("notes");
  const [activeVideo, setActiveVideo] = useState<number>(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const unlocked = sessionStorage.getItem("aief_unlocked_day10");
    if (unlocked !== "1") { router.push("/AIEF"); } else { setIsAuthorized(true); }
  }, [router]);

  if (!isAuthorized) return <div style={{ minHeight: "100vh", backgroundColor: "#090909" }} />;

  const tabs = [{ key:"notes" as const, label:"NOTES" },{ key:"project" as const, label:"PROJECT" },{ key:"example1" as const, label:"EXAMPLE 1" },{ key:"example2" as const, label:"EXAMPLE 2" }];
  const content = { notes: implementationNotes, project: projectDetails, example1, example2 };

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
            <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:4, background:"#10B981", color:"#000" }}>DAY 10</span>
          </div>
        </div>
      </nav>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px", display:"flex", gap:64, alignItems:"flex-start" }}>
        <StickyTOC items={tocItems} />
        <main style={{ flex:1, minWidth:0, paddingBottom:120 }}>
          <CourseHero day={10} totalDays={15} title="Welcome to Day 10" subtitle="Production-Ready AI. Today we focus on securing LLMs, managing the LLMOps lifecycle, building complex RAG systems, and orchestrating autonomous AI Agents." duration="≈4-6 Hours" course="Microsoft AI for Beginners" focus="Production Systems & Agents" difficulty="Advanced" />
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
                  Part {vid.id}: {vid.title}
                </button>
              ))}
            </div>
            
            <div style={{ background: "#000", padding: 8, borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)" }}>
              <VideoEmbed embedSrc={courseVideos[activeVideo].src} title={courseVideos[activeVideo].title} source="Microsoft Developer" />
            </div>
          </div>

          <div id="notes" style={{ marginTop:80, scrollMarginTop:72 }}>
            <h2 style={{ fontSize:20, fontWeight:700, color:"#fff", letterSpacing:"-0.02em", marginBottom:6 }}>Practical Implementation Notes</h2>
            <p style={{ fontSize:13.5, color:"#52525b", marginBottom:28 }}>No theory. Just how to build it.</p>
            <div style={{ display:"flex", gap:4, marginBottom:24, background:"#0c0c0c", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:4, width:"fit-content" }}>
              {tabs.map(tab=><button key={tab.key} onClick={()=>setActiveTab(tab.key)} style={{ padding:"8px 20px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"monospace", letterSpacing:"0.08em", transition:"all 0.15s", background:activeTab===tab.key?"#10B981":"transparent", color:activeTab===tab.key?"#000":"#52525b" }}>{tab.label}</button>)}
            </div>
            <div style={{ background:"#0c0c0c", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"36px 40px" }}>
              <MarkdownViewer content={content[activeTab]} />
            </div>
          </div>

          <div id="projects" style={{ marginTop:100, scrollMarginTop:72 }}>
            <h2 style={{ fontSize:20, fontWeight:700, color:"#fff", letterSpacing:"-0.02em", marginBottom:6 }}>Day 10 Project</h2>
            <p style={{ fontSize:13.5, color:"#52525b", marginBottom:28 }}>Build secure, multi-agent AI systems for production.</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:16 }}>
              <ProjectCard title="Secure RAG Engine" description="Build a Retrieval Augmented Generation system that chunks docs, uses Vector DBs, and runs all inputs/outputs through AI Red Teaming safety filters." skills={["Vector Databases", "Cosine Similarity", "Red Teaming"]} />
              <ProjectCard title="Autonomous AutoGen Team" description="Create a multi-agent system where a Coder LLM and a Reviewer LLM collaborate to solve complex problems and execute code autonomously." skills={["AutoGen", "Multi-Agent Systems", "State Management"]} />
              <ProjectCard title="Local Fine-Tuning Prep" description="Prepare training datasets in JSONL format to fine-tune open-source models like Llama 3 or Mistral on your proprietary data." skills={["SFT", "JSONL Datasets", "Open Source Models"]} />
            </div>
          </div>

          <div style={{ marginTop:80 }}>
            <PremiumWarning title="Security is Not Optional">
              <p>As you move to production, data poisoning and prompt injection are guarantees, not possibilities.</p>
              <p>Assume your LLM will be attacked. Implement input sanitization, output validation, and rigorous <strong>AI Red Teaming</strong> before you deploy to real users.</p>
              <p style={{ fontWeight:600, color:"#f0f0f0", marginTop:8 }}>Trust, but verify aggressively.</p>
            </PremiumWarning>
          </div>
          
          <div id="submit" style={{ marginTop:80, scrollMarginTop:72 }}>
            <GitHubSubmit format="DAY10_{ROLLNUM}" example="DAY10_KAIEF2601" />
          </div>

          <div style={{ marginTop:100, paddingTop:80, borderTop:"1px solid rgba(255,255,255,0.05)", textAlign:"center" }}>
            <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
              <h2 style={{ fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:700, color:"#fff", letterSpacing:"-0.04em", marginBottom:16 }}>Great Work!</h2>
              <p style={{ fontSize:16, color:"#52525b", maxWidth:500, margin:"0 auto 48px", lineHeight:1.75 }}>You&apos;ve completed Day 10. Tomorrow we look at advanced deployment patterns and optimizing latency at scale.</p>
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
