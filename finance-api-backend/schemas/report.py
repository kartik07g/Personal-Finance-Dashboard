from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import date

class ReportRequest(BaseModel):
    report_type: str

class ReportResponse(BaseModel):
    data: List[Any] 
