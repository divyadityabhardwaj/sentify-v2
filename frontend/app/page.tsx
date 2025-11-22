"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Brain, Sparkles, ArrowDown, FileText, Youtube } from "lucide-react";
import TextAnalysis from "./components/TextAnalysis";
import YouTubeAnalysis from "./components/YouTubeAnalysis";

interface PingResult {
  message: string;
  timestamp: string;
  status: string;
}

type AnalysisTab = "text" | "youtube";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "awake" | "error"
  >("checking");
  const [showApp, setShowApp] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [activeTab, setActiveTab] = useState<AnalysisTab>("text");

  const pingBackend = async () => {
    try {
      setBackendStatus("checking");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await axios.get<PingResult>("/api/ping", {
        signal: controller.signal,
        timeout: 5000,
      });

      clearTimeout(timeoutId);
      setBackendStatus("awake");
    } catch (err) {
      console.error("Backend ping failed:", err);
      setBackendStatus("error");
    }
  };

  const retryConnection = () => {
    setRetryCount((prev) => prev + 1);
    pingBackend();
  };

  useEffect(() => {
    pingBackend();
  }, []);

  const scrollToApp = () => {
    setShowApp(true);
    setTimeout(() => {
      document
        .getElementById("app-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };



  if (backendStatus === "error") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-[#1e1e1e] rounded-xl border border-[#2a2a2a]">
          <div className="text-[#f97316] text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-white mb-3">
            Connection Failed
          </h2>
          <p className="text-[#a0a0a0] mb-6">
            Unable to connect to Sentify backend. Please ensure the backend
            server is running on port 8000.
          </p>
          {retryCount > 0 && (
            <p className="text-[#6b6b6b] mb-4 text-sm">
              Retry attempt: {retryCount}
            </p>
          )}
          <div className="space-y-3">
            <button
              onClick={retryConnection}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] text-white rounded-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300 font-medium"
            >
              Retry Connection
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-2 bg-[#1a1a1a] text-[#a0a0a0] rounded-lg hover:bg-[#252525] hover:text-white transition-all duration-300 text-sm border border-[#2a2a2a]"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Fixed Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#2a2a2a]"
      >
        <div className="container-70">
          <div className="flex justify-between items-center h-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <Brain className="w-8 h-8 text-[#3b82f6]" />
              <span className="text-xl font-bold gradient-text">Sentify</span>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToApp}
              className="px-6 py-2 bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] text-white rounded-lg font-medium hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300"
            >
              Try Sentify
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-16 min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0f1419] to-[#0a0a0a]"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>

        <div className="relative z-10 container-70 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Decode <span className="gradient-text">Sentiment</span>
              <br />
              with <span className="gradient-text">AI Precision</span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-[#a0a0a0] mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Advanced RoBERTa-powered sentiment analysis for text and YouTube
              comments. Fast, accurate, and completely free.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToApp}
                className="px-8 py-4 bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] text-white rounded-lg font-semibold text-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Start Analyzing
              </motion.button>
              
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center text-[#6b6b6b]"
              >
                <ArrowDown className="w-5 h-5 mr-2" />
                <span>Scroll to explore</span>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            >
              <div className="bg-[#1e1e1e] p-6 rounded-xl border border-[#2a2a2a]">
                <div className="text-3xl font-bold gradient-text mb-2">500x</div>
                <div className="text-[#a0a0a0] text-sm">Faster Processing</div>
              </div>
              <div className="bg-[#1e1e1e] p-6 rounded-xl border border-[#2a2a2a]">
                <div className="text-3xl font-bold gradient-text mb-2">$0</div>
                <div className="text-[#a0a0a0] text-sm">API Costs</div>
              </div>
              <div className="bg-[#1e1e1e] p-6 rounded-xl border border-[#2a2a2a]">
                <div className="text-3xl font-bold gradient-text mb-2">∞</div>
                <div className="text-[#a0a0a0] text-sm">No Rate Limits</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
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
                <span className="text-sm text-[#06b6d4]">Backend connected</span>
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
              Powered by RoBERTa Sentiment Analysis & YouTube API • Built with Next.js & FastAPI
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
