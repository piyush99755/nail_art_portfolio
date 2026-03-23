from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import or_
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models
from ..auth_utils import create_access_token, verify_password, hash_password 
from ..schemas import UserCreate



router = APIRouter(
    prefix = "/auth",
    tags = ["Auth"]
)

#route to register user
@router.post('/register')
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    hashed_password = hash_password(user_data.password)
    
    existing_user = db.query(models.User).filter(
        (models.User.email == user_data.email) |
        (models.User.username == user_data.username)
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    user = models.User(
        email=user_data.email,
        username=user_data.username,
        password_hash=hashed_password
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user
    

@router.post('/login')
def login(
    form_data:OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)):
    #filtering users through their email and fetch correct one
    user = db.query(models.User).filter(
        or_(
            models.User.username == form_data.username,
            models.User.email == form_data.username
            
        )
        
        ).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid Credentials!!!")
    
    #verify password by comparing plain password and hashed password
    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status=401, detail="Invalid Credentials!!!")
    
    #generating access token
    access_token = create_access_token(data={"sub":str(user.id)})
    
    #along with login return access token and its type
    return {"access_token": access_token, "token_type": "bearer"}
    
     
        
    
    
    