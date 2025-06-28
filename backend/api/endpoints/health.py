from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def root():
    return {"message": "Sentify Backend API is running!"}

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "sentify-backend"} 