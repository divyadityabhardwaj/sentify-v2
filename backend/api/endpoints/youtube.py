from fastapi import APIRouter, HTTPException
from ..models import YouTubeAnalysisRequest, YouTubeAnalysisResponse, CommentSentiment
from ..services.sentiment_service import TextBlobSentimentService, YouTubeService
from typing import List

import logging
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()
_sentiment_service = None
_youtube_service = None

def get_sentiment_service():
    global _sentiment_service
    if _sentiment_service is None:
        _sentiment_service = TextBlobSentimentService()
    return _sentiment_service

def get_youtube_service():
    global _youtube_service
    if _youtube_service is None:
        _youtube_service = YouTubeService()
    return _youtube_service

@router.post("/youtube/analyze", response_model=YouTubeAnalysisResponse)
def analyze_youtube_comments(request: YouTubeAnalysisRequest):
    """
    Analyze sentiment of YouTube video comments
    """

    
    try:
        start_time = time.time()
        logger.info(f"Starting analysis for URL: {request.video_url}")
        
        # Extract video ID
        video_id = get_youtube_service().extract_video_id(request.video_url)
        logger.info(f"Extracted video ID: {video_id}")
        
        # Get comments
        comments = get_youtube_service().get_comments(video_id)
        logger.info(f"Fetched {len(comments)} comments for video {video_id}")
        
        if not comments:
            logger.warning(f"No comments found for video {video_id}")
            raise HTTPException(status_code=404, detail="No comments found for this video")
        
        # Analyze sentiment for all comments in batch
        logger.info(f"Starting batch sentiment analysis for {len(comments)} comments")
        sentiment_results, successful_count, failed_count = get_sentiment_service().analyze_sentiment_batch(comments)
        logger.info(f"Analysis complete. Success: {successful_count}, Failed: {failed_count}")
        
        # Process results and separate positive/negative/neutral comments
        positive_comments = []
        negative_comments = []
        neutral_comments = []
        positive_count = 0
        negative_count = 0
        neutral_count = 0

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
            elif result['sentiment'] == 'negative':
                negative_comments.append(comment_sentiment)
                negative_count += 1
            else:
                neutral_comments.append(comment_sentiment)
                neutral_count += 1
        
        # Calculate percentages based on processed comments only
        processed_comments = len(sentiment_results)
        positive_percentage = (positive_count / processed_comments) * 100 if processed_comments > 0 else 0
        negative_percentage = (negative_count / processed_comments) * 100 if processed_comments > 0 else 0
        neutral_percentage = (neutral_count / processed_comments) * 100 if processed_comments > 0 else 0
        
        # Sort by compound score for better ranking
        # For positive: highest compound scores first
        # For negative: lowest compound scores first
        all_results_with_compound = []
        for result in sentiment_results:
            all_results_with_compound.append({
                'comment': CommentSentiment(
                    text=result['text'],
                    sentiment=result['sentiment'],
                    confidence=result['confidence'],
                    positive_score=result['positive_score'],
                    negative_score=result['negative_score']
                ),
                'compound': result.get('compound_score', 0)
            })
        
        # Sort by compound score
        all_results_with_compound.sort(key=lambda x: x['compound'])
        
        # Get top 10 most negative (lowest compound scores)
        top_negative = [item['comment'] for item in all_results_with_compound if item['comment'].sentiment == 'negative'][:10]
        
        # Get top 10 most positive (highest compound scores)
        top_positive = [item['comment'] for item in reversed(all_results_with_compound) if item['comment'].sentiment == 'positive'][:10]
        
        total_duration = time.time() - start_time
        logger.info(f"Total request processed in {total_duration:.2f} seconds")

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