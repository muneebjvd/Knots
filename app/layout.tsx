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
  keywords: ["Knots Systems", "AI Engineering Foundations", "Learn AI", "Software Engineering", "Muneeb", "Developer Education", "Coding Platform"],
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
