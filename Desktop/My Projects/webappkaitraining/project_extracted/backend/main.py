
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import requests
import base64
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = "PASTE_YOUR_GEMINI_API_KEY_HERE"

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    image_bytes = await file.read()
    encoded_image = base64.b64encode(image_bytes).decode("utf-8")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": "Detect objects and return structured JSON with labels."},
                    {
                        "inlineData": {
                            "mimeType": file.content_type,
                            "data": encoded_image
                        }
                    }
                ]
            }
        ]
    }

    response = requests.post(url, json=payload)
    return response.json()
