import os
import stripe
from fastapi import Depends, APIRouter, HTTPException, Request
from ..database import SessionLocal
from .. import models
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

endpoint_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

@router.post('/webhook/stripe')
async def stripe_webook(
    request: Request
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
    if event["type"] == "payment_intent.succeeded" :
        payment_intent = event["data"]["object"]
        
        appointment_id = payment_intent["metadata"].get("appointment_id")
        
        db = SessionLocal()
        
        appointment = db.query(models.Appointment).filter(
            models.Appointment.id == int(appointment_id)
        ).first()
        
        if appointment:
            appointment.status = "confirmed"
            appointment.payment_status = "paid"
            db.commit()
            
        db.close()
        
    return {"status": "success"}
    
 