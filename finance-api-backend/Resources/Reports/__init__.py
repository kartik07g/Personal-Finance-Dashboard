from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from core.auth_utils import get_current_user
from schemas.report import ReportRequest, ReportResponse
from typing import List
from .ReportsFront import ReportsFront

report_router = APIRouter(prefix="/backend/generate-report", tags=["Reports"])

@report_router.post("/")
def generate_report(request: ReportRequest,db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return ReportsFront().get_report_data(request, db, current_user.user_id)


