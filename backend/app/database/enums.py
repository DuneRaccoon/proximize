from enum import Enum

class SubscriptionTier(str, Enum):
    FREE = 'free'
    BASIC = 'basic'
    PREMIUM = 'premium'
    
class SubscriptionStatus(str, Enum):
    ACTIVE = 'active'
    INACTIVE = 'inactive'
    CANCELLED = 'cancelled'
    PENDING = 'pending'
    
class WalletPassType(str, Enum):
    APPLE = 'apple'
    GOOGLE = 'google'
    SAMSUNG = 'samsung'