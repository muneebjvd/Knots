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
  "Parse Text with Context-Free Grammars",
  "Build n-gram Language Models",
  "Implement Naive Bayes Text Classifier",
  "Understand Word Embeddings (word2vec)",
  "Understand Attention Mechanisms",
  "Understand the Transformer Architecture",
  "Build a Sentiment Classifier with NLTK/sklearn",
  "Build a Bigram Text Generator",
];

const tocItems = [
  { id: "objectives", title: "Objectives" },
  { id: "video", title: "Course Video" },
  { id: "notes", title: "Implementation Notes" },
  { id: "formal-grammars", title: "↳ Formal Grammars" },
  { id: "n-grams", title: "↳ n-grams" },
  { id: "naive-bayes", title: "↳ Naive Bayes NLP" },
  { id: "word-representation", title: "↳ Word Representation" },
  { id: "attention", title: "↳ Attention" },
  { id: "transformers", title: "↳ Transformers" },
  { id: "projects", title: "Projects" },
  { id: "submit", title: "Submit" },
];

const implementationNotes = `
# Day 7 — CS50 AI: Natural Language Processing — Code-First Notes

---

## Formal Grammars

A **Context-Free Grammar (CFG)** defines the syntactic structure of a language using production rules.

\`\`\`python
import nltk
from nltk import CFG, ChartParser

# Define grammar rules
grammar = CFG.fromstring("""
    S  -> NP VP
    NP -> Det N | Det N PP | "she"
    VP -> V NP | V NP PP
    PP -> P NP
    Det -> "the" | "a"
    N  -> "dog" | "cat" | "telescope" | "park"
    V  -> "saw" | "walked"
    P  -> "in" | "with"
""")

parser = ChartParser(grammar)

sentence = "she saw a dog with a telescope".split()
for tree in parser.parse(sentence):
    tree.pretty_print()    # shows parse tree

# Why multiple trees? Structural ambiguity:
# "she saw [a dog] [with a telescope]"  (dog has telescope)
# "she saw [a dog with a telescope]"    (she used telescope)
\`\`\`

---

## n-grams & Language Models

An **n-gram** is a sequence of n consecutive words. A language model assigns probabilities to sequences.

\`\`\`python
from collections import defaultdict, Counter
import math

def build_ngram_model(corpus, n):
    """
    corpus = list of sentences (each sentence = list of tokens)
    Returns: dict mapping (n-1)-gram context → Counter of next words
    """
    model = defaultdict(Counter)

    for sentence in corpus:
        # Add start/end tokens
        tokens = ["<s>"] * (n-1) + sentence + ["</s>"]
        for i in range(len(tokens) - n + 1):
            context = tuple(tokens[i : i+n-1])
            next_word = tokens[i+n-1]
            model[context][next_word] += 1

    return model

def probability(model, context, word, vocab_size, alpha=1):
    """Laplace-smoothed probability P(word | context)."""
    context = tuple(context)
    total  = sum(model[context].values()) + alpha * vocab_size
    count  = model[context].get(word, 0) + alpha
    return count / total

def perplexity(model, test_corpus, n, vocab_size):
    """Lower perplexity = better model."""
    log_prob = 0
    total_words = 0
    for sentence in test_corpus:
        tokens = ["<s>"] * (n-1) + sentence + ["</s>"]
        for i in range(n-1, len(tokens)):
            context = tuple(tokens[i-(n-1):i])
            word = tokens[i]
            log_prob += math.log(probability(model, context, word, vocab_size))
            total_words += 1
    return math.exp(-log_prob / total_words)

def generate_text(model, n, max_words=50):
    """Sample text from the n-gram model."""
    import random
    context = ["<s>"] * (n-1)
    result  = []
    for _ in range(max_words):
        ctx = tuple(context[-(n-1):])
        if ctx not in model:
            break
        next_word = random.choices(
            list(model[ctx].keys()),
            weights=list(model[ctx].values()),
        )[0]
        if next_word == "</s>":
            break
        result.append(next_word)
        context.append(next_word)
    return " ".join(result)

# Example
corpus = [
    ["the", "dog", "barked"],
    ["the", "cat", "sat"],
    ["the", "dog", "sat"],
]
bigram_model = build_ngram_model(corpus, n=2)
print(generate_text(bigram_model, n=2))
\`\`\`

---

## Naive Bayes for Text

\`\`\`python
import math
from collections import defaultdict, Counter

class TextNaiveBayes:
    def __init__(self, smoothing=1):
        self.smoothing = smoothing
        self.class_log_prior = {}
        self.feature_log_prob = {}
        self.vocab = set()

    def fit(self, X, y):
        """X = list of strings, y = list of labels."""
        class_counts  = Counter(y)
        total_docs    = len(y)
        word_counts   = defaultdict(Counter)

        for text, label in zip(X, y):
            for word in text.lower().split():
                word_counts[label][word] += 1
                self.vocab.add(word)

        for cls, count in class_counts.items():
            self.class_log_prior[cls] = math.log(count / total_docs)

        V = len(self.vocab)
        for cls in class_counts:
            total = sum(word_counts[cls].values())
            self.feature_log_prob[cls] = {}
            for word in self.vocab:
                self.feature_log_prob[cls][word] = math.log(
                    (word_counts[cls].get(word, 0) + self.smoothing) /
                    (total + self.smoothing * V)
                )

    def predict(self, X):
        results = []
        for text in X:
            words = text.lower().split()
            scores = {}
            for cls in self.class_log_prior:
                score = self.class_log_prior[cls]
                for word in words:
                    if word in self.feature_log_prob[cls]:
                        score += self.feature_log_prob[cls][word]
                scores[cls] = score
            results.append(max(scores, key=scores.get))
        return results

clf = TextNaiveBayes()
clf.fit(
    ["buy cheap meds now", "free money win", "meeting at 3pm", "project deadline today"],
    ["spam", "spam", "ham", "ham"]
)
print(clf.predict(["cheap free win", "meeting project"]))   # → ['spam', 'ham']
\`\`\`

---

## Word Representation

### Bag of Words
\`\`\`python
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer

docs = ["the dog barked", "the cat sat", "the dog sat quietly"]

# Bag of words (count)
cv = CountVectorizer()
X = cv.fit_transform(docs)
print(cv.get_feature_names_out())
print(X.toarray())

# TF-IDF (weights rare words higher)
tfidf = TfidfVectorizer()
X_tfidf = tfidf.fit_transform(docs)
\`\`\`

### Word2Vec (conceptual)
\`\`\`python
from gensim.models import Word2Vec

sentences = [["the","dog","barked"],["the","cat","sat"],["dogs","and","cats","are","pets"]]
model = Word2Vec(sentences, vector_size=50, window=3, min_count=1, epochs=100)

# Similar words
print(model.wv.most_similar("dog", topn=3))

# Word arithmetic: king - man + woman ≈ queen
result = model.wv.most_similar(positive=["king","woman"], negative=["man"])
print(result[0])
\`\`\`

---

## Attention Mechanism

Attention lets the model focus on the most relevant parts of the input when producing each output token.

\`\`\`python
import numpy as np

def scaled_dot_product_attention(Q, K, V):
    """
    Q: queries  (seq_q, d_k)
    K: keys     (seq_k, d_k)
    V: values   (seq_k, d_v)
    Returns: context vectors (seq_q, d_v)
    """
    d_k = Q.shape[-1]
    # Dot product between queries and keys
    scores = Q @ K.T / np.sqrt(d_k)        # (seq_q, seq_k)
    # Softmax to get attention weights
    scores = scores - scores.max(axis=-1, keepdims=True)   # numerical stability
    weights = np.exp(scores) / np.exp(scores).sum(axis=-1, keepdims=True)
    # Weighted sum of values
    return weights @ V                       # (seq_q, d_v)

# Example
seq_len, d_k, d_v = 4, 8, 8
Q = np.random.randn(seq_len, d_k)
K = np.random.randn(seq_len, d_k)
V = np.random.randn(seq_len, d_v)
context = scaled_dot_product_attention(Q, K, V)
print("Context shape:", context.shape)   # (4, 8)
\`\`\`

---

## Transformers

\`\`\`python
import tensorflow as tf
from tensorflow import keras

# Simplified Transformer encoder block
class MultiHeadAttention(keras.layers.Layer):
    def __init__(self, d_model, num_heads):
        super().__init__()
        self.num_heads = num_heads
        self.d_model   = d_model
        assert d_model % num_heads == 0
        self.d_k = d_model // num_heads
        self.wq  = keras.layers.Dense(d_model)
        self.wk  = keras.layers.Dense(d_model)
        self.wv  = keras.layers.Dense(d_model)
        self.out = keras.layers.Dense(d_model)

    def split_heads(self, x, batch):
        x = tf.reshape(x, (batch, -1, self.num_heads, self.d_k))
        return tf.transpose(x, [0, 2, 1, 3])

    def call(self, x):
        batch = tf.shape(x)[0]
        Q = self.split_heads(self.wq(x), batch)
        K = self.split_heads(self.wk(x), batch)
        V = self.split_heads(self.wv(x), batch)
        scale  = tf.math.sqrt(tf.cast(self.d_k, tf.float32))
        scores = tf.matmul(Q, K, transpose_b=True) / scale
        weights = tf.nn.softmax(scores, axis=-1)
        ctx  = tf.matmul(weights, V)
        ctx  = tf.transpose(ctx, [0, 2, 1, 3])
        ctx  = tf.reshape(ctx, (batch, -1, self.d_model))
        return self.out(ctx)

# Full sentiment classifier with transformer encoder
def build_transformer_classifier(vocab_size, maxlen, d_model=64, num_heads=4, num_classes=2):
    inputs = keras.Input(shape=(maxlen,))
    x = keras.layers.Embedding(vocab_size, d_model)(inputs)
    x = MultiHeadAttention(d_model, num_heads)(x)
    x = keras.layers.LayerNormalization()(x)
    x = keras.layers.GlobalAveragePooling1D()(x)
    x = keras.layers.Dense(64, activation="relu")(x)
    x = keras.layers.Dropout(0.3)(x)
    outputs = keras.layers.Dense(num_classes, activation="softmax")(x)
    return keras.Model(inputs, outputs)
\`\`\`
`;

const projectDetails = `
## Part 2 — Mini Project: NLP Systems

\`\`\`plaintext
day7_project/
├── sentiment.py       # Sentiment classifier on IMDB reviews
├── generator.py       # Bigram / trigram text generator
└── parser.py          # Context-free grammar sentence parser
\`\`\`

---

### Part A — \`parser.py\` (CFG Parser)

Write a CFG and parse sentences from it:

\`\`\`python
import nltk
from nltk import CFG, ChartParser

# TODO: define a grammar with at least 10 production rules
# covering: S, NP, VP, PP, Det, N, V, Adj, Adv
grammar = CFG.fromstring("""
    S -> ...
    NP -> ...
    # add all your rules here
""")

sentences = [
    "the dog barked at the cat",
    "she walked in the park with a friend",
]

# TODO: for each sentence, print all parse trees
# TODO: count how many parses exist (ambiguity check)
\`\`\`

---

### Part B — \`generator.py\` (n-gram Text Generator)

Build a bigram and trigram language model:

\`\`\`python
# TODO: load a text corpus (Project Gutenberg, Wikipedia, etc.)
# TODO: tokenize into sentences and words
# TODO: build bigram_model and trigram_model using build_ngram_model()
# TODO: generate 5 random sentences from each model
# TODO: compute perplexity on a held-out test set
# TODO: compare — does trigram produce more coherent text? Why?
\`\`\`

---

### Part C — \`sentiment.py\` (Sentiment Classifier)

Build a sentiment classifier on the IMDB movie reviews dataset:

\`\`\`python
from sklearn.datasets import load_files
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

# TODO: load IMDB dataset (positive/negative reviews)
# TODO: preprocess: lowercase, remove punctuation, remove stopwords
# TODO: vectorize with TF-IDF (max_features=10000)
# TODO: train Logistic Regression classifier
# TODO: evaluate — target: >88% accuracy
# TODO: print top 20 most positive and most negative words by coefficient
\`\`\`
`;

const example1 = `
## Example 1 — Bigram Text Generator from Scratch

A complete bigram language model trained on a small corpus, then used to generate new sentences.

\`\`\`python
import random, math
from collections import defaultdict, Counter

corpus = """
to be or not to be that is the question
whether tis nobler in the mind to suffer
the slings and arrows of outrageous fortune
or to take arms against a sea of troubles
""".strip().split("\\n")

corpus_tokens = [line.split() for line in corpus]

# Build bigram model
model = defaultdict(Counter)
for sentence in corpus_tokens:
    tokens = ["<s>"] + sentence + ["</s>"]
    for i in range(len(tokens) - 1):
        model[tokens[i]][tokens[i+1]] += 1

def sample_next(context):
    options = model[context]
    if not options: return "</s>"
    words   = list(options.keys())
    weights = list(options.values())
    return random.choices(words, weights=weights)[0]

def generate(max_len=20):
    sentence = []
    current = "<s>"
    for _ in range(max_len):
        next_word = sample_next(current)
        if next_word == "</s>": break
        sentence.append(next_word)
        current = next_word
    return " ".join(sentence)

def log_probability(sentence_tokens):
    """Log probability of a sentence under the bigram model."""
    tokens = ["<s>"] + sentence_tokens + ["</s>"]
    vocab_size = len(set(w for s in corpus_tokens for w in s)) + 2
    log_p = 0
    for i in range(len(tokens)-1):
        ctx, nxt = tokens[i], tokens[i+1]
        total = sum(model[ctx].values()) + vocab_size
        count = model[ctx].get(nxt, 0) + 1   # Laplace smoothing
        log_p += math.log(count / total)
    return log_p

for _ in range(5):
    sent = generate()
    print(f"{sent}  [log_p={log_probability(sent.split()):.2f}]")
\`\`\`
`;

const example2 = `
## Example 2 — TF-IDF Similarity Search

Find the most similar documents to a query using cosine similarity on TF-IDF vectors.

\`\`\`python
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

documents = [
    "the quick brown fox jumps over the lazy dog",
    "a fast red fox leaps over a tired dog",
    "machine learning is a subset of artificial intelligence",
    "deep learning uses neural networks with many layers",
    "natural language processing is used in chatbots and translation",
    "the dog and the fox were friends in the forest",
]

# Build TF-IDF matrix
vectorizer = TfidfVectorizer(stop_words="english")
tfidf_matrix = vectorizer.fit_transform(documents)

def search(query, top_k=3):
    query_vec = vectorizer.transform([query])
    similarities = cosine_similarity(query_vec, tfidf_matrix).flatten()
    top_indices  = similarities.argsort()[::-1][:top_k]
    print(f"Query: '{query}'")
    for i, idx in enumerate(top_indices):
        print(f"  {i+1}. [{similarities[idx]:.3f}] {documents[idx]}")
    print()

search("fox jumping over dog")
search("artificial intelligence and neural nets")
search("language understanding and chatbots")

# Output analysis:
# TF-IDF gives high weight to rare words (like "neural", "chatbot").
# Common words (like "the", "is") are down-weighted.
# Cosine similarity measures angle between document vectors — ignores document length.
\`\`\`

**When to use each:**

| Method | Strength | Weakness |
|--------|---------|---------|
| Bag of Words | Simple, fast | Ignores word order and rarity |
| TF-IDF | Weights rare words | Still ignores semantics |
| Word2Vec | Captures meaning | Needs large corpus |
| Transformers | Full semantic understanding | Computationally expensive |
`;

export default function Day7Page() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes"|"project"|"example1"|"example2">("notes");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const unlocked = sessionStorage.getItem("aief_unlocked_day7");
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
            <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:4, background:"#DFFF00", color:"#000" }}>DAY 7</span>
          </div>
        </div>
      </nav>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px", display:"flex", gap:64, alignItems:"flex-start" }}>
        <StickyTOC items={tocItems} />
        <main style={{ flex:1, minWidth:0, paddingBottom:120 }}>
          <CourseHero day={7} totalDays={15} title="Welcome to Day 7" subtitle="The final day of Week 1. Today you tackle Natural Language Processing — building systems that understand and generate human language, culminating in the Transformer architecture that powers ChatGPT and every modern LLM." duration="≈2-3 Hours" course="Harvard CS50 AI" focus="Natural Language Processing" difficulty="Advanced" />
          <div style={{ marginTop:80 }}><Checklist items={objectives} /></div>
          <div id="video" style={{ marginTop:100, scrollMarginTop:72 }}>
            <VideoEmbed embedSrc="https://www.youtube-nocookie.com/embed/QAZc9xsQNjQ?si=uss6fWDAj0ErCE1S" title="CS50 AI — Natural Language Processing" />
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
            <h2 style={{ fontSize:20, fontWeight:700, color:"#fff", letterSpacing:"-0.02em", marginBottom:6 }}>Day 7 Project</h2>
            <p style={{ fontSize:13.5, color:"#52525b", marginBottom:28 }}>Build three NLP systems from scratch.</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:16 }}>
              <ProjectCard title="Sentiment Classifier" description="Build an IMDB review sentiment classifier using TF-IDF and Logistic Regression. Extract and visualize the most predictive words for positive and negative sentiment." skills={["TF-IDF","Logistic Regression","Text Preprocessing","Stopwords","F1-Score"]} />
              <ProjectCard title="Text Generator" description="Build bigram and trigram language models from a real corpus. Generate new text and measure model quality using perplexity on a held-out test set." skills={["n-grams","Language Model","Perplexity","Laplace Smoothing","Text Generation"]} />
            </div>
          </div>
          <div style={{ marginTop:80 }}>
            <PremiumWarning title="Week 1 Complete — Well Done">
              <p>You have built real AI systems in Search, Logic, Probability, Optimization, Machine Learning, Neural Networks, and Natural Language Processing.</p>
              <p>Do <strong>NOT</strong> use AI to write today&apos;s project. The NLP pipeline (tokenize → vectorize → train → evaluate) is the foundation of every production ML system.</p>
              <p style={{ fontWeight:600, color:"#f0f0f0", marginTop:8 }}>Week 2 will go deeper. Come prepared.</p>
            </PremiumWarning>
          </div>
          <div id="submit" style={{ marginTop:80, scrollMarginTop:72 }}>
            <GitHubSubmit format="DAY7_{ROLLNUM}" example="DAY7_KAIEF2601" />
          </div>
          <div style={{ marginTop:100, paddingTop:80, borderTop:"1px solid rgba(255,255,255,0.05)", textAlign:"center" }}>
            <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
              <h2 style={{ fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:700, color:"#fff", letterSpacing:"-0.04em", marginBottom:16 }}>Week 1 Complete.</h2>
              <p style={{ fontSize:16, color:"#52525b", maxWidth:500, margin:"0 auto 48px", lineHeight:1.75 }}>Seven days. Seven domains. One foundation. You now understand how AI actually works — not just how to use it. Week 2 begins soon.</p>
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
