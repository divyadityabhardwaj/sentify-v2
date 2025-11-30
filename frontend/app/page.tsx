"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Brain, ArrowDown, FileText, Youtube } from "lucide-react";
import TextAnalysis from "./components/TextAnalysis";
import YouTubeAnalysis from "./components/YouTubeAnalysis";
import {
  Navbar,
  NavBody,
  NavbarLogo,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarButton,
} from "./components/Navbar";

import AnimatedGradientBackground from "./components/ui/animated-gradient-background";
import HeroSection from "./components/HeroSection";

interface PingResult {
  message: string;
  timestamp: string;
  status: string;
}

type AnalysisTab = "text" | "youtube";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "connected" | "error"
  >("checking");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AnalysisTab>("text");

  useEffect(() => {
    // Check backend health on mount
    const checkBackend = async () => {
      try {
        await axios.get("/api/ping"); // Changed from /api/health to /api/ping to match original code's endpoint
        setBackendStatus("connected");
      } catch (err) {
        console.error("Backend health check failed:", err);
        setBackendStatus("error");
      }
    };
    checkBackend();
  }, []);

  const scrollToApp = () => {
    const appElement = document.getElementById("app-section");
    if (appElement) {
      appElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (backendStatus === "error") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-xl font-semibold text-white">
            Backend Unavailable
          </h2>
          <p className="text-gray-400">
            Please ensure the backend server is running.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#3b82f6] selection:text-white">
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavbarButton onClick={scrollToApp} variant="gradient">
            Try Sentify
          </NavbarButton>
        </NavBody>
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex flex-col items-start space-y-4 w-full">
              <NavbarButton
                onClick={() => {
                  scrollToApp();
                  setIsMobileMenuOpen(false);
                }}
                variant="gradient"
                className="w-full"
              >
                Try Sentify
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Hero Section */}
      <section className="pt-16 min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated Gradient Background */}
        <AnimatedGradientBackground
          startingGap={125}
          Breathing={true}
          animationSpeed={0.01}
          breathingRange={10}
          gradientColors={[
            "#0A0A0A", // Black center
            "#1e3a8a", // Deep Blue
            "#06b6d4", // Cyan
            "#FF80AB", // Pink/Red
            "#FF6D00", // Orange
            "#000000", // Fade to black
          ]}
          gradientStops={[0, 20, 40, 60, 80, 100]}
        />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none z-10"
          style={{
            backgroundImage:
              "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        ></div>

        {/* Floating Hero Component */}
        <HeroSection onStartClick={scrollToApp} />
      </section>

      {/* Main App Section */}
      <section id="app-section" className="py-20 bg-[#0a0a0a]">
        <div className="container-70">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Sentiment Analysis
              </h2>
              <p className="text-xl text-[#a0a0a0]">
                Analyze text or YouTube video comments with AI
              </p>
              <div className="mt-4 flex items-center justify-center">
                <div className="w-2 h-2 bg-[#06b6d4] rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm text-[#06b6d4]">
                  Backend connected
                </span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-[#1e1e1e] rounded-xl p-1.5 border border-[#2a2a2a] inline-flex">
                <button
                  onClick={() => setActiveTab("text")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeTab === "text"
                      ? "bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                      : "text-[#a0a0a0] hover:text-white hover:bg-[#252525]"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Text Analysis
                </button>
                <button
                  onClick={() => setActiveTab("youtube")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeTab === "youtube"
                      ? "bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                      : "text-[#a0a0a0] hover:text-white hover:bg-[#252525]"
                  }`}
                >
                  <Youtube className="w-4 h-4" />
                  YouTube Analysis
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "text" ? <TextAnalysis /> : <YouTubeAnalysis />}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16 text-center text-sm text-[#6b6b6b]"
          >
            <p>
              Powered by Advanced Sentiment Analysis & YouTube API • Built with
              Next.js & FastAPI
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
