from typing import List
from supabase import create_client, Client
from ..domain.interfaces import IVehicleRepository
from ..domain.models import ClassificationResult

class SupabaseRepository(IVehicleRepository):
    def __init__(self, url: str, key: str):
        self.supabase: Client = create_client(url, key)

    async def save(self, result: ClassificationResult) -> ClassificationResult:
        data = result.model_dump()
        # Remove ID and created_at if they are None/default to let DB handle it if needed
        # But we use UUIDs and TIMESTAMPTZ so it's fine
        data['id'] = str(data['id'])
        data['created_at'] = data['created_at'].isoformat()
        
        response = self.supabase.table("classifications").insert(data).execute()
        return result

    async def get_all(self) -> List[ClassificationResult]:
        response = self.supabase.table("classifications").select("*").order("created_at", desc=True).execute()
        return [ClassificationResult(**item) for item in response.data]

    async def get_status(self) -> bool:
        try:
            self.supabase.table("classifications").select("id", count="exact").limit(1).execute()
            return True
        except:
            return False
