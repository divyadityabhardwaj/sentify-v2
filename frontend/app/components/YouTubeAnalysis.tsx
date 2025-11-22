"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Youtube, Play, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-[#1e1e1e] rounded-xl shadow-lg p-8 border border-[#2a2a2a]"
    >
      <div className="mb-6">
        <label
          htmlFor="youtube-url"
          className="block text-sm font-medium text-[#a0a0a0] mb-3"
        >
          YouTube Video URL
        </label>
        <div className="flex gap-3">
          <input
            id="youtube-url"
            type="url"
            className="flex-1 px-4 py-3 border border-[#3a3a3a] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] bg-[#141414] text-white placeholder-[#6b6b6b] transition-all duration-300"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <motion.button
            onClick={analyzeYouTubeComments}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] text-white font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 focus:ring-offset-[#1e1e1e] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Youtube className="w-5 h-5" />
                Analyze
              </>
            )}
          </motion.button>
        </div>
        <p className="text-xs text-[#6b6b6b] mt-2">
          * Videos with many comments may take a few seconds to analyze
        </p>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Video Info */}
          <div className="bg-[#141414] rounded-lg p-6 border border-[#2a2a2a]">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-[#3b82f6]" />
              Video Analysis
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                  Video ID
                </label>
                <p className="text-white bg-[#1a1a1a] p-3 rounded-lg border border-[#2a2a2a] font-mono text-sm">
                  {result.video_id}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                    Total Comments
                  </label>
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
                    <span className="text-2xl font-bold gradient-text">
                      {result.total_comments}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                    Processed
                  </label>
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
                    <span className="text-2xl font-bold text-[#06b6d4]">
                      {result.processed_comments}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                    Failed
                  </label>
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
                    <span className="text-2xl font-bold text-[#f97316]">
                      {result.failed_comments}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sentiment Distribution */}
          <div className="bg-[#141414] rounded-lg p-6 border border-[#2a2a2a]">
            <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#3b82f6]" />
              Sentiment Distribution
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#06b6d4]/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#06b6d4]" />
                    <span className="text-[#a0a0a0] text-sm font-medium">Positive</span>
                  </div>
                  <span className="text-[#06b6d4] text-sm font-semibold">
                    {result.positive_percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="text-3xl font-bold text-[#06b6d4] mb-2">
                  {result.positive_count}
                </div>
                <div className="w-full bg-[#2a2a2a] rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.positive_percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-[#06b6d4] rounded-full"
                  ></motion.div>
                </div>
              </div>
              <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#f97316]/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-[#f97316]" />
                    <span className="text-[#a0a0a0] text-sm font-medium">Negative</span>
                  </div>
                  <span className="text-[#f97316] text-sm font-semibold">
                    {result.negative_percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="text-3xl font-bold text-[#f97316] mb-2">
                  {result.negative_count}
                </div>
                <div className="w-full bg-[#2a2a2a] rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.negative_percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-[#f97316] rounded-full"
                  ></motion.div>
                </div>
              </div>
            </div>

            {/* Overall Sentiment */}
            <div className="mt-6 text-center p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
              <div className="text-4xl mb-2">
                {result.positive_percentage > result.negative_percentage ? "😊" : "😞"}
              </div>
              <div className="text-sm text-[#a0a0a0]">
                Overall {result.positive_percentage > result.negative_percentage ? "Positive" : "Negative"} Sentiment
              </div>
            </div>
          </div>

          {/* Top Comments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Positive Comments */}
            <div className="bg-[#141414] rounded-lg p-6 border border-[#2a2a2a]">
              <h4 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#06b6d4]" />
                Top Positive Comments ({result.top_positive_comments.length})
              </h4>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {result.top_positive_comments.length > 0 ? (
                  result.top_positive_comments.map((comment, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-[#1a1a1a] p-4 rounded-lg border border-[#06b6d4]/20 hover:border-[#06b6d4]/40 transition-all duration-300"
                    >
                      <p className="text-white text-sm mb-3 leading-relaxed">
                        {comment.text}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-[#06b6d4] text-xs font-semibold">
                          {(comment.confidence * 100).toFixed(1)}% confident
                        </span>
                        <span className="text-xs text-[#6b6b6b]">
                          +{(comment.positive_score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-[#6b6b6b] py-12">
                    <p>No positive comments found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Negative Comments */}
            <div className="bg-[#141414] rounded-lg p-6 border border-[#2a2a2a]">
              <h4 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-[#f97316]" />
                Top Negative Comments ({result.top_negative_comments.length})
              </h4>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {result.top_negative_comments.length > 0 ? (
                  result.top_negative_comments.map((comment, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-[#1a1a1a] p-4 rounded-lg border border-[#f97316]/20 hover:border-[#f97316]/40 transition-all duration-300"
                    >
                      <p className="text-white text-sm mb-3 leading-relaxed">
                        {comment.text}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-[#f97316] text-xs font-semibold">
                          {(comment.confidence * 100).toFixed(1)}% confident
                        </span>
                        <span className="text-xs text-[#6b6b6b]">
                          -{(comment.negative_score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-[#6b6b6b] py-12">
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
