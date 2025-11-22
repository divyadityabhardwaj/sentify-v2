# Sentify v2 🚀

A powerful sentiment analysis application with **Hugging Face AI models** and **YouTube comment analysis**. Built with Python FastAPI backend and Next.js frontend, designed for deployment on Vercel.

## ✨ Features

### 🧠 **Advanced Sentiment Analysis**

- **RoBERTa Sentiment Analysis**: Robustly optimized BERT approach for state-of-the-art accuracy
- **Lightning Fast**: Processes 1000s of texts per second locally
- **High Accuracy**: 85-90% accuracy, optimized for social media text
- **Real-time Processing**: Instant analysis with confidence scores
- **Emoji-Aware**: Understands emojis, capitalization, and punctuation
- **100% Free**: No API costs or rate limits

### 🎥 **YouTube Comments Analysis**

- **Comment Extraction**: Up to 100 comments per video
- **Individual Analysis**: Each comment analyzed separately
- **Top Comments**: Top 10 positive and negative comments (ranked by intensity)
- **Statistics Dashboard**: Counts, percentages, and visual charts
- **URL Support**: Works with any YouTube URL format
- **No Timeouts**: Fast local processing, no API rate limits

### 🎨 **Modern UI/UX**

- **Tab Interface**: Switch between text and YouTube analysis
- **Responsive Design**: Works perfectly on all devices
- **Real-time Feedback**: Loading states and progress indicators
- **Error Handling**: User-friendly error messages
- **Backend Health Check**: Automatic connection monitoring

## 🏗️ Architecture

```
sentify-v2/
├── .env                    # Environment variables (create from env.example)
├── env.example            # Environment template
├── package.json           # Root package.json with dev scripts
├── start-dev.sh           # Shell script to start both services
├── backend/               # Python FastAPI backend
│   ├── api/
│   │   ├── endpoints/     # Modular API endpoints
│   │   │   ├── health.py  # Health check endpoints
│   │   │   ├── ping.py    # Backend wake-up detection
│   │   │   ├── sentiment.py # Text sentiment analysis
│   │   │   └── youtube.py # YouTube comment analysis
│   │   ├── services/      # Business logic services
│   │   │   └── sentiment_service.py # RoBERTa & YouTube services
│   │   ├── models.py      # Pydantic data models
│   │   └── index.py       # Main FastAPI app
│   └── requirements.txt   # Python dependencies
└── frontend/              # Next.js frontend
    ├── app/               # App router components
    │   ├── page.tsx       # Main application page
    │   ├── layout.tsx     # Root layout
    │   └── globals.css    # Global styles
    ├── package.json       # Frontend dependencies
    └── next.config.js     # Next.js configuration
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+**
- **Node.js 18+**
- **YouTube API Key** (for YouTube comment analysis)

### 1. Clone & Setup

```bash
git clone https://github.com/yourusername/sentify-v2.git
cd sentify-v2
```

### 2. Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit .env with your YouTube API key
YOUTUBE_API_KEY=your_youtube_api_key_here
BACKEND_URL=http://localhost:8000
```

**Note**: No Hugging Face API key needed! RoBERTa runs locally.

### 3. Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm run install:all
```

### 4. Start Development

```bash
# Start both services
npm run dev
```

**Or use the shell script:**

```bash
chmod +x start-dev.sh
./start-dev.sh
```

## 🔑 API Keys Setup

### YouTube API Key (Required)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **YouTube Data API v3**
4. Create credentials (API Key)
5. Add to `.env`: `YOUTUBE_API_KEY=your_api_key`

### ~~Hugging Face API Key~~ (No Longer Needed!)

We now use RoBERTa for sentiment analysis, which runs locally and requires no API key!

## 📊 API Endpoints

### Backend API

- `GET /` - Root endpoint
- `GET /health` - Health check
- `GET /api/ping` - Backend wake-up detection
- `POST /api/sentiment` - Analyze text sentiment
- `POST /api/youtube/analyze` - Analyze YouTube comments

### Example Requests

**Text Sentiment Analysis:**

```bash
curl -X POST "http://localhost:8000/api/sentiment" \
  -H "Content-Type: application/json" \
  -d '{"text": "I love this amazing product!"}'
```

**YouTube Comments Analysis:**

```bash
curl -X POST "http://localhost:8000/api/youtube/analyze" \
  -H "Content-Type: application/json" \
  -d '{"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend
npm run install:all      # Install all dependencies
npm run build           # Build frontend for production
npm run start           # Start in production mode
```

### Service URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **Backend Health**: http://localhost:8000/health
- **Backend Ping**: http://localhost:8000/api/ping

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production

```bash
YOUTUBE_API_KEY=your_youtube_api_key
BACKEND_URL=https://your-backend-url.vercel.app
```

**Note**: No Hugging Face API key needed!

## 🎯 Usage Examples

### Text Analysis

```
Input: "I love this amazing product!"
Output:
{
  "text": "I love this amazing product!",
  "sentiment": "positive",
  "confidence": 0.9998
}
```

### YouTube Analysis

```
Input: https://www.youtube.com/watch?v=dQw4w9WgXcQ
Output:
{
  "video_id": "dQw4w9WgXcQ",
  "total_comments": 85,
  "positive_count": 67,
  "negative_count": 18,
  "positive_percentage": 78.8,
  "negative_percentage": 21.2,
  "top_positive_comments": [...],
  "top_negative_comments": [...]
}
```

## 🔧 Troubleshooting

### Common Issues

**"Sentiment analysis error"**

- RoBERTa runs locally, so no API issues
- Check if text is valid and not empty
- Ensure backend is running properly

**"YouTube API error"**

- Verify YouTube Data API v3 is enabled
- Check API key in `.env`
- Ensure video URL is valid and public

**"Backend unavailable"**

- Check if both services are running
- Verify ports 8000 and 3000 are available
- Check console for error messages

**"Import errors"**

- Run `npm run install:all` to install all dependencies
- Ensure Python 3.8+ is installed
- Check if all packages are installed correctly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- **RoBERTa Sentiment Analysis** for state-of-the-art, context-aware sentiment analysis
- **YouTube Data API** for comment extraction
- **FastAPI** for the robust backend framework
- **Next.js** for the modern frontend framework
- **Tailwind CSS** for the beautiful styling

## 📞 Support

If you have any questions or need help:

- Open an issue on GitHub
- Check the troubleshooting section above
- Review the API documentation

---

**Built with ❤️ using modern web technologies**
