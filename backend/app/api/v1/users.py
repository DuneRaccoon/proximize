from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user, get_current_active_superuser
from app.database import get_db
from app.database.models.user import User
from app.database.schema.user import User as UserSchema, UserCreate, UserUpdate

router = APIRouter()


@router.get("/me", response_model=UserSchema)
async def read_user_me(
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get current user.
    """
    return current_user


@router.put("/me", response_model=UserSchema)
async def update_user_me(
    user_in: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Update own user.
    """
    user = await current_user.update(db, **user_in.model_dump(exclude_unset=True))
    return user


@router.get("/{user_id}", response_model=UserSchema)
async def read_user_by_id(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get a specific user by id.
    """
    user = await User.get_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Only allow admins or users from the same organization to access other users
    if not current_user.is_superuser and (
        not user.organization_id or 
        user.organization_id != current_user.organization_id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    return user


@router.get("/", response_model=List[UserSchema])
async def read_users(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Retrieve users.
    """
    users = await User.get_all(db)
    return users


@router.post("/", response_model=UserSchema)
async def create_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Create new user.
    """
    user = await User.get(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user with this email already exists in the system.",
        )
    
    from app.api.v1.auth import get_password_hash
    
    user_in_data = user_in.model_dump(exclude={"password"})
    user_in_data["hashed_password"] = get_password_hash(user_in.password)
    user = await User.create(db, **user_in_data)
    return user


@router.put("/{user_id}", response_model=UserSchema)
async def update_user(
    user_id: str,
    user_in: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Update a user.
    """
    user = await User.get_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    update_data = user_in.model_dump(exclude_unset=True)
    if "password" in update_data and update_data["password"]:
        from app.api.v1.auth import get_password_hash
        
        hashed_password = get_password_hash(update_data["password"])
        del update_data["password"]
        update_data["hashed_password"] = hashed_password
    
    user = await user.update(db, **update_data)
    return user