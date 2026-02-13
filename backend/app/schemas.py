from pydantic import BaseModel
from datetime import datetime

class NailArtBase(BaseModel):
    title: str
    description : str
    category : str
    image_url : str

class NailArtCreate(NailArtBase):
    pass

class NailArtResponse(NailArtBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
    