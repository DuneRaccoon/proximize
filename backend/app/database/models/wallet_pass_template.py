from sqlalchemy import Column, String, JSON, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship

from app.database.models.base import Model


class WalletPassTemplate(Model):
    """Template for wallet passes that can be used to create individual passes."""
    
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    pass_type = Column(String, nullable=False, default="generic")  # generic, coupon, eventTicket, boardingPass, storeCard
    organization_id = Column(String, ForeignKey("organization.id"), nullable=False)
    created_by_id = Column(String, ForeignKey("user.id"), nullable=False)
    
    # Template design settings
    design = Column(JSON, nullable=False, default=dict)
    
    # Template colors
    background_color = Column(String, nullable=True)
    foreground_color = Column(String, nullable=True)
    label_color = Column(String, nullable=True)
    
    # Template images (paths or URLs)
    logo_image = Column(String, nullable=True)
    icon_image = Column(String, nullable=True)
    footer_image = Column(String, nullable=True)
    strip_image = Column(String, nullable=True)
    background_image = Column(String, nullable=True)
    
    # Pass structure (fields configuration)
    header_fields = Column(JSON, nullable=True)
    primary_fields = Column(JSON, nullable=True)
    secondary_fields = Column(JSON, nullable=True)
    auxiliary_fields = Column(JSON, nullable=True)
    back_fields = Column(JSON, nullable=True)
    
    # NFC configuration
    nfc_enabled = Column(Boolean, default=False)
    nfc_message = Column(Text, nullable=True)
    
    # Location beacons
    locations = Column(JSON, nullable=True)
    
    # Smart pass features
    expiration_type = Column(String, nullable=True)  # none, fixed, relative
    expiration_value = Column(String, nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_archived = Column(Boolean, default=False)
    
    # Relationships
    organization = relationship("Organization", back_populates="pass_templates")
    created_by = relationship("User", back_populates="pass_templates")
    passes = relationship("Pass", back_populates="template")