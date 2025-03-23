from __future__ import annotations

from typing import TypeVar, Union, List, Any, Generic, Optional, Type
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy import (
    Column,
    DateTime,
    func,
    select,
    String
)
from sqlalchemy.dialects.postgresql import UUID

from app.utils import pascal_to_snake, generate_uuid
from app.database.database import Base, AsyncSession

T = TypeVar('T', bound='CRUDMixin')

class CRUDMixin(Generic[T]):
    """Mixin that adds convenience methods for CRUD (create, read, update, delete) operations."""
    
    @classmethod
    async def create(cls: Type[T], db: AsyncSession, commit: bool = True, **kwargs) -> T:
        instance = cls(**kwargs)
        db.add(instance)
        if commit:
            try:
                await db.commit()
                await db.refresh(instance)
            except SQLAlchemyError as e:
                await db.rollback()
                raise
        return instance

    @classmethod
    async def get_by_id(cls, db: AsyncSession, id_: str) -> Optional[T]:
        return (
            await db.execute(
                select(cls).filter_by(id=id_)
            )
        ).scalar()
    
    @classmethod
    async def get(cls, db: AsyncSession, first: bool = True, options: list = None, **kwargs) -> Optional[Union[T, List[T]]]:
        query = select(cls).filter_by(**kwargs)
        if options:
            query = query.options(*options)
        result = await db.execute(query)
        return result.scalars().all() if not first else result.scalar()
    
    @classmethod
    async def get_all(cls, db: AsyncSession) -> List[T]:
        result = await db.execute(select(cls))
        return result.scalars().all()
        
    @classmethod
    async def filter(cls, db: AsyncSession, skip: int = 0, limit: int = 10, **filters) -> List[T]:
        query = select(cls).filter_by(**filters)
        # for attr, value in filters.items():
        #     query = query.filter(getattr(cls, attr) == value)
        result = await db.execute(query.offset(skip).limit(limit))
        return result.scalars().all()

    async def update(self, db: AsyncSession, commit: bool = True, attr_names: list = None, **kwargs) -> T:
        for attr, value in kwargs.items():
            setattr(self, attr, value)
        if commit:
            try:
                await db.commit()
                await db.refresh(self)
                if attr_names is not None:
                    await db.refresh(self, attr_names)
            except SQLAlchemyError as e:
                await db.rollback()
                raise
        return self
    
    async def save(self, db: AsyncSession, commit: bool = True) -> T:
        try:
            db.add(self)
        except:
            await db.rollback()
            raise

        if commit:
            await db.commit()

        return self

    async def delete(self, db: AsyncSession, commit: bool = True) -> bool:
        """Remove the record from the database."""
        try:
            await db.delete(self)
            return commit and (await db.commit())
        except:
            raise

    async def close_session(self, db: AsyncSession):
        return await db.close()

    def to_dict(self) -> dict:
        """Convert model instance to dictionary, handling relationships and excluding unserializable fields as necessary."""
        return {c.key: getattr(self, c.key) for c in self.__table__.columns if c.key not in ['deleted_at']}
    
class Model(CRUDMixin, Base):
    __abstract__ = True
    
    id = Column(String, primary_key=True, default=generate_uuid)
    created_at = Column(DateTime, default=func.now(), index=True)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), index=True)
    deleted_at = Column(DateTime, nullable=True, index=True)
    
    @declared_attr
    def __tablename__(cls):
        if '__tablename__' in cls.__dict__:
            return cls.__dict__['__tablename__']
        return pascal_to_snake(cls.__name__)