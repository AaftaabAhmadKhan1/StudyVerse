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
  title: "PW StudyVerse — Focused Learning Companion for PW Content",
  description:
    "PW StudyVerse helps students discover and watch PW YouTube lectures in a cleaner study workflow using official YouTube embeds and API-powered organization.",
  keywords: ["physics wallah", "PW", "JEE", "NEET", "youtube", "lectures", "free education", "PW StudyVerse"],
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
          <AuthProvider>{children}</AuthProvider>
        </YTWallahProvider>
      </body>
    </html>
  );
}
