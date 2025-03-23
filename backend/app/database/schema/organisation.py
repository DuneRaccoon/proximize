from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from app.database.enums import (
    SubscriptionTier,
    SubscriptionStatus
)


# Shared properties
class OrganizationBase(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None
    website: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    is_active: Optional[bool] = True
    subscription_tier: Optional[SubscriptionTier] = SubscriptionTier.FREE
    subscription_status: Optional[SubscriptionStatus] = SubscriptionStatus.PENDING
    max_passes: Optional[int] = 100
    settings: Optional[Dict[str, Any]] = {}


# Properties to receive via API on creation
class OrganizationCreate(OrganizationBase):
    name: str
    slug: str
    contact_email: EmailStr


# Properties to receive via API on update
class OrganizationUpdate(OrganizationBase):
    pass


# Properties shared by models in DB
class OrganizationInDBBase(OrganizationBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Properties to return via API
class Organization(OrganizationInDBBase):
    pass


# Properties stored in DB (same as the return model in this case)
class OrganizationInDB(OrganizationInDBBase):
    pass