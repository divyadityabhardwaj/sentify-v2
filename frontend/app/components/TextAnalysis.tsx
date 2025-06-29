"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

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
        return "text-green-400 bg-green-900/20";
      case "negative":
        return "text-red-400 bg-red-900/20";
      case "neutral":
        return "text-gray-400 bg-gray-900/20";
      default:
        return "text-gray-400 bg-gray-900/20";
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
      className="bg-slate-800 rounded-lg shadow-xl p-8 border border-purple-500/20"
    >
      <div className="mb-6">
        <label
          htmlFor="text"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Enter your text
        </label>
        <textarea
          id="text"
          rows={6}
          className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-slate-700 text-white"
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
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-md hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {loading ? "Analyzing..." : "Analyze Sentiment"}
        </motion.button>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-700 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Analysis Result
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Original Text
              </label>
              <p className="text-gray-100 bg-slate-600 p-3 rounded border">
                {result.text}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Sentiment
                </label>
                <div
                  className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getSentimentColor(
                    result.sentiment
                  )}`}
                >
                  <span className="mr-2">
                    {getSentimentEmoji(result.sentiment)}
                  </span>
                  {result.sentiment.charAt(0).toUpperCase() +
                    result.sentiment.slice(1)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Confidence
                </label>
                <div className="bg-slate-600 p-3 rounded border">
                  <span className="text-lg font-semibold text-purple-400">
                    {(result.confidence * 100).toFixed(1)}%
                  </span>
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
          className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg"
        >
          <p className="text-red-400">{error}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
