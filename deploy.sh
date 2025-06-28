#!/bin/bash

echo "🚀 Sentify v2 Vercel Deployment Script"
echo "======================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel..."
    vercel login
fi

echo ""
echo "📋 Choose deployment option:"
echo "1. Deploy Frontend Only (Recommended)"
echo "2. Deploy Backend Only"
echo "3. Deploy Both (Monorepo)"
echo "4. Exit"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "🎨 Deploying Frontend Only..."
        cd frontend
        vercel --prod
        ;;
    2)
        echo "🔧 Deploying Backend Only..."
        cd backend
        vercel --prod
        ;;
    3)
        echo "🏗️ Deploying Both (Monorepo)..."
        vercel --prod
        ;;
    4)
        echo "👋 Exiting..."
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Exiting..."
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment completed!"
echo "📖 Check DEPLOYMENT.md for detailed instructions" 