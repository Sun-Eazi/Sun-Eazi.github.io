import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GEMINI_API_KEY: str = "PASTE_YOUR_GEMINI_API_KEY_HERE"
    SUPABASE_URL: str = "https://your-project.supabase.co"
    SUPABASE_KEY: str = "your-anon-key"
    ALLOWED_ORIGINS: str = "*"
    APP_ENV: str = "development"
    PORT: int = 8000

    class Config:
        env_file = ".env"

settings = Settings()
