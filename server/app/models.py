from pydantic import BaseModel
from typing import Optional

class ClerkUserCreate(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    image_url: Optional[str] = None

class ClerkUserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    image_url: Optional[str] = None
