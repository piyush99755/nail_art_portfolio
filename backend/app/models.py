from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Date, Time
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
    username = Column(String(255), unique= True, index= True, nullable= False)
    email = Column(String(255), unique= True, index = True, nullable = False)
    password_hash = Column(String(255), nullable= False)
    is_admin = Column(Boolean, default = True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
class Appointment(Base):
    
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key = True, index = True, nullable = False)
    client_name = Column(String(255), nullable=False)
    client_email = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    
    service_type= Column(String(100), nullable=False)
    
    appointment_date = Column(Date, nullable=False)
    appointment_time = Column(Time, nullable=False)
    
    status = Column(String(50), default="pending")
    payment_status = Column(String(50), default="pending")
    
    created_at = Column(DateTime(timezone=True), server_default= func.now())