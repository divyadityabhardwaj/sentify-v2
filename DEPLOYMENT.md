# 🚀 Vercel Deployment Guide

This guide will help you deploy your Sentify v2 project on Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **API Keys**:
   - Hugging Face API Key
   - YouTube Data API Key

## 🎯 Deployment Strategy

We'll deploy the **frontend and backend separately** for better performance and scalability:

1. **Backend**: Deploy as serverless functions
2. **Frontend**: Deploy as Next.js app
3. **Connect**: Frontend calls backend via environment variable

## 🔧 Step 1: Deploy Backend

### 1.1 Create Backend Repository

```bash
# Create a new repository for backend
git clone https://github.com/yourusername/sentify-backend.git
cd sentify-backend

# Copy backend files
cp -r ../sentify-v2/backend/* .
cp ../sentify-v2/requirements.txt .
```

### 1.2 Deploy Backend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your backend repository
4. Configure settings:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (root)
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty

### 1.3 Set Environment Variables

In your Vercel project settings, add:

```
HUGGINGFACE_API_KEY=your_huggingface_token_here
YOUTUBE_API_KEY=your_youtube_api_key_here
```

### 1.4 Deploy

Click "Deploy" and wait for completion. Note the deployment URL (e.g., `https://sentify-backend.vercel.app`)

## 🎨 Step 2: Deploy Frontend

### 2.1 Update Frontend Configuration

Update `frontend/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    BACKEND_URL:
      process.env.BACKEND_URL || "https://your-backend-url.vercel.app",
  },
};

module.exports = nextConfig;
```

### 2.2 Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your main repository
4. Configure settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 2.3 Set Environment Variables

In your frontend Vercel project settings, add:

```
BACKEND_URL=https://your-backend-url.vercel.app
```

### 2.4 Deploy

Click "Deploy" and wait for completion.

## 🔗 Step 3: Connect Frontend to Backend

### 3.1 Update API Calls

The frontend will automatically call the backend using the `BACKEND_URL` environment variable.

### 3.2 Test the Connection

1. Visit your frontend URL
2. Try analyzing some text
3. Check that it connects to your backend

## 🛠️ Alternative: Single Repository Deployment

If you prefer to deploy everything from one repository:

### Option A: Deploy Frontend Only (Recommended)

1. Deploy only the frontend
2. Set `BACKEND_URL` to your backend URL
3. Backend runs separately

### Option B: Deploy Both from Root

Update root `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/api/index.py",
      "use": "@vercel/python"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/api/index.py"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors**: Backend already has CORS configured
2. **Environment Variables**: Make sure they're set in Vercel dashboard
3. **API Timeouts**: Vercel has 10-second timeout for serverless functions
4. **Memory Limits**: Vercel has 1024MB memory limit

### Debug Steps:

1. Check Vercel function logs
2. Verify environment variables
3. Test API endpoints directly
4. Check frontend console for errors

## 📊 Performance Considerations

- **Cold Starts**: First request may be slower
- **Memory**: Large comment batches may hit limits
- **Timeout**: Long-running sentiment analysis may timeout
- **Rate Limits**: Consider reducing concurrent workers

## 🎉 Success!

Your Sentify v2 app should now be live on Vercel with:

- ✅ Frontend: `https://your-frontend.vercel.app`
- ✅ Backend: `https://your-backend.vercel.app`
- ✅ API: Working sentiment analysis
- ✅ YouTube: Comment analysis functional

## 🔄 Continuous Deployment

Once set up, Vercel will automatically deploy on every push to your main branch!
