from sqlalchemy import Boolean, Column, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database.models.base import Model


class User(Model):
    """User model for authentication and authorization."""
    
    email = Column(String, index=True, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    organization_id = Column(String, ForeignKey("organization.id"), nullable=True)
    
    # Relationships
    organization = relationship("Organization", back_populates="users")
    pass_templates = relationship("WalletPassTemplate", back_populates="created_by")
    campaigns = relationship("Campaign", back_populates="created_by")