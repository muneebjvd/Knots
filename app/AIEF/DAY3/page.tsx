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
  "Understand Probability & Uncertainty",
  "Apply Conditional Probability & Bayes' Rule",
  "Represent Knowledge with Bayesian Networks",
  "Implement Likelihood Weighting Sampling",
  "Build Markov Chain Models",
  "Decode Hidden Markov Models with Viterbi",
  "Build a Weather Predictor AI",
];

const tocItems = [
  { id: "objectives", title: "Objectives" },
  { id: "video", title: "Course Video" },
  { id: "notes", title: "Implementation Notes" },
  { id: "probability", title: "↳ Probability" },
  { id: "conditional-probability", title: "↳ Conditional Prob" },
  { id: "bayes-rule", title: "↳ Bayes' Rule" },
  { id: "bayesian-networks", title: "↳ Bayesian Networks" },
  { id: "sampling", title: "↳ Sampling" },
  { id: "markov-models", title: "↳ Markov Models" },
  { id: "hidden-markov-models", title: "↳ Hidden Markov" },
  { id: "projects", title: "Projects" },
  { id: "submit", title: "Submit" },
];

const implementationNotes = `
# Day 3 — CS50 AI: Uncertainty — Code-First Notes

Theory is in the lecture. This is the Python implementation reference.

---

## Probability

A **probability distribution** maps every possible value of a random variable to a probability. All probabilities must sum to 1.

\`\`\`python
# Discrete distribution — explicit dictionary
weather = {"sun": 0.6, "cloud": 0.3, "rain": 0.1}
assert abs(sum(weather.values()) - 1.0) < 1e-9

# Sample from it
import random
def sample(dist):
    r = random.random()
    cumulative = 0
    for value, prob in dist.items():
        cumulative += prob
        if r <= cumulative:
            return value
\`\`\`

---

## Conditional Probability

P(A | B) = P(A ∩ B) / P(B)  — probability of A given B is observed.

\`\`\`python
# Joint probability table for two binary variables
# P(Rain, Wind)
joint = {
    ("rain",    "wind"):   0.08,
    ("rain",    "nowind"): 0.02,
    ("norain",  "wind"):   0.32,
    ("norain",  "nowind"): 0.58,
}

def marginal(variable, value, joint_table):
    """Sum out all other variables."""
    return sum(p for (k, v), p in joint_table.items()
               if (variable == "rain" and k == value) or
                  (variable == "wind" and v == value))

def conditional(a_var, a_val, b_var, b_val, joint_table):
    """P(a_var=a_val | b_var=b_val)"""
    joint_prob = joint_table.get((a_val, b_val), joint_table.get((b_val, a_val), 0))
    b_prob = marginal(b_var, b_val, joint_table)
    return joint_prob / b_prob

print(conditional("rain", "rain", "wind", "wind", joint))  # P(Rain | Wind)
\`\`\`

---

## Bayes' Rule

**P(A | B) = P(B | A) × P(A) / P(B)**

- P(A) = prior probability  
- P(B | A) = likelihood  
- P(A | B) = posterior probability

\`\`\`python
def bayes(prior_A, likelihood_B_given_A, likelihood_B_given_notA):
    """
    Returns P(A | B) using Bayes' Rule.
    prior_A = P(A)
    """
    p_B = likelihood_B_given_A * prior_A + likelihood_B_given_notA * (1 - prior_A)
    posterior = (likelihood_B_given_A * prior_A) / p_B
    return posterior

# Example: medical test
# P(Disease) = 0.01, P(Positive | Disease) = 0.99, P(Positive | No Disease) = 0.05
print(bayes(0.01, 0.99, 0.05))  # → ~0.166 (only 16.6% even with positive test!)
\`\`\`

---

## Bayesian Networks

A **Bayesian Network** is a DAG where each node is a random variable and each edge represents a conditional dependency.

\`\`\`python
# Simple Bayesian Network: Rain → Sprinkler → GrassWet ← Rain
# Represented as conditional probability tables (CPTs)

CPT_Rain = {"rain": 0.2, "norain": 0.8}

CPT_Sprinkler = {
    "rain":   {"sprinkler": 0.01, "nosprinkler": 0.99},
    "norain": {"sprinkler": 0.40, "nosprinkler": 0.60},
}

CPT_GrassWet = {
    ("rain",   "sprinkler"):   {"wet": 0.99, "dry": 0.01},
    ("rain",   "nosprinkler"): {"wet": 0.80, "dry": 0.20},
    ("norain", "sprinkler"):   {"wet": 0.90, "dry": 0.10},
    ("norain", "nosprinkler"): {"wet": 0.00, "dry": 1.00},
}

def joint_probability(rain, sprinkler, grass):
    p_rain = CPT_Rain[rain]
    p_spr  = CPT_Sprinkler[rain][sprinkler]
    p_gr   = CPT_GrassWet[(rain, sprinkler)][grass]
    return p_rain * p_spr * p_gr

# P(GrassWet=wet) by enumeration
p_wet = sum(
    joint_probability(r, s, "wet")
    for r in ["rain", "norain"]
    for s in ["sprinkler", "nosprinkler"]
)
print(f"P(Grass wet) = {p_wet:.4f}")
\`\`\`

---

## Sampling

Exact inference is O(2^n). **Sampling** approximates it in O(samples).

### Likelihood Weighting

\`\`\`python
def likelihood_weighting(query_var, evidence, network, n_samples=10000):
    """
    Approximate P(query_var | evidence) using likelihood weighting.
    evidence = dict of {variable: observed_value}
    """
    counts = {}
    total_weight = 0

    for _ in range(n_samples):
        sample = {}
        weight = 1.0

        for node in network.topological_order():
            if node.name in evidence:
                # Fix the evidence variable, multiply its probability into weight
                sample[node.name] = evidence[node.name]
                weight *= node.probability(evidence[node.name], sample)
            else:
                # Sample freely from this node's distribution
                sample[node.name] = node.sample(sample)

        val = sample[query_var]
        counts[val] = counts.get(val, 0) + weight
        total_weight += weight

    # Normalize
    return {k: v / total_weight for k, v in counts.items()}
\`\`\`

---

## Markov Models

In a **Markov Model**, the future state depends only on the current state (Markov property).

\`\`\`python
# Transition matrix: T[current][next] = probability
transitions = {
    "sun":  {"sun": 0.8, "rain": 0.2},
    "rain": {"sun": 0.3, "rain": 0.7},
}

def predict_next(current_state, transition_matrix):
    """Sample the next state given the current one."""
    dist = transition_matrix[current_state]
    return sample(dist)

def simulate(start, steps, T):
    state = start
    history = [state]
    for _ in range(steps):
        state = predict_next(state, T)
        history.append(state)
    return history

print(simulate("sun", 10, transitions))

def steady_state(T, iterations=1000):
    """Approximate the long-run distribution by power iteration."""
    # Start with uniform
    states = list(T.keys())
    dist = {s: 1/len(states) for s in states}
    for _ in range(iterations):
        new_dist = {s: 0 for s in states}
        for s in states:
            for t in states:
                new_dist[t] += dist[s] * T[s][t]
        dist = new_dist
    return dist
\`\`\`

---

## Hidden Markov Models

In an **HMM**, we observe emissions but the true state is hidden.

\`\`\`python
# HMM: hidden states = weather, observations = umbrella/no umbrella
transition = {
    "sun":  {"sun": 0.8, "rain": 0.2},
    "rain": {"sun": 0.3, "rain": 0.7},
}

emission = {
    "sun":  {"umbrella": 0.2, "no_umbrella": 0.8},
    "rain": {"umbrella": 0.9, "no_umbrella": 0.1},
}

initial = {"sun": 0.5, "rain": 0.5}

def viterbi(observations, states, initial, transition, emission):
    """
    Find the most likely hidden state sequence for given observations.
    Returns: list of most likely states.
    """
    # dp[t][s] = max probability of being in state s at time t
    dp   = [{}]
    back = [{}]  # backpointers for path reconstruction

    # Initialize
    for s in states:
        dp[0][s]   = initial[s] * emission[s][observations[0]]
        back[0][s] = None

    # Recurse
    for t in range(1, len(observations)):
        dp.append({})
        back.append({})
        for s in states:
            best_prob, best_prev = max(
                (dp[t-1][prev] * transition[prev][s] * emission[s][observations[t]], prev)
                for prev in states
            )
            dp[t][s]   = best_prob
            back[t][s] = best_prev

    # Backtrack
    path = []
    last_state = max(states, key=lambda s: dp[-1][s])
    path.append(last_state)
    for t in range(len(observations) - 1, 0, -1):
        last_state = back[t][last_state]
        path.append(last_state)
    path.reverse()
    return path

# Example
obs = ["umbrella", "umbrella", "no_umbrella", "umbrella"]
states = ["sun", "rain"]
print(viterbi(obs, states, initial, transition, emission))
# → ['rain', 'rain', 'sun', 'rain']
\`\`\`
`;

const projectDetails = `
## Part 2 — Mini Project: Probabilistic AI Systems

\`\`\`plaintext
day3_project/
├── weather.py        # Markov chain weather simulator
├── bayesian.py       # Bayesian network inference
└── hmm.py            # Hidden Markov Model decoder
\`\`\`

---

### Part A — \`weather.py\` (Markov Chain)

Build a weather simulation system:

1. Define transition probabilities between: \`sunny\`, \`cloudy\`, \`rainy\`
2. Implement \`simulate(start_state, days)\` — simulate N days of weather
3. Implement \`steady_state(T)\` — find long-run probabilities
4. Run 1000-day simulation and compare empirical frequencies to steady state

\`\`\`python
transitions = {
    "sunny":  {"sunny": ..., "cloudy": ..., "rainy": ...},
    "cloudy": {...},
    "rainy":  {...},
}

def simulate(start, days):
    # TODO: simulate weather for N days
    ...

def steady_state(T):
    # TODO: power iteration to find stationary distribution
    ...
\`\`\`

---

### Part B — \`bayesian.py\` (Bayesian Network)

Build the Rain → Sprinkler → GrassWet network:

1. Define all three CPTs as Python dicts
2. Implement \`joint_probability(rain, sprinkler, grass)\`
3. Implement \`query(target_var, evidence)\` using enumeration
4. Answer: P(Rain=rain | GrassWet=wet) = ?

\`\`\`python
def joint_probability(rain, sprinkler, grass):
    # TODO: multiply the three CPT entries
    ...

def query(target_var, evidence):
    # TODO: sum over all hidden variables, normalize
    ...
\`\`\`

---

### Part C — \`hmm.py\` (Hidden Markov Model)

Implement the Viterbi algorithm from scratch:

1. Define transition and emission matrices
2. Implement \`viterbi(observations)\` returning the most likely hidden state sequence
3. Test with: \`["umbrella", "umbrella", "no_umbrella", "umbrella"]\`

\`\`\`python
def viterbi(observations):
    # TODO: implement dynamic programming HMM decoder
    # Step 1: initialize dp table
    # Step 2: fill forward
    # Step 3: backtrack for best path
    ...
\`\`\`
`;

const example1 = `
## Example 1 — Naive Bayes Spam Filter

Using Bayes' Rule to classify emails as spam or not spam based on word frequencies.

\`\`\`python
import math
from collections import defaultdict

class NaiveBayes:
    def __init__(self):
        self.class_counts = defaultdict(int)
        self.word_counts  = defaultdict(lambda: defaultdict(int))
        self.vocab        = set()

    def train(self, documents):
        """
        documents = list of (text, label) pairs
        label = "spam" or "ham"
        """
        for text, label in documents:
            self.class_counts[label] += 1
            for word in text.split():
                self.word_counts[label][word] += 1
                self.vocab.add(word)

    def predict(self, text):
        """Return the most likely class for the given text."""
        total_docs = sum(self.class_counts.values())
        best_class, best_score = None, float("-inf")

        for cls, count in self.class_counts.items():
            # Log prior: log P(class)
            score = math.log(count / total_docs)

            # Log likelihood: log P(word | class) for each word
            total_words = sum(self.word_counts[cls].values()) + len(self.vocab)
            for word in text.split():
                # Laplace smoothing: +1 to avoid log(0)
                word_count = self.word_counts[cls][word] + 1
                score += math.log(word_count / total_words)

            if score > best_score:
                best_score = score
                best_class = cls

        return best_class

# Test
clf = NaiveBayes()
clf.train([
    ("buy cheap pills now", "spam"),
    ("win free money now",  "spam"),
    ("meeting at 3pm tomorrow", "ham"),
    ("please review the document", "ham"),
])
print(clf.predict("free money pills"))    # → spam
print(clf.predict("review the meeting"))  # → ham
\`\`\`
`;

const example2 = `
## Example 2 — Bayesian Network: Fire Alarm

Classic BN problem: Fire causes smoke and alarm. Tampering also causes alarm. Does the alarm mean fire?

\`\`\`python
# P(Tampering)
P_T = {"T": 0.02, "F": 0.98}

# P(Fire)
P_F = {"T": 0.01, "F": 0.99}

# P(Alarm | Tampering, Fire)
P_A = {
    ("T","T"): {"T": 0.50, "F": 0.50},
    ("T","F"): {"T": 0.85, "F": 0.15},
    ("F","T"): {"T": 0.99, "F": 0.01},
    ("F","F"): {"T": 0.00, "F": 1.00},
}

# P(Smoke | Fire)
P_S = {
    "T": {"T": 0.90, "F": 0.10},
    "F": {"T": 0.01, "F": 0.99},
}

def joint(t, f, a, s):
    return P_T[t] * P_F[f] * P_A[(t,f)][a] * P_S[f][s]

def query_fire_given_alarm():
    """P(Fire=T | Alarm=T) — exact inference by enumeration."""
    numerator   = sum(joint(t, "T", "T", s) for t in ["T","F"] for s in ["T","F"])
    denominator = sum(joint(t, f,   "T", s) for t in ["T","F"] for f in ["T","F"] for s in ["T","F"])
    return numerator / denominator

def query_fire_given_alarm_and_smoke():
    """P(Fire=T | Alarm=T, Smoke=T)"""
    numerator   = sum(joint(t, "T", "T", "T") for t in ["T","F"])
    denominator = sum(joint(t, f,   "T", "T") for t in ["T","F"] for f in ["T","F"])
    return numerator / denominator

print(f"P(Fire | Alarm)              = {query_fire_given_alarm():.4f}")
print(f"P(Fire | Alarm, Smoke)       = {query_fire_given_alarm_and_smoke():.4f}")
# Seeing smoke drastically increases the probability that it's a real fire!
\`\`\`
`;

export default function Day3Page() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes"|"project"|"example1"|"example2">("notes");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const unlocked = sessionStorage.getItem("aief_unlocked_day3");
    if (unlocked !== "1") { router.push("/AIEF"); } else { setIsAuthorized(true); }
  }, [router]);

  if (!isAuthorized) return <div style={{ minHeight: "100vh", backgroundColor: "#090909" }} />;

  const tabs = [
    { key: "notes" as const, label: "NOTES" },
    { key: "project" as const, label: "PROJECT" },
    { key: "example1" as const, label: "EXAMPLE 1" },
    { key: "example2" as const, label: "EXAMPLE 2" },
  ];
  const content = { notes: implementationNotes, project: projectDetails, example1, example2 };

  return (
    <div style={{ minHeight: "100vh", background: "#090909", color: "#f0f0f0", fontFamily: "'Inter', -apple-system, sans-serif", WebkitFontSmoothing: "antialiased" }}>
      <motion.div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: "#10B981", transformOrigin: "left", scaleX, zIndex: 100 }} />
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(9,9,9,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/AIEF" style={{ display: "flex", alignItems: "center", gap: 8, color: "#71717a", textDecoration: "none", fontSize: 13, fontWeight: 500, transition: "color 0.15s" }} onMouseEnter={e => e.currentTarget.style.color="#f0f0f0"} onMouseLeave={e => e.currentTarget.style.color="#71717a"}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Curriculum
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "#3f3f46", fontFamily: "monospace", letterSpacing: "0.06em" }}>AI Engineering Foundations</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: "#10B981", color: "#000", letterSpacing: "0.04em" }}>DAY 3</span>
          </div>
        </div>
      </nav>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", gap: 64, alignItems: "flex-start" }}>
        <StickyTOC items={tocItems} />
        <main style={{ flex: 1, minWidth: 0, paddingBottom: 120 }}>
          <CourseHero day={3} totalDays={15} title="Welcome to Day 3" subtitle="Today you teach your AI to reason under uncertainty. You'll implement Bayesian Networks, Markov Chains, and Hidden Markov Models — the probabilistic foundations of every modern AI system." duration="≈2-3 Hours" course="Harvard CS50 AI" focus="Uncertainty" difficulty="Intermediate" />
          <div style={{ marginTop: 80 }}><Checklist items={objectives} /></div>
          <div id="video" style={{ marginTop: 100, scrollMarginTop: 72 }}>
            <VideoEmbed embedSrc="https://www.youtube-nocookie.com/embed/D8RRq3TbtHU?si=VukTosuTPwcqphFz" title="CS50 AI — Uncertainty & Probability" />
          </div>
          <div id="notes" style={{ marginTop: 80, scrollMarginTop: 72 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 6 }}>Practical Implementation Notes</h2>
            <p style={{ fontSize: 13.5, color: "#52525b", marginBottom: 28 }}>No theory. Just how to build it.</p>
            <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#0c0c0c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 4, width: "fit-content" }}>
              {tabs.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "monospace", letterSpacing: "0.08em", transition: "all 0.15s ease", background: activeTab === tab.key ? "#10B981" : "transparent", color: activeTab === tab.key ? "#000" : "#52525b" }}>{tab.label}</button>
              ))}
            </div>
            <div style={{ background: "#0c0c0c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "36px 40px" }}>
              <MarkdownViewer content={content[activeTab]} />
            </div>
          </div>
          <div id="projects" style={{ marginTop: 100, scrollMarginTop: 72 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 6 }}>Day 3 Project</h2>
            <p style={{ fontSize: 13.5, color: "#52525b", marginBottom: 28 }}>Build two probabilistic AI systems from scratch.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              <ProjectCard title="Weather Predictor" description="Build a Markov Chain weather simulator that predicts future weather states and finds the long-run steady-state distribution." skills={["Markov Chains", "Transition Matrix", "Steady State", "Simulation"]} />
              <ProjectCard title="Bayesian Alarm Network" description="Build the classic Fire-Alarm-Smoke Bayesian network and compute posterior probabilities using exact enumeration inference." skills={["Bayesian Network", "CPT", "Joint Probability", "Enumeration"]} />
            </div>
          </div>
          <div style={{ marginTop: 80 }}>
            <PremiumWarning title="Before You Start Coding">
              <p>Do <strong>NOT</strong> use AI to generate today&apos;s code.</p>
              <p>Probability is tricky. The bugs are subtle and easy to miss. That struggle is where the learning happens.</p>
              <p style={{ fontWeight: 600, color: "#f0f0f0", marginTop: 8 }}>Engineers build first. AI assists later.</p>
            </PremiumWarning>
          </div>
          <div id="submit" style={{ marginTop: 80, scrollMarginTop: 72 }}>
            <GitHubSubmit format="DAY3_{ROLLNUM}" example="DAY3_KAIEF2601" />
          </div>
          <div style={{ marginTop: 100, paddingTop: 80, borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h2 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 700, color: "#fff", letterSpacing: "-0.04em", marginBottom: 16 }}>Great Work!</h2>
              <p style={{ fontSize: 16, color: "#52525b", maxWidth: 500, margin: "0 auto 48px", lineHeight: 1.75 }}>You&apos;ve completed Day 3. Tomorrow you&apos;ll tackle Optimization — teaching your AI to find the best solution from millions of possibilities.</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 28, fontFamily: "monospace", fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                <span style={{ color: "#f0f0f0" }}>Learn.</span><span style={{ color: "#10B981", fontWeight: 700 }}>Build.</span><span style={{ color: "#f0f0f0" }}>Prove.</span>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
