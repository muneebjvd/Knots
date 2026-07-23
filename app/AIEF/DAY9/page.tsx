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
  "Build Context-Aware AI Chat Applications",
  "Implement Semantic Search using Embeddings",
  "Generate and Edit Images via API",
  "Build Low-Code Solutions in Power Platform",
  "Give LLMs External Tools via Function Calling",
  "Design Ethical, Transparent UX for AI Apps",
];

const tocItems = [
  { id: "objectives", title: "Objectives" },
  { id: "videos", title: "Course Videos" },
  { id: "notes", title: "Implementation Notes" },
  { id: "chat-apps", title: "↳ Chat & Search Apps" },
  { id: "image-gen", title: "↳ Image Generation" },
  { id: "function-call", title: "↳ Function Calling" },
  { id: "ux-ai", title: "↳ UX for AI" },
  { id: "projects", title: "Projects" },
  { id: "submit", title: "Submit" },
];

const courseVideos = [
  { id: 1, title: "Chat Apps", src: "https://www.youtube-nocookie.com/embed/R9V0ZY1BEQo?si=Vfr8891GR_fNIfsO" },
  { id: 2, title: "Search & Embeddings", src: "https://www.youtube-nocookie.com/embed/R9V0ZY1BEQo?si=tdMrnp15TvtmLStc" },
  { id: 3, title: "Image Generation", src: "https://www.youtube-nocookie.com/embed/B5VP0_J7cs8?si=d8u0XiT0N5El2OlA" },
  { id: 4, title: "Low Code AI", src: "https://www.youtube-nocookie.com/embed/1vzq3Nd8GBA?si=uAbsTiFn8yJEDbec" },
  { id: 5, title: "Function Calling", src: "https://www.youtube-nocookie.com/embed/DgUdCLX8qYQ?si=dMoaq05bcw1HLFtE" },
  { id: 6, title: "UX for AI", src: "https://www.youtube-nocookie.com/embed/VKbCejSICA8?si=sJSAqpEl6la3aRNV" },
];

const implementationNotes = `
# Day 9 — Advanced Modalities & Productization

Welcome to Day 9! We move beyond basic text generation and build actual product-grade systems across different modalities: persistent chat, semantic search, image generation, and low-code AI workflows.

---

## 1. Chat Applications

A standard **Chatbot** is rule-based and task-focused (e.g. tracking a package). An **AI-Powered Chat Application** is context-aware and open-domain. To build effective chat apps for specialized domains (like medicine or law), you can:
- **Leverage DSL (Domain Specific Language) Models** trained on your field.
- **Fine-tune** existing models on your domain-specific data so they understand jargon without hallucinating.

### Semantic Search & Embeddings
Keyword search fails when users use synonyms. **Semantic Search** understands the *intent* behind words.
- **Embeddings**: Models like \`text-embedding-ada-002\` convert text into a 1,536-dimensional vector (an array of numbers), one per aspect of meaning.
- **Cosine Similarity**: Convert the user's query into a vector, then measure the mathematical angle between it and each database vector. The smallest angle = most semantically similar.

---

## 2. Image Generation

Models like \`gpt-image-2\` use transformer + diffusion techniques to generate images from text prompts.

**Key Implementation Details:**
- **No URLs**: The API returns images as a massive \`base64\` encoded string (\`b64_json\`). Your app must decode it into bytes and save it as \`.png\`.
- **Image Editing**: Pass an image, a mask (area to change), and a prompt to selectively edit parts of an image via \`client.images.edit()\`.
- **Safety Metaprompts**: Always silently prepend a safety metaprompt to constrain what the model can produce.

\`\`\`python
disallow_list = "swords, violence, blood, nudity, adult content"

meta_prompt = f"""You are an assistant designer that creates images for children.
The image needs to be safe for work and appropriate for children.
Do not consider any input that is not safe for work, including:
{disallow_list}
"""
prompt = f"{meta_prompt}\\nCreate an image of a bunny on a horse, holding a lollipop"
\`\`\`

---

## 3. Low Code AI & Copilot Studio

Not all AI applications require Python. **Microsoft Power Platform** enables rapid visual development:
- **Power Apps**: Create UIs like a Student Assignment Tracker by describing what you want to Copilot. It auto-generates the Dataverse tables and Canvas app.
- **Power Automate + AI Builder**: Build automated flows. AI Builder's Invoice Processing model can extract key fields from PDF invoices received by email.
- **Copilot Studio**: Create autonomous agents that connect to SharePoint, Dataverse, or external APIs. Agents can be triggered by events (e.g. a new email arriving) and act in the background.

---

## 4. Function Calling (Tool Use)

LLMs cannot browse the web, query a database, or send emails natively. **Function Calling** bridges this gap.

### The 3-Step Flow:
1. **Define the Tool Schema**: Provide the LLM a JSON schema of your Python function (name, parameters, descriptions).
2. **LLM Decides**: When the user asks *"Find me an Azure course for beginners"*, the LLM returns a structured JSON payload requesting execution of your function with extracted arguments.
3. **Execute & Return**: Your Python code runs the real function, then appends the result back as a \`function_call_output\`. The LLM reads it and generates a human-readable response.

\`\`\`python
functions = [{
    "type": "function",
    "name": "search_courses",
    "description": "Retrieves courses based on the parameters provided",
    "parameters": {
        "type": "object",
        "properties": {
            "role": {"type": "string", "description": "The role of the learner"},
            "product": {"type": "string", "description": "The product being covered"},
            "level": {"type": "string", "description": "Experience level (beginner, intermediate, advanced)"}
        },
        "required": ["role"]
    }
}]
response = client.responses.create(model=deployment, input=messages, tools=functions, tool_choice="auto", store=False)
\`\`\`

---

## 5. Designing UX for AI

AI introduces unique Human-Computer Interaction challenges. A good AI UX must be:
- **Useful**: Functionality matches intended purpose (e.g. grading automation actually grades consistently).
- **Reliable**: Handles errors gracefully, not by blaming the user.
- **Accessible**: Supports screen readers, high contrast, simplified language.
- **Pleasant**: Enjoyable to use — drives user retention.

### Building Trust
- **Explainability**: Clearly state how the AI reached its conclusion. Never pretend it's human. Say *"Use our AI tutor"* not *"Chat with your tutor"*.
- **Control**: Let users edit outputs, opt-out of data collection, and rate responses (👍/👎).
- **Avoid Overtrust**: Add friction to remind users the AI can be wrong. An automated grading system needs a teacher to review the output before it's final.
`;

const projectDetails = `
## Part 2 — Mini Project: The AI Product Suite

\`\`\`plaintext
day9_project/
├── semantic_search.py      # Embedding-based cosine similarity search
├── image_generator.py      # Base64 decoding & metaprompting
└── function_caller.py      # LLM tool-use for external APIs
\`\`\`

---

### Part A — \`semantic_search.py\`

Build an application that allows students to search through AI YouTube video transcripts using Semantic Search.

1. Provision an Azure OpenAI resource and deploy the \`text-embedding-ada-002\` model.
2. Load the provided JSON index containing 3-minute YouTube transcript chunks.
3. Take a user's query, convert it to a vector, calculate **Cosine Similarity** against all stored vectors, and return the top 3 most relevant video timestamps.

---

### Part B — \`image_generator.py\`

Build an application that generates unique educational illustrations of historical monuments.

1. Securely load your API keys using \`python-dotenv\`.
2. Construct a **Metaprompt** that forces the image to be safe for children and in a 16:9 aspect ratio.
3. Call \`client.images.generate()\`, extract the \`b64_json\` response, decode it via Python's \`base64\` library, and write it to disk as \`generated-monument.png\`.

---

### Part C — \`function_caller.py\`

Give your chatbot the ability to execute real code on demand.

1. Create a Python function \`search_courses(role, product, level)\` that calls an external API (Microsoft Learn).
2. Define the JSON schema for this function and pass it in the \`tools\` array to the OpenAI client.
3. Write logic to intercept the \`function_call\` response from the LLM, run your Python function, feed the results back as \`function_call_output\`, and print the final human-readable summary.
`;

const example1 = `
## Example 1 — Function Calling End-to-End

\`\`\`python
import os, json, requests
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Step 1: Define the tool schema
functions = [{
    "type": "function",
    "name": "search_courses",
    "description": "Retrieves courses from Microsoft Learn based on parameters",
    "parameters": {
        "type": "object",
        "properties": {
            "role":    {"type": "string", "description": "Learner role (student, developer, etc.)"},
            "product": {"type": "string", "description": "Product covered (Azure, Power BI, etc.)"},
            "level":   {"type": "string", "description": "Experience level (beginner, intermediate, advanced)"}
        },
        "required": ["role"]
    }
}]

def search_courses(role, product="", level=""):
    url = "https://learn.microsoft.com/api/catalog/"
    params = {"role": role, "product": product, "level": level}
    modules = requests.get(url, params=params).json().get("modules", [])
    return str([{"title": m["title"], "url": m["url"]} for m in modules[:5]])

messages = [{"role": "user", "content": "Find me a good Azure course for a beginner student."}]

# Step 2: First call — LLM decides to call the function
response = client.responses.create(model="gpt-4o", input=messages, tools=functions, tool_choice="auto", store=False)
tool_calls = [item for item in response.output if item.type == "function_call"]

# Step 3: Execute the function and feed results back
for call in tool_calls:
    args = json.loads(call.arguments)
    result = search_courses(**args)
    messages.append(call)                              # append assistant's call
    messages.append({"type": "function_call_output", "call_id": call.call_id, "output": result})

# Step 4: Second call — LLM summarizes the results in natural language
final = client.responses.create(model="gpt-4o", input=messages, tools=functions, tool_choice="auto", store=False)
print(final.output_text)
\`\`\`
`;

const example2 = `
## Example 2 — Generating & Saving an Image

\`\`\`python
import os, base64
from openai import AzureOpenAI
from dotenv import load_dotenv

load_dotenv()
client = AzureOpenAI(
    api_key=os.environ["AZURE_OPENAI_API_KEY"],
    api_version="2025-04-01-preview",
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
)

deployment = "gpt-image-2"

# Strict metaprompt for brand safety
meta_prompt = """You are an assistant designer that creates images for children.
The image needs to be safe for work and appropriate for children.
Do not include any violent, scary, or adult themes.
"""

user_request = "A famous historical monument at sunset with a child looking on."
final_prompt = f"{meta_prompt}\\nCreate: {user_request}"

print("Generating image...")
result = client.images.generate(model=deployment, prompt=final_prompt, size="1024x1024", n=1)

# Decode base64 to bytes and save as PNG
image_bytes = base64.b64decode(result.data[0].b64_json)

os.makedirs("images", exist_ok=True)
with open("images/monument.png", "wb") as f:
    f.write(image_bytes)

print("Saved to images/monument.png")
\`\`\`
`;

export default function Day9Page() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes"|"project"|"example1"|"example2">("notes");
  const [activeVideo, setActiveVideo] = useState<number>(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const unlocked = sessionStorage.getItem("aief_unlocked_day9");
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
            <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:4, background:"#CCFF00", color:"#000" }}>DAY 9</span>
          </div>
        </div>
      </nav>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px", display:"flex", gap:64, alignItems:"flex-start" }}>
        <StickyTOC items={tocItems} />
        <main style={{ flex:1, minWidth:0, paddingBottom:120 }}>
          <CourseHero day={9} totalDays={15} title="Welcome to Day 9" subtitle="Advanced Modalities. Go beyond text generation and build Semantic Search, Image Generation, Function Calling tools, and Low-Code AI workflows for production." duration="≈4-5 Hours" course="Microsoft AI for Beginners" focus="Multi-Modal Apps & Tool Use" difficulty="Intermediate" />
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
            <h2 style={{ fontSize:20, fontWeight:700, color:"#fff", letterSpacing:"-0.02em", marginBottom:6 }}>Day 9 Project</h2>
            <p style={{ fontSize:13.5, color:"#52525b", marginBottom:28 }}>Build multi-modal AI applications using the OpenAI API.</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:16 }}>
              <ProjectCard title="Semantic Search Engine" description="Convert YouTube transcripts to embedding vectors and enable students to find the exact video timestamp that answers their question using Cosine Similarity." skills={["Embeddings", "Cosine Similarity", "Vector Search"]} />
              <ProjectCard title="Image Generator App" description="Decode base64 JSON responses to programmatically generate, edit, and save PNG images for students while enforcing strict content Metaprompts." skills={["Base64 Decoding", "Image API", "Metaprompts"]} />
              <ProjectCard title="Function Calling Chatbot" description="Give your chatbot external tools. Define JSON schemas for Python functions and allow the LLM to dynamically decide when and how to call them." skills={["Tool Use", "Function Calling", "JSON Output"]} />
            </div>
          </div>

          <div style={{ marginTop:80 }}>
            <PremiumWarning title="Build Responsibly">
              <p>Every modality you add today (images, embeddings, function calls) is a new attack surface.</p>
              <p>Always use <strong>metaprompts</strong>, safety filters, and content policies. Never expose raw LLM outputs to users without a validation layer.</p>
              <p style={{ fontWeight:600, color:"#f0f0f0", marginTop:8 }}>Great engineers ship safely. Build the guardrails first.</p>
            </PremiumWarning>
          </div>
          
          <div id="submit" style={{ marginTop:80, scrollMarginTop:72 }}>
            <GitHubSubmit format="DAY9_{ROLLNUM}" example="DAY9_KAIEF2601" />
          </div>

          <div style={{ marginTop:100, paddingTop:80, borderTop:"1px solid rgba(255,255,255,0.05)", textAlign:"center" }}>
            <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
              <h2 style={{ fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:700, color:"#fff", letterSpacing:"-0.04em", marginBottom:16 }}>Great Work!</h2>
              <p style={{ fontSize:16, color:"#52525b", maxWidth:500, margin:"0 auto 48px", lineHeight:1.75 }}>You&apos;ve completed Day 9. Tomorrow we go deeper into fine-tuning models and building production-grade LLM pipelines.</p>
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
