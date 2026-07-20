import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LenisWrapper from "@/components/LenisWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://knots.systems"),
  title: "Knots Systems | AI Engineering Foundations",
  description: "The future of engineering education. Build real systems, learn Artificial Intelligence, and master computer science fundamentals through hands-on projects.",
  keywords: [
    "Knots Systems", "Knots", "KnotsSystems", "Muneeb", "AI Engineering Foundations", "AI Engineering", 
    "Learn AI", "Software Engineering", "Developer Education", "Coding Platform", "Tech Education",
    "Artificial Intelligence", "Machine Learning", "Deep Learning", "Neural Networks", "NLP",
    "CS50", "CS50 AI", "Harvard CS50", "CS50x", "CS50W", "Introduction to AI",
    "Search Algorithms", "Depth-First Search", "DFS", "Breadth-First Search", "BFS",
    "Greedy Best-First Search", "A* Search", "A Star Algorithm", "Heuristics", "Search Trees",
    "Game AI", "Minimax", "Alpha-Beta Pruning", "Evaluation Functions", "Depth-Limited Search",
    "Python", "Python Programming", "Learn Python", "Python AI", "Python Algorithms",
    "JavaScript", "TypeScript", "React", "Next.js", "NextJS App Router", "Vercel",
    "Web Development", "Full Stack Development", "Frontend Development", "Backend Development",
    "System Design", "Build Real Systems", "Project-Based Learning", "Coding Projects",
    "Maze Solver", "Tic Tac Toe AI", "Unbeatable AI", "Game Trees", "Graph Theory",
    "Computer Science", "Computer Science Fundamentals", "Data Structures", "Algorithms",
    "Learn to Code", "Programming", "Coder", "Developer Portfolio", "GitHub", "Git",
    "SaaS Platform", "Premium Developer Platform", "Tech Career", "Software Developer",
    "Web App", "UI/UX", "Modern Web Design", "Framer Motion", "React Components",
    "Engineering", "Software Architecture", "Code First", "Practical AI", "AI Projects",
    "Machine Learning Projects", "Coding Bootcamp Alternative", "Self-Taught Developer",
    "Tech Skills", "Future of Education", "Interactive Learning", "Learn by Building",
    "Knots Course", "Knots AI", "Day 1 AI", "Day 2 AI", "Day 3 AI"
  ],
  authors: [{ name: "Knots Systems" }],
  openGraph: {
    title: "Knots Systems | AI Engineering Foundations",
    description: "The future of engineering education. Build real systems, learn Artificial Intelligence, and master computer science fundamentals.",
    url: "https://knots.systems",
    siteName: "Knots Systems",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Knots Systems",
    description: "The future of engineering education. Build real systems.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#050505] text-[#F8F8F8] font-sans antialiased overflow-x-hidden">
        <LenisWrapper>
          {children}
        </LenisWrapper>
      </body>
    </html>
  );
}
