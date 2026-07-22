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
  "Understand Activation Functions & Why They Matter",
  "Implement Gradient Descent from Scratch",
  "Build Backpropagation by Hand",
  "Prevent Overfitting with Dropout & Regularization",
  "Build Neural Networks with TensorFlow/Keras",
  "Apply Image Convolution Filters",
  "Build a CNN for Image Classification",
  "Understand Recurrent Neural Networks (RNNs)",
];

const tocItems = [
  { id: "objectives", title: "Objectives" },
  { id: "video", title: "Course Video" },
  { id: "notes", title: "Implementation Notes" },
  { id: "activation-functions", title: "↳ Activation Functions" },
  { id: "gradient-descent", title: "↳ Gradient Descent" },
  { id: "backpropagation", title: "↳ Backpropagation" },
  { id: "overfitting", title: "↳ Overfitting & Dropout" },
  { id: "tensorflow", title: "↳ TensorFlow / Keras" },
  { id: "image-convolution", title: "↳ Image Convolution" },
  { id: "convolutional-neural-networks", title: "↳ CNNs" },
  { id: "recurrent-neural-networks", title: "↳ RNNs" },
  { id: "projects", title: "Projects" },
  { id: "submit", title: "Submit" },
];

const implementationNotes = `
# Day 6 — CS50 AI: Neural Networks — Code-First Notes

---

## Activation Functions

Without activation functions, a neural network is just a linear model no matter how many layers you add.

\`\`\`python
import math

def sigmoid(x):   return 1 / (1 + math.exp(-x))
def tanh(x):      return math.tanh(x)
def relu(x):      return max(0, x)
def leaky_relu(x, alpha=0.01): return x if x > 0 else alpha * x

# Derivatives (needed for backpropagation)
def sigmoid_deriv(x): s = sigmoid(x); return s * (1 - s)
def tanh_deriv(x):    return 1 - math.tanh(x)**2
def relu_deriv(x):    return 1 if x > 0 else 0

# For vectors / numpy
import numpy as np
def softmax(z):
    e = np.exp(z - np.max(z))   # subtract max for numerical stability
    return e / e.sum()
\`\`\`

| Function | Output range | Saturation | Best for |
|----------|-------------|------------|---------|
| Sigmoid | (0, 1) | Yes (vanishes) | Output for binary classification |
| Tanh | (-1, 1) | Yes | Hidden layers (zero-centered) |
| ReLU | [0, ∞) | No (for positive) | Hidden layers (default choice) |
| Softmax | (0,1) sums to 1 | — | Output for multi-class |

---

## Gradient Descent

Minimize loss by moving weights in the direction of the negative gradient.

\`\`\`python
import numpy as np

def gradient_descent(X, y, learning_rate=0.01, epochs=1000):
    n, d = X.shape
    W = np.zeros(d)    # weights
    b = 0              # bias

    for epoch in range(epochs):
        # Forward pass — linear model + sigmoid
        z    = X @ W + b
        pred = 1 / (1 + np.exp(-z))

        # Loss: binary cross-entropy
        loss = -np.mean(y * np.log(pred + 1e-9) + (1-y) * np.log(1-pred + 1e-9))

        # Backward pass — compute gradients
        error = pred - y
        dW    = (X.T @ error) / n
        db    = error.mean()

        # Update weights
        W -= learning_rate * dW
        b -= learning_rate * db

        if epoch % 100 == 0:
            print(f"Epoch {epoch}: loss={loss:.4f}")

    return W, b

# Variants
# Batch GD:     update once per epoch (above)
# Stochastic:   update once per sample (shuffle + loop)
# Mini-batch:   update once per batch of B samples (most common in practice)
\`\`\`

---

## Backpropagation

Chain rule applied layer by layer, from output back to input.

\`\`\`python
import numpy as np

class TwoLayerNet:
    def __init__(self, input_size, hidden_size, output_size, lr=0.01):
        # Xavier initialization
        self.W1 = np.random.randn(input_size, hidden_size) * np.sqrt(2/input_size)
        self.b1 = np.zeros(hidden_size)
        self.W2 = np.random.randn(hidden_size, output_size) * np.sqrt(2/hidden_size)
        self.b2 = np.zeros(output_size)
        self.lr = lr

    def forward(self, X):
        self.z1 = X @ self.W1 + self.b1
        self.a1 = np.maximum(0, self.z1)          # ReLU
        self.z2 = self.a1 @ self.W2 + self.b2
        self.a2 = 1 / (1 + np.exp(-self.z2))     # Sigmoid output
        return self.a2

    def backward(self, X, y):
        n = X.shape[0]
        # Output layer gradient
        dz2 = self.a2 - y.reshape(-1, 1)          # d_loss/d_z2
        dW2 = self.a1.T @ dz2 / n
        db2 = dz2.mean(axis=0)

        # Hidden layer gradient (chain rule through ReLU)
        da1 = dz2 @ self.W2.T
        dz1 = da1 * (self.z1 > 0)                 # ReLU derivative
        dW1 = X.T @ dz1 / n
        db1 = dz1.mean(axis=0)

        # Update
        self.W2 -= self.lr * dW2
        self.b2 -= self.lr * db2
        self.W1 -= self.lr * dW1
        self.b1 -= self.lr * db1

    def train(self, X, y, epochs=1000):
        for _ in range(epochs):
            self.forward(X)
            self.backward(X, y)
\`\`\`

---

## Overfitting & Dropout

\`\`\`python
# Dropout: randomly zero out neurons during training
def dropout(a, rate=0.5, training=True):
    if not training: return a
    mask = (np.random.rand(*a.shape) > rate) / (1 - rate)
    return a * mask

# L2 Regularization: add weight penalty to loss
def l2_loss(W_list, lambda_=0.001):
    return lambda_ * sum(np.sum(W**2) for W in W_list)

# Early stopping pattern
best_val_loss = float("inf")
patience = 10
no_improve = 0
for epoch in range(max_epochs):
    train_loss = ...
    val_loss   = ...
    if val_loss < best_val_loss:
        best_val_loss = val_loss
        no_improve = 0
        save_model()
    else:
        no_improve += 1
        if no_improve >= patience:
            break   # stop training
\`\`\`

---

## TensorFlow / Keras

\`\`\`python
import tensorflow as tf
from tensorflow import keras

# Build model
model = keras.Sequential([
    keras.layers.Dense(128, activation="relu", input_shape=(784,)),
    keras.layers.Dropout(0.3),
    keras.layers.Dense(64,  activation="relu"),
    keras.layers.Dropout(0.3),
    keras.layers.Dense(10,  activation="softmax"),
])

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.001),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)

# Train
history = model.fit(
    X_train, y_train,
    validation_split=0.1,
    epochs=20,
    batch_size=32,
    callbacks=[
        keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True),
        keras.callbacks.ModelCheckpoint("best_model.h5", save_best_only=True),
    ],
)

# Evaluate
test_loss, test_acc = model.evaluate(X_test, y_test)
print(f"Test accuracy: {test_acc:.3f}")
\`\`\`

---

## Image Convolution

\`\`\`python
import numpy as np

def convolve2d(image, kernel):
    """Apply a 2D convolution filter to a grayscale image."""
    ih, iw = image.shape
    kh, kw = kernel.shape
    pad_h, pad_w = kh // 2, kw // 2

    # Pad image with zeros
    padded = np.pad(image, ((pad_h, pad_h), (pad_w, pad_w)), mode="constant")
    output = np.zeros_like(image, dtype=float)

    for i in range(ih):
        for j in range(iw):
            region = padded[i:i+kh, j:j+kw]
            output[i, j] = np.sum(region * kernel)

    return output

# Common kernels
EDGE_DETECT = np.array([[-1,-1,-1],[-1,8,-1],[-1,-1,-1]])
SHARPEN     = np.array([[0,-1,0],[-1,5,-1],[0,-1,0]])
BLUR        = np.ones((3,3)) / 9

import cv2
image = cv2.imread("photo.jpg", cv2.IMREAD_GRAYSCALE)
edges = convolve2d(image, EDGE_DETECT)
\`\`\`

---

## Convolutional Neural Networks (CNN)

\`\`\`python
import tensorflow as tf
from tensorflow import keras

def build_cnn(input_shape, num_classes):
    model = keras.Sequential([
        # Convolutional block 1
        keras.layers.Conv2D(32, (3,3), activation="relu", padding="same", input_shape=input_shape),
        keras.layers.MaxPooling2D((2,2)),

        # Convolutional block 2
        keras.layers.Conv2D(64, (3,3), activation="relu", padding="same"),
        keras.layers.MaxPooling2D((2,2)),

        # Convolutional block 3
        keras.layers.Conv2D(128, (3,3), activation="relu", padding="same"),
        keras.layers.MaxPooling2D((2,2)),

        # Classifier head
        keras.layers.Flatten(),
        keras.layers.Dense(512, activation="relu"),
        keras.layers.Dropout(0.5),
        keras.layers.Dense(num_classes, activation="softmax"),
    ])
    return model

# MNIST example
(X_train, y_train), (X_test, y_test) = keras.datasets.mnist.load_data()
X_train = X_train[..., np.newaxis] / 255.0
X_test  = X_test[..., np.newaxis] / 255.0

model = build_cnn((28, 28, 1), 10)
model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
model.fit(X_train, y_train, epochs=5, validation_split=0.1, batch_size=64)
\`\`\`

---

## Recurrent Neural Networks (RNN)

\`\`\`python
import numpy as np

class SimpleRNN:
    """Manual one-step RNN cell."""
    def __init__(self, input_size, hidden_size):
        self.Wx  = np.random.randn(input_size,  hidden_size) * 0.01
        self.Wh  = np.random.randn(hidden_size, hidden_size) * 0.01
        self.b   = np.zeros(hidden_size)

    def step(self, x_t, h_prev):
        """x_t: (input_size,), h_prev: (hidden_size,) → h_t: (hidden_size,)"""
        return np.tanh(x_t @ self.Wx + h_prev @ self.Wh + self.b)

    def forward(self, sequence):
        """sequence: list of (input_size,) vectors"""
        h = np.zeros(self.Wh.shape[0])
        for x_t in sequence:
            h = self.step(x_t, h)
        return h   # final hidden state = sequence encoding

# In Keras — LSTM (better than vanilla RNN for long sequences)
model = keras.Sequential([
    keras.layers.Embedding(vocab_size, 64),
    keras.layers.LSTM(128, return_sequences=True),
    keras.layers.LSTM(64),
    keras.layers.Dense(num_classes, activation="softmax"),
])
\`\`\`
`;

const projectDetails = `
## Part 2 — Mini Project: Neural Networks

\`\`\`plaintext
day6_project/
├── mnist_classifier.py    # MNIST digit classifier with Keras
├── traffic_cnn.py         # Traffic sign CNN classifier
└── backprop_scratch.py    # Manual backpropagation (no frameworks)
\`\`\`

---

### Part A — \`backprop_scratch.py\`

Implement a full 2-layer neural network with backpropagation — no NumPy autograd, no Keras:

\`\`\`python
# Architecture: input → hidden (ReLU) → output (Sigmoid)
class TwoLayerNet:
    def __init__(self, input_size, hidden_size, output_size, lr=0.01):
        # TODO: initialize W1, b1, W2, b2 with Xavier initialization
        ...

    def forward(self, X):
        # TODO: compute z1, a1 (ReLU), z2, a2 (Sigmoid)
        ...

    def backward(self, X, y):
        # TODO: compute gradients using chain rule
        # TODO: update all weights and biases
        ...

# Test: solve XOR
X = np.array([[0,0],[0,1],[1,0],[1,1]], dtype=float)
y = np.array([0, 1, 1, 0], dtype=float)
net = TwoLayerNet(2, 4, 1)
net.train(X, y, epochs=5000)
print(net.forward(X).round())  # Should output [[0],[1],[1],[0]]
\`\`\`

---

### Part B — \`mnist_classifier.py\`

Build a fully-connected network to classify MNIST handwritten digits:

\`\`\`python
import tensorflow as tf
from tensorflow import keras

# TODO: load and normalize MNIST data
# TODO: build Sequential model with Dense layers
# TODO: compile with adam optimizer and sparse_categorical_crossentropy
# TODO: train for 10 epochs with validation split
# TODO: evaluate on test set (target: >97% accuracy)
# TODO: visualize 5 misclassified examples
\`\`\`

---

### Part C — \`traffic_cnn.py\`

Build a CNN classifier for traffic signs (use GTSRB dataset or CIFAR-10 as substitute):

\`\`\`python
# TODO: load image dataset (resize all images to 30x30x3)
# TODO: build CNN with at least 2 Conv2D + MaxPooling blocks
# TODO: add Dropout to prevent overfitting
# TODO: train and achieve at least 90% test accuracy
# TODO: save model with model.save("traffic_model")
\`\`\`

**Target architecture:**
- Conv2D(32) → MaxPool → Conv2D(64) → MaxPool → Flatten → Dense(128) → Dropout(0.5) → Dense(num_classes)
`;

const example1 = `
## Example 1 — Image Filter with NumPy (no OpenCV)

Apply edge detection and blur to a grayscale image using only NumPy convolution.

\`\`\`python
import numpy as np
from PIL import Image

# Load image as numpy array
img = np.array(Image.open("photo.jpg").convert("L"), dtype=float)
print("Image shape:", img.shape)   # (height, width)

def apply_filter(image, kernel):
    kh, kw   = kernel.shape
    pad_h, pad_w = kh//2, kw//2
    padded = np.pad(image, ((pad_h,pad_h),(pad_w,pad_w)))
    out = np.zeros_like(image)
    for i in range(image.shape[0]):
        for j in range(image.shape[1]):
            out[i,j] = np.clip((padded[i:i+kh, j:j+kw] * kernel).sum(), 0, 255)
    return out.astype(np.uint8)

kernels = {
    "blur":         np.ones((5,5))/25,
    "edge_x":       np.array([[-1,0,1],[-2,0,2],[-1,0,1]]),   # Sobel X
    "edge_y":       np.array([[-1,-2,-1],[0,0,0],[1,2,1]]),    # Sobel Y
    "sharpen":      np.array([[0,-1,0],[-1,5,-1],[0,-1,0]]),
}

for name, kernel in kernels.items():
    result = apply_filter(img, kernel)
    Image.fromarray(result).save(f"output_{name}.png")
    print(f"Saved output_{name}.png")

# Edge magnitude (combine X and Y)
ex = apply_filter(img, kernels["edge_x"]).astype(float)
ey = apply_filter(img, kernels["edge_y"]).astype(float)
magnitude = np.clip(np.sqrt(ex**2 + ey**2), 0, 255).astype(np.uint8)
Image.fromarray(magnitude).save("edges.png")
\`\`\`
`;

const example2 = `
## Example 2 — Transfer Learning with Keras

Use a pretrained MobileNetV2 (trained on ImageNet) as a feature extractor for a custom task.

\`\`\`python
import tensorflow as tf
from tensorflow import keras

def build_transfer_model(num_classes, img_size=224):
    # 1. Load pretrained base (frozen weights)
    base = keras.applications.MobileNetV2(
        input_shape=(img_size, img_size, 3),
        include_top=False,       # remove the ImageNet classifier head
        weights="imagenet",
    )
    base.trainable = False       # freeze pretrained layers

    # 2. Add custom classification head
    model = keras.Sequential([
        base,
        keras.layers.GlobalAveragePooling2D(),
        keras.layers.Dense(256, activation="relu"),
        keras.layers.Dropout(0.4),
        keras.layers.Dense(num_classes, activation="softmax"),
    ])
    return model

model = build_transfer_model(num_classes=10)
model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])

# Train only the head (very fast — base is frozen)
model.fit(X_train, y_train, epochs=5, validation_split=0.1)

# Fine-tuning: unfreeze the last 20 layers of the base and train with low lr
model.layers[0].trainable = True
for layer in model.layers[0].layers[:-20]:
    layer.trainable = False

model.compile(optimizer=keras.optimizers.Adam(1e-5), loss="sparse_categorical_crossentropy", metrics=["accuracy"])
model.fit(X_train, y_train, epochs=5, validation_split=0.1)

# Why this works:
# Early layers learn generic features (edges, textures) — reuse them.
# Later layers learn task-specific features — fine-tune those.
\`\`\`
`;

export default function Day6Page() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes"|"project"|"example1"|"example2">("notes");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const unlocked = sessionStorage.getItem("aief_unlocked_day6");
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
            <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:4, background:"#10B981", color:"#000" }}>DAY 6</span>
          </div>
        </div>
      </nav>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px", display:"flex", gap:64, alignItems:"flex-start" }}>
        <StickyTOC items={tocItems} />
        <main style={{ flex:1, minWidth:0, paddingBottom:120 }}>
          <CourseHero day={6} totalDays={15} title="Welcome to Day 6" subtitle="Today you go deep. You'll implement backpropagation by hand, build a CNN from scratch in TensorFlow, and understand exactly why deep learning conquered computer vision." duration="≈2-3 Hours" course="Harvard CS50 AI" focus="Neural Networks" difficulty="Advanced" />
          <div style={{ marginTop:80 }}><Checklist items={objectives} /></div>
          <div id="video" style={{ marginTop:100, scrollMarginTop:72 }}>
            <VideoEmbed embedSrc="https://www.youtube-nocookie.com/embed/J1QD9hLDEDY?si=7NnKuCg7rfEL82bW" title="CS50 AI — Neural Networks" />
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
            <h2 style={{ fontSize:20, fontWeight:700, color:"#fff", letterSpacing:"-0.02em", marginBottom:6 }}>Day 6 Project</h2>
            <p style={{ fontSize:13.5, color:"#52525b", marginBottom:28 }}>Build two neural network systems — one from scratch, one with Keras.</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:16 }}>
              <ProjectCard title="MNIST Classifier" description="Build a fully-connected neural network to classify handwritten digits with >97% accuracy using Keras and early stopping." skills={["Keras","Dense Layers","Dropout","Adam","Callbacks"]} />
              <ProjectCard title="Traffic Sign CNN" description="Build a Convolutional Neural Network to classify traffic signs from images. Includes Conv2D, MaxPooling, and Dropout layers." skills={["CNN","Conv2D","MaxPooling","Transfer Learning","Image Preprocessing"]} />
            </div>
          </div>
          <div style={{ marginTop:80 }}>
            <PremiumWarning title="Before You Start Coding">
              <p>Do <strong>NOT</strong> use AI to write your network.</p>
              <p>Part A requires manual backpropagation. If you skip it and go straight to Keras, you will use neural networks forever without understanding why they work. Do Part A first.</p>
              <p style={{ fontWeight:600, color:"#f0f0f0", marginTop:8 }}>Engineers build first. AI assists later.</p>
            </PremiumWarning>
          </div>
          <div id="submit" style={{ marginTop:80, scrollMarginTop:72 }}>
            <GitHubSubmit format="DAY6_{ROLLNUM}" example="DAY6_KAIEF2601" />
          </div>
          <div style={{ marginTop:100, paddingTop:80, borderTop:"1px solid rgba(255,255,255,0.05)", textAlign:"center" }}>
            <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
              <h2 style={{ fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:700, color:"#fff", letterSpacing:"-0.04em", marginBottom:16 }}>Great Work!</h2>
              <p style={{ fontSize:16, color:"#52525b", maxWidth:500, margin:"0 auto 48px", lineHeight:1.75 }}>You&apos;ve completed Day 6. Tomorrow is the final day — Natural Language Processing, Transformers, and the future of AI.</p>
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
