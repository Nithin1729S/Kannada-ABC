import base64
import cv2
import os
from dotenv import load_dotenv
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import traceback
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

# MongoDB Configuration
MONGODB_URI = os.getenv("MONGODB_URI")  
DATABASE_NAME = os.getenv("DATABASE_NAME")
COLLECTION_NAME = "users"

client = AsyncIOMotorClient(MONGODB_URI)
db = client[DATABASE_NAME]
users_collection = db[COLLECTION_NAME]

# Pydantic model to parse the incoming JSON payload
class ImageRequest(BaseModel):
    image: str  # Expected to be a data URL (base64 encoded JPEG)
    letterdata: int  # Add letterdata field
    email: str  # Add email field


app = FastAPI()

# Allow requests from the frontend running at localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "OK"}

# Load your pre-trained TensorFlow model
model_save_path = "model/full_model.h5"
loaded_model = tf.keras.models.load_model(model_save_path)
print("Loaded model from", model_save_path)

# Define class names (ensure they match the ones used during training)
class_names = [
    '1', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '2', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
    '3', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
    '4', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
    '5', '6', '7', '8', '9'
]

@app.post("/api/recognize")
async def recognize_alphabet(request: ImageRequest = Body(...)):
    try:
        image_b64 = request.image
        letterdata = request.letterdata
        email = request.email

        # Remove header if the data URL includes it, e.g. "data:image/jpeg;base64,"
        if "," in image_b64:
            _, image_b64 = image_b64.split(",", 1)

        # Decode base64 string into bytes
        image_bytes = base64.b64decode(image_b64)

        # Convert bytes into a NumPy array and then decode into a grayscale image
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image data")

        # Resize image to 28x28 pixels (matching your model's expected input)
        img_resized = cv2.resize(img, (28, 28))

        # Convert the image to a tensor, add a batch dimension
        img_array = tf.keras.preprocessing.image.img_to_array(img_resized)
        img_array = np.expand_dims(img_array, axis=0)

        # Perform prediction using the loaded model
        prediction = loaded_model.predict(img_array)
        predicted_label = class_names[np.argmax(prediction)]

        is_correct = int(predicted_label) == int(letterdata)

        # Construct the field name dynamically
        letter_field = f"letter_score_{letterdata}"

        update_query = {
            "$inc": {
                f"{letter_field}.attempted": 1,  # Always increment attempts
            }
        }

        if is_correct:
            update_query["$inc"][f"{letter_field}.correct"] = 1  # Increment correct only if correct

        result = await users_collection.update_one({"email": email}, update_query)

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")

        # Return the predicted label as JSON
        return {"prediction": predicted_label}
    except Exception as e:
        print(traceback.format_exc())  # Print full error stack trace
        raise HTTPException(status_code=500, detail=str(e))