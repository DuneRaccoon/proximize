from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession

from app.settings import settings
from app.database import get_db, sessionmanager
from app.api.v1.router import api_router

app = FastAPI(
    title="Wallet Pass Manager API",
    description="API for managing digital wallet passes",
    version="0.1.0",
)

# Set up CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {"message": "Welcome to Wallet Pass Manager API"}


@app.get("/health")
async def health(db: AsyncSession = Depends(get_db)):
    try:
        # Simple database check
        result = await db.execute("SELECT 1")
        if result:
            return {
                "status": "healthy",
                "database": "connected",
                "version": "0.1.0",
            }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
        }


@app.on_event("startup")
async def startup():
    # Additional startup events can be added here
    pass


@app.on_event("shutdown")
async def shutdown():
    await sessionmanager.close()