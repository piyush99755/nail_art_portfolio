from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine,SessionLocal #used to import database from current package
from sqlalchemy import text
from . import models
from .routes import nail_art, auth, appointments, webhook,services
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from .core.limiter import limiter
from slowapi.middleware import SlowAPIMiddleware
from .models import Service


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
app.include_router(services.router)


#create table automatically 
models.Base.metadata.create_all(bind=engine)


app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware) # apply rate limiting middleware

#temporary seed default services
def seed_services():
    db = SessionLocal()
    
    if not db.query(Service).first():
        db.add_all([
            Service(name="Bridal", price=12000),
            Service(name="Gel Extension", price=6000),
            Service(name="Minimal Art", price=4000),
            Service(name="Custom Design", price=8000),
            
        ])
        db.commit()
        db.close()
        
seed_services()
        
        
@app.get("/")
def read_root():
    return {"message: Nail Art Portfolio API running!!!"}

@app.get("/test-db")
def test_db():
    #open temporary connection to PostgreSQL
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {"db_status":"Connected"}
    
@app.get("")

    
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request, exc):
    return JSONResponse(
        status_code=429,
        content = {"detail": "Too many requests, Please try again later."},
    )
    