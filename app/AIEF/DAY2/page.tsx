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

// ─────────────────────────────────────────────────────────────────────────────
// Static Data
// ─────────────────────────────────────────────────────────────────────────────

const objectives = [
  "Understand Knowledge Representation",
  "Learn Propositional Logic Syntax and Semantics",
  "Build a Model-Checking Inference Engine",
  "Apply Knowledge Engineering to Real Puzzles",
  "Master Inference Rules (Modus Ponens, Resolution)",
  "Understand First-Order Logic (FOL)",
  "Build a Logic-Powered Clue Solver",
];

const tocItems = [
  { id: "objectives", title: "Objectives" },
  { id: "video", title: "Course Video" },
  { id: "notes", title: "Implementation Notes" },
  { id: "knowledge-representation", title: "↳ Knowledge & Sentences" },
  { id: "propositional-logic", title: "↳ Propositional Logic" },
  { id: "inference-model-checking", title: "↳ Model Checking" },
  { id: "knowledge-engineering", title: "↳ Knowledge Engineering" },
  { id: "inference-rules", title: "↳ Inference Rules" },
  { id: "resolution", title: "↳ Resolution" },
  { id: "first-order-logic", title: "↳ First-Order Logic" },
  { id: "projects", title: "Projects" },
  { id: "submit", title: "Submit" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Implementation Notes
// ─────────────────────────────────────────────────────────────────────────────
const implementationNotes = `
# Day 2 — CS50 AI: Knowledge — Code-First Notes

Theory is covered in lecture. This is the "how to actually write it" reference — Python classes for every logic construct, then every algorithm, then worked examples.

---

## Knowledge Representation

Every AI that reasons needs two things:

- **Sentences** — statements encoded in a formal language
- **A knowledge base (KB)** — the collection of sentences the AI believes to be true

The goal of a knowledge-based agent: derive *new* true sentences from the KB automatically.

\`\`\`python
# The simplest possible KB — just a list of sentences
KB = []

def tell(sentence):
    KB.append(sentence)

def ask(query):
    # does KB entail query?
    ...
\`\`\`

---

## Propositional Logic

### Symbols and connectives

| Symbol | Meaning | Python class |
|--------|---------|-------------|
| \`P\`, \`Q\`, \`Rain\` | Atomic propositions | \`Symbol("Rain")\` |
| \`¬ P\` | NOT | \`Not(P)\` |
| \`P ∧ Q\` | AND | \`And(P, Q)\` |
| \`P ∨ Q\` | OR | \`Or(P, Q)\` |
| \`P → Q\` | Implication | \`Implication(P, Q)\` |
| \`P ↔ Q\` | Biconditional | \`Biconditional(P, Q)\` |

### Implementing the sentence classes

\`\`\`python
class Symbol:
    def __init__(self, name):
        self.name = name

    def evaluate(self, model):
        # model = dict mapping symbol name -> True/False
        return model[self.name]

    def symbols(self):
        return {self.name}

class Not:
    def __init__(self, operand):
        self.operand = operand

    def evaluate(self, model):
        return not self.operand.evaluate(model)

    def symbols(self):
        return self.operand.symbols()

class And:
    def __init__(self, *conjuncts):
        self.conjuncts = list(conjuncts)

    def evaluate(self, model):
        return all(c.evaluate(model) for c in self.conjuncts)

    def symbols(self):
        return set().union(*[c.symbols() for c in self.conjuncts])

class Or:
    def __init__(self, *disjuncts):
        self.disjuncts = list(disjuncts)

    def evaluate(self, model):
        return any(d.evaluate(model) for d in self.disjuncts)

    def symbols(self):
        return set().union(*[d.symbols() for d in self.disjuncts])

class Implication:
    def __init__(self, antecedent, consequent):
        self.antecedent = antecedent
        self.consequent = consequent

    def evaluate(self, model):
        # P → Q  is False ONLY when P=True and Q=False
        return not self.antecedent.evaluate(model) or self.consequent.evaluate(model)

    def symbols(self):
        return self.antecedent.symbols() | self.consequent.symbols()

class Biconditional:
    def __init__(self, left, right):
        self.left = left
        self.right = right

    def evaluate(self, model):
        return self.left.evaluate(model) == self.right.evaluate(model)

    def symbols(self):
        return self.left.symbols() | self.right.symbols()
\`\`\`

---

## Inference — Model Checking

**Entailment** (KB ⊨ α): every model that satisfies KB also satisfies α.

**Model checking algorithm** — enumerate ALL possible truth-value assignments and verify:

\`\`\`python
def model_check(knowledge, query):
    """Return True if knowledge entails query."""
    symbols = list(knowledge.symbols() | query.symbols())
    return check_all(knowledge, query, symbols, {})

def check_all(knowledge, query, symbols, model):
    if not symbols:
        # Base case: all symbols assigned
        if knowledge.evaluate(model):
            # KB is satisfied in this model → query must also be true
            return query.evaluate(model)
        else:
            # KB is false in this model → this model is irrelevant
            return True

    # Recursive case: try both assignments for the next symbol
    remaining = symbols[1:]
    sym = symbols[0]

    # Branch 1: sym = True
    model_true = {**model, sym: True}
    # Branch 2: sym = False
    model_false = {**model, sym: False}

    return (check_all(knowledge, query, remaining, model_true) and
            check_all(knowledge, query, remaining, model_false))
\`\`\`

> Time complexity: O(2^n) — one branch per symbol. Works for small KBs; Resolution is needed for large ones.

---

## Knowledge Engineering

Knowledge engineering = translating real-world rules into formal logic sentences.

### Example: Clue (Murder Mystery)

\`\`\`python
# Symbols for each suspect/weapon/room
mustard = Symbol("ColMustard")
plum    = Symbol("ProfPlum")
scarlet = Symbol("MsScarlet")
knife   = Symbol("knife")
candlestick = Symbol("candlestick")
ballroom    = Symbol("ballroom")
library     = Symbol("library")

knowledge = And(
    # At least one suspect is the murderer
    Or(mustard, plum, scarlet),

    # At most one person per category (if Mustard, not the others, etc.)
    # Shown here for weapons only — same pattern for suspects and rooms
    Or(knife, candlestick),

    # Clue cards in hand tell us what is NOT the answer
    Not(mustard),       # we have Col. Mustard card — he's innocent
    Not(knife),         # we have knife card
    Not(ballroom),      # we have ballroom card
)

# Query: is Plum the murderer?
print(model_check(knowledge, plum))    # → True

# Query: is the library the crime scene?
print(model_check(knowledge, library)) # → True
\`\`\`

### Example: Harry Potter puzzle (from lecture)

\`\`\`python
# Characters
harry  = Symbol("Harry")
hermione = Symbol("Hermione")
ron    = Symbol("Ron")

knowledge = And(
    # At least one of them is in Gryffindor
    Or(harry, hermione, ron),

    # Ron is NOT in Gryffindor
    Not(ron),

    # If Harry is in Gryffindor, then Hermione is too
    Implication(harry, hermione),

    # Hermione is in Gryffindor
    hermione,
)

print(model_check(knowledge, harry))    # → True
print(model_check(knowledge, hermione)) # → True
print(model_check(knowledge, ron))      # → False
\`\`\`

---

## Inference Rules

Model checking is brute force. Inference rules let us derive new sentences without enumerating all models.

| Rule | Pattern | What it does |
|------|---------|-------------|
| Modus Ponens | α → β, α ⊢ β | If implication + antecedent, conclude consequent |
| And Elimination | α ∧ β ⊢ α | Extract any conjunct from an AND |
| Double Negation | ¬(¬α) ⊢ α | Two NOTs cancel |
| Implication Elimination | α → β ⊢ ¬α ∨ β | Convert implication to OR |
| Biconditional Elim | α ↔ β ⊢ (α→β) ∧ (β→α) | Split biconditional |
| De Morgan | ¬(α ∧ β) ⊢ ¬α ∨ ¬β | Push NOT inside AND/OR |
| De Morgan | ¬(α ∨ β) ⊢ ¬α ∧ ¬β | Push NOT inside OR/AND |

### Implementing Modus Ponens in code

\`\`\`python
def apply_modus_ponens(kb):
    """Single pass: add every consequent whose antecedent is already known."""
    new_facts = []
    known = set(str(s) for s in kb if isinstance(s, Symbol))

    for sentence in kb:
        if isinstance(sentence, Implication):
            if str(sentence.antecedent) in known:
                new_facts.append(sentence.consequent)

    return new_facts

def forward_chain(kb):
    """Repeatedly apply rules until nothing new can be derived."""
    changed = True
    while changed:
        new = apply_modus_ponens(kb)
        changed = False
        for fact in new:
            if str(fact) not in [str(s) for s in kb]:
                kb.append(fact)
                changed = True
    return kb
\`\`\`

---

## Resolution

Resolution is a complete inference algorithm. It works on **clauses** (disjunctions of literals).

**Key idea:** from (α ∨ β) and (¬β ∨ γ), resolve to get (α ∨ γ). If both clauses are empty, a contradiction was found.

**Algorithm (proof by contradiction):**
1. Convert KB ∧ ¬query into CNF (Conjunctive Normal Form)
2. Repeatedly apply resolution rule to pairs of clauses
3. If you derive the empty clause → KB ⊨ query ✓

### Converting to CNF — step by step

\`\`\`python
# CNF conversion rules applied in order:
# 1. Eliminate Biconditionals:  α ↔ β  →  (α → β) ∧ (β → α)
# 2. Eliminate Implications:    α → β  →  ¬α ∨ β
# 3. Push NOTs inward (De Morgan):  ¬(α ∧ β)  →  ¬α ∨ ¬β
# 4. Distribute OR over AND:    α ∨ (β ∧ γ)  →  (α ∨ β) ∧ (α ∨ γ)

# A "clause" in CNF is a frozenset of literals
# e.g.  P ∨ ¬Q  →  frozenset({"P", "¬Q"})

def resolve(ci, cj):
    """Return all clauses resolvable from ci and cj, or None if none."""
    resolvents = []
    for literal in ci:
        neg = literal[1:] if literal.startswith("¬") else "¬" + literal
        if neg in cj:
            new_clause = (ci - {literal}) | (cj - {neg})
            resolvents.append(frozenset(new_clause))
    return resolvents

def resolution(kb_clauses, query_clause):
    """
    kb_clauses: list of frozensets (CNF clauses from KB)
    query_clause: frozenset (negation of what we want to prove)
    Returns True if KB entails the original query.
    """
    clauses = set(kb_clauses) | {query_clause}

    while True:
        new = set()
        clause_list = list(clauses)

        for i in range(len(clause_list)):
            for j in range(i + 1, len(clause_list)):
                resolvents = resolve(clause_list[i], clause_list[j])
                if frozenset() in resolvents:
                    return True          # empty clause = contradiction found
                new |= set(resolvents)

        if new.issubset(clauses):
            return False                 # no new clauses = KB does not entail query
        clauses |= new
\`\`\`

---

## First-Order Logic

Propositional logic only handles individual facts. **First-Order Logic (FOL)** adds:

| Concept | Syntax | Example |
|---------|--------|---------|
| Constant | a name | \`Harry\`, \`Hogwarts\` |
| Variable | placeholder | \`x\`, \`y\` |
| Predicate | relation | \`Person(x)\`, \`BelongsTo(x, y)\` |
| Universal quantifier | ∀x | "For all x..." |
| Existential quantifier | ∃x | "There exists an x such that..." |

\`\`\`python
# FOL sentences you might write (pseudo-code representation)

# "Everyone who is a Person is mortal"
# ∀x Person(x) → Mortal(x)
for_all("x", Implication(Person("x"), Mortal("x")))

# "There exists someone who is a Wizard"
# ∃x Wizard(x)
exists("x", Wizard("x"))

# "Harry is a Person and belongs to Gryffindor"
And(Person("Harry"), BelongsTo("Harry", "Gryffindor"))
\`\`\`

### Implementing a simple FOL KB with substitution

\`\`\`python
class Predicate:
    def __init__(self, name, args):
        self.name = name
        self.args = args   # list of constants or variables

    def __repr__(self):
        return f"{self.name}({', '.join(self.args)})"

class ForAll:
    def __init__(self, variable, sentence):
        self.variable = variable
        self.sentence = sentence   # a sentence with variable inside

    def instantiate(self, constant):
        """Replace the variable with a concrete constant."""
        # Walk the sentence tree and substitute
        return substitute(self.sentence, self.variable, constant)

def substitute(sentence, var, const):
    if isinstance(sentence, Predicate):
        new_args = [const if a == var else a for a in sentence.args]
        return Predicate(sentence.name, new_args)
    if isinstance(sentence, And):
        return And(*[substitute(c, var, const) for c in sentence.conjuncts])
    if isinstance(sentence, Implication):
        return Implication(
            substitute(sentence.antecedent, var, const),
            substitute(sentence.consequent, var, const)
        )
    return sentence

# Example: derive facts from universal rule
constants = ["Harry", "Hermione", "Ron"]

knowledge = [
    ForAll("x", Implication(Predicate("Person", ["x"]), Predicate("Mortal", ["x"]))),
    Predicate("Person", ["Harry"]),
    Predicate("Person", ["Hermione"]),
]

# Instantiate ∀x rule with known constants
for const in constants:
    rule = knowledge[0]
    knowledge.append(rule.instantiate(const))

# Forward chain to get: Mortal(Harry), Mortal(Hermione)
\`\`\`
`;

// ─────────────────────────────────────────────────────────────────────────────
// Project Details
// ─────────────────────────────────────────────────────────────────────────────
const projectDetails = `
## Part 2 — Mini Project: Logic Puzzle Solver

\`\`\`plaintext
day2_project/
├── logic.py          # your Symbol, Not, And, Or, Implication, Biconditional classes
├── model_check.py    # your model_check() function
├── clue_solver.py    # Clue murder mystery solver
└── puzzle.py         # knights and knaves puzzles
\`\`\`

### Part A — \`logic.py\`

Implement these classes from scratch. Each must have:
- \`evaluate(model: dict) -> bool\`
- \`symbols() -> set[str]\`
- \`__repr__() -> str\` (for debugging)

**Classes to implement:**

\`\`\`python
class Symbol:    ...
class Not:       ...
class And:       ...
class Or:        ...
class Implication:   ...
class Biconditional: ...
\`\`\`

> Test each with \`model_check(sentence, sentence)\` — should always return True.

---

### Part B — \`model_check.py\`

Implement \`model_check(knowledge, query)\`:

\`\`\`python
def model_check(knowledge, query):
    """
    Returns True if every model satisfying knowledge also satisfies query.
    Uses recursive truth-table enumeration.
    """
    ...
\`\`\`

**Test it:**
\`\`\`python
rain = Symbol("rain")
wet  = Symbol("wet")

KB = And(
    Implication(rain, wet),   # If rain, then wet
    rain                       # It is raining
)

print(model_check(KB, wet))   # → True
print(model_check(KB, Not(wet)))  # → False
\`\`\`

---

### Part C — \`clue_solver.py\`

Encode the Clue murder mystery game. Your KB must contain:

1. At least one suspect is guilty
2. At least one weapon was used
3. At least one room is the crime scene
4. Cards in your hand are NOT the answer (you decide which cards you hold)

\`\`\`python
# You must solve: Who did it, with what, where?
suspects = [mustard, plum, scarlet]
weapons  = [knife, candlestick, revolver]
rooms    = [ballroom, library, study]

# Add rules for "at least one per category"
# Add your hand cards as Not(...)
# Query each symbol and print whether it's a definite answer
\`\`\`

---

### Part D — \`puzzle.py\` (Knights and Knaves)

Knights always tell the truth. Knaves always lie.

\`\`\`python
# Symbols
AKnight = Symbol("A is a Knight")
AKnave  = Symbol("A is a Knave")
BKnight = Symbol("B is a Knight")
BKnave  = Symbol("B is a Knave")

# Base knowledge: each person is exactly one type
base = And(
    Or(AKnight, AKnave),
    Not(And(AKnight, AKnave)),   # can't be both
    Or(BKnight, BKnave),
    Not(And(BKnight, BKnave)),
)

# Puzzle 1: A says "I am a knave." B says "We are different."
# If A is a knight, A's statement must be true → A is a knave → contradiction
# Encode: If AKnight, then the statement is true. If AKnave, it's false.
puzzle1 = And(
    base,
    Biconditional(AKnight, AKnave),       # A's statement
    Biconditional(BKnight, Or(
        And(AKnight, BKnave),
        And(AKnave, BKnight)
    )),                                    # B's statement
)

print("A is Knight:", model_check(puzzle1, AKnight))
print("A is Knave: ", model_check(puzzle1, AKnave))
print("B is Knight:", model_check(puzzle1, BKnight))
print("B is Knave: ", model_check(puzzle1, BKnave))
\`\`\`
`;

// ─────────────────────────────────────────────────────────────────────────────
// Example 1
// ─────────────────────────────────────────────────────────────────────────────
const example1 = `
## Example 1 — Minesweeper Logic

This is the classic CS50 AI project. Every cell is either a mine or safe. We encode what we know.

\`\`\`python
# Symbols: Safe(r,c) and Mine(r,c) for each cell (r, c)
# After clicking (2,3) and seeing "1" (one neighbor is a mine):

neighbors = [(1,2),(1,3),(1,4),(2,2),(2,4),(3,2),(3,3),(3,4)]

# At least 1 of the 8 neighbors is a mine
at_least_one = Or(*[Symbol(f"Mine{r}{c}") for r,c in neighbors])

# If we already know some neighbors are safe:
known_safe = [(1,2),(3,3),(3,4)]   # from previous clicks
for r,c in known_safe:
    KB.append(Not(Symbol(f"Mine{r}{c}")))

# Model-check each remaining cell
remaining = [(r,c) for r,c in neighbors if (r,c) not in known_safe]
for r,c in remaining:
    if model_check(And(*KB, at_least_one), Symbol(f"Mine{r}{c}")):
        print(f"MINE: ({r},{c})")
    elif model_check(And(*KB, at_least_one), Not(Symbol(f"Mine{r}{c}"))):
        print(f"SAFE: ({r},{c})")
    else:
        print(f"UNKNOWN: ({r},{c})")
\`\`\`

**Key insight:** as you gather more clues (click more cells), the KB grows and more cells become decidable. This is exactly how CS50's Minesweeper AI works.
`;

// ─────────────────────────────────────────────────────────────────────────────
// Example 2
// ─────────────────────────────────────────────────────────────────────────────
const example2 = `
## Example 2 — Resolution Proof Walkthrough

Let's prove: KB ⊨ Q

Given:
- P → Q  (If P then Q)
- P       (P is true)

**Step 1:** Negate the query. We want to disprove ¬Q.

**Step 2:** Convert all to CNF clauses:
\`\`\`
¬P ∨ Q     (from P → Q, after eliminating implication)
P          (from P)
¬Q         (negation of query)
\`\`\`

**Step 3:** Apply resolution:
\`\`\`
Resolve (¬P ∨ Q) and (¬Q):
→ ¬P

Resolve (¬P) and (P):
→ {}   ← empty clause! Contradiction found.
\`\`\`

**Conclusion:** KB ⊨ Q is proven.

\`\`\`python
# In code
clauses = [
    frozenset({"¬P", "Q"}),   # P → Q
    frozenset({"P"}),          # P
    frozenset({"¬Q"}),         # ¬query
]

result = resolution(clauses[:-1], clauses[-1])
print("Entails Q:", result)   # → True
\`\`\`

**What changed vs. Model Checking:**

| | Model Checking | Resolution |
|---|---|---|
| Approach | Enumerate all 2^n models | Symbolic manipulation |
| Time complexity | O(2^n) | Polynomial for Horn clauses |
| Completeness | Complete | Complete |
| Best for | Small KBs | Large KBs, automated provers |
`;

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function Day2Page() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes" | "project" | "example1" | "example2">("notes");

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const unlocked = sessionStorage.getItem("aief_unlocked_day2");
    if (unlocked !== "1") {
      router.push("/AIEF");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return <div style={{ minHeight: "100vh", backgroundColor: "#090909" }} />;
  }

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: "notes",    label: "NOTES" },
    { key: "project",  label: "PROJECT" },
    { key: "example1", label: "EXAMPLE 1" },
    { key: "example2", label: "EXAMPLE 2" },
  ];

  const contentMap: Record<typeof activeTab, string> = {
    notes:    implementationNotes,
    project:  projectDetails,
    example1: example1,
    example2: example2,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#090909",
        color: "#f0f0f0",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* ── Scroll progress bar ──────────────────────────────────────── */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "#10B981",
          transformOrigin: "left",
          scaleX,
          zIndex: 100,
        }}
      />

      {/* ── Sticky Nav ───────────────────────────────────────────────── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(9,9,9,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/AIEF"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#71717a",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 500,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0f0")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#71717a")}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Curriculum
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontSize: 12,
                color: "#3f3f46",
                fontFamily: "monospace",
                letterSpacing: "0.06em",
              }}
            >
              AI Engineering Foundations
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 4,
                background: "#10B981",
                border: "1px solid #10B981",
                color: "#000000",
                letterSpacing: "0.04em",
              }}
            >
              DAY 2
            </span>
          </div>
        </div>
      </nav>

      {/* ── Page body ─────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          gap: 64,
          alignItems: "flex-start",
        }}
      >
        {/* ── Left sidebar TOC ──────────────────────────────────────── */}
        <StickyTOC items={tocItems} />

        {/* ── Main column ───────────────────────────────────────────── */}
        <main style={{ flex: 1, minWidth: 0, paddingBottom: 120 }}>
          {/* Hero */}
          <CourseHero
            day={2}
            totalDays={15}
            title="Welcome to Day 2"
            subtitle="Today you'll give your AI the ability to reason. You'll build a complete propositional logic engine from scratch and use it to solve real puzzles — from murder mysteries to minesweeper."
            duration="≈2-3 Hours"
            course="Harvard CS50 AI"
            focus="Knowledge"
            difficulty="Beginner"
          />

          {/* Objectives */}
          <div style={{ marginTop: 80 }}>
            <Checklist items={objectives} />
          </div>

          {/* Video */}
          <div id="video" style={{ marginTop: 100, scrollMarginTop: 72 }}>
            <VideoEmbed
              embedSrc="https://www.youtube-nocookie.com/embed/HWQLez87vqM?si=eDD9xac4q7O7dgjQ"
              title="CS50 AI — Knowledge & Logic"
            />
          </div>

          {/* Content Tabs */}
          <div id="notes" style={{ marginTop: 80, scrollMarginTop: 72 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                marginBottom: 6,
              }}
            >
              Practical Implementation Notes
            </h2>
            <p style={{ fontSize: 13.5, color: "#52525b", marginBottom: 28 }}>
              No theory. Just how to build it.
            </p>

            {/* Tab Switcher */}
            <div
              style={{
                display: "flex",
                gap: 4,
                marginBottom: 24,
                background: "#0c0c0c",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
                padding: 4,
                width: "fit-content",
              }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: "monospace",
                    letterSpacing: "0.08em",
                    transition: "all 0.15s ease",
                    background: activeTab === tab.key ? "#10B981" : "transparent",
                    color: activeTab === tab.key ? "#000000" : "#52525b",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div
              style={{
                background: "#0c0c0c",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: "36px 40px",
              }}
            >
              <MarkdownViewer content={contentMap[activeTab]} />
            </div>
          </div>

          {/* Projects */}
          <div id="projects" style={{ marginTop: 100, scrollMarginTop: 72 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                marginBottom: 6,
              }}
            >
              Day 2 Project
            </h2>
            <p style={{ fontSize: 13.5, color: "#52525b", marginBottom: 28 }}>
              Build two real logic-powered AI systems using everything learned today.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 16,
                marginBottom: 40,
              }}
            >
              <ProjectCard
                title="Clue Solver"
                description="Build a logic-based AI that solves the Clue board game by encoding suspects, weapons, and rooms as propositional sentences and querying your model checker."
                skills={["Propositional Logic", "Model Checking", "Knowledge Engineering", "And/Or/Not"]}
              />
              <ProjectCard
                title="Knights & Knaves"
                description="Solve classic logic puzzles where Knights always tell the truth and Knaves always lie. Encode every statement as a biconditional and let your AI reason to the answer."
                skills={["Biconditional", "Inference", "Constraint Satisfaction", "FOL"]}
              />
            </div>
          </div>

          {/* Warning */}
          <div style={{ marginTop: 80 }}>
            <PremiumWarning title="Before You Start Coding">
              <p>Do <strong>NOT</strong> use AI to generate today&apos;s code.</p>
              <p>Build every logic class from scratch. The magic is in understanding why each \`evaluate()\` returns what it does.</p>
              <p>Once you truly understand how model checking works, you will see that nearly all AI reasoning is just this pattern scaled up.</p>
              <p style={{ fontWeight: 600, color: "#f0f0f0", marginTop: 8 }}>Engineers build first. AI assists later.</p>
            </PremiumWarning>
          </div>

          {/* GitHub Submit */}
          <div id="submit" style={{ marginTop: 80, scrollMarginTop: 72 }}>
            <GitHubSubmit
              format="DAY2_{ROLLNUM}"
              example="DAY2_KAIEF2601"
            />
          </div>

          {/* Completion */}
          <div
            style={{
              marginTop: 100,
              paddingTop: 80,
              borderTop: "1px solid rgba(255,255,255,0.05)",
              textAlign: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "-0.04em",
                  marginBottom: 16,
                }}
              >
                Great Work!
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: "#52525b",
                  maxWidth: 500,
                  margin: "0 auto 48px",
                  lineHeight: 1.75,
                }}
              >
                You&apos;ve completed Day 2 of AI Engineering Foundations. Tomorrow you&apos;ll continue with
                Uncertainty — teaching your AI to reason with probability instead of certainty.
              </p>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 28,
                  fontFamily: "monospace",
                  fontSize: 13,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#3f3f46",
                }}
              >
                <span style={{ color: "#f0f0f0" }}>Learn.</span>
                <span style={{ color: "#10B981", fontWeight: 700 }}>Build.</span>
                <span style={{ color: "#f0f0f0" }}>Prove.</span>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
