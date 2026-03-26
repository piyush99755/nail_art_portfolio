import os
import stripe
from fastapi import Depends, APIRouter, HTTPException, Request, BackgroundTasks
from ..database import SessionLocal
from .. import models
from dotenv import load_dotenv
from app.routes.email import send_booking_email

load_dotenv()

router = APIRouter()

endpoint_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

@router.post('/webhook')
async def stripe_webook(
    request: Request,
    background_tasks: BackgroundTasks
):
    payload = await request.body()
    signature_header = request.headers.get("stripe-signature")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, signature_header, endpoint_secret
        )
        
    except Exception:
        raise HTTPException(status_code= 400, detail="Invalid webhook signature")
    
    #handle successful payment
    if event["type"] == "checkout.session.completed" :
        session = event["data"]["object"]
        
        appointment_id = session.get("metadata", {}).get("appointment_id")
        
        if not appointment_id:
            print("No appointment_id in metadata")
            return {"status": "no appointment id"}
        
        db = SessionLocal()
        
        appointment = db.query(models.Appointment).filter(
            models.Appointment.id == int(appointment_id)
        ).first()
        
        if appointment:
            appointment.status = "confirmed"
            appointment.payment_status = "paid"
            db.commit()
            
            # SEND EMAIL
            background_tasks.add_task(
                send_booking_email,
                appointment.client_email, 
                appointment
            )
            
        db.close()
        
    return {"status": "success"}
    
 