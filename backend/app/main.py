from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine #used to import database from current package
from sqlalchemy import text
from . import models
from .routes import nail_art, auth, appointments, webhook

#create application instance
app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins= origins,
    allow_credentials= True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

app.include_router(nail_art.router)
app.include_router(auth.router)
app.include_router(appointments.router)
app.include_router(webhook.router)


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
    