from sqlalchemy import Column, String, ForeignKey, Boolean, JSON, DateTime
from sqlalchemy.orm import relationship

from app.database.models.base import Model


class WalletPass(Model):
    """Individual wallet pass for a customer."""
    
    serial_number = Column(String, nullable=False, unique=True, index=True)
    pass_type_identifier = Column(String, nullable=False)
    authentication_token = Column(String, nullable=False)
    
    organization_id = Column(String, ForeignKey("organization.id"), nullable=False)
    template_id = Column(String, ForeignKey("wallet_pass_template.id"), nullable=False)
    customer_id = Column(String, ForeignKey("customer.id"), nullable=False)
    campaign_id = Column(String, ForeignKey("campaign.id"), nullable=True)
    
    # Pass data (customized fields from template)
    pass_data = Column(JSON, nullable=False, default=dict)
    
    # Status
    is_voided = Column(Boolean, default=False)
    is_redeemed = Column(Boolean, default=False)
    redeemed_at = Column(DateTime, nullable=True)
    
    # Apple/Google specific
    apple_pass_url = Column(String, nullable=True)
    google_pass_url = Column(String, nullable=True)
    apple_pass_id = Column(String, nullable=True)
    google_pass_id = Column(String, nullable=True)
    
    # Expiration
    expiration_date = Column(DateTime, nullable=True)
    
    # Tracking
    last_updated_tag = Column(String, nullable=True)
    
    # Relationships
    organization = relationship("Organization", back_populates="passes")
    template = relationship("WalletPassTemplate", back_populates="passes")
    customer = relationship("Customer", back_populates="passes")
    campaign = relationship("Campaign", back_populates="passes")