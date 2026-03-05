import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { YTWallahProvider } from "@/contexts/YTWallahContext";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "YT Wallah — Distraction-Free Physics Wallah Content",
  description: "Access all Physics Wallah YouTube content in one place. No distractions, just pure learning. Watch lectures, live classes, and shorts from all PW channels.",
  keywords: ["physics wallah", "PW", "JEE", "NEET", "youtube", "lectures", "free education", "YT Wallah"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <YTWallahProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </YTWallahProvider>
      </body>
    </html>
  );
}
