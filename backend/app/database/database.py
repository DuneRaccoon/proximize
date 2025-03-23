import contextlib
from app.settings import settings
from sqlalchemy.ext.asyncio import (
    create_async_engine,
    AsyncSession,
    AsyncConnection,
    async_sessionmaker,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import MetaData
from typing import AsyncIterator, Any, Dict


# Define metadata and Base for ORM mappings
metadata = MetaData()
Base = declarative_base(metadata=metadata)


class DatabaseNotInitializedError(Exception):
    """Custom exception for uninitialized database components."""
    pass


class DatabaseSessionManager:
    def __init__(self, dsn: str, **engine_kwargs: Dict[str, Any]):
        """
        Initialize the DatabaseSessionManager.
        
        Args:
            dsn (str): The database connection string (DSN).
            engine_kwargs (dict): Additional arguments for the SQLAlchemy engine.
        """
        self._dsn = dsn
        self._engine_kwargs = engine_kwargs
        self._engine = create_async_engine(self._dsn, **self._engine_kwargs)
        self._sessionmaker = async_sessionmaker(
            bind=self._engine,
            autocommit=False,
            autoflush=False,
        )

    async def close(self) -> None:
        """
        Close the database engine and reset the sessionmaker.
        """
        if self._engine is None:
            raise DatabaseNotInitializedError("DatabaseSessionManager is not initialized.")

        await self._engine.dispose()
        self._engine = None
        self._sessionmaker = None

    @contextlib.asynccontextmanager
    async def connect(self) -> AsyncIterator[AsyncConnection]:
        """
        Provide an asynchronous context manager for direct database connections.

        Yields:
            AsyncConnection: A transactional database connection.
        """
        if self._engine is None:
            raise DatabaseNotInitializedError("DatabaseSessionManager is not initialized.")

        async with self._engine.begin() as connection:
            try:
                yield connection
            except Exception:
                await connection.rollback()
                raise

    @contextlib.asynccontextmanager
    async def session(self) -> AsyncIterator[AsyncSession]:
        """
        Provide an asynchronous context manager for database sessions.

        Yields:
            AsyncSession: A transactional database session.
        """
        if self._sessionmaker is None:
            raise DatabaseNotInitializedError("DatabaseSessionManager is not initialized.")

        session = self._sessionmaker()
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# Create a session manager instance
sessionmanager = DatabaseSessionManager(
    dsn=str(settings.POSTGRES_DSN),
    echo=settings.ENV == 'development'
)

# Get session dependency
async def get_db():
    async with sessionmanager.session() as session:
        yield session