from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field


# Targeting criteria
class TargetingCriteria(BaseModel):
    tags: Optional[List[str]] = None
    custom_fields: Optional[Dict[str, Any]] = None
    geo_location: Optional[Dict[str, Any]] = None
    pass_type: Optional[str] = None
    engagement_status: Optional[str] = None


# Shared properties
class CampaignBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    
    # Organization
    organization_id: Optional[str] = None
    
    # Campaign type and settings
    campaign_type: Optional[str] = "standard"
    template_id: Optional[str] = None
    
    # Standard campaign settings
    content: Optional[str] = None
    notification_message: Optional[str] = None
    
    # Geo campaign settings
    is_geo_enabled: Optional[bool] = False
    geo_radius: Optional[float] = None
    geo_latitude: Optional[float] = None
    geo_longitude: Optional[float] = None
    geo_trigger_message: Optional[str] = None
    location_id: Optional[str] = None
    
    # Targeting settings
    targeting_criteria: Optional[TargetingCriteria] = None
    
    # Scheduling
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_recurring: Optional[bool] = False
    recurrence_pattern: Optional[str] = None
    
    # Status
    status: Optional[str] = "draft"
    is_active: Optional[bool] = False


# Properties to receive via API on creation
class CampaignCreate(CampaignBase):
    name: str
    organization_id: str
    campaign_type: str


# Properties to receive via API on update
class CampaignUpdate(CampaignBase):
    pass


# Properties shared by models in DB
class CampaignInDBBase(CampaignBase):
    id: str
    created_at: datetime
    updated_at: datetime
    created_by_id: str
    
    # Stats
    send_count: int = 0
    open_count: int = 0
    conversion_count: int = 0

    class Config:
        from_attributes = True


# Properties to return via API
class Campaign(CampaignInDBBase):
    pass


# Properties stored in DB (same as the return model in this case)
class CampaignInDB(CampaignInDBBase):
    pass


# Campaign with related data
class CampaignWithCustomers(Campaign):
    customers: List[Dict[str, Any]] = []
    

# Campaign execution request
class CampaignExecute(BaseModel):
    campaign_id: str
    test_mode: Optional[bool] = False
    customer_ids: Optional[List[str]] = None