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
  title: "Knots Systems",
  description: "The future of engineering education. Build real systems.",
  openGraph: {
    title: "Knots Systems",
    description: "The future of engineering education. Build real systems.",
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
