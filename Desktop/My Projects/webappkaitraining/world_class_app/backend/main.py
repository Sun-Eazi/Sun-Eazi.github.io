from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import router as api_v1_router
from app.config import settings

app = FastAPI(
    title="Tanzania Vehicle AI - World Class Edition",
    description="Professional vehicle classification for Dar es Salaam traffic using Gemini Vision AI.",
    version="2.0.0"
)

# CORS Configuration
origins = settings.ALLOWED_ORIGINS.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins[0] != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1_router)

@app.get("/")
async def root():
    return {
        "message": "Karibu kwenye Tanzania Vehicle AI API",
        "docs": "/docs",
        "status": "online"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
