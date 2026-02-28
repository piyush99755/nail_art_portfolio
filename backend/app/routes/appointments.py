from fastapi import Depends,APIRouter,HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.orm import Session
from datetime import datetime, time, timezone
from ..database import get_db
from .. import models, schemas
from ..models import User
from ..auth_utils import get_current_user
import stripe
from ..stripe_config import stripe
from ..core.limiter import limiter

router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"]
)

@router.post('/', response_model=schemas.AppointmentResponse)
@limiter.limit("5/minute")
def create_appointment(
    request:Request,
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
    

#endpoint for create-payment-intent stripe functionaity
@router.post('/{appointment_id}/create-payment-intent')
def create_payment_intent(
    appointment_id: int,
    db: Session = Depends(get_db)
):
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found!!!")
    
    # prevent double payment
    if appointment.payment_status == 'paid':
        raise HTTPException(status_code=400, detail="Already paid!!!")
    
    #example
    amount = 5000 #$50.00
    
    #create payment intent object
    intent = stripe.PaymentIntent.create(
        amount = amount,
        currency = "cad",
        metadata = {
            "appointment_id": appointment.id
        }
    )
    
    appointment.stripe_payment_intent_id = intent.id
    db.commit()
    
    #return client secret required by frontend
    return {
        "client_secret": intent.client_secret
    }