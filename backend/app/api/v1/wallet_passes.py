from typing import Any, List, Optional
import uuid
import json

from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.database import get_db
from app.database.enums import WalletPassTypes
from app.database.models.wallet_pass import WalletPass
from app.database.models.wallet_pass_template import WalletPassTemplate
from app.database.models.customer import Customer
from app.database.models.user import User
from app.settings import settings
from app.database.schema.wallet_pass import (
    WalletPass as WalletPassSchema,
    WalletPassCreate,
    WalletPassUpdate,
)

router = APIRouter()


@router.get("/", response_model=List[WalletPassSchema])
async def read_passes(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    template_id: Optional[str] = None,
    customer_id: Optional[str] = None,
    campaign_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Retrieve passes.
    """
    if not current_user.organization_id:
        return []
    
    # Filter by organization
    filters = {"organization_id": current_user.organization_id}
    
    # Additional filters
    if template_id:
        filters["template_id"] = template_id
    if customer_id:
        filters["customer_id"] = customer_id
    if campaign_id:
        filters["campaign_id"] = campaign_id
    
    passes = await WalletPass.filter(db, skip=skip, limit=limit, **filters)
    return passes


@router.post("/", response_model=WalletPassSchema)
async def create_pass(
    pass_in: WalletPassCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Create a new pass for a customer using a template.
    """
    if not current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User must be part of an organization",
        )
    
    # Check if template exists and belongs to the user's organization
    template = await WalletPassTemplate.get_by_id(db, pass_in.template_id)
    if not template or template.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found or not accessible",
        )
    
    # Check if customer exists and belongs to the user's organization
    customer = await Customer.get_by_id(db, pass_in.customer_id)
    if not customer or customer.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found or not accessible",
        )
    
    # Generate pass data
    serial_number = str(uuid.uuid4())
    authentication_token = str(uuid.uuid4()).replace("-", "")
    
    # Create pass object
    pass_data = pass_in.model_dump()
    pass_data.update({
        "organization_id": current_user.organization_id,
        "serial_number": serial_number,
        "pass_type_identifier": settings.APPLE_PASS_TYPE_IDENTIFIER,
        "authentication_token": authentication_token,
    })
    
    # Create pass in the database
    db_pass = await WalletPass.create(db, **pass_data)
    
    # In a real implementation, this would generate actual Apple/Google wallet passes
    # For now, we'll just return the database record
    
    return db_pass


@router.get("/{pass_id}", response_model=WalletPassSchema)
async def read_pass(
    pass_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get a specific pass by id.
    """
    db_pass = await WalletPass.get_by_id(db, pass_id)
    if not db_pass:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pass not found",
        )
    
    # Check if user has access to this pass
    if db_pass.organization_id != current_user.organization_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    return db_pass


@router.put("/{pass_id}", response_model=WalletPassSchema)
async def update_pass(
    pass_id: str,
    pass_in: WalletPassUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Update a pass.
    """
    db_pass = await WalletPass.get_by_id(db, pass_id)
    if not db_pass:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pass not found",
        )
    
    # Check if user has access to this pass
    if db_pass.organization_id != current_user.organization_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    db_pass = await db_pass.update(
        db, **pass_in.model_dump(exclude_unset=True)
    )
    
    # In a real implementation, this would update the actual Apple/Google wallet passes
    # For now, we'll just return the database record
    
    return db_pass


@router.delete("/{pass_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pass(
    pass_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    """
    Delete a pass.
    """
    db_pass = await WalletPass.get_by_id(db, pass_id)
    if not db_pass:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pass not found",
        )
    
    # Check if user has access to this pass
    if db_pass.organization_id != current_user.organization_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Mark pass as voided instead of deleting
    await db_pass.update(db, is_voided=True)


@router.get("/{pass_id}/download", response_class=Response)
async def download_pass(
    pass_id: str,
    pass_type: WalletPassTypes = WalletPassTypes.APPLE,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Download a pass file for Apple or Google Wallet.
    """
    db_pass = await WalletPass.get_by_id(db, pass_id)
    if not db_pass:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pass not found",
        )
    
    # In a real implementation, this would generate and return the actual pass file
    # For now, we'll just return a placeholder message
    
    if pass_type == WalletPassTypes.APPLE:
        return Response(
            content=json.dumps({"message": "This is a placeholder for an Apple Wallet pass file"}),
            media_type="application/vnd.apple.pkpass",
            headers={"Content-Disposition": f"attachment; filename=pass-{db_pass.serial_number}.pkpass"}
        )
    elif pass_type == WalletPassTypes.GOOGLE:
        return Response(
            content=json.dumps({"message": "This is a placeholder for a Google Wallet pass file"}),
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename=pass-{db_pass.serial_number}.json"}
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid pass type. Must be one of: [{', '.join([t.value for t in WalletPassTypes])}]",
        )


@router.post("/{pass_id}/redeem", response_model=WalletPassSchema)
async def redeem_pass(
    pass_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Mark a pass as redeemed.
    """
    db_pass = await WalletPass.get_by_id(db, pass_id)
    if not db_pass:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pass not found",
        )
    
    # Check if user has access to this pass
    if db_pass.organization_id != current_user.organization_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Check if pass is already redeemed
    if db_pass.is_redeemed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pass already redeemed",
        )
    
    # Update pass
    from datetime import datetime
    db_pass = await db_pass.update(db, is_redeemed=True, redeemed_at=datetime.now())
    
    return db_pass