from sqlalchemy import Column, String, ForeignKey, Boolean, DateTime, JSON, Integer, Float, Text
from sqlalchemy.orm import relationship

from app.database.models.base import Model
from app.database.models.customer import customer_campaign


class Campaign(Model):
    """Campaign model for promotional activities and geo-targeting."""
    
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    
    # Organization and creator
    organization_id = Column(String, ForeignKey("organization.id"), nullable=False)
    created_by_id = Column(String, ForeignKey("user.id"), nullable=False)
    
    # Campaign type and settings
    campaign_type = Column(String, nullable=False, default="standard")  # standard, geo, event, promo
    template_id = Column(String, ForeignKey("wallet_pass_template.id"), nullable=True)
    
    # Standard campaign settings
    content = Column(Text, nullable=True)
    notification_message = Column(String, nullable=True)
    
    # Geo campaign settings
    is_geo_enabled = Column(Boolean, default=False)
    geo_radius = Column(Float, nullable=True)  # in meters
    geo_latitude = Column(Float, nullable=True)
    geo_longitude = Column(Float, nullable=True)
    geo_trigger_message = Column(String, nullable=True)
    location_id = Column(String, ForeignKey("location.id"), nullable=True)
    
    # Targeting settings
    targeting_criteria = Column(JSON, nullable=True)
    
    # Scheduling
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    is_recurring = Column(Boolean, default=False)
    recurrence_pattern = Column(String, nullable=True)  # daily, weekly, monthly
    
    # Status
    status = Column(String, default="draft")  # draft, scheduled, active, paused, completed, cancelled
    is_active = Column(Boolean, default=False)
    
    # Stats
    send_count = Column(Integer, default=0)
    open_count = Column(Integer, default=0)
    conversion_count = Column(Integer, default=0)
    
    # Relationships
    organization = relationship("Organization", back_populates="campaigns")
    created_by = relationship("User", back_populates="campaigns")
    template = relationship("WalletPassTemplate", foreign_keys=[template_id])
    location = relationship("Location", back_populates="campaigns")
    customers = relationship("Customer", secondary=customer_campaign, back_populates="campaigns")
    passes = relationship("WalletPass", back_populates="campaign")