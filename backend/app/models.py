from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from .database import Base

class NailArt(Base):
    __tablename__ = "nail_arts"
    
    id = Column(Integer, primary_key= True, index = True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(255), nullable=False)
    image_url = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone= True), server_default=func.now())
     