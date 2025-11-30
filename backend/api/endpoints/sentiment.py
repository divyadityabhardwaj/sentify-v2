from fastapi import APIRouter, HTTPException
from ..models import SentimentRequest, SentimentResponse
from ..services.sentiment_service import TextBlobSentimentService

router = APIRouter()
_sentiment_service = None

def get_sentiment_service():
    global _sentiment_service
    if _sentiment_service is None:
        _sentiment_service = TextBlobSentimentService()
    return _sentiment_service

@router.post("/sentiment", response_model=SentimentResponse)
async def analyze_sentiment(request: SentimentRequest):
    """
    Analyze sentiment of the provided text using RoBERTa
    """
    
    try:
        service = get_sentiment_service()
        result = service.analyze_sentiment(request.text)
                
        return SentimentResponse(
            text=result['text'],
            sentiment=result['sentiment'],
            confidence=result['confidence']
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing sentiment: {str(e)}") 