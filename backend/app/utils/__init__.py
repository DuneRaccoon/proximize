import uuid
import re
from typing import Any, Dict, List, Union


def generate_uuid() -> str:
    """Generate a UUID string."""
    return str(uuid.uuid4())


def pascal_to_snake(name: str) -> str:
    """Convert PascalCase to snake_case."""
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()


def convert_dict_keys_to_camel_case(data: Dict[str, Any]) -> Dict[str, Any]:
    """Convert dictionary keys from snake_case to camelCase."""
    def to_camel_case(snake_str: str) -> str:
        components = snake_str.split('_')
        return components[0] + ''.join(x.title() for x in components[1:])
    
    return {to_camel_case(key): value for key, value in data.items()}


def convert_to_dict(obj: Any) -> Union[Dict[str, Any], List[Dict[str, Any]]]:
    """Convert SQLAlchemy model instance to dictionary."""
    if isinstance(obj, list):
        return [
            convert_to_dict(item) if hasattr(item, "to_dict") else item
            for item in obj
        ]
    
    if hasattr(obj, "to_dict"):
        return obj.to_dict()
    
    return obj