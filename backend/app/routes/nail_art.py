from fastapi import APIRouter, Depends, HTTPException, File, Form, UploadFile
import cloudinary.uploader
from ..cloudinary_config import cloudinary
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..auth_utils import get_current_user
from ..models import User

#all routes inside this file starts with /nail-arts
router = APIRouter(
    prefix = "/nail-arts",
    tags = ["Nail Arts"]
)
#post request for nail arts using nail art schemas
#protected route (only admin allowed to access this endpoint)
@router.post("/", response_model=schemas.NailArtResponse)
def create_nail_art(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db), #creates database session before running following function
    current_user: User = Depends(get_current_user) #get current user
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail= "Not Authorized")
    
    #prevent from uploading random files apart from .jpeg or png
    if file.content_type not in ['image/jpeg', 'image/png']:
        raise HTTPException(status_code=400, detail="Invalid Image Format!!!")
    
    
    #upload image to clodinary
    try:
        upload_result = cloudinary.uploader.upload(file.file)
        image_url = upload_result['secure_url']
    except Exception:
        raise HTTPException(status_code= 500, detail="Image upload failed")
    
        
    new_nail_art = models.NailArt(
        title=title,
        description=description,
        category=category,
        image_url=image_url
    )
    
    db.add(new_nail_art)
    db.commit()
    db.refresh(new_nail_art) #pull updated data from DB
    
    return new_nail_art

#route to fetch all nail-arts from DB
@router.get("/", response_model=list[schemas.NailArtResponse])
def get_all_nail_arts(db: Session = Depends(get_db)):
    nail_arts = db.query(models.NailArt).all()
    return nail_arts

#route to fetch particular nail-art by using its Id
@router.get("/{nail_art_id}", response_model=schemas.NailArtResponse)
def get_nail_art(nail_art_id: int, db: Session = Depends(get_db)):
    nail_art = db.query(models.NailArt).filter(
        models.NailArt.id == nail_art_id
    ).first()
    
    if not nail_art:
        raise HTTPException(status_code=404, detail="Nail Art not found!!!")
    
    return nail_art
   
#route to delete nail-art by filtering its ID 
#protected route (only admin allowed to access this endpoint)
@router.delete("/{nail_art_id}")
def delete_nail_art(nail_art_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not Authorized")
    
    nail_art = db.query(models.NailArt).filter(
        models.NailArt.id == nail_art_id
    ).first()
    
    if not nail_art:
        raise HTTPException(status_code=404, detail="Nail art not found")
    
    db.delete(nail_art)
    db.commit()
    
    return {"message": "Nail art Deleted successfully"}
    