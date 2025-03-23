from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


# Shared properties
class WalletPassBase(BaseModel):
    serial_number: Optional[str] = None
    pass_type_identifier: Optional[str] = None
    authentication_token: Optional[str] = None
    
    organization_id: Optional[str] = None
    template_id: Optional[str] = None
    customer_id: Optional[str] = None
    campaign_id: Optional[str] = None
    
    # Pass data (customized fields from template)
    pass_data: Optional[Dict[str, Any]] = {}
    
    # Status
    is_voided: Optional[bool] = False
    is_redeemed: Optional[bool] = False
    redeemed_at: Optional[datetime] = None
    
    # Apple/Google specific
    apple_pass_url: Optional[str] = None
    google_pass_url: Optional[str] = None
    apple_pass_id: Optional[str] = None
    google_pass_id: Optional[str] = None
    
    # Expiration
    expiration_date: Optional[datetime] = None
    
    # Tracking
    last_updated_tag: Optional[str] = None


# Properties to receive via API on creation
class WalletPassCreate(WalletPassBase):
    template_id: str
    customer_id: str
    pass_data: Dict[str, Any]


# Properties to receive via API on update
class WalletPassUpdate(WalletPassBase):
    pass


# Properties shared by models in DB
class WalletPassInDBBase(WalletPassBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Properties to return via API
class WalletPass(WalletPassInDBBase):
    pass


# Properties stored in DB (same as the return model in this case)
class WalletPassInDB(WalletPassInDBBase):
    pass