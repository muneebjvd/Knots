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
  "Understand Search Problems",
  "Learn Depth-First Search (DFS)",
  "Learn Breadth-First Search (BFS)",
  "Learn Greedy Best-First Search",
  "Learn A* Search",
  "Learn Minimax",
  "Learn Alpha-Beta Pruning",
  "Build Two Real AI Projects",
];

const tocItems = [
  { id: "objectives", title: "Objectives" },
  { id: "video", title: "Course Video" },
  { id: "notes", title: "Implementation Notes" },
  { id: "search-problem", title: "↳ Search Problem" },
  { id: "depth-first-search-dfs", title: "↳ DFS" },
  { id: "breadth-first-search-bfs", title: "↳ BFS" },
  { id: "greedy-best-first-search", title: "↳ Greedy Search" },
  { id: "a-search", title: "↳ A*" },
  { id: "minimax", title: "↳ Minimax" },
  { id: "alpha-beta-pruning", title: "↳ Alpha-Beta" },
  { id: "depth-limited-minimax", title: "↳ Depth-Limited" },
  { id: "projects", title: "Projects" },
  { id: "submit", title: "Submit" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Implementation Notes — pure markdown (rehype-slug auto-generates IDs from headings)
// ─────────────────────────────────────────────────────────────────────────────
const implementationNotes = `
# Day 1 — CS50 AI: Search — Code-First Notes

Theory is covered in lecture. This is the "how to actually write it" reference — Python tools you need, then code for every algorithm, then the project broken into buildable steps.

---

## Part 0 — Python tools used below (quick reference)

\`\`\`python
# Classes — bundle data together, self = "this object"
class Node:
    def __init__(self, state, parent):
        self.state = state
        self.parent = parent

# Recursion — function calls itself, needs a base case to stop
def f(n):
    if n == 0: return       # base case
    f(n - 1)                 # recursive call

# List as stack (LIFO) vs queue (FIFO)
lst.append(x)      # add to end
lst[-1]              # last item   -> stack "top"
lst[:-1]             # drop last item
lst[0]               # first item  -> queue "front"
lst[1:]              # drop first item

# Set — no duplicates, fast \`in\` check
seen = set()
seen.add(state)
state in seen        # True/False, instant

# heapq — self-sorting list, pops smallest first
import heapq
heapq.heappush(heap, (priority, counter, item))
heapq.heappop(heap)   # smallest priority comes out first

# Reading a file into lines
with open("file.txt") as f:
    lines = f.read().splitlines()

# 2D grid with coordinates
for r, row in enumerate(grid):
    for c, char in enumerate(row):
        ...
\`\`\`

---

## Part 1 — Search algorithms: code

Every algorithm below reuses the exact same \`Node\` class and \`search()\` loop. **Only the frontier class changes.**

### Node + generic loop

\`\`\`python
class Node:
    def __init__(self, state, parent, action, cost=0):
        self.state = state
        self.parent = parent
        self.action = action
        self.cost = cost

def search(start_state, frontier):
    frontier.add(Node(start_state, None, None))
    explored = set()

    while True:
        if frontier.empty():
            return None

        node = frontier.remove()

        if goal_test(node.state):
            return build_path(node)

        explored.add(node.state)

        for action in actions(node.state):
            child_state = result(node.state, action)
            child = Node(child_state, node, action, node.cost + step_cost(node.state, action))
            if child.state not in explored and not frontier.contains_state(child.state):
                frontier.add(child)

def build_path(node):
    path = []
    while node.parent is not None:
        path.append(node.action)
        node = node.parent
    path.reverse()
    return path
\`\`\`

You define \`actions\`, \`result\`, \`goal_test\`, \`step_cost\` per-problem (maze vs. game).

### DFS — stack frontier

\`\`\`python
class StackFrontier:
    def __init__(self):
        self.frontier = []
    def add(self, node):
        self.frontier.append(node)
    def contains_state(self, state):
        return any(n.state == state for n in self.frontier)
    def empty(self):
        return len(self.frontier) == 0
    def remove(self):
        node = self.frontier[-1]
        self.frontier = self.frontier[:-1]
        return node
\`\`\`

### BFS — queue frontier (one line different)

\`\`\`python
class QueueFrontier(StackFrontier):
    def remove(self):
        node = self.frontier[0]
        self.frontier = self.frontier[1:]
        return node
\`\`\`

### Greedy Best-First — priority queue on h(n)

\`\`\`python
import heapq

def manhattan(state, goal):
    (x1, y1), (x2, y2) = state, goal
    return abs(x1 - x2) + abs(y1 - y2)

class GreedyFrontier:
    def __init__(self, goal, heuristic):
        self.heap = []
        self.counter = 0   # tie-breaker so heapq never compares Node objects directly
        self.goal = goal
        self.heuristic = heuristic
    def add(self, node):
        h = self.heuristic(node.state, self.goal)
        heapq.heappush(self.heap, (h, self.counter, node))
        self.counter += 1
    def remove(self):
        h, _, node = heapq.heappop(self.heap)
        return node
    def empty(self):
        return len(self.heap) == 0
    def contains_state(self, state):
        return any(n.state == state for _, _, n in self.heap)
\`\`\`

### A* — priority queue on g(n) + h(n)

\`\`\`python
class AStarFrontier(GreedyFrontier):
    def add(self, node):
        f = node.cost + self.heuristic(node.state, self.goal)
        heapq.heappush(self.heap, (f, self.counter, node))
        self.counter += 1
\`\`\`

### Minimax

\`\`\`python
def minimax(board, player):
    if terminal(board):
        return None
    if player == "X":
        best_value, best_move = -float("inf"), None
        for action in actions(board):
            value = min_value(result(board, action))
            if value > best_value:
                best_value, best_move = value, action
    else:
        best_value, best_move = float("inf"), None
        for action in actions(board):
            value = max_value(result(board, action))
            if value < best_value:
                best_value, best_move = value, action
    return best_move

def max_value(board):
    if terminal(board): return utility(board)
    v = -float("inf")
    for action in actions(board):
        v = max(v, min_value(result(board, action)))
    return v

def min_value(board):
    if terminal(board): return utility(board)
    v = float("inf")
    for action in actions(board):
        v = min(v, max_value(result(board, action)))
    return v
\`\`\`

### Alpha-beta pruning

\`\`\`python
def max_value(board, alpha, beta):
    if terminal(board): return utility(board)
    v = -float("inf")
    for action in actions(board):
        v = max(v, min_value(result(board, action), alpha, beta))
        alpha = max(alpha, v)
        if alpha >= beta: break   # prune
    return v

def min_value(board, alpha, beta):
    if terminal(board): return utility(board)
    v = float("inf")
    for action in actions(board):
        v = min(v, max_value(result(board, action), alpha, beta))
        beta = min(beta, v)
        if alpha >= beta: break
    return v

# call: max_value(board, -float("inf"), float("inf"))
\`\`\`

### Depth-limited + evaluation function

\`\`\`python
def max_value(board, depth, alpha, beta):
    if terminal(board) or depth == 0:
        return evaluate(board)
    v = -float("inf")
    for action in actions(board):
        v = max(v, min_value(result(board, action), depth - 1, alpha, beta))
        alpha = max(alpha, v)
        if alpha >= beta: break
    return v

def evaluate(board):
    if terminal(board): return utility(board)
    return heuristic_score(board)   # your own scoring function
\`\`\`
`;

const projectDetails = `
## Part 2 — Mini Project: Maze Solver + Unbeatable Tic-Tac-Toe

\`\`\`plaintext
day1_project/
├── maze.py
├── mazes/maze1.txt
├── tictactoe.py
└── runner.py
\`\`\`

### Part A — \`maze.py\`

Maze file (\`A\`=start, \`B\`=goal, \`#\`=wall, space=path):
\`\`\`plaintext
#########
#A #    #
# # ### #
#   #   #
### # # #
#B    # #
#########
\`\`\`

**Build order — run after each step:**

1. Read the file (Part 0), loop with \`enumerate\` to find \`A\` and \`B\` coordinates. Print them.
2. \`actions(state)\`: check 4 neighbors of \`(row, col)\`, keep ones in-bounds and not \`#\`. Return \`[(direction, (row,col)), ...]\`.
3. \`result(state, action)\`: return the coordinate from \`action\`.
4. \`goal_test(state)\`: \`state == B\`.
5. Paste \`Node\` + \`search()\` unchanged.
6. Run with \`StackFrontier\` -> DFS. Print path.
7. Run with \`QueueFrontier\` -> BFS. Compare path length to DFS.
8. Run with \`GreedyFrontier\` (Manhattan) -> compare.
9. Run with \`AStarFrontier\` -> compare.
10. Print a table: path length + \`len(explored)\` per algorithm.

Expected shape:

| Algorithm | Path length | States explored |
|---|---|---|
| DFS | 26 | 90 |
| BFS | 20 | 78 |
| Greedy | 22 | 25 |
| A* | 20 | 30 |

BFS and A* should return the **same** path length on this maze (uniform step cost) — if not, something's wrong.

*Optional:* draw with \`Pillow\`, color explored cells vs. final path.

### Part B — \`tictactoe.py\`

1. Board = 3x3 list of lists, values \`"X"\`/\`"O"\`/\`None\`.
2. \`player(board)\`: count X's and O's — equal -> X's turn, else O's.
3. \`actions(board)\`: nested loop, return \`(row, col)\` of every \`None\` cell.
4. \`result(board, action)\`: **\`copy.deepcopy(board)\`**, place mark on the copy, return copy. (Never mutate the original — Minimax branches share the same board object otherwise.)
5. \`winner(board)\`: check all 8 lines (3 rows, 3 cols, 2 diagonals) for 3-in-a-row.
6. \`terminal(board)\`: \`winner(board) is not None\` or \`actions(board)\` is empty.
7. \`utility(board)\`: \`1\` if X won, \`-1\` if O won, \`0\` otherwise.
8. \`minimax(board)\`: wire together the alpha-beta code above, return the best **action**.

### \`runner.py\`

\`\`\`python
from tictactoe import *

board = initial_state()
while not terminal(board):
    if player(board) == "O":
        row, col = map(int, input("row,col: ").split(","))
        board = result(board, (row, col))
    else:
        board = result(board, minimax(board))
    print(board)

print("Winner:", winner(board))
\`\`\`

---

## Debug checklist

- **Maze infinite loop / never finishes** -> \`explored\` not checked before adding to frontier.
- **AI loses at Tic-Tac-Toe** -> missing \`deepcopy\` in \`result\` (boards leaking between branches).
- **BFS != A* path length** -> bug in \`step_cost\`, or heuristic overestimating.
- **\`heapq\` comparison crash** -> missing the \`counter\` tie-breaker in Greedy/A* frontier.

---

## Part 3 — Worked Example: Same Pattern, New Problem

A fully commented example on a *different* problem — shortest connection between two people in a small friend network (classic "six degrees" idea). Same \`Node\`/\`search()\` pattern as the maze, just a different \`actions()\`. Read every comment; this is the pattern you reuse for any new search problem.

\`\`\`python
# ----- 1. Define the problem data -----
# A graph: each person maps to a list of their direct friends.
graph = {
    "Alice":  ["Bob", "Carol"],
    "Bob":    ["Alice", "Dave"],
    "Carol":  ["Alice", "Eve"],
    "Dave":   ["Bob", "Frank"],
    "Eve":    ["Carol", "Frank"],
    "Frank":  ["Dave", "Eve"],
}

# ----- 2. The four problem-specific functions -----
# "State" here = a person's name (a string), instead of a (row, col) like the maze.

def actions(state):
    # legal moves = "go to any direct friend"
    # we return (action_label, resulting_state) pairs, same shape as the maze
    return [(friend, friend) for friend in graph[state]]

def result(state, action):
    # action already IS the resulting state here (see actions() above)
    return action

def goal_test(state, goal):
    # note: this one needs an extra "goal" argument, since it's not a fixed
    # global like B was in the maze — small variation, same idea
    return state == goal

def step_cost(state, action):
    return 1   # every friendship link costs the same

# ----- 3. Reuse Node + search() EXACTLY as before -----
# (paste Node and search() from Part 1 unchanged — only goal_test's extra
#  argument means we wrap it in a lambda when we call search, see below)

class Node:
    def __init__(self, state, parent, action, cost=0):
        self.state = state
        self.parent = parent
        self.action = action
        self.cost = cost

def search(start_state, goal_state, frontier):
    frontier.add(Node(start_state, None, None))
    explored = set()

    while True:
        if frontier.empty():
            return None                          # no connection found

        node = frontier.remove()

        if goal_test(node.state, goal_state):     # reached the target person
            return build_path(node)

        explored.add(node.state)

        for action_label, child_state in actions(node.state):
            child = Node(child_state, node, action_label, node.cost + 1)
            if child.state not in explored and not frontier.contains_state(child.state):
                frontier.add(child)

def build_path(node):
    path = []
    while node.parent is not None:
        path.append(node.action)     # each action here is just the friend's name
        node = node.parent
    path.reverse()
    return path

# ----- 4. Reuse QueueFrontier from Part 1 unchanged -----
class QueueFrontier:
    def __init__(self):
        self.frontier = []
    def add(self, node):
        self.frontier.append(node)
    def contains_state(self, state):
        return any(n.state == state for n in self.frontier)
    def empty(self):
        return len(self.frontier) == 0
    def remove(self):
        node = self.frontier[0]
        self.frontier = self.frontier[1:]
        return node

# ----- 5. Run it -----
path = search("Alice", "Frank", QueueFrontier())
print(path)   # e.g. ['Carol', 'Eve', 'Frank']  -> Alice -> Carol -> Eve -> Frank
\`\`\`

**What changed vs. the maze, and what didn't:**

| | Maze | Friend network |
|---|---|---|
| State | \`(row, col)\` tuple | person's name (string) |
| \`actions()\` | check 4 grid neighbors | look up \`graph[state]\` |
| \`Node\`, \`search()\`, \`build_path()\` | — | **identical, untouched** |
| Frontier class | any of the 4 | \`QueueFrontier\` = BFS = shortest chain of friends |

This is the whole point of the Node/frontier pattern: once you trust it on one problem, applying it to a new one is just rewriting \`actions()\`/\`result()\`/\`goal_test()\` for the new state shape — the search engine itself never changes.

**Try yourself:** swap \`QueueFrontier()\` for \`StackFrontier()\` (from Part 1) and see the path change — DFS may find a longer chain first since it doesn't guarantee shortest.

---

## Part 4 — Worked Example: Minimax on a New Game

Same idea as Part 3, but for the Minimax pattern instead of search. Game: **Stone Game** — a pile starts with some stones, players alternate taking 1 or 2 stones, whoever takes the **last** stone wins. Same \`max_value\`/\`min_value\`/\`utility\`/\`terminal\` shape as Tic-Tac-Toe — only the game-specific functions change.

\`\`\`python
# ----- 1. Represent the state -----
# In Tic-Tac-Toe, "state" = the 3x3 board.
# Here, "state" = (stones_remaining, whose_turn) — much simpler, same idea:
# just enough info to know what moves are legal and who acts next.

def initial_state(stones):
    return (stones, "A")   # A moves first

# ----- 2. The four game-specific functions (like winner/terminal/utility/actions) -----

def player(state):
    stones, turn = state
    return turn

def actions(state):
    stones, turn = state
    # can take 1 or 2 stones, but not more than what's left
    moves = [1, 2]
    return [m for m in moves if m <= stones]

def result(state, action):
    stones, turn = state
    next_turn = "B" if turn == "A" else "A"     # switch player, same idea as switching X/O
    return (stones - action, next_turn)

def terminal(state):
    stones, turn = state
    return stones == 0        # game over when no stones left

def utility(state, mover_who_just_played):
    # whoever takes the LAST stone wins -> the player who just moved into
    # a 0-stone state is the winner
    return 1 if mover_who_just_played == "A" else -1

# ----- 3. Minimax — same shape as Tic-Tac-Toe's, adapted -----
# "A" is maximizing (wants score +1), "B" is minimizing (wants score -1)
# just like X/O in Tic-Tac-Toe.

def minimax(state):
    if terminal(state):
        return None
    if player(state) == "A":
        best_value, best_move = -float("inf"), None
        for action in actions(state):
            value = min_value(result(state, action))
            if value > best_value:
                best_value, best_move = value, action
    else:
        best_value, best_move = float("inf"), None
        for action in actions(state):
            value = max_value(result(state, action))
            if value < best_value:
                best_value, best_move = value, action
    return best_move

def max_value(state):
    if terminal(state):
        # the player who just moved (opposite of player(state), since state
        # already switched turns) is the one who took the last stone
        return utility(state, "B" if player(state) == "A" else "A")
    v = -float("inf")
    for action in actions(state):
        v = max(v, min_value(result(state, action)))
    return v

def min_value(state):
    if terminal(state):
        return utility(state, "B" if player(state) == "A" else "A")
    v = float("inf")
    for action in actions(state):
        v = min(v, max_value(result(state, action)))
    return v

# ----- 4. Run it -----
state = initial_state(7)          # start with 7 stones
while not terminal(state):
    move = minimax(state)
    print(f"Player {player(state)} takes {move} stone(s), {state[0] - move} left")
    state = result(state, move)

winner = "B" if player(state) == "A" else "A"   # last mover wins
print("Winner:", winner)
\`\`\`

**What changed vs. Tic-Tac-Toe, and what didn't:**

| | Tic-Tac-Toe | Stone game |
|---|---|---|
| State | 3x3 board | \`(stones_remaining, turn)\` tuple |
| \`actions()\` | empty cells | \`[1, 2]\` filtered by what's left |
| \`result()\` | place mark, \`deepcopy\` board | subtract stones, switch turn |
| \`terminal()\` | 3-in-a-row or board full | \`stones == 0\` |
| \`utility()\` | check who made 3-in-a-row | check who took the last stone |
| \`minimax()\`, \`max_value()\`, \`min_value()\` | — | **identical shape, untouched** |

Exactly like Part 3: the recursive Minimax skeleton never changes. Every new two-player game you meet just needs its own \`actions\`/\`result\`/\`terminal\`/\`utility\` — write those four, and Minimax (plus alpha-beta pruning from Part 1, if you want it faster) works immediately.

**Try yourself:** add alpha-beta pruning (Part 1 §Alpha-beta) to \`max_value\`/\`min_value\` here — the changes are word-for-word the same edit you'd make to Tic-Tac-Toe's version.
`;

// ─────────────────────────────────────────────────────────────────────────────
// Example 1
// ─────────────────────────────────────────────────────────────────────────────
const example1 = `
## Example 1 — Friend Network (BFS Shortest Path)

The same Node/Frontier code from the maze — zero changes — applied to a social graph.

\`\`\`python
# Graph represented as adjacency list
graph = {
    "Alice":  ["Bob", "Carol"],
    "Bob":    ["Alice", "Dave"],
    "Carol":  ["Alice", "Eve"],
    "Dave":   ["Bob", "Frank"],
    "Eve":    ["Carol", "Frank"],
    "Frank":  ["Dave", "Eve"],
}

class Node:
    def __init__(self, state, parent, action):
        self.state  = state
        self.parent = parent
        self.action = action

def build_path(node):
    path = []
    while node.parent:
        path.append(node.state)
        node = node.parent
    path.reverse()
    return path

class QueueFrontier:
    def __init__(self):
        self.frontier = []
    def add(self, node):
        self.frontier.append(node)
    def contains_state(self, state):
        return any(n.state == state for n in self.frontier)
    def empty(self):
        return len(self.frontier) == 0
    def remove(self):
        node = self.frontier[0]
        self.frontier = self.frontier[1:]
        return node

def search(start, goal, Frontier):
    frontier = Frontier()
    frontier.add(Node(start, None, None))
    explored = set()

    while not frontier.empty():
        node = frontier.remove()
        if node.state == goal:
            return build_path(node)
        explored.add(node.state)
        for neighbor in graph[node.state]:
            if neighbor not in explored and not frontier.contains_state(neighbor):
                frontier.add(Node(neighbor, node, neighbor))
    return None

path = search("Alice", "Frank", QueueFrontier)
print(path)   # ['Carol', 'Eve', 'Frank']  or  ['Bob', 'Dave', 'Frank']
\`\`\`

**What changed vs. the maze, and what didn't:**

| | Maze | Friend network |
|---|---|---|
| State | \`(row, col)\` tuple | person's name (string) |
| \`actions()\` | check 4 grid neighbors | look up \`graph[state]\` |
| \`Node\`, \`search()\`, \`build_path()\` | — | **identical, untouched** |

The algorithm is completely reusable — you only swap out the graph definition.
`;

// ─────────────────────────────────────────────────────────────────────────────
// Example 2
// ─────────────────────────────────────────────────────────────────────────────
const example2 = `
## Example 2 — Stone Game (Minimax)

Two players alternate taking 1 or 2 stones. The player who takes the last stone wins. Minimax solves it perfectly.

\`\`\`python
def initial_state(n):
    return (n, "A")       # (stones_remaining, whose_turn)

def player(state):
    return state[1]

def actions(state):
    stones = state[0]
    return [m for m in [1, 2] if m <= stones]

def result(state, action):
    stones, turn = state
    return (stones - action, "B" if turn == "A" else "A")

def terminal(state):
    return state[0] == 0

def utility(state, winner):
    last_mover = "B" if player(state) == "A" else "A"
    return 1 if last_mover == winner else -1

def minimax(state):
    if player(state) == "A":   # maximiser
        best_value, best_move = -float("inf"), None
        for action in actions(state):
            value = min_value(result(state, action))
            if value > best_value:
                best_value, best_move = value, action
    else:
        best_value, best_move = float("inf"), None
        for action in actions(state):
            value = max_value(result(state, action))
            if value < best_value:
                best_value, best_move = value, action
    return best_move

def max_value(state):
    if terminal(state):
        return utility(state, "B" if player(state) == "A" else "A")
    v = -float("inf")
    for action in actions(state):
        v = max(v, min_value(result(state, action)))
    return v

def min_value(state):
    if terminal(state):
        return utility(state, "B" if player(state) == "A" else "A")
    v = float("inf")
    for action in actions(state):
        v = min(v, max_value(result(state, action)))
    return v

# Run the game
state = initial_state(7)
while not terminal(state):
    move = minimax(state)
    print(f"Player {player(state)} takes {move} stone(s), {state[0] - move} left")
    state = result(state, move)

winner = "B" if player(state) == "A" else "A"
print("Winner:", winner)
\`\`\`

**What changed vs. Tic-Tac-Toe, and what didn't:**

| | Tic-Tac-Toe | Stone game |
|---|---|---|
| State | 3x3 board | \`(stones_remaining, turn)\` tuple |
| \`actions()\` | empty cells | \`[1, 2]\` filtered by what's left |
| \`result()\` | place mark, deepcopy board | subtract stones, switch turn |
| \`terminal()\` | 3-in-a-row or board full | \`stones == 0\` |
| \`utility()\` | check who made 3-in-a-row | check who took the last stone |
| \`minimax()\`, \`max_value()\`, \`min_value()\` | — | **identical shape, untouched** |

The Minimax skeleton never changes. Every new two-player game just needs its own four functions — write those and Minimax works immediately.
`;

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function Day1Page() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes" | "project" | "example1" | "example2">("notes");
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const unlocked = sessionStorage.getItem("aief_unlocked_day1");
    if (unlocked !== "1") {
      router.push("/AIEF");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#090909" }} />
    );
  }

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
                background: "#DFFF00",
                border: "1px solid #DFFF00",
                color: "#000000",
                letterSpacing: "0.04em",
              }}
            >
              DAY 1
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
            day={1}
            totalDays={15}
            title="Welcome to Day 1"
            subtitle="Today you'll begin your journey into Artificial Intelligence by understanding how intelligent systems solve problems using search algorithms. This is the foundation behind maps, games, robotics, and modern AI."
            duration="≈2-3 Hours"
            course="Harvard CS50 AI"
            focus="Search"
            difficulty="Beginner"
          />

          {/* Objectives */}
          <div style={{ marginTop: 80 }}>
            <Checklist items={objectives} />
          </div>

          {/* Video */}
          <div style={{ marginTop: 100 }}>
            <VideoEmbed
              embedSrc="https://www.youtube-nocookie.com/embed/WbzNRTTrX0g?si=Q9jIWOv-kzueRW9b"
              title="CS50 AI — Search Algorithms"
            />
          </div>

          {/* Implementation Notes + Tabs */}
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
              {(["notes", "project", "example1", "example2"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
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
                    background: activeTab === tab ? "#10B981" : "transparent",
                    color: activeTab === tab ? "#000000" : "#52525b",
                  }}
                >
                  {tab === "notes" ? "NOTES" : tab === "project" ? "PROJECT" : tab === "example1" ? "EXAMPLE 1" : "EXAMPLE 2"}
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
              <MarkdownViewer
                content={
                  activeTab === "notes" ? implementationNotes
                  : activeTab === "project" ? projectDetails
                  : activeTab === "example1" ? example1
                  : example2
                }
              />
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
              Day 1 Project
            </h2>
            <p style={{ fontSize: 13.5, color: "#52525b", marginBottom: 28 }}>
              Build two real AI applications using everything learned today.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              <ProjectCard
                title="Maze Solver"
                description="Build a maze-solving AI capable of comparing DFS, BFS, Greedy Search, and A* on the same maze while measuring path quality and explored states."
                skills={["DFS", "BFS", "Greedy", "A*", "Heuristics", "Priority Queue", "Search Trees"]}
              />
              <ProjectCard
                title="Unbeatable Tic Tac Toe"
                description="Build an AI opponent using Minimax and Alpha-Beta Pruning that can never lose a game of Tic Tac Toe."
                skills={["Game Trees", "Minimax", "Alpha-Beta", "Evaluation Fn", "Game AI"]}
              />
            </div>
          </div>

          {/* Warning */}
          <div style={{ marginTop: 80 }}>
            <PremiumWarning title="Before You Start Coding">
              <p>Do <strong>NOT</strong> use AI to generate today&apos;s code.</p>
              <p>Write every implementation yourself. Struggle. Debug. Learn.</p>
              <p>Once you truly understand how the algorithms work, AI becomes a powerful accelerator instead of a dependency.</p>
              <p style={{ fontWeight: 600, color: "#f0f0f0", marginTop: 8 }}>Engineers build first. AI assists later.</p>
            </PremiumWarning>
          </div>

          {/* GitHub Submit */}
          <div id="submit" style={{ marginTop: 80, scrollMarginTop: 72 }}>
            <GitHubSubmit
              format="DAY1_{ROLLNUM}"
              example="DAY1_KAIEF2601"
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
                You&apos;ve completed Day 1 of AI Engineering Foundations. Tomorrow you&apos;ll continue with deeper
                concepts and more hands-on implementation.
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
