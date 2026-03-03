import google.generativeai as genai
import json
import base64
from ..domain.interfaces import IAIClassifier
from ..domain.models import ClassificationResult, VehicleClass

class GeminiClassifier(IAIClassifier):
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        self.prompt = """
        You are a world-class traffic expert in Dar es Salaam, Tanzania. 
        Classify the vehicle in the image into one of these classes: Bajaj, Daladala, Bodaboda, or Unknown.
        Return ONLY a JSON object with these keys: 
        {
            "vehicle_class": "Bajaj" | "Daladala" | "Bodaboda" | "Unknown",
            "primary_color": "Blue" | "White" | "Red" | etc,
            "confidence": 0-100,
            "reasoning": "Brief explanation of why"
        }
        """

    async def classify(self, image_data: str, mime_type: str) -> dict:
        # Note: image_data is base64 string
        contents = [
            self.prompt,
            {
                "mime_type": mime_type,
                "data": image_data
            }
        ]
        
        response = self.model.generate_content(contents)
        try:
            # Extract JSON from response text
            text = response.text
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            elif "```" in text:
                text = text.split("```")[1].split("```")[0]
            
            return json.loads(text.strip())
        except Exception as e:
            return {
                "vehicle_class": "Unknown",
                "primary_color": "Unknown",
                "confidence": 0,
                "reasoning": f"Error parsing Gemini response: {str(e)}"
            }

    async def get_status(self) -> bool:
        try:
            # Simple probe
            self.model.generate_content("ping")
            return True
        except:
            return False
