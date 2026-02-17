import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Import only available fonts
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
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
        <Navbar />
        <Sidebar />

        <main className="relative w-full h-full">
          {children}
        </main>
      </body>
    </html>
  );
}
