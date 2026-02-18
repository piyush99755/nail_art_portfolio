from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models
from ..schemas import LoginRequest
from ..auth_utils import create_access_token, verify_password 



router = APIRouter(
    prefix = "/auth",
    tags = ["Auth"]
)

@router.post('/login')
def login(
    form_data:OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)):
    #filtering users through their email and fetch correct one
    user = db.query(models.User).filter(
        models.User.username == form_data.username
        ).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Invalid Credentials!!!")
    
    #verify password by comparing plain password and hashed password
    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status=404, detail="Invalid Credentials!!!")
    
    #generating access token
    access_token = create_access_token(data={"sub":str(user.id)})
    
    #along with login return access token and its type
    return {"access_token": access_token, "token_type": "bearer"}
    
     
        
    
    
    