from schemas.report import ReportRequest, ReportResponse
from .ReportsService import ReportsService
from .ReportsServiceInterface import ReportsServiceInterface
from sqlalchemy.orm import Session
from datetime import date
from typing import List

class ReportsFront:
    def __init__(self):
        self.report_service : ReportsServiceInterface = ReportsService()
    
    def get_report_data(self, request, db, user_id):
        return self.report_service.get_report_data(request.report_type, db, user_id)