#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting Sentify v2 Development Environment${NC}"
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping all services...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start backend
echo -e "${GREEN}🐍 Starting Python Backend on port 8000...${NC}"
cd backend && python3 -m uvicorn api.index:app --reload --port 8000 --host 0.0.0.0 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend
echo -e "${GREEN}⚛️  Starting Next.js Frontend on port 3000...${NC}"
cd frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo -e "${BLUE}✅ Both services are starting up!${NC}"
echo -e "${YELLOW}📱 Frontend: http://localhost:3000${NC}"
echo -e "${YELLOW}🔧 Backend: http://localhost:8000${NC}"
echo -e "${YELLOW}📊 Backend Health: http://localhost:8000/health${NC}"
echo -e "${YELLOW}🏓 Backend Ping: http://localhost:8000/api/ping${NC}"
echo ""
echo -e "${BLUE}Press Ctrl+C to stop all services${NC}"

# Wait for both processes
wait 