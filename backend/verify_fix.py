import sys
import os

# Add the current directory to the path so we can import api
sys.path.append(os.getcwd())

try:
    from api.services.sentiment_service import RobertaSentimentService
except ImportError:
    print("Error: Could not import RobertaSentimentService.")
    print("Make sure you have installed the requirements: pip install -r requirements.txt")
    sys.exit(1)

def test_sentiment():
    print("Initializing RoBERTa service...")
    service = RobertaSentimentService()
    
    text = """well after a long time of me being inactive and dead 
we've done it 

400 
thanks kings and queens"""

    print(f"\nAnalyzing text:\n{'-'*20}\n{text}\n{'-'*20}")
    
    result = service.analyze_sentiment(text)
    
    print(f"\nResult: {result['sentiment'].upper()}")
    print(f"Confidence: {result['confidence']:.4f}")
    print(f"Scores: Pos={result['positive_score']:.4f}, Neg={result['negative_score']:.4f}, Neu={result['neutral_score']:.4f}")
    
    if result['sentiment'] == 'positive':
        print("\n✅ SUCCESS: Text correctly identified as POSITIVE!")
    else:
        print(f"\n❌ FAILURE: Text identified as {result['sentiment']} (Expected: POSITIVE)")

if __name__ == "__main__":
    test_sentiment()
