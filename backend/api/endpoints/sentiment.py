from fastapi import APIRouter, HTTPException
from ..models import SentimentRequest, SentimentResponse
from ..services.sentiment_service import RobertaSentimentService

router = APIRouter()
sentiment_service = RobertaSentimentService()

@router.post("/sentiment", response_model=SentimentResponse)
async def analyze_sentiment(request: SentimentRequest):
    """
    Analyze sentiment of the provided text using RoBERTa
    """
    
    try:
        result = sentiment_service.analyze_sentiment(request.text)
                
        return SentimentResponse(
            text=result['text'],
            sentiment=result['sentiment'],
            confidence=result['confidence']
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing sentiment: {str(e)}") 