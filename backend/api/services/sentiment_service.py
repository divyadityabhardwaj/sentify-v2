import os
import re
import time
from typing import List, Dict, Any
from transformers import pipeline
from googleapiclient.discovery import build
from dotenv import load_dotenv

# Load .env from parent directory (project root)
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env'))

class RobertaSentimentService:
    """
    RoBERTa (Robustly optimized BERT approach) Sentiment Analysis Service
    Uses 'cardiffnlp/twitter-roberta-base-sentiment' model which is trained on ~58M tweets.
    
    Labels:
    LABEL_0 -> Negative
    LABEL_1 -> Neutral
    LABEL_2 -> Positive
    """
    
    def __init__(self):
        print("Loading RoBERTa model... this may take a moment")
        self.sentiment_pipeline = pipeline(
            "sentiment-analysis",
            model="cardiffnlp/twitter-roberta-base-sentiment",
            tokenizer="cardiffnlp/twitter-roberta-base-sentiment",
            top_k=None  # Return scores for all labels
        )
    
    def _process_scores(self, scores_list: List[Dict[str, float]]) -> Dict[str, Any]:
        """Helper to process raw model scores into our format"""
        # Convert list of dicts to a single dict mapping label to score
        score_map = {item['label']: item['score'] for item in scores_list}
        
        neg_score = score_map.get('LABEL_0', 0.0)
        neu_score = score_map.get('LABEL_1', 0.0)
        pos_score = score_map.get('LABEL_2', 0.0)
        
        # Determine dominant sentiment
        if pos_score > neg_score and pos_score > neu_score:
            sentiment = "positive"
            confidence = pos_score
        elif neg_score > pos_score and neg_score > neu_score:
            sentiment = "negative"
            confidence = neg_score
        else:
            sentiment = "neutral"
            confidence = neu_score
            
        # Calculate compound score (approximate for compatibility)
        # Formula: (pos - neg) * (1 - neu) ? Or just pos - neg.
        # Let's use a simple weighted sum normalized to -1 to 1
        compound = pos_score - neg_score
        
        return {
            "sentiment": sentiment,
            "confidence": confidence,
            "positive_score": pos_score,
            "negative_score": neg_score,
            "neutral_score": neu_score,
            "compound_score": compound
        }
    
    def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment of a single text using RoBERTa"""
        try:
            # Truncate text to 512 tokens (approx 2000 chars) to prevent errors
            truncated_text = text[:2000]
            
            # Pipeline returns a list of lists (because top_k=None)
            results = self.sentiment_pipeline(truncated_text)
            scores = results[0]  # Get first (and only) result
            
            processed = self._process_scores(scores)
            processed["text"] = text
            return processed
            
        except Exception as e:
            print(f"Error analyzing text: {e}")
            # Fallback for errors
            return {
                "text": text,
                "sentiment": "neutral",
                "confidence": 0.0,
                "positive_score": 0.0,
                "negative_score": 0.0,
                "neutral_score": 0.0,
                "compound_score": 0.0
            }
    
    def analyze_sentiment_batch(self, texts: List[str]) -> tuple[List[Dict[str, Any]], int, int]:
        """Analyze sentiment for multiple texts using RoBERTa"""
        results = []
        successful_count = 0
        failed_count = 0
        
        # Process in batches to avoid memory issues
        BATCH_SIZE = 32
        
        for i in range(0, len(texts), BATCH_SIZE):
            batch_texts = texts[i:i + BATCH_SIZE]
            # Truncate all texts
            truncated_batch = [t[:2000] for t in batch_texts]
            
            try:
                batch_results = self.sentiment_pipeline(truncated_batch)
                
                for text, scores in zip(batch_texts, batch_results):
                    processed = self._process_scores(scores)
                    processed["text"] = text
                    results.append(processed)
                    successful_count += 1
                    
            except Exception as e:
                print(f"Batch processing error: {e}")
                # If batch fails, try one by one or just mark as failed
                # For now, mark this batch as failed
                failed_count += len(batch_texts)
                
        return results, successful_count, failed_count

class YouTubeService:
    def __init__(self):
        api_key = os.getenv('YOUTUBE_API_KEY')
        if not api_key:
            raise ValueError("YOUTUBE_API_KEY not found in environment variables")
        self.youtube = build('youtube', 'v3', developerKey=api_key)
    
    def extract_video_id(self, url: str) -> str:
        """Extract the video ID from a YouTube URL."""
        regex = r'(?:https?://)?(?:www\.)?(?:youtube\.com/(?:[^/]+/.*|(?:v|e(?:mbed)?)|.*[?&]v=)|youtu\.be/)([^&]{11})'
        match = re.search(regex, url)
        if not match:
            raise ValueError("Invalid YouTube URL")
        return match.group(1)
    
    def get_comments(self, video_id: str) -> List[str]:
        """Get comments from YouTube video"""
        start_time = time.time()
        comments = []
        try:
            response = self.youtube.commentThreads().list(
                part='snippet',
                videoId=video_id,
                textFormat='plainText',
                maxResults=100
            ).execute()


            for item in response['items']:
                comment = item['snippet']['topLevelComment']['snippet']['textDisplay']
                comments.append(comment)


            # Handle pagination
            while 'nextPageToken' in response:
                response = self.youtube.commentThreads().list(
                    part='snippet',
                    videoId=video_id,
                    textFormat='plainText',
                    pageToken=response['nextPageToken'],
                    maxResults=100
                ).execute()
                for item in response['items']:
                    comment = item['snippet']['topLevelComment']['snippet']['textDisplay']
                    comments.append(comment)

        except Exception as e:
            raise e

        
        # Sort comments for consistency between runs
        comments.sort()

        return comments 