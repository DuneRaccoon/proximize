from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


# Shared properties
class CustomerBase(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    full_name: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    
    organization_id: Optional[str] = None
    
    # Contact preferences
    email_opt_in: Optional[bool] = True
    sms_opt_in: Optional[bool] = True
    push_opt_in: Optional[bool] = True
    
    # Customer properties
    tags: Optional[List[str]] = []
    custom_fields: Optional[Dict[str, Any]] = {}
    
    # Status
    is_active: Optional[bool] = True
    
    # Location data for geo-targeting
    last_known_latitude: Optional[str] = None
    last_known_longitude: Optional[str] = None


# Properties to receive via API on creation
class CustomerCreate(CustomerBase):
    email: EmailStr
    organization_id: str


# Properties to receive via API on update
class CustomerUpdate(CustomerBase):
    pass


# Properties for import/bulk creation
class CustomerImport(BaseModel):
    customers: List[CustomerCreate]


# Properties shared by models in DB
class CustomerInDBBase(CustomerBase):
    id: str
    created_at: datetime
    updated_at: datetime
    last_engagement: Optional[datetime] = None
    last_location_update: Optional[datetime] = None
    device_info: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


# Properties to return via API
class Customer(CustomerInDBBase):
    pass


# Properties stored in DB (same as the return model in this case)
class CustomerInDB(CustomerInDBBase):
    pass


# Customer with passes
class CustomerWithPasses(Customer):
    passes: List[Dict[str, Any]] = []