from abc import ABC, abstractmethod
from typing import List
from .models import ClassificationResult, HealthStatus

class IAIClassifier(ABC):
    @abstractmethod
    async def classify(self, image_data: str, mime_type: str) -> ClassificationResult:
        pass

    @abstractmethod
    async def get_status(self) -> bool:
        pass

class IVehicleRepository(ABC):
    @abstractmethod
    async def save(self, result: ClassificationResult) -> ClassificationResult:
        pass

    @abstractmethod
    async def get_all(self) -> List[ClassificationResult]:
        pass

    @abstractmethod
    async def get_status(self) -> bool:
        pass
