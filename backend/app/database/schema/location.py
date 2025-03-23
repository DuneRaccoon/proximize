from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


# Hours of operation
class HoursOfOperation(BaseModel):
    monday: Optional[str] = None
    tuesday: Optional[str] = None
    wednesday: Optional[str] = None
    thursday: Optional[str] = None
    friday: Optional[str] = None
    saturday: Optional[str] = None
    sunday: Optional[str] = None


# Contact information
class ContactInfo(BaseModel):
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None


# Shared properties
class LocationBase(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    
    # Geo coordinates
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    radius: Optional[float] = 100.0  # in meters
    
    # Organization
    organization_id: Optional[str] = None
    
    # Beacon information
    beacon_uuid: Optional[str] = None
    beacon_major: Optional[int] = None
    beacon_minor: Optional[int] = None
    
    # Additional data
    hours_of_operation: Optional[HoursOfOperation] = None
    contact_info: Optional[ContactInfo] = None
    
    # Status
    is_active: Optional[bool] = True


# Properties to receive via API on creation
class LocationCreate(LocationBase):
    name: str
    latitude: float
    longitude: float
    organization_id: str


# Properties to receive via API on update
class LocationUpdate(LocationBase):
    pass


# Properties shared by models in DB
class LocationInDBBase(LocationBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Properties to return via API
class Location(LocationInDBBase):
    pass


# Properties stored in DB (same as the return model in this case)
class LocationInDB(LocationInDBBase):
    pass