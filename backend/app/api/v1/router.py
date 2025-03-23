from fastapi import APIRouter

from . import (
    auth,
    users,
    organizations,
    wallet_pass_templates,
    wallet_passes,
    customers,
    campaigns,
    locations,
)

api_router = APIRouter()

# Auth endpoints
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])

# User management
api_router.include_router(users.router, prefix="/users", tags=["users"])

# Organization management
api_router.include_router(
    organizations.router, prefix="/organizations", tags=["organizations"]
)

# Pass template management
api_router.include_router(
    wallet_pass_templates.router, prefix="/templates", tags=["pass templates"]
)

# Pass management
api_router.include_router(wallet_passes.router, prefix="/passes", tags=["passes"])

# Customer management
api_router.include_router(customers.router, prefix="/customers", tags=["customers"])

# Campaign management
api_router.include_router(campaigns.router, prefix="/campaigns", tags=["campaigns"])

# Location management
api_router.include_router(locations.router, prefix="/locations", tags=["locations"])