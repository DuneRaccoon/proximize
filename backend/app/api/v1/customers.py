from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.database import get_db
from app.database.models.customer import Customer
from app.database.models.user import User
from app.database.schema.customer import (
    Customer as CustomerSchema,
    CustomerCreate,
    CustomerUpdate,
    CustomerImport,
    CustomerWithPasses,
)

router = APIRouter()


@router.get("/", response_model=List[CustomerSchema])
async def read_customers(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Retrieve customers.
    """
    if not current_user.organization_id:
        return []
    
    # Simple filtering by organization
    filters = {"organization_id": current_user.organization_id}
    
    # TODO: Implement search functionality
    
    customers = await Customer.filter(db, skip=skip, limit=limit, **filters)
    return customers


@router.post("/", response_model=CustomerSchema)
async def create_customer(
    customer_in: CustomerCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Create new customer.
    """
    if not current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User must be part of an organization",
        )
    
    # Check if customer with this email already exists in the organization
    existing_customer = await Customer.get(
        db, email=customer_in.email, organization_id=current_user.organization_id
    )
    if existing_customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A customer with this email already exists in your organization.",
        )
    
    # Override organization_id with the current user's organization
    customer_data = customer_in.model_dump()
    customer_data["organization_id"] = current_user.organization_id
    
    customer = await Customer.create(db, **customer_data)
    return customer


@router.post("/import", response_model=List[CustomerSchema])
async def import_customers(
    customers_in: CustomerImport,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Import multiple customers.
    """
    if not current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User must be part of an organization",
        )
    
    imported_customers = []
    for customer_data in customers_in.customers:
        # Skip existing customers
        existing_customer = await Customer.get(
            db, email=customer_data.email, organization_id=current_user.organization_id
        )
        if existing_customer:
            continue
        
        # Override organization_id with the current user's organization
        customer_dict = customer_data.model_dump()
        customer_dict["organization_id"] = current_user.organization_id
        
        customer = await Customer.create(db, **customer_dict)
        imported_customers.append(customer)
    
    return imported_customers


@router.get("/{customer_id}", response_model=CustomerWithPasses)
async def read_customer(
    customer_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get a specific customer by id.
    """
    customer = await Customer.get_by_id(db, customer_id)
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )
    
    # Check if user has access to this customer
    if customer.organization_id != current_user.organization_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Get customer passes
    customer_dict = customer.to_dict()
    passes = await db.execute(
        "SELECT p.* FROM pass p WHERE p.customer_id = :customer_id",
        {"customer_id": customer_id}
    )
    customer_dict["passes"] = [p.to_dict() for p in passes.scalars().all()]
    
    return customer_dict


@router.put("/{customer_id}", response_model=CustomerSchema)
async def update_customer(
    customer_id: str,
    customer_in: CustomerUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Update a customer.
    """
    customer = await Customer.get_by_id(db, customer_id)
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )
    
    # Check if user has access to this customer
    if customer.organization_id != current_user.organization_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    customer = await customer.update(
        db, **customer_in.model_dump(exclude_unset=True)
    )
    return customer


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_customer(
    customer_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    """
    Delete a customer.
    """
    customer = await Customer.get_by_id(db, customer_id)
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )
    
    # Check if user has access to this customer
    if customer.organization_id != current_user.organization_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    await customer.delete(db)


@router.post("/upload-csv", response_model=dict)
async def upload_customers_csv(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Upload a CSV file with customer data.
    """
    if not current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User must be part of an organization",
        )
    
    # In a real implementation, this would parse the CSV and import customers
    # For now, we'll just return a success message
    return {
        "message": "CSV file uploaded successfully",
        "filename": file.filename,
        "imported_count": 0,
        "skipped_count": 0,
    }