from pydantic import BaseModel
from datetime import datetime, date, time


# =========================
# Nail Art Schemas
# =========================
class NailArtBase(BaseModel):
    title: str
    description : str
    image_url : str
    

class NailArtCreate(NailArtBase):
    pass

class NailArtResponse(NailArtBase):
    id: int
    created_at: datetime
    service_id: int
    
    #use when its not dictionary
    class Config:
        from_attributes = True
    
#==========================
#Authentication Schemas
#=========================
class UserCreate(BaseModel):
    email:str
    username: str
    password:str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    
class ServiceResponse(BaseModel):
        id:int
        name:str
        price:int
        
        class config:
            from_attributes = True
    
#==========================
#Appointments Schemas
#=========================
class AppointmentCreate(BaseModel):
    client_name:str
    client_email:str
    phone:str
    service_id:int
    appointment_date:date
    appointment_time:time

class AppointmentResponse(BaseModel):
    id: int
    client_name: str
    client_email: str
    phone: str

    appointment_date: date
    appointment_time: time

    status: str
    payment_status: str
    created_at: datetime

    service: ServiceResponse 

    class Config:
        from_attributes = True
        
