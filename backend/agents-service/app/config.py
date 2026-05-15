from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    app_name: str = "AI Agents Service"
    app_version: str = "1.0.0"
    debug: bool = False

    database_url: str = "sqlite:///./agents.db"
    redis_url: Optional[str] = None

    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    gemini_api_key: Optional[str] = None

    chroma_persist_dir: str = "./chroma_db"

    default_max_tokens: int = 4096
    default_temperature: float = 0.7

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
