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
      // Add timeout to prevent infinite loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

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

  if (backendStatus === "checking") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Awakening Sentify...
          </h2>
          <p className="text-gray-400">Preparing the AI for your analysis</p>
        </div>
      </div>
    );
  }

  if (backendStatus === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-red-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Backend Connection Failed
          </h2>
          <p className="text-gray-300 mb-4">
            Unable to connect to Sentify backend. Please ensure the backend
            server is running on port 8000.
          </p>
          {retryCount > 0 && (
            <p className="text-gray-400 mb-4 text-sm">
              Retry attempt: {retryCount}
            </p>
          )}
          <div className="space-y-3">
            <button
              onClick={retryConnection}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Retry Connection
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <Brain className="w-8 h-8 text-purple-400" />
              <span className="text-xl font-bold gradient-text">Sentify</span>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToApp}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              Try Sentify
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-16 min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
              Unlock the <span className="gradient-text">Power</span> of{" "}
              <span className="gradient-text">Sentiment</span>
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Advanced AI-powered sentiment analysis for text and YouTube
              comments. Discover what people really think with our cutting-edge
              technology.
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
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 text-lg font-semibold"
              >
                <Sparkles className="w-5 h-5 inline mr-2" />
                Start Analyzing
              </motion.button>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center text-gray-400"
              >
                <ArrowDown className="w-5 h-5 mr-2" />
                <span>Scroll to explore</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main App Section */}
      <section id="app-section" className="py-20 bg-slate-900">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">Sentify</h1>
            <p className="text-xl text-gray-300">
              Analyze sentiment of text or YouTube video comments
            </p>
            <div className="mt-2 flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-green-400">Backend connected</span>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-slate-800 rounded-lg p-1 border border-purple-500/20">
              <button
                onClick={() => setActiveTab("text")}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === "text"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                <FileText className="w-4 h-4" />
                Text Analysis
              </button>
              <button
                onClick={() => setActiveTab("youtube")}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === "youtube"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                <Youtube className="w-4 h-4" />
                YouTube Analysis
              </button>
            </div>
          </motion.div>

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
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 text-center text-sm text-gray-500"
        >
          <p>
            Powered by Hugging Face & YouTube API • Built with Next.js & FastAPI
          </p>
        </motion.div>
      </section>
    </div>
  );
}
