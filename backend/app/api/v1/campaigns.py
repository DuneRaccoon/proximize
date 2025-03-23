from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.database import get_db
from app.database.models.campaign import Campaign
from app.database.models.customer import Customer
from app.database.models.location import Location
from app.database.models.wallet_pass_template import WalletPassTemplate
from app.database.models.user import User
from app.database.schema.campaign import (
    Campaign as CampaignSchema,
    CampaignCreate,
    CampaignUpdate,
    CampaignExecute,
    CampaignWithCustomers,
)

router = APIRouter()


@router.get("/", response_model=List[CampaignSchema])
async def read_campaigns(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    campaign_type: Optional[str] = None,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Retrieve campaigns.
    """
    if not current_user.organization_id:
        return []
    
    # Filter by organization
    filters = {"organization_id": current_user.organization_id}
    
    # Additional filters
    if status:
        filters["status"] = status
    if campaign_type:
        filters["campaign_type"] = campaign_type
    
    campaigns = await Campaign.filter(db, skip=skip, limit=limit, **filters)
    return campaigns


@router.post("/", response_model=CampaignSchema)
async def create_campaign(
    campaign_in: CampaignCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Create new campaign.
    """
    if not current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User must be part of an organization",
        )
    
    # For geo campaigns, validate location
    if campaign_in.is_geo_enabled and campaign_in.location_id:
        location = await Location.get_by_id(db, campaign_in.location_id)
        if not location or location.organization_id != current_user.organization_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Location not found or not accessible",
            )
    
    # If template is specified, validate it
    if campaign_in.template_id:
        template = await WalletPassTemplate.get_by_id(db, campaign_in.template_id)
        if not template or template.organization_id != current_user.organization_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Template not found or not accessible",
            )
    
    # Override organization_id with the current user's organization
    campaign_data = campaign_in.model_dump()
    campaign_data["organization_id"] = current_user.organization_id
    campaign_data["created_by_id"] = current_user.id
    
    campaign = await Campaign.create(db, **campaign_data)
    return campaign


@router.get("/{campaign_id}", response_model=CampaignWithCustomers)
async def read_campaign(
    campaign_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get a specific campaign by id.
    """
    campaign = await Campaign.get_by_id(db, campaign_id)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found",
        )
    
    # Check if user has access to this campaign
    if campaign.organization_id != current_user.organization_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Get campaign customers
    campaign_dict = campaign.to_dict()
    
    # In a real implementation, this would retrieve the customers from the association table
    # For now, we'll just return an empty list
    campaign_dict["customers"] = []
    
    return campaign_dict


@router.put("/{campaign_id}", response_model=CampaignSchema)
async def update_campaign(
    campaign_id: str,
    campaign_in: CampaignUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Update a campaign.
    """
    campaign = await Campaign.get_by_id(db, campaign_id)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found",
        )
    
    # Check if user has access to this campaign
    if campaign.organization_id != current_user.organization_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # For geo campaigns, validate location
    if campaign_in.is_geo_enabled and campaign_in.location_id:
        location = await Location.get_by_id(db, campaign_in.location_id)
        if not location or location.organization_id != current_user.organization_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Location not found or not accessible",
            )
    
    # If template is specified, validate it
    if campaign_in.template_id:
        template = await WalletPassTemplate.get_by_id(db, campaign_in.template_id)
        if not template or template.organization_id != current_user.organization_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Template not found or not accessible",
            )
    
    campaign = await campaign.update(
        db, **campaign_in.model_dump(exclude_unset=True)
    )
    return campaign


@router.delete("/{campaign_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_campaign(
    campaign_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    """
    Delete a campaign.
    """
    campaign = await Campaign.get_by_id(db, campaign_id)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found",
        )
    
    # Check if user has access to this campaign
    if campaign.organization_id != current_user.organization_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Update status instead of deleting
    await campaign.update(db, status="cancelled", is_active=False)


@router.post("/{campaign_id}/execute", response_model=dict)
async def execute_campaign(
    campaign_id: str,
    execution: CampaignExecute,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Execute a campaign to send passes to customers.
    """
    campaign = await Campaign.get_by_id(db, campaign_id)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found",
        )
    
    # Check if user has access to this campaign
    if campaign.organization_id != current_user.organization_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Check if campaign is active
    if campaign.status not in ["draft", "scheduled", "active"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Campaign is in {campaign.status} status and cannot be executed",
        )
    
    # In a real implementation, this would:
    # 1. Find customers based on targeting criteria or specific customer_ids
    # 2. Create passes for customers without one
    # 3. Send notifications
    # 4. Update campaign status and counts
    
    # For now, we'll just update the status and return a success message
    if not execution.test_mode:
        await campaign.update(db, status="active", is_active=True)
    
    return {
        "message": "Campaign execution started",
        "test_mode": execution.test_mode,
        "campaign_id": campaign_id,
        "targeted_customers": 0,  # Would be the actual count in a real implementation
    }


@router.post("/{campaign_id}/add-customers", response_model=dict)
async def add_customers_to_campaign(
    campaign_id: str,
    customer_ids: List[str],
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Add specific customers to a campaign.
    """
    campaign = await Campaign.get_by_id(db, campaign_id)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found",
        )
    
    # Check if user has access to this campaign
    if campaign.organization_id != current_user.organization_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Validate customers
    valid_customer_ids = []
    for customer_id in customer_ids:
        customer = await Customer.get_by_id(db, customer_id)
        if customer and customer.organization_id == current_user.organization_id:
            valid_customer_ids.append(customer_id)
    
    # In a real implementation, this would add customers to the campaign's customer list
    # For now, we'll just return a success message
    
    return {
        "message": "Customers added to campaign",
        "campaign_id": campaign_id,
        "added_customers": len(valid_customer_ids),
    }