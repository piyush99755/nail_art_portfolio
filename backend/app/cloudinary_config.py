import cloudinary
import os
from dotenv import load_dotenv

load_dotenv()

#this initializes cloudinary when imported
cloudinary.config(
    cloud_name= os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key= os.getenv('CLOUDINARY_API_KEY'),
    secret_key= os.getenv('CLOUDINARY_API_SECRET')
)