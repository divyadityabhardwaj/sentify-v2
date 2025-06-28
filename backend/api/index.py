from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .endpoints import health, ping, sentiment, youtube
from mangum import Mangum

app = FastAPI(title="Sentify Backend API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers from separate endpoint files
app.include_router(health.router, tags=["health"])
app.include_router(ping.router, prefix="/api", tags=["ping"])
app.include_router(sentiment.router, prefix="/api", tags=["sentiment"])
app.include_router(youtube.router, prefix="/api", tags=["youtube"])

# Vercel serverless function handler
def handler(request, context):
    """Vercel serverless function entry point"""
    adapter = Mangum(app)
    return adapter(request, context)