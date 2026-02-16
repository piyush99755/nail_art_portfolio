from fastapi import FastAPI
from .database import engine #used to import database from current package
from sqlalchemy import text
from . import models
from .routes import nail_art, auth

#create application instance
app = FastAPI()

app.include_router(nail_art.router)
app.include_router(auth.router)

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
    