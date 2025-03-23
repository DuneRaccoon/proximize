from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field


# Field definition
class WalletPassField(BaseModel):
    key: str
    label: str
    value: str
    type: Optional[str] = "text"  # text, number, date, currency
    format: Optional[str] = None
    is_relative: Optional[bool] = False
    text_alignment: Optional[str] = "left"  # left, center, right


# Location beacon definition
class LocationBeacon(BaseModel):
    latitude: float
    longitude: float
    major: Optional[int] = None
    minor: Optional[int] = None
    relevant_text: Optional[str] = None
    radius: Optional[float] = 100  # in meters


# Shared properties
class WalletPassTemplateBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    pass_type: Optional[str] = "generic"
    organization_id: Optional[str] = None
    
    # Template design settings
    design: Optional[Dict[str, Any]] = {}
    
    # Template colors
    background_color: Optional[str] = None
    foreground_color: Optional[str] = None
    label_color: Optional[str] = None
    
    # Template images (paths or URLs)
    logo_image: Optional[str] = None
    icon_image: Optional[str] = None
    footer_image: Optional[str] = None
    strip_image: Optional[str] = None
    background_image: Optional[str] = None
    
    # Pass structure (fields configuration)
    header_fields: Optional[List[WalletPassField]] = []
    primary_fields: Optional[List[WalletPassField]] = []
    secondary_fields: Optional[List[WalletPassField]] = []
    auxiliary_fields: Optional[List[WalletPassField]] = []
    back_fields: Optional[List[WalletPassField]] = []
    
    # NFC configuration
    nfc_enabled: Optional[bool] = False
    nfc_message: Optional[str] = None
    
    # Location beacons
    locations: Optional[List[LocationBeacon]] = []
    
    # Smart pass features
    expiration_type: Optional[str] = None
    expiration_value: Optional[str] = None
    
    # Status
    is_active: Optional[bool] = True
    is_archived: Optional[bool] = False


# Properties to receive via API on creation
class WalletPassTemplateCreate(WalletPassTemplateBase):
    name: str
    pass_type: str
    organization_id: str


# Properties to receive via API on update
class WalletPassTemplateUpdate(WalletPassTemplateBase):
    pass


# Properties shared by models in DB
class WalletPassTemplateInDBBase(WalletPassTemplateBase):
    id: str
    created_at: datetime
    updated_at: datetime
    created_by_id: str

    class Config:
        from_attributes = True


# Properties to return via API
class WalletPassTemplate(WalletPassTemplateInDBBase):
    pass


# Properties stored in DB (same as the return model in this case)
class WalletPassTemplateInDB(WalletPassTemplateInDBBase):
    pass