from sqlalchemy import Column, String, Boolean, Integer, JSON
from sqlalchemy.orm import relationship

from app.database.models.base import Model


class Organization(Model):
    """Organization model representing businesses using the platform."""
    
    name = Column(String, nullable=False, index=True)
    slug = Column(String, unique=True, nullable=False, index=True)
    description = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)
    website = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=True)
    postal_code = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    subscription_tier = Column(String, default="free")
    subscription_status = Column(String, default="active")
    max_passes = Column(Integer, default=100)
    settings = Column(JSON, default=dict)
    
    # Relationships
    users = relationship("User", back_populates="organization")
    pass_templates = relationship("WalletPassTemplate", back_populates="organization")
    passes = relationship("WalletPass", back_populates="organization")
    customers = relationship("Customer", back_populates="organization")
    campaigns = relationship("Campaign", back_populates="organization")
    locations = relationship("Location", back_populates="organization")