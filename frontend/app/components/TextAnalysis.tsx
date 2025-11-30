"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SentimentResult {
  text: string;
  sentiment: string;
  confidence: number;
}

export default function TextAnalysis() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeSentiment = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await axios.post("/api/sentiment", {
        text: text.trim(),
      });
      setResult(response.data);
    } catch (err) {
      setError("Failed to analyze sentiment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "text-[#06b6d4] bg-[#06b6d4]/10";
      case "negative":
        return "text-[#f97316] bg-[#f97316]/10";
      case "neutral":
        return "text-[#a0a0a0] bg-[#a0a0a0]/10";
      default:
        return "text-[#a0a0a0] bg-[#a0a0a0]/10";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return <TrendingUp className="w-5 h-5" />;
      case "negative":
        return <TrendingDown className="w-5 h-5" />;
      default:
        return <span className="text-2xl">😐</span>;
    }
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "😊";
      case "negative":
        return "😞";
      case "neutral":
        return "😐";
      default:
        return "🤔";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-[#1e1e1e] rounded-xl shadow-lg p-8 border border-[#2a2a2a]"
    >
      <div className="mb-6">
        <label
          htmlFor="text"
          className="block text-sm font-medium text-[#a0a0a0] mb-3"
        >
          Enter your text
        </label>
        <textarea
          id="text"
          rows={6}
          className="w-full px-4 py-3 border border-[#3a3a3a] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] bg-[#141414] text-white placeholder-[#6b6b6b] transition-all duration-300"
          placeholder="Type or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="flex justify-center mb-8">
        <motion.button
          onClick={analyzeSentiment}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] text-white font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 focus:ring-offset-[#1e1e1e] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Analyzing...
            </>
          ) : (
            <>Analyze Sentiment</>
          )}
        </motion.button>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#141414] rounded-lg p-6 border border-[#2a2a2a]"
        >
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            Analysis Result
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Original Text
              </label>
              <p className="text-white bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
                {result.text}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                  Sentiment
                </label>
                <div
                  className={`inline-flex items-center px-4 py-3 rounded-lg text-sm font-semibold ${getSentimentColor(
                    result.sentiment
                  )} border border-current/20`}
                >
                  <span className="mr-2 text-xl">
                    {getSentimentEmoji(result.sentiment)}
                  </span>
                  {result.sentiment.charAt(0).toUpperCase() +
                    result.sentiment.slice(1)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                  Confidence
                </label>
                <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold gradient-text">
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                    {getSentimentIcon(result.sentiment)}
                  </div>
                  <div className="w-full bg-[#2a2a2a] rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] rounded-full"
                    ></motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-[#f97316]/10 border border-[#f97316]/30 rounded-lg"
        >
          <p className="text-[#f97316] flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            {error}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
