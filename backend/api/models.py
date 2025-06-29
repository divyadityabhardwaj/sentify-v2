from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class SentimentRequest(BaseModel):
    text: str

class SentimentResponse(BaseModel):
    text: str
    sentiment: str
    confidence: float

class PingResponse(BaseModel):
    message: str
    timestamp: str
    status: str

class YouTubeAnalysisRequest(BaseModel):
    video_url: str

class CommentSentiment(BaseModel):
    text: str
    sentiment: str
    confidence: float
    positive_score: float
    negative_score: float

class YouTubeAnalysisResponse(BaseModel):
    video_id: str
    total_comments: int
    processed_comments: int
    failed_comments: int
    positive_count: int
    negative_count: int
    positive_percentage: float
    negative_percentage: float
    top_positive_comments: List[CommentSentiment]
    top_negative_comments: List[CommentSentiment] 