from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_router

app = FastAPI(
    title="Rain-to-Green API",
    description="Backend API for South Asia Vegetation Response to Rainfall (Nepal Focus)",
    version="1.0.0"
)

# Enable CORS for local Next.js frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "message": "Rain-to-Green backend is running successfully!"}