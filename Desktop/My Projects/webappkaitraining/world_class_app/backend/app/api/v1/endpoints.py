from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
import base64
from ...domain.models import ClassificationResult, HealthStatus, VehicleClass
from ...domain.interfaces import IAIClassifier, IVehicleRepository
from ...services.gemini_service import GeminiClassifier
from ...repositories.supabase_repo import SupabaseRepository
from ...config import settings

router = APIRouter(prefix="/api/v1")

# Dependency Injection helpers
def get_classifier() -> IAIClassifier:
    return GeminiClassifier(api_key=settings.GEMINI_API_KEY)

def get_repository() -> IVehicleRepository:
    return SupabaseRepository(url=settings.SUPABASE_URL, key=settings.SUPABASE_KEY)

@router.post("/classify", response_model=ClassificationResult)
async def classify_vehicle(
    file: UploadFile = File(...),
    classifier: IAIClassifier = Depends(get_classifier),
    repo: IVehicleRepository = Depends(get_repository)
):
    try:
        image_bytes = await file.read()
        encoded_image = base64.b64encode(image_bytes).decode("utf-8")
        
        # 1. AI Classification
        raw_result = await classifier.classify(encoded_image, file.content_type)
        
        # 2. Build Domain Entity
        result = ClassificationResult(
            original_filename=file.filename,
            new_filename=f"dsm_{file.filename}",
            vehicle_class=raw_result.get("vehicle_class", VehicleClass.UNKNOWN),
            primary_color=raw_result.get("primary_color", "Unknown"),
            confidence=raw_result.get("confidence", 0),
            reasoning=raw_result.get("reasoning", "")
        )
        
        # 3. Persistence
        await repo.save(result)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health", response_model=HealthStatus)
async def health_check(
    classifier: IAIClassifier = Depends(get_classifier),
    repo: IVehicleRepository = Depends(get_repository)
):
    return HealthStatus(
        status="ok",
        gemini="✅ Connected" if await classifier.get_status() else "❌ Disconnected",
        database="✅ Connected" if await repo.get_status() else "❌ Disconnected"
    )

@router.get("/history")
async def get_history(repo: IVehicleRepository = Depends(get_repository)):
    return await repo.get_all()
