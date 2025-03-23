from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.database import get_db
from app.database.models.location import Location
from app.database.models.user import User
from app.database.schema.location import (
    Location as LocationSchema,
    LocationCreate,
    LocationUpdate,
)

router = APIRouter()


@router.get("/", response_model=List[LocationSchema])
async def read_locations(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Retrieve locations.
    """
    if not current_user.organization_id:
        return []
    
    # Filter by organization
    filters = {"organization_id": current_user.organization_id}
    
    locations = await Location.filter(db, skip=skip, limit=limit, **filters)
    return locations


@router.post("/", response_model=LocationSchema)
async def create_location(
    location_in: LocationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Create new location.
    """
    if not current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User must be part of an organization",
        )
    
    # Override organization_id with the current user's organization
    location_data = location_in.model_dump()
    location_data["organization_id"] = current_user.organization_id
    
    location = await Location.create(db, **location_data)
    return location


@router.get("/{location_id}", response_model=LocationSchema)
async def read_location(
    location_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get a specific location by id.
    """
    location = await Location.get_by_id(db, location_id)
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found",
        )
    
    # Check if user has access to this location
    if location.organization_id != current_user.organization_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    return location


@router.put("/{location_id}", response_model=LocationSchema)
async def update_location(
    location_id: str,
    location_in: LocationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Update a location.
    """
    location = await Location.get_by_id(db, location_id)
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found",
        )
    
    # Check if user has access to this location
    if location.organization_id != current_user.organization_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    location = await location.update(
        db, **location_in.model_dump(exclude_unset=True)
    )
    return location


@router.delete("/{location_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_location(
    location_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    """
    Delete a location.
    """
    location = await Location.get_by_id(db, location_id)
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found",
        )
    
    # Check if user has access to this location
    if location.organization_id != current_user.organization_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Check if location is used by any campaigns
    from app.database.models.campaign import Campaign
    campaign = await Campaign.get(db, location_id=location_id)
    if campaign:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete location that is used by campaigns",
        )
    
    await location.delete(db)


@router.get("/nearby/{latitude}/{longitude}", response_model=List[LocationSchema])
async def find_nearby_locations(
    latitude: float,
    longitude: float,
    radius: Optional[float] = 1000.0,  # 1km default radius
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Find locations near the specified coordinates.
    """
    if not current_user.organization_id:
        return []
    
    # In a real implementation, this would use a proper geospatial query
    # For now, we'll just return all locations for the organization
    filters = {"organization_id": current_user.organization_id}
    
    locations = await Location.filter(db, **filters)
    
    # Filter locations by distance (simplified calculation)
    # In a real app, you'd use proper geospatial calculations
    from math import cos, radians
    
    nearby_locations = []
    for location in locations:
        # Simple approximation (not accurate for long distances)
        dx = 111.3 * cos(radians((latitude + location.latitude) / 2)) * (longitude - location.longitude)
        dy = 111.3 * (latitude - location.latitude)
        distance = (dx * dx + dy * dy) ** 0.5 * 1000  # Convert to meters
        
        if distance <= radius:
            nearby_locations.append(location)
    
    return nearby_locations