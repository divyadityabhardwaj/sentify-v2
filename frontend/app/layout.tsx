import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import GlobalLoader from "./components/GlobalLoader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sentify - Sentiment Analysis",
  description: "Analyze sentiment of your text with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalLoader>{children}</GlobalLoader>
      </body>
    </html>
  );
}
