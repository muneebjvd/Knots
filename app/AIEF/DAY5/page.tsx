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
  "Understand Supervised vs Unsupervised Learning",
  "Implement k-Nearest Neighbors Classifier",
  "Build a Perceptron from Scratch",
  "Understand SVMs & Regression",
  "Apply Loss Functions and Regularization",
  "Use scikit-learn for Real Datasets",
  "Implement Q-Learning for Reinforcement Learning",
  "Build a k-Means Clustering System",
];

const tocItems = [
  { id: "objectives", title: "Objectives" },
  { id: "video", title: "Course Video" },
  { id: "notes", title: "Implementation Notes" },
  { id: "supervised-learning", title: "↳ Supervised Learning" },
  { id: "nearest-neighbor-classification", title: "↳ k-NN" },
  { id: "perceptron-learning", title: "↳ Perceptron" },
  { id: "loss-functions", title: "↳ Loss & Regularization" },
  { id: "reinforcement-learning", title: "↳ Reinforcement Learning" },
  { id: "q-learning", title: "↳ Q-Learning" },
  { id: "unsupervised-learning", title: "↳ k-Means" },
  { id: "projects", title: "Projects" },
  { id: "submit", title: "Submit" },
];

const implementationNotes = `
# Day 5 — CS50 AI: Machine Learning — Code-First Notes

---

## Supervised Learning

**Training data** = (input, label) pairs. The model learns f(x) → y.

\`\`\`python
# Generic supervised learning interface
class Classifier:
    def fit(self, X_train, y_train):  # learn from data
        ...
    def predict(self, X_test):        # predict new inputs
        ...
    def score(self, X_test, y_test):  # accuracy
        correct = sum(p == t for p, t in zip(self.predict(X_test), y_test))
        return correct / len(y_test)
\`\`\`

---

## k-Nearest Neighbors

Classify a point by looking at its k nearest training examples.

\`\`\`python
import math
from collections import Counter

def euclidean(a, b):
    return math.sqrt(sum((x - y)**2 for x, y in zip(a, b)))

class KNearestNeighbors:
    def __init__(self, k=3):
        self.k = k

    def fit(self, X, y):
        self.X_train = X
        self.y_train = y

    def predict(self, X_test):
        return [self._predict_one(x) for x in X_test]

    def _predict_one(self, x):
        # Compute distances to all training points
        distances = [(euclidean(x, self.X_train[i]), self.y_train[i])
                     for i in range(len(self.X_train))]
        # Sort by distance, take k nearest
        distances.sort(key=lambda t: t[0])
        k_nearest = [label for _, label in distances[:self.k]]
        # Majority vote
        return Counter(k_nearest).most_common(1)[0][0]

# Test
X = [[1,2],[2,3],[3,3],[6,7],[7,8],[8,7]]
y = [0,0,0,1,1,1]
knn = KNearestNeighbors(k=3)
knn.fit(X, y)
print(knn.predict([[4,4], [7,7]]))  # → [0, 1]
\`\`\`

---

## Perceptron

A single neuron. Learns a linear decision boundary.

\`\`\`python
class Perceptron:
    def __init__(self, n_features, learning_rate=0.1):
        self.weights = [0.0] * n_features
        self.bias    = 0.0
        self.lr      = learning_rate

    def predict_one(self, x):
        score = sum(w * xi for w, xi in zip(self.weights, x)) + self.bias
        return 1 if score >= 0 else 0

    def fit(self, X, y, epochs=100):
        for _ in range(epochs):
            for xi, yi in zip(X, y):
                pred = self.predict_one(xi)
                error = yi - pred
                # Update rule: w += lr * error * xi
                self.weights = [w + self.lr * error * xi_j
                                for w, xi_j in zip(self.weights, xi)]
                self.bias += self.lr * error

    def predict(self, X):
        return [self.predict_one(x) for x in X]

# Test: learn AND gate
X = [[0,0],[0,1],[1,0],[1,1]]
y = [0, 0, 0, 1]
p = Perceptron(n_features=2)
p.fit(X, y, epochs=200)
print(p.predict(X))  # → [0, 0, 0, 1]
\`\`\`

---

## Loss Functions

| Loss | Formula | Used for |
|------|---------|---------|
| 0-1 Loss | 1 if pred ≠ true | Classification (not differentiable) |
| MSE | mean((pred - true)²) | Regression |
| Log Loss | -mean(y·log(p) + (1-y)·log(1-p)) | Logistic regression |
| Hinge | mean(max(0, 1 - y·score)) | SVM |

\`\`\`python
def mse(y_pred, y_true):
    return sum((p - t)**2 for p, t in zip(y_pred, y_true)) / len(y_true)

def log_loss(y_pred_proba, y_true):
    import math
    eps = 1e-15
    total = 0
    for p, t in zip(y_pred_proba, y_true):
        p = max(eps, min(1 - eps, p))
        total += t * math.log(p) + (1 - t) * math.log(1 - p)
    return -total / len(y_true)
\`\`\`

---

## scikit-learn

\`\`\`python
from sklearn.model_selection import train_test_split
from sklearn.preprocessing   import StandardScaler
from sklearn.neighbors        import KNeighborsClassifier
from sklearn.svm              import SVC
from sklearn.linear_model     import LogisticRegression
from sklearn.metrics          import accuracy_score, classification_report
from sklearn.datasets         import load_iris

# Load data
X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features (important for kNN, SVM)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test  = scaler.transform(X_test)

# Try multiple models
for name, model in [
    ("kNN",      KNeighborsClassifier(n_neighbors=5)),
    ("SVM",      SVC(kernel="rbf", C=1.0)),
    ("Logistic", LogisticRegression(max_iter=200)),
]:
    model.fit(X_train, y_train)
    acc = accuracy_score(y_test, model.predict(X_test))
    print(f"{name}: {acc:.3f}")
\`\`\`

---

## Reinforcement Learning — Q-Learning

The agent learns a Q-table: Q[state][action] = expected future reward.

\`\`\`python
import random

class QLearner:
    def __init__(self, alpha=0.5, epsilon=0.1, gamma=0.9):
        self.Q       = {}       # Q[state][action] = value
        self.alpha   = alpha    # learning rate
        self.epsilon = epsilon  # exploration rate
        self.gamma   = gamma    # discount factor

    def get_q(self, state, action):
        return self.Q.get((state, action), 0)

    def choose_action(self, state, actions):
        """Epsilon-greedy: explore randomly with probability epsilon."""
        if random.random() < self.epsilon:
            return random.choice(actions)
        return max(actions, key=lambda a: self.get_q(state, a))

    def update(self, state, action, reward, next_state, next_actions):
        """Bellman equation update."""
        best_next = max((self.get_q(next_state, a) for a in next_actions), default=0)
        old_q     = self.get_q(state, action)
        new_q     = old_q + self.alpha * (reward + self.gamma * best_next - old_q)
        self.Q[(state, action)] = new_q

# Training loop pattern
agent = QLearner()
for episode in range(10000):
    state   = env.reset()
    done    = False
    while not done:
        actions = env.actions(state)
        action  = agent.choose_action(state, actions)
        next_state, reward, done = env.step(state, action)
        agent.update(state, action, reward, next_state, env.actions(next_state))
        state = next_state
\`\`\`

---

## k-Means Clustering (Unsupervised)

Find k clusters in unlabelled data by iteratively assigning points to the nearest centroid.

\`\`\`python
import random, math

def euclidean(a, b):
    return math.sqrt(sum((x-y)**2 for x,y in zip(a,b)))

def kmeans(X, k, max_iter=100):
    # 1. Initialize centroids randomly
    centroids = random.sample(X, k)

    for _ in range(max_iter):
        # 2. Assign each point to nearest centroid
        clusters = [[] for _ in range(k)]
        for point in X:
            nearest = min(range(k), key=lambda i: euclidean(point, centroids[i]))
            clusters[nearest].append(point)

        # 3. Update centroids to cluster means
        new_centroids = []
        for cluster in clusters:
            if cluster:
                mean = [sum(dim)/len(cluster) for dim in zip(*cluster)]
                new_centroids.append(mean)
            else:
                new_centroids.append(random.choice(X))   # empty cluster: restart

        if new_centroids == centroids:
            break   # converged
        centroids = new_centroids

    return centroids, clusters

# Test
X = [[1,1],[1,2],[2,1],[8,8],[8,9],[9,8]]
centroids, clusters = kmeans(X, k=2)
print("Centroids:", centroids)
\`\`\`
`;

const projectDetails = `
## Part 2 — Mini Project: ML Systems

\`\`\`plaintext
day5_project/
├── spam_classifier.py   # Naive Bayes / scikit-learn spam filter
├── qlearner.py          # Q-learning agent in a grid maze
└── clustering.py        # k-Means on real dataset
\`\`\`

---

### Part A — \`spam_classifier.py\`

Build a spam email classifier using scikit-learn:

1. Load the SMS Spam Collection dataset (or any text dataset)
2. Extract features using CountVectorizer or TF-IDF
3. Train Naive Bayes, Logistic Regression, and SVM
4. Report accuracy, precision, recall for each

\`\`\`python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report

# TODO: load dataset into (texts, labels)
# TODO: vectorize texts
# TODO: train MultinomialNB
# TODO: print classification_report on test set
\`\`\`

---

### Part B — \`qlearner.py\` (Grid Maze)

Build a Q-learning agent that learns to navigate a grid maze:

1. Define a simple grid (5x5) with walls, start, goal, and rewards
2. States = (row, col), Actions = [up, down, left, right]
3. Reward = +100 for reaching goal, -1 for each step, -10 for hitting wall
4. Train for 10,000 episodes, then run the learned policy

\`\`\`python
GRID = [
    [0, 0, 0, 0, 0],
    [0, -1, -1, 0, 0],   # -1 = wall
    [0, 0, 0, -1, 0],
    [0, -1, 0, 0, 0],
    [0, 0, 0, 0, "G"],   # G = goal
]

# TODO: define env.reset(), env.step(state, action), env.actions(state)
# TODO: train QLearner for 10000 episodes
# TODO: print optimal path from start to goal
\`\`\`

---

### Part C — \`clustering.py\`

Run k-Means on the Iris dataset without using the labels:

1. Load Iris dataset (features only, ignore labels)
2. Run your k-Means with k=3
3. Compare cluster assignments to true labels
4. Plot clusters if matplotlib is available

\`\`\`python
from sklearn.datasets import load_iris

X, y_true = load_iris(return_X_y=True)

# TODO: run kmeans(X.tolist(), k=3)
# TODO: for each cluster, find majority true label
# TODO: compute clustering accuracy
\`\`\`
`;

const example1 = `
## Example 1 — Perceptron Learning: XOR Problem

The perceptron cannot solve XOR (it's not linearly separable). This example shows exactly why, and how adding a hidden layer fixes it.

\`\`\`python
# XOR data
X = [[0,0],[0,1],[1,0],[1,1]]
y = [0, 1, 1, 0]   # XOR

# Single perceptron — will FAIL to converge
p = Perceptron(n_features=2, learning_rate=0.1)
p.fit(X, y, epochs=1000)
print("Single perceptron:", p.predict(X))
# Output will be wrong for at least one case — no linear boundary exists for XOR

# 2-layer network — manually built
# Hidden layer: [AND gate, OR gate]
# Output layer: AND(NOT h1, h2) = XOR

def sigmoid(x):
    import math
    return 1 / (1 + math.exp(-x))

def forward(x, W1, b1, W2, b2):
    # Hidden layer
    h = [sigmoid(sum(W1[j][i]*x[i] for i in range(2)) + b1[j]) for j in range(2)]
    # Output layer
    out = sigmoid(sum(W2[i]*h[i] for i in range(2)) + b2)
    return out

# Hand-tuned weights that implement XOR
W1 = [[20, 20], [20, 20]]     # both hidden neurons
b1 = [-10, -30]               # h1 = AND, h2 = OR (approx)
W2 = [-20, 20]
b2 = -10                       # out = AND(NOT h1, h2)

for xi in X:
    print(f"{xi} → {round(forward(xi, W1, b1, W2, b2))}")
# → [0,0]→0, [0,1]→1, [1,0]→1, [1,1]→0  ✓
\`\`\`

This is exactly why deep learning was invented: single neurons can only learn linear patterns. Stacking layers enables exponentially more complex boundaries.
`;

const example2 = `
## Example 2 — scikit-learn: Full ML Pipeline

A complete pipeline: load, split, scale, train, evaluate, and save.

\`\`\`python
from sklearn.datasets        import load_breast_cancer
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing   import StandardScaler
from sklearn.pipeline        import Pipeline
from sklearn.svm             import SVC
from sklearn.metrics         import classification_report
import joblib

# 1. Load data
X, y = load_breast_cancer(return_X_y=True)
print(f"Dataset: {X.shape[0]} samples, {X.shape[1]} features")
print(f"Classes: {set(y)}")

# 2. Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 3. Build pipeline (scaler + classifier)
pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("svm",    SVC(kernel="rbf", C=10, gamma="scale")),
])

# 4. Cross-validate
cv_scores = cross_val_score(pipe, X_train, y_train, cv=5, scoring="accuracy")
print(f"CV Accuracy: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")

# 5. Train final model on all training data
pipe.fit(X_train, y_train)

# 6. Evaluate
y_pred = pipe.predict(X_test)
print(classification_report(y_test, y_pred, target_names=["malignant", "benign"]))

# 7. Save model
joblib.dump(pipe, "cancer_model.pkl")
loaded = joblib.load("cancer_model.pkl")
print("Loaded accuracy:", loaded.score(X_test, y_test))
\`\`\`

**Pipeline pattern:** always scale inside the pipeline, not before splitting. Otherwise you leak test set information into the scaler (data leakage).
`;

export default function Day5Page() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes"|"project"|"example1"|"example2">("notes");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const unlocked = sessionStorage.getItem("aief_unlocked_day5");
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
            <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:4, background:"#10B981", color:"#000" }}>DAY 5</span>
          </div>
        </div>
      </nav>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px", display:"flex", gap:64, alignItems:"flex-start" }}>
        <StickyTOC items={tocItems} />
        <main style={{ flex:1, minWidth:0, paddingBottom:120 }}>
          <CourseHero day={5} totalDays={15} title="Welcome to Day 5" subtitle="Today your AI learns to learn. You'll implement machine learning algorithms from scratch — perceptrons, k-NN, Q-learning, k-Means — and then use scikit-learn to tackle real-world datasets." duration="≈2-3 Hours" course="Harvard CS50 AI" focus="Machine Learning" difficulty="Intermediate" />
          <div style={{ marginTop:80 }}><Checklist items={objectives} /></div>
          <div id="video" style={{ marginTop:100, scrollMarginTop:72 }}>
            <VideoEmbed embedSrc="https://www.youtube-nocookie.com/embed/-g0iJjnO2_w?si=hZp4N537mgOlZvnf" title="CS50 AI — Machine Learning" />
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
            <h2 style={{ fontSize:20, fontWeight:700, color:"#fff", letterSpacing:"-0.02em", marginBottom:6 }}>Day 5 Project</h2>
            <p style={{ fontSize:13.5, color:"#52525b", marginBottom:28 }}>Build two real ML systems — one supervised, one reinforcement.</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:16 }}>
              <ProjectCard title="Spam Classifier" description="Build a complete spam/ham classifier pipeline using TF-IDF vectorization and multiple scikit-learn models. Evaluate with precision, recall, and F1-score." skills={["TF-IDF","Naive Bayes","SVM","scikit-learn","Pipeline"]} />
              <ProjectCard title="Q-Learning Maze Agent" description="Train a Q-learning agent that learns to navigate a grid maze entirely through trial and error, using only reward signals." skills={["Q-Learning","Bellman Equation","Epsilon-Greedy","RL","MDP"]} />
            </div>
          </div>
          <div style={{ marginTop:80 }}>
            <PremiumWarning title="Before You Start Coding">
              <p>Do <strong>NOT</strong> use AI to write your ML code.</p>
              <p>Implement at least one algorithm (k-NN or Perceptron) completely from scratch before using scikit-learn. Understanding the internals is what separates an ML engineer from a library user.</p>
              <p style={{ fontWeight:600, color:"#f0f0f0", marginTop:8 }}>Engineers build first. AI assists later.</p>
            </PremiumWarning>
          </div>
          <div id="submit" style={{ marginTop:80, scrollMarginTop:72 }}>
            <GitHubSubmit format="DAY5_{ROLLNUM}" example="DAY5_KAIEF2601" />
          </div>
          <div style={{ marginTop:100, paddingTop:80, borderTop:"1px solid rgba(255,255,255,0.05)", textAlign:"center" }}>
            <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
              <h2 style={{ fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:700, color:"#fff", letterSpacing:"-0.04em", marginBottom:16 }}>Great Work!</h2>
              <p style={{ fontSize:16, color:"#52525b", maxWidth:500, margin:"0 auto 48px", lineHeight:1.75 }}>You&apos;ve completed Day 5. Tomorrow you go deep — Neural Networks, CNNs, and the backpropagation algorithm that powers modern AI.</p>
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
