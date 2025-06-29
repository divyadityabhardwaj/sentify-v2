from fastapi import APIRouter, HTTPException
from ..models import YouTubeAnalysisRequest, YouTubeAnalysisResponse, CommentSentiment
from ..services.sentiment_service import HuggingFaceSentimentService, YouTubeService
from typing import List

router = APIRouter()
sentiment_service = HuggingFaceSentimentService()
youtube_service = YouTubeService()

@router.post("/youtube/analyze", response_model=YouTubeAnalysisResponse)
async def analyze_youtube_comments(request: YouTubeAnalysisRequest):
    """
    Analyze sentiment of YouTube video comments
    """

    
    try:
        # Extract video ID
        video_id = youtube_service.extract_video_id(request.video_url)
        
        # Get comments
        comments = youtube_service.get_comments(video_id)
        if not comments:
            raise HTTPException(status_code=404, detail="No comments found for this video")
        
        # Analyze sentiment for all comments in batch
        sentiment_results, successful_count, failed_count = sentiment_service.analyze_sentiment_batch(comments)
        
        # Process results and separate positive/negative comments
        positive_comments = []
        negative_comments = []
        positive_count = 0
        negative_count = 0

        for result in sentiment_results:
            comment_sentiment = CommentSentiment(
                text=result['text'],
                sentiment=result['sentiment'],
                confidence=result['confidence'],
                positive_score=result['positive_score'],
                negative_score=result['negative_score']
            )
            
            if result['sentiment'] == 'positive':
                positive_comments.append(comment_sentiment)
                positive_count += 1
            else:
                negative_comments.append(comment_sentiment)
                negative_count += 1
        
        # Calculate percentages based on processed comments only
        processed_comments = len(sentiment_results)
        positive_percentage = (positive_count / processed_comments) * 100 if processed_comments > 0 else 0
        negative_percentage = (negative_count / processed_comments) * 100 if processed_comments > 0 else 0
        
        # Sort by confidence and get top 5 for each category
        top_positive = sorted(positive_comments, key=lambda x: x.confidence, reverse=True)[:5]
        top_negative = sorted(negative_comments, key=lambda x: x.confidence, reverse=True)[:5]
        
        return YouTubeAnalysisResponse(
            video_id=video_id,
            total_comments=len(comments),
            processed_comments=successful_count,
            failed_comments=failed_count,
            positive_count=positive_count,
            negative_count=negative_count,
            positive_percentage=positive_percentage,
            negative_percentage=negative_percentage,
            top_positive_comments=top_positive,
            top_negative_comments=top_negative
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing YouTube comments: {str(e)}") 