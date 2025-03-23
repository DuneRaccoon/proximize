from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.database import get_db
from app.database.models.wallet_pass_template import WalletPassTemplate
from app.database.models.user import User
from app.database.schema.wallet_pass_template import (
    WalletPassTemplate as WalletPassTemplateSchema,
    WalletPassTemplateCreate,
    WalletPassTemplateUpdate,
)

router = APIRouter()


@router.get("/", response_model=List[WalletPassTemplateSchema])
async def read_pass_templates(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Retrieve pass templates.
    """
    if not current_user.organization_id:
        return []
    
    templates = await WalletPassTemplate.filter(
        db, organization_id=current_user.organization_id, is_archived=False
    )
    return templates


@router.post("/", response_model=WalletPassTemplateSchema)
async def create_pass_template(
    template_in: WalletPassTemplateCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Create new pass template.
    """
    if not current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User must be part of an organization",
        )
    
    # Override organization_id with the current user's organization
    template_data = template_in.model_dump()
    template_data["organization_id"] = current_user.organization_id
    template_data["created_by_id"] = current_user.id
    
    template = await WalletPassTemplate.create(db, **template_data)
    return template


@router.get("/{template_id}", response_model=WalletPassTemplateSchema)
async def read_pass_template(
    template_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get a specific pass template by id.
    """
    template = await WalletPassTemplate.get_by_id(db, template_id)
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )
    
    # Check if user has access to this template
    if template.organization_id != current_user.organization_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    return template


@router.put("/{template_id}", response_model=WalletPassTemplateSchema)
async def update_pass_template(
    template_id: str,
    template_in: WalletPassTemplateUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Update a pass template.
    """
    template = await WalletPassTemplate.get_by_id(db, template_id)
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )
    
    # Check if user has access to this template
    if template.organization_id != current_user.organization_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    template = await template.update(
        db, **template_in.model_dump(exclude_unset=True)
    )
    return template


@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pass_template(
    template_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    """
    Delete a pass template.
    """
    template = await WalletPassTemplate.get_by_id(db, template_id)
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )
    
    # Check if user has access to this template
    if template.organization_id != current_user.organization_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Instead of deleting, mark as archived
    await template.update(db, is_archived=True)


@router.post("/{template_id}/upload-image", response_model=WalletPassTemplateSchema)
async def upload_template_image(
    template_id: str,
    image_type: str,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Upload an image for a pass template.
    """
    template = await WalletPassTemplate.get_by_id(db, template_id)
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )
    
    # Check if user has access to this template
    if template.organization_id != current_user.organization_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Validate image type
    valid_image_types = ["logo", "icon", "footer", "strip", "background"]
    if image_type not in valid_image_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid image type. Must be one of: {', '.join(valid_image_types)}",
        )
    
    # Save file to static folder
    import os
    import aiofiles
    from app.settings import settings
    
    # Create directory if it doesn't exist
    organization_dir = f"app/static/organizations/{template.organization_id}"
    template_dir = f"{organization_dir}/templates/{template_id}"
    os.makedirs(template_dir, exist_ok=True)
    
    # Save file
    file_extension = os.path.splitext(file.filename)[1]
    file_name = f"{image_type}{file_extension}"
    file_path = f"{template_dir}/{file_name}"
    
    async with aiofiles.open(file_path, "wb") as f:
        content = await file.read()
        await f.write(content)
    
    # Update template with new image path
    file_url = f"/static/organizations/{template.organization_id}/templates/{template_id}/{file_name}"
    update_data = {f"{image_type}_image": file_url}
    
    template = await template.update(db, **update_data)
    return template


@router.post("/{template_id}/preview", response_model=dict)
async def preview_pass_template(
    template_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Generate a preview of the pass template.
    """
    template = await WalletPassTemplate.get_by_id(db, template_id)
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )
    
    # Check if user has access to this template
    if template.organization_id != current_user.organization_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # In a real implementation, this would generate a pass preview
    # For now, we'll just return the template data
    return {
        "preview_url": f"/api/v1/templates/{template_id}/preview-image",
        "template": template.to_dict(),
    }