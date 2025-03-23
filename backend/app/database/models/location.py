from sqlalchemy import Column, String, ForeignKey, Boolean, Float, Integer, JSON
from sqlalchemy.orm import relationship

from app.database.models.base import Model


class Location(Model):
    """Location model for geo-targeting campaigns."""
    
    name = Column(String, nullable=False)
    address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=True)
    postal_code = Column(String, nullable=True)
    
    # Geo coordinates
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    radius = Column(Float, nullable=False, default=100.0)  # in meters
    
    # Organization
    organization_id = Column(String, ForeignKey("organization.id"), nullable=False)
    
    # Beacon information
    beacon_uuid = Column(String, nullable=True)
    beacon_major = Column(Integer, nullable=True)
    beacon_minor = Column(Integer, nullable=True)
    
    # Additional data
    hours_of_operation = Column(JSON, nullable=True)
    contact_info = Column(JSON, nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Relationships
    organization = relationship("Organization", back_populates="locations")
    campaigns = relationship("Campaign", back_populates="location")