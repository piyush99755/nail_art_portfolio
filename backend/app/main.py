from fastapi import FastAPI
from .database import engine #used to import database from current package
from sqlalchemy import text
from . import models

#create application instance
app = FastAPI()

#create table automatically 
models.Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message: Nail Art Portfolio API running!!!"}

@app.get("/test-db")
def test_db():
    #open temporary connection to PostgreSQL
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {"db_status":"Connected"}
    