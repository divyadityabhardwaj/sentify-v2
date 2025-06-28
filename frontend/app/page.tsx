"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface SentimentResult {
  text: string;
  sentiment: string;
  confidence: number;
}

interface PingResult {
  message: string;
  timestamp: string;
  status: string;
}

interface CommentSentiment {
  text: string;
  sentiment: string;
  confidence: number;
  positive_score: number;
  negative_score: number;
}

interface YouTubeAnalysisResult {
  video_id: string;
  total_comments: number;
  processed_comments: number;
  failed_comments: number;
  positive_count: number;
  negative_count: number;
  positive_percentage: number;
  negative_percentage: number;
  comments: CommentSentiment[];
  top_positive_comments: CommentSentiment[];
  top_negative_comments: CommentSentiment[];
}

export default function Home() {
  const [text, setText] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [youtubeResult, setYoutubeResult] =
    useState<YouTubeAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "awake" | "error"
  >("checking");
  const [activeTab, setActiveTab] = useState<"text" | "youtube">("text");

  // Ping backend on component mount
  useEffect(() => {
    const pingBackend = async () => {
      try {
        const response = await axios.get<PingResult>("/api/ping");
        console.log("Backend ping response:", response.data);
        setBackendStatus("awake");
      } catch (err) {
        console.error("Backend ping failed:", err);
        setBackendStatus("error");
      }
    };

    pingBackend();
  }, []);

  const analyzeSentiment = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setYoutubeResult(null);

    try {
      const response = await axios.post("/api/sentiment", {
        text: text.trim(),
      });
      setResult(response.data);
    } catch (err) {
      console.error("Error analyzing sentiment:", err);
      setError("Failed to analyze sentiment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const analyzeYouTubeComments = async () => {
    if (!youtubeUrl.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setYoutubeResult(null);

    try {
      const response = await axios.post("/api/youtube/analyze", {
        video_url: youtubeUrl.trim(),
      });
      setYoutubeResult(response.data);
    } catch (err: any) {
      console.error("Error analyzing YouTube comments:", err);
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
        return "text-green-600 bg-green-100";
      case "negative":
        return "text-red-600 bg-red-100";
      case "neutral":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
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

  // Show loading screen while checking backend status
  if (backendStatus === "checking") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Waiting for backend to wake up...
          </h2>
          <p className="text-gray-500">
            This may take a few seconds on first load
          </p>
        </div>
      </div>
    );
  }

  // Show error screen if backend is not available
  if (backendStatus === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Backend Unavailable
          </h2>
          <p className="text-gray-500 mb-4">
            Unable to connect to the backend service. Please try refreshing the
            page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sentify</h1>
          <p className="text-xl text-gray-600">
            Analyze sentiment of text or YouTube video comments
          </p>
          <div className="mt-2 flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-green-600">Backend connected</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab("text")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "text"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📝 Text Analysis
            </button>
            <button
              onClick={() => setActiveTab("youtube")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "youtube"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              🎥 YouTube Comments
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          {activeTab === "text" ? (
            // Text Analysis Tab
            <>
              <div className="mb-6">
                <label
                  htmlFor="text"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Enter your text
                </label>
                <textarea
                  id="text"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type or paste your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <div className="flex justify-center mb-8">
                <button
                  onClick={analyzeSentiment}
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Analyzing..." : "Analyze Sentiment"}
                </button>
              </div>

              {result && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Analysis Result
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Original Text
                      </label>
                      <p className="text-gray-900 bg-white p-3 rounded border">
                        {result.text}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confidence
                        </label>
                        <div className="bg-white p-3 rounded border">
                          <span className="text-lg font-semibold text-blue-600">
                            {(result.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            // YouTube Analysis Tab
            <>
              <div className="mb-6">
                <label
                  htmlFor="youtube-url"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  YouTube Video URL
                </label>
                <input
                  id="youtube-url"
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
              </div>

              <div className="flex justify-center mb-8">
                <button
                  onClick={analyzeYouTubeComments}
                  disabled={loading}
                  className="px-8 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading
                    ? "Analyzing Comments..."
                    : "Analyze YouTube Comments"}
                </button>
              </div>

              {youtubeResult && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    YouTube Analysis Result
                  </h3>

                  <div className="space-y-6">
                    {/* Processing Stats */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-blue-800 mb-2">
                        Processing Statistics
                      </h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-600">
                            {youtubeResult.total_comments}
                          </div>
                          <div className="text-sm text-blue-700">
                            Total Comments
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">
                            {youtubeResult.processed_comments}
                          </div>
                          <div className="text-sm text-green-700">
                            Successfully Processed
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-red-600">
                            {youtubeResult.failed_comments}
                          </div>
                          <div className="text-sm text-red-700">
                            Failed to Process
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {youtubeResult.processed_comments}
                        </div>
                        <div className="text-sm text-gray-600">
                          Analyzed Comments
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {youtubeResult.positive_count}
                        </div>
                        <div className="text-sm text-gray-600">Positive</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {youtubeResult.negative_count}
                        </div>
                        <div className="text-sm text-gray-600">Negative</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {youtubeResult.positive_percentage.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Positive %</div>
                      </div>
                    </div>

                    {/* Top Comments */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-md font-semibold text-green-700 mb-3">
                          Top Positive Comments
                        </h4>
                        <div className="space-y-2">
                          {youtubeResult.top_positive_comments.map(
                            (comment, index) => (
                              <div
                                key={index}
                                className="bg-white p-3 rounded border-l-4 border-green-500"
                              >
                                <p className="text-sm text-gray-800 mb-1">
                                  {comment.text}
                                </p>
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>
                                    Confidence:{" "}
                                    {(comment.confidence * 100).toFixed(1)}%
                                  </span>
                                  <span>
                                    Score:{" "}
                                    {(comment.positive_score * 100).toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-md font-semibold text-red-700 mb-3">
                          Top Negative Comments
                        </h4>
                        <div className="space-y-2">
                          {youtubeResult.top_negative_comments.map(
                            (comment, index) => (
                              <div
                                key={index}
                                className="bg-white p-3 rounded border-l-4 border-red-500"
                              >
                                <p className="text-sm text-gray-800 mb-1">
                                  {comment.text}
                                </p>
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>
                                    Confidence:{" "}
                                    {(comment.confidence * 100).toFixed(1)}%
                                  </span>
                                  <span>
                                    Score:{" "}
                                    {(comment.negative_score * 100).toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Powered by Hugging Face & YouTube API • Built with Next.js & FastAPI
          </p>
        </div>
      </div>
    </div>
  );
}
