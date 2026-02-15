from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
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
     
class User(Base):
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key = True, index = True)
    email = Column(String(255), unique= True, index = True, nullable = False)
    password_hash = Column(String(255), nullable= False)
    is_admin = Column(Boolean, default = True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    