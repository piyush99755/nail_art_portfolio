from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix = "/nail-arts",
    tags = ["Nail Arts"]
)

@router.post("/", response_model=schemas.NailArtResponse)
def create_nail_art(
    nail_art:schemas.NailArtCreate,
    db: Session = Depends(get_db)
):
    new_nail_art = models.NailArt(
        title=nail_art.title,
        description=nail_art.description,
        category=nail_art.category,
        image_url=nail_art.image_url
    )
    
    db.add(new_nail_art)
    db.commit()
    db.refresh(new_nail_art)
    
    return new_nail_art

@router.get("/", response_model=list[schemas.NailArtResponse])
def get_all_nail_arts(db: Session = Depends(get_db)):
    nail_arts = db.query(models.NailArt).all()
    return nail_arts

@router.get("/{nail_art_id}", response_model=schemas.NailArtResponse)
def get_nail_art(nail_art_id: int, db: Session = Depends(get_db)):
    nail_art = db.query(models.NailArt).filter(
        models.NailArt.id == nail_art_id
    ).first()
    
    if not nail_art:
        raise HTTPException(status_code=404, detail="Nail Art not found!!!")
    
    return nail_art
    
@router.delete("/{nail_art_id}")
def delete_nail_art(nail_art_id: int, db: Session = Depends(get_db)):
    nail_art = db.query(models.NailArt).filter(
        models.NailArt.id == nail_art_id
    ).first()
    
    if not nail_art:
        raise HTTPException(status_code=404, detail="Nail art not found")
    
    db.delete(nail_art)
    db.commit()
    
    return {"message": "Nail art Deleted successfully"}
    