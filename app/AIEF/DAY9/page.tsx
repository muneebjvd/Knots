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
  "Build Context-Aware Chat Applications",
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
  { id: "projects", title: "Day 9 Project" },
  { id: "examples", title: "Code Examples" },
  { id: "submit", title: "Submit Work" },
];

const videos = [
  { id: 1, title: "Chat Apps", src: "https://www.youtube-nocookie.com/embed/R9V0ZY1BEQo?si=Vfr8891GR_fNIfsO" },
  { id: 2, title: "Search & Embeddings", src: "https://www.youtube-nocookie.com/embed/R9V0ZY1BEQo?si=tdMrnp15TvtmLStc" },
  { id: 3, title: "Image Generation", src: "https://www.youtube-nocookie.com/embed/B5VP0_J7cs8?si=d8u0XiT0N5El2OlA" },
  { id: 4, title: "Low Code AI", src: "https://www.youtube-nocookie.com/embed/1vzq3Nd8GBA?si=uAbsTiFn8yJEDbec" },
  { id: 5, title: "Function Calling", src: "https://www.youtube-nocookie.com/embed/DgUdCLX8qYQ?si=dMoaq05bcw1HLFtE" },
  { id: 6, title: "UX for AI", src: "https://www.youtube-nocookie.com/embed/VKbCejSICA8?si=sJSAqpEl6la3aRNV" },
];

const implementationNotes = `
# Day 9 — Advanced Modalities & Productization

Welcome to Day 9! Today we transition from writing simple prompts to building actual product-grade systems. We will cover advanced modalities (Images & Embeddings), tool-use (Function Calling), and the Human-Computer Interaction (UX) required to deploy them responsibly.

---

## 1. Chat vs. Search Applications

### AI-Powered Chat Applications
A standard **Chatbot** is rule-based and task-focused (e.g. tracking a package). An **AI-Powered Chat Application** is context-aware and open-domain. To build effective chat applications for specialized domains (like medicine or law), you can leverage **DSL (Domain Specific Language) Models** or fine-tune existing models so they understand your specific jargon without hallucinating.

### Semantic Search & Embeddings
If you want users to search through video transcripts or internal wikis, traditional keyword search fails if the user uses synonyms (e.g. searching "dream car" vs "ideal vehicle").
- **Embeddings**: We use models like \`text-embedding-ada-002\` to convert text into a 1,536-dimensional vector (an array of numbers).
- **Cosine Similarity**: To search, we convert the user's query into a vector and measure the mathematical angle between it and our database vectors. The closest vectors are semantically identical, regardless of the actual words used.

---

## 2. Image Generation

Models like \`gpt-image-2\` use transformer and diffusion techniques to "denoise" random pixels into a high-fidelity image based on your text prompt.

**Implementation Details**:
- **No URLs**: The OpenAI API returns images as a massive \`base64\` encoded string (\`b64_json\`). Your application must decode this string into bytes and write it to disk as a \`.png\`.
- **Metaprompting**: Because users can request inappropriate content, you must silently prepend a strict safety metaprompt to their input (e.g., *"You are a children's book illustrator. Do not generate violence or gore."*).

---

## 3. Function Calling (Tool Use)

LLMs cannot browse the web, check a database, or send emails natively. **Function Calling** bridges this gap by allowing the LLM to request the execution of a Python function.

### The 3-Step Flow:
1. **Define the Tool**: You provide the LLM with a JSON schema describing your Python functions (e.g., \`search_courses(role, product, level)\`).
2. **The LLM Decides**: When the user asks *"Find me an Azure course for beginners"*, the LLM realizes it needs that data. Instead of replying with text, it returns a structured JSON payload asking you to run \`search_courses\` with those arguments.
3. **Execution & Return**: Your Python code intercepts this request, runs the actual database query, and appends the raw JSON results back into the conversation array as a \`function_call_output\`. The LLM then reads your data and formulates a natural language response for the user.

---

## 4. Low Code AI Workflows

Not everything requires Python. Microsoft's **Power Platform** allows for rapid visual development:
- **Power Apps**: Create UIs (like a Student Tracker) by describing what you want to **Copilot**.
- **Power Automate**: Create automated flows. You can use **AI Builder** models to automatically extract text from PDF invoices sent via email.
- **Copilot Studio**: Create autonomous agents that connect to your SharePoint, Dataverse, or external APIs without writing backend logic.

---

## 5. Designing UX for AI

AI applications introduce unique Human-Computer Interaction challenges. A good AI UX must be:
- **Useful & Reliable**: Does it solve the problem consistently?
- **Accessible**: Does it support screen readers, high contrast, and simplified language?

### Building Trust
- **Avoid Overtrust**: Users often assume the AI is always right. Add friction to remind them that the AI can make mistakes.
- **Explainability**: Clearly state how the AI arrived at its conclusion. Do not pretend it is human.
- **Control & Feedback**: Give users the ability to edit the AI's output, opt-out of data collection, and provide Thumbs Up/Down feedback to improve the system.
`;

const projectDetails = `
## Day 9 Mini Project: The AI Product Suite

\`\`\`plaintext
day9_project/
├── semantic_search.py      # Embedding-based cosine similarity tool
├── image_generator.py      # Base64 decoding & metaprompting
├── function_caller.py      # LLM tool-use for external APIs
└── power_platform/         # Low code documentation
    └── assignment_app.md
\`\`\`

---

### Part A — \`semantic_search.py\`

Build an application that allows students to search through AI YouTube video transcripts.
1. Provision an Azure OpenAI resource and deploy the \`text-embedding-ada-002\` model.
2. Load the provided JSON index containing 3-minute transcript chunks.
3. Take a user's query, convert it into an embedding vector, calculate the **Cosine Similarity** against the transcript vectors, and return the top 3 results.

---

### Part B — \`image_generator.py\`

Build an application that generates unique educational illustrations of historical monuments for students.
1. Securely load your API keys using \`python-dotenv\`.
2. Construct a **Metaprompt** that forces the image to be safe for children and in a 16:9 aspect ratio.
3. Extract the \`b64_json\` response, decode it via Python's \`base64\` library, and write it to disk.

---

### Part C — \`function_caller.py\`

Give your chatbot the ability to execute code.
1. Create a Python function \`search_courses(role, product, level)\` that hits an external API (like Microsoft Learn).
2. Define the JSON schema for this function and pass it in the \`tools\` array to the OpenAI client.
3. Write the logic to intercept the \`function_call\` response, execute your Python code, and feed the results back to the LLM to get a human-readable summary.

---

### Part D — Low Code & UX

1. **Power Platform**: Open Power Apps and describe an assignment tracking app to Copilot. Then, use Power Automate's AI Builder to extract data from PDF invoices.
2. **UX Audit**: Review your projects from Parts A-C. Did you implement error boundaries? Did you add a warning label that the content is AI-generated? Add simple print statements that explain to the user *how* the AI got its data (Explainability).
`;

const example1 = `
# Function Calling Flow

This example demonstrates how to define a function, let the LLM call it, and feed the results back.

\`\`\`python
import os, json
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 1. Define the tool schema
tools = [{
    "type": "function",
    "function": {
        "name": "get_student_grades",
        "description": "Get the current GPA for a student by name.",
        "parameters": {
            "type": "object",
            "properties": {
                "student_name": {"type": "string", "description": "The full name of the student"}
            },
            "required": ["student_name"]
        }
    }
}]

messages = [{"role": "user", "content": "What is John Doe's GPA?"}]

# 2. First API Call (LLM decides to use the tool)
response = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    tools=tools,
    tool_choice="auto"
)

message = response.choices[0].message
messages.append(message) # Append the assistant's tool-call request

if message.tool_calls:
    for tool_call in message.tool_calls:
        if tool_call.function.name == "get_student_grades":
            # Parse the JSON arguments the LLM extracted
            args = json.loads(tool_call.function.arguments)
            
            # 3. Execute your real Python backend logic here
            print(f"Executing database query for {args['student_name']}...")
            fake_db_result = {"student_name": args['student_name'], "gpa": 3.8}
            
            # 4. Feed the result back to the LLM
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(fake_db_result)
            })

# 5. Second API Call (LLM summarizes the result)
final_response = client.chat.completions.create(
    model="gpt-4",
    messages=messages
)

print("\\nFinal Output:", final_response.choices[0].message.content)
# "John Doe currently has a GPA of 3.8."
\`\`\`
`;

const example2 = `
# Generating & Decoding Images

\`\`\`python
import os, base64
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

meta_prompt = "You are a designer creating educational images for children. The image MUST be safe for work."
user_request = "A friendly dinosaur teaching mathematics."

print("Generating image...")
result = client.images.generate(
    model="dall-e-3",
    prompt=f"{meta_prompt}\\n\\nRequest: {user_request}",
    size="1024x1024",
    n=1,
)

# Decode Base64 string to raw bytes
image_bytes = base64.b64decode(result.data[0].b64_json)

os.makedirs("images", exist_ok=True)
with open("images/dino-math.png", "wb") as f:
    f.write(image_bytes)

print("Success! Image saved.")
\`\`\`
`;

export default function Day9Page() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [activeVideo, setActiveVideo] = useState(videos[0]);

  useEffect(() => {
    sessionStorage.setItem("aief_unlocked_day9", "true");
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-indigo-500/30 font-sans">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 origin-left z-50" style={{ scaleX }} />
      <CourseHero 
        day={9} 
        totalDays={15} 
        title="Advanced Modalities" 
        subtitle="Go beyond basic text generation. Master Semantic Search, Image Generation, Function Calling, and Low Code workflows to build production-grade AI products." 
        duration="~4-5 Hours" 
        course="Microsoft AI for Beginners" 
        focus="Multi-Modal Apps & Tool Use" 
        difficulty="Intermediate" 
      />
      
      <div className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 relative">
        <StickyTOC items={tocItems} />
        
        <div className="flex-1 min-w-0">
          <div id="objectives" className="scroll-mt-24 mb-16">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Learning Objectives</h2>
            <Checklist items={objectives} />
          </div>

          <div id="videos" className="scroll-mt-24 mb-16">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Course Videos</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {videos.map((vid) => (
                <button
                  key={vid.id}
                  onClick={() => setActiveVideo(vid)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeVideo.id === vid.id
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                      : "bg-[#18181b] text-gray-400 hover:bg-[#27272a] hover:text-white"
                  }`}
                >
                  {vid.title}
                </button>
              ))}
            </div>
            <VideoEmbed embedSrc={activeVideo.src} title={activeVideo.title} />
            <p className="text-sm text-gray-500 mt-4 text-center">
              Video {activeVideo.id} of {videos.length} • {activeVideo.title}
            </p>
          </div>

          <div id="notes" className="scroll-mt-24 mb-16">
            <MarkdownViewer content={implementationNotes} />
          </div>

          <div id="projects" className="scroll-mt-24 mb-16">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Day 9 Project</h2>
            <p className="text-[#a1a1aa] mb-8 leading-relaxed">
              Combine advanced modalities to build robust, multi-faceted generative AI applications.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <ProjectCard 
                title="Semantic Search Engine" 
                description="Use the text-embedding-ada-002 model to convert text into massive vectors, enabling semantic search through cosine similarity math." 
                skills={["Embeddings", "Cosine Similarity", "Vector Search"]} 
              />
              <ProjectCard 
                title="Image Generator app" 
                description="Decode base64 JSON responses to programmatically generate, edit, and save PNG images while enforcing strict safety Metaprompts." 
                skills={["Base64 Decoding", "Image API", "Metaprompts"]} 
              />
              <ProjectCard 
                title="Function Calling Chatbot" 
                description="Provide your chatbot with external tools. Define JSON schemas for Python functions and allow the LLM to execute them dynamically." 
                skills={["Tool Use", "Function Calling", "JSON Output"]} 
              />
            </div>
            <MarkdownViewer content={projectDetails} />
          </div>

          <div id="examples" className="scroll-mt-24 mb-16 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Function Calling Flow</h2>
              <MarkdownViewer content={example1} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Generating & Decoding Images</h2>
              <MarkdownViewer content={example2} />
            </div>
          </div>

          <PremiumWarning title="Build Responsibly">
            <p>Every application you build today touches multiple modalities — images, embeddings, function calls. Each one is a new attack surface.</p>
            <p>Always use metaprompts, safety filters, and content policies. Never expose raw LLM outputs to users without a validation layer.</p>
            <p style={{ fontWeight: 600, color: "#f0f0f0", marginTop: 8 }}>Great engineers ship safely. Build the guardrails first.</p>
          </PremiumWarning>
          <div id="submit" style={{ marginTop: 80, scrollMarginTop: 72 }}>
            <GitHubSubmit format="DAY9_{ROLLNUM}" example="DAY9_KAIEF2601" />
          </div>
        </div>
      </div>
    </div>
  );
}
