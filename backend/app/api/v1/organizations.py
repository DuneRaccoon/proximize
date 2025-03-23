from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user, get_current_active_superuser
from app.database import get_db
from app.database.models.organisation import Organization
from app.database.models.user import User
from app.database.schema.organisation import (
    Organization as OrganizationSchema,
    OrganizationCreate,
    OrganizationUpdate,
)

router = APIRouter()


@router.get("/", response_model=List[OrganizationSchema])
async def read_organizations(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Retrieve organizations.
    """
    if current_user.is_superuser:
        organizations = await Organization.get_all(db)
    else:
        # Normal users can only see their own organization
        if current_user.organization_id:
            organizations = [await Organization.get_by_id(db, current_user.organization_id)]
        else:
            organizations = []
    
    return organizations


@router.post("/", response_model=OrganizationSchema)
async def create_organization(
    organization_in: OrganizationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Create new organization.
    """
    # Check if slug is already used
    org = await Organization.get(db, slug=organization_in.slug)
    if org:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An organization with this slug already exists.",
        )
    
    # Only superusers or users without an organization can create new organizations
    if not current_user.is_superuser and current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are already part of an organization.",
        )
    
    organization = await Organization.create(db, **organization_in.model_dump())
    
    # Assign the user to the new organization if they don't have one
    if not current_user.is_superuser and not current_user.organization_id:
        await current_user.update(db, organization_id=organization.id)
    
    return organization


@router.get("/my-organization", response_model=OrganizationSchema)
async def read_my_organization(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get current user's organization.
    """
    if not current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User is not part of any organization",
        )
    
    organization = await Organization.get_by_id(db, current_user.organization_id)
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )
    
    return organization


@router.get("/{organization_id}", response_model=OrganizationSchema)
async def read_organization(
    organization_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get a specific organization by id.
    """
    # Normal users can only access their own organization
    if not current_user.is_superuser and current_user.organization_id != organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    organization = await Organization.get_by_id(db, organization_id)
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )
    
    return organization


@router.put("/{organization_id}", response_model=OrganizationSchema)
async def update_organization(
    organization_id: str,
    organization_in: OrganizationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Update an organization.
    """
    # Normal users can only update their own organization
    if not current_user.is_superuser and current_user.organization_id != organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    organization = await Organization.get_by_id(db, organization_id)
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )
    
    # Check if slug is changed and already used by another organization
    if organization_in.slug and organization_in.slug != organization.slug:
        existing_org = await Organization.get(db, slug=organization_in.slug)
        if existing_org and existing_org.id != organization_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An organization with this slug already exists.",
            )
    
    organization = await organization.update(
        db, **organization_in.model_dump(exclude_unset=True)
    )
    return organization