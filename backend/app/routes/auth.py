from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models
from ..schemas import LoginRequest, TokenResponse
from ..auth_utils import create_access_token, verify_password 
from pydantic import BaseModel


router = APIRouter(
    prefix = "/auth",
    tags = ["Auth"]
)

@router.post('/login')
def login(request: LoginRequest, db: Session = Depends(get_db)):
    #filtering users through their email and fetch correct one
    user = db.query(models.User).filter(
        models.User.email == request.email
        ).first()
    
    if not user:
        raise HTTPException(status_code=404, details="Invalid Credentials!!!")
    
    #verify password by comparing plain password and hashed password
    if not verify_password(request.password, user.password_hash):
        raise HTTPException(status=404, details="Invalid Credentials!!!")
    
    #generating access token
    access_token = create_access_token(data={"sub":user.email})
    
    return {"access_token": access_token, "token_type": "bearer"}
    
     
        
    
    
    