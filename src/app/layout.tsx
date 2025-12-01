import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Navbar from "@/components/Navbar";
import TrendingTags from "@/components/TrendingTags";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-main",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TrendPoll | The Pulse of Now",
  description: "Vote on trending topics, track your prediction accuracy, and climb the Oracle leaderboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.variable}>
        <div className="app-wrapper">
          <Navbar />
          <TrendingTags />
          {children}
        </div>
      </body>
    </html>
  );
}
