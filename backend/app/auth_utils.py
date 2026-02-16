from passlib.context import CryptContext #import password hashing manager
from datetime import datetime, timedelta
from jose import jwt
import os
from dotenv import load_dotenv

#load variable from .env file
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRY_MINUTES = 60

#bcrypt One-way hash, salted automatically, very secure
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password : str):
    return pwd_context.hash(password) #its a secure hash 

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password) #it compares password securely 

def create_access_token(data:dict):
    to_encode = data.copy()
    expire = datetime.utcnow() +timedelta(minutues=ACCESS_TOKEN_EXPIRY_MINUTES)
    to_encode.update({"exp":expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, ALGORITHM) #this signs payload using SECRET_KEY, encodes it
    return encoded_jwt