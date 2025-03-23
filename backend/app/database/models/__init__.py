from .base import Model
from .user import User
from .organisation import Organization
from .wallet_pass_template import WalletPassTemplate
from .wallet_pass import WalletPass
from .customer import Customer, customer_campaign
from .campaign import Campaign
from .location import Location

# For Alembic to find all models
__all__ = [
    "Model",
    "User",
    "Organization",
    "WalletPassTemplate",
    "WalletPass",
    "Customer",
    "Campaign",
    "Location",
]