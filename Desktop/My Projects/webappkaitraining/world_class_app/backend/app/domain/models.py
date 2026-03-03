from enum import Enum
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
import uuid

class VehicleClass(str, Enum):
    BAJAJ = "Bajaj"
    DALADALA = "Daladala"
    BODABODA = "Bodaboda"
    UNKNOWN = "Unknown"

class ClassificationResult(BaseModel):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4)
    original_filename: str
    new_filename: str
    team_no: str = "T01"
    location: str = "DSM"
    vehicle_class: VehicleClass
    primary_color: str
    confidence: int = Field(ge=0, le=100)
    reasoning: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class HealthStatus(BaseModel):
    status: str
    gemini: str
    database: str
    version: str = "2.0.0"
