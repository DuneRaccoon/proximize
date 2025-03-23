from typing import List, Optional, Dict, Any, Union
from pydantic import PostgresDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str
    ENV: str = "development"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    # Database
    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_DSN: Optional[PostgresDsn] = None
    
    # Redis
    REDIS_SERVER: str
    REDIS_PORT: int = 6379
    
    # Apple Pass
    APPLE_PASS_TYPE_IDENTIFIER: str
    APPLE_TEAM_IDENTIFIER: str
    APPLE_CERTIFICATE_PATH: str
    APPLE_PRIVATE_KEY_PATH: str
    APPLE_WWDR_CERTIFICATE_PATH: str
    
    @field_validator("POSTGRES_DSN", mode="after")
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        
        return PostgresDsn.build(
            scheme="postgresql+asyncpg",
            username=values.data.get("POSTGRES_USER"),
            password=values.data.get("POSTGRES_PASSWORD"),
            host=values.data.get("POSTGRES_SERVER"),
            path=f"{values.data.get('POSTGRES_DB') or ''}",
        )
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


settings = Settings()