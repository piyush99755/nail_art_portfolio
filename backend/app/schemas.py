from pydantic import BaseModel
from datetime import datetime, date, time


# =========================
# Nail Art Schemas
# =========================
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
    
    #use when its not dictionary
    class Config:
        from_attributes = True
    
#==========================
#Authentication Schemas
#=========================


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    
#==========================
#Appointments Schemas
#=========================
class AppointmentCreate(BaseModel):
    client_name:str
    client_email:str
    phone:str
    service_type:str
    appointment_date:date
    appointment_time:time

class AppointmentResponse(AppointmentCreate):
    id:int
    status:str
    payment_status:str
    created_at:datetime
    
    class Config:
        from_attributes = True
        