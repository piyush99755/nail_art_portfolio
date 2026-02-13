from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

#import env variables at first
load_dotenv()

#fetching variable from .env file
DATABASE_URL = os.getenv('DATABASE_URL')

#creating main connection manager between python and postgresql
engine = create_engine(DATABASE_URL)

#create database sessions
SessionLocal = sessionmaker(
    autoflush=False,
    autocommit=False,
    bind=engine
)
#it is a base class for all models
Base = declarative_base()
