from sqlalchemy import Column, String, ForeignKey, Boolean, DateTime, JSON, Table
from sqlalchemy.orm import relationship

from app.database.models.base import Model


# Many-to-many association table for customers and campaigns
customer_campaign = Table(
    "customer_campaign",
    Model.metadata,
    Column("customer_id", String, ForeignKey("customer.id"), primary_key=True),
    Column("campaign_id", String, ForeignKey("campaign.id"), primary_key=True),
)


class Customer(Model):
    """Customer model representing end-users who receive passes."""
    
    email = Column(String, nullable=False, index=True)
    phone = Column(String, nullable=True, index=True)
    full_name = Column(String, nullable=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    
    # Organization relationship
    organization_id = Column(String, ForeignKey("organization.id"), nullable=False)
    
    # Contact preferences
    email_opt_in = Column(Boolean, default=True)
    sms_opt_in = Column(Boolean, default=True)
    push_opt_in = Column(Boolean, default=True)
    
    # Customer properties
    tags = Column(JSON, nullable=True)
    custom_fields = Column(JSON, nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    last_engagement = Column(DateTime, nullable=True)
    
    # Location data for geo-targeting
    last_known_latitude = Column(String, nullable=True)
    last_known_longitude = Column(String, nullable=True)
    last_location_update = Column(DateTime, nullable=True)
    
    # Device information
    device_info = Column(JSON, nullable=True)
    
    # Relationships
    organization = relationship("Organization", back_populates="customers")
    wallet_passes = relationship("WalletPass", back_populates="customer")
    campaigns = relationship("Campaign", secondary=customer_campaign, back_populates="customers")