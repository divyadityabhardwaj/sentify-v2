from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .endpoints import health, ping, sentiment, youtube

app = FastAPI(title="Sentify Backend API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Sentify Backend API is running!"}

@app.get("/test")
async def test():
    return {"status": "ok", "message": "Test endpoint working"}

# Include routers from separate endpoint files
app.include_router(health.router, tags=["health"])
app.include_router(ping.router, prefix="/api", tags=["ping"])
app.include_router(sentiment.router, prefix="/api", tags=["sentiment"])
app.include_router(youtube.router, prefix="/api", tags=["youtube"])

# For Vercel deployment - export the app directly
# Vercel will handle the ASGI application directly