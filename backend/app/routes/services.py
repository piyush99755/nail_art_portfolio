from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session
from .. import models
from ..database import get_db

router = APIRouter(
    prefix="/services",
    tags=['Services'],
)

@router.get('/')
def get_all_service(
    db: Session = Depends(get_db)
):
    return db.query(models.Service).all()