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
  "Apply Metaprompts for Content Guardrails",
  "Build Low-Code Solutions in Power Platform",
  "Create Autonomous Agents with Copilot Studio",
];

const tocItems = [
  { id: "objectives", title: "Objectives" },
  { id: "videos", title: "Course Videos" },
  { id: "notes", title: "Implementation Notes" },
  { id: "chat-apps", title: "↳ Chat Applications" },
  { id: "search-embeddings", title: "↳ Semantic Search" },
  { id: "image-gen", title: "↳ Image Generation" },
  { id: "low-code", title: "↳ Low Code AI" },
  { id: "projects", title: "Day 9 Project" },
  { id: "examples", title: "Code Examples" },
  { id: "submit", title: "Submit Work" },
];

const videos = [
  { id: 1, title: "Chat Apps", src: "https://www.youtube-nocookie.com/embed/R9V0ZY1BEQo?si=Vfr8891GR_fNIfsO" },
  { id: 2, title: "Search & Embeddings", src: "https://www.youtube-nocookie.com/embed/R9V0ZY1BEQo?si=tdMrnp15TvtmLStc" },
  { id: 3, title: "Image Generation", src: "https://www.youtube-nocookie.com/embed/B5VP0_J7cs8?si=d8u0XiT0N5El2OlA" },
  { id: 4, title: "Low Code AI", src: "https://www.youtube-nocookie.com/embed/1vzq3Nd8GBA?si=uAbsTiFn8yJEDbec" },
  { id: 5, title: "External Functions", src: "https://www.youtube-nocookie.com/embed/DgUdCLX8qYQ?si=dMoaq05bcw1HLFtE" },
  { id: 6, title: "AI Agents", src: "https://www.youtube-nocookie.com/embed/VKbCejSICA8?si=sJSAqpEl6la3aRNV" },
];

const implementationNotes = `
# Day 9 — Advanced Applications (Chat, Search, Images & Low Code)

Welcome to Day 9! Today, we move beyond basic text generation and build fully-fledged applications across different modalities: persistent chat, semantic search, image generation, and low-code AI workflows.

---

## 1. Chat Applications

There is a significant difference between a basic **Chatbot** and an **AI-powered Chat Application**:
- **Chatbots**: Typically task-focused (e.g. "Track my package") and governed by strict, rule-based decision trees.
- **AI Chat Applications**: Context-aware, open-domain systems powered by Generative AI. They retain conversation history, resolve ambiguity gracefully, and personalize interactions.

### Building for Production
When building chat apps, do not write everything from scratch. Use SDKs (like the OpenAI Python library) to handle connection pooling and retries. If your app requires deep domain knowledge (e.g. a Medical Triage assistant), you should either:
1. **Fine-tune** the model on domain-specific data.
2. Provide a **System Prompt** (Metaprompt) to dictate strict boundaries.

---

## 2. Semantic Search & Embeddings

Traditional "Keyword Search" looks for exact word matches (e.g. searching "dream car" finds articles about literal dreams). **Semantic Search** understands the *intent* and meaning behind the words.

### Text Embeddings
To achieve semantic search, we use **Embeddings**. 
An embedding model (like \`text-embedding-ada-002\`) takes text and converts it into a massive array of numbers (a vector with 1536 dimensions). Each dimension represents a subtle aspect of the text's meaning.

### Cosine Similarity
Once your entire database is converted into vectors (and stored in a Vector Database like Pinecone or Azure AI Search), you convert the user's search query into a vector too. By measuring the **Cosine Similarity** (the mathematical angle between the two vectors), you can instantly find the documents that mean the same thing as the query, even if they share zero keywords.

---

## 3. Image Generation

Large Language Models aren't just for text. Using transformer and diffusion techniques, models like \`gpt-image\` can convert natural language descriptions into high-quality images.

### Key Implementation Details
- **Base64 Encoding**: Unlike text generation, image APIs typically return the image as a massive \`base64\` encoded string. You must decode this string in Python and save it as a \`.png\` file.
- **Inpainting (Editing)**: You can pass an existing image, a "mask" (highlighting an area to change), and a prompt to selectively edit parts of an image.
- **Safety Metaprompts**: Because image generation can produce unsafe content, it is standard practice to silently prepend a strict safety metaprompt to the user's request (e.g. *"You are an assistant that creates images for children. Do not generate violence..."*).

---

## 4. Low Code AI & Copilot Studio

Not all AI applications require Python. **Low Code Development Platforms** allow you to build apps and workflows visually.

- **Power Apps**: Build user interfaces (like a Student Assignment Tracker) by dragging and dropping components. You can use Copilot to generate the app layout just by describing it in text.
- **Power Automate**: Build automated workflows (like an Invoice Processor). **AI Builder** models can automatically extract data from uploaded PDFs and route it via email.
- **Copilot Studio**: Create autonomous AI agents that can trigger workflows across Microsoft 365, answer questions from internal SharePoint documents, and take actions on behalf of users.
`;

const projectDetails = `
## Part 2 — Mini Project: Multi-Modal AI Applications

\`\`\`plaintext
day9_project/
├── semantic_search.py      # Embedding-based search tool
├── image_generator.py      # Text-to-Image application
└── power_platform/         # Low code documentation
    └── assignment_app.md
\`\`\`

---

### Part A — \`semantic_search.py\`

Build an application that allows users to search through video transcripts using Semantic Search.

1. Provision an Azure OpenAI resource and deploy the \`text-embedding-ada-002\` model.
2. Read a provided JSON index containing text segments from YouTube transcripts.
3. Take a user's query, convert it into an embedding vector, and calculate the **Cosine Similarity** against the transcript vectors.
4. Return the top 3 most relevant video timestamps.

---

### Part B — \`image_generator.py\`

Build an application that generates unique educational illustrations of historical monuments for students.

1. Securely load your API keys using \`python-dotenv\`.
2. Construct a **Metaprompt** that forces the image to be safe for children and in a 16:9 aspect ratio.
3. Call the \`images.generate\` API with the user's requested monument.
4. Extract the \`b64_json\` response, decode it, and write it to disk as \`generated-monument.png\`.

---

### Part C — Low Code AI (Power Platform)

Use Microsoft's Power Platform to build two automated solutions:

1. **Student Assignment Tracker**: Open Power Apps, describe an assignment tracking app to Copilot, and let it generate the Dataverse tables and UI.
2. **Invoice Processing Flow**: Open Power Automate and use AI Builder's Document Processing model to automatically extract data from PDF invoices when they arrive in your inbox.
`;

const example1 = `
# Generating and Saving an Image

This example demonstrates how to call the OpenAI Image Generation API, intercept the base64 response, and decode it into a viewable PNG file.

\`\`\`python
import os
import base64
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 1. Define a strict metaprompt to enforce brand safety
meta_prompt = """
You are a designer creating educational images for children.
The image MUST be safe for work and appropriate for a classroom.
Do not include any violent, scary, or adult themes.
"""

user_request = "A friendly dinosaur teaching mathematics."
final_prompt = f"{meta_prompt}\\n\\nRequest: {user_request}"

# 2. Call the generation API
print("Generating image...")
result = client.images.generate(
    model="dall-e-3", # or gpt-image
    prompt=final_prompt,
    size="1024x1024",
    n=1,
)

# 3. Decode the Base64 string to raw bytes
image_bytes = base64.b64decode(result.data[0].b64_json)

# 4. Save to disk
os.makedirs("images", exist_ok=True)
image_path = "images/dino-math.png"

with open(image_path, "wb") as f:
    f.write(image_bytes)

print(f"Success! Image saved to {image_path}")
\`\`\`
`;

const example2 = `
# Generating Text Embeddings

This example shows how to convert a standard text string into an embedding vector, the first step in building a Semantic Search engine.

\`\`\`python
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

text_to_embed = "Generative AI is transforming the way we build software."

# Call the Embeddings API
response = client.embeddings.create(
    input=text_to_embed,
    model="text-embedding-ada-002"
)

# The result is a list of 1536 floating-point numbers
vector = response.data[0].embedding

print(f"Generated a vector with {len(vector)} dimensions.")
print(f"First 5 values: {vector[:5]}")

# Output:
# Generated a vector with 1536 dimensions.
# First 5 values: [-0.0066558, 0.0026128, 0.0087925, -0.024460, -0.008540]
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
      <CourseHero dayNumber={9} title="Advanced Modalities" description="Chat, Semantic Search, Image Generation & Low Code AI" />
      
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
            <VideoEmbed src={activeVideo.src} />
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
                title="Power Platform Workflows" 
                description="Use Copilot Studio and Power Automate to build a low-code assignment tracker and an AI-driven invoice processing flow." 
                skills={["Low Code", "Copilot", "AI Builder"]} 
              />
            </div>
            <MarkdownViewer content={projectDetails} />
          </div>

          <div id="examples" className="scroll-mt-24 mb-16 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Generating Images</h2>
              <MarkdownViewer content={example1} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Generating Embeddings</h2>
              <MarkdownViewer content={example2} />
            </div>
          </div>

          <PremiumWarning />
          <GitHubSubmit dayNumber={9} />
        </div>
      </div>
    </div>
  );
}
