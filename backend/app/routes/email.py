import os
import resend

resend.api_key = os.getenv("RESEND_API_KEY")

def send_booking_email(to_email:str, appointment):
    try:
        resend.Email.send({
            "from": "onboarding@resend.dev",
            "to": to_email,
            "subject": "Booking Confirmed",
            "html": f"""
            <h2>Your appointment is confirmed!</h2>
                <p><strong>Service:</strong> {appointment.service}</p>
                <p><strong>Date:</strong> {appointment.date}</p>
                <p><strong>Time:</strong> {appointment.time}</p>
                <p>We look forward to seeing you!</p>
            """
        })
        
    except Exception as e:
        print("Email Failed:", e)