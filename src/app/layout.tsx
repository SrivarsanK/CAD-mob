import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Import only available fonts
import "./globals.css";
import ClaudeNavbar from "@/components/layout/v2/ClaudeNavbar";
// Sidebar is kept but might be visually redundant with new navbar, will refine later
import Sidebar from "@/components/layout/Sidebar";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CAD-Mob Mobility Forecasting",
  description: "Predicting the Flow of the Future",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased overflow-hidden selection:bg-purple-500/30 selection:text-white`}
      >
        <div className="mesh-gradient-bg" />

        {/* Static Shell */}
        <ClaudeNavbar />
        {/* <Sidebar /> Hidden for v2 overhaul to focus on clean horizontal nav */}


        <main className="relative w-full h-full">
          {children}
        </main>
      </body>
    </html>
  );
}
