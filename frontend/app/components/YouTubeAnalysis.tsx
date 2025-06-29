"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Youtube, Play } from "lucide-react";

interface CommentAnalysis {
  text: string;
  sentiment: string;
  confidence: number;
  positive_score: number;
  negative_score: number;
}

interface YouTubeResult {
  video_id: string;
  total_comments: number;
  processed_comments: number;
  failed_comments: number;
  positive_count: number;
  negative_count: number;
  positive_percentage: number;
  negative_percentage: number;
  top_positive_comments: CommentAnalysis[];
  top_negative_comments: CommentAnalysis[];
}

export default function YouTubeAnalysis() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<YouTubeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeYouTubeComments = async () => {
    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    // Basic YouTube URL validation
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(url.trim())) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await axios.post("/api/youtube/analyze", {
        video_url: url.trim(),
      });
      setResult(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Failed to analyze YouTube comments. Please try again."
      );
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
          htmlFor="youtube-url"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          YouTube Video URL
        </label>
        <div className="flex gap-2">
          <input
            id="youtube-url"
            type="url"
            className="flex-1 px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-slate-700 text-white"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <motion.button
            onClick={analyzeYouTubeComments}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-md hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Youtube className="w-4 h-4" />
                Analyze
              </>
            )}
          </motion.button>
        </div>
        <label
          htmlFor="youtube-url"
          className="block text-sm font-medium text-gray-300 mb-2 mt-4"
        >
          *Videos with more than 1000 comments may take longer to analyze
        </label>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Video Info */}
          <div className="bg-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-red-400" />
              Video Analysis
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Video ID
                </label>
                <p className="text-gray-100 bg-slate-600 p-3 rounded border">
                  {result.video_id}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Total Comments
                  </label>
                  <div className="bg-slate-600 p-3 rounded border">
                    <span className="text-lg font-semibold text-purple-400">
                      {result.total_comments}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Processed Comments
                  </label>
                  <div className="bg-slate-600 p-3 rounded border">
                    <span className="text-lg font-semibold text-blue-400">
                      {result.processed_comments}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Failed Comments
                  </label>
                  <div className="bg-slate-600 p-3 rounded border">
                    <span className="text-lg font-semibold text-red-400">
                      {result.failed_comments}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sentiment Distribution */}
          <div className="bg-slate-700 rounded-lg p-6">
            <h4 className="text-md font-semibold text-white mb-4">
              Sentiment Distribution
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {result.positive_count}
                </div>
                <div className="text-sm text-gray-400">
                  Positive ({result.positive_percentage.toFixed(1)}%)
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">
                  {result.negative_count}
                </div>
                <div className="text-sm text-gray-400">
                  Negative ({result.negative_percentage.toFixed(1)}%)
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Summary */}
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-6 border border-purple-500/20">
            <h4 className="text-lg font-semibold text-white mb-4 text-center">
              📊 Analysis Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-400">
                  {result.total_comments}
                </div>
                <div className="text-sm text-gray-300">Total Comments</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">
                  {result.processed_comments}
                </div>
                <div className="text-sm text-gray-300">
                  Successfully Analyzed
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">
                  {result.positive_percentage > result.negative_percentage
                    ? "😊"
                    : "😞"}
                </div>
                <div className="text-sm text-gray-300">
                  {result.positive_percentage > result.negative_percentage
                    ? "Overall Positive"
                    : "Overall Negative"}
                </div>
              </div>
            </div>
          </div>

          {/* Top Comments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Positive Comments */}
            <div className="bg-slate-700 rounded-lg p-6">
              <h4 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-green-400">😊</span>
                Top Positive Comments ({result.top_positive_comments.length})
              </h4>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {result.top_positive_comments.length > 0 ? (
                  result.top_positive_comments.map((comment, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-600 p-3 rounded border border-green-500/20"
                    >
                      <p className="text-gray-100 text-sm mb-2">
                        {comment.text}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-green-400 text-xs font-medium">
                          Confidence: {(comment.confidence * 100).toFixed(1)}%
                        </span>
                        <span className="text-xs text-gray-400">
                          +{(comment.positive_score * 100).toFixed(1)}%
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <p>No positive comments found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Negative Comments */}
            <div className="bg-slate-700 rounded-lg p-6">
              <h4 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-red-400">😞</span>
                Top Negative Comments ({result.top_negative_comments.length})
              </h4>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {result.top_negative_comments.length > 0 ? (
                  result.top_negative_comments.map((comment, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-600 p-3 rounded border border-red-500/20"
                    >
                      <p className="text-gray-100 text-sm mb-2">
                        {comment.text}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-red-400 text-xs font-medium">
                          Confidence: {(comment.confidence * 100).toFixed(1)}%
                        </span>
                        <span className="text-xs text-gray-400">
                          -{(comment.negative_score * 100).toFixed(1)}%
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <p>No negative comments found</p>
                  </div>
                )}
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
