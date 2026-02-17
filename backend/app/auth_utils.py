from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext #import password hashing manager
from sqlalchemy.orm import Session
from .database import get_db
from . import models
from datetime import datetime, timedelta
from jose import jwt, JWTError
import os
from dotenv import load_dotenv

#load variable from .env file
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRY_MINUTES = 60

#bcrypt One-way hash, salted automatically, very secure
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='auth/login')

def hash_password(password : str):
    return pwd_context.hash(password) #its a secure hash 

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password) #it compares password securely 

def create_access_token(data:dict):
    to_encode = data.copy()
    expire = datetime.utcnow() +timedelta(minutes=ACCESS_TOKEN_EXPIRY_MINUTES)
    to_encode.update({"exp":expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, ALGORITHM) #this signs payload using SECRET_KEY, encodes it
    return encoded_jwt

def get_current_user(
    token: str = Depends(oauth2_scheme), #getting the token automatically
    db: Session = Depends(get_db)
):
    #pre-building a 401 exception(creates reusable error)
    credential_exception = HTTPException(
        status_code= status.HTTP_401_UNAUTHORIZED,
        detail = "Could not validate credentials"
    )
    
    try:
        #decoding token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get('sub')
        if email is None:
            raise credential_exception
    except JWTError:
        raise credential_exception
    
    user = db.query(models.User).filter(
        models.User.email == email
    ).first()
    
    if not user:
        raise credential_exception
    return user
        
        
        
    
    