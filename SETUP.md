# 🚀 Sentify v2 Setup Guide

## 📋 Prerequisites

- Python 3.8+
- Node.js 18+
- API Keys (see below)

## 🔑 Required API Keys

### 1. Hugging Face API Key

- Go to [Hugging Face](https://huggingface.co/settings/tokens)
- Create a new token
- Copy the token (starts with `hf_`)

### 2. YouTube API Key

- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select existing
- Enable YouTube Data API v3
- Create credentials (API Key)
- Copy the API key

## ⚙️ Environment Setup

1. **Copy environment template:**

   ```bash
   cp env.example .env
   ```

2. **Edit `.env` file in the project root:**
   ```bash
   # Add your API keys
   HUGGINGFACE_API_KEY=your_huggingface_token_here
   YOUTUBE_API_KEY=your_youtube_api_key_here
   BACKEND_URL=http://localhost:8000
   ```

**Note**: You only need **one `.env` file** in the project root. Both frontend and backend will automatically read from it.

## 🛠️ Installation

### Option 1: Using npm scripts (Recommended)

```bash
# Install all dependencies
npm run install:all

# Start both services
npm run dev
```

### Option 2: Using shell script

```bash
# Make script executable
chmod +x start-dev.sh

# Start both services
./start-dev.sh
```

## 🎯 Features

### Text Analysis

- **Hugging Face Model**: `distilbert/distilbert-base-uncased-finetuned-sst-2-english`
- **Accuracy**: High-quality sentiment classification
- **Output**: Positive/Negative with confidence scores

### YouTube Comments Analysis

- **Comment Extraction**: Up to 100 comments per video
- **Sentiment Analysis**: Each comment analyzed individually
- **Top Comments**: Top 5 positive and negative comments
- **Statistics**: Total counts and percentages

## 📊 API Endpoints

- `POST /api/sentiment` - Analyze text sentiment
- `POST /api/youtube/analyze` - Analyze YouTube video comments
- `GET /api/ping` - Health check
- `GET /health` - Service status

## 🎨 Frontend Features

- **Tab Interface**: Switch between text and YouTube analysis
- **Real-time Analysis**: Live sentiment processing
- **Visual Results**: Charts and statistics
- **Responsive Design**: Works on all devices

## 🔧 Troubleshooting

### Common Issues:

1. **"Hugging Face API error"**

   - Check your API key in `.env` (project root)
   - Verify the key starts with `hf_`

2. **"YouTube API error"**

   - Ensure YouTube Data API v3 is enabled
   - Check API key in `.env` (project root)
   - Verify video URL format

3. **"Backend unavailable"**
   - Check if both services are running
   - Verify ports 8000 and 3000 are available

## 🚀 Deployment

The project is configured for Vercel deployment:

- Backend: Python serverless functions
- Frontend: Next.js static generation
- Environment variables: Set in Vercel dashboard

## 📝 Usage Examples

### Text Analysis

```
Input: "I love this amazing product!"
Output: Positive (99.9% confidence)
```

### YouTube Analysis

```
Input: https://www.youtube.com/watch?v=dQw4w9WgXcQ
Output:
- 85 comments analyzed
- 67 positive (78.8%)
- 18 negative (21.2%)
- Top positive/negative comments listed
```

## 📁 Project Structure

```
sentify-v2/
├── .env                    # Single environment file (create this)
├── env.example            # Environment template
├── package.json           # Root package.json with scripts
├── start-dev.sh           # Shell script to start both services
├── backend/               # Python FastAPI backend
└── frontend/              # Next.js frontend
```
