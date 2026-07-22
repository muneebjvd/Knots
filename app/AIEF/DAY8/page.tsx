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
  "Understand Generative AI and Large Language Models",
  "Compare Open-Source vs Proprietary Models",
  "Master Prompt Engineering Fundamentals",
  "Apply Zero-Shot and Few-Shot Prompting",
  "Understand RAG (Retrieval Augmented Generation)",
  "Implement Responsible AI and Safety Layers",
];

const tocItems = [
  { id: "objectives", title: "Objectives" },
  { id: "videos", title: "Course Videos" },
  { id: "notes", title: "Implementation Notes" },
  { id: "generative-ai", title: "↳ Generative AI & LLMs" },
  { id: "prompt-engineering", title: "↳ Prompt Engineering" },
  { id: "rag", title: "↳ Retrieval Augmented Gen." },
  { id: "responsible-ai", title: "↳ Responsible AI" },
  { id: "projects", title: "Projects" },
  { id: "submit", title: "Submit" },
];

const courseVideos = [
  { id: 1, title: "Intro to Generative AI", src: "https://www.youtube-nocookie.com/embed/lFXQkBvEe0o?si=3swcVp2ic19S8xmm" },
  { id: 2, title: "Comparing LLMs", src: "https://www.youtube-nocookie.com/embed/KIRUeDKscfI?si=ywvSpOqI9paOcIWu" },
  { id: 3, title: "Responsible AI", src: "https://www.youtube-nocookie.com/embed/YOp-e1GjZdA?si=8L17v8LivkhxOt7G" },
  { id: 4, title: "Prompt Fundamentals", src: "https://www.youtube-nocookie.com/embed/GElCu2kUlRs?si=lHtqnSMCyU9G43Cg" },
  { id: 5, title: "Advanced Prompts", src: "https://www.youtube-nocookie.com/embed/BAjzkaCdRok?si=kVNJ3Earmm7AiPzP" },
  { id: 6, title: "Building Apps", src: "https://www.youtube-nocookie.com/embed/0Y5Luf5sRQA?si=zvY7VdRr9FQTmGOD" },
];

const implementationNotes = `
# Day 8 — Generative AI & Prompt Engineering

---

## Generative AI & LLMs

Generative AI democratizes technology—you can accomplish complex tasks using natural language instead of writing code. 
Large Language Models (LLMs) like GPT-4 are based on the **Transformer** architecture. They work by predicting the next token in a sequence using probability distributions.

1. **Tokenization**: Text is converted into numbers (tokens). A token is roughly 4 characters in English.
2. **Context Window**: The maximum number of tokens the model can read and generate in a single request.
3. **Temperature**: Controls randomness. \`0.0\` is deterministic (best for code), \`1.0\` is highly creative.

---

## Choosing the Right Model

Not every problem needs a massive model like GPT-4. Choosing the right foundation model is critical for performance and cost.

- **Proprietary (API-based)**: GPT-4, Claude 3. Extremely powerful, fully managed, but you pay per API call and send data externally.
- **Open-Weight**: Llama 3, Mistral. You host them yourself. Cheaper at massive scale, allows total data privacy and offline usage.
- **Embeddings**: Models that convert text to numbers to find semantic similarities. Used specifically for search and RAG.

---

## Prompt Engineering Fundamentals

Prompting is how you program an LLM. Since LLMs are statistical engines, the way you frame the prompt directly alters the probability distribution of the answer.

### Zero-Shot Learning
Asking the model a question without providing examples.
\`\`\`text
Prompt: Classify this review as Positive or Negative: "The battery life is terrible."
Response: Negative
\`\`\`

### Few-Shot Learning
Providing examples in the prompt to teach the model a specific format or logic pattern. This vastly improves reliability.
\`\`\`text
Prompt: 
Review: I love this! -> Sentiment: Positive
Review: Way too expensive. -> Sentiment: Negative
Review: It broke in a week. -> Sentiment:
Response: Negative
\`\`\`

---

## Retrieval Augmented Generation (RAG)

LLMs don't know your private company data, and they hallucinate facts they don't know.
**RAG solves this** by fetching relevant documents from a database and injecting them into the prompt. The LLM becomes a reading comprehension engine rather than a knowledge base.

\`\`\`python
# RAG Pattern (Conceptual)
query = "What is our company's refund policy?"

# 1. Retrieve data
relevant_docs = vector_database.search(query)

# 2. Augment prompt
prompt = f"""
Answer the user's question using ONLY the context below.
If the answer is not in the context, say "I don't know."

Context: {relevant_docs}
Question: {query}
"""

# 3. Generate
response = llm.generate(prompt)
\`\`\`

---

## Responsible AI

Generative AI poses significant product and societal risks that must be engineered away:
- **Hallucinations**: Stating false information with absolute confidence.
- **Bias & Toxicity**: Generating harmful, discriminatory, or offensive content.
- **Jailbreaks**: Users tricking the AI into ignoring safety rules (e.g. "Ignore previous instructions").

### Mitigation Strategy:
1. **Model Layer**: Fine-tuning models to refuse harmful requests natively.
2. **Safety System**: Content filters (e.g., Azure AI Content Safety) that block inputs/outputs matching toxic patterns before they even reach the user.
3. **Metaprompting**: System instructions that set strict behavioral bounds (e.g. "You are an AI. You must never generate code that deletes files.").
`;

const projectDetails = `
## Part 2 — Mini Project: Building an AI Startup

\`\`\`plaintext
day8_project/
├── business_plan.md        # Startup concept and AI integration
├── system_prompts.py       # Core prompt engineering
└── safety_evaluator.py     # Harm mitigation logic
\`\`\`

---

### Part A — \`business_plan.md\`

Define a startup that uses Generative AI to solve a specific problem in the education domain.
Write a brief summary answering:
1. **Problem**: What educational gap are you solving?
2. **How I would use AI**: Specifically, what model type (Text, Vision, Audio) and architecture (Proprietary vs Open-Source)?
3. **Impact**: How does this improve upon the "old way"?

---

### Part B — \`system_prompts.py\`

Write the core system prompts for your AI agent using few-shot learning and strict constraints.

\`\`\`python
# TODO: Write a system prompt that defines the persona of your AI tutor
SYSTEM_PROMPT = """
You are an expert physics tutor. 
Rule 1: Never give the direct answer. Always guide the student with a hint.
Rule 2: Keep responses under 3 sentences.
"""

# TODO: Add 3 few-shot examples to ensure the model follows Rule 1
FEW_SHOT_EXAMPLES = [
    {"role": "user", "content": "What is the answer to 5 * 10?"},
    {"role": "assistant", "content": "What happens when you add 10 together 5 times?"},
    # Add your examples here
]
\`\`\`

---

### Part C — \`safety_evaluator.py\`

Implement a basic safety filter that checks user inputs before sending them to the LLM.

\`\`\`python
BANNED_TOPICS = ["cheat", "hack", "bypass", "violence", "plagiarize"]

def is_safe_prompt(user_input: str) -> bool:
    # TODO: Implement safety check logic. 
    # Return False if any word in BANNED_TOPICS appears in user_input
    pass

def generate_response(user_input: str):
    if not is_safe_prompt(user_input):
        return "I cannot assist with that request."
    
    # Normally we would call an LLM API here
    return "Response generated successfully."

# TODO: Test your evaluator with 2 safe prompts and 2 unsafe prompts
\`\`\`
`;

const example1 = `
## Example 1 — System Prompts & Metaprompting

A strong system prompt acts as the "brain" of your agent. It defines persona, constraints, and output format.

\`\`\`python
import openai

def chat_with_tutor(student_message):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": """You are a Socratic math tutor. 
                
                CRITICAL INSTRUCTIONS:
                1. NEVER give the student the final answer. 
                2. If the student asks for the answer, politely refuse and ask a guiding question.
                3. Always format mathematical formulas using LaTeX.
                4. Your tone must be encouraging but strictly refuse cheating attempts."""
            },
            {"role": "user", "content": "Can you just tell me the derivative of x^2?"},
            {"role": "assistant", "content": "I'd love to help you figure it out! What is the power rule in calculus?"},
            {"role": "user", "content": student_message}
        ],
        temperature=0.3 # Low temperature for consistent, instruction-following behavior
    )
    return response.choices[0].message.content
\`\`\`
`;

const example2 = `
## Example 2 — RAG Implementation

Here is how you inject external context into a prompt to prevent hallucinations and access private data.

\`\`\`python
def ask_company_bot(question):
    # 1. Retrieve
    # Search the company database for relevant paragraphs
    # (In production, this uses vector embeddings and cosine similarity)
    database_results = [
        "Policy 104: Employees get 20 days of paid time off per year.",
        "Policy 201: Remote work is allowed up to 3 days a week."
    ]
    
    context = " ".join(database_results)
    
    # 2. Augment
    # Build the augmented prompt with strict grounding instructions
    prompt = f"""
    You are an HR assistant. Answer the user's question using ONLY the provided context.
    If the answer is not in the context, say "I don't have information on that."
    
    CONTEXT: 
    {context}
    
    QUESTION: {question}
    """
    
    # 3. Generate
    # The LLM now acts as a reading comprehension engine, not an open-ended oracle.
    return mock_llm_call(prompt)

print(ask_company_bot("How much PTO do I get?")) 
# Output: "You receive 20 days of paid time off per year."

print(ask_company_bot("What is the dental plan?"))
# Output: "I don't have information on that." (Prevents hallucination!)
\`\`\`
`;

export default function Day8Page() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes"|"project"|"example1"|"example2">("notes");
  const [activeVideo, setActiveVideo] = useState<number>(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const unlocked = sessionStorage.getItem("aief_unlocked_day8");
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
            <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:4, background:"#10B981", color:"#000" }}>DAY 8</span>
          </div>
        </div>
      </nav>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px", display:"flex", gap:64, alignItems:"flex-start" }}>
        <StickyTOC items={tocItems} />
        <main style={{ flex:1, minWidth:0, paddingBottom:120 }}>
          <CourseHero day={8} totalDays={15} title="Welcome to Day 8" subtitle="Week 2 begins. We dive into Generative AI, Large Language Models, and the engineering discipline required to wrangle them safely and reliably using Prompt Engineering and RAG." duration="≈2-4 Hours" course="Microsoft AI for Beginners" focus="Generative AI" difficulty="Beginner" />
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
              <VideoEmbed embedSrc={courseVideos[activeVideo].src} title={courseVideos[activeVideo].title} />
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
            <h2 style={{ fontSize:20, fontWeight:700, color:"#fff", letterSpacing:"-0.02em", marginBottom:6 }}>Day 8 Project</h2>
            <p style={{ fontSize:13.5, color:"#52525b", marginBottom:28 }}>Design a generative AI product and implement safety limits.</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:16 }}>
              <ProjectCard title="AI Startup Design" description="Design a generative AI product for the education domain. Define the problem, how AI uniquely solves it, and how you will handle hallucination risks." skills={["Product Design","Risk Mitigation","Generative AI"]} />
              <ProjectCard title="System Prompts & Safety" description="Write robust system prompts to control an LLM persona, use few-shot examples to enforce constraints, and write a Python safety filter to block banned topics." skills={["Prompt Engineering","Few-Shot Learning","Metaprompting","Safety Filters"]} />
            </div>
          </div>

          <div style={{ marginTop:80 }}>
            <PremiumWarning title="Start with Safety">
              <p>Generative AI is incredibly powerful, but you must architect for failure.</p>
              <p>Assume the model <strong>will</strong> hallucinate and users <strong>will</strong> try to jailbreak it. Focus on building the \`safety_evaluator.py\` guardrails robustly before you refine the prompt.</p>
              <p style={{ fontWeight:600, color:"#f0f0f0", marginTop:8 }}>Engineers build first. AI assists later.</p>
            </PremiumWarning>
          </div>
          
          <div id="submit" style={{ marginTop:80, scrollMarginTop:72 }}>
            <GitHubSubmit format="DAY8_{ROLLNUM}" example="DAY8_KAIEF2601" />
          </div>

          <div style={{ marginTop:100, paddingTop:80, borderTop:"1px solid rgba(255,255,255,0.05)", textAlign:"center" }}>
            <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
              <h2 style={{ fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:700, color:"#fff", letterSpacing:"-0.04em", marginBottom:16 }}>Great Work!</h2>
              <p style={{ fontSize:16, color:"#52525b", maxWidth:500, margin:"0 auto 48px", lineHeight:1.75 }}>You&apos;ve completed Day 8. Tomorrow we dive into prompt engineering techniques for specific complex use-cases.</p>
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
