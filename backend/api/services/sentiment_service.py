import os
import re
import time
from typing import List, Dict, Any
from googleapiclient.discovery import build
from dotenv import load_dotenv
import logging

logger = logging.getLogger(__name__)

# Load .env from parent directory (project root)
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env'))

class TextBlobSentimentService:
    """
    TextBlob Sentiment Analysis Service
    Lightweight, rule-based sentiment analysis.
    Extremely fast compared to Transformer models.
    """
    
    def __init__(self):
        print("Initializing TextBlob service...")
        import nltk
        
        # Vercel file system is read-only except for /tmp
        # We need to ensure NLTK data is downloaded to /tmp
        nltk_data_path = "/tmp/nltk_data"
        if not os.path.exists(nltk_data_path):
            os.makedirs(nltk_data_path, exist_ok=True)
        
        nltk.data.path.append(nltk_data_path)
        
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            print(f"Downloading punkt tokenizer to {nltk_data_path}...")
            nltk.download('punkt', download_dir=nltk_data_path)
            
        from textblob import TextBlob
        # TextBlob doesn't need heavy model loading
    
    def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment of a single text using TextBlob"""
        from textblob import TextBlob
        
        try:
            blob = TextBlob(text)
            polarity = blob.sentiment.polarity
            
            if polarity > 0.1:
                sentiment = "positive"
                confidence = polarity
            elif polarity < -0.1:
                sentiment = "negative"
                confidence = abs(polarity)
            else:
                sentiment = "neutral"
                confidence = 1.0 - abs(polarity)
                
            return {
                "text": text,
                "sentiment": sentiment,
                "confidence": confidence,
                "positive_score": polarity if polarity > 0 else 0,
                "negative_score": abs(polarity) if polarity < 0 else 0,
                "neutral_score": 1.0 - abs(polarity),
                "compound_score": polarity
            }
        except Exception as e:
            print(f"Error analyzing text: {e}")
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
        """Analyze sentiment for multiple texts using TextBlob"""
        from textblob import TextBlob
        
        start_time = time.time()
        results = []
        successful_count = 0
        failed_count = 0
        
        # TextBlob is fast enough to process all comments without sampling
        # 10k comments takes ~1-2 seconds
        
        for text in texts:
            try:
                blob = TextBlob(text)
                polarity = blob.sentiment.polarity  # -1.0 to 1.0
                subjectivity = blob.sentiment.subjectivity  # 0.0 to 1.0
                
                # Map polarity to our format
                if polarity > 0.1:
                    sentiment = "positive"
                    confidence = polarity
                    pos_score = polarity
                    neg_score = 0.0
                    neu_score = 1.0 - polarity
                elif polarity < -0.1:
                    sentiment = "negative"
                    confidence = abs(polarity)
                    pos_score = 0.0
                    neg_score = abs(polarity)
                    neu_score = 1.0 - abs(polarity)
                else:
                    sentiment = "neutral"
                    confidence = 1.0 - abs(polarity)
                    pos_score = 0.0
                    neg_score = 0.0
                    neu_score = 1.0
                
                results.append({
                    "text": text,
                    "sentiment": sentiment,
                    "confidence": confidence,
                    "positive_score": pos_score,
                    "negative_score": neg_score,
                    "neutral_score": neu_score,
                    "compound_score": polarity  # Use polarity as compound score
                })
                successful_count += 1
                
            except Exception as e:
                logger.error(f"Error analyzing text: {e}")
                failed_count += 1
                
        total_duration = time.time() - start_time
        logger.info(f"Total sentiment analysis took {total_duration:.2f} seconds for {len(texts)} comments")
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
                if len(comments) >= 10000:
                    logger.warning("Reached 10,000 comment limit, stopping fetch.")
                    break
                    
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
                
                if len(comments) % 1000 == 0:
                    logger.info(f"Fetched {len(comments)} comments so far...")

        except Exception as e:
            logger.error(f"Error fetching comments: {e}")
            raise e

        
        # Sort comments for consistency between runs
        comments.sort()
        
        duration = time.time() - start_time
        logger.info(f"Fetching {len(comments)} comments took {duration:.2f} seconds")

        return comments 