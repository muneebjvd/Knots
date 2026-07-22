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
  "Understand Local Search & Hill Climbing",
  "Implement Simulated Annealing",
  "Solve Linear Programs with PuLP",
  "Model Constraint Satisfaction Problems",
  "Apply Node & Arc Consistency",
  "Implement Backtracking Search with MRV Heuristic",
  "Solve N-Queens and Crossword as CSPs",
];

const tocItems = [
  { id: "objectives", title: "Objectives" },
  { id: "video", title: "Course Video" },
  { id: "notes", title: "Implementation Notes" },
  { id: "local-search", title: "↳ Local Search" },
  { id: "hill-climbing", title: "↳ Hill Climbing" },
  { id: "simulated-annealing", title: "↳ Simulated Annealing" },
  { id: "linear-programming", title: "↳ Linear Programming" },
  { id: "constraint-satisfaction", title: "↳ CSP" },
  { id: "arc-consistency", title: "↳ Arc Consistency (AC-3)" },
  { id: "backtracking-search", title: "↳ Backtracking" },
  { id: "projects", title: "Projects" },
  { id: "submit", title: "Submit" },
];

const implementationNotes = `
# Day 4 — CS50 AI: Optimization — Code-First Notes

---

## Local Search

Local search keeps only **one current state** and moves to a neighbor. No frontier, no explored set.

\`\`\`python
import random

def neighbors(state):
    """Return all states reachable by one small change."""
    result = []
    for i in range(len(state)):
        for delta in [-1, +1]:
            neighbor = list(state)
            neighbor[i] += delta
            result.append(tuple(neighbor))
    return result

def objective(state):
    """Higher = better. This is what we are maximizing."""
    return -sum(state)   # example: minimize sum
\`\`\`

---

## Hill Climbing

Always move to the best neighbor. Gets stuck at local optima.

\`\`\`python
def hill_climbing(initial_state, objective, neighbors, max_steps=1000):
    current = initial_state
    for _ in range(max_steps):
        best_neighbor = max(neighbors(current), key=objective)
        if objective(best_neighbor) <= objective(current):
            break   # no improvement → local optimum
        current = best_neighbor
    return current

# Variants
def random_restart_hill_climbing(objective, neighbors, generate_random, restarts=20):
    best = None
    for _ in range(restarts):
        start  = generate_random()
        result = hill_climbing(start, objective, neighbors)
        if best is None or objective(result) > objective(best):
            best = result
    return best
\`\`\`

---

## Simulated Annealing

Sometimes accept a worse neighbor — the probability decreases as "temperature" cools.

\`\`\`python
import math, random

def simulated_annealing(initial, objective, neighbors,
                         T_start=1.0, T_end=0.001, alpha=0.995, steps=10000):
    """
    alpha = cooling rate (multiply T by alpha each step)
    Accepts worse solutions with probability e^(ΔE / T)
    """
    current = initial
    T = T_start

    for _ in range(steps):
        T *= alpha
        if T < T_end:
            break

        neighbor = random.choice(neighbors(current))
        delta = objective(neighbor) - objective(current)

        if delta > 0:
            current = neighbor        # always accept improvement
        else:
            # accept worse solution with small probability
            probability = math.exp(delta / T)
            if random.random() < probability:
                current = neighbor

    return current
\`\`\`

---

## Linear Programming

Optimize a **linear objective** subject to **linear constraints**. Use PuLP.

\`\`\`python
import pulp

# Example: maximize 29x + 45y
# subject to: x + y <= 10
#             2x + 5y <= 25
#             x, y >= 0

prob = pulp.LpProblem("maximize_profit", pulp.LpMaximize)

x = pulp.LpVariable("x", lowBound=0)
y = pulp.LpVariable("y", lowBound=0)

# Objective (maximize)
prob += 29 * x + 45 * y

# Constraints
prob += x + y   <= 10
prob += 2*x + 5*y <= 25

prob.solve(pulp.PULP_CBC_CMD(msg=0))

print("Status:", pulp.LpStatus[prob.status])
print(f"x = {x.varValue}, y = {y.varValue}")
print(f"Objective = {pulp.value(prob.objective)}")
\`\`\`

---

## Constraint Satisfaction

A CSP has: **variables**, **domains**, and **constraints**.

\`\`\`python
class CSP:
    def __init__(self):
        self.variables   = []          # list of variable names
        self.domains     = {}          # {var: [value1, value2, ...]}
        self.constraints = []          # list of (var1, var2, constraint_fn) tuples

    def add_variable(self, name, domain):
        self.variables.append(name)
        self.domains[name] = list(domain)

    def add_constraint(self, var1, var2, fn):
        """fn(val1, val2) -> True if assignment is consistent."""
        self.constraints.append((var1, var2, fn))

    def consistent(self, assignment):
        for var1, var2, fn in self.constraints:
            if var1 in assignment and var2 in assignment:
                if not fn(assignment[var1], assignment[var2]):
                    return False
        return True

# Example: Map coloring (Australia)
csp = CSP()
for region in ["WA", "NT", "SA", "Q", "NSW", "V", "T"]:
    csp.add_variable(region, ["red", "green", "blue"])

adjacent = [("WA","NT"),("WA","SA"),("NT","SA"),("NT","Q"),
            ("SA","Q"),("SA","NSW"),("SA","V"),("Q","NSW"),("NSW","V")]
for a, b in adjacent:
    csp.add_constraint(a, b, lambda x, y: x != y)
\`\`\`

---

## Arc Consistency — AC-3

Remove values from domains that cannot possibly be consistent.

\`\`\`python
from collections import deque

def ac3(csp):
    """
    Make every arc (Xi, Xj) arc-consistent.
    Modifies csp.domains in place.
    Returns False if a domain becomes empty (no solution exists).
    """
    queue = deque()
    for var1, var2, _ in csp.constraints:
        queue.append((var1, var2))
        queue.append((var2, var1))

    while queue:
        xi, xj = queue.popleft()
        if revise(csp, xi, xj):
            if not csp.domains[xi]:
                return False   # domain wiped out → no solution
            # xi's domain changed → re-check all neighbors of xi
            for var1, var2, _ in csp.constraints:
                if var2 == xi and var1 != xj:
                    queue.append((var1, xi))
                elif var1 == xi and var2 != xj:
                    queue.append((var2, xi))
    return True

def revise(csp, xi, xj):
    """Remove values from xi's domain that have no support in xj."""
    revised = False
    for val_i in csp.domains[xi][:]:
        # Check if any value in xj is consistent with val_i
        fn = next((f for v1,v2,f in csp.constraints if (v1==xi and v2==xj) or (v1==xj and v2==xi)), None)
        if fn and not any(fn(val_i, val_j) for val_j in csp.domains[xj]):
            csp.domains[xi].remove(val_i)
            revised = True
    return revised
\`\`\`

---

## Backtracking Search

Depth-first search through the assignment space, pruning inconsistent branches.

\`\`\`python
def backtrack(assignment, csp):
    """Returns a complete consistent assignment, or None if impossible."""
    if len(assignment) == len(csp.variables):
        return assignment   # complete assignment

    var = select_unassigned_variable(assignment, csp)

    for value in order_domain_values(var, assignment, csp):
        if is_consistent(var, value, assignment, csp):
            assignment[var] = value
            result = backtrack(assignment, csp)
            if result is not None:
                return result
            del assignment[var]   # undo — backtrack

    return None   # no valid value found

def select_unassigned_variable(assignment, csp):
    """MRV heuristic: pick variable with fewest remaining legal values."""
    unassigned = [v for v in csp.variables if v not in assignment]
    return min(unassigned, key=lambda v: len(csp.domains[v]))

def is_consistent(var, value, assignment, csp):
    test = {**assignment, var: value}
    return csp.consistent(test)

def order_domain_values(var, assignment, csp):
    """LCV heuristic: prefer values that eliminate fewest choices for neighbors."""
    return csp.domains[var]   # basic version — no ordering

# Solve it
solution = backtrack({}, csp)
print(solution)
\`\`\`
`;

const projectDetails = `
## Part 2 — Mini Project: CSP Solvers

\`\`\`plaintext
day4_project/
├── nqueens.py       # N-Queens as a CSP
├── crossword.py     # Crossword puzzle as a CSP
└── lp_scheduler.py  # Simple LP scheduler with PuLP
\`\`\`

---

### Part A — \`nqueens.py\` (N-Queens CSP)

Place N queens on an N×N board so none attack each other.

1. Variables: one per column (col 0 to N-1)
2. Domain: row numbers 0 to N-1
3. Constraints: no two queens share a row or diagonal

\`\`\`python
def nqueens_csp(n):
    csp = CSP()
    for col in range(n):
        csp.add_variable(col, list(range(n)))
    for col1 in range(n):
        for col2 in range(col1+1, n):
            csp.add_constraint(col1, col2, lambda r1, r2, c1=col1, c2=col2:
                r1 != r2 and abs(r1 - r2) != abs(c1 - c2))
    return csp

# TODO: run backtrack({}}, nqueens_csp(8)) and print the board
\`\`\`

---

### Part B — \`crossword.py\` (Crossword CSP)

Fill a crossword grid with words from a word list:

1. Variables: each word slot (represented as start position + direction + length)
2. Domain: all words of matching length
3. Constraints: overlapping slots must share the same letter at the overlap cell

\`\`\`python
# TODO: define CrosswordVariable(row, col, direction, length)
# TODO: find all overlaps between variable pairs
# TODO: add constraint: word1[overlap_pos1] == word2[overlap_pos2]
# TODO: run backtracking and print the filled grid
\`\`\`

---

### Part C — \`lp_scheduler.py\` (Linear Programming)

Schedule workers to minimize cost:
- 3 shifts: morning, afternoon, night
- Each shift requires minimum workers
- Each worker has a cost per shift

\`\`\`python
import pulp

# TODO: define LpVariable for each worker-shift assignment
# TODO: add constraints for minimum coverage per shift
# TODO: minimize total cost
# TODO: print optimal schedule
\`\`\`
`;

const example1 = `
## Example 1 — Sudoku as a CSP

Sudoku is a perfect CSP: 81 variables, domain 1-9, constraints for rows/cols/boxes.

\`\`\`python
def sudoku_csp(puzzle):
    """
    puzzle = 9x9 list, 0 means empty.
    Returns a CSP ready for backtracking.
    """
    csp = CSP()

    # Add all 81 cells as variables
    for r in range(9):
        for c in range(9):
            var = (r, c)
            if puzzle[r][c] != 0:
                csp.add_variable(var, [puzzle[r][c]])   # pre-filled: domain of 1
            else:
                csp.add_variable(var, list(range(1, 10)))

    # Constraints: all-different in each row, column, and 3x3 box
    def not_equal(a, b): return a != b

    for r in range(9):
        for c1 in range(9):
            for c2 in range(c1+1, 9):
                csp.add_constraint((r, c1), (r, c2), not_equal)   # row

    for c in range(9):
        for r1 in range(9):
            for r2 in range(r1+1, 9):
                csp.add_constraint((r1, c), (r2, c), not_equal)   # col

    for box_r in range(3):
        for box_c in range(3):
            cells = [(box_r*3+r, box_c*3+c) for r in range(3) for c in range(3)]
            for i in range(len(cells)):
                for j in range(i+1, len(cells)):
                    csp.add_constraint(cells[i], cells[j], not_equal)   # box

    return csp

# Example puzzle (0 = empty)
puzzle = [
    [5,3,0, 0,7,0, 0,0,0],
    [6,0,0, 1,9,5, 0,0,0],
    [0,9,8, 0,0,0, 0,6,0],
    [8,0,0, 0,6,0, 0,0,3],
    [4,0,0, 8,0,3, 0,0,1],
    [7,0,0, 0,2,0, 0,0,6],
    [0,6,0, 0,0,0, 2,8,0],
    [0,0,0, 4,1,9, 0,0,5],
    [0,0,0, 0,8,0, 0,7,9],
]

csp = sudoku_csp(puzzle)
ac3(csp)                    # prune first (often solves easy puzzles alone!)
solution = backtrack({}, csp)
\`\`\`
`;

const example2 = `
## Example 2 — Simulated Annealing: Travelling Salesman

Find the shortest route visiting all cities exactly once.

\`\`\`python
import math, random

cities = {
    "A": (0, 0), "B": (1, 3), "C": (4, 1),
    "D": (3, 4), "E": (6, 2), "F": (5, 5),
}

def distance(c1, c2):
    x1, y1 = cities[c1]
    x2, y2 = cities[c2]
    return math.sqrt((x1-x2)**2 + (y1-y2)**2)

def tour_length(route):
    total = sum(distance(route[i], route[(i+1) % len(route)])
                for i in range(len(route)))
    return total

def swap_neighbor(route):
    """Swap two random cities in the route."""
    i, j = random.sample(range(len(route)), 2)
    neighbor = list(route)
    neighbor[i], neighbor[j] = neighbor[j], neighbor[i]
    return tuple(neighbor)

def tsp_annealing(cities_list, T_start=100, T_end=0.01, alpha=0.995, steps=50000):
    current = tuple(cities_list)
    random.shuffle(list(current))   # random initial route
    current = tuple(sorted(cities_list, key=lambda _: random.random()))
    best    = current
    T = T_start

    for _ in range(steps):
        T *= alpha
        if T < T_end:
            break
        neighbor = swap_neighbor(current)
        delta = tour_length(neighbor) - tour_length(current)
        if delta < 0 or random.random() < math.exp(-delta / T):
            current = neighbor
            if tour_length(current) < tour_length(best):
                best = current

    return best, tour_length(best)

route, length = tsp_annealing(list(cities.keys()))
print(f"Best route: {' → '.join(route)}")
print(f"Total distance: {length:.2f}")
\`\`\`

**Why SA beats Hill Climbing here:**
Hill Climbing gets stuck in a bad route permutation and can never escape. SA can accept slightly longer routes temporarily, which lets it explore and find globally better solutions.
`;

export default function Day4Page() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes"|"project"|"example1"|"example2">("notes");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const unlocked = sessionStorage.getItem("aief_unlocked_day4");
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
          <Link href="/AIEF" style={{ display: "flex", alignItems: "center", gap: 8, color: "#71717a", textDecoration: "none", fontSize: 13, fontWeight: 500 }} onMouseEnter={e => e.currentTarget.style.color="#f0f0f0"} onMouseLeave={e => e.currentTarget.style.color="#71717a"}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Curriculum
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "#3f3f46", fontFamily: "monospace", letterSpacing: "0.06em" }}>AI Engineering Foundations</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: "#10B981", color: "#000" }}>DAY 4</span>
          </div>
        </div>
      </nav>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", gap: 64, alignItems: "flex-start" }}>
        <StickyTOC items={tocItems} />
        <main style={{ flex: 1, minWidth: 0, paddingBottom: 120 }}>
          <CourseHero day={4} totalDays={15} title="Welcome to Day 4" subtitle="Today you teach your AI to find the best solution from millions of possibilities. You'll master local search, simulated annealing, linear programming, and constraint satisfaction — the backbone of scheduling, planning, and puzzle-solving AI." duration="≈2-3 Hours" course="Harvard CS50 AI" focus="Optimization" difficulty="Intermediate" />
          <div style={{ marginTop: 80 }}><Checklist items={objectives} /></div>
          <div id="video" style={{ marginTop: 100, scrollMarginTop: 72 }}>
            <VideoEmbed embedSrc="https://www.youtube-nocookie.com/embed/qK46ET1xk2A?si=em1Edj-Anhmi1a82" title="CS50 AI — Optimization" />
          </div>
          <div id="notes" style={{ marginTop: 80, scrollMarginTop: 72 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 6 }}>Practical Implementation Notes</h2>
            <p style={{ fontSize: 13.5, color: "#52525b", marginBottom: 28 }}>No theory. Just how to build it.</p>
            <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#0c0c0c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 4, width: "fit-content" }}>
              {tabs.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "monospace", letterSpacing: "0.08em", transition: "all 0.15s", background: activeTab === tab.key ? "#10B981" : "transparent", color: activeTab === tab.key ? "#000" : "#52525b" }}>{tab.label}</button>
              ))}
            </div>
            <div style={{ background: "#0c0c0c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "36px 40px" }}>
              <MarkdownViewer content={content[activeTab]} />
            </div>
          </div>
          <div id="projects" style={{ marginTop: 100, scrollMarginTop: 72 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 6 }}>Day 4 Project</h2>
            <p style={{ fontSize: 13.5, color: "#52525b", marginBottom: 28 }}>Build two complete optimization AI systems.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              <ProjectCard title="N-Queens Solver" description="Formulate and solve the N-Queens problem as a CSP using backtracking with MRV heuristic and AC-3 preprocessing." skills={["CSP", "Backtracking", "MRV", "AC-3", "Constraint Propagation"]} />
              <ProjectCard title="Crossword Puzzle" description="Build a crossword puzzle solver that fills in words from a dictionary using backtracking and overlap constraints." skills={["CSP", "Backtracking", "Arc Consistency", "Word Search"]} />
            </div>
          </div>
          <div style={{ marginTop: 80 }}>
            <PremiumWarning title="Before You Start Coding">
              <p>Do <strong>NOT</strong> use AI to write the solver.</p>
              <p>The moment you implement backtracking yourself and watch it prune the search tree, you&apos;ll understand why constraint propagation is so powerful.</p>
              <p style={{ fontWeight: 600, color: "#f0f0f0", marginTop: 8 }}>Engineers build first. AI assists later.</p>
            </PremiumWarning>
          </div>
          <div id="submit" style={{ marginTop: 80, scrollMarginTop: 72 }}>
            <GitHubSubmit format="DAY4_{ROLLNUM}" example="DAY4_KAIEF2601" />
          </div>
          <div style={{ marginTop: 100, paddingTop: 80, borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h2 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 700, color: "#fff", letterSpacing: "-0.04em", marginBottom: 16 }}>Great Work!</h2>
              <p style={{ fontSize: 16, color: "#52525b", maxWidth: 500, margin: "0 auto 48px", lineHeight: 1.75 }}>You&apos;ve completed Day 4. Tomorrow you enter Machine Learning — teaching your AI to learn patterns from data without being explicitly programmed.</p>
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
