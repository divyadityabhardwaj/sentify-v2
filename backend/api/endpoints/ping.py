from fastapi import APIRouter
from datetime import datetime
from ..models import PingResponse

router = APIRouter()

@router.get("/ping", response_model=PingResponse)
async def ping():
    """
    Ping endpoint to check if backend is awake and responsive
    """
    print(f"🏓 Ping request received at {datetime.now().strftime('%H:%M:%S')}")
    
    return PingResponse(
        message="Backend is awake and ready!",
        timestamp=datetime.now().isoformat(),
        status="awake"
    ) 