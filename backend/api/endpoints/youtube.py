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
        sentiment_results = sentiment_service.analyze_sentiment_batch(comments)
        
        # Process results
        comment_sentiments = []
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
            comment_sentiments.append(comment_sentiment)
            
            if result['sentiment'] == 'positive':
                positive_count += 1
            else:
                negative_count += 1
        
        # Calculate percentages
        total_comments = len(comment_sentiments)
        positive_percentage = (positive_count / total_comments) * 100
        negative_percentage = (negative_count / total_comments) * 100
        
        # Get top positive and negative comments
        positive_comments = [c for c in comment_sentiments if c.sentiment == 'positive']
        negative_comments = [c for c in comment_sentiments if c.sentiment == 'negative']
        
        # Sort by confidence and get top 5
        top_positive = sorted(positive_comments, key=lambda x: x.confidence, reverse=True)[:5]
        top_negative = sorted(negative_comments, key=lambda x: x.confidence, reverse=True)[:5]
        
        
        return YouTubeAnalysisResponse(
            video_id=video_id,
            total_comments=total_comments,
            positive_count=positive_count,
            negative_count=negative_count,
            positive_percentage=positive_percentage,
            negative_percentage=negative_percentage,
            comments=comment_sentiments,
            top_positive_comments=top_positive,
            top_negative_comments=top_negative
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing YouTube comments: {str(e)}") 