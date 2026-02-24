from fastapi import Depends,APIRouter,HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, time, timezone
from ..database import get_db
from .. import models, schemas
from ..models import User
from ..auth_utils import get_current_user

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
    
    if appointment_datetime <= datetime.utcnow():
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

#fetch all appointments for admin dashboard
@router.get('/', response_model=list[schemas.AppointmentResponse])
def get_all_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not Authorized!!!")
    
    appointments = db.query(models.Appointment).order_by(
        models.Appointment.appointment_date).all()
    
    return appointments

#endpoint to get Booked Slots by date
@router.get('/booked-slots/{date}')
def get_booked_slot(date: str, db: Session = Depends(get_db)):
    
    try:
        selected_date = datetime.strptime(date, "%Y-%m-%d").date() #convert string into datetime object
    except:
        raise HTTPException(status_code=400, detail="Invalid date format")
    
    
    appointments = db.query(models.Appointment).filter(
        models.Appointment.appointment_date == selected_date,
        models.Appointment.status != 'cancelled'
    ).all()
    
    return [
        #list comprehension
        appt.appointment_time.strftime("%H:%M:%S") #string format time
        for appt in appointments
    ]
    