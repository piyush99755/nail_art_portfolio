from fastapi import Depends,APIRouter,HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, time, timezone
from ..database import get_db
from .. import models, schemas

router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"]
)

@router.post('/', response_model=schemas.AppointmentResponse)
def create_appointment(
    appointment: schemas.AppointmentCreate,
    db: Session = Depends(get_db)
):
    appointment_time = appointment.appointment_time.replace(tzinfo=None)
    #check future date
    appointment_datetime = datetime.combine(
        appointment.appointment_date,
        appointment.appointment_time
    )
    
    if appointment_datetime <= datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Cannot book past time!!!")
    
    #working hours(10-6)
    if not (time(10,0) <= appointment_time <= time(18,0)):
        raise HTTPException(status_code=400, detail="Outside working hours")
    
    #prevent double booking
    existing = db.query(models.Appointment).filter(
        models.Appointment.appointment_date == appointment.appointment_date,
        models.Appointment.appointment_time == appointment.appointment_time,
        models.Appointment.status != 'cancelled'
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Time slot already booked!!!")
    
    #generate new booking appointment
    new_appointment =models.Appointment(
        client_name=appointment.client_name,
        client_email=appointment.client_email,
        phone=appointment.phone,
        service_type=appointment.service_type,
        appointment_date=appointment.appointment_date,
        appointment_time=appointment.appointment_time
    )
    
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    
    return new_appointment
    
    