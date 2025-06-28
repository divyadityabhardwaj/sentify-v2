import os
import re
import time
from typing import List, Dict, Any
from concurrent.futures import ThreadPoolExecutor, as_completed
from huggingface_hub import InferenceClient
from googleapiclient.discovery import build
from dotenv import load_dotenv

# Load .env from parent directory (project root)
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env'))

class HuggingFaceSentimentService:
    def __init__(self):
        self.client = InferenceClient(
            model="distilbert/distilbert-base-uncased-finetuned-sst-2-english",
            token=os.getenv("HUGGINGFACE_API_KEY")
        )
        self.model = "distilbert/distilbert-base-uncased-finetuned-sst-2-english"
    def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """
        Analyze sentiment using Hugging Face model
        """
        try:
            result = self.client.text_classification(
                text,
                model=self.model,
            )
            
            # Extract scores from result
            positive_score = 0.0
            negative_score = 0.0
            
            for item in result:
                if item["label"] == 'POSITIVE':
                    positive_score = item["score"]
                elif item["label"] == 'NEGATIVE':
                    negative_score = item["score"]
            # Determine sentiment and confidence
            if positive_score > negative_score:
                sentiment = "positive"
                confidence = positive_score
            else:
                sentiment = "negative"
                confidence = negative_score
            
            return {
                "text": text,
                "sentiment": sentiment,
                "confidence": confidence,
                "positive_score": positive_score,
                "negative_score": negative_score
            }
            
        except Exception as e:
            return self._fallback_analysis(text)
    
    def classify_sentiment_batch(self, text: str) -> tuple:
        """
        Function to call sentiment analysis for batch processing
        """
        try:
            result = self.client.text_classification(
                text,
                model=self.model,
            )
            return text, result
        except Exception as e:
            return text, f"Error: {e}"
    
    def analyze_sentiment_batch(self, texts: List[str]) -> List[Dict[str, Any]]:
        """
        Analyze sentiment for multiple texts in parallel batches
        """
        start_time = time.time()
        
        results = []
        with ThreadPoolExecutor(max_workers=500) as executor:
            future_to_text = {executor.submit(self.classify_sentiment_batch, text): text for text in texts}
            
            for i, future in enumerate(as_completed(future_to_text)):
                text, result = future.result()
                
                # Process the result
                if isinstance(result, str) and result.startswith("Error:"):
                    # Fallback analysis for errors
                    processed_result = self._fallback_analysis(text)
                else:
                    # Process Hugging Face result
                    positive_score = 0.0
                    negative_score = 0.0
                    
                    for item in result:
                        if isinstance(item, dict):
                            label = item.get("label", "")
                            score = item.get("score", 0.0)
                            if label == 'POSITIVE':
                                positive_score = float(score)
                            elif label == 'NEGATIVE':
                                negative_score = float(score)
                    
                    if positive_score > negative_score:
                        sentiment = "positive"
                        confidence = positive_score
                    else:
                        sentiment = "negative"
                        confidence = negative_score
                    
                    processed_result = {
                        "text": text,
                        "sentiment": sentiment,
                        "confidence": confidence,
                        "positive_score": positive_score,
                        "negative_score": negative_score
                    }
                
                results.append(processed_result)
        
        return results
    
    def _fallback_analysis(self, text: str) -> Dict[str, Any]:
        """Fallback to basic keyword analysis"""
        text_lower = text.lower()
        
        positive_words = ["good", "great", "excellent", "amazing", "wonderful", "love", "happy"]
        negative_words = ["bad", "terrible", "awful", "hate", "sad", "angry", "disappointed"]
        
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count > negative_count:
            sentiment = "positive"
            confidence = min(0.9, 0.5 + (positive_count * 0.1))
            positive_score = confidence
            negative_score = 1 - confidence
        elif negative_count > positive_count:
            sentiment = "negative"
            confidence = min(0.9, 0.5 + (negative_count * 0.1))
            negative_score = confidence
            positive_score = 1 - confidence
        else:
            sentiment = "neutral"
            confidence = 0.5
            positive_score = 0.5
            negative_score = 0.5
        
        return {
            "text": text,
            "sentiment": sentiment,
            "confidence": confidence,
            "positive_score": positive_score,
            "negative_score": negative_score
        }

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
        comments = []
        try:
            response = self.youtube.commentThreads().list(
                part='snippet',
                videoId=video_id,
                textFormat='plainText',
                # maxResults=max_results
            ).execute()

            for item in response['items']:
                comment = item['snippet']['topLevelComment']['snippet']['textDisplay']
                comments.append(comment)


            # Handle pagination
            while 'nextPageToken' in response and len(comments):
                response = self.youtube.commentThreads().list(
                    part='snippet',
                    videoId=video_id,
                    textFormat='plainText',
                    pageToken=response['nextPageToken']
                ).execute()
                for item in response['items']:
                    comment = item['snippet']['topLevelComment']['snippet']['textDisplay']
                    comments.append(comment)

        except Exception as e:
            raise e

        return comments 